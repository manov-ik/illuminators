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


const int pulseLED = D4; // Must be on a PWM-capable pin (GPIO 2)
const int readLED = LED_BUILTIN; // Onboard LED (GPIO 16)

void setup() {
  Serial.begin(115200); // Initialize serial communication at 115200 bits per second

  pinMode(pulseLED, OUTPUT);
  pinMode(readLED, OUTPUT);

  // Initialize sensor
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) // Use default I2C port, 400kHz speed
  {
    Serial.println(F("MAX30105 was not found. Please check wiring/power."));
    while (1);
  }

  byte ledBrightness = 60; // Options: 0=Off to 255=50mA
  byte sampleAverage = 1; // Set sample average to 1 to avoid averaging
  byte ledMode = 2; // Options: 1 = Red only, 2 = Red + IR, 3 = Red + IR + Green
  byte sampleRate = 100; // Options: 50, 100, 200, 400, 800, 1000, 1600, 3200
  int pulseWidth = 411; // Options: 69, 118, 215, 411
  int adcRange = 4096; // Options: 2048, 4096, 8192, 16384

  particleSensor.setup(ledBrightness, sampleAverage, ledMode, sampleRate, pulseWidth, adcRange); // Configure sensor with these settings
}

void loop() {
  bufferLength = 100; // buffer length of 100 stores 4 seconds of samples running at 25sps

  // read 100 samples and display raw data and calculated values
  for (byte i = 0; i < bufferLength; i++) {
    while (particleSensor.available() == false) // wait for new data
      particleSensor.check(); // Check the sensor for new data

    redBuffer[i] = particleSensor.getRed();
    irBuffer[i] = particleSensor.getIR();
    particleSensor.nextSample(); // We're finished with this sample, so move to the next sample

    // Display raw data
    Serial.print(F("red="));
    Serial.print(redBuffer[i], DEC);
    Serial.print(F(", ir="));
    Serial.println(irBuffer[i], DEC);
  }

  // calculate heart rate and SpO2 after reading 100 samples
  maxim_heart_rate_and_oxygen_saturation(irBuffer, bufferLength, redBuffer, &spo2, &validSPO2, &heartRate, &validHeartRate);

  // Display calculated values
  Serial.print(F("HR="));
  Serial.print(heartRate, DEC);

  Serial.print(F(", HRvalid="));
  Serial.print(validHeartRate, DEC);

  Serial.print(F(", SPO2="));
  Serial.print(spo2, DEC);

  Serial.print(F(", SPO2Valid="));
  Serial.println(validSPO2, DEC);

  // Wait for 3 seconds before the next measurement
  delay(3000);  // 3 seconds delay
}

