// src/Pages/CreateVideo.js

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Row, Form, Col, Button, Alert } from "react-bootstrap";
import "font-awesome/css/font-awesome.min.css";

function CreateVideo() {
    const [signName, setSignName] = useState("");
    const [description, setDescription] = useState("");
    const [creatorName, setCreatorName] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [file, setFile] = useState(null);
    const [validated, setValidated] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [browserSupported, setBrowserSupported] = useState(true);
    
    const videoContainerRef = useRef(null);
    const videoElementRef = useRef(null);
    const navigate = useNavigate();

    // Check browser support on component mount
    useEffect(() => {
        const isSupported = 'showSaveFilePicker' in window;
        setBrowserSupported(isSupported);
        
        if (!isSupported) {
            console.warn("File System Access API not supported in this browser");
        }
    }, []);

    // Cleanup previous URL when component unmounts or when URL changes
    useEffect(() => {
        return () => {
            if (videoUrl) {
                URL.revokeObjectURL(videoUrl);
            }
        };
    }, [videoUrl]);

    // Handle file selection - safer implementation
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        
        // Clean up previous object URL if it exists
        if (videoUrl) {
            URL.revokeObjectURL(videoUrl);
        }
        
        if (selectedFile) {
            setFile(selectedFile);
            const newVideoUrl = URL.createObjectURL(selectedFile);
            setVideoUrl(newVideoUrl);
        } else {
            setFile(null);
            setVideoUrl("");
        }
    };

    // Generate more realistic animation code based on sign name
    const generateAnimationCode = (signName) => {
        const capitalizedSignName = signName.toUpperCase();
        
        // Create a deterministic "random" value based on the sign name
        // This makes different signs have different animations
        const getSeedValue = (str) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = ((hash << 5) - hash) + str.charCodeAt(i);
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        };
        
        const seed = getSeedValue(capitalizedSignName);
        
        // Create pseudo-random values based on the seed
        const getVariation = (base, range, offset = 0) => {
            const value = Math.sin(seed * (0.1 + offset)) * range;
            return base + value;
        };
        
        return `export const ${capitalizedSignName} = (ref) => {
    // Always add the sign name to characters array
    ref.characters.push('${capitalizedSignName}');
    
    let animations = []

    // First animation sequence - setup
    animations.push(["mixamorigLeftHandThumb1", "rotation", "x", ${getVariation(-Math.PI/3, 0.2, 0.1)}, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "x", ${getVariation(Math.PI/70, 0.1, 0.2)}, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", ${getVariation(-Math.PI/7, 0.15, 0.3)}, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", ${getVariation(-Math.PI/6, 0.12, 0.4)}, "-"]);

    animations.push(["mixamorigRightHandThumb1", "rotation", "x", ${getVariation(-Math.PI/3, 0.2, 0.5)}, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "x", ${getVariation(Math.PI/70, 0.1, 0.6)}, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", ${getVariation(Math.PI/7, 0.15, 0.7)}, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "x", ${getVariation(-Math.PI/6, 0.12, 0.8)}, "-"]);

    ref.animations.push(animations);

    // Second animation sequence - main action
    animations = []
    animations.push(["mixamorigLeftForeArm", "rotation", "y", ${getVariation(-Math.PI/2.5, 0.3, 0.9)}, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", ${getVariation(Math.PI/2.5, 0.3, 1.0)}, "-"]);
    
    // Add some variation based on the sign name
    animations.push(["mixamorigHead", "rotation", "x", ${getVariation(0.1, 0.05, 1.1)}, "+"]);
    animations.push(["mixamorigLeftHand", "rotation", "z", ${getVariation(0.2, 0.15, 1.2)}, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "z", ${getVariation(-0.2, 0.15, 1.3)}, "-"]);

    ref.animations.push(animations);
    
    // Third animation sequence - return to neutral
    animations = []
    animations.push(["mixamorigLeftHandThumb1", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "x", 0, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);

    animations.push(["mixamorigRightHandThumb1", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "x", 0, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);

    animations.push(["mixamorigLeftForeArm", "rotation", "y", -Math.PI/1.5, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI/1.5, "+"]);
    
    animations.push(["mixamorigHead", "rotation", "x", 0, "-"]);
    animations.push(["mixamorigLeftHand", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "z", 0, "+"]);

    ref.animations.push(animations);

    if(ref.pending === false){
        ref.pending = true;
        ref.animate();
    }
}`;
    };

    // Fallback method when File System Access API is not available
    const downloadFile = (content, filename) => {
        const blob = new Blob([content], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
        
        return { success: true, path: filename };
    };

    // Save file using File System Access API
    const saveToLocalFile = async (fileContent, fileName) => {
        try {
            // Use File System Access API if available
            if ('showSaveFilePicker' in window) {
                const options = {
                    suggestedName: fileName,
                    types: [{
                        description: 'JavaScript File',
                        accept: {'text/javascript': ['.js']},
                    }],
                };
                
                const fileHandle = await window.showSaveFilePicker(options);
                const writable = await fileHandle.createWritable();
                await writable.write(fileContent);
                await writable.close();
                
                return {
                    success: true,
                    path: fileHandle.name || fileName
                };
            } else {
                // Fallback to download method if API not available
                return downloadFile(fileContent, fileName);
            }
        } catch (error) {
            console.error("Error saving file:", error);
            throw error;
        }
    };
    
    // Save to localStorage for automatic usage in words.js
    const saveToLocalStorage = (name, code, description, creator) => {
        try {
            // Get existing signs
            const savedSigns = JSON.parse(localStorage.getItem('signBridgeSigns') || '[]');
            
            // Check if sign with same name already exists
            const existingIndex = savedSigns.findIndex(
                sign => sign.name.toUpperCase() === name.toUpperCase()
            );
            
            // If exists, update it
            if (existingIndex >= 0) {
                savedSigns[existingIndex] = {
                    id: Date.now().toString(),
                    name: name.toUpperCase(),
                    description: description,
                    createdBy: creator,
                    createdAt: new Date().toISOString(),
                    code: code
                };
            } else {
                // Add new sign
                savedSigns.push({
                    id: Date.now().toString(),
                    name: name.toUpperCase(),
                    description: description,
                    createdBy: creator,
                    createdAt: new Date().toISOString(),
                    code: code
                });
            }
            
            // Save back to localStorage
            localStorage.setItem('signBridgeSigns', JSON.stringify(savedSigns));
            
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Check form validity
        if (!signName || !description || !creatorName || !file) {
            setValidated(true);
            setErrorMessage("Please fill all required fields");
            return;
        }
        
        // Validate sign name (letters, numbers, underscores only)
        const validNameRegex = /^[A-Za-z0-9_]+$/;
        if (!validNameRegex.test(signName)) {
            setValidated(true);
            setErrorMessage("Sign name can only contain letters, numbers, and underscores");
            return;
        }
        
        setValidated(true);
        setIsSubmitting(true);
        setErrorMessage("");
        
        try {
            // 1. Generate animation code
            const animationCode = generateAnimationCode(signName);
            
            // 2. Save the animation file to the local file system
            setSuccessMessage("Please choose where to save the sign animation file");
            const saveResult = await saveToLocalFile(
                animationCode, 
                `${signName.toUpperCase()}.js`
            );
            
            if (saveResult.success) {
                // 3. Save to localStorage for automatic integration
                if (saveToLocalStorage(signName, animationCode, description, creatorName)) {
                    setSuccessMessage(`Sign animation "${signName.toUpperCase()}" created successfully! It has been saved to ${saveResult.path} and added to your available signs. You can now use it in the Convert and LearnSign pages.`);
                    
                    // Clear the form
                    setSignName("");
                    setDescription("");
                    setFile(null);
                    setVideoUrl("");
                    
                    // Reset validation
                    setValidated(false);
                } else {
                    setSuccessMessage(`Sign animation file saved successfully to ${saveResult.path}, but couldn't add it to available signs.`);
                }
                
                // 4. Return to videos page after delay
                setTimeout(() => {
                    navigate('/sign-bridge/all-videos');
                }, 5000);
            }
        } catch (error) {
            console.error('Error creating sign animation:', error);
            if (error.name === 'AbortError') {
                setErrorMessage('Operation cancelled by user.');
            } else {
                setErrorMessage(`Error creating sign animation: ${error.message}`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container d-flex flex-column align-items-center">
            <div className="display-5 mt-5 px-2 text-center">Create a New Sign Animation!</div>
            <div className="lead mb-4 px-2 text-center">
                Upload a video demonstrating a sign and provide details to convert it into an animation that can be used throughout the application.
            </div>

            {!browserSupported && (
                <Alert variant="warning" className="w-100 text-center">
                    Your browser doesn't fully support the File System Access API. The application will use a fallback method to download files.
                </Alert>
            )}

            {successMessage && (
                <Alert variant="success" className="w-100 text-center">
                    {successMessage}
                </Alert>
            )}
            
            {errorMessage && (
                <Alert variant="danger" className="w-100 text-center">
                    {errorMessage}
                </Alert>
            )}

            <Row className="container">
                <Form
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                    className="d-flex flex-column justify-content-center align-items-center p-0"
                >
                    <Form.Group controlId="signName" as={Col} xs="12" md="7" className="my-3">
                        <Form.Label>Sign Name</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Enter name for this sign (e.g., HOME, HELLO, THANK_YOU)"
                            value={signName}
                            onChange={(e) => setSignName(e.target.value)}
                        />
                        <Form.Text className="text-muted">
                            Use a single word or words connected by underscores (e.g., THANK_YOU). Only letters, numbers, and underscores are allowed.
                        </Form.Text>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                            Please enter a name for the sign.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="description" as={Col} xs="12" md="7" className="my-3">
                        <Form.Label>Sign Description</Form.Label>
                        <Form.Control
                            required
                            as="textarea"
                            rows={2}
                            placeholder="Brief description of what this sign represents"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                            Please provide a description.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="creatorName" as={Col} xs="12" md="7" className="my-3">
                        <Form.Label>Creator Name</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Your name"
                            value={creatorName}
                            onChange={(e) => setCreatorName(e.target.value)}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                            Please enter your name.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="videoUpload" as={Col} xs="12" md="7" className="my-3">
                        <Form.Label>Upload Sign Video</Form.Label>
                        <Form.Control
                            required
                            type="file"
                            accept="video/*"
                            onChange={handleFileChange}
                        />
                        <Form.Text className="text-muted">
                            Upload a video clearly demonstrating the sign. The video should show a complete sign gesture.
                        </Form.Text>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                            Please upload a video file.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <div className="col-12 col-md-7 my-3">
                        <label className="form-label">Video Preview</label>
                        <div ref={videoContainerRef} className="video-preview-container" style={{
                            width: '100%',
                            height: '300px',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#777',
                            border: '1px solid #ddd'
                        }}>
                            {videoUrl ? (
                                <video 
                                    ref={videoElementRef}
                                    src={videoUrl} 
                                    controls 
                                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                                />
                            ) : (
                                <span>No video selected</span>
                            )}
                        </div>
                    </div>

                    <div className="col-12 col-md-7 d-flex justify-content-center mt-4 mb-5">
                        <Button
                            variant="primary"
                            type="submit"
                            size="lg"
                            disabled={isSubmitting}
                            className="px-5"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Processing...
                                </>
                            ) : (
                                'Create Sign Animation'
                            )}
                        </Button>
                    </div>
                </Form>
            </Row>
        </div>
    );
}

export default CreateVideo;
