from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import cv2
import os
from dotenv import load_dotenv

load_dotenv()

from ml_model.yolo_model import YOLOObjectDetector
from ml_model.content_generator import ContentGenerator
from ml_model.advanced_features import AdvancedAIFeatures, AIGameMaster, InteractiveTutor
from utils.gamification import GamificationSystem

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("⚠️ ERROR: GEMINI_API_KEY is missing! Set it in .env")

app = FastAPI(title="EduScope API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8501"],  # Streamlit default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI components
detector = YOLOObjectDetector()
content_generator = ContentGenerator(api_key=GEMINI_API_KEY)  # ✅ Fixed initialization
advanced_ai = AdvancedAIFeatures()
game_master = AIGameMaster()
tutor = InteractiveTutor()
gamification = GamificationSystem()

class TutorRequest(BaseModel):
    concept: str
    user_level: int
    learning_style: Optional[dict] = None

class DetectionResponse(BaseModel):
    objects: List[dict]
    categories: dict
    learning_content: dict

class ProjectRequest(BaseModel):
    components: List[str]
    difficulty: str
    team_size: Optional[int] = 1

class CollaborationRoom(BaseModel):
    room_id: str
    project_id: str
    team_members: List[str]

class LearningStyleRequest(BaseModel):
    user_interactions: list
    
@app.post("/analyze/learning-style")
async def analyze_learning_style(request: LearningStyleRequest):
    """Analyze user's learning style based on interactions"""
    try:
        # Analyze learning style using AI
        learning_style = advanced_ai.analyze_learning_style(request.user_interactions)
        return learning_style
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/detect/image")
async def detect_image(file: UploadFile = File(...)):
    """Process uploaded image, detect objects, and generate learning content"""
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if image is None:
            raise ValueError("Uploaded image could not be decoded.")

        image = cv2.fastNlMeansDenoisingColored(image, None, 10, 10, 7, 21)  # Denoise
        
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
        cl = clahe.apply(l)
        enhanced = cv2.merge((cl,a,b))
        image = cv2.cvtColor(enhanced, cv2.COLOR_LAB2BGR)
        
        # Adjust brightness and contrast
        alpha = 1.2  # Contrast control
        beta = 10    # Brightness control
        image = cv2.convertScaleAbs(image, alpha=alpha, beta=beta)

        print(f"✅ Image processed. Shape: {image.shape}")

        # Detect objects
        detections = detector.detect_objects(image)
        print(f"📢 Detections: {detections}")

        content = content_generator.generate_learning_content(detections)
        print(f"📢 AI Generated Content: {content}")

        return {
            "objects": detections["objects"], 
            "categories": detections["categories"], 
            "learning_content": content
        }

    except Exception as e:
        print(f"⚠️ Error in image processing: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tutor/explain")
async def tutor_explain(request: TutorRequest):
    """Generate AI-based explanation for a given topic"""
    try:
        if not request.concept:
            raise ValueError("No topic provided")

        print(f"📢 AI Explanation Request: {request.concept}")

        # Call AI tutor's explanation function
        response = tutor.generate_explanation(request.concept, request.user_level, request.learning_style)

        return response

    except Exception as e:
        print(f"⚠️ Error in explanation generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Add project suggestion endpoint
class ProjectComponentsRequest(BaseModel):
    components: list
    difficulty: str
    team_size: int = 1

@app.post("/projects/suggest")
async def suggest_projects(request: ProjectComponentsRequest):
    """Suggest projects based on detected components"""
    try:
        print(f"📢 Project suggestion request: {request}")
        suggestions = content_generator.generate_project_suggestions(
            components=request.components,
            difficulty=request.difficulty,
            team_size=request.team_size
        )
        
        if not suggestions:
            print("⚠️ No project suggestions generated")
            return []
            
        print(f"✅ Generated {len(suggestions)} project suggestions")
        return suggestions
        
    except Exception as e:
        print(f"⚠️ Error in project suggestions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/collaboration/create")
async def create_collaboration_room(room: CollaborationRoom):
    """Create a new collaboration room"""
    try:
        # Create collaboration room logic
        return {"room_id": room.room_id, "status": "created"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/leaderboard")
async def get_leaderboard():
    """Get global leaderboard"""
    try:
        # Fetch leaderboard data
        return gamification.get_leaderboard()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/content/generate")
async def generate_content(request: dict):
    """Generate learning content based on components or detections"""
    try:
        print(f"📢 Content request: {request}")
        
        if request.get("type") == "learning":
            # Generate only learning content
            detection_data = {
                "objects": [{"class": comp} for comp in request["components"]]
            }
            return content_generator.generate_learning_content(detection_data)
            
        elif request.get("type") == "projects":
            # Generate only project suggestions
            return {
                "project_suggestions": content_generator.generate_project_suggestions(
                    components=request["components"],
                    difficulty=request.get("difficulty", "Beginner"),
                    team_size=request.get("team_size", 1)
                )
            }
            
        else:
            # Generate both (but might be slower)
            detection_data = {
                "objects": [{"class": comp} for comp in request["components"]]
            }
            content = content_generator.generate_learning_content(detection_data)
            
            if "project_suggestions" in content:
                for project in content["project_suggestions"]:
                    project["difficulty"] = request.get("difficulty", "Beginner")
                    project["team_size"] = request.get("team_size", 1)
            
            return content

    except Exception as e:
        print(f"⚠️ Content Generation Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
