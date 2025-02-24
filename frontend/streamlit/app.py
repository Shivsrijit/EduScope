# frontend/streamlit/app.py
import streamlit as st
import requests
import json
import uuid
import pandas as pd
from PIL import Image
import io
import cv2
import numpy as np

class EduScopeApp:
    def __init__(self):
        """Initialize the EduScope application"""
        self.API_URL = "http://localhost:8000"  # FastAPI backend
        self.setup_session_state()
        
    def setup_session_state(self):
        """Initialize session state variables"""
        if 'user_progress' not in st.session_state:
            st.session_state.user_progress = {
                "points": 0, 
                "level": 1,
                "projects_completed": 0,
                "tutorials_completed": 0,
                "badges": []
            }
        if 'learning_style' not in st.session_state:
            st.session_state.learning_style = {
                "style": "Visual",  # Default style
                "recommendations": ["diagrams", "videos", "infographics"]
            }
            
    def main(self):
        """Main application interface"""
        st.title("EduScope - AI-Powered Learning Platform")
        
        # Main content tabs
        tab1, tab2, tab3, tab4, tab5 = st.tabs([
            "Live Learning",
            "Project Explorer",
            "Team Collaboration",
            "Leaderboard",
            "My Progress"
        ])
        
        with tab1:
            self.live_learning_tab()
        with tab2:
            self.project_explorer_tab()
        with tab3:
            self.collaboration_tab()
        with tab4:
            self.leaderboard_tab()
        with tab5:
            self.progress_tab()
            
    def render_sidebar(self):
        """Render sidebar with advanced features"""
        st.sidebar.header("Your Learning Journey")
        
        # Learning style analysis
        if st.sidebar.button("Analyze My Learning Style"):
            self.analyze_learning_style()
            
        # Show current learning style
        if st.session_state.learning_style:
            st.sidebar.write("Your Learning Style:", st.session_state.learning_style["style"])
            st.sidebar.write("Recommended Approaches:", 
                           ", ".join(st.session_state.learning_style["recommendations"]))
            
        # Progress tracking
        st.sidebar.metric("Level", st.session_state.user_progress["level"])
        st.sidebar.progress(st.session_state.user_progress["points"] % 1000 / 1000)
        
    def analyze_learning_style(self):
        """Analyze user's learning style"""
        try:
            response = requests.post(
                f"{self.API_URL}/analyze/learning-style",
                json={"interactions": st.session_state.get("interactions", [])}
            )
            st.session_state.learning_style = response.json()
        except Exception as e:
            st.error(f"Error analyzing learning style: {e}")
            
    def live_learning_tab(self):
        """Live learning with camera"""
        st.header("Live Learning Mode")
        
        # Advanced options
        col1, col2 = st.columns(2)
        with col1:
            enable_hints = st.checkbox("Enable Real-time Hints")
        with col2:
            challenge_mode = st.checkbox("Challenge Mode")
            
        # Camera input
        camera_input = st.camera_input("Take a picture of your learning materials")
        
        if camera_input:
            self.process_image(camera_input, enable_hints, challenge_mode)
            
    def process_image(self, image_data, enable_hints=False, challenge_mode=False):
        """Process image through API"""
        try:
            with st.spinner("Processing image..."):
                files = {"file": image_data.getvalue()}
                response = requests.post(f"{self.API_URL}/detect/image", files=files)
                
                if response.status_code != 200:
                    st.error(f"API Error: {response.status_code}")
                    return

                result = response.json()
                
                # Display detected objects
                if result and "objects" in result:
                    st.subheader("📦 Detected Components")
                    detected_objects = []
                    for obj in result["objects"]:
                        confidence = obj.get("confidence", 0) * 100
                        st.write(f"- {obj['class']} (Confidence: {confidence:.1f}%)")
                        detected_objects.append(obj['class'])

                    if detected_objects:
                        # Create tabs for different content types
                        tab1, tab2 = st.tabs(["Learning Content", "Project Ideas"])
                        
                        with tab1:
                            if "learning_content" in result:
                                content = result["learning_content"]
                                if "learning_modules" in content:
                                    for domain, module in content["learning_modules"].items():
                                        with st.expander(f"📚 {domain.title()}", expanded=True):
                                            if "overview" in module:
                                                st.markdown(module["overview"])
                                            if "safety" in module:
                                                st.warning(module["safety"])
                                            if "instructions" in module:
                                                st.subheader("Instructions")
                                                for i, step in enumerate(module["instructions"], 1):
                                                    st.write(f"{i}. {step}")
                                            if "tips" in module:
                                                st.info("💡 Tips")
                                                for tip in module["tips"]:
                                                    st.write(f"- {tip}")
                        
                        with tab2:
                            with st.spinner("Generating project ideas..."):
                                # Get project suggestions
                                project_data = {
                                    "components": detected_objects,
                                    "difficulty": "Beginner",
                                    "team_size": 1
                                }
                                project_response = requests.post(
                                    f"{self.API_URL}/projects/suggest",
                                    json=project_data
                                )
                                
                                if project_response.status_code == 200:
                                    projects = project_response.json()
                                    if projects:
                                        for i, project in enumerate(projects, 1):
                                            with st.expander(f"Project {i}: {project['title']}", expanded=i==1):
                                                st.markdown(f"**Description:** {project['description']}")
                                                st.markdown("**Steps:**")
                                                for j, step in enumerate(project['steps'], 1):
                                                    st.markdown(f"{j}. {step}")
                                                if 'tips' in project:
                                                    st.info("**💡 Tips:**")
                                                    for tip in project['tips']:
                                                        st.markdown(f"- {tip}")
                else:
                    st.warning("No objects detected. Try adjusting the image or angle.")

        except Exception as e:
            st.error(f"Error processing image: {str(e)}")
            print(f"Detailed error: {e}")

    def project_explorer_tab(self):
        """Project explorer interface"""
        st.header("Project Explorer")
        
        # Input methods
        input_method = st.radio("Choose Input Method", 
            ["Camera", "Upload Image", "Text Description"])
        
        if input_method == "Camera":
            camera_input = st.camera_input("Capture Components")
            if camera_input:
                self.process_components(camera_input, "camera")
            
        elif input_method == "Upload Image":
            uploaded_file = st.file_uploader("Upload image", type=['jpg', 'jpeg', 'png'])
            if uploaded_file:
                self.process_components(uploaded_file, "upload")
            
        else:  # Text Description
            components = st.text_input("List your components (comma-separated)")
            difficulty = st.select_slider(
                "Project Difficulty",
                options=["Beginner", "Intermediate", "Advanced"],
                value="Beginner"
            )
            team_size = st.number_input(
                "Team Size",
                min_value=1,
                max_value=5,
                value=1
            )
            
            if components and st.button("Get Project Ideas"):
                components_list = [c.strip() for c in components.split(",")]
                self.get_and_display_projects(components_list, difficulty, team_size)

    def process_components(self, input_data, input_type):
        """Process components and display project suggestions"""
        try:
            with st.spinner("Analyzing components..."):
                if input_type in ["camera", "upload"]:
                    # Process image input
                    files = {"file": input_data.getvalue()}
                    response = requests.post(f"{self.API_URL}/detect/image", files=files)
                    if response.status_code == 200:
                        result = response.json()
                        components = [obj["class"] for obj in result.get("objects", [])]
                    else:
                        st.error("Failed to process image")
                        return
                else:
                    # Text input
                    components = input_data

                if not components:
                    st.warning("No components detected or provided")
                    return

                # Show detected/provided components
                st.subheader("📦 Available Components")
                st.write(", ".join(components))

                # Get project suggestions
                col1, col2 = st.columns(2)
                with col1:
                    difficulty = st.select_slider(
                        "Project Difficulty",
                        options=["Beginner", "Intermediate", "Advanced"]
                    )
                with col2:
                    team_size = st.number_input(
                        "Team Size",
                        min_value=1,
                        max_value=5,
                        value=1
                    )

                suggestions = self.get_project_suggestions(components, difficulty, team_size)
                if suggestions:
                    self.display_project_suggestions(suggestions)

        except Exception as e:
            st.error(f"Error processing components: {e}")

    def display_learning_content(self, content):
        """Display AI-generated learning content"""
        try:
            if not content:
                st.warning("No learning content available.")
                return

            # Display learning modules if available
            if "learning_modules" in content:
                st.subheader("📚 Learning Modules")
                for domain, module in content["learning_modules"].items():
                    with st.expander(f"{domain.title()} Module"):
                        if "overview" in module:
                            st.markdown(module["overview"])
                        if "safety" in module:
                            st.warning(module["safety"])
                        if "instructions" in module:
                            st.subheader("Instructions")
                            for i, instruction in enumerate(module["instructions"], 1):
                                st.write(f"{i}. {instruction}")
                        if "tips" in module:
                            st.info("💡 Tips")
                            for tip in module["tips"]:
                                st.write(f"- {tip}")

            # Display project suggestions if available
            if "project_suggestions" in content:
                st.subheader("🚀 Suggested Projects")
                for project in content["project_suggestions"]:
                    with st.expander(project["title"]):
                        if "description" in project:
                            st.write("**Description:**", project["description"])
                        if "components" in project:
                            st.write("**Required Components:**", ", ".join(project["components"]))
                        if "steps" in project:
                            st.write("**Steps:**")
                            for i, step in enumerate(project["steps"], 1):
                                st.write(f"{i}. {step}")
                        if "tips" in project:
                            st.info("💡 Tips")
                            for tip in project["tips"]:
                                st.write(f"- {tip}")

        except Exception as e:
            st.error(f"Error displaying content: {str(e)}")
            print(f"Detailed error: {e}")  # Debug print

    def display_badges(self):
        """Display user's earned badges"""
        badges = st.session_state.user_progress.get("badges", [])
        
        if badges:
            cols = st.columns(len(badges))
            for idx, badge in enumerate(badges):
                with cols[idx]:
                    st.image(f"static/badges/{badge['name']}.png", caption=badge['name'])
                    st.write(f"Points: {badge['points']}")
        else:
            st.info("Complete projects and tutorials to earn badges!")

    def collaboration_tab(self):
        """Team collaboration interface"""
        st.header("Team Collaboration")
        
        # Create or join room
        col1, col2 = st.columns(2)
        with col1:
            if st.button("Create Room"):
                room_id = self.create_collaboration_room()
                st.success(f"Room Created! ID: {room_id}")
        
        with col2:
            room_id = st.text_input("Enter Room ID to Join")
            if room_id and st.button("Join Room"):
                self.join_collaboration_room(room_id)

    def leaderboard_tab(self):
        """Leaderboard interface"""
        st.header("Global Leaderboard")
        
        # Add refresh button
        if st.button("🔄 Refresh Leaderboard"):
            st.experimental_rerun()
        
        # Fetch and display leaderboard
        leaderboard = self.get_leaderboard_data()
        if leaderboard:
            # Create a formatted dataframe
            df = pd.DataFrame(leaderboard)
            
            # Style the leaderboard
            st.dataframe(
                df.style.background_gradient(cmap='viridis', subset=['points']),
                use_container_width=True
            )
            
            # Top performers
            st.subheader("🏆 Top Performers")
            top_3 = df.head(3)
            cols = st.columns(3)
            for i, (_, user) in enumerate(top_3.iterrows()):
                with cols[i]:
                    st.metric(
                        f"#{i+1} {user['username']}", 
                        f"{user['points']} pts",
                        f"Level {user['level']}"
                    )

    def progress_tab(self):
        """User progress tracking interface"""
        st.header("My Learning Progress")
        
        # Display progress metrics
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Projects Completed", st.session_state.user_progress.get("projects", 0))
        with col2:
            st.metric("Points Earned", st.session_state.user_progress.get("points", 0))
        with col3:
            st.metric("Current Level", st.session_state.user_progress.get("level", 1))
        
        # Display badges
        st.subheader("Earned Badges")
        self.display_badges()

    def display_detection_results(self, result):
        """Display AI Detection Results"""
        st.header("Detection Results")

        if not result:
            st.write("No results generated. Please try another image.")
            return

        if "error" in result:
            st.error(f"Error: {result['error']}")
            return

        # Display detected items
        if "detected_items" in result:
            st.subheader("📦 Detected Items")
            st.write(", ".join(result["detected_items"]))

        # Display learning modules
        if "learning_modules" in result:
            for domain, module in result["learning_modules"].items():
                with st.expander(f"📚 {domain.title()} Learning Module"):
                    if "overview" in module:
                        st.markdown(module["overview"])
                    if "safety" in module:
                        st.warning(module["safety"])
                    if "instructions" in module:
                        st.subheader("Instructions")
                        for i, instruction in enumerate(module["instructions"], 1):
                            st.write(f"{i}. {instruction}")
                    if "tips" in module:
                        st.info("💡 Tips:\n" + "\n".join(f"- {tip}" for tip in module["tips"]))

        # Display project suggestions
        if "project_suggestions" in result:
            st.subheader("🚀 Project Suggestions")
            for project in result["project_suggestions"]:
                with st.expander(project["title"]):
                    for key, value in project.items():
                        if key != "title":
                            st.write(f"**{key.replace('_', ' ').title()}:** {value}")

    def get_leaderboard_data(self):
        """Fetch leaderboard data from backend"""
        try:
            response = requests.get(f"{self.API_URL}/leaderboard")
            if response.status_code == 200:
                return response.json()
            else:
                st.error("Failed to fetch leaderboard data")
                return None
        except Exception as e:
            st.error(f"Error fetching leaderboard: {e}")
            return None

    def detect_components(self, image_file):
        """Send image to backend for component detection"""
        try:
            files = {"file": image_file.getvalue()}
            response = requests.post(f"{self.API_URL}/detect/image", files=files)
            
            if response.status_code == 200:
                return response.json()
            else:
                st.error("Failed to detect components")
                return None
        except Exception as e:
            st.error(f"Error in component detection: {e}")
            return None

    def get_project_suggestions(self, components, difficulty, team_size):
        """Get project suggestions from backend"""
        try:
            data = {
                "components": components,
                "difficulty": difficulty,
                "team_size": team_size
            }
            response = requests.post(f"{self.API_URL}/projects/suggest", json=data)
            
            if response.status_code == 200:
                return response.json()
            else:
                st.error("Failed to get project suggestions")
                return None
        except Exception as e:
            st.error(f"Error getting project suggestions: {e}")
            return None

    def create_collaboration_room(self):
        """Create a new collaboration room"""
        try:
            room_data = {
                "room_id": str(uuid.uuid4())[:8],
                "project_id": "",
                "team_members": []
            }
            response = requests.post(f"{self.API_URL}/collaboration/create", json=room_data)
            
            if response.status_code == 200:
                return response.json()["room_id"]
            else:
                st.error("Failed to create collaboration room")
                return None
        except Exception as e:
            st.error(f"Error creating collaboration room: {e}")
            return None

    def join_collaboration_room(self, room_id):
        """Join an existing collaboration room"""
        try:
            # Add logic to join room
            st.success(f"Joined room {room_id}")
        except Exception as e:
            st.error(f"Error joining room: {e}")

    def get_content_for_components(self, components):
        """Get learning content for text-based component input"""
        try:
            data = {
                "components": components,
                "difficulty": "Beginner",  # Default value
                "team_size": 1  # Default value
            }
            response = requests.post(f"{self.API_URL}/content/generate", json=data)
            
            if response.status_code == 200:
                return response.json()
            else:
                st.error("Failed to generate content")
                return None
        except Exception as e:
            st.error(f"Error generating content: {e}")
            return None

    def get_learning_content(self, detections):
        """Get comprehensive learning content from backend"""
        try:
            response = requests.post(f"{self.API_URL}/content/generate", json=detections)
            
            if response.status_code == 200:
                return response.json()
            else:
                st.error("Failed to generate learning content")
                return {
                    "learning_modules": {},
                    "project_suggestions": []
                }
        except Exception as e:
            st.error(f"Error getting learning content: {e}")
            return {
                "learning_modules": {},
                "project_suggestions": []
            }

    def display_project_suggestions(self, suggestions):
        """Display project suggestions in an organized way"""
        if not suggestions:
            st.warning("No project suggestions available for these components.")
            return
        
        st.subheader("🚀 Suggested Projects")
        
        for i, project in enumerate(suggestions, 1):
            with st.expander(f"Project {i}: {project['title']}", expanded=i==1):
                # Description
                st.markdown(f"**Description:**\n{project['description']}")
                
                # Components
                st.markdown("**Required Components:**")
                for component in project['components']:
                    st.markdown(f"- {component}")
                
                # Time and Learning Outcomes
                col1, col2 = st.columns(2)
                with col1:
                    st.markdown(f"**⏱️ Estimated Time:**\n{project['estimated_time']}")
                with col2:
                    st.markdown(f"**🎯 Learning Outcomes:**\n{project['learning_outcomes']}")
                
                # Steps
                if 'steps' in project:
                    st.markdown("**Step-by-Step Instructions:**")
                    for j, step in enumerate(project['steps'], 1):
                        st.markdown(f"{j}. {step}")
                
                # Tips
                if 'tips' in project:
                    st.markdown("**💡 Tips:**")
                    for tip in project['tips']:
                        st.markdown(f"- {tip}")
                
                # Start Project Button
                if st.button("Start This Project", key=f"start_project_{i}"):
                    st.session_state.user_progress["projects_completed"] += 1
                    st.success(f"Project '{project['title']}' started! Good luck!")

    def get_and_display_projects(self, components, difficulty, team_size):
        """Get and display project suggestions"""
        try:
            with st.spinner("Generating project ideas..."):
                data = {
                    "components": components,
                    "difficulty": difficulty,
                    "team_size": team_size
                }
                
                response = requests.post(f"{self.API_URL}/projects/suggest", json=data)
                
                if response.status_code == 200:
                    projects = response.json()
                    if projects:
                        st.subheader("🚀 Project Suggestions")
                        for i, project in enumerate(projects, 1):
                            with st.expander(f"Project {i}: {project['title']}", expanded=i==1):
                                st.markdown(f"**Description:**\n{project['description']}")
                                
                                st.markdown("**Required Components:**")
                                for component in project['components']:
                                    st.markdown(f"- {component}")
                                
                                col1, col2 = st.columns(2)
                                with col1:
                                    st.markdown(f"**⏱️ Estimated Time:**\n{project['estimated_time']}")
                                with col2:
                                    st.markdown(f"**🎯 Learning Outcomes:**\n{project['learning_outcomes']}")
                                
                                if 'steps' in project:
                                    st.markdown("**Step-by-Step Instructions:**")
                                    for j, step in enumerate(project['steps'], 1):
                                        st.markdown(f"{j}. {step}")
                                
                                if 'tips' in project:
                                    st.info("**💡 Tips:**")
                                    for tip in project['tips']:
                                        st.markdown(f"- {tip}")
                                
                                if st.button("Start This Project", key=f"start_project_{i}"):
                                    st.session_state.user_progress["projects_completed"] += 1
                                    st.success(f"Project '{project['title']}' started! Good luck!")
                    else:
                        st.warning("No project suggestions generated. Try different components.")
                else:
                    st.error("Failed to get project suggestions. Please try again.")
                
        except Exception as e:
            st.error(f"Error getting project suggestions: {str(e)}")
            print(f"Detailed error: {e}")

# Run the app
if __name__ == "__main__":
    app = EduScopeApp()
    app.main()