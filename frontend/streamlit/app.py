# frontend/streamlit/app.py
import streamlit as st
import requests
import json
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
            st.session_state.user_progress = {"points": 0, "level": 1}
        if 'learning_style' not in st.session_state:
            st.session_state.learning_style = None
            
    def main(self):
        """Main application interface"""
        st.title("EduScope - AI-Powered Learning Platform")
        
        # Advanced features in sidebar
        with st.sidebar:
            self.render_sidebar()
        
        # Main content tabs
        tab1, tab2, tab3, tab4 = st.tabs([
            "Live Learning",
            "Upload & Learn",
            "Interactive Tutor",
            "Learning Dashboard"
        ])
        
        with tab1:
            self.live_learning_tab()
        with tab2:
            self.upload_learning_tab()
        with tab3:
            self.interactive_tutor_tab()
        with tab4:
            self.learning_dashboard_tab()
            
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
            files = {"file": image_data}
            response = requests.post(f"{self.API_URL}/detect/image", files=files)
            result = response.json()
            
            # Display results
            self.display_detection_results(result)
            
            # Generate challenge if enabled
            if challenge_mode:
                self.generate_challenge(result["categories"])
                
            # Show hints if enabled
            if enable_hints and result["learning_content"]:
                self.show_hints(result["learning_content"])
                
        except Exception as e:
            st.error(f"Error processing image: {e}")
            
    def interactive_tutor_tab(self):
        """Interactive tutoring interface"""
        st.header("Interactive AI Tutor")
        
        # Topic selection
        topic = st.text_input("What would you like to learn about?")
        
        if topic:
            # Get learning style recommendations
            if st.session_state.learning_style:
                style = st.session_state.learning_style["style"]
                st.info(f"Adapting content to your {style} learning style!")
                
            # Get personalized explanation
            try:
                response = requests.post(
                    f"{self.API_URL}/tutor/explain",
                    json={
                        "concept": topic,
                        "user_level": st.session_state.user_progress["level"],
                        "learning_style": st.session_state.learning_style
                    }
                )
                explanation = response.json()
                
                # Display multi-modal explanation
                st.subheader("Let's explore this topic!")
                st.write(explanation["text"])
                
                # Show interactive elements
                with st.expander("Interactive Examples"):
                    st.write(explanation["interactive"])
                    
                # Practice questions
                with st.expander("Practice Questions"):
                    self.show_practice_questions(topic)
                    
            except Exception as e:
                st.error(f"Error getting explanation: {e}")
                
    def show_practice_questions(self, topic):
        """Show interactive practice questions"""
        st.write("Test your knowledge!")
        
        # Get questions from API
        try:
            response = requests.post(
                f"{self.API_URL}/tutor/questions",
                json={"topic": topic}
            )
            questions = response.json()
            
            for q in questions:
                answer = st.text_input(q["question"])
                check = st.button("Check Answer", key=q["id"])
                
                if check and answer:
                    self.check_answer(answer, q)
                    
        except Exception as e:
            st.error(f"Error loading questions: {e}")

# Run the app
if __name__ == "__main__":
    app = EduScopeApp()
    app.main()