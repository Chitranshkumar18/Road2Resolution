import os
import gc
import base64
import binascii
from contextlib import asynccontextmanager
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from model_loader import ModelManager
from inference import validate_and_load_image, run_two_stage_inference

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Lightweight initialization (models are lazy-loaded on first request to fit within 512MB RAM)
    print("[AIModelService] Initializing Road2Solution AI Service (Memory-Optimized Lazy Loading Mode)...")
    manager = ModelManager.get_instance()
    try:
        s1_path, s2_path = manager._find_checkpoint_paths()
        print(f"[AIModelService] Verified model checkpoints on filesystem:\n  Stage 1: {s1_path}\n  Stage 2: {s2_path}")
    except Exception as e:
        print(f"[AIModelService] Checkpoint discovery notice: {e}")
    print("[AIModelService] AI Service is ready to accept requests.")
    yield
    # Shutdown
    print("[AIModelService] Shutting down AI Service.")

app = FastAPI(
    title="Road2Solution AI Inference Service",
    description="Dedicated PyTorch inference microservice for Two-Stage Civic Issue Classification (512MB RAM Optimized)",
    version="1.0.0",
    lifespan=lifespan
)

# Allow local CORS requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictJsonRequest(BaseModel):
    image: Optional[str] = None
    imageUrl: Optional[str] = None
    categoryHint: Optional[str] = None

@app.get("/health")
def health_check():
    manager = ModelManager.get_instance()
    return {
        "status": "healthy",
        "service": "Road2Solution-AIModelService",
        "stage1_loaded": manager.stage1_model is not None,
        "stage2_loaded": manager.stage2_model is not None,
        "device": str(manager.device),
        "stage1_classes": manager.stage1_classes,
        "stage2_classes": manager.stage2_classes,
        "civic_threshold": manager.civic_threshold
    }

def decode_image_bytes(data_str: str) -> bytes:
    """Decodes data URI (data:image/...;base64,...) or raw base64 string to bytes."""
    if not data_str:
        raise ValueError("No image data provided.")
    
    if "," in data_str:
        # Strip header like data:image/jpeg;base64,
        data_str = data_str.split(",", 1)[1]
    
    try:
        return base64.b64decode(data_str)
    except (binascii.Error, ValueError) as e:
        raise ValueError(f"Invalid base64 image data: {str(e)}")

@app.post("/predict")
async def predict(
    image: Optional[UploadFile] = File(None),
    image_data: Optional[str] = Form(None),
    categoryHint: Optional[str] = Form(None)
):
    """
    Accepts an uploaded image file or base64 string and runs the two-stage PyTorch model.
    """
    raw_bytes = None

    if image is not None:
        raw_bytes = await image.read()
    elif image_data:
        try:
            raw_bytes = decode_image_bytes(image_data)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
    else:
        raise HTTPException(status_code=400, detail="No image provided. Upload a file or pass base64 image data.")

    if not raw_bytes or len(raw_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty image data received.")

    try:
        pil_image = validate_and_load_image(raw_bytes)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image parsing error: {str(e)}")
    finally:
        del raw_bytes

    try:
        result = run_two_stage_inference(pil_image)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference execution failed: {str(e)}")
    finally:
        del pil_image
        gc.collect()

@app.post("/predict-json")
async def predict_json(payload: PredictJsonRequest):
    """
    JSON endpoint accepting base64 image string or data URI.
    """
    raw_str = payload.image or payload.imageUrl
    if not raw_str:
        raise HTTPException(status_code=400, detail="Must provide 'image' or 'imageUrl' with base64 data.")

    try:
        raw_bytes = decode_image_bytes(raw_str)
        del raw_str
        pil_image = validate_and_load_image(raw_bytes)
        del raw_bytes
        result = run_two_stage_inference(pil_image)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference execution failed: {str(e)}")
    finally:
        if 'pil_image' in locals():
            del pil_image
        gc.collect()

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
