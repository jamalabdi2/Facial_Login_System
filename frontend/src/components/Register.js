import React, { useRef, useState } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Register.css'; // Import your CSS file

function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [showWebcam, setShowWebcam] = useState(false);
    const [imageSrc, setImageSrc] = useState('');

    const webcamRef = useRef(null);
    const navigate = useNavigate();

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Submit form data along with the captured image
        try {
            const response = await axios.post('http://127.0.0.1:5000/register', {
                email,
                username,
                image: imageSrc
            });
            console.log(response.data);
            toast.success('Registration successful!');
            navigate('/login');
        } catch (error) {
            console.error('Error registering user', error);
            toast.error('Registration failed. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
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
                <button className= 'registerBtn' type="submit">Register</button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Register;
