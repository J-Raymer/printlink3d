import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
    apiKey: "AIzaSyAL-MdgOol7KOcEXtyaZ4mvkaLRSvqRsRk",
    authDomain: "printlink3d.firebaseapp.com",
    projectId: "printlink3d",
    storageBucket: "printlink3d.appspot.com",
    messagingSenderId: "939443006579",
    appId: "1:939443006579:web:c20e016a8141c533f68e06",
    measurementId: "G-1KM4ZV982H"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
//const firebaseAnalytics = getAnalytics(firebaseApp);
const firebaseDb = getFirestore(firebaseApp);
//firebaseDb.settings({timestampsInSnapshots: true}) // enabled for testing

export { firebaseDb };