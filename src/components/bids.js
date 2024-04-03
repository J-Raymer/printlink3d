import { useState, useEffect } from "react";
import { Timestamp, arrayRemove, collection, doc, updateDoc, addDoc } from "firebase/firestore";
import CurrencyInput from "react-currency-input-field";
import { useAuth } from "../contexts/authContext";
import { bidListener, getActiveBids, updateJob } from "../backend";
import { firebaseDb } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

export function GetBidStats(jobId, setProp) {
    getActiveBids(jobId).then((bids) => {
        if (bids.length > 0) {
            const amounts = bids.map((bid) => bid.amount);

            const stats = {
                high: Math.max(...amounts).toFixed(2),
                low: Math.min(...amounts).toFixed(2),
                count: amounts.length,
                history: []
            }
        setProp(stats);
        }
    })
}

function BidStats( {jobId, statsReloadTrigger} ) {
    const [showStats, setShowStats] = useState(false);
    const [stats, setStats] = useState(null);

    const updateStats = (stats) => {
        setStats(stats);
        setShowStats(true);
    }
    
    useEffect (() => {
        GetBidStats(jobId, updateStats);
    }, [jobId, statsReloadTrigger]);

    return (
        <div>
            {(showStats) ? (
                <div className="flex flex-col">
                    <div className="m-2 flex gap-3">
                        <p className="text-lg text-blue-500 font-semibold">
                            {stats.count}
                        </p>
                        { stats.count === 1 ?
                        <p className="text-lg">person has placed a bid.</p>
                        :
                        <p className="text-lg">people have placed bids.</p>
                        }
                    </div>
                    <div className="m-2 flex gap-3 flex-col">
                        <p className="text-xl font-bold mt-6">Current Bid Range: </p>
                        { stats.count === 1 ?
                        <p className="fg-brand-blue text-4xl font-bold mt-1">${stats.low} CAD</p>
                        :
                        <p className="fg-brand-blue text-4xl font-bold mt-1">${stats.low} - ${stats.high} CAD</p>
                        }
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
    const displayName = userContext.currUser.displayName.split(" ")[0];
    
    const handleBidChange = (value) => {
        setCurrentBid(value);
    }

    const onSubmission = () => {
        if (currentBid !== null) {
            const amount = Number(currentBid).toFixed(2);

            const bidDetails = {
                PrinterName: displayName,
                PrinterUid: uid,
                Amount: amount,      
                Timestamp: Timestamp.now(),
                Active: true
            }
              
            callback(bidDetails);
        }   
    }

    return (
        <div>
          <h2 className="text-3xl font-bold">Place Your Bid</h2>
          <div className="my-2 flex gap-2">
            <div className="border border-2 py-2 px-4 rounded-md flex-grow">
              <div className="flex gap-1">
                  <CurrencyInput
                  className="w-full"
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
            { currentBid == null ?
            <button className="bg-gray-200 border border-gray-400 text-gray-700 opacity-50 cursor-not-allowed font-bold py-2 px-4 rounded-md">Place Bid</button>
            :
            <button className="bg-brand-blue border border-brand-blue text-white font-bold py-2 px-4 rounded-md" onClick={onSubmission}>Place Bid</button>
            }
          </div>
          <BidStats jobId={jobId}/>                
        </div>
    )
}

export function OrderBidCard( { bid, onAccept}) {
    const bidder = (bid.name !== null) ? bid.name : bid.uid.substring(0, 10)
    const amount = bid.amount;
  
    return (
      <div className="border border-2 mt-2 p-3 rounded-md">
        <div className="text-lg font-semibold"> 
            Printer: {bidder}
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
              name: (data.PrinterName !== undefined) ? data.PrinterName : null,
              id: doc.id,
              uid: data.PrinterUid,
              amount: data.Amount,
              timestamp: data.Timestamp
            }
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
    
    //TODO move history update to backend
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
    const [latestBid, setLatestBid] = useState(null);
    const [newBid, setNewBid] = useState(null);
    const [editState, setEditState] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    
    const navigate = useNavigate();
    const userContext = useAuth();
    const uid = userContext.currUser.uid;
    const displayName = userContext.currUser.displayName.split(" ")[0];
    
    const updateBidCallback = (snapshot) => {
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
                setDataLoading(false);
            }
        });
    }
    
    useEffect(() => {
        const unsubscribe = bidListener(jobId, updateBidCallback, uid);
        
        return () => {
            unsubscribe(); // Cleanup function to unsubscribe from real-time updates when the component unmounts
        };
    }, [jobId, uid]);
  
    const handleBidChange = (value) => {
        setNewBid(value);
    }
  
    const onBidUpdate = async (bidAmount) => {
        if (bidAmount === undefined || bidAmount === null) {
            return;
        } else {
            bidAmount = Number(bidAmount).toFixed(2);
        }

        const bidDetails = {
            PrinterName: displayName,
            PrinterUid: uid,
            Amount: bidAmount,      
            Timestamp: Timestamp.now(),
            Active: false
        }

        const bidHistoryRef = collection(firebaseDb, `Jobs/${jobId}/BidHistory`);
        const prevBidRef = doc(firebaseDb, `Jobs/${jobId}/BidHistory/${latestBid.id}`)
        
        const docRef = await addDoc(bidHistoryRef, bidDetails);
        updateDoc(prevBidRef, {Active: false})
            .then(updateDoc(docRef, {Active: true}))
        
        
        setEditState(false);
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
        {(dataLoading === false) ? (
            <div >
                <div className="border border-2 rounded-md mt-2 p-3">
                    <div className="flex justify-between">
                        <div className="flex gap-3">
                            <div className="text-lg font-semibold">
                                My Bid:
                            </div>
                            <div className="text-lg text-blue-500 font-semibold ">
                                ${latestBid.amount} CAD
                            </div>
                        </div>
                        <div className="mr-3">
                            <button className="text-blue-500 text-sm hover:underline focus:outline-none" onClick={() => { setEditState(!editState) }}>
                                {(editState) ? ("Cancel") : ("Edit Bid")}
                            </button>
                        </div>
                    </div>
                    <div>
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
                                                    onClick={() => onBidUpdate(newBid)}>
                                                        Update Bid
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <></>
                            )}
                        </div>
                        <div >
                            {(editState) ? (
                                <div className="m-2 flex gap-2 justify-end mr-4">
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
                    </div>
                </div>
                <BidStats jobId={jobId} statsReloadTrigger={latestBid}/>
            </div>
        ) : (<></>)
        }
        </div>
    )
  }