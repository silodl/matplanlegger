// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from '@firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsNHlaldrMZNP7d_oI49DJViPxlaO66aQ",
  authDomain: "matplanlegger-9e24c.firebaseapp.com",
  projectId: "matplanlegger-9e24c",
  storageBucket: "matplanlegger-9e24c.appspot.com",
  messagingSenderId: "756028486578",
  appId: "1:756028486578:web:0afb4d021dedff40aeeaab",
  measurementId: "G-B3CN7BJ0SN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
export {db, auth}