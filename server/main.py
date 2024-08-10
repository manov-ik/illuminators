from flask import Flask, jsonify, request
import pandas as pd
from ml_server import download_data, clean_data_set, load_model_and_scaler, predict_anomaly


app = Flask(__name__)

# Endpoint to trigger data download and cleaning
@app.route('/api/download-data', methods=['GET'])
def api_download_data():
    download_data()
    return jsonify({"message": "Data downloaded successfully!"})

@app.route('/api/clean-data', methods=['GET'])
def api_clean_data():
    df = clean_data_set()
    return jsonify({"message": "Data cleaned successfully!", "data": df.to_dict()})

# Endpoint to load the model and make predictions
@app.route('/api/predict', methods=['POST'])
def api_predict():
    # Load the model, scaler, and threshold
    autoencoder, scaler, threshold = load_model_and_scaler("autoencoder_model.h5", "scaler.pkl", "threshold.pkl")
    
    # Assume new data is sent as JSON in the POST request
    new_data_json = request.get_json()
    new_data = pd.DataFrame(new_data_json)
    
    # Predict anomalies
    is_anomaly, reconstruction_error = predict_anomaly(autoencoder, scaler, threshold, new_data)
    
    # Add results to the new data
    new_data['reconstruction_error'] = reconstruction_error
    new_data['is_anomaly'] = is_anomaly
    
    return jsonify(new_data.to_dict(orient='records'))

if __name__ == "__main__":
    app.run(debug=True)
