// src/components/Login.js
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore methods
import { db } from '../firebase'; // Import Firestore db instance
import '../styles/Login.css';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const auth = getAuth();
    
        try {
            // Sign in with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            // Fetch user data from Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                localStorage.setItem('username', userData.username); // Store username
                localStorage.setItem('role', userData.role); // Store user role
                localStorage.setItem('userId', user.uid);
                
            } else {
                console.log('No such user document!');
            }
    
            navigate('/dashboard'); // Redirect to dashboard on successful login
    
        } catch (error) {
            setError('An error occurred during login: ' + error.message);
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-heading">Login</h2>
            <form onSubmit={handleLogin}>
                <div className="login-form-group">
                    <input
                        type="email"
                        placeholder="Email / Username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="login-form-input"
                        required
                    />
                </div>
                <div className="login-form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-form-input"
                        required
                    />
                </div>

                <div className="remember-forgot-container">
                    <div className="remember-me-container">
                        <label>
                            <input
                                type="checkbox"
                                className="remember-me-checkbox"
                            />
                            Remember Me
                        </label>
                    </div>
                    <div className="forgot-password-container">
                        <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link>
                    </div>
                </div>

                {error && <p className="login-error-message">{error}</p>}
                <button type="submit" className="login-button">Login</button>
            </form>
            <p>
                Do you have an account? <Link to="/register" className="create-account-link">Register</Link>
            </p>
        </div>
    );
};

export default Login;