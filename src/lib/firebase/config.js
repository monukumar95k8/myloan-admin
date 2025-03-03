// Import the functions you need from the SDKs you need
import { initializeApp, cert } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCZUaQFbVogjQMizzLJPK-vvy2DgNJ8btM",
    authDomain: "myloan-ca95e.firebaseapp.com",
    projectId: "myloan-ca95e",
    storageBucket: "myloan-ca95e.firebasestorage.app",
    messagingSenderId: "257049913872",
    appId: "1:257049913872:web:f40232cba2bc63f588f895"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);


