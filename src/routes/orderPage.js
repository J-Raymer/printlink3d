import { useNavigate, useParams } from "react-router-dom"
import { doc, getDoc, updateDoc} from "firebase/firestore"
import { useState, useEffect } from "react"
import JobCardOrderPage from "../components/jobCardOrderPage"
import { getThumbnail, getFile } from "../backend"
import { BidSelection, BidStatus } from "../components/bids"
import { firebaseDb } from "../firebase/firebase"
import RatingModal from "../components/ratingModal";
import { ChatRoom } from "../components/chat"
import { getDate } from "../utils";

function OrderStatus({ history, jobId, isPrinter, customerUid }) {
  const [editState, setEditState] = useState(false);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);

  function CompleteItem({ state, date }) {
    const [showInfo, setShowInfo] = useState(false);

    return (
      <>
        <div className="flex flex-col p-2 w-48"
          onMouseEnter={() => setShowInfo(true)}
          onMouseLeave={() => setShowInfo(false)}>
          <div className="flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="green" viewBox="0 0 24 24" strokeWidth={1.5} className="w-6 h-6">
              <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
            </svg>
          </div>
          <div className="flex justify-center">
            {state}
          </div>
          {showInfo && (
            <div className="absolute bg-gray-200 text-gray-800 rounded-md shadow-lg z-10 ml-24">
              <div className="p-2">
                <p className="text-sm">Completed {date}</p>
              </div>
            </div>
          )}
        </div>

      </>
    )
  }

  const ModifyStatus = (state) => {
    if (state === "Exchanged") {
      setRatingModalVisible(true);
    }
    
    var updatedHistory = history
    updatedHistory[state] = getDate();
    
    const docRef = doc(firebaseDb, `Jobs/${jobId}`);
    updateDoc(docRef, { History: updatedHistory })
      .then(() => setEditState(false));

    if (state === "Exchanged") {
      updateDoc(docRef, { Complete: true });
    }
  };

  function ModifiableItem({ state }) {
    return (
      <div className="flex flex-col p-2 w-48 ">
        <div className="flex justify-center">
          <button onClick={() => { ModifyStatus(state) }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="grey" class="w-6 h-6">
              <circle cx="12" cy="12" r="9" stroke-width="1.5" />
            </svg>
          </button>
        </div>

        <div className="flex justify-center">
          {state}
        </div>
      </div>
    )
  }

  function IncompleteItem({ state }) {
    return (
      <div className="flex flex-col p-2 w-48 ">
        <div className="flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="grey" class="w-6 h-6">
            <circle cx="12" cy="12" r="9" stroke-width="1.5" />
          </svg>
        </div>

        <div className="flex justify-center">
          {state}
        </div>
      </div>
    )
  }

  const onRatingModalClose = () => {
    setRatingModalVisible(false);
  }

  const states = [
    'Submitted',
    'Accepted',
    'Printed',
    'Exchanged',
  ]

  const orderStatus = states.map((state) => {
    return { state: state, date: history[state] };
  })

  const isModifiable = (isPrinter && (history["Accepted"] !== null))

  return (
    <>
    <div className="flex flex-col">
      {(isModifiable) ? (<div className="flex justify-end mr-3">
        <button className="text-blue-500 text-sm hover:underline focus:outline-none" onClick={() => { setEditState(!editState) }}>
          {(editState) ? ("Cancel") : ("Edit")}
        </button>
      </div>) : <></>}
      <div className="flex justify-center">
        {orderStatus.map((step) =>
        ((step.date !== null) ?
          (<CompleteItem state={step.state} date={step.date} />) :
          ((editState) ? <ModifiableItem state={step.state} /> : <IncompleteItem state={step.state} />)))}
      </div>
    </div>
    {
      ratingModalVisible &&
      <RatingModal
        onClose={() => onRatingModalClose()}
        isModalVisible={ratingModalVisible}
        isCustomer={false}
        targetUserUid={customerUid}/>
    }
    </>
  )
}

export default function OrderPage({ isPrinter = false }) {
  const Id = useParams().Id;
  const [jobData, setJobData] = useState([]);
  const [showBids, setShowBids] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const navigate = useNavigate();

  const fakeHistory = {
    'Submitted': "01/03/2024",
    'Accepted': "03/03/2024",
    'Printed': "07/03/2024",
    'Exchanged': null,
  };

  // TODO place in backend.js possibly
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [snapshot, thumbnail] = await Promise.all([getDoc(doc(firebaseDb, `/Jobs/${Id}`)), 
                                                         getThumbnail(Id)]);
        const data = snapshot.data();
        const file = await getFile(data.JobName, Id);

        setJobData({
          thumbnail: thumbnail,
          infill: data.Infill,
          material: data.Material,
          distance: data.Radius,
          file: file,
          jobName: data.JobName,
          history: (data.History) ? data.History : fakeHistory,
          quantity: data.Quantity,
          color: data.Color,
          CustomerUid: data.CustomerUid,
        });

        setShowBids(data.AcceptedBid == null)
        setDataLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    return () => {
    };
  }, [Id]);


  return (
    <div>
      <div className="pl-10 pt-2 flex gap-2">
        {(isPrinter) ?
          (<button className="text-blue-500 hover:underline focus:outline-none" onClick={() => navigate("/Jobs")}> Your Jobs </button>) :
          (<button className="text-blue-500 hover:underline focus:outline-none" onClick={() => navigate("/Orders")}> Your Orders </button>)}
        <div> > {Id.substring(0, 8)}...</div>
      </div>
      <div>
        {(dataLoading) ?
          (<></>) :
          (
            <div className="flex justify-center gap-2">
              <div className="w-2/5">
                <div className="border border-2 mt-2 p-2 rounded-md">
                  <div className="text-lg font-semibold">
                    Details
                  </div>
                  <JobCardOrderPage job={jobData} onSelectJob={() => { }} img={jobData.thumbnail} file={jobData.file} />
                </div>
                <div className="border border-2 mt-2 p-2 rounded-md">
                  <div className="text-lg font-semibold">
                    Status
                  </div>
                  <OrderStatus history={jobData.history} jobId={Id} customerUid={jobData.CustomerUid} isPrinter={isPrinter} />
                </div>
              </div>
              <div className="w-1/3">
                <div className="border border-2 mt-2 p-2 rounded-md">
                  {(showBids) ?
                    (
                    <>
                      {(isPrinter) ?
                        (
                          <>
                            <div className="text-lg font-semibold">
                            Bid Status
                            </div>
                            <BidStatus jobId={Id}/>
                          </>
                        ) : (
                          <>
                            <div className="text-lg font-semibold">
                            Offered Bids
                            </div>
                            <BidSelection jobId={Id} history={jobData.history} onUpdate={() => setShowBids(false)}/>
                          </>
                        )
                      }
                    </>
                    ) : (
                    <>
                      <div className="text-lg font-semibold">
                      Chat
                      </div>
                      <ChatRoom jobId={Id} />
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}