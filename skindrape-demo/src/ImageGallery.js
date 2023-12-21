import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './ImageGallery.css';


Modal.setAppElement('#root');

const ImageGallery = () => {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        const fetchImages = async () => {
            const response = await fetch('http://127.0.0.1:5000/images');
            const data = await response.json();
            setImages(data);
        };

        fetchImages();
    }, []);

    const openModal = (image) => {
        setSelectedImage(image);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div>
            <h2>Image Gallery</h2>
            <div className="image-grid">
                {images.map((image, index) => (
                    <div key={index} className="image-item" onClick={() => openModal(image)}>
                        {/* Display standard icon and filename */}
                        <img src="path_to_standard_icon" alt="Icon" style={{ maxWidth: '50px', cursor: 'pointer' }} />
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
                {selectedImage && (
                    <div>
                        <img src={selectedImage.image_path} alt="Selected" style={{ maxWidth: '300px' }} />
                        <div className="response">
                            {/* Display the content from the JSON response */}
                            <pre>{JSON.stringify(selectedImage.response, null, 2)}</pre>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default ImageGallery;
