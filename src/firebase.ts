// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCXsVQjoD9uYEu-EqO3ETaVtjpum61vm5I",
  authDomain: "insta-clone-cp-c9859.firebaseapp.com",
  projectId: "insta-clone-cp-c9859",
  storageBucket: "insta-clone-cp-c9859.appspot.com",
  messagingSenderId: "551712881024",
  appId: "1:551712881024:web:89d70204deeb89c2f4a965",
  measurementId: "G-ZR63J6977R",
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

export { db, auth, storage };
