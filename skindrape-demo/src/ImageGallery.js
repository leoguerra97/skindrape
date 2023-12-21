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
            const response = await fetch('http://127.0.0.1:5000/images');
            const data = await response.json();
            setImages(data);
        };

        fetchImages();
    }, []);

    const openModal = async (image) => {
        setSelectedImage(image);
        // Fetch the response content
        const response = await fetch(image.response_path);
        const responseData = await response.json();
        setSelectedResponse(responseData);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedResponse(null); // Clear the response on modal close
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
                            <pre>{JSON.stringify(selectedResponse, null, 2)}</pre>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default ImageGallery;
