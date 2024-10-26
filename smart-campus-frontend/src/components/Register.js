import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Register.css';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const auth = getAuth();

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Registration successful. Redirecting to login.");
            navigate('/');
        } catch (error) {
            setError("An error occurred during registration: " + error.message);
        }
    };

    return (
        <div className="register-container">
            <h2 className="register-heading">Register</h2>
            <form onSubmit={handleRegister}>
                <div className="register-form-group">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="register-form-input"
                        required
                    />
                </div>
                <div className="register-form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="register-form-input"
                        required
                    />
                </div>
                <div className="register-form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="register-form-input"
                        required
                    />
                </div>

                {error && <p className="register-error-message">{error}</p>}

                <button type="submit" className="register-button">Register</button>
            </form>
            <p>
                Already have an account? <Link to="/" className="login-link">Login</Link>
            </p>
        </div>
    );
};

export default Register;
