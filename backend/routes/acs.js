

const express = require('express');
const { CommunicationIdentityClient } = require('@azure/communication-identity');
require('dotenv').config();

const router = express.Router();
const connectionString = process.env.ACS_CONNECTION_STRING; // Ensure this is correctly set


// Endpoint to generate a token
router.post('/token', async (req, res) => {
    try {
        const identityClient = new CommunicationIdentityClient(connectionString);
        const user = await identityClient.createUser();
        const tokenResponse = await identityClient.getToken(user, ['voip']); // Specify the scopes you need
        res.json({ token: tokenResponse.token });
    } catch (error) {
        console.error('Error generating token:', error);
        res.status(500).json({ error: 'Failed to generate token' });
    }
});

module.exports = router;
