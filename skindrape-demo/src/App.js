// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ImageUpload from './ImageUpload';
import ImageGallery from './ImageGallery';
import './App.css'; // Import the CSS file

const App = () => {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Upload Image</Link>
                        </li>
                        <li>
                            <Link to="/gallery">Image Gallery</Link>
                        </li>
                    </ul>
                </nav>

                <div className="container">
                    <Routes>
                        <Route path="/gallery" element={<ImageGallery />} />
                        <Route path="/" element={<ImageUpload />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
