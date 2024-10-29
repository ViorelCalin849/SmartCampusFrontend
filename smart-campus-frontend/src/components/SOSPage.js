// src/components/SOSPage.js
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import '../styles/SOSPage.css'; // Import the CSS for the SOS page

const SOSPage = () => {
    const [message, setMessage] = useState('');
    const [location, setLocation] = useState('');

    const handleSendSOS = async () => {
        if (!message) {
            alert('Please enter a message before sending SOS.');
            return;
        }

        try {
            // Save SOS message to Firestore
            await addDoc(collection(db, 'sosMessages'), {
                message: message,
                location: location,
                timestamp: new Date(),
            });

            alert('SOS alert sent successfully!');
            setMessage(''); // Clear the message after sending
            setLocation(''); // Clear the location after sending
        } catch (error) {
            console.error('Error sending SOS alert:', error);
            alert('Failed to send SOS alert. Please try again.');
        }
    };

    return (
        <div className="sos-container">
            <h1 className="sos-title">SOS Alert</h1>
            <textarea
                className="sos-message-input"
                placeholder="Enter your SOS message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <input
                type="text"
                className="sos-location-input"
                placeholder="Enter your location (optional)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />
            <button className="sos-send-button" onClick={handleSendSOS}>
                Send SOS
            </button>
        </div>
    );
};

export default SOSPage;