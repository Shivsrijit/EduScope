from models.project_ideas import get_project_ideas_for_topic

def get_learning_content(topic):
    # ... existing code ...
    
    learning_modules = get_learning_modules(topic)
    project_ideas = get_project_ideas_for_topic(topic)
    
    return {
        "modules": learning_modules,
        "project_ideas": project_ideas
    } 