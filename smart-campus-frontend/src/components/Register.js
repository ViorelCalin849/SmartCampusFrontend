import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Register.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null); // Reset any existing errors

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const auth = getAuth();
        const db = getFirestore(); // Initialize Firestore

        try {
            // Step 1: Register the user with Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid; // Get the user's UID

            console.log("Registered with Firebase Auth. UserID:", userId);

            // Step 2: Save the username and email to Firestore directly
            await setDoc(doc(db, "users", userId), {
                email: email,
                username: username,
            });

            console.log("User data saved to Firestore.");

            alert("Registration successful. Redirecting to login.");
            navigate('/'); // Redirect to login page or home
        } catch (error) {
            setError("An error occurred during registration: " + error.message);
            console.error("Error during registration:", error);
        }
    };

    return (
        <div className="register-container">
            <h2 className="register-heading">Register</h2>
            <form onSubmit={handleRegister}>
                <div className="register-form-group">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="register-form-input"
                        required
                    />
                </div>
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