from flask import Flask, render_template, send_from_directory, redirect, url_for, request, jsonify
import os
import logging
import web_scraper
from db_handler import DynamoDBHandler

# Configure logging
logging.basicConfig(level=logging.DEBUG, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='.')
app.secret_key = os.environ.get("SESSION_SECRET", "dev_secret_key")

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/api/scrape', methods=["POST"])
def scrape_url():
    """API endpoint to scrape content from a URL"""
    data = request.get_json()
    
    if not data or 'url' not in data:
        return jsonify({"error": "URL is required"}), 400
    
    url = data['url']
    logger.info(f"Received scrape request for URL: {url}")
    
    try:
        content = web_scraper.get_website_text_content(url)
        return jsonify({"success": True, "content": content, "url": url})
    except Exception as e:
        logger.error(f"Error scraping URL {url}: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/scrape-multiple', methods=["POST"])
def scrape_multiple_urls():
    """API endpoint to scrape content from multiple URLs"""
    data = request.get_json()
    
    if not data or 'urls' not in data or not isinstance(data['urls'], list):
        return jsonify({"error": "List of URLs is required"}), 400
    
    urls = data['urls']
    logger.info(f"Received request to scrape {len(urls)} URLs")
    
    try:
        results = web_scraper.extract_data_from_multiple_urls(urls)
        return jsonify({"success": True, "results": results})
    except Exception as e:
        logger.error(f"Error scraping multiple URLs: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/contact', methods=['POST'])
def handle_contact():
    """Handle contact form submissions"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
        
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')
    
    if not all([name, email, message]):
        return jsonify({"error": "Missing required fields"}), 400
        
    db = DynamoDBHandler()
    if db.save_contact(name, email, message):
        return jsonify({"success": True})
    return jsonify({"error": "Failed to save contact"}), 500

        return jsonify({"success": True, "results": results})
    except Exception as e:
        logger.error(f"Error scraping multiple URLs: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/<path:path>')
def serve_file(path):
    if os.path.exists(path):
        return send_from_directory('.', path)
    else:
        # Handle 404s gracefully
        return redirect(url_for('home'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)