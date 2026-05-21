

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "intervuiq-eea65.firebaseapp.com",
  projectId: "intervuiq-eea65",
  storageBucket: "intervuiq-eea65.firebasestorage.app",
  messagingSenderId: "257304886523",
  appId: "1:257304886523:web:dac3cb6a43723023a9c45e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };