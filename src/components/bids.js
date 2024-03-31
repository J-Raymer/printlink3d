import { useState, useEffect } from "react";
import { Timestamp, arrayRemove } from "firebase/firestore";
import CurrencyInput from "react-currency-input-field";
import { useAuth } from "../contexts/authContext";
import { bidListener, getActiveBids, updateJob } from "../backend";

import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, addDoc } from "firebase/firestore";
import { firebaseDb } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";


function BidStats( {jobId} ) {
    const emptyStats = {
        high: null,
        low: null,
        count: 0,
        history: []
    };
    const [showStats, setShowStats] = useState(false);
    const [stats, setStats] = useState(emptyStats);

    const updateStats = (bidsSnapshot) => {
        const bids = []
      
        bidsSnapshot.docs.forEach((doc) => {
            const data = doc.data();
            const bid = {
                id: doc.id,
                uid: data.PrinterUid,
                amount: Number(data.Amount),
                timestamp: data.Timestamp
            }
            bids.push(bid);
        });

        if (bids.length > 0) {
            const amounts = bids.map((bid) => bid.amount);

            const stats = {
                high: Math.max(...amounts),
                low: Math.min(...amounts),
                count: amounts.length,
                history: []
            }
            setStats(stats);
            setShowStats(true);
        }
    }

    useEffect(() => {
        const unsubscribe = bidListener(jobId, updateStats);

        return () => {
            unsubscribe();
        };
    }, [jobId]);

    return (
        <div>
            {(showStats) ? (
                <div>
                    <div className="text-lg font-semibold">
                    Current Bid Count:
                    </div>
                    <div className="text-lg text-blue-500 font-semibold">
                        {stats.count}
                    </div>
                    <div className="text-lg font-semibold">
                    Current Bid Range:
                    </div>
                    <div className="text-lg text-blue-500 font-semibold">
                        ${stats.low} - ${stats.high}
                    </div>
                </div>
            ) : (
                <div className="text-lg font-semibold">
                    Be the first to bid!
                </div>
            )}
        </div>
    );
}

export function BidSubmission({ jobId, callback }) {
    const [currentBid, setCurrentBid] = useState(null);
    const userContext = useAuth();
    const uid = userContext.currUser.uid;
    
    const handleBidChange = (value) => {
        setCurrentBid(value);
    }

    const onSubmission = () => {
        if (currentBid !== null) {
            const bidDetails = {
                PrinterUid: uid,
                Amount: currentBid,      
                Timestamp: Timestamp.now(),
                Active: true,
                PreviousBid: null
            }
              
            callback(bidDetails);
        }   
    }

    return (
        <div>
            <div className="border border-2 mt-2 p-3 rounded-md">
                <div className="text-lg font-semibold">
                    My Bid:
                </div>
                <div className="m-2 flex gap-2">
                  <div className="border border-2 py-2 px-4 rounded-md">
                    <div className="flex gap-1">
                        <CurrencyInput
                        placeholder="Enter your bid"
                        allowNegativeValue={false}
                        value={currentBid}
                        prefix="$ "
                        step={1}
                        onValueChange={handleBidChange} />
                        <div>
                            CAD
                        </div>
                    </div>
                  </div>
                  <div className=" bg-brand-blue border border-brand-blue text-white font-bold py-2 px-4 rounded-md">
                    <button className="" 
                            onClick={onSubmission}>
                                Place Bid
                    </button>
                  </div>
                </div>
                <BidStats jobId={jobId}/>                
            </div>            
        </div>
    )
}

export function BidCard( { bid, onAccept}) {
    const bidder = bid.uid;
    const amount = bid.amount;
  
    return (
      <div className="border border-2 mt-2 p-3 rounded-md w-96">
        <div className="text-lg font-semibold"> 
            User {bidder.substring(0, 10)}...
        </div>
        <div className="m-2 flex gap-2 justify-between">
            <div className="py-2 px-4 text-lg font-semibold">
                Bid: ${amount} CAD
            </div>
            <div className=" bg-brand-blue border border-brand-blue text-white font-bold py-2 px-4 rounded-md">
                <button className="" 
                        onClick={() => {onAccept()}}>
                            Accept Bid
                </button>
            </div>
        </div>
      </div>
    )
  }

export function OrderBidCard( { bid, onAccept}) {
    const bidder = bid.uid;
    const amount = bid.amount;
  
    return (
      <div className="border border-2 mt-2 p-3 rounded-md">
        <div className="text-lg font-semibold"> 
            User {bidder.substring(0, 10)}...
        </div>
        <div className="m-2 flex gap-2 justify-between">
            <div className="py-2 px-4 text-lg font-semibold">
                Bid: ${amount} CAD
            </div>
            <div className=" bg-brand-blue border border-brand-blue text-white font-bold py-2 px-4 rounded-md">
                <button className="" 
                        onClick={() => {onAccept()}}>
                            Accept Bid
                </button>
            </div>
        </div>
      </div>
    )
  }

export function BidSelection( { jobId, history, onUpdate} ) {
    const [bids, setBids] = useState([]);

    const updateBids = (snapshot) => {
        const bids = [];
        snapshot.docs.forEach((doc) => {
            const data = doc.data();
            const bid = {
              id: doc.id,
              uid: data.PrinterUid,
              amount: data.Amount,
              timestamp: data.Timestamp
            }
            console.log(data)
            bids.push(bid);
        });
        setBids(bids);
    }
  
    useEffect(() => {
        const unsubscribe = bidListener(jobId, updateBids);

        return () => {
            unsubscribe(); 
        };
    }, [jobId]);
    
    //TODO move to utils file
    const getDate = () => {
      const date = new Date();
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const year = date.getFullYear();
  
      return `${day}/${month}/${year}`;
    }
  
    const onBidSelect = (BidId, PrinterId) => {
      let updatedHistory = history;
      updatedHistory["Accepted"] = getDate();
      
      updateJob(jobId, { AcceptedBid: BidId,
                         PrinterUid: PrinterId,
                         History: updatedHistory });
      
      onUpdate();
    }
  
  
    return (
      <div>
        {bids.map((bid, idx) => (
          <div key={idx}>
            <OrderBidCard bid={bid} onAccept={() => {onBidSelect(bid.id, bid.uid)}}/>
          </div>
        ))}
      </div>
    ) 
}


export function BidStatus ({jobId}) {
    const [latestBid, setLatestBid] = useState([]);
    const [newBid, setNewBid] = useState([]);
    const [editState, setEditState] = useState(false);
    
    const navigate = useNavigate();
    const userContext = useAuth();
    const uid = userContext.currUser.uid;
    
    const updateBid = (snapshot) => {
        snapshot.docs.forEach((doc) => {
            const data = doc.data();
            const bid = {
                id: doc.id,
                uid: data.PrinterUid,
                amount: data.Amount,
                timestamp: data.Timestamp
            }
        
            if (data.Active) {
                setLatestBid(bid)
            }
        });
    }
    
    useEffect(() => {
        const unsubscribe = bidListener(jobId, updateBid, uid);
  
        return () => {
            unsubscribe(); // Cleanup function to unsubscribe from real-time updates when the component unmounts
        };
    }, [jobId]);
  
    const handleBidChange = (value) => {
      setNewBid(value);
    }
  
    const onBid = async (bidAmount) => {
      const bidDetails = {
        PrinterUid: uid,
        Amount: bidAmount,      
        Timestamp: Timestamp.now(),
        Active: false,
        PreviousBid: null
      }
      
      const bidHistoryRef = collection(firebaseDb, `Jobs/${jobId}/BidHistory`);
      const prevBidRef = doc(firebaseDb, `Jobs/${jobId}/BidHistory/${latestBid.id}`)
      
      const docRef = await addDoc(bidHistoryRef, bidDetails);
      updateDoc(prevBidRef, {Active: false, PreviousBid: docRef})
        .then(updateDoc(docRef, {Active: true}))

      setNewBid(null);
    }
  
    const deleteBid = () => {
        const prevBidRef = doc(firebaseDb, `Jobs/${jobId}/BidHistory/${latestBid.id}`)
      
        updateJob(jobId, {BidderUid: arrayRemove(uid)});
        updateDoc(prevBidRef, {Active: false})
            .then(() => navigate("/jobs"));
    }

    return (
      <div>
        <div className="mt-2 p-3">
            <div className="flex justify-between">
                <div className="text-lg font-semibold">
                    My Bid:
                </div>
                <div className="mr-3">
                    <button className="text-blue-500 text-sm hover:underline focus:outline-none" onClick={() => { setEditState(!editState) }}>
                        {(editState) ? ("Cancel") : ("Edit Bid")}
                    </button>
                </div>
            </div>
            <div>
                <div className="m-2 flex gap-2 justify-between mr-4">
                    <div className="py-2 px-4">
                        $ {latestBid.amount} CAD
                    </div>
                    {(editState) ? (
                        <div>
                            <div className=" bg-brand-red border border-brand-red text-white font-bold py-2 px-4 rounded-md">
                                <button className="" 
                                        onClick={() => deleteBid()}>
                                            Delete Bid
                                </button>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
                <div>
                    {(editState) ? (
                        <>
                            <div className="m-2 flex gap-2 justify-between mr-4 ">
                                <div className="border border-2 py-2 px-4 rounded-md">
                                    <div className="flex gap-1">
                                        <CurrencyInput
                                        placeholder="Update your bid"
                                        allowNegativeValue={false}
                                        value={newBid}
                                        prefix="$ "
                                        step={1}
                                        onValueChange={handleBidChange} />
                                        <div>
                                            CAD
                                        </div>
                                    </div>
                                </div>
                                <div className=" bg-brand-blue border border-brand-blue text-white font-bold py-2 px-4 rounded-md">
                                    <button className="" 
                                            onClick={() => onBid(newBid)}>
                                                Update Bid
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
        <BidStats jobId={jobId} />
      </div>
    )
  }
