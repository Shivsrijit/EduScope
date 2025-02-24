<div align="center">

# 🎓 EduScope
### AI-Powered Learning Platform

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.28+-red.svg)](https://streamlit.io/)

</div>

---

## 📌 Problem Statement (PS3)
> Create an AI-powered platform that uses a device's camera or video feed to analyze physical materials in a user's environment and auto-generate engaging, interactive learning experiences.

## 🌟 Overview

EduScope transforms everyday objects into learning opportunities through:
- 🔍 AI-powered component detection
- 📚 Automated learning content generation
- 🛠️ Interactive project suggestions
- 📊 Progress tracking and analytics

## ⚡ Quick Start

1. **Clone & Install**
   ```bash
   git clone https://github.com/yourusername/eduscope.git
   cd eduscope
   pip install -r requirements.txt
   ```

2. **Set Up Environment**
   ```bash
   # Create .env file
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```

3. **Run Application**
   ```bash
   streamlit run app.py
   ```

## 🔧 Core Features

### 1. Component Detection
- **Technology**: Google Gemini Vision API
- **Capabilities**:
  - Real-time object recognition
  - Component property analysis
  - Location mapping
  - Safety assessment

### 2. Learning Content Generation
- Customized educational materials
- Interactive tutorials
- Safety guidelines
- Best practices

### 3. Project Suggestions
- Difficulty-based recommendations
- Required materials listing
- Step-by-step instructions
- Learning outcomes

## 🏗️ Technical Architecture

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
