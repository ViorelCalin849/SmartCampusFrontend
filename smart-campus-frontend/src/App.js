import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login'; 
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/Dashboard';
import ChatPage from './components/ChatPage';
import './firebase';
import './App.css'; 
import SOSPage from './components/SOSPage';

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/sos" element={<SOSPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;