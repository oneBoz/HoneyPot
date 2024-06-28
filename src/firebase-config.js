// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAxOq0gmjeDQkbgtcHDPTwm6GYxpugqP3U",
//   authDomain: "learn-aa560.firebaseapp.com",
//   projectId: "learn-aa560",
//   storageBucket: "learn-aa560.appspot.com",
//   messagingSenderId: "707469765507",
//   appId: "1:707469765507:web:8899f6f43f6924e76ba4b6",
//   measurementId: "G-H2ZNRVFRFB"
// };

const firebaseConfig = {
  apiKey: "AIzaSyA2qE0ys3LFbwUBqRV80J85fzQoofT9_mc",
  authDomain: "learn02-29266.firebaseapp.com",
  projectId: "learn02-29266",
  storageBucket: "learn02-29266.appspot.com",
  messagingSenderId: "1064888914247",
  appId: "1:1064888914247:web:82927a5b4139bf0cf63c62",
  measurementId: "G-DG73JC8SCH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
export const db = getFirestore(app);