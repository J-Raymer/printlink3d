import { useState, useEffect } from "react";
import { GetBidStats } from "./bids";
import { useAuth } from "../contexts/authContext";
import { bidListener } from "../backend";

export default function JobCard({
  job,
  isSelected,
  onSelectJob,
  onUnselectJob,
  img,
  showBidStats = false
}) {
  const [bidStats, setBidStats] = useState(null);

  const handleClick = () => {
    !isSelected ? onSelectJob(job) : onUnselectJob();
  };

  useEffect(() => {
    if (showBidStats) {
      GetBidStats(job.doc, setBidStats);
    }
  }, []);

  return (
    <div
      onClick={handleClick}
      className={`border-[1px] border-gray-300 bg-white rounded overflow-hidden flex w-full hover:cursor-pointer hover:bg-gray-200 ${
        isSelected ? 'fg-brand-blue brand-blue-accent' : ''
      }`}
      style={{ height: isSelected ? "auto" : "fit-content" }}
    >
      <div className="md:flex-shrink-0">
        <div className="h-48 w-full object-cover md:w-48">
        {(img)? 
          (<img            
            src={img}
            alt={job.fileName}
          /> )
          :
          (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>)
        } 
        </div>
      </div>
      <div className="pl-5 pt-5 text-gray-600">
        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
          {job.jobName}
        </div>
        <p className="mt-1">
          <span className="font-semibold mt-2">Material: </span>
          <span className="font-normal">{job.material}</span>
        </p>
        <p className="mt-1">
          <span className="font-semibold">Infill: </span>
          <span className="font-normal">{job.infill}</span>
        </p>
        <p className="mt-1">
          <span className="font-semibold">Color: </span>
          <span className="font-normal">{job.color}</span>
        </p>
        <p className="mt-1">
          <span className="font-semibold">Quantity: </span>
          <span className="font-normal">{job.quantity}</span>
        </p>
        {(showBidStats) ? (  
          <p className="mt-1">
            <span className="font-semibold">Bid Range: </span>
            {(bidStats !== null) ? (
              <span className="font-normal">
                ${bidStats.low} : ${bidStats.high} CAD
              </span>
            ) : (
              <span className="font-normal">
                N/A
              </span>
            )}
          </p>
        ) : (<> </>)}
      </div>
    </div>
  );
}

export function EmptyJobCard({
  ImgComponent,
  ContentComponent,
  onSelectJob
}) {

  return (
    <div
      onClick={() => { onSelectJob() }}
      className={`border-[1px] border-gray-300 bg-white rounded overflow-hidden flex w-full hover:cursor-pointer hover:bg-gray-200  }`}
      style={{ height: "fit-content" }}
    >
      <ImgComponent />
      <ContentComponent />  
    </div>
  );
}

export function BidJobCard ({ job, isPrinter, onSelectJob}) {
  function CardImage () {
    return (
      <div className="md:flex-shrink-0">
          <div className="h-48 w-full object-cover md:w-48">
          {(job.thumbnail)? 
            (<img            
              src={job.thumbnail}
              alt={job.fileName}
            /> )
            :
            (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>)
          } 
        </div>
      </div>
    );
  }

  function CardContent () {
    const [bidStats, setBidStats] = useState(null);
    const [latestBid, setLatestBid] = useState([]);
  
    const userContext = useAuth();
    const uid = userContext.currUser.uid;
    
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
            }
        });
    }
    
    useEffect(() => {
        const unsubscribe = bidListener(job.id, updateBidCallback, uid);
        GetBidStats(job.id, setBidStats);

        return () => {
            unsubscribe(); // Cleanup function to unsubscribe from real-time updates when the component unmounts
        };
    }, [uid]);

    return (
      <div className="pl-5 pt-5 text-gray-600">
        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
          {job.jobName}
        </div>
          {(isPrinter) ? (
            <div>
              <p className="mt-2">
                <span className="font-semibold mt-2">Your Bid: </span>
                {(latestBid !== null) ? (
                  <span className="font-normal">
                    ${latestBid.amount}
                  </span>
                ) : (
                  <span className="font-normal">
                    $ 
                  </span>
                )}
              </p>
              <p className="mt-2">
                <span className="font-semibold mt-2">Lowest Bid: </span>
                {(bidStats !== null) ? (
                  <span className="font-normal">
                    ${bidStats.low}
                  </span>
                ) : (
                  <span className="font-normal">
                    $ 
                  </span>
                )}
              </p>
            </div>  
          ) : (
            <div>
              <p className="mt-2">
                <span className="font-semibold mt-2">Bid Count: </span>
                {(bidStats !== null) ? (
                  <span className="font-normal">
                    {bidStats.count}
                  </span>
                ) : (
                  <span className="font-normal">
                    0
                  </span>
                )}
              </p>
              <p className="mt-2">
                <span className="font-semibold mt-2">Bid Range: </span>
                {(bidStats !== null) ? (
                  <>
                  {(bidStats.count === 1) ? (
                    <span className="font-normal">
                      ${bidStats.low} CAD
                    </span>
                  ) : (
                    <span className="font-normal">
                      ${bidStats.low} - ${bidStats.high} CAD
                    </span>
                  )}
                  </>
                ) : (
                  <span className="font-normal">
                    N/A
                  </span>
                )}
              </p>
            </div>
          )}
      </div>
    );
  }

  return (
    <EmptyJobCard ImgComponent={CardImage} ContentComponent={CardContent} onSelectJob={onSelectJob} />
  )
}