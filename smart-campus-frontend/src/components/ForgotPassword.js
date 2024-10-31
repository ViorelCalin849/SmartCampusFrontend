// src/components/ForgotPassword.js

import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom'; 
import '../styles/ForgotPassword.css'; 

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        setLoading(true); // Set loading to true

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent! Please check your inbox.');
            setError('');
            setLoading(false); // Set loading to false after success
            // Navigate to the login page after a short delay for user visibility
            setTimeout(() => navigate('/'), 3000); // Redirect after 3 seconds
        } catch (error) {
            setLoading(false); // Set loading to false if an error occurs
            setError('Error sending password reset email: ' + error.message);
            setMessage('');
        }
    };

    return (
        <div className="forgot-password-container">
            <h1>Forgot Password</h1>
            {error && <p className="error">{error}</p>}
            {message && <p className="success">{message}</p>}
            <form onSubmit={handleResetPassword} className="forgot-password-form">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="forgot-password-input"
                />
                <button type="submit" className="forgot-password-button" disabled={loading}>
                    {loading ? 'Sending...' : 'Reset Password'}
                </button>
            </form>
            <p className="login-link">
                Remembered your password? <Link to="/" className="link">Login here</Link>
            </p>
        </div>
    );
};

export default ForgotPassword;
