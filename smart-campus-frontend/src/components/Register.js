import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate for navigation
import '../styles/Register.css'; // Import your CSS file

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');
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

    const navigate = useNavigate(); // Initialize the navigate function

    const validateInput = () => {
        if (!username || !email || !password || !confirmPassword) {
            setError('All fields are required.');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return false;
        }
        if (!email.includes('@') || !email.includes('.')) {
            setError('Invalid email format.');
            return false;
        }
        setError(null); // Reset error if validation passes
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateInput()) return; // Ensure validation is checked

        const userData = {
            email: email,
            password: password,
            username: username,
        };

        try {
            const response = await fetch("https://localhost:7218/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || "Something went wrong!");
            }

            const data = await response.json();
            setSuccess("Registration successful!");
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');

            console.log("Registration successful:", data);
            navigate('/'); // Redirect to the login page (or home page) after successful registration
        } catch (error) {
            console.error("Error during registration:", error.message);
            setError(error.message);
        }
    };

    if (!backendUp) {
        return (
            <div className="BackEnd-Down">
                <p className="error">Backend server is currently down. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="register-container">
            <h2 className="register-heading">Register</h2>
            {error && <p className="register-error-message">{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <div className="register-form-group">
                    <input
                        type="text"
                        className="register-form-input"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="register-form-group">
                    <input
                        type="email"
                        className="register-form-input"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="register-form-group">
                    <input
                        type="password"
                        className="register-form-input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="register-form-group">
                    <input
                        type="password"
                        className="register-form-input"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="register-button">Register</button>
            </form>
            <p>Already have an account? <Link to="/" className="login-link">Login here</Link></p>
        </div>
    );
};

export default Register;
