import React, { useState, useEffect } from 'react';
import socket from '../socket';
import { Box, Button, TextField, Typography, List, ListItem, ListItemText, Divider, Paper } from '@mui/material';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [classroomId, setClassroomId] = useState('');
    const [isJoined, setIsJoined] = useState(false);

    useEffect(() => {
        if (isJoined && classroomId) {
            socket.emit('join_classroom', classroomId);
            socket.on('receive_message', (data) => {
                setMessages((prevMessages) => [...prevMessages, data]);
            });

            return () => {
                socket.off('receive_message');
            };
        }
    }, [isJoined, classroomId]);

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (message.trim() && classroomId) {
            const data = {
                classroomId,
                message,
            };
            socket.emit('send_message', data);
            setMessages((prevMessages) => [...prevMessages, data]);
            setMessage('');
        }
    };

    const handleJoinClassroom = () => {
        if (classroomId) {
            setIsJoined(true);
        }
    };

    return (
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, backgroundColor: '#f9f9f9', minHeight: '400px' }}>
            {!isJoined ? (
                <Box textAlign="center">
                    <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 'bold' }}>Join the Classroom</Typography>
                    <TextField
                        label="Classroom ID"
                        variant="outlined"
                        fullWidth
                        value={classroomId}
                        onChange={(e) => setClassroomId(e.target.value)}
                        sx={{ marginBottom: 2, borderColor: '#1976d2' }}
                    />
                    <Button variant="contained" onClick={handleJoinClassroom} fullWidth sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#115293' } }}>
                        Join Classroom
                    </Button>
                </Box>
            ) : (
                <Box>
                    <Typography variant="h6" sx={{ color: '#1976d2', marginBottom: 2 }}>Chat Room: {classroomId}</Typography>
                    <Divider />
                    <List sx={{ maxHeight: 200, overflow: 'auto', marginY: 2, border: '1px solid #ddd', borderRadius: '4px' }}>
                        {messages.map((msg, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={msg.message} />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <form onSubmit={handleSendMessage}>
                        <TextField
                            label="Type your message"
                            variant="outlined"
                            fullWidth
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            sx={{ marginBottom: 2 }}
                        />
                        <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}>
                            Send
                        </Button>
                    </form>
                </Box>
            )}
        </Paper>
    );
};

export default Chat;
