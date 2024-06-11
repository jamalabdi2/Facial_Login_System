
## **Facial Login System Using Flask, MongoDB and React**


This project implements a facial login system using Flask, React, and MongoDB. 

# Technologies Used

The following technologies were used to develop this Real-Time Facial Recognition System:

| Technology | Purpose |
|---|---|
| Flask | Web framework for building the backend API |
| OpenCV | Image processing library for face recognition |
| NumPy | Library for numerical computing in Python |
| Face_recognition | Library for face recognition functionalities |
| Flask-CORS | Extension for handling Cross-Origin Resource Sharing (CORS) |
| PyMongo (Optional) | Driver for interacting with MongoDB database (if applicable) |
| React | JavaScript library for building the user interface |
| React-Router-Dom | Routing library for managing navigation within the React application |
| Axios | Promise-based HTTP client for making API requests from the frontend |
| React-Webcam | React component for accessing the user's webcam |
| React-Toastify (Optional) | React component for displaying toast notifications (if used) |


# System Architecture
Overal system architecture

![image](https://github.com/jamalabdi2/Facial_Login_System/assets/113813239/fd1b6c60-1dec-4f0f-940a-f1d8fdd6de88)


# User Registration:
1. Users enter their username, and email, and capture their image.
2. The image is processed to extract face encodings, which are then stored in MongoDB alongside the user data.
3. Successful registration returns a confirmation message to the user.

![image](https://github.com/jamalabdi2/Facial_Login_System/assets/113813239/5d29ed18-3613-480b-b9e3-9cda3df5bd2b)

# User Login
1. Users capture their image.
2. The captured image is processed, and the face encoding is compared with the stored encodings in the database.
3. If a match is found, the user is logged in and greeted with a personalized message.
4. If no match is found, an error message is displayed indicating the face encoding does not match.


![image](https://github.com/jamalabdi2/Facial_Login_System/assets/113813239/661199ae-5575-4ea9-b267-e82b24f54e2b)

## API Endpoint Design
In this project, three API endpoints were designed for user registration, authentication, and interaction. 
Below is a detailed design of each API endpoint:


This section details the available API endpoints for this Real-Time Facial Recognition System:

| Endpoint | Method | Description | Request Body | Response |
|---|---|---|---|---|
| /register | POST | Registers a new user and stores their face image. |  * Email (String): User's email address.  * Username (String): User's chosen username.  * Image (String): Base64 encoded string of the user's face image. |  * Message (String): Success or error message.  * User ID (String): Unique identifier for the registered user (if successful). |
| /login | POST | Authenticates a user by comparing their submitted image to the stored facial data. |  * Image (String): Base64 encoded string of the user's face image.  * Username (String): User's username for authentication. |  * Message (String): Success or error message.  * User ID (String): Unique identifier for the authenticated user (if successful). |
| /greeting | GET | Retrieves the username associated with a valid user ID. |  * User ID (String): Unique identifier for a registered user. |  * Username (String): Username associated with the provided user ID (if successful). |


