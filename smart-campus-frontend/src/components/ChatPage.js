import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Import your Firestore configuration
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
    const [room, setRoom] = useState('student'); // Default room
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('student'); // Default role
    const [errorMessage, setErrorMessage] = useState('');
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [offlineUsers, setOfflineUsers] = useState([]);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');

        if (storedUserId) {
            fetchUserData(storedUserId);
            updateOnlineStatus(storedUserId, 'online');

            // Update user status to offline on component unmount or window close
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
                setRoom(userData.role === 'admin' ? 'admin' : 'student'); // Set initial room based on role
                // Ensure to set online status when user logs in
                updateOnlineStatus(userId, 'online');
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

    // Fetch all users to separate into online and offline
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

    // Filter online users into admins and students
    const admins = onlineUsers.filter(user => user.role === 'admin');
    const students = onlineUsers.filter(user => user.role === 'student');

    // Fetch messages based on the current room
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

    const handleSendMessage = async (message) => {
        try {
            await addDoc(collection(db, `messages_${room}`), {
                text: message,
                username: username,
                timestamp: new Date(),
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
                        {admins.length > 0 ? (
                            admins.map((user) => (
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
                        {students.length > 0 ? (
                            students.map((user) => (
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
                <ChatInput onSendMessage={handleSendMessage} />
            </div>
        </div>
    );
};

export default ChatPage;
