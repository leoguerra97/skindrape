import React, { useState } from 'react';

const ImageUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [uploadResponse, setUploadResponse] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false); // State to manage loading status
    const [apiContent, setApiContent] = useState(''); // State to store the content from the API response


    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setUploadStatus('');
        setUploadResponse(null);
        setIsLoading(false);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadStatus('Please select a file to upload.');
            return;
        }

        setIsLoading(true); // Set loading to true
        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            console.log('Response request');
            const response = await fetch('http://127.0.0.1:5000/upload', {
                method: 'POST',
                body: formData,
            });

        console.log('Response received:', response);

            if (response.ok) {
                const result = await response.json();
                setUploadStatus('Upload successful');
                setUploadResponse(result);

                // Extract the 'content' part from the response
                const content = result.response?.response?.choices[0]?.message?.content;
                if (content) {
                    setApiContent(content);
                } else {
                    setApiContent('No content available');
                }

            } else {
                setUploadStatus('Upload failed.');
            }
        } catch (error) {
            console.error('Error:', error);
            setUploadStatus('Upload failed.');
        } finally {
            setIsLoading(false); // Set loading to false regardless of the outcome
        }
    };

    return (
        <div>
            <h2>Image Upload</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {uploadStatus && <p>{uploadStatus}</p>}
            {isLoading && <p>Loading...</p>} {/* Loading Indicator */}

            {imagePreview && (
                <div>
                    <h3>Preview:</h3>
                    <img src={imagePreview} alt="Preview" style={{ maxWidth: '300px' }} />
                </div>
            )}

            {apiContent && (
                <div>
                    <h3>API Content:</h3>
                    <p>{apiContent}</p>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
