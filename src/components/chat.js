import { addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/authContext"
import { firebaseDb } from "../firebase/firebase"

export function ChatRoom({ jobId }) {
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
        username: userContext.currUser.displayName.split(" ")[0]
      };
      setNewMessage('');
  
      await addDoc(collection(firebaseDb, `Chats/${jobId}/messages/`), message)
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