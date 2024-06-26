import { addDoc, collection, getDocs, query, where, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseStorage } from "./firebase/firebase";
import { firebaseDb } from "./firebase/firebase";

export async function addJob(db, DocData) {
  const docRef = await addDoc(collection(db, "Jobs"), DocData);
  return docRef;
}

export async function addRating(db, rating) {
  const docRef = await addDoc(collection(db, "Ratings"), rating);
  return docRef;
}

export async function getReviewsForUser(db, targetUserUid) {
  const docRef = collection(db, "Ratings");
  const q = query(docRef, where("targetUserUid", "==", targetUserUid));
  const querySnapshot = await getDocs(q);
  const ratings = querySnapshot.docs.map(doc => doc.data());
  return ratings;
}

// TODO remove this function (not used)
export async function getAllJobs(db) {
  const jobCollectionRef = collection(db, "Jobs");
  const querySnapshot = await getDocs(jobCollectionRef);

  const jobs = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    jobs.push({
      infill: data.Fill_Percentage,
      material: data.Material,
      distance: data.Radius,
      fileName: data.STL,
      name: data.Name,
      email: data.Email,
    });
  });

  return jobs;
}

export async function getJob(field, comp, value, db) {
  const job = collection(db, "Jobs");
  const q = query(job, where(field, comp, value));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
}

export async function getCustomer(field, comp, value, db) {
  const job = collection(db, "Customers");
  const q = query(job, where(field, comp, value));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
}

export async function getPrinters(field, comp, value, db) {
  const job = collection(db, "Printers");
  const q = query(job, where(field, comp, value));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
}

export async function getMaterials(db) {
  const docRef = collection(db, "Materials");
  const querySnapshot = await getDocs(docRef);
  const materials = querySnapshot.docs.map(doc => doc.data());
  return materials;
}

export async function getColors(db) {
  const docRef = collection(db, "Colors");
  const querySnapshot = await getDocs(docRef);
  const colors = querySnapshot.docs.map(doc => doc.data().Color);
  return colors;
}

export async function addBid(jobId, bid) {
  const bidHistoryRef = collection(firebaseDb, `Jobs/${jobId}/BidHistory`);
  return addDoc(bidHistoryRef, bid);
}

export function updateBid(jobId, bidId, update) {
  const bidRef = doc(firebaseDb, `Jobs/${jobId}/BidHistory/${bidId}`);
  return updateDoc(bidRef, update);
}

export async function getActiveBids(jobId) {
  const bidHistoryRef = collection(firebaseDb, `Jobs/${jobId}/BidHistory`);
  const bidsQuery = query(bidHistoryRef, where("Active", "==", true), orderBy("Timestamp", "desc"));
      
  const bidsSnapshot = await getDocs(bidsQuery);
  const bids = []
      
  bidsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const bid = {
          id: doc.id,
          uid: data.PrinterUid,
          amount: Number(data.Amount).toFixed(2),
          timestamp: data.Timestamp
      }
      bids.push(bid);
  });

  return bids;
}

export function bidListener(jobId, snapshotCallback, uid=null) {
  const bidHistoryRef = collection(firebaseDb, `Jobs/${jobId}/BidHistory`);
  let bidsQuery = null;
  (uid === null) ? 
    bidsQuery = query(bidHistoryRef, where("Active", "==", true), orderBy("Timestamp", "desc")) :
    bidsQuery = query(bidHistoryRef, where("Active", "==", true), where("PrinterUid", "==", uid));
  const unsubscribe = onSnapshot(bidsQuery, (snapshot) => {snapshotCallback(snapshot)});
  return unsubscribe;
}

export function updateJob(jobId, update) {
  const jobRef = doc(firebaseDb, `Jobs/${jobId}`);
  return updateDoc(jobRef, update);
}

export async function getThumbnail(jobId) {
  return new Promise((resolve, reject) => {
    getDownloadURL(ref(firebaseStorage, `images/${jobId}.png`))
      .then((url) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = () => {
          const blob = xhr.response;
          const reader = new FileReader();
          reader.readAsDataURL(blob);

          reader.onloadend = function () {
            resolve(reader.result);
          }
        };
        xhr.open('GET', url);
        xhr.send();
      })
      .catch((error) => {
        console.error("Error fetching thumbnail: ", error);
        reject(error);
      })
  })
}

export async function getFile(jobName, jobId) {
  try {
    const fileRef = ref(firebaseStorage, `print-files/${jobName + "_" + jobId}.stl`);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw error;
  }
}

export async function uploadThumbnail(thumbnail, id) {
  var storageRef = ref(firebaseStorage, `images/${id}.png`)
  const thumbnailResource = await fetch(thumbnail);
  const thumbnailBlob = await thumbnailResource.blob();
  return uploadBytes(storageRef, thumbnailBlob);
};

export async function uploadStl(file, jobName, jobId) {
  var storageRef = ref(firebaseStorage, `print-files/${jobName + "_" + jobId}.stl`);
  return uploadBytes(storageRef, file);
}

export async function getUserRatingStats(userId) {
  const ratingRef = collection(firebaseDb, `Ratings`);
  const ratingQuery = query(ratingRef, where("targetUserUid", "==", userId));
      
  const ratingSnapshot = await getDocs(ratingQuery);

  const ratingStats = {
    averageAll: 0,
    averageCommunication: 0,
    averageExchange: 0,
    totalRatings: 0,
  }
      
  ratingSnapshot.docs.forEach((doc) => {
    const data = doc.data();
    ratingStats.averageAll += data.averageRating;
    ratingStats.averageCommunication += data.communicationRating;
    ratingStats.averageExchange += data.exchangeRating;
    ratingStats.totalRatings += 1;
  });

  ratingStats.averageAll /= ratingStats.totalRatings;
  ratingStats.averageCommunication /= ratingStats.totalRatings;
  ratingStats.averageExchange /= ratingStats.totalRatings;


  return ratingStats;
}