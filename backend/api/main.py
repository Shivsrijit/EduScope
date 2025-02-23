# backend/api/main.py
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import cv2
import json

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from ml_model.yolo_model import YOLOObjectDetector
from ml_model.content_generator import ContentGenerator
from ml_model.advanced_features import AdvancedAIFeatures, AIGameMaster, InteractiveTutor
from utils.gamification import GamificationSystem

app = FastAPI(title="EduScope API")

gemini_api_key = os.getenv("GEMINI_API_KEY")


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8501"],  # Streamlit default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI components
detector = YOLOObjectDetector()
content_generator = ContentGenerator(api_key=gemini_api_key)
advanced_ai = AdvancedAIFeatures()
game_master = AIGameMaster()
tutor = InteractiveTutor()
gamification = GamificationSystem()

class DetectionResponse(BaseModel):
    objects: List[dict]
    categories: dict
    learning_content: dict

@app.post("/detect/image", response_model=DetectionResponse)
async def detect_image(file: UploadFile = File(...)):
    """Process uploaded image and generate learning content"""
    try:
        # Read and process image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Detect objects
        detections = detector.detect_objects(image)
        
        # Generate learning content
        content = content_generator.generate_learning_content(detections, image)
        
        return {
            "objects": detections["objects"],
            "categories": detections["categories"],
            "learning_content": content
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/learning-style")
async def analyze_learning_style(user_data: dict):
    """Analyze user's learning style"""
    try:
        analysis = advanced_ai.analyze_learning_style(user_data)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/challenge")
async def generate_challenge(topic: str, materials: dict):
    """Generate educational challenge"""
    try:
        challenge = game_master.create_educational_challenge(topic, materials)
        return challenge
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tutor/hints")
async def get_hints(question: str, context: str, num_hints: int = 3):
    """Get progressive hints for a question"""
    try:
        hints = tutor.provide_hints(question, context, num_hints)
        return hints
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# More API endpoints...