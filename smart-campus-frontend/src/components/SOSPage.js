import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, limit, updateDoc, doc } from 'firebase/firestore';
import { getDoc } from 'firebase/firestore';
import '../styles/SOSPage.css';

const SOSPage = () => {
    const [incidentType, setIncidentType] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [recentReports, setRecentReports] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [username, setUsername] = useState(''); // New state for username

    useEffect(() => {
        fetchRecentReports();
        checkUserRole(); // Check user role
    }, []);

    const checkUserRole = async () => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            const userDoc = await getDoc(doc(db, 'users', storedUserId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setIsAdmin(userData.role === 'admin');
                setUsername(userData.username); // Assuming username is also stored in user document
            }
        }
    };

    const handleSendSOS = async () => {
        if (!incidentType || !description) {
            alert('Please select an incident type and enter a description before sending SOS.');
            return;
        }

        // Confirmation dialog
        const userConfirmed = window.confirm(`Are you certain you wish to make this report, ${username}? If it is found to be a false report, you will be held liable for wasted resources and inciting panic.`);
        
        if (!userConfirmed) {
            return; // Exit if user cancels
        }

        const reportData = {
            type: incidentType,
            description: description,
            location: location,
            timestamp: new Date(),
            status: 'Pending',
            reporter: username, // Store the username of the reporter
        };

        try {
            await addDoc(collection(db, 'incidentReports'), reportData);
            alert('Incident report sent successfully!');
            setIncidentType('');
            setDescription('');
            setLocation('');
            fetchRecentReports();
        } catch (error) {
            console.error('Error sending SOS report:', error);
            alert('Failed to send report. Please try again.');
        }
    };

    const fetchRecentReports = async () => {
        try {
            const reportsQuery = query(
                collection(db, 'incidentReports'),
                orderBy('timestamp', 'desc'),
                limit(5)
            );
            const querySnapshot = await getDocs(reportsQuery);
            const reports = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRecentReports(reports);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    const handleDismissReport = async (reportId) => {
        try {
            const reportRef = doc(db, 'incidentReports', reportId);
            await updateDoc(reportRef, { status: 'Dismissed' });
            alert('Report status updated to Dismissed.');
            fetchRecentReports();
        } catch (error) {
            console.error('Error updating report status:', error);
            alert('Failed to update report status. Please try again.');
        }
    };

    return (
        <div className="sos-container">
            <h1 className="sos-title">Report Campus Incident</h1>
            <div className="sos-form">
                <select
                    className="sos-incident-type"
                    value={incidentType}
                    onChange={(e) => setIncidentType(e.target.value)}
                >
                    <option value="">Select Incident Type</option>
                    <option value="Medical">Medical Emergency</option>
                    <option value="Fire">Fire</option>
                    <option value="Suspicious Activity">Suspicious Activity</option>
                    <option value="Other">Other</option>
                </select>
                <textarea
                    className="sos-description-input"
                    placeholder="Describe the incident..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="text"
                    className="sos-location-input"
                    placeholder="Enter your location (optional)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <button className="sos-send-button" onClick={handleSendSOS}>
                    Send Report
                </button>
            </div>
            <div className="sos-recent-reports">
                <h2>Recent Reports</h2>
                <ul>
                    {recentReports.map(report => (
                        <li key={report.id} className="report-item">
                            <div className="report-details">
                                <strong>{report.type}</strong> - {report.description}
                                <br />
                                <span>Status: {report.status}</span> | <span>Location: {report.location}</span> | <span>Reporter: {report.reporter}</span>
                            </div>
                            {isAdmin && report.status === 'Pending' && (
                                <button
                                    className="dismiss-button"
                                    onClick={() => handleDismissReport(report.id)}
                                >
                                    Dismiss
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SOSPage;
