// src/components/ChatPage.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import '../styles/ChatPage.css';

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [userType, setUserType] = useState('student');
    const [username, setUsername] = useState(''); // State to hold the username

    useEffect(() => {
        // Retrieve username from local storage
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername); // Set username from local storage
        }
    }, []);

    useEffect(() => {
        // Query messages collection, ordering by timestamp
        const messagesQuery = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const messagesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(messagesData);
        });

        return () => unsubscribe();
    }, []);

    const handleSendMessage = async (message) => {
        try {
            await addDoc(collection(db, 'messages'), {
                text: message,
                userType: userType,
                username: username, // Include username in the message
                timestamp: new Date(), // Ensure timestamp is added for ordering
            });
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    return (
        <div className="chat-page">
            <div className="chat-sidebar">
                <h2>Chat Room</h2>
                <div className="user-select">
                    <label>
                        User Type:
                        <select onChange={(e) => setUserType(e.target.value)} value={userType}>
                            <option value="student">Student</option>
                            <option value="staff">Staff</option>
                        </select>
                    </label>
                </div>
            </div>
            <div className="chat-main">
                <MessageList messages={messages} />
                <ChatInput onSendMessage={handleSendMessage} />
            </div>
        </div>
    );
};

export default ChatPage;