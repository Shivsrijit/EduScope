# ml_model/content_generator.py
import google.generativeai as genai
from PIL import Image
import json
import numpy as np
import cv2
from ml_model.web_scraper import WebScraper

class ContentGenerator:
    def __init__(self, api_key):
        """Initialize Gemini content generator"""
        genai.configure(api_key=api_key)
        self.text_model = genai.GenerativeModel('gemini-pro')
        self.vision_model = genai.GenerativeModel('gemini-pro-vision')
        self.scraper = WebScraper()  # ✅ Fixed typo (was `scaper`)

    def generate_learning_content(self, detections):
        """Generate AI-based learning content"""
        if not isinstance(detections, dict):
            raise TypeError("⚠️ ERROR: `detections` must be a dictionary!")

        detected_classes = list(set(obj["class"] for obj in detections.get("objects", [])))
        print(f"📢 Detected Objects for AI: {detected_classes}")

        # Fetch Web Content for First Detected Object
        scraped_info = self.scraper.scrape_info(detected_classes[0]) if detected_classes else "No relevant data."

        # Send to AI
        prompt = f"Explain the following topic in an easy way:\n\nTopic: {detected_classes[0]}\n\nAdditional Info: {scraped_info}"
        print(f"📢 Sending Prompt to AI: {prompt}")

        try:
            response = self.text_model.generate_content(prompt)  # ✅ Fixed (was `self.model`)
            print(f"📢 AI Response: {response}")

            if not response or not hasattr(response, "text"):
                raise ValueError("⚠️ ERROR: Gemini API returned an empty response!")

            return {
                "title": f"Learning about {detected_classes[0]}",
                "sections": [response.text]
            }

        except Exception as e:
            print(f"⚠️ AI Content Generation Error: {e}")
            return {
                "title": "Error",
                "sections": ["AI content could not be generated."]
            }
