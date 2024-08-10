#include <Wire.h>
#include "MAX30105.h"
#include "spo2_algorithm.h"
#include <Firebase_ESP_Client.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

#if defined(ESP32)
#include <WiFi.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#endif

/* Define WiFi credentials */
#define WIFI_SSID "your_ssid"
#define WIFI_PASSWORD "ssid_password"

/* Define Firebase credentials */
#define API_KEY "your_appi_key"
#define USER_EMAIL "auth_email"
#define USER_PASSWORD "auth_email_password"
#define DATABASE_URL "database_url"

/* Initialize MAX30102 sensor */
MAX30105 particleSensor;

#define MAX_BRIGHTNESS 255

uint32_t irBuffer[100]; // infrared LED sensor data
uint32_t redBuffer[100];  // red LED sensor data

int32_t bufferLength; // data length
int32_t spo2; // SPO2 value
int8_t validSPO2; // indicator to show if the SPO2 calculation is valid
int32_t heartRate; // heart rate value
int8_t validHeartRate; // indicator to show if the heart rate calculation is valid

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 19800, 60000); // Get time from NTP server

unsigned long sendDataPrevMillis = 0;

void setup() {
  Serial.begin(115200);

  // Initialize WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());

  // Initialize Firebase
  config.api_key = API_KEY;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  config.database_url = DATABASE_URL;
  Firebase.reconnectNetwork(true);
  fbdo.setBSSLBufferSize(4096, 1024);
  fbdo.setResponseSize(2048);
  Firebase.begin(&config, &auth);
  Firebase.setDoubleDigits(5);

  // Initialize NTP Client for time
  timeClient.begin();

  // Initialize MAX30105 sensor
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    Serial.println(F("MAX30105 was not found. Please check wiring/power."));
    while (1);
  }

  byte ledBrightness = 60;
  byte sampleAverage = 1;
  byte ledMode = 2;
  byte sampleRate = 100;
  int pulseWidth = 411;
  int adcRange = 4096;
  particleSensor.setup(ledBrightness, sampleAverage, ledMode, sampleRate, pulseWidth, adcRange);
}

void loop() {
  bufferLength = 100;
  for (byte i = 0; i < bufferLength; i++) {
    while (particleSensor.available() == false)
      particleSensor.check();

    redBuffer[i] = particleSensor.getRed();
    irBuffer[i] = particleSensor.getIR();
    particleSensor.nextSample();
  }

  maxim_heart_rate_and_oxygen_saturation(irBuffer, bufferLength, redBuffer, &spo2, &validSPO2, &heartRate, &validHeartRate);

  // Get the current time from NTP server
  timeClient.update();
  String formattedTime = timeClient.getFormattedTime();
  
  // Use formatted time as a unique path in Firebase
  String path = "/HealthData/" + formattedTime;

  if (Firebase.ready() && (millis() - sendDataPrevMillis > 10000 || sendDataPrevMillis == 0)) {
    sendDataPrevMillis = millis();

    if (Firebase.RTDB.setInt(&fbdo, path + "/HeartRate", heartRate)) {
      Serial.print("Heart Rate stored at: ");
      Serial.println(path + "/HeartRate");
    } else {
      Serial.println("FAILED to store Heart Rate: " + fbdo.errorReason());
    }

    if (Firebase.RTDB.setInt(&fbdo, path + "/ValidHeartRate", validHeartRate)) {
      Serial.print("Valid Heart Rate stored at: ");
      Serial.println(path + "/ValidHeartRate");
    } else {
      Serial.println("FAILED to store Valid Heart Rate: " + fbdo.errorReason());
    }

    if (Firebase.RTDB.setInt(&fbdo, path + "/SpO2", spo2)) {
      Serial.print("SpO2 stored at: ");
      Serial.println(path + "/SpO2");
    } else {
      Serial.println("FAILED to store SpO2: " + fbdo.errorReason());
    }

    if (Firebase.RTDB.setInt(&fbdo, path + "/ValidSpO2", validSPO2)) {
      Serial.print("Valid SpO2 stored at: ");
      Serial.println(path + "/ValidSpO2");
    } else {
      Serial.println("FAILED to store Valid SpO2: " + fbdo.errorReason());
    }
  }

  delay(10000);  // Delay for the next measurement
}
