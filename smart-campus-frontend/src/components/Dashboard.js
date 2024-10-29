// src/components/Dashboard.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css'; // Importing the CSS for the dashboard

const Dashboard = () => {
    const navigate = useNavigate();

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