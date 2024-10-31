import React, { useEffect, useState, useRef } from 'react';
import { db } from '../firebase';
import {
    collection,
    doc,
    getDoc,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    updateDoc
} from 'firebase/firestore';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import '../styles/ChatPage.css';

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [room, setRoom] = useState('student');
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('student');
    const [errorMessage, setErrorMessage] = useState('');
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [offlineUsers, setOfflineUsers] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        
        if (storedUserId) {
            fetchUserData(storedUserId);
            updateOnlineStatus(storedUserId, 'online');

            const handleOfflineStatus = () => {
                updateOnlineStatus(storedUserId, 'offline');
            };
            window.addEventListener('beforeunload', handleOfflineStatus);
            return () => {
                handleOfflineStatus();
                window.removeEventListener('beforeunload', handleOfflineStatus);
            };
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
                setRoom(userData.role === 'admin' ? 'admin' : 'student');
            } else {
                console.error('User not found in Firestore');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const updateOnlineStatus = async (userId, status) => {
        try {
            await updateDoc(doc(db, 'users', userId), { status: status });
        } catch (error) {
            console.error("Error updating user status:", error);
        }
    };

    useEffect(() => {
        const usersQuery = collection(db, 'users');
        
        const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
            const usersData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            
            setOnlineUsers(usersData.filter(user => user.status === 'online'));
            setOfflineUsers(usersData.filter(user => user.status === 'offline'));
        });
        
        return () => unsubscribe();
    }, []);

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
        }, (error) => {
            console.error('Error fetching messages:', error);
        });

        return () => unsubscribe();
    }, [room]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (message) => {
        const isSOS = message.startsWith("SOS:"); // Check if message is an SOS
        const cleanMessage = isSOS ? message.replace("SOS:", "").trim() : message; // Clean the message

        try {
            await addDoc(collection(db, `messages_${room}`), {
                text: cleanMessage,
                username: username,
                timestamp: new Date(),
                isAdmin: role === 'admin',
                isSOS: isSOS // Include SOS flag in the message object
            });
        } catch (error) {
            console.error("Error adding document:", error);
        }
    };

    const handleToggleRoom = () => {
        if (role === 'admin') {
            const newRoom = room === 'student' ? 'admin' : 'student';
            setRoom(newRoom);
            setErrorMessage('');
        } else {
            setErrorMessage('Access Denied: Only admins can access the admin room.');
        }
    };

    return (
        <div className="chat-page">
            <div className="chat-sidebar">
                <h2>{room.charAt(0).toUpperCase() + room.slice(1)} Chat Room</h2>
                {role === 'admin' && (
                    <button onClick={handleToggleRoom} className="toggle-button">
                        Switch to {room === 'student' ? 'Admin' : 'Student'} Room
                    </button>
                )}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                
                <div className="user-list">
                    <h3>Admins (Online)</h3>
                    <ul className="online-users">
                        {onlineUsers.filter(user => user.role === 'admin').length > 0 ? (
                            onlineUsers.filter(user => user.role === 'admin').map((user) => (
                                <li key={user.id} className="online-user">
                                    {user.username}
                                </li>
                            ))
                        ) : (
                            <p>No admins online</p>
                        )}
                    </ul>

                    <h3>Students (Online)</h3>
                    <ul className="online-users">
                        {onlineUsers.filter(user => user.role === 'student').length > 0 ? (
                            onlineUsers.filter(user => user.role === 'student').map((user) => (
                                <li key={user.id} className="online-user">
                                    {user.username}
                                </li>
                            ))
                        ) : (
                            <p>No students online</p>
                        )}
                    </ul>

                    <h3>Offline Users</h3>
                    <ul className="offline-users">
                        {offlineUsers.length > 0 ? (
                            offlineUsers.map((user) => (
                                <li key={user.id} className="offline-user">
                                    {user.username} ({user.role})
                                </li>
                            ))
                        ) : (
                            <p>No offline users</p>
                        )}
                    </ul>
                </div>
            </div>
            <div className="chat-main">
                <MessageList messages={messages} />
                <div ref={messagesEndRef} />
                <ChatInput onSendMessage={handleSendMessage} />
            </div>
        </div>
    );
};

export default ChatPage;
