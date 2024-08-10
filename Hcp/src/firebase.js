import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:"AIzaSyBvsqDKZkeusySWw91SzmSRvXHBhnJR35Y",
  authDomain: "esp8266-hr-spo2.firebaseapp.com",
  projectId: "esp8266-hr-spo2",
  storageBucket: "esp8266-hr-spo2.appspot.com",
  messagingSenderId: "179176541793",
  appId: "1:179176541793:web:eca5ee9b22afe459bd2420",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
