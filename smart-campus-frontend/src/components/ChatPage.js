import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Import your Firestore configuration
import { collection, doc, getDoc, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import ChatInput from './ChatInput'; // Import your ChatInput component
import MessageList from './MessageList'; // Import your MessageList component
import '../styles/ChatPage.css'; // Import your CSS

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [room, setRoom] = useState('student'); // Default room
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('student'); // Default role
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');

        if (storedUserId) {
            fetchUserData(storedUserId); // Fetch user data using userId
        } else {
            console.error('User ID not found in local storage');
        }
    }, []);

    const fetchUserData = async (userId) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUsername(userData.username);
                setRole(userData.role);
                setRoom(userData.role === 'admin' ? 'admin' : 'student'); // Set initial room based on role
                //console.log('User Data:', userData); // Log user data for debugging
            } else {
                console.error('User not found in Firestore');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        const messagesQuery = query(
            collection(db, `messages_${room}`),
            orderBy('timestamp', 'asc')
        );

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const messagesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(messagesData);
            //console.log('Messages fetched:', messagesData); // Log fetched messages
        }, (error) => {
            console.error('Error fetching messages:', error); // Handle errors
        });

        return () => unsubscribe();
    }, [room]);

    const handleSendMessage = async (message) => {
        try {
            await addDoc(collection(db, `messages_${room}`), {
                text: message,
                username: username,
                timestamp: new Date(),
            });
            //console.log('Message sent:', message); // Log sent message
        } catch (error) {
            console.error("Error adding document:", error);
        }
    };

    const handleToggleRoom = () => {
        console.log('Current Role:', role); // Log current role before toggling
        if (role === 'admin') {
            const newRoom = room === 'student' ? 'admin' : 'student';
            setRoom(newRoom);
            setErrorMessage(''); // Clear any error messages
            //console.log('Room toggled to:', newRoom); // Log the toggled room
        } else {
            setErrorMessage('Access Denied: Only admins can access the admin room.');
            //console.log('Access denied for room toggle. Current role:', role); // Log access denied attempt
        }
    };

    return (
        <div className="chat-page">
            <div className="chat-sidebar">
                <h2>{room.charAt(0).toUpperCase() + room.slice(1)} Chat Room</h2>
                {role === 'admin' && ( // Only show toggle for admins
                    <button onClick={handleToggleRoom} className="toggle-button">
                        Switch to {room === 'student' ? 'Admin' : 'Student'} Room
                    </button>
                )}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
            <div className="chat-main">
                <MessageList messages={messages} />
                <ChatInput onSendMessage={handleSendMessage} />
            </div>
        </div>
    );
};

export default ChatPage;
