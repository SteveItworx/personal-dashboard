// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfU7N2kHTsBINcXny0CMvWXPW5Cnzirec",
  authDomain: "personal-dashboard-5f2e2.firebaseapp.com",
  projectId: "personal-dashboard-5f2e2",
  storageBucket: "personal-dashboard-5f2e2.firebasestorage.app",
  messagingSenderId: "376001874694",
  appId: "1:376001874694:web:9eea0fb525bb539a1b2c87"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);