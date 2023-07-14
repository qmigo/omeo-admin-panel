// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkynZXcRPPoz1NusomkKuYq79daEZOtAE",
  authDomain: "fir-edf55.firebaseapp.com",
  projectId: "fir-edf55",
  storageBucket: "fir-edf55.appspot.com",
  messagingSenderId: "1012664225969",
  appId: "1:1012664225969:web:0584e12032618849a7d290"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default getFirestore();