# ml_model/pinterest_scraper.py
from bs4 import BeautifulSoup
import requests
from pinterest import Pinterest
import json
import time

class PinterestScraper:
    def __init__(self, api_key=None):
        """
        Initialize Pinterest scraper
        Args:
            api_key: Pinterest API key (optional)
        """
        self.api_key = api_key
        if api_key:
            self.pinterest = Pinterest(api_key)
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
    def search_educational_content(self, query, max_results=10):
        """
        Search Pinterest for educational content
        Args:
            query: Search query string
            max_results: Maximum number of results to return
        Returns:
            list: Educational content items
        """
        if self.api_key:
            return self._api_search(query, max_results)
        else:
            return self._web_search(query, max_results)
            
    def _api_search(self, query, max_results):
        """Search using Pinterest API"""
        try:
            results = self.pinterest.search_pins(
                query=f"educational {query}",
                limit=max_results
            )
            
            processed_results = []
            for pin in results:
                processed_results.append({
                    'title': pin.get('title', ''),
                    'description': pin.get('description', ''),
                    'image_url': pin.get('image', {}).get('original', {}).get('url', ''),
                    'link': pin.get('link', ''),
                    'source': 'Pinterest API'
                })
                
            return processed_results
            
        except Exception as e:
            print(f"API search error: {e}")
            return []
            
    def _web_search(self, query, max_results):
        """Fallback web scraping method"""
        try:
            url = f"https://www.pinterest.com/search/pins/?q={query}%20educational"
            response = requests.get(url, headers=self.headers)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            results = []
            pins = soup.find_all('div', {'class': 'Pin'})  # Adjust selector based on current Pinterest structure
            
            for pin in pins[:max_results]:
                try:
                    title = pin.find('h3').text if pin.find('h3') else ''
                    description = pin.find('p').text if pin.find('p') else ''
                    image = pin.find('img')['src'] if pin.find('img') else ''
                    link = pin.find('a')['href'] if pin.find('a') else ''
                    
                    results.append({
                        'title': title,
                        'description': description,
                        'image_url': image,
                        'link': f"https://www.pinterest.com{link}",
                        'source': 'Web Scraping'
                    })
                except Exception as e:
                    continue
                    
            return results
            
        except Exception as e:
            print(f"Web scraping error: {e}")
            return []
            
    def get_related_resources(self, category):
        """
        Get educational resources related to a category
        Args:
            category: Category name (e.g., 'art_supplies', 'electronics')
        Returns:
            list: Related educational resources
        """
        search_terms = {
            'art_supplies': ['art tutorials', 'painting techniques', 'drawing lessons'],
            'electronics': ['arduino projects', 'electronics tutorials', 'circuit diagrams'],
            'lab_equipment': ['science experiments', 'lab safety', 'chemistry demonstrations'],
            'educational_materials': ['study tips', 'learning resources', 'educational activities']
        }
        
        terms = search_terms.get(category, [category])
        results = []
        
        for term in terms:
            results.extend(self.search_educational_content(term, max_results=3))
            time.sleep(1)  # Respect rate limits
            
        return results