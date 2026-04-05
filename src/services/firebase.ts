// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYMOwD__U2Ul19GJFLwHRpXLt3TOXf9Do",
  authDomain: "portfoliogabrielca.firebaseapp.com",
  projectId: "portfoliogabrielca",
  storageBucket: "portfoliogabrielca.firebasestorage.app",
  messagingSenderId: "709086026391",
  appId: "1:709086026391:web:4da780ce5af05af6e8a7d2",
  measurementId: "G-DS3QEMRV7H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
export default app
const analytics = getAnalytics(app);