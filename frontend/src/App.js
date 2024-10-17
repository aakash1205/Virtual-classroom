import React from 'react';
import { Container, Grid2, Paper, Typography, AppBar, Toolbar, Button } from '@mui/material';
import { styled } from '@mui/system';
import Chat from './components/Chat';
import FileUpload from './components/FileUpload';
import VideoCall from './components/Videocall';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import {useNavigate }from './components/Router';



const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: '#1976d2', // Teal color for the app bar
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: '#f5f5f5',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    padding: theme.spacing(3),
    transition: 'transform 0.3s',
    '&:hover': {
        transform: 'scale(1.05)',
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#ff5722', // Orange color for buttons
    color: 'white',
    '&:hover': {
        backgroundColor: '#e64a19',
    },
}));

function App() {
    return (
        <Container maxWidth="lg" sx={{ marginTop: 4 }}>
            <StyledAppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Virtual Classroom
                    </Typography>
                    <StyledButton>Login</StyledButton>
                    <StyledButton sx={{ marginLeft: 1 }} >Sign Up</StyledButton>
                </Toolbar>
            </StyledAppBar>

            <Grid2 container spacing={4} sx={{ marginTop: 2 }}>
                <Grid2 item xs={12} sm={4}>
                    <StyledPaper>
                        <Typography variant="h5" align="center" color="#1976d2">Classroom Chat</Typography>
                        <Chat />
                    </StyledPaper>
                </Grid2>

                <Grid2 item xs={12} sm={4}>
                    <StyledPaper>
                        <Typography variant="h5" align="center" color="#1976d2">Upload Files</Typography>
                        <FileUpload />
                    </StyledPaper>
                </Grid2>

                <Grid2 item xs={12} sm={4}>
                    <StyledPaper>
                        <Typography variant="h5" align="center" color="#1976d2">Video Call</Typography>
                        <VideoCall />
                    </StyledPaper>
                </Grid2>
            </Grid2>
        </Container>
    );
}

export default App;
