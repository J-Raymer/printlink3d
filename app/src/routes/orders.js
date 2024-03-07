import JobCard from "../components/jobCard";
import React, { useState, useEffect } from 'react';
import { firebaseDb } from '../firebase/firebase';
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

export default function Orders() {
    const [activeOrders, setActiveOrders] = useState([]);
    const [completeOrders, setCompleteOrders] = useState([]);
    const navigate = useNavigate();
    const userContext = useAuth();

    // TODO - Put this in backend.js possibly
    useEffect(() => {
        const jobRef = collection(firebaseDb, 'Jobs');
        const jobQueryCustomer = query(jobRef, where("CustomerUid", "==", userContext.currUser.uid));

        const unsubscribe = onSnapshot(jobQueryCustomer, (snapshot) => {
          const fetchedActive = [];
          const fetchedComplete = [];

          snapshot.docs.forEach((doc) => {
            const data = doc.data();
            const completeOrder = (data.Complete !== undefined) ? data.Complete : true;

            (completeOrder) ? 
            fetchedComplete.push({
                id: doc.id,
                quantity: data.Quantity,
                infill: data.Infill,
                material: data.Material,
                distance: data.Radius,
                fileName: data.File,
                quantity: data.Quantity,
                color: data.Color,
            }): 
            fetchedActive.push({
                id: doc.id,
                quantity: data.Quantity,
                infill: data.Infill,
                material: data.Material,
                distance: data.Radius,
                fileName: data.File,
                quantity: data.Quantity,
                color: data.Color,
              })
    
            setActiveOrders(fetchedActive);
            setCompleteOrders(fetchedComplete);
          });
        })

    
        return () => {
          unsubscribe();
        };
      }, []);

    return (
        <div >
            <div className="text-xl font-extrabold p-6">
                Active Orders
            </div>
            <div className="grid grid-cols-1 gap-4">
                {activeOrders.map((job) => (<JobCard job={job} onSelectJob={(job) => navigate(`/orders/${job.id}`)}/>))}
            </div>
            <div className="text-xl font-extrabold p-6">
                Complete Orders
            </div>
            <div className="grid grid-cols-1 gap-4">
                {completeOrders.map((job) => (<JobCard job={job} onSelectJob={(job) => navigate(`/orders/${job.id}`)}/>))}
            </div>
        </div>
    )
}
