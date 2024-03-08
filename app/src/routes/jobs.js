import JobCard from "../components/jobCard";
import React, { useState, useEffect } from 'react';
import { firebaseDb } from '../firebase/firebase';
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

export default function Jobs() {
    const [activeJobs, setActiveJobs] = useState([]);
    const [completeJobs, setCompleteJobs] = useState([]);
    const navigate = useNavigate();
    const userContext = useAuth();

    useEffect(() => {
        const jobRef = collection(firebaseDb, 'Jobs');
        const jobQueryPrinter = query(jobRef, where("PrinterUid", "==", userContext.currUser.uid));

        const unsubscribe = onSnapshot(jobQueryPrinter, (snapshot) => {
          const fetchedActive = [];
          const fetchedComplete = [];

          snapshot.docs.forEach((doc) => {
            const data = doc.data();
            const completeJob = (data.Complete !== undefined) ? data.Complete : true;

            (completeJob) ? 
            fetchedComplete.push({
                id: doc.id,
                quantity: data.Quantity,
                infill: data.Infill,
                material: data.Material,
                distance: data.Radius,
                fileName: data.File
            }): 
            fetchedActive.push({
                id: doc.id,
                quantity: data.Quantity,
                infill: data.Infill,
                material: data.Material,
                distance: data.Radius,
                fileName: data.File
            })
    
            setActiveJobs(fetchedActive);
            setCompleteJobs(fetchedComplete);
          });
        })

    
        return () => {
          unsubscribe();
        };
      }, []);

    return (
        <div >
            <div className="text-xl font-extrabold p-6">
                Active Jobs
            </div>
            <div className="grid grid-cols-1 gap-4">
                {activeJobs.map((job) => (<JobCard job={job} onSelectJob={(job) => navigate(`/jobs/${job.id}`)}/>))}
            </div>
            <div className="text-xl font-extrabold p-6">
                Complete Jobs
            </div>
            <div className="grid grid-cols-1 gap-4">
                {completeJobs.map((job) => (<JobCard job={job} onSelectJob={(job) => navigate(`/jobs/${job.id}`)}/>))}
            </div>
        </div>
    )
}
