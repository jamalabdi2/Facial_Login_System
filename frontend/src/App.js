import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Greeting from './components/Greeting';
import Register from './components/Register'
function App() {
    return (
        <Router>
            <Routes>
                <Route path= '/' element={<Register/>}/>
                <Route path="/login" element={<Login />} />
                <Route path="/greeting" element={<Greeting />} />
            </Routes>
        </Router>
    );
}

export default App;
