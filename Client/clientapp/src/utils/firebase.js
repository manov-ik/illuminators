// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvsqDKZkeusySWw91SzmSRvXHBhnJR35Y",
  authDomain: "esp8266-hr-spo2.firebaseapp.com",
  databaseURL: "https://esp8266-hr-spo2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "esp8266-hr-spo2",
  storageBucket: "esp8266-hr-spo2.appspot.com",
  messagingSenderId: "179176541793",
  appId: "1:179176541793:web:eca5ee9b22afe459bd2420",
  measurementId: "G-LZNJ24GX25"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();