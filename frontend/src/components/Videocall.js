import React, { useEffect, useState, useRef } from 'react';
import {
    CallClient,
    LocalVideoStream,
    LocalAudioStream,
    VideoStreamRenderer,
} from '@azure/communication-calling';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import axios from 'axios';
import { Box, Button, Typography } from '@mui/material';

const VideoCall = () => {
    const [callClient, setCallClient] = useState(null);
    const [callAgent, setCallAgent] = useState(null);
    const [deviceManager, setDeviceManager] = useState(null);
    const [localVideoStream, setLocalVideoStream] = useState(null);
    const [localAudioStream, setLocalAudioStream] = useState(null);
    const [videoElement, setVideoElement] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const recordedChunks = useRef([]); // Store chunks of recorded video

    const initCallClient = async () => {
        try {
            const response = await axios.post('http://localhost:5000/acs/token');
            const token = response.data.token;

            const client = new CallClient();
            const userCredential = new AzureCommunicationTokenCredential(token);
            const agent = await client.createCallAgent(userCredential);
            const manager = await client.getDeviceManager();

            setCallClient(client);
            setCallAgent(agent);
            setDeviceManager(manager);
            console.log('CallClient and DeviceManager initialized successfully');
        } catch (error) {
            console.error('Error initializing CallClient:', error);
        }
    };

    const startLocalVideoStream = async () => {
        try {
            if (deviceManager) {
                const cameraList = await deviceManager.getCameras();
                const microphoneList = await deviceManager.getMicrophones();

                // Create local video and audio streams
                const videoStream = new LocalVideoStream(cameraList[0]);
                const audioStream = new LocalAudioStream(microphoneList[0]);

                setLocalVideoStream(videoStream);
                setLocalAudioStream(audioStream);

                // Render the local video
                const renderer = new VideoStreamRenderer(videoStream);
                const view = await renderer.createView();
                setVideoElement(view.target);

                // Start recording after successfully starting the streams
                startRecording(videoStream, audioStream);

                console.log('Local video stream started successfully');
            }
        } catch (error) {
            console.error('Error starting local video stream:', error);
        }
    };

    const startRecording = async (videoStream, audioStream) => {
        try {
            const videoMediaStream = await videoStream.getMediaStream(); // Get the MediaStream from LocalVideoStream
            const audioMediaStream = await audioStream.getMediaStream(); // Get MediaStream from LocalAudioStream

            // Combine video and audio tracks into a single MediaStream
            const combinedStream = new MediaStream([
                ...videoMediaStream.getTracks(),
                ...audioMediaStream.getTracks(),
            ]);

            const recorder = new MediaRecorder(combinedStream);

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.current.push(event.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(recordedChunks.current, { type: 'video/mp4' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'recording.mp4';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                recordedChunks.current = []; // Reset chunks after download
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
            console.log('Recording started');
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
            console.log('Recording stopped');
        }
    };

    const stopVideo = () => {
        if (localVideoStream) {
            localVideoStream.dispose(); // Dispose of the video stream
            setVideoElement(null); // Clear the video element
            stopRecording(); // Stop recording when video stops
            console.log('Video stopped');
        }
    };

    useEffect(() => {
        initCallClient();

        return () => {
            if (localVideoStream) {
                localVideoStream.dispose();
            }
            if (mediaRecorder) {
                mediaRecorder.stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <Box>
            {videoElement ? (
                <Box ref={ref => ref && ref.appendChild(videoElement)} style={{ width: '400px', height: '300px' }} />
            ) : (
                <Typography>Video stream is not active.</Typography>
            )}
            <Button
                variant="contained"
                color="primary"
                onClick={startLocalVideoStream}
                disabled={isRecording}
                style={{ marginTop: '20px' }}
            >
                Start Video
            </Button>
            <Button
                variant="contained"
                color="secondary"
                onClick={stopVideo}
                style={{ marginTop: '20px', marginLeft: '10px' }}
            >
                Stop Video
            </Button>
            <Button
                variant="contained"
                color="default"
                onClick={stopRecording}
                disabled={!isRecording}
                style={{ marginTop: '20px', marginLeft: '10px' }}
            >
                Stop Recording
            </Button>
        </Box>
    );
};

export default VideoCall;
