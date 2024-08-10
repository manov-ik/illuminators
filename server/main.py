from flask import Flask, jsonify
import firebase_admin
from firebase_admin import credentials, db

cred = credentials.Certificate("./credentials.json")
firebase_admin.initialize_app(cred, {"databaseURL": "https://test-1b36a-default-rtdb.firebaseio.com/"})

app = Flask(__name__)

@app.route('/')
def hello():
    return "Hello World!"

if __name__ == '__main__':
    app.run(debug=True)