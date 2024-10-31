import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
            // Sign in with Email/Password
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await handleUserData(userCredential.user);
            localStorage.setItem('userId', userCredential.user.uid); // Store userId in local storage
            navigate('/dashboard');
        } catch (error) {
            setError('An error occurred during login: ' + error.message);
        }
    };

    const handleGoogleSignIn = async () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            await handleUserData(result.user);
            localStorage.setItem('userId', result.user.uid); // Store userId in local storage
            navigate('/dashboard');
        } catch (error) {
            setError('An error occurred during Google sign-in: ' + error.message);
        }
    };

    const handleGithubSignIn = async () => {
        const auth = getAuth();
        const provider = new GithubAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            await handleUserData(result.user);
            localStorage.setItem('userId', result.user.uid); // Store userId in local storage
            navigate('/dashboard');
        } catch (error) {
            setError('An error occurred during GitHub sign-in: ' + error.message);
        }
    };

    const handleUserData = async (user) => {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
            // Create a new user document in Firestore
            const userData = {
                email: user.email,
                username: user.displayName || user.email.split('@')[0], // Use display name or email prefix
                role: 'student', // Default role
                status: 'online', // Set status as online
            };
            await setDoc(userDocRef, userData);
        } else {
            await setDoc(userDocRef, { status: 'online' }, { merge: true });
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="login-form-input" // Add your custom class if needed
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="login-form-input" // Add your custom class if needed
                />
                
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
    
                <button type="submit" className="login-button">Login</button>
            </form>
            
            <p>or</p>
            
            {/* Flex container for Google and GitHub buttons */}
            <div className="oauth-buttons-container">
                <button className="oauth-button google" onClick={handleGoogleSignIn}>
                    Login with Google
                </button>
                <button className="oauth-button github" onClick={handleGithubSignIn}>
                    Login with GitHub
                </button>
            </div>
    
            <p>
                Don't have an account? <Link to="/register" className="forgot-password-link">Register here</Link>
            </p>
        </div>
    );
};

export default Login;
