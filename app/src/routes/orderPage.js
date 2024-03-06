import { useParams } from "react-router-dom"
import { firebaseDb } from "../firebase"
import { addDoc, doc, getDoc } from "firebase/firestore"
import { useState, useEffect } from "react"
import JobCard from "../components/jobCard"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";


function ChatRoom({jobId}) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = async () => {
        const message = {
          text: newMessage,
          timestamp: Date.now()
          //need sent by
        };
        console.log(message)

        const docRef = await addDoc(collection(firebaseDb, `Chats/${jobId}/messages/`), message)

        setNewMessage('');
      };

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
        <div>
        <h2>Chat with {}</h2>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {messages.map(message => (
          <div>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
        <input 
            type="text" 
            value={newMessage} 
            onChange={e => setNewMessage(e.target.value)} 
            placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
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
    const [dataRecieved, setDataRecieved] = useState(false);
    const [jobData, setJobData] = useState([]);

    console.log(orderId)

    const fakeHistory = ["1-1-24", "2-1-24", "4-1-24", null, null];
    
    if (!dataRecieved) {
        getDoc(doc(firebaseDb, `/Jobs/${orderId}`)).then((snapshot) => {
            console.log(snapshot.data())
            const data = snapshot.data();
            setJobData({
                infill: data.Fill_Percentage,
                material: data.Material,
                distance: data.Radius,
                fileName: data.STL,
                name: data.Name,
                email: data.Email,
            })
            setDataRecieved(true);
        }

    )}


    return (
        <div flex-rows>
            {(dataRecieved)?
            (
                <>
                <div>
                    Order Details
                    <JobCard job={jobData} />
                </div>
                <div>
                    Order Status
                    <OrderStatus history={fakeHistory}/>
                </div>
                <div>
                    <ChatRoom jobId={orderId} />
                </div>
                </>
            ):
            (<></>)
            }
            
        </div>
    )
}