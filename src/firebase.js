// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration for DEMO project
// const firebaseConfig = {
//   apiKey: "AIzaSyAkynZXcRPPoz1NusomkKuYq79daEZOtAE",
//   authDomain: "fir-edf55.firebaseapp.com",
//   projectId: "fir-edf55",
//   storageBucket: "fir-edf55.appspot.com",
//   messagingSenderId: "1012664225969",
//   appId: "1:1012664225969:web:0584e12032618849a7d290"
// };


// MEDIK PROJECT CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyB7YXpsH5mayeZ-81eMJyXhk1tNxCMQrrw",
  authDomain: "cloudfunctions-b7d1b.firebaseapp.com",
  projectId: "cloudfunctions-b7d1b",
  storageBucket: "cloudfunctions-b7d1b.appspot.com",
  messagingSenderId: "54675965409",
  appId: "1:54675965409:web:600ce4cf9f81b4a540bea0",
  measurementId: "G-6EV99GH04E"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default getFirestore();