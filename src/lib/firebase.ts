
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "studio-5455551154-a5d2e",
  "appId": "1:901983621273:web:852f22e2b3921e03dc2808",
  "apiKey": "AIzaSyAMn8ElSQn1Zbu6bY2vJNdck8VnBH2Og4c",
  "authDomain": "studio-5455551154-a5d2e.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "901983621273"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, app };
