// v9 compat packages are API compatible with v8 code
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAd7VH6JdTwAZJdFzEAR-cBdQHY1SdGFno",
  authDomain: "graphql-react-f0cf8.firebaseapp.com",
  projectId: "graphql-react-f0cf8",
  storageBucket: "graphql-react-f0cf8.appspot.com",
//   messagingSenderId: "797544864665",
  appId: "1:797544864665:web:2ef7834475a368b9175108",
  measurementId: "G-ED4E58N0FB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth()
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();