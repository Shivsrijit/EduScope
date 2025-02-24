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
        self.scraper = WebScraper()

    def generate_learning_content(self, detections):
        """Generate comprehensive learning content based on detected objects"""
        try:
            detected_classes = list(set(obj["class"] for obj in detections.get("objects", [])))
            print(f"📢 Detected Components: {detected_classes}")

            # Create learning modules for each detected object
            learning_modules = {}
            
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

            # Generate project suggestions using the separate method
            project_suggestions = self.generate_project_suggestions(
                components=detected_classes,
                difficulty="beginner",  # You can make this parameterable
                team_size=1  # You can make this parameterable
            )

            result = {
                "learning_modules": learning_modules,
                "project_suggestions": project_suggestions
            }

            # Debug output
            print("\n📚 Generated Learning Modules:")
            for component, module in result["learning_modules"].items():
                print(f"\n{component}:")
                for section, content in module.items():
                    print(f"- {section}: {content[:100]}...")

            print("\n🚀 Generated Projects:")
            for i, project in enumerate(result["project_suggestions"], 1):
                print(f"\nProject {i}:")
                print(f"Title: {project.get('title')}")
                print(f"Description: {project.get('description')}")
                print(f"Components: {', '.join(project.get('components', []))}")
                print(f"Time: {project.get('estimated_time')}")
                print("Steps:")
                for step in project.get('steps', []):
                    print(f"- {step}")
                print("Learning Outcomes:")
                for outcome in project.get('learning_outcomes', []):
                    print(f"- {outcome}")
                print("Tips:")
                for tip in project.get('tips', []):
                    print(f"- {tip}")

            return result

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
            prompt = f"""
            Create 2 {difficulty} projects using: {', '.join(components)}
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
            Learning Outcomes:
            - [Key skill or knowledge gained]
            - [Another learning outcome]
            - [Additional learning outcome]
            Tips:
            - [Key safety tip]
            - [Important advice]

            PROJECT 2
            [Same format as above]
            """

            response = self.text_model.generate_content(prompt)
            
            if not response or not hasattr(response, "text"):
                raise ValueError("Empty AI response")

            return self._parse_project_suggestions(response.text)

        except Exception as e:
            print(f"⚠️ Project generation error: {e}")
            return []

    def _parse_project_suggestions(self, text):
        """Parse AI response into structured project suggestions"""
        projects = []
        current_project = None
        
        # Split text into individual projects
        project_texts = text.split('PROJECT')[1:]  # Skip empty first split
        
        for project_text in project_texts:
            lines = project_text.strip().split('\n')
            
            current_project = {
                'title': '',
                'description': '',
                'components': [],
                'steps': [],
                'learning_outcomes': [],  # Added learning outcomes list
                'tips': [],
                'estimated_time': 'Not specified'
            }
            
            current_section = None
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                
                # Parse each section
                if line.startswith('Title:'):
                    current_project['title'] = line.replace('Title:', '').strip()
                elif line.startswith('Description:'):
                    current_project['description'] = line.replace('Description:', '').strip()
                elif line.startswith('Components:'):
                    components = line.replace('Components:', '').strip()
                    current_project['components'] = [c.strip() for c in components.split(',')]
                elif line.startswith(('Time:', 'Estimated Time:')):
                    current_project['estimated_time'] = line.split(':', 1)[1].strip()
                elif line.startswith('Steps:'):
                    current_section = 'steps'
                elif line.startswith('Learning Outcomes:'):
                    current_section = 'learning_outcomes'
                elif line.startswith('Tips:'):
                    current_section = 'tips'
                elif current_section == 'steps' and (line[0].isdigit() or line.startswith('-')):
                    step = line.split('.', 1)[-1].strip().strip('-')
                    if step:  # Only add non-empty steps
                        current_project['steps'].append(step)
                elif current_section == 'learning_outcomes' and (line.startswith('-') or line[0].isdigit()):
                    outcome = line.strip('- 1234567890.')
                    if outcome:  # Only add non-empty outcomes
                        current_project['learning_outcomes'].append(outcome)
                elif current_section == 'tips' and (line.startswith('-') or line[0].isdigit()):
                    tip = line.strip('- 1234567890.')
                    if tip:  # Only add non-empty tips
                        current_project['tips'].append(tip)
            
            # Only add projects that have at least a title, one step, and one learning outcome
            if current_project['title'] and current_project['steps'] and current_project['learning_outcomes']:
                projects.append(current_project)
        
        return projects