import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Greeting.css';

function Greeting() {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    useEffect(() => {
        const fetchData = async () => {
            const backendURL = 'http://127.0.0.1:5000';
            const studentId = getCookie('student_id');
            if (!studentId) {
                console.error('Student ID not found in cookies');
                return;
            }
            const response = await fetch(`${backendURL}/greeting?student_id=${studentId}`);
            if (response.ok) {
                const data = await response.json();
                setUsername(data.username);
            } else {
                console.error('Failed to fetch username');
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        document.cookie = 'student_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        navigate('/');
    };

    return (
        <div className="greeting-container">
            <h2>Welcome {username}</h2>
            <p>Thank you for logging in.</p>
            <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
    );
}

export default Greeting;
