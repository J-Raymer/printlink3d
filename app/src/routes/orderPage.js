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
        <div className="p-2 border-solid border-2">
        <h2>Chat with {}</h2>
        <div className="rounded-md bg-gray-50 h-48 w-64 overflow-y-scroll flex flex-col-reverse mb-2">
            <div className="flex flex-col justify-end p-4">
                {messages.map(message => 
                (
                    <div className={message.author === userContext.currUser.uid ? "flex justify-end" : "flex justify-start"}   >
                        <p className={message.author === userContext.currUser.uid ? "p-2 bg-blue-100 rounded-md mb-1" : "p-2 bg-gray-100 rounded-md mb-1"}>{message.text}</p>
                    </div>
                ))}
            </div>
        </div>
        <div className="flex p-2 border border-2 w-64">
        <input 
            type="text" 
            value={newMessage} 
            onChange={e => setNewMessage(e.target.value)} 
            placeholder="Type your message..."
            onKeyDown={checkSubmitMessage}

        />
        <button onClick={handleSendMessage}>Send</button>
        </div>
        </div>
    )


}




//history is array of {state: string, date: datetime}
function OrderStatus({history}) {
    function CompleteItem ({state, date}) {
        return (
            <div className="flex p-2 ">
                <div className="p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </div>
                
                <div className="p-2">
                    {state}
                </div>
                <div className="p-2">
                    Completed: {date}
                </div>
            </div>
        )
    }
    
    function IncompleteItem ({state}) {
        return (
            <div className="flex p-2 ">
                <div className="p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </div>
                
                <div className="p-2">
                    {state}
                </div>
            </div>
        )
    }


    const states = [
        'Submitted',
        'Accepted',
        'Printing',
        'Ready for exchange',
        'Complete'
    ]

    const orderStatus = states.map((state, idx) => {
        return {state:state, date:history[idx]};
    })

    console.log(orderStatus)

    return (
        <div>
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
                    infill: data.Fill_Percentage,
                    material: data.Material,
                    distance: data.Radius,
                    fileName: data.STL,
                    name: data.Name,
                    email: data.Email,
                });
                console.log(data); // Check if data is retrieved correctly
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchData();
    
        return () => {
        };
    }, [orderId]);

    return (
        <div className="grid grid-cols-2 gap-4">
            <div>
                <div>
                    Order Details
                    <JobCard job={jobData} />
                </div>
                <div>
                    Order Status
                    <OrderStatus history={fakeHistory}/>
                </div>
            </div>
            <div>
                Chat
                <ChatRoom jobId={orderId} />
            </div>
        </div>
    )
}