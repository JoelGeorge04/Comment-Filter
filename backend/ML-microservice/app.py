from flask import Flask, request, jsonify
from transformers import pipeline
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the sentiment analysis pipeline
classifier = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

@app.route('/')
def home():
    return "ML Microservice is running!"

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()

    # Check for batch input first
    texts = data.get('texts')
    if texts:
        if not isinstance(texts, list) or len(texts) == 0:
            return jsonify({"error": "Invalid 'texts' format or empty list"}), 400
        
        results = classifier(texts)  # batch prediction
        return jsonify(results)

    # Fallback to single text input
    text = data.get('text')
    if not text:
        return jsonify({"error": "No text or texts provided"}), 400
    
    result = classifier(text)
    return jsonify(result[0])

if __name__ == '__main__':
    app.run(port=5001)
