from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, db
import pandas as pd
import numpy as np
from tensorflow import keras
from keras.models import Model
from keras.layers import Input, Dense
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
import pickle
from keras.models import load_model
import google.generativeai as genai
import schedule
import time
from datetime import datetime

app = Flask(__name__)

def download_data():
    path = "./credentials.json"  # Replace with the path to your service account key (json file)
    cred = credentials.Certificate(path)
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://esp8266-hr-spo2-default-rtdb.asia-southeast1.firebasedatabase.app/'  # Replace with your database URL
    })

    # Reference to the specific path in Firebase
    ref = db.reference('HealthData')

    # Fetch all data
    data = ref.get()

    # Convert the data to a DataFrame
    df = pd.DataFrame(data).T
    df.to_excel("excel.xlsx")


def clean_data_set():
    df = pd.read_excel("excel.xlsx")
    df.dropna(inplace=True)
    df = df[df["ValidHeartRate"] != 0]
    df = df[df["ValidSpO2"] != 0]
    df.columns = ['Time', 'HeartRate', 'SpO2', 'ValidHeartRate', 'ValidSpO2']
    c_df = df
    return c_df


def save_model(autoencoder, scaler, threshold, model_path, scaler_path, threshold_path):
    # Save the trained autoencoder model
    autoencoder.save(model_path)

    # Save the scaler
    with open(scaler_path, 'wb') as f:
        pickle.dump(scaler, f)

    # Save the threshold
    with open(threshold_path, 'wb') as f:
        pickle.dump(threshold, f)


def train_autoencoder(df, encoding_dim=2, epochs=50, batch_size=32, test_size=0.2, random_state=42):
    download_data()  # downloading data from firebase
    df = clean_data_set()  # cleaning data
    # Prepare the features
    features = df[['HeartRate', 'SpO2', 'ValidHeartRate', 'ValidSpO2']]

    # Normalize the data
    scaler = MinMaxScaler()
    features_scaled = scaler.fit_transform(features)

    # Split data into training and testing sets
    X_train, X_test = train_test_split(features_scaled, test_size=test_size, random_state=random_state)

    # Define the autoencoder architecture
    input_dim = X_train.shape[1]
    input_layer = Input(shape=(input_dim,))
    encoder = Dense(encoding_dim, activation="relu")(input_layer)
    decoder = Dense(input_dim, activation="sigmoid")(encoder)

    autoencoder = Model(inputs=input_layer, outputs=decoder)
    autoencoder.compile(optimizer="adam", loss="mse")

    # Train the autoencoder
    autoencoder.fit(X_train, X_train, epochs=epochs, batch_size=batch_size, validation_data=(X_test, X_test), verbose=1)

    # Calculate reconstruction error on the training data to set a threshold
    X_train_pred = autoencoder.predict(X_train)
    train_mse = np.mean(np.power(X_train - X_train_pred, 2), axis=1)

    # Set the threshold as the 95th percentile of the reconstruction error
    threshold = np.percentile(train_mse, 95)

    save_model(autoencoder, scaler, threshold, "autoencoder_model.h5", "scaler.pkl", "threshold.pkl")


def predict_anomaly(autoencoder, scaler, threshold, new_data):
    # Preprocess the new data (normalize using the same scaler)
    new_data_scaled = scaler.transform(new_data)

    # Predict the reconstructed data using the trained autoencoder
    new_data_pred = autoencoder.predict(new_data_scaled)

    # Calculate the reconstruction error
    reconstruction_error = np.mean(np.power(new_data_scaled - new_data_pred, 2), axis=1)

    # Determine if it's an anomaly based on the threshold
    is_anomaly = reconstruction_error > threshold

    return is_anomaly, reconstruction_error


def load_model_and_scaler(model_path, scaler_path, threshold_path):
    # Load the trained autoencoder model
    autoencoder = load_model(model_path)

    # Load the scaler
    with open(scaler_path, 'rb') as f:
        scaler = pickle.load(f)

    # Load the threshold
    with open(threshold_path, 'rb') as f:
        threshold = pickle.load(f)

    return autoencoder, scaler, threshold


def generate_insights(spo2, heartrate):
    GOOGLE_API_KEY = "AIzaSyCKC_MF8UvUKjXVg1eFeuUlsXf6d4OKCH0"
    genai.configure(api_key=GOOGLE_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")
    req = "this is my spo2 level " + str(spo2) + " and this is my heart rate " + str(heartrate) + " give me some insights like what food to eat, what to make it as normal if this is abnormal? give response in 30 to 50 words only"
    response = model.generate_content(str(req))
    return response.text


# API route for training the model
@app.route('/train', methods=['POST'])
def train():
    df = clean_data_set()  # Clean the data
    train_autoencoder(df)  # Train the model
    return jsonify({"message": "Training completed"})


# API route for making predictions
@app.route('/predict', methods=['POST'])
def predict():
    autoencoder, scaler, threshold = load_model_and_scaler("autoencoder_model.h5", "scaler.pkl", "threshold.pkl")
    new_data = request.json  # Get the input data from the POST request
    df_new_data = pd.DataFrame(new_data)
    is_anomaly, reconstruction_error = predict_anomaly(autoencoder, scaler, threshold, df_new_data)

    # Return the results as JSON
    return jsonify({"reconstruction_error": reconstruction_error.tolist(), "is_anomaly": is_anomaly.tolist()})


# API route for generating insights
@app.route('/insights', methods=['POST'])
def insights():
    data = request.json
    spo2 = data['spo2']
    heartrate = data['heartrate']
    insights = generate_insights(spo2, heartrate)
    return jsonify({"insights": insights})


if __name__ == '__main__':
    # Schedule the training function to run daily at 12:00 PM
    schedule.every().day.at("12:00").do(train_daily)

    # Start Flask app
    app.run(debug=True, use_reloader=False)

    # Keep the schedule running in the background
    while True:
        schedule.run_pending()
        time.sleep(1)
