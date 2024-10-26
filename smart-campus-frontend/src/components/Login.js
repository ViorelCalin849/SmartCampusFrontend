import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import '../styles/Login.css';
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        const auth = getAuth();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();

            const response = await fetch('https://localhost:7218/api/Auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            alert('Login successful. User ID: ' + data.userId);
            setError('');
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

                {/* Flexbox container for Remember Me and Forgot Password */}
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