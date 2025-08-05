// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9JoZstj_K1TfATMy-rHuT-A5WI3XhXds",
  authDomain: "chat-b8516.firebaseapp.com",
  projectId: "chat-b8516",
  storageBucket: "chat-b8516.firebasestorage.app",
  messagingSenderId: "916282511514",
  appId: "1:916282511514:web:ef42b6bca24c838c8a0f23",
  measurementId: "G-GW88PHC99V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };