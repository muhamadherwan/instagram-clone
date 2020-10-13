import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAoWj5kaqU1NUkyh-hU1q_nwnVe-_oP_Jw",
    authDomain: "instagram-clone-e927a.firebaseapp.com",
    databaseURL: "https://instagram-clone-e927a.firebaseio.com",
    projectId: "instagram-clone-e927a",
    storageBucket: "instagram-clone-e927a.appspot.com",
    messagingSenderId: "638810643564",
    appId: "1:638810643564:web:7d21bb54e35e61a5710c49",
    measurementId: "G-XNG9MBNDRT"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };