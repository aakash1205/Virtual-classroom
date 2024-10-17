import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography, CircularProgress } from '@mui/material';

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            setUploading(true);
            try {
                await axios.post('http://localhost:5000/api/files/upload', formData);
                setUploadSuccess(true);
            } catch (error) {
                console.error('File upload failed:', error);
            } finally {
                setUploading(false);
            }
        }
    };

    return (
        <Box>
            <input
                type="file"
                onChange={handleFileChange}
                style={{ marginBottom: '10px' }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={uploading}
                fullWidth
            >
                {uploading ? <CircularProgress size={24} /> : 'Upload File'}
            </Button>
            {uploadSuccess && (
                <Typography sx={{ marginTop: 2, color: 'green' }}>
                    File uploaded successfully!
                </Typography>
            )}
        </Box>
    );
};

export default FileUpload;


