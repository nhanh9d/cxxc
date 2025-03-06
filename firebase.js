import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your Firebase configuration (from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyBsN0ovr2BmaohvRLCeoKgCIjPJd7VKRaQ",
  authDomain: "cxxc-94c22.firebaseapp.com",
  projectId: "cxxc-94c22",
  storageBucket: "cxxc-94c22.firebasestorage.app",
  messagingSenderId: "622023085823",
  appId: "1:622023085823:web:4518aff79e9d653a9e46ca",
  measurementId: "G-0M1VSR7GYN"
};

const app = initializeApp(firebaseConfig)

// Use AsyncStorage for Firebase Auth persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
