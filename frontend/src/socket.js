import { io } from 'socket.io-client';

// Connect to the backend Socket.IO server
const socket = io('http://localhost:5000'); // Ensure this URL points to your backend

export default socket;
