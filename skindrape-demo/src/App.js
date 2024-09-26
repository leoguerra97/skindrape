// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ImageUpload from './ImageUpload';
import ImageGallery from './ImageGallery';

const App = () => {
    return (
        <Router>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Clothing Classifier
                    </Typography>
                    <Button color="inherit" component={RouterLink} to="/">
                        Upload Image
                    </Button>
                    <Button color="inherit" component={RouterLink} to="/gallery">
                        Image Gallery
                    </Button>
                </Toolbar>
            </AppBar>

            <Container sx={{ marginTop: 4 }}>
                <Routes>
                    <Route path="/gallery" element={<ImageGallery />} />
                    <Route path="/" element={<ImageUpload />} />
                </Routes>
            </Container>
        </Router>
    );
};

export default App;
