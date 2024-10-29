// src/components/MessageList.js
import React, { useEffect, useRef } from 'react';
import '../styles/ChatPage.css';

const MessageList = ({ messages }) => {
    const messageEndRef = useRef(null);

    useEffect(() => {
        // Scroll to the bottom whenever messages change
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="message-list">
            {messages.map((message) => (
                <div key={message.id} className={`message ${message.userType}`}>
                    <span className="message-user">{message.username} ({message.userType})</span> {/* Display username */}
                    <span className="message-timestamp">
                        {new Date(message.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div className="message-text">{message.text}</div>
                </div>
            ))}
            {/* Invisible div to act as the end of the message list */}
            <div ref={messageEndRef} />
        </div>
    );
};

export default MessageList;