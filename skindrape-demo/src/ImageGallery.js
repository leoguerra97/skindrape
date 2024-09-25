import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';
import './ImageGallery.css';

Modal.setAppElement('#root');

function formatText(text) {
    return text.split('\n').map((line, index) => (
        <p key={index}>{line}</p>
    ));
}

function parseCategory(responseData) {
    const content = responseData.response.choices[0].message.content;
    console.log("---- Parsing category from response content ----");
    console.log(content);

    const categoryLine = content.split('\n').find(line => line.trim().startsWith("CATEGORY:"));
    console.log("Category LINE: ", categoryLine);

    return categoryLine ? categoryLine.split(':')[1].trim() : 'Unknown';
    /*
    ### Notes:
    1. **Performance Consideration**: The approach of fetching each image's response when rendering the gallery can be inefficient, especially if you have many images, as it will result in multiple network requests. Consider optimizing this by either pre-fetching this data or adjusting your backend to include category information in the `/images` endpoint response.
    2. **Error Handling**: Ensure to handle any potential errors in network requests or parsing.
    3. **Caching Responses**: If the category data doesn't change often, you might cache the responses or the parsed categories to improve performance.
    4. **Asynchronous Data Fetching**: Since fetching the response text is asynchronous, make sure it aligns well with your component's rendering logic. You might need to manage loading states or default values appropriately.
    By following these steps, you can effectively color or separate files in the image gallery based on their CATEGORY, enhancing the visual organization and user experience of your application.
     */
}

function getCategoryStyle(category) {
    switch (category) {
        case 'T-Shirt' :
            return 'shirtStyle'; // CSS class or style object
        case 'FE':
            return 'sweaterStyle';
        case 'SW':
            return 'pantsStyle';
        case 'CA':
            return 'shirtStyle';
        default:
            return 'defaultStyle';
    }
}


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

                const updatedData = await Promise.all(data.map(async item => {
                    // Extract the filename from the absolute path
                    const imageName = item.image_path.split('/').pop();
                    const responseName = item.response_path.split('/').pop();

                    // Fetch the response for the image
                    const response = await fetch(`http://127.0.0.1:5000/responses/${encodeURIComponent(responseName)}`);
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
        <div>
            <h2>Image Gallery</h2>
            <div className="image-grid">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`image-item ${getCategoryStyle(image.category)}`}
                        onClick={() => openModal(image)}
                    >
                        <img src={image.image_path} alt="Image" />
                        <p>{image.image_name}</p>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Image Details"
            >
                <button onClick={closeModal}>Close</button>
                {selectedImage && selectedResponse && (
                    <div>
                        <img src={selectedImage.image_path} alt="Selected" style={{ maxWidth: '300px' }} />
                        <div className="response">
                            {formatText(selectedResponse.response.choices[0].message.content)}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}


export default ImageGallery;
