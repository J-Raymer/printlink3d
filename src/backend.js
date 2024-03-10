import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getBlob } from "firebase/storage";

export async function AddJob(db, DocData) {
  const docRef = await addDoc(collection(db, "Jobs"), DocData);
  return docRef;
}

export async function AddCustomer(db, DocData) {
  const docRef = await addDoc(collection(db, "Customers"), DocData);
}

export async function AddPrinter(db, DocData) {
  const docRef = await addDoc(collection(db, "Printers"), DocData);
}

export async function GetAllJobs(db) {
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

export async function GetJob(field, comp, value, db) {
  const job = collection(db, "Jobs");
  const q = query(job, where(field, comp, value));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
}

export async function GetCustomer(field, comp, value, db) {
  const job = collection(db, "Customers");
  const q = query(job, where(field, comp, value));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
}

export async function GetPrinters(field, comp, value, db) {
  const job = collection(db, "Printers");
  const q = query(job, where(field, comp, value));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
}

export async function GetMaterials(db) {
  const docRef = collection(db, "Material");
  const querySnapshot = await getDocs(docRef);
  return querySnapshot;
}

export async function GetColors(db) {
  const docRef = collection(db, "Colors");
  const querySnapshot = await getDocs(docRef);
  const colors = querySnapshot.docs.map(doc => doc.data().Color);
  return colors;
}

export function addFile(file, path) {
  const storage = getStorage();
  const reference = ref(storage, path);
  uploadBytes(reference, file);
}

export function getFile(path) {
  const storage = getStorage();
  const reference = ref(storage, path);
  return getBlob(reference, 5000000);
}
