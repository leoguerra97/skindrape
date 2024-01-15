import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './ImageGallery.css';

Modal.setAppElement('#root');

const ImageGallery = () => {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedResponse, setSelectedResponse] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/images');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Received data:", data);

                const updatedData = data.map(item => {
                    // Extract the filename from the absolute path
                    const imageName = item.image_path.split('/').pop();
                    const responseName = item.response_path.split('/').pop();

                    return {
                        ...item,
                        image_path: `http://127.0.0.1:5000/images/${encodeURIComponent(imageName)}`,
                        response_path: `http://127.0.0.1:5000/responses/${encodeURIComponent(responseName)}`
                    };
                });

                setImages(updatedData);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };


        fetchImages();
    }, []);

    const openModal = async (image) => {
    setSelectedImage(image);
    try {
        const response = await fetch(image.response_path);
        console.log("Fetch response: ", response); // Log the full response
        if (!response.ok) {
            console.error('Failed to fetch image response:', response.statusText);
            return;
        }
        const responseData = await response.json();
        setSelectedResponse(responseData);
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
        <div>
            <h2>Image Gallery</h2>
            <div className="image-grid">
                {images.map((image, index) => (
                    <div key={index} className="image-item" onClick={() => openModal(image)}>
                        <img src={image.image_path} alt="Image" style={{ maxWidth: '50px', cursor: 'pointer' }} />
                        <p>{image.image_name}</p> {/* Assuming image_name is the filename */}
                    </div>
                ))}
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Image Details"
                // Add custom styling or className here
            >
                <button onClick={closeModal}>Close</button>
                {selectedImage && selectedResponse && (
                    <div>
                        <img src={selectedImage.image_path} alt="Selected" style={{ maxWidth: '300px' }} />
                        <div className="response">
                            {/* Display the 'content' message */}
                            <p>{selectedResponse.response.choices[0].message.content}</p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default ImageGallery;
