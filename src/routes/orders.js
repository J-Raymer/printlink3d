import JobCard, {BidJobCard} from "../components/jobCard";
import React, { useState, useEffect } from 'react';
import { firebaseDb } from '../firebase/firebase';
import { collection, onSnapshot, or, and, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { getThumbnail } from "../backend";

export default function Orders({isPrinter=false}) {
    const [listedOrders, setListedOrders] = useState([]);
    const [acceptedOrders, setAcceptedOrders] = useState([]);
    const [completeOrders, setCompleteOrders] = useState([]);
    const navigate = useNavigate();
    const userContext = useAuth();
    const [dataLoading, setDataLoading] = useState(true);
    
    useEffect(() => {
      setDataLoading(true);
      const uid = userContext.currUser.uid;

      const jobRef = collection(firebaseDb, 'Jobs');
      const jobQuery = (isPrinter) ? 
                                  query(jobRef, or(
                                    where("PrinterUid", "==", uid),
                                    and(
                                      where("PrinterUid", "==", null),
                                      where("BidderUid", "array-contains", uid)))) :
                                  query(jobRef, where("CustomerUid", "==", uid)) ;
      
      const unsubscribe = onSnapshot(jobQuery, async (snapshot) => {
        try {
          const fetchedListed = [];
          const fetchedAccepted = [];
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

            if (isPrinter && (data.AcceptedBid !== undefined) && (data.PrinterUid !== uid)) {              
              console.error("Shouldn't have this job: ", data)
            }

            const acceptedBid = (data.AcceptedBid !== undefined) ? data.AcceptedBid: true;
            const completeOrder = (data.Complete !== undefined) ? data.Complete : true;       

            const order = {
              thumbnail: thumbnail,
              id: doc.id,
              quantity: data.Quantity,
              infill: data.Infill,
              material: data.Material,
              distance: data.Radius,
              fileName: data.FileName,
              quantity: data.Quantity,
              color: data.Color,
            };
            
            if (completeOrder) {
              fetchedComplete.push(order)
            } else if (acceptedBid) {
              fetchedAccepted.push(order)
            } else {
              fetchedListed.push(order)
            }
          }));
    
          setListedOrders(fetchedListed)
          setAcceptedOrders(fetchedAccepted);
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
                      {(isPrinter) ? (<>Bid Jobs</>) : (<>Listed Orders</>)}
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {listedOrders.map((job) => (<BidJobCard job={job} isPrinter={isPrinter} onSelectJob={() => navigate(`/${(isPrinter)? "jobs": "orders"}/${job.id}`)} />))}
                    </div>
                    <div className="text-xl font-extrabold p-6">
                      {(isPrinter) ? (<>Current Jobs</>) : (<>Accepted Orders</>)}
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {acceptedOrders.map((job) => (<JobCard job={job} onSelectJob={(job) => navigate(`/${(isPrinter)? "jobs": "orders"}/${job.id}`)} img={job.thumbnail}/>))}
                    </div>
                    <div className="text-xl font-extrabold p-6">
                      {(isPrinter) ? (<>Complete Jobs</>) : (<>Complete Orders</>)}
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {completeOrders.map((job) => (<JobCard job={job} onSelectJob={(job) => navigate(`/${(isPrinter)? "jobs": "orders"}/${job.id}`)} img={job.thumbnail}/>))}
                    </div>
                </div>
              )
            }
            
        </div>
    )
}
