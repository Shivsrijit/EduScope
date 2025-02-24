class ProjectIdea:
    def __init__(self, title, description, difficulty, technologies, estimated_time):
        self.title = title
        self.description = description
        self.difficulty = difficulty  # "Beginner", "Intermediate", "Advanced"
        self.technologies = technologies  # List of required technologies
        self.estimated_time = estimated_time  # In hours

def get_project_ideas_for_topic(topic):
    project_ideas = {
        "python": [
            ProjectIdea(
                "Task Manager CLI",
                "Build a command-line task manager with features like adding, deleting, and marking tasks as complete",
                "Beginner",
                ["Python", "File I/O"],
                4
            ),
            ProjectIdea(
                "Weather Dashboard",
                "Create a weather app that fetches data from an API and displays current weather and forecasts",
                "Intermediate",
                ["Python", "APIs", "JSON"],
                8
            )
        ],
        "javascript": [
            ProjectIdea(
                "Interactive Quiz App",
                "Develop a quiz application with multiple choice questions and score tracking",
                "Beginner",
                ["HTML", "CSS", "JavaScript"],
                6
            ),
            ProjectIdea(
                "Real-time Chat Application",
                "Build a chat app using WebSocket for real-time communication",
                "Advanced",
                ["JavaScript", "WebSocket", "Node.js"],
                16
            )
        ]
        # Add more topics as needed
    }
    return project_ideas.get(topic.lower(), []) 