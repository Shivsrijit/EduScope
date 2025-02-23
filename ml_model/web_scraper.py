import requests
from bs4 import BeautifulSoup

class WebScraper:
    def __init__(self):
        self.base_url = "https://en.wikipedia.org/wiki/"

    def scrape_info(self, keyword):
        """Fetches information about a topic from Wikipedia"""
        search_url = f"{self.base_url}{keyword.replace(' ', '_')}"
        print(f"📢 Searching: {search_url}")

        try:
            response = requests.get(search_url, timeout=5)
            if response.status_code != 200:
                return f"⚠️ Failed to fetch data for {keyword}"

            soup = BeautifulSoup(response.text, "html.parser")

            # Extract first paragraph
            paragraphs = soup.find_all("p")
            if paragraphs:
                return paragraphs[0].get_text()
            else:
                return "⚠️ No relevant information found."

        except Exception as e:
            print(f"⚠️ Web Scraping Error: {e}")
            return "⚠️ Error while fetching data."
