import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseStorage } from "./firebase/firebase";

export async function addJob(db, DocData) {
  const docRef = await addDoc(collection(db, "Jobs"), DocData);
  return docRef;
}

export async function addCustomer(db, DocData) {
  const docRef = await addDoc(collection(db, "Customers"), DocData);
}

export async function addPrinter(db, DocData) {
  const docRef = await addDoc(collection(db, "Printers"), DocData);
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

            reader.onloadend = function() {
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
  uploadBytes(storageRef, thumbnailBlob);
};

export async function uploadStl(file, jobName, id) {
  console.log(jobName + "_" + id + ".stl")
  var storageRef = ref(firebaseStorage, `print-files/${jobName + "_" + id}.stl`);
  uploadBytes(storageRef, file);
}