import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCMyhPJLKPmiYgfNSk2bEdx3MpcZHlzBhs",
  authDomain: "insta-clone-cp-a4ccd.firebaseapp.com",
  projectId: "insta-clone-cp-a4ccd",
  storageBucket: "insta-clone-cp-a4ccd.appspot.com",
  messagingSenderId: "1074562439244",
  appId: "1:1074562439244:web:f810e710551ef9356ffce9",
  measurementId: "G-G5TCRM1ZY4"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

export { db, auth, storage };
