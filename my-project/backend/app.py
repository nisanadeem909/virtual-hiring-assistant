# app.py
from flask import Flask, jsonify
from pymongo import MongoClient

app = Flask(__name__)

mongo_uri = 'mongodb+srv://nisanadeem90:mbxoMyyW674AtFy6@cluster0.43kxzvt.mongodb.net/'

client = MongoClient(mongo_uri)
db = client.vha  # Replace with your actual database name
collection = db.test  # Replace with your actual collection name

try:
    # Access a dummy collection to test the connection
    _ = client.vha.test.find_one()
    print("Connected to MongoDB!")
except Exception as e:
    print("Failed to connect to MongoDB:", e)


if __name__ == '__main__':
    app.run(debug=True)
