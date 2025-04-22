from flask import Flask, request, render_template, jsonify
from datetime import datetime
import json

app = Flask(__name__)

# Store accidents in memory (replace with database in production)
accidents = []

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/accident', methods=['POST'])
def receive_accident():
    data = request.json
    accidents.append(data)
    return jsonify({"status": "success", "message": "Accident data received"})

@app.route('/get_accidents')
def get_accidents():
    return jsonify(accidents)

if __name__ == '__main__':
    app.run(debug=True)


