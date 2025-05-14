import trafilatura
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def get_website_text_content(url: str) -> str:
    """
    This function takes a url and returns the main text content of the website.
    The text content is extracted using trafilatura and easier to understand.
    The results is not directly readable, better to be summarized by LLM before consumed
    by the user.

    Some common website to crawl information from:
    MLB scores: https://www.mlb.com/scores/YYYY-MM-DD
    News: https://news.google.com/
    """
    try:
        # Send a request to the website
        logger.info(f"Fetching content from URL: {url}")
        downloaded = trafilatura.fetch_url(url)
        
        if downloaded is None:
            logger.error(f"Failed to download content from URL: {url}")
            return "Error: Could not download content from the specified URL."
        
        # Extract main text content
        text = trafilatura.extract(downloaded)
        
        if text is None or text.strip() == "":
            logger.warning(f"No text content extracted from URL: {url}")
            return "No text content could be extracted from the specified URL."
        
        logger.info(f"Successfully extracted {len(text)} characters of content")
        return text
    
    except Exception as e:
        logger.error(f"Error while scraping {url}: {str(e)}")
        return f"Error: {str(e)}"

def extract_data_from_multiple_urls(urls: list) -> dict:
    """
    Extract text content from multiple URLs
    
    Args:
        urls (list): List of URLs to scrape
        
    Returns:
        dict: Dictionary with URL as key and extracted content as value
    """
    results = {}
    
    for url in urls:
        try:
            results[url] = get_website_text_content(url)
            logger.info(f"Successfully processed URL: {url}")
        except Exception as e:
            results[url] = f"Error: {str(e)}"
            logger.error(f"Failed to process URL: {url}, Error: {str(e)}")
    
    return results

# If the module is run directly, demonstrate its functionality
if __name__ == "__main__":
    # Example usage
    demo_url = "https://en.wikipedia.org/wiki/Logistics"
    print(f"Scraping content from {demo_url}...")
    content = get_website_text_content(demo_url)
    print(f"Extracted {len(content)} characters.")
    print("First 500 characters of content:")
    print(content[:500] + "...")