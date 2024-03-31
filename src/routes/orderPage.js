import { useNavigate, useParams } from "react-router-dom"
import { firebaseDb } from "../firebase/firebase"
import { addDoc, doc, getDoc, updateDoc, Timestamp } from "firebase/firestore"
import { useState, useEffect } from "react"
import JobCardOrderPage from "../components/jobCardOrderPage"
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useAuth } from "../contexts/authContext"
import { getThumbnail, getFile } from "../backend"
import { BidSelection, BidCard } from "../components/bids"
import CurrencyInput from "react-currency-input-field";

function ChatRoom({ jobId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const userContext = useAuth();

  // Used for displaying user's name after each set of messages
  const groupByAuthor = () => {
    return messages.reduce((groups, message, i) => {
      // If this is the first message or the author is different from the previous message, start a new group
      if (i === 0 || message.author !== messages[i - 1].author) {
        groups.push({
          author: message.author,
          messages: [message],
          firstTimestamp: message.timestamp,
        });
      } else {
        // Otherwise, add the message to the last group
        groups[groups.length - 1].messages.push(message);
      }
      return groups;
    }, []);
  }

  const handleSendMessage = async () => {
    const message = {
      text: newMessage,
      timestamp: Date.now(),
      author: userContext.currUser.uid,
      // TODO fetch username from user context
      username: "Jasper"
    };
    setNewMessage('');

    const docRef = await addDoc(collection(firebaseDb, `Chats/${jobId}/messages/`), message)
  };

  const checkSubmitMessage = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  }

  const renderMessages = () => {
    const groupedMessages = groupByAuthor(messages);
    const sortedGroups = groupedMessages.sort((a, b) => a.firstTimestamp - b.firstTimestamp);

    return sortedGroups.map(group => (
      <div key={group.id} className={group.author === userContext.currUser.uid ? "flex justify-end" : "flex justify-start"}>
        <div style={{ display: 'flex', flexDirection: 'row-reverse', width: 'max-content'}}>
          <div className="flex flex-col">
            {group.messages.map(message => (
              <p key={message.timestamp} className={message.author === userContext.currUser.uid ? "p-2 bg-blue-100 rounded-md mb-1 max-w-max self-end" : "p-2 bg-gray-100 rounded-md mb-1 max-w-max self-start"}>{message.text}</p>
            ))}
            <p className={group.author === userContext.currUser.uid ? "text-right text-xs mb-1" : "text-left text-xs mb-1"}>{group.messages[0].username}</p>
          </div>
        </div>
      </div>
    ))
  }

  useEffect(() => {
    const chatRef = collection(firebaseDb, `Chats/${jobId}/messages`);
    const chatQuery = query(chatRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
      const messages = [];

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        messages.push(data);
      });

      setMessages(messages);
    })

    return () => {
      unsubscribe(); // Cleanup function to unsubscribe from real-time updates when the component unmounts
    };
  }, [jobId]);

  return (
    <div className="p-2">
      <div className="rounded-md bg-gray-50 h-48 overflow-y-scroll flex flex-col-reverse mb-2">
        <div className="flex flex-col justify-end p-4">
          {renderMessages()}
        </div>
      </div>
      <div className="flex p-2 border border-2">
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={checkSubmitMessage}
          className="w-full"

        />
        <button className="w-24" onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  )
}

function OrderStatus({ history, jobId, isPrinter }) {
  const [editState, setEditState] = useState(false);

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

  const getDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  const ModifyStatus = (state) => {
    var updatedHistory = history
    updatedHistory[state] = getDate();

    const docRef = doc(firebaseDb, `Jobs/${jobId}`);
    updateDoc(docRef, { History: updatedHistory })
      .then(() => setEditState(false));

    if (state == "Exchanged") {
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

  )
}


function BidStatus ({jobId}) {
  const [bids, setBids] = useState([]);
  const [latestBid, setLatestBid] = useState([]);
  const [newBid, setNewBid] = useState([]);

  const userContext = useAuth();
  const uid = userContext.currUser.uid;

  
  useEffect(() => {
    const bidHistoryRef = collection(firebaseDb, `Jobs/${jobId}/BidHistory`);

    const bidsQuery = query(bidHistoryRef, where("Active", "==", true), where("PrinterUid", "==", uid));

    const unsubscribe = onSnapshot(bidsQuery, (snapshot) => {
      const bids = [];

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const bid = {
          id: doc.id,
          uid: data.PrinterUid,
          amount: data.Amount,
          timestamp: data.Timestamp
        }
        bids.push(bid);
        
        if (data.Active) {
          setLatestBid(bid)
        }
      });

      setBids(bids);
    })

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
    //update old active bid
    //submit new bid
    console.log(bidDetails);
    
    const bidHistoryRef = collection(firebaseDb, `Jobs/${jobId}/BidHistory`);
    const prevBidRef = doc(firebaseDb, `Jobs/${jobId}/BidHistory/${latestBid.id}`)

    updateDoc(prevBidRef, {})
    
    const docRef = await addDoc(bidHistoryRef, bidDetails);
    updateDoc(prevBidRef, {Active: false, PreviousBid: docRef})
      .then(updateDoc(docRef, {Active: true}))
    

    setNewBid(null);
  }

  return (
    <div>
      {bids.map((bid, idx) => (
        <div key={idx}>
          <BidCard bid={bid} onAccept={() => console.log("I am the chosen one")}/>
        </div>
      ))}
      <div className="m-2 flex">
        <div>
          Update bid:
        </div>
        <div>
          <CurrencyInput
            placeholder="Enter your bid"
            allowNegativeValue={false}
            value={newBid}
            prefix="$"
            step={1}
            onValueChange={handleBidChange} />
        </div>
        <div>
          <button onClick={() => onBid(newBid)}> submit bid! </button>
        </div>
      </div>
    </div>
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
        const snapshot = await getDoc(doc(firebaseDb, `/Jobs/${Id}`));
        let thumbnail = null;
        let file = null;

        try {
          thumbnail = await getThumbnail(Id);
          file = await getFile(Id);
        } catch (error) {
          console.error("Error fetching thumbnail: ", error)
          thumbnail = null;
          file = null;
        }

        const data = snapshot.data();
        
        setJobData({
          thumbnail: thumbnail,
          infill: data.Infill,
          material: data.Material,
          distance: data.Radius,
          file: file,
          fileName: data.FileName,
          history: (data.History) ? data.History : fakeHistory,
          quantity: data.Quantity,
          color: data.Color,
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
                  <OrderStatus history={jobData.history} jobId={Id} isPrinter={isPrinter} />
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