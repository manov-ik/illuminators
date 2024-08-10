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

/* Initialize MAX30105 sensor */
MAX30105 particleSensor;

#define MAX_BRIGHTNESS 255

uint32_t irBuffer[100]; // infrared LED sensor data
uint32_t redBuffer[100];  // red LED sensor data

int32_t bufferLength; // data length
int32_t spo2; // SPO2 value
int8_t validSPO2; // indicator to show if the SPO2 calculation is valid
int32_t heartRate; // heart rate value
int8_t validHeartRate; // indicator to show if the heart rate calculation is valid


