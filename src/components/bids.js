import { useState, useEffect } from "react";
import { Timestamp } from "firebase/firestore";
import CurrencyInput from "react-currency-input-field";
import { useAuth } from "../contexts/authContext";
import { getActiveBids } from "../backend";


function BidStats( {jobId} ) {
    const emptyStats = {
        high: null,
        low: null,
        count: 0,
        history: []
    };
    const [showStats, setShowStats] = useState(false);
    const [stats, setStats] = useState(emptyStats);

    useEffect(() => {
        getActiveBids(jobId).then((bids) => {
            console.log(bids)
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
        })

        return () => {};
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