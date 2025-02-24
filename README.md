# EduScope - AI-Powered Learning Platform

## 🎯 Problem Statement (PS3)
Create an AI-powered platform that uses a device's camera or video feed to analyze physical materials in a user's environment and auto-generate engaging, interactive learning experiences.

## 🌟 Overview
EduScope transforms everyday objects into learning opportunities by:
- Detecting components through computer vision
- Generating customized educational content
- Suggesting hands-on projects
- Creating interactive learning experiences

## 🔄 How It Works

### 1. Live Learning Mode
- Point your camera at components/materials
- AI detects and identifies objects
- Generates immediate learning content:
  - Component information
  - Safety guidelines
  - Usage instructions
  - Project suggestions

Example:

## Features

### 1. Live Learning Mode
- **Real-time Object Detection**: Uses camera input to identify learning materials and components
- **Instant Learning Content**: Generates comprehensive learning modules for detected objects
- **Project Suggestions**: Offers creative project ideas based on available components
- **Interactive Tips**: Provides real-time hints and safety guidelines

### 2. Project Explorer
- Multiple input methods:
  - Camera capture
  - Image upload
  - Text description
- Customizable project parameters:
  - Difficulty levels (Beginner/Intermediate/Advanced)
  - Team size options
- Detailed project suggestions including:
  - Step-by-step instructions
  - Required components
  - Estimated completion time
  - Learning outcomes
  - Safety tips

### 3. Team Collaboration
- Create collaboration rooms
- Join existing projects
- Real-time team interaction
- Shared learning experiences

### 4. Progress Tracking
- Personal achievement dashboard
- Points system
- Level progression
- Badge rewards
- Project completion tracking

### 5. Global Leaderboard
- Compare progress with other learners
- Top performers showcase
- Achievement rankings
- Community engagement

## Technical Architecture

### Frontend (Streamlit)
- Interactive web interface
- Real-time camera integration
- Dynamic content display
- Progress visualization

### Backend (FastAPI)
- RESTful API endpoints
- Object detection processing
- AI content generation
- User progress management

### AI Components
- Computer Vision (YOLO)
- Content Generation (Google Gemini)
- Learning Style Analysis
- Project Recommendation System

## Setup Instructions

1. **Environment Setup**

Clone the repository
git clone https://github.com/yourusername/eduscope.git
cd eduscope
Create virtual environment
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate
Install dependencies
pip install -r requirements.txt

2. **Configuration**

Create `.env` file

Add required environment variables
GEMINI_API_KEY=your_api_key_here

3. **Running the Application**

Start the backend server
cd backend
uvicorn api.main:app --reload
In a new terminal, start the frontend
cd frontend/streamlit
streamlit run app.py


## Usage Guide

1. **Live Learning**
   - Open the application
   - Navigate to "Live Learning" tab
   - Allow camera access
   - Point camera at learning materials
   - Explore generated content and suggestions

2. **Project Explorer**
   - Choose input method
   - Provide components (via camera/image/text)
   - Set difficulty and team size
   - Get personalized project suggestions

3. **Team Collaboration**
   - Create a new room or join existing
   - Share room ID with team members
   - Collaborate on projects in real-time

4. **Track Progress**
   - Complete projects to earn points
   - Level up through achievements
   - Earn badges for milestones
   - Compare ranking on leaderboard

## Current Status
The application is fully functional with the following features working:
- ✅ Object detection and recognition
- ✅ Learning content generation
- ✅ Project suggestions
- ✅ Progress tracking
- ✅ Leaderboard system

## Future Enhancements
- Enhanced AR integration
- Mobile application
- Offline mode support
- Advanced collaboration tools
- Custom project creation

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Google Gemini for AI capabilities
- YOLO for object detection
- Streamlit for frontend framework
- FastAPI for backend services

## Contact
For any queries or suggestions, please open an issue in the repository.
