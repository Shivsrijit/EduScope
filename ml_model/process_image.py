# ml_model/process_image.py
import cv2
import numpy as np
from PIL import Image
import io

class ImageProcessor:
    def __init__(self):
        """Initialize image processor with default parameters"""
        self.target_size = (640, 640)  # Default size for YOLO
        
    def preprocess_image(self, image_data, source_type='bytes'):
        """
        Preprocess image for model input
        Args:
            image_data: Image as bytes, PIL Image, or numpy array
            source_type: Type of input ('bytes', 'PIL', 'numpy')
        Returns:
            numpy array: Processed image
        """
        if source_type == 'bytes':
            return self._process_bytes(image_data)
        elif source_type == 'PIL':
            return self._process_pil(image_data)
        elif source_type == 'numpy':
            return self._process_numpy(image_data)
        else:
            raise ValueError(f"Unsupported source type: {source_type}")

    def _process_bytes(self, image_bytes):
        """Process image from bytes"""
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return self._standardize_image(img)

    def _process_pil(self, pil_image):
        """Process PIL Image"""
        img = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
        return self._standardize_image(img)

    def _process_numpy(self, np_image):
        """Process numpy array"""
        return self._standardize_image(np_image)

    def _standardize_image(self, image):
        """Standardize image for model input"""
        # Resize while maintaining aspect ratio
        height, width = image.shape[:2]
        scaling_factor = min(self.target_size[0]/width, self.target_size[1]/height)
        new_width = int(width * scaling_factor)
        new_height = int(height * scaling_factor)
        
        resized = cv2.resize(image, (new_width, new_height))
        
        # Create canvas of target size
        canvas = np.zeros((self.target_size[1], self.target_size[0], 3), dtype=np.uint8)
        
        # Center image on canvas
        y_offset = (self.target_size[1] - new_height) // 2
        x_offset = (self.target_size[0] - new_width) // 2
        canvas[y_offset:y_offset+new_height, x_offset:x_offset+new_width] = resized
        
        return canvas

    def draw_detections(self, image, detections):
        """
        Draw bounding boxes and labels on image
        Args:
            image: Original image
            detections: List of detected objects
        Returns:
            numpy array: Image with annotations
        """
        img_copy = image.copy()
        
        for obj in detections['objects']:
            bbox = [int(x) for x in obj['bbox']]
            cv2.rectangle(img_copy, (bbox[0], bbox[1]), (bbox[2], bbox[3]), (0, 255, 0), 2)
            
            # Add label with confidence
            label = f"{obj['class']} {obj['confidence']:.2f}"
            cv2.putText(img_copy, label, (bbox[0], bbox[1]-10), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
            
        return img_copy