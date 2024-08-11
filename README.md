# Smart Wearable Device - Pulse Pro


Pulse Pro is an IoT project for health monitoring. It features a hardware device that measures SpO2, temperature, and heart rate, with data displayed and analyzed in the Pulse Pro app, offering users insights and personalized health recommendations.

## Architecture
  ![Frame 1](https://github.com/user-attachments/assets/2e29b639-02fd-415e-becb-bd4cdc6bcb5c)

## Features

### Pulse Pro Client App:

#### Work Flow: 
The Pulse Pro client app uses React for the frontend and Firebase for the backend to provide a robust health monitoring system. After user authentication via Firebase, the app displays real-time pulse rate and oxygen levels, fetched from an ESP8266 microcontroller, on a dynamic dashboard. The app sends this data to a Flask server, where the Gemini model generates actionable health insights, helping users better understand their health metrics.

##### Real-Time Health Monitoring:
Instantly view measurements of SpO2, temperature, and heart rate.
##### Data Analysis:
Track and analyze health data trends over time to gain insights into your overall well-being.
##### Personalized Recommendations: 
Receive tailored food recommendations based on your heart and pulse rate.
##### Health Tracking: 
Continuously monitor vital signs to stay informed about your health status.


### Pulse Pro Care Provider App:

#### Work Flow: 
HCPs can add users to the Pulse Pro system and access their information using Firestore Database, while Firebase Realtime Database delivers real-time health updates. This setup ensures that HCPs can monitor their clients' health metrics efficiently and respond promptly to any changes.

##### Client Health Monitoring: 
Healthcare providers (HCPs) can access and monitor the health data of their clients.
##### Comprehensive Dashboard: 
View all client data in one place, enabling efficient health management.
##### SOS Alerts: 
Immediate notifications for HCPs when a client's health metrics indicate potential risks.
##### Recommendation System: 
Provide clients with diet and exercise recommendations to support their health goals.


### Hardware Specifications

#### Data Enhancement
The autoencoder model is designed for anomaly detection by learning a compact representation of input data. It consists of an input layer, an encoder that compresses data with ReLU activation, and a decoder that reconstructs it using sigmoid activation. Trained with Mean Squared Error and the Adam optimizer, the model minimizes reconstruction errors. A threshold set at the 95th percentile of these errors flags data points above it as anomalies, making the autoencoder effective for identifying deviations from normal patterns.

##### SpO2 Sensor: 
Measures blood oxygen levels.
##### Temperature Sensor: 
Monitors body temperature.
##### Heart Rate Sensor: 
Tracks heart rate in real-time.
