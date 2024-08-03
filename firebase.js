import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3PPHW3zov9y0ZbjtYAXdEPSJFBqAIVBc",
  authDomain: "inventory-managment-4da44.firebaseapp.com",
  projectId: "inventory-managment-4da44",
  storageBucket: "inventory-managment-4da44.appspot.com",
  messagingSenderId: "617672410522",
  appId: "1:617672410522:web:12a48b3e2c36ba908a6623",
  measurementId: "G-4ZG77EY3P9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}