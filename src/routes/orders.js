import JobCard from "../components/jobCard";
import React, { useState, useEffect } from 'react';
import { firebaseDb } from '../firebase/firebase';
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { getThumbnail } from "../backend";

export default function Orders({isPrinter=false}) {
    const [activeOrders, setActiveOrders] = useState([]);
    const [completeOrders, setCompleteOrders] = useState([]);
    const navigate = useNavigate();
    const userContext = useAuth();
    const [dataLoading, setDataLoading] = useState(true);
    
    useEffect(() => {
      setDataLoading(true);

      const jobRef = collection(firebaseDb, 'Jobs');
      const jobQuery = (isPrinter) ? 
                                  query(jobRef, where("PrinterUid", "==", userContext.currUser.uid)) :
                                  query(jobRef, where("CustomerUid", "==", userContext.currUser.uid));
      
      const unsubscribe = onSnapshot(jobQuery, async (snapshot) => {
        try {
          const fetchedActive = [];
          const fetchedComplete = [];
    
          await Promise.all(snapshot.docs.map(async (doc) => {
            const data = doc.data();
            let thumbnail = null;
          
            try {
              thumbnail = await getThumbnail(doc.id);
            } catch (error) {
              console.error("Error fetching thumbnail: ", error)
              thumbnail = null;
            }
            const completeOrder = (data.Complete !== undefined) ? data.Complete : true;
    
            if (completeOrder) {
              fetchedComplete.push({
                snap: thumbnail,
                id: doc.id,
                quantity: data.Quantity,
                infill: data.Infill,
                material: data.Material,
                distance: data.Radius,
                fileName: data.FileName,
                quantity: data.Quantity,
                color: data.Color,
              });
            } else {
              fetchedActive.push({
                snap: thumbnail,
                id: doc.id,
                quantity: data.Quantity,
                infill: data.Infill,
                material: data.Material,
                distance: data.Radius,
                fileName: data.FileName,
                quantity: data.Quantity,
                color: data.Color,
              });
            }
          }));
    
          setActiveOrders(fetchedActive);
          setCompleteOrders(fetchedComplete);
          setDataLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      })

      return () => {
        unsubscribe();
      };
    }, [isPrinter]);

    return (
        <div >
            {(dataLoading)?
              (<></>) :
              (
                <div>
                    <div className="text-xl font-extrabold p-6">
                      {(isPrinter) ? (<>Active Jobs</>) : (<>Active Orders</>)}
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {activeOrders.map((job) => (<JobCard job={job} onSelectJob={(job) => navigate(`/${(isPrinter)? "jobs": "orders"}/${job.id}`)} img={job.snap}/>))}
                    </div>
                    <div className="text-xl font-extrabold p-6">
                      {(isPrinter) ? (<>Complete Jobs</>) : (<>Complete Orders</>)}
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {completeOrders.map((job) => (<JobCard job={job} onSelectJob={(job) => navigate(`/${(isPrinter)? "jobs": "orders"}/${job.id}`)} img={job.snap}/>))}
                    </div>
                </div>
              )
            }
            
        </div>
    )
}
