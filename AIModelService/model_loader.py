import os
import torch
import torch.nn as nn
import torchvision.models as models

STAGE1_CLASSES = {
    0: "civic",
    1: "non_civic"
}

STAGE2_CLASSES = {
    0: "garbage",
    1: "illegal_dumping",
    2: "pothole",
    3: "water_drainage"
}

CIVIC_THRESHOLD = 0.625

class ModelManager:
    _instance = None

    def __init__(self):
        self.device = torch.device("cpu")
        self.stage1_model = None
        self.stage2_model = None
        self.stage1_classes = STAGE1_CLASSES
        self.stage2_classes = STAGE2_CLASSES
        self.civic_threshold = CIVIC_THRESHOLD
        self.is_loaded = False

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = ModelManager()
        return cls._instance

    def _find_checkpoint_paths(self):
        # Candidate directories for model checkpoints across different deployment structures
        base_dir = os.path.dirname(os.path.abspath(__file__))
        cwd = os.getcwd()
        repo_root = os.path.abspath(os.path.join(base_dir, ".."))

        candidate_dirs = [
            os.environ.get("MODEL_DIR", ""),
            os.path.join(base_dir, "models"),
            os.path.join(base_dir, "AI", "models"),
            os.path.join(base_dir, "..", "AI", "models"),
            os.path.join(base_dir, "..", "models"),
            os.path.join(repo_root, "AI", "models"),
            os.path.join(repo_root, "models"),
            os.path.join(cwd, "AI", "models"),
            os.path.join(cwd, "models"),
            os.path.join(cwd, "AIModelService", "models"),
        ]

        stage1_file = "stage1_clutter_lr1e-6_epoch1.pth"
        stage2_file = "road2solution_stage2_resnet18_best_epoch4.pth"

        stage1_path = None
        stage2_path = None

        for c_dir in candidate_dirs:
            if not c_dir:
                continue
            s1 = os.path.join(c_dir, stage1_file)
            s2 = os.path.join(c_dir, stage2_file)
            if os.path.isfile(s1) and stage1_path is None:
                stage1_path = os.path.abspath(s1)
            if os.path.isfile(s2) and stage2_path is None:
                stage2_path = os.path.abspath(s2)

        if not stage1_path or not stage2_path:
            raise FileNotFoundError(
                f"Could not locate model checkpoints. Checked: {candidate_dirs}. "
                f"Found Stage 1: {stage1_path}, Stage 2: {stage2_path}"
            )

        return stage1_path, stage2_path

    def load_models(self):
        if self.is_loaded:
            return

        stage1_path, stage2_path = self._find_checkpoint_paths()
        print(f"[ModelLoader] Loading Stage 1 model from: {stage1_path}")
        print(f"[ModelLoader] Loading Stage 2 model from: {stage2_path}")

        # 1. Build Stage 1 ResNet18 (2 classes: civic vs non_civic)
        m1 = models.resnet18(weights=None)
        m1.fc = nn.Sequential(
            nn.Dropout(0.2),
            nn.Linear(512, 2)
        )
        s1_raw = torch.load(stage1_path, map_location=self.device, weights_only=False)
        s1_sd = s1_raw["state_dict"] if isinstance(s1_raw, dict) and "state_dict" in s1_raw else s1_raw
        m1.load_state_dict(s1_sd)
        m1.to(self.device)
        m1.eval()
        self.stage1_model = m1

        # 2. Build Stage 2 ResNet18 (4 classes: garbage, illegal_dumping, pothole, water_drainage)
        m2 = models.resnet18(weights=None)
        m2.fc = nn.Linear(512, 4)
        s2_raw = torch.load(stage2_path, map_location=self.device, weights_only=False)
        if isinstance(s2_raw, dict) and "model_state_dict" in s2_raw:
            s2_sd = s2_raw["model_state_dict"]
            if "idx_to_class" in s2_raw:
                self.stage2_classes = s2_raw["idx_to_class"]
        else:
            s2_sd = s2_raw

        m2.load_state_dict(s2_sd)
        m2.to(self.device)
        m2.eval()
        self.stage2_model = m2

        self.is_loaded = True
        print("[ModelLoader] All models loaded successfully in eval mode on CPU.")

    def get_stage1_model(self):
        if not self.is_loaded:
            self.load_models()
        return self.stage1_model

    def get_stage2_model(self):
        if not self.is_loaded:
            self.load_models()
        return self.stage2_model
