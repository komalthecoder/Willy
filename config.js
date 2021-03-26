import * as firebase from 'firebase'
require('@firebase/firestore')

var firebaseConfig = {
  apiKey: "AIzaSyCH8gMzxU591jA-7ar72x3pUjjhCMDSHbM",
  authDomain: "willy-b88e6.firebaseapp.com",
  projectId: "willy-b88e6",
  storageBucket: "willy-b88e6.appspot.com",
  messagingSenderId: "137964038763",
  appId: "1:137964038763:web:a922c0d6696d9210cb9f2e"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();