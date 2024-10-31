// src/components/Dashboard.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css'; // Importing the CSS for the dashboard

const Dashboard = () => {
    const navigate = useNavigate();
    const [backendUp, setBackendUp] = useState(false); // Track backend status

    // Check if backend server is running
    useEffect(() => {
        const checkBackendStatus = async () => {
            try {
                const response = await fetch('https://localhost:7218/api/auth/status');
                if (response.ok) {
                    setBackendUp(true); // Set backend status to true if reachable
                } else {
                    setBackendUp(false);
                }
            } catch (error) {
                console.error("Backend check failed:", error);
                setBackendUp(false);
            }
        };

        checkBackendStatus();
    }, []);

    // Only render the dashboard if backend is up, otherwise show error message
    if (!backendUp) {
        return <p className="error">Backend server is currently down. Please try again later.</p>;
    }

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Welcome to Your Dashboard</h1>
            <div className="dashboard-buttons">
                <button className="dashboard-button" onClick={() => navigate('/chat')}>
                    Chat
                </button>
                <button className="dashboard-button" onClick={() => navigate('/sos')}>
                    SOS
                </button>
            </div>
        </div>
    );
};

export default Dashboard;