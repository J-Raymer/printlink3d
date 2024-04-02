import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "printlink3d.firebaseapp.com",
  projectId: "printlink3d",
  storageBucket: "printlink3d.appspot.com",
  messagingSenderId: "939443006579",
  appId: "1:939443006579:web:c20e016a8141c533f68e06",
  measurementId: "G-1KM4ZV982H",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
//const firebaseAnalytics = getAnalytics(firebaseApp);
const firebaseDb = getFirestore(firebaseApp);
const firebaseStorage = getStorage(firebaseApp);
//firebaseDb.settings({timestampsInSnapshots: true}) // enabled for testing

const auth = getAuth(firebaseApp);

export { firebaseDb, auth, firebaseStorage };
