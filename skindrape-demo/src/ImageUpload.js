import React, { useState } from 'react';

function formatText(text) {
    return text.split('\n').map((line, index) => (
        <p key={index}>{line}</p>
    ));
}

const ImageUpload = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [uploadResponses, setUploadResponses] = useState([]);
    const [uploadStatus, setUploadStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false); // State to manage loading status
    const [apiContents, setApiContents] = useState([]); // State to store the content from the API response

    const handleFileChange = (event) => {
        setSelectedFiles(Array.from(event.target.files));
        setUploadStatus('');
        setUploadResponses([]);
        setIsLoading(false);

        const files = Array.from(event.target.files);
        const filePreviews = files.map(file => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            return new Promise((resolve, reject) => {
                reader.onloadend = () => {
                    resolve(reader.result);
                };
                reader.onerror = reject;
            });
        });

        Promise.all(filePreviews).then(previews => setImagePreviews(previews));
    };

    const handleUpload = async () => {
        if (!selectedFiles || selectedFiles.length === 0) {
            setUploadStatus('Please select a file to upload.');
            return;
        }

        setIsLoading(true); // Set loading to true
        const formData = new FormData();
         selectedFiles.forEach((file, index) => {
        formData.append('image', file);
        });

        try {
            const response = await fetch('http://127.0.0.1:5000/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                setUploadStatus('Upload successful');
                setUploadResponses(result);

                // Extract the 'content' part from the response
                const contents = result.map(res => res.response?.response?.choices[0]?.message?.content || 'No content available');
                setApiContents(contents);

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
            <input type="file" onChange={handleFileChange} multiple />
            <button onClick={handleUpload}>Upload</button>
            {uploadStatus && <p>{uploadStatus}</p>}
            {isLoading && <p>Loading...</p>} {/* Loading Indicator */}

            {imagePreviews.map((preview, index) => (
                <div key={index}>
                    <h3>Preview:</h3>
                    <img src={preview} alt="Preview" style={{ maxWidth: '300px' }} />
                </div>
            ))}

            {apiContents.map((content, index) => (
                <div key={index}>
                    <h3>Clothing Article Classification:</h3>
                    <p>{formatText(content)}</p>
                </div>
            ))}
        </div>
    );
};

export default ImageUpload;