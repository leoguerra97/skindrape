// ImageGallery.js

import React, { useEffect, useState } from 'react';
import {
    Typography,
    Grid,
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    Modal,
    Box,
    Backdrop,
    Fade,
    CircularProgress,
    Alert,
} from '@mui/material';
import LazyLoad from 'react-lazyload';

function formatText(text) {
    return text.split('\n').map((line, index) => (
        <Typography key={index} variant="body1">
            {line}
        </Typography>
    ));
}

function parseCategory(responseData) {
    const content = responseData.response.choices[0].message.content;
    console.log("---- Parsing category from response content ----");
    console.log(content);

    const categoryLine = content.split('\n').find(line => line.trim().startsWith("CATEGORY:"));
    console.log("Category LINE: ", categoryLine);

    return categoryLine ? categoryLine.split(':')[1].trim() : 'Unknown';
}

function getBorderColor(category) {
    switch (category.toUpperCase()) {
        case 'CA':
            return 'red';
        case 'SA':
            return 'orange';
        case 'SW':
            return 'green';
        case 'FE':
            return 'blue';
        case 'AC':
            return 'purple';
        // Add more categories as needed
        default:
            return 'gray';
    }
}

const ImageGallery = () => {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedResponse, setSelectedResponse] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://127.0.0.1:5000/images');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Received data:", data);

                const updatedData = await Promise.all(data.map(async item => {
                    // Extract the filename from the absolute path
                    const imageName = item.image_path.split('/').pop();
                    const responseName = item.response_path.split('/').pop();

                    // Fetch the response for the image
                    const response = await fetch(`http://127.0.0.1:5000/responses/${encodeURIComponent(responseName)}`);
                    if (!response.ok) {
                        console.error('Failed to fetch image response:', response.statusText);
                        return { ...item, category: 'Unknown' };
                    }
                    const responseData = await response.json();

                    // Parse the category from the response
                    const category = parseCategory(responseData);

                    return {
                        ...item,
                        image_path: `http://127.0.0.1:5000/images/${encodeURIComponent(imageName)}`,
                        response_path: `http://127.0.0.1:5000/responses/${encodeURIComponent(responseName)}`,
                        category: category
                    };
                }));

                setImages(updatedData);
            } catch (error) {
                console.error('Error fetching images:', error);
                setError('Failed to fetch images. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchImages();
    }, []);

    const openModal = async (image) => {
        try {
            const response = await fetch(image.response_path);

            console.log("Fetch response: ", response); // Log the full response
            if (!response.ok) {
                console.error('Failed to fetch image response:', response.statusText);
                return;
            }
            const responseData = await response.json();
            setSelectedResponse(responseData);

            // Here, pass the responseData directly to parseCategory
            image.category = parseCategory(responseData);
            setSelectedImage(image);

        } catch (error) {
            console.error('Error fetching response data:', error);
        }
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedResponse(null);
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Image Gallery
            </Typography>

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Box sx={{ mt: 2 }}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {images.map((image, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card
                                sx={{
                                    border: `5px solid ${getBorderColor(image.category)}`,
                                }}
                            >
                                <CardActionArea onClick={() => openModal(image)}>
                                    <LazyLoad height={200} offset={100} once>
                                        <CardMedia
                                            component="img"
                                            image={image.image_path}
                                            alt={image.image_name}
                                            sx={{
                                                width: '100%',
                                                height: 'auto',
                                            }}
                                        />
                                    </LazyLoad>
                                    <CardContent>
                                        <Typography variant="body2" color="textSecondary">
                                            {image.image_name}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Modal
                open={modalIsOpen}
                onClose={closeModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={modalIsOpen}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '90%',
                            maxWidth: 600,
                            maxHeight: '90vh',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            overflowY: 'auto',
                        }}
                    >
                        {selectedImage && selectedResponse && (
                            <>
                                <img
                                    src={selectedImage.image_path}
                                    alt="Selected"
                                    style={{ width: '100%', height: 'auto' }}
                                />
                                <Box sx={{ mt: 2 }}>
                                    {formatText(
                                        selectedResponse.response.choices[0].message.content
                                    )}
                                </Box>
                            </>
                        )}
                    </Box>
                </Fade>
            </Modal>
        </Box>
    );
};

export default ImageGallery;
