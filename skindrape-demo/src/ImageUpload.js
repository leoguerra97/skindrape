// ImageUpload.js

import React, { useState } from 'react';
import {
    Typography,
    Button,
    LinearProgress,
    Box,
    Paper,
    Grid,
    Alert,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

function formatText(text) {
    return text.split('\n').map((line, index) => (
        <Typography key={index} variant="body1">
            {line}
        </Typography>
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
        selectedFiles.forEach((file) => {
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
                const errorText = await response.text();
                setUploadStatus(`Upload failed: ${errorText}`);
            }
        } catch (error) {
            console.error('Error:', error);
            setUploadStatus(`Upload failed: ${error.message}`);
        } finally {
            setIsLoading(false); // Set loading to false regardless of the outcome
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Image Upload
            </Typography>

            <Box>
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="upload-button"
                    multiple
                    type="file"
                    onChange={handleFileChange}
                />
                <label htmlFor="upload-button">
                    <Button
                        variant="contained"
                        component="span"
                        startIcon={<CloudUpload />}
                    >
                        Select Images
                    </Button>
                </label>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                    sx={{ ml: 2 }}
                    disabled={isLoading || selectedFiles.length === 0}
                >
                    Upload
                </Button>
            </Box>

            {uploadStatus && (
                <Box sx={{ mt: 2 }}>
                    <Alert severity={uploadStatus.startsWith('Upload successful') ? 'success' : 'error'}>
                        {uploadStatus}
                    </Alert>
                </Box>
            )}
            {isLoading && <LinearProgress sx={{ mt: 2 }} />}

            <Grid container spacing={2} sx={{ mt: 2 }}>
                {imagePreviews.map((preview, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6">Preview:</Typography>
                            <img src={preview} alt="Preview" style={{ width: '100%', height: 'auto' }} />
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {apiContents.map((content, index) => (
                <Box key={index} sx={{ mt: 2 }}>
                    <Typography variant="h6">Classification:</Typography>
                    {formatText(content)}
                </Box>
            ))}
        </Box>
    );
};

export default ImageUpload;
