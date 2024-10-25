import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAOj3OTVC2RRCZt1dg109K6IpdTx1h4lh4',
  authDomain: 'cxxc-app.firebaseapp.com',
  databaseURL: 'https://cxxc-app.firebaseio.com',
  projectId: 'cxxc-app',
  storageBucket: 'cxxc-app.appspot.com',
  messagingSenderId: 'sender-id',
  appId: 'app-id',
  measurementId: 'G-measurement-id',
};

const app = initializeApp(firebaseConfig);
export default app;
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

