import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ImageUpload from './ImageUpload';
import ImageGallery from './ImageGallery'; // This will be your new component

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

                <Routes>
                    <Route path="/gallery" element={<ImageGallery />} />
                    <Route path="/" element={<ImageUpload />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
