import { Routes, Route, Outlet } from "react-router-dom";

import './app.css';
import Home from './routes/home.js';
import Create from './routes/create.js';
import Browse from './routes/browse.js';
import {addDoc,collection,getDocs,query} from "firebase/firestore";
import {getStorage,ref,uploadBytes,getBlob} from "firebase/storage";

function Layout() {
  return (
    <div className="container mx-auto">
      <nav>
        <h2>PrintLink3D</h2>
      </nav>
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Home/>} />
        <Route path="create" element={<Create/>} />
        <Route path="browse" element={<Browse/>} />
      </Route>
    </Routes>
  );
}

export default App;

export async function AddJob(db) {
  const docRef = await addDoc(collection(db, "Job"), {
    Customer_ID: 1,
    Fill_Percentage: 0.1,
    ID: 1,
    Material: "Plasic",
    Printer_ID: 1,
    Radius: 0.1,
    STL: "filepath",
    Status: false
  });
}


export async function AddCustomer(db){
  const docRef = await addDoc(collection(db,"Customers"), {
    Email: "customer_email@gmail.com",
    ID: 1
  });
}

export async function AddPrinter(db){
  const docRef = await addDoc(collection(db,"Printers"), {
    Email: "printer_email@gmail.com",
    ID: 1
});
}

export async function GetJob(field,comp,value,db){
  const job = collection(db,"Job");
  q = query(job,where(field,comp,value));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
}

export async function GetCustomer(field,comp,value,db){
  const job = collection(db,"Customers");
  q =  query(job,where(field,comp,value));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
}

export async function GetPrinters(field,comp,value,db){
  const job = collection(db,"Printers");
  q = query(job,where(field,comp,value));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
}

export async function GetMaterial(db){
  const docRef = collection(db,"Material");
  const querySnapshot = await getDocs(docRef);
  return querySnapshot;
}

export function addFile(file,path){
  const storage = getStorage();
  const reference = ref(storage,path);
  uploadBytes(reference,file);
}

export function getFile(path){
  const storage = getStorage();
  const reference = ref(storage,path);
  return getBlob(reference,5000000);
}
