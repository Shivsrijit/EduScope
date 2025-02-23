# ml_model/process_video.py
import cv2
import numpy as np
from threading import Thread
import queue
import time

class VideoProcessor:
    def __init__(self, buffer_size=10):
        """
        Initialize video processor
        Args:
            buffer_size: Size of frame buffer for real-time processing
        """
        self.buffer_size = buffer_size
        self.frame_buffer = queue.Queue(maxsize=buffer_size)
        self.processing_active = False
        
    def start_video_capture(self, source=0):
        """
        Start video capture from camera or video file
        Args:
            source: Camera index or video file path
        """
        self.cap = cv2.VideoCapture(source)
        self.processing_active = True
        
        # Start capture thread
        self.capture_thread = Thread(target=self._capture_frames)
        self.capture_thread.daemon = True
        self.capture_thread.start()
        
    def stop_video_capture(self):
        """Stop video capture and release resources"""
        self.processing_active = False
        if hasattr(self, 'capture_thread'):
            self.capture_thread.join()
        if hasattr(self, 'cap'):
            self.cap.release()
            
    def _capture_frames(self):
        """Continuously capture frames and add to buffer"""
        while self.processing_active:
            if not self.frame_buffer.full():
                ret, frame = self.cap.read()
                if ret:
                    self.frame_buffer.put(frame)
                else:
                    self.processing_active = False
                    break
            else:
                time.sleep(0.01)  # Small delay to prevent CPU overload
                
    def get_frame(self):
        """Get the next frame from buffer"""
        try:
            return self.frame_buffer.get_nowait()
        except queue.Empty:
            return None
            
    def process_frame(self, frame, detector):
        """
        Process a single frame with object detection
        Args:
            frame: numpy array of frame
            detector: YOLOObjectDetector instance
        Returns:
            tuple: (processed frame, detections)
        """
        if frame is None:
            return None, None
            
        # Perform detection
        detections = detector.detect_objects(frame)
        
        # Draw results
        processed_frame = self._draw_detections(frame, detections)
        
        return processed_frame, detections
        
    def _draw_detections(self, frame, detections):
        """Draw detection results on frame"""
        if not detections or 'objects' not in detections:
            return frame
            
        frame_copy = frame.copy()
        
        for obj in detections['objects']:
            bbox = [int(x) for x in obj['bbox']]
            cv2.rectangle(frame_copy, (bbox[0], bbox[1]), (bbox[2], bbox[3]), (0, 255, 0), 2)
            
            # Add label with confidence
            label = f"{obj['class']} {obj['confidence']:.2f}"
            cv2.putText(frame_copy, label, (bbox[0], bbox[1]-10), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
            
        return frame_copy