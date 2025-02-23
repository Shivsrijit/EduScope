# ml_model/content_generator.py
import google.generativeai as genai
from PIL import Image
import json

class ContentGenerator:
    def __init__(self, api_key):
        """Initialize Gemini content generator"""
        genai.configure(api_key=api_key)
        self.text_model = genai.GenerativeModel('gemini-pro')
        self.vision_model = genai.GenerativeModel('gemini-pro-vision')
        
    def generate_learning_content(self, detected_objects, image=None, context=None):
        """Generate personalized learning content based on detected objects"""
        if image:
            return self._generate_vision_content(image, detected_objects, context)
        else:
            return self._generate_text_content(detected_objects, context)

    def _generate_vision_content(self, image, detected_objects, context=None):
        """Generate content using both image and detection results"""
        prompt = self._create_vision_prompt(detected_objects, context)
        
        try:
            response = self.vision_model.generate_content([prompt, image])
            return self._structure_learning_content(response.text)
        except Exception as e:
            print(f"Vision generation error: {e}")
            return self._generate_text_content(detected_objects, context)

    def _generate_text_content(self, detected_objects, context=None):
        """Generate content based on detection results only"""
        prompt = self._create_text_prompt(detected_objects, context)
        
        try:
            response = self.text_model.generate_content(prompt)
            return self._structure_learning_content(response.text)
        except Exception as e:
            print(f"Text generation error: {e}")
            return {
                'title': 'Error in content generation',
                'sections': [],
                'exercises': [],
                'resources': []
            }

    def _create_vision_prompt(self, detected_objects, context):
        return f"""
        Act as an educational content expert. Analyze this image and the detected objects:
        {json.dumps(detected_objects, indent=2)}

        Context: {context if context else 'General learning'}

        Create a comprehensive, interactive learning experience that includes:
        1. An engaging title for the learning module
        2. Multiple content sections with clear explanations
        3. Interactive exercises or activities
        4. Practical applications
        5. Safety guidelines (if applicable)
        6. Additional resources and next steps

        Format the response in a clear, structured way with clear section headings.
        """

    def _create_text_prompt(self, detected_objects, context):
        categories = detected_objects.get('categories', {})
        objects_list = detected_objects.get('objects', [])
        
        return f"""
        Create an educational learning module based on these detected materials:
        Categories: {json.dumps(categories, indent=2)}
        Objects: {json.dumps(objects_list, indent=2)}

        Context: {context if context else 'General learning'}

        Generate a structured learning experience with:
        1. An engaging title
        2. Content sections covering key concepts
        3. Hands-on exercises using the available materials
        4. Real-world applications
        5. Safety considerations
        6. Suggested additional materials and next steps

        Format the response with clear section headings.
        """

    def _structure_learning_content(self, raw_content):
        """Convert raw generated content into structured format"""
        # Split content into sections
        sections = raw_content.split('\n\n')
        
        structured_content = {
            'title': sections[0].strip(),
            'sections': [],
            'exercises': [],
            'resources': []
        }

        current_section = None
        for section in sections[1:]:
            if section.lower().startswith('exercise') or section.lower().startswith('activity'):
                structured_content['exercises'].append(section.strip())
            elif section.lower().startswith('resource') or section.lower().startswith('additional'):
                structured_content['resources'].append(section.strip())
            else:
                structured_content['sections'].append(section.strip())

        return structured_content