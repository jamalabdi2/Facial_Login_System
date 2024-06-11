import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Webcam from 'react-webcam';
import './Login.css'; 

function Login() {
    const webcamRef = useRef(null);
    const navigate = useNavigate();
    const [showWebcam, setShowWebcam] = useState(false);
    const [imageSrc, setImageSrc] = useState('');

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImageSrc(imageSrc);
    };

    const handleTakePicture = () => {
        setShowWebcam(true);
    };

    const handleCapturePicture = () => {
        capture();
        setShowWebcam(false);
    };

    const setCookie = (name, value, days) => {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/login', {
                image: imageSrc
            }, {
                withCredentials: true, 
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Request sent....');
            console.log(response);
            toast.success(response.data.message);
            if (response.data.student_id && response.data.username) {
                console.log('student_id from backend: ', response.data.student_id);
                console.log('username from backend: ', response.data.username);
                setCookie('student_id', response.data.student_id, 7); // expires in 7 days
                setCookie('username', response.data.username, 7); // expires in 7 days
                navigate('/greeting');
            }
        } catch (error) {
            console.error('Error logging in', error);
            toast.error('Login failed. Please try again.');
        }
    };

    const handleCameraToggle = () => {
        setShowWebcam(!showWebcam);
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                {showWebcam && (
                    <div>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                        />
                        <button type="button" onClick={handleCapturePicture}>
                            Capture Picture
                        </button>
                    </div>
                )}
                {!showWebcam && (
                    <button type="button" onClick={handleTakePicture}>
                        Take a Picture
                    </button>
                )}
                {imageSrc && (
                    <div>
                        <img src={imageSrc} alt="Captured" />
                    </div>
                )}
                <button type="submit">Login</button>
                <button type="button" onClick={handleCameraToggle}>Toggle Camera</button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Login;
