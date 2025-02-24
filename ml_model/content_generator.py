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
        """Generate comprehensive learning content based on detected objects"""
        try:
            detected_classes = list(set(obj["class"] for obj in detections.get("objects", [])))
            print(f"📢 Detected Components: {detected_classes}")

            # Create learning modules for each detected object
            learning_modules = {}
            project_suggestions = []

            for component in detected_classes:
                # Get basic information about the component
                info = self.scraper.scrape_info(component)
                
                # Generate learning module
                prompt = f"""
                Create a detailed learning module about {component}. Include:
                1. Overview and basic concepts
                2. Safety considerations (if applicable)
                3. Step-by-step instructions for basic usage
                4. Practical tips and best practices
                
                Basic information: {info}
                """
                
                response = self.text_model.generate_content(prompt)
                if response and hasattr(response, "text"):
                    learning_modules[component] = self._parse_module_content(response.text)

            # Generate project suggestions
            project_prompt = f"""
            Suggest 2 creative projects using these components: {', '.join(detected_classes)}
            
            For each project provide:
            1. Title
            2. Brief description
            3. Required components
            4. Step-by-step instructions
            5. Learning outcomes
            6. Estimated time
            7. Helpful tips
            
            Format as:
            PROJECT 1:
            Title: [project name]
            Description: [2-3 sentences]
            Components: [list]
            Steps: [numbered list]
            Learning Outcomes: [bullet points]
            Estimated Time: [duration]
            Tips: [bullet points]
            """

            project_response = self.text_model.generate_content(project_prompt)
            if project_response and hasattr(project_response, "text"):
                project_suggestions = self._parse_project_suggestions(project_response.text)

            return {
                "learning_modules": learning_modules,
                "project_suggestions": project_suggestions
            }

        except Exception as e:
            print(f"⚠️ Content Generation Error: {e}")
            return {
                "learning_modules": {},
                "project_suggestions": []
            }

    def _parse_module_content(self, text):
        """Parse AI response into structured module content"""
        sections = {
            "overview": "",
            "safety": "",
            "instructions": [],
            "tips": []
        }
        
        current_section = "overview"
        for line in text.split('\n'):
            line = line.strip()
            if not line:
                continue
            
            if "safety" in line.lower() and ":" in line:
                current_section = "safety"
                continue
            elif "instruction" in line.lower() and ":" in line:
                current_section = "instructions"
                continue
            elif "tip" in line.lower() and ":" in line:
                current_section = "tips"
                continue
            
            if current_section in ["instructions", "tips"]:
                if line.strip('1234567890. '):  # Remove numbering
                    sections[current_section].append(line.strip('1234567890. '))
            else:
                sections[current_section] += line + "\n"
        
        return sections

    def generate_project_suggestions(self, components, difficulty, team_size):
        """Generate project suggestions based on components"""
        try:
            # Simplified prompt for faster generation
            prompt = f"""
            Create 2 quick {difficulty} projects using: {', '.join(components)}
            Team size: {team_size}

            Use this exact format for each project:

            PROJECT 1
            Title: [Brief name]
            Description: [One clear sentence]
            Components: {', '.join(components)}
            Time: [15-60 minutes]
            Steps:
            1. [First step]
            2. [Second step]
            3. [Final step]
            Tips:
            - [Key safety tip]
            - [Important advice]

            PROJECT 2
            [Same format as above]
            """

            # Optimize generation parameters for speed
            response = self.text_model.generate_content(
                prompt,
                generation_config={
                    "temperature": 0.7,
                    "top_p": 0.9,
                    "top_k": 20,
                    "max_output_tokens": 500,  # Reduced for faster response
                    "candidate_count": 1
                }
            )

            if not response or not hasattr(response, "text"):
                raise ValueError("Empty AI response")

            projects = self._parse_project_suggestions(response.text)
            
            # Add default values for missing fields
            for project in projects:
                project.update({
                    'difficulty': difficulty,
                    'team_size': team_size,
                    'estimated_time': project.get('estimated_time', '30 minutes'),
                    'learning_outcomes': project.get('learning_outcomes', 'Basic project skills'),
                    'tips': project.get('tips', ['Work safely', 'Follow instructions carefully'])
                })

            return projects

        except Exception as e:
            print(f"⚠️ Project generation error: {e}")
            return []

    def _parse_project_suggestions(self, text):
        """Parse AI response into structured project suggestions"""
        projects = []
        current_project = None
        current_section = None
        
        for line in text.split('\n'):
            line = line.strip()
            if not line:
                continue
            
            # Start new project
            if line.startswith('PROJECT'):
                if current_project:
                    projects.append(current_project)
                current_project = {
                    'steps': [],
                    'tips': [],
                    'estimated_time': 'Not specified',  # Default value
                    'learning_outcomes': 'Not specified'  # Default value
                }
                continue
            
            if not current_project:
                continue
            
            # Parse sections
            if line.startswith('Title:'):
                current_project['title'] = line.replace('Title:', '').strip()
            elif line.startswith('Description:'):
                current_project['description'] = line.replace('Description:', '').strip()
            elif line.startswith('Components:'):
                components = line.replace('Components:', '').strip()
                current_project['components'] = [c.strip() for c in components.split(',')]
            elif line.startswith(('Time:', 'Estimated Time:')):
                current_project['estimated_time'] = line.split(':', 1)[1].strip()
            elif line.startswith('Learning Outcomes:'):
                current_project['learning_outcomes'] = line.replace('Learning Outcomes:', '').strip()
            elif line.startswith('Steps:'):
                current_section = 'steps'
            elif line.startswith('Tips:'):
                current_section = 'tips'
            elif current_section == 'steps' and (line[0].isdigit() or line.startswith('-')):
                current_project['steps'].append(line.split('.', 1)[-1].strip().strip('-'))
            elif current_section == 'tips' and (line.startswith('-') or line[0].isdigit()):
                current_project['tips'].append(line.strip('- 1234567890.'))
        
        # Add the last project
        if current_project:
            projects.append(current_project)
        
        return projects
