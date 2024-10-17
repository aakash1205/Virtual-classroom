


const express = require('express');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const router = express.Router();
require('dotenv').config();

// Set up multer for file upload handling
const upload = multer({ storage: multer.memoryStorage() });

// Define the route for file upload
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient('classroom-files');
        const blockBlobClient = containerClient.getBlockBlobClient(req.file.originalname);

        await blockBlobClient.upload(req.file.buffer, req.file.size);

        res.status(200).send('File uploaded successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('File upload failed');
    }
});

module.exports = router;

