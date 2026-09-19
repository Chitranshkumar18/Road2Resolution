import io
from PIL import Image
import torch
import torch.nn.functional as F
from torchvision import transforms
from model_loader import ModelManager

# Standard ImageNet preprocessing matching model_handoff.json
PREPROCESS_TRANSFORM = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

def validate_and_load_image(image_bytes: bytes) -> Image.Image:
    """
    Validates that the provided bytes represent a valid image,
    converts it to RGB mode, and returns a PIL Image.
    """
    if not image_bytes or len(image_bytes) == 0:
        raise ValueError("Empty image data provided.")

    try:
        image = Image.open(io.BytesIO(image_bytes))
        image.load()
    except Exception as e:
        raise ValueError(f"Invalid image format or corrupted image file: {str(e)}")

    if image.mode != "RGB":
        image = image.convert("RGB")

    return image

def run_two_stage_inference(image: Image.Image) -> dict:
    """
    Executes the two-stage PyTorch inference pipeline:
    Stage 1: Civic vs Non-Civic filter (threshold >= 0.625)
    Stage 2: 4-class civic issue classifier (garbage, illegal_dumping, pothole, water_drainage)
    """
    manager = ModelManager.get_instance()
    stage1_model = manager.get_stage1_model()
    stage2_model = manager.get_stage2_model()

    # Preprocess image
    tensor = PREPROCESS_TRANSFORM(image).unsqueeze(0).to(manager.device)

    # 1. Stage 1 Inference
    with torch.no_grad():
        stage1_output = stage1_model(tensor)
        stage1_probs = F.softmax(stage1_output, dim=1)[0]
        civic_prob = float(stage1_probs[0].item())
        non_civic_prob = float(stage1_probs[1].item())

    # Civic threshold test
    civic_threshold = manager.civic_threshold
    stage1_passed = bool(civic_prob >= civic_threshold)

    if not stage1_passed:
        # Non-civic rejection
        return {
            "is_civic": False,
            "category": "non_civic",
            "predicted_class": "non_civic",
            "confidence": round(non_civic_prob * 100, 2),
            "stage1": {
                "civic_probability": round(civic_prob, 4),
                "non_civic_probability": round(non_civic_prob, 4),
                "civic_threshold": civic_threshold,
                "passed": False
            },
            "stage2": None,
            "message": "Image classified as non-civic. Please capture a clear photograph of a civic infrastructure defect."
        }

    # 2. Stage 2 Inference (Civic Category Classification)
    with torch.no_grad():
        stage2_output = stage2_model(tensor)
        stage2_probs = F.softmax(stage2_output, dim=1)[0]

    # Map class predictions
    probabilities = {}
    for idx, prob in enumerate(stage2_probs):
        class_name = manager.stage2_classes.get(idx, manager.stage2_classes.get(str(idx), f"class_{idx}"))
        probabilities[class_name] = round(float(prob.item()) * 100, 2)

    pred_idx = int(torch.argmax(stage2_probs).item())
    predicted_class = manager.stage2_classes.get(pred_idx, manager.stage2_classes.get(str(pred_idx), f"class_{pred_idx}"))
    confidence = probabilities[predicted_class]

    return {
        "is_civic": True,
        "category": predicted_class,
        "predicted_class": predicted_class,
        "confidence": confidence,
        "stage1": {
            "civic_probability": round(civic_prob, 4),
            "non_civic_probability": round(non_civic_prob, 4),
            "civic_threshold": civic_threshold,
            "passed": True
        },
        "stage2": {
            "probabilities": probabilities,
            "predicted_class": predicted_class,
            "confidence": confidence
        },
        "message": f"Civic anomaly detected: {predicted_class} (Confidence: {confidence}%)"
    }
