import JobCard from "../components/jobCard";
import React, { useState, useEffect } from 'react';
import { firebaseDb } from '../firebase';
import { collection, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Orders() {
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(firebaseDb, 'Jobs'), (snapshot) => {
          const fetchedJobs = [];
          snapshot.docs.forEach((doc) => {
            //console.log(doc.id)
            const data = doc.data();
            fetchedJobs.push({
              id: doc.id,
              infill: data.Fill_Percentage,
              material: data.Material,
              distance: data.Radius,
              fileName: data.STL,
              name: data.Name,
              email: data.Email,
          });
    
            setJobs(fetchedJobs);
          });
        })
    
        return () => {
          unsubscribe(); // Cleanup function to unsubscribe from real-time updates when the component unmounts
        };
      }, []);

    return (
        <div>
            <div className="text-xl font-extrabold p-6">
                Current Orders
            </div>
            <div className="grid grid-cols-1 gap-4">
                {jobs.map((job) => (<JobCard job={job} onSelectJob={(job) => navigate(`/orders/${job.id}`)}/>))}
            </div>
            <div className="text-xl font-extrabold p-6">
                Past Orders
            </div>
        </div>
    )
}