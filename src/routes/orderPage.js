import { useNavigate, useParams } from "react-router-dom"
import { firebaseDb, firebaseStorage } from "../firebase/firebase"
import { addDoc, doc, getDoc, updateDoc } from "firebase/firestore"
import { useState, useEffect } from "react"
import JobCard from "../components/jobCard"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useAuth } from "../contexts/authContext"
import { getDownloadURL, ref } from "firebase/storage"


function ChatRoom({jobId}) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const userContext = useAuth();

    const handleSendMessage = async () => {
        const message = {
          text: newMessage,
          timestamp: Date.now(),
          author: userContext.currUser.uid,
        };
        setNewMessage('');

        const docRef = await addDoc(collection(firebaseDb, `Chats/${jobId}/messages/`), message)        
      };

    const checkSubmitMessage = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
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
                {messages.map(message => 
                (
                    <div className={message.author === userContext.currUser.uid ? "flex justify-end" : "flex justify-start"}   >
                        <p className={message.author === userContext.currUser.uid ? "p-2 bg-blue-100 rounded-md mb-1" : "p-2 bg-gray-100 rounded-md mb-1"}>{message.text}</p>
                    </div>
                ))}
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

function OrderStatus({history, jobId, isPrinter}) {
    const [editState, setEditState] = useState(false);

    function CompleteItem ({state, date}) {
        const [showInfo, setShowInfo] = useState(false);
        
        return (
            <>
            <div className="flex flex-col p-2 w-48"
                 onMouseEnter={() => setShowInfo(true)}
                 onMouseLeave={() => setShowInfo(false)}>
                <div className="flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="green" viewBox="0 0 24 24" strokeWidth={1.5}  className="w-6 h-6">
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
        updateDoc(docRef, {History: updatedHistory})
        .then(() => setEditState(false));

        if (state == "Exchanged") {
            updateDoc(docRef, {Complete: true});
        }
    };
    
    function ModifiableItem ({state}) {
        return (
            <div className="flex flex-col p-2 w-48 ">
                <div className="flex justify-center">
                    <button onClick={() => {ModifyStatus(state)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="grey" class="w-6 h-6">
                            <circle cx="12" cy="12" r="9" stroke-width="1.5"/>
                        </svg>
                    </button>
                </div>
                
                <div className="flex justify-center">
                    {state}
                </div>
            </div>
        )
    }

    function IncompleteItem ({state}) {
        return (
            <div className="flex flex-col p-2 w-48 ">
                <div className="flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="grey" class="w-6 h-6">
                            <circle cx="12" cy="12" r="9" stroke-width="1.5"/>
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
        return {state:state, date:history[state]};
    })

    return (
        <div className="flex flex-col">
            {(isPrinter) ? (<div className="flex justify-end mr-3">
                <button className="text-blue-500 text-sm hover:underline focus:outline-none" onClick={() => {setEditState(!editState)}}> 
                    {(editState) ? ("Cancel") : ("Edit")}
                </button>
            </div>): <></>}
            <div className="flex justify-center">
                {orderStatus.map((step) =>                
                    ((step.date !== null) ?
                    (<CompleteItem state={step.state} date={step.date}/>):
                    ((editState)? <ModifiableItem state={step.state}/> : <IncompleteItem state={step.state} />)))}
            </div>
        </div>
        
    )
}


export default function OrderPage({isPrinter=false}) {
    const Id = useParams().Id;
    const [jobData, setJobData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const fakeHistory = {'Submitted':"01/03/2024",
                            'Accepted':"03/03/2024",
                            'Printed':"07/03/2024",
                            'Exchanged':null,};

    // TODO place in backend.js possibly
    useEffect(() => {
        const fetchData = async () => {
            try {
                const snapshot = await getDoc(doc(firebaseDb, `/Jobs/${Id}`));
                getDownloadURL(ref(firebaseStorage, `images/${Id}.png`))
                    .then((url) =>
                    {
                         // This can be downloaded directly:
                        const xhr = new XMLHttpRequest();
                        xhr.responseType = 'blob';
                        xhr.onload = (event) => {
                            const blob = xhr.response;
                            const reader = new FileReader();
                            reader.readAsDataURL(blob);
                            reader.onloadend = function() {
                                //setJobData({...jobData, snap: reader.result})
                                console.log(reader.result)
                                setImage(reader.result)
                            }
                        };
                        xhr.open('GET', url);
                        xhr.send();
                    })
                    .catch((error) => console.log("error"))

                const data = snapshot.data();
                setJobData({
                    infill: data.Infill,
                    material: data.Material,
                    distance: data.Radius,
                    fileName: data.File,
                    history: (data.History)? data.History : fakeHistory,
                    quantity: data.Quantity,
                    color: data.Color,
                });
                console.log(jobData)
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchData();
    
        return () => {
        };
    }, [Id]);

    if (loading) {
        return (
            <div>loading...</div>
        )
    }
    return (
        <div>
            <div className="pl-10 pt-2 flex gap-2">
                {(isPrinter) ? 
                (<button className="text-blue-500 hover:underline focus:outline-none" onClick={() => navigate("/Jobs")}> Your Jobs </button>) :
                (<button className="text-blue-500 hover:underline focus:outline-none" onClick={() => navigate("/Orders")}> Your Orders </button>)}
                <div> > {Id.substring(0, 8)}...</div>
            </div>
            <div className="flex justify-center gap-2">
                <div className="w-2/5">
                    <div className="border border-2 mt-2 p-2 rounded-md">
                        <div className="text-lg font-semibold">
                            Details
                        </div>
                        <JobCard job={jobData} onSelectJob={()=>{}} img={image}/>
                    </div>
                    <div className="border border-2 mt-2 p-2 rounded-md">
                        <div className="text-lg font-semibold">
                            Status
                        </div>
                        <OrderStatus history={jobData.history} jobId={Id} isPrinter={isPrinter}/>
                    </div>
                </div>
                <div className="w-1/3">
                    <div className="border border-2 mt-2 p-2 rounded-md">
                        <div className="text-lg font-semibold">
                            Chat
                        </div>
                        <ChatRoom jobId={Id} />
                    </div>
                </div>
            </div>
        </div>
        
    )
}