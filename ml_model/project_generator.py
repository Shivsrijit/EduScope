class ProjectGenerator:
    def __init__(self):
        self.project_templates = {
            "electronics": [
                {
                    "title": "Smart LED Controller",
                    "components": ["LED", "resistor", "arduino"],
                    "difficulty": "Beginner"
                },
                # Add more templates
            ],
            "robotics": [
                {
                    "title": "Line Following Robot",
                    "components": ["motor", "sensor", "wheel"],
                    "difficulty": "Intermediate"
                }
                # Add more templates
            ]
        }
    
    def generate_suggestions(self, available_components, difficulty, team_size):
        """Generate project suggestions based on available components"""
        suitable_projects = []
        
        for category, projects in self.project_templates.items():
            for project in projects:
                if (self._components_match(project["components"], available_components) and
                    project["difficulty"] == difficulty):
                    
                    project_suggestion = {
                        "title": project["title"],
                        "description": self._generate_description(project),
                        "components": project["components"],
                        "estimated_time": self._estimate_time(project, team_size),
                        "points": self._calculate_base_points(project)
                    }
                    suitable_projects.append(project_suggestion)
        
        return suitable_projects 