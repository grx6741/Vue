import './App.css';
import React from 'react';

import Home from './pages/Home';
import VideoRoom from './pages/VideoRoom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

import { 
    BrowserRouter, 
    Routes, 
    Route 
} from "react-router-dom";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/video' element={<VideoRoom />} />
                <Route path='/signin' element={<SignIn />} />
                <Route path='/signup' element={<SignUp />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
