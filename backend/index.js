const express = require('express');
const http = require('http'); // HTTP server for Socket.IO
const cors = require('cors');
const { Server } = require('socket.io'); // Import Socket.IO
const fileRoutes = require('./routes/files'); // Import file routes
require('dotenv').config();


const app = express();
const server = http.createServer(app); // Create HTTP server for Socket.IO

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse JSON bodies

const acsRouter = require('./routes/acs');
app.use('/acs', acsRouter);


// Use file upload routes
app.use('/api/files', fileRoutes);

// Create a new instance of Socket.IO
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Allow requests from React frontend
        methods: ['GET', 'POST']
    }
});

// Socket.IO logic
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Listen for a custom event, e.g., "join_classroom"
    socket.on('join_classroom', (classroomId) => {
        console.log(`User ${socket.id} joined classroom: ${classroomId}`);
        socket.join(classroomId); // Join a classroom-specific room
    });

    // Handle a message sent to the classroom
    socket.on('send_message', (data) => {
        console.log(`Message received in classroom ${data.classroomId}: ${data.message}`);
        io.to(data.classroomId).emit('receive_message', data); // Broadcast message to others in the room
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Start server on port 5000
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


