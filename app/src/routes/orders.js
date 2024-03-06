import JobCard from "../components/jobCard";
import React, { useState, useEffect } from 'react';
import { firebaseDb } from '../firebase/firebase';
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

export default function Orders() {
    const [printerJobs, setPrinterJobs] = useState([]);
    const [customerJobs, setCustomerJobs] = useState([]);
    const navigate = useNavigate();
    const userContext = useAuth();

    useEffect(() => {
        const jobRef = collection(firebaseDb, 'Jobs');
        const jobQueryCustomer = query(jobRef, where("CustomerUid", "==", userContext.currUser.uid));
        const jobQueryPrinter = query(jobRef, where("PrinterUid", "==", userContext.currUser.uid));

        const unsubscribeCustomer = onSnapshot(jobQueryCustomer, (snapshot) => {
          const fetchedJobs = [];
          snapshot.docs.forEach((doc) => {
            //console.log(doc.id)
            const data = doc.data();
            console.log(data);
            fetchedJobs.push({
              id: doc.id,
              quantity: data.Quantity,
              infill: data.Infill,
              material: data.Material,
              distance: data.Radius,
              fileName: data.File
          });
    
            setCustomerJobs(fetchedJobs);
          });
        })

        const unsubscribePrinter = onSnapshot(jobQueryPrinter, (snapshot) => {
          const fetchedJobs = [];
          snapshot.docs.forEach((doc) => {
            //console.log(doc.id)
            const data = doc.data();
            fetchedJobs.push({
              id: doc.id,
              infill: data.Infill,
              material: data.Material,
              distance: data.Radius,
              fileName: data.File
          });
    
            setPrinterJobs(fetchedJobs);
          });
        })

    
        return () => {
          unsubscribeCustomer();
          unsubscribePrinter();
        };
      }, []);

    return (
        <div >
            <div className="text-xl font-extrabold p-6">
                Current Orders
            </div>
            <div>
              printer jobs
            </div>
            <div className="grid grid-cols-1 gap-4">
                {printerJobs.map((job) => (<JobCard job={job} onSelectJob={(job) => navigate(`/orders/${job.id}`)}/>))}
            </div>
            <div>
              customer jobs
            </div>
            <div className="grid grid-cols-1 gap-4">
                {customerJobs.map((job) => (<JobCard job={job} onSelectJob={(job) => navigate(`/orders/${job.id}`)}/>))}
            </div>
            <div className="text-xl font-extrabold p-6">
                Past Orders
            </div>
        </div>
    )
}
