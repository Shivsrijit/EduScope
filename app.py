import streamlit as st
import google.generativeai as genai
from PIL import Image
import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
genai.configure(api_key=GOOGLE_API_KEY)

def analyze_ui_image(image):
    """Analyze UI image using Gemini Vision API"""
    try:
        model = genai.GenerativeModel('gemini-pro-vision')
        
        prompt = """
        Analyze this UI image and provide:
        1. List of UI components detected (buttons, forms, etc.)
        2. Their approximate locations
        3. Any notable design patterns
        4. Suggestions for improvement
        
        Format the response in a clear, structured way.
        """
        
        response = model.generate_content([prompt, image])
        return {
            "success": True,
            "analysis": response.text
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

def main():
    st.set_page_config(page_title="UI Component Detector", layout="wide")
    
    st.title("UI Component Detector using Gemini Vision")
    
    # File uploader
    uploaded_file = st.file_uploader("Upload a UI screenshot", type=['png', 'jpg', 'jpeg'])
    
    if uploaded_file:
        image = Image.open(uploaded_file)
        st.image(image, caption="Uploaded UI Image", use_column_width=True)
        
        if st.button("Analyze UI Components"):
            with st.spinner("Analyzing image using Gemini Vision..."):
                result = analyze_ui_image(image)
                
                if result["success"]:
                    st.success("Analysis Complete!")
                    
                    with st.expander("View Detailed Analysis", expanded=True):
                        st.markdown(result["analysis"])
                else:
                    st.error(f"Error during analysis: {result['error']}")
                    st.warning("Please make sure you have set up your Gemini API key correctly.")

if __name__ == "__main__":
    main() 
