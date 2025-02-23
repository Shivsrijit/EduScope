# ml_model/yolo_model.py
import torch
from ultralytics import YOLO
import cv2
import numpy as np

class YOLOObjectDetector:
    def __init__(self, model_path='yolov8n.pt'):
        """Initialize YOLO model for object detection"""
        self.model = YOLO(model_path)
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        print(f"Using device: {self.device}")

    def detect_objects(self, image):
        """
        Detect objects in an image
        Args:
            image: numpy array (BGR format) or path to image
        Returns:
            list: Detected objects with class, confidence, and coordinates
        """
        results = self.model(image)
        return self._process_results(results[0])

    def _process_results(self, result):
        """Process YOLO results into a structured format"""
        detected_objects = []
        
        for box in result.boxes:
            obj = {
                'class': result.names[int(box.cls[0])],
                'confidence': float(box.conf[0]),
                'bbox': box.xyxy[0].cpu().numpy().tolist(),
                'center': box.xywh[0].cpu().numpy().tolist()[:2]
            }
            detected_objects.append(obj)
            
        return {
            'objects': detected_objects,
            'categories': self._categorize_objects(detected_objects)
        }

    def _categorize_objects(self, objects):
        """Categorize detected objects into educational domains"""
        categories = {
            'art_supplies': [],
            'electronics': [],
            'lab_equipment': [],
            'educational_materials': [],
            'other': []
        }
        
        # Define category mappings
        category_mapping = {
            'pencil': 'art_supplies',
            'pen': 'art_supplies',
            'book': 'educational_materials',
            'laptop': 'electronics',
            'bottle': 'lab_equipment',
            # Add more mappings as needed
        }
        
        for obj in objects:
            category = category_mapping.get(obj['class'], 'other')
            categories[category].append(obj)
            
        return categories