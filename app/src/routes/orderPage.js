import { useParams } from "react-router-dom"
import { firebaseDb } from "../firebase/firebase"
import { addDoc, doc, getDoc } from "firebase/firestore"
import { useState, useEffect } from "react"
import JobCard from "../components/jobCard"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useAuth } from "../contexts/authContext"


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




//history is array of {state: string, date: datetime}
function OrderStatus({history}) {
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

    console.log(orderStatus)

    return (
        <div className="flex justify-center">
            {orderStatus.map((step) =>                
                ((step.date !== null) ?
                (<CompleteItem state={step.state} date={step.date}/>):
                (<IncompleteItem state={step.state} />)))}
        </div>
    )
}


export default function OrderPage() {
    const orderId = useParams().orderId;
    const [jobData, setJobData] = useState([]);

    console.log(orderId)

    const fakeHistory = ["1-1-24", "2-1-24", "4-1-24", null, null];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const snapshot = await getDoc(doc(firebaseDb, `/Jobs/${orderId}`));
                const data = snapshot.data();
                setJobData({
                    infill: data.Infill,
                    material: data.Material,
                    distance: data.Radius,
                    fileName: data.File,
                    history: data.History
                });
                console.log(data); // Check if data is retrieved correctly
                console.log(jobData)
                console.log("here")
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchData();
    
        return () => {
        };
    }, [orderId]);

    return (
        <div className="flex justify-center gap-2">
            <div className="w-2/5">
                <div className="border border-2 mt-2 p-2 rounded-md">
                    <div className="text-lg font-semibold">
                        Details
                    </div>
                    <JobCard job={jobData} />
                </div>
                <div className="border border-2 mt-2 p-2 rounded-md">
                    <div className="text-lg font-semibold">
                        Status
                    </div>
                    <OrderStatus history={jobData.history}/>
                </div>
            </div>
            <div className="w-1/3">
                <div className="border border-2 mt-2 p-2 rounded-md">
                    <div className="text-lg font-semibold">
                        Chat
                    </div>
                    <ChatRoom jobId={orderId} />
                </div>
            </div>
        </div>
    )
}