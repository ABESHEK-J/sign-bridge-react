import React, { useState, useEffect, useRef } from 'react';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';

const AddSign = () => {
    const [signName, setSignName] = useState('');
    const [uploadStatus, setUploadStatus] = useState('');
    const [processingStatus, setProcessingStatus] = useState('');
    const [dictionary, setDictionary] = useState([]);
    const [detector, setDetector] = useState(null);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [processingProgress, setProcessingProgress] = useState(0);
    
    const videoPreviewRef = useRef(null);
    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);
    
    useEffect(() => {
        // Initialize the canvas for frame extraction
        canvasRef.current = document.createElement('canvas');
        
        // Load hand pose detection model
        loadHandPoseModel();
        
        // Load sign dictionary from IndexedDB
        loadSignDictionary();
        
        // Clean up on component unmount
        return () => {
            if (detector) {
                detector.dispose();
            }
        };
    }, []);
    
    const loadHandPoseModel = async () => {
        try {
            setProcessingStatus('Loading hand pose detection model...');
            
            const model = handPoseDetection.SupportedModels.MediaPipeHands;
            const detectorConfig = {
                runtime: 'mediapipe',
                solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
                modelType: 'full'
            };
            
            const handPoseDetector = await handPoseDetection.createDetector(model, detectorConfig);
            setDetector(handPoseDetector);
            setIsModelLoaded(true);
            setProcessingStatus('Hand pose detection model loaded successfully.');
        } catch (error) {
            console.error('Error loading model:', error);
            setProcessingStatus('Error loading hand pose detection model. Please refresh the page.');
        }
    };
    
    const loadSignDictionary = () => {
        const request = indexedDB.open('SignBridgeDB', 1);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('signs')) {
                db.createObjectStore('signs', { keyPath: 'id' });
            }
        };
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['signs'], 'readonly');
            const objectStore = transaction.objectStore('signs');
            const getAllRequest = objectStore.getAll();
            
            getAllRequest.onsuccess = () => {
                setDictionary(getAllRequest.result);
            };
        };
        
        request.onerror = (event) => {
            console.error('Database error:', event.target.error);
            setUploadStatus('Error: Cannot access sign dictionary.');
        };
    };
    
    const handleVideoSelection = (e) => {
        const file = e.target.files[0];
        if (file) {
            const videoURL = URL.createObjectURL(file);
            if (videoPreviewRef.current) {
                videoPreviewRef.current.innerHTML = `<video src="${videoURL}" controls></video>`;
                
                // Store video URL in localStorage for persistence
                localStorage.setItem('lastVideoPreview', videoURL);
            }
        } else {
            if (videoPreviewRef.current) {
                videoPreviewRef.current.innerHTML = "No video selected";
            }
        }
    };
    
    const extractFramesFromVideo = async (videoElement) => {
        return new Promise((resolve) => {
            // Wait for video metadata to load
            if (videoElement.readyState < 2) {
                videoElement.addEventListener('loadeddata', () => extractFrames());
            } else {
                extractFrames();
            }
            
            function extractFrames() {
                const duration = videoElement.duration;
                const frameRate = 10; // 10 frames per second
                const totalFrames = Math.min(100, Math.floor(duration * frameRate)); // Limit to 100 frames
                
                const canvas = canvasRef.current;
                canvas.width = videoElement.videoWidth;
                canvas.height = videoElement.videoHeight;
                const ctx = canvas.getContext('2d');
                
                const frames = [];
                let framesProcessed = 0;
                
                // Process frames sequentially
                processFrame(0);
                
                function processFrame(frameIndex) {
                    if (frameIndex >= totalFrames) {
                        resolve(frames);
                        return;
                    }
                    
                    const time = frameIndex / frameRate;
                    videoElement.currentTime = time;
                    
                    videoElement.onseeked = async () => {
                        // Draw the current frame to canvas
                        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                        
                        // Capture the frame data as an ImageData object
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        
                        frames.push({
                            time: time,
                            imageData: imageData
                        });
                        
                        framesProcessed++;
                        setProcessingProgress(Math.floor((framesProcessed / totalFrames) * 100));
                        setProcessingStatus(`Extracting frames: ${framesProcessed}/${totalFrames}`);
                        
                        // Process the next frame
                        processFrame(frameIndex + 1);
                    };
                }
            }
        });
    };
    
    const analyzeVideoForHandPose = async (videoElement) => {
        if (!detector) {
            setProcessingStatus('Hand pose detector not available');
            return { animations: [] };
        }
        
        setProcessingStatus('Starting hand pose analysis...');
        
        try {
            // Extract frames from the video
            const frames = await extractFramesFromVideo(videoElement);
            setProcessingStatus(`Extracted ${frames.length} frames. Starting pose detection...`);
            
            // Each frame in the animations array will be an array of animation commands
            // in the format you're using: [bone, property, axis, value, direction]
            const animations = [];
            
            // Process each frame for hand pose
            for (let i = 0; i < frames.length; i++) {
                setProcessingStatus(`Analyzing frame ${i+1}/${frames.length} for hand poses...`);
                setProcessingProgress(Math.floor((i / frames.length) * 100));
                
                // Set the video to the current frame time for MediaPipe to analyze
                videoElement.currentTime = frames[i].time;
                await new Promise(resolve => videoElement.onseeked = resolve);
                
                // Detect hands in the current frame
                const hands = await detector.estimateHands(videoElement);
                
                // Create an array to store animation commands for this frame
                const frameAnimations = [];
                
                if (hands.length > 0) {
                    // We have at least one hand detected
                    processHandsIntoAnimations(hands, frameAnimations);
                }
                
                // If we detected hand poses and have animation commands, add this frame to animations
                if (frameAnimations.length > 0) {
                    animations.push(frameAnimations);
                }
            }
            
            setProcessingStatus('Hand pose analysis complete!');
            
            // If no hands were detected in any frame, create placeholder animations
            if (animations.length === 0) {
                setProcessingStatus('No hand movements detected. Using placeholder animation data.');
                return createPlaceholderAnimationData();
            }
            
            // Add a final frame to return hands to neutral position
            animations.push(createNeutralPositionFrame());
            
            return {
                animations: animations,
                frameCount: frames.length,
                duration: videoElement.duration
            };
            
        } catch (error) {
            console.error('Error in video analysis:', error);
            setProcessingStatus('Error analyzing video. Using placeholder animation data.');
            return createPlaceholderAnimationData();
        }
    };
    
    // Process detected hands and convert to animation commands
    const processHandsIntoAnimations = (hands, frameAnimations) => {
        hands.forEach(hand => {
            const handedness = hand.handedness;
            const landmarks = hand.keypoints;
            const prefix = handedness === 'Left' ? 'mixamorigLeft' : 'mixamorigRight';
            const sign = handedness === 'Left' ? '-' : '+';
            
            // Process fingers
            processFingers(landmarks, frameAnimations, prefix, sign);
            
            // Process wrist and arm
            processWristAndArm(landmarks, frameAnimations, prefix, sign);
        });
    };
    
    // Process fingers from landmarks
    const processFingers = (landmarks, frameAnimations, prefix, sign) => {
        // Define finger landmarks mapping
        const fingerLandmarks = {
            Index: { mcp: 5, pip: 6, dip: 7, tip: 8 },
            Middle: { mcp: 9, pip: 10, dip: 11, tip: 12 },
            Ring: { mcp: 13, pip: 14, dip: 15, tip: 16 },
            Pinky: { mcp: 17, pip: 18, dip: 19, tip: 20 },
            Thumb: { mcp: 1, pip: 2, dip: 3, tip: 4 }
        };
        
        // Process each finger
        for (const [fingerName, indices] of Object.entries(fingerLandmarks)) {
            if (fingerName === 'Thumb') {
                // Thumb has different movement mechanics
                processThumb(landmarks, frameAnimations, prefix, sign, indices);
            } else {
                // Regular fingers bend on Z axis
                const bendAngle = calculateFingerBend(
                    landmarks[indices.mcp], 
                    landmarks[indices.pip], 
                    landmarks[indices.dip], 
                    landmarks[indices.tip]
                );
                
                // Apply different bend angles to each joint for natural bending
                frameAnimations.push([`${prefix}Hand${fingerName}1`, "rotation", "z", bendAngle, sign]);
                frameAnimations.push([`${prefix}Hand${fingerName}2`, "rotation", "z", bendAngle * 0.8, sign]);
                frameAnimations.push([`${prefix}Hand${fingerName}3`, "rotation", "z", bendAngle * 0.6, sign]);
            }
        }
    };
    
    // Special processing for thumb which has different movement
    const processThumb = (landmarks, frameAnimations, prefix, sign, indices) => {
        const thumbBase = landmarks[indices.mcp]; // CMC joint
        const thumbMcp = landmarks[indices.pip]; // MCP joint
        const thumbIp = landmarks[indices.dip];  // IP joint
        const thumbTip = landmarks[indices.tip]; // Tip
        
        if (thumbBase && thumbMcp && thumbIp && thumbTip) {
            // Calculate thumb rotation on Y axis (opposition)
            const oppositionAngle = calculateThumbOpposition(thumbBase, thumbMcp, thumbIp, thumbTip);
            frameAnimations.push([`${prefix}HandThumb1`, "rotation", "y", oppositionAngle, sign]);
            
            // Calculate thumb bend
            const bendAngle = calculateThumbBend(thumbBase, thumbMcp, thumbIp, thumbTip);
            frameAnimations.push([`${prefix}HandThumb2`, "rotation", "z", bendAngle * 0.7, sign]);
            frameAnimations.push([`${prefix}HandThumb3`, "rotation", "z", bendAngle * 0.5, sign]);
        }
    };
    
    // Process wrist and arm positions
    const processWristAndArm = (landmarks, frameAnimations, prefix, sign) => {
        const wrist = landmarks[0];
        
        if (wrist) {
            // Calculate wrist rotations
            const wristRotX = calculateWristRotationX(landmarks);
            const wristRotY = calculateWristRotationY(landmarks);
            const wristRotZ = calculateWristRotationZ(landmarks);
            
            frameAnimations.push([`${prefix}Hand`, "rotation", "x", wristRotX, "+"]);
            frameAnimations.push([`${prefix}Hand`, "rotation", "y", wristRotY, "+"]);
            
            // Forearm rotation
            const forearmZ = wristRotZ * 0.8;
            frameAnimations.push([`${prefix}ForeArm`, "rotation", "z", forearmZ, sign]);
            
            // Arm position - approximate based on wrist position
            const armRotZ = calculateArmRotation(landmarks, sign === '-' ? -1 : 1);
            frameAnimations.push([`${prefix}Arm`, "rotation", "z", armRotZ, sign]);
            
            // Optional: y-rotation of arm based on hand position
            const armRotY = calculateArmYRotation(landmarks);
            if (Math.abs(armRotY) > 0.1) { // Only add if significant
                frameAnimations.push([`${prefix}Arm`, "rotation", "y", armRotY, "+"]);
            }
        }
    };
    
    // Calculate finger bend angle
    const calculateFingerBend = (mcp, pip, dip, tip) => {
        // Safety check for undefined landmarks
        if (!mcp || !pip || !dip || !tip) return 0;
        
        // Calculate vectors between joints
        const v1 = { x: pip.x - mcp.x, y: pip.y - mcp.y };
        const v2 = { x: tip.x - pip.x, y: tip.y - pip.y };
        
        // Normalize vectors
        const v1Mag = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
        const v2Mag = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
        
        if (v1Mag === 0 || v2Mag === 0) return 0;
        
        v1.x /= v1Mag;
        v1.y /= v1Mag;
        v2.x /= v2Mag;
        v2.y /= v2Mag;
        
        // Calculate dot product and clamp to [-1, 1]
        const dotProduct = Math.max(-1, Math.min(1, v1.x * v2.x + v1.y * v2.y));
        
        // Get angle in radians
        const angleBetween = Math.acos(dotProduct);
        
        // Scale to get a rotation value
        // Max bend would be Math.PI/2 (90 degrees)
        return Math.min(Math.PI/2, angleBetween);
    };
    
    // Calculate thumb opposition angle
    const calculateThumbOpposition = (base, mcp, ip, tip) => {
        // Simplified: Using the angle between thumb direction and palm direction
        if (!base || !mcp || !tip) return 0;
        
        // Simplified calculation - real implementation would use 3D vectors
        const thumbDir = { x: tip.x - base.x, y: tip.y - base.y };
        
        // Normalization
        const thumbMag = Math.sqrt(thumbDir.x * thumbDir.x + thumbDir.y * thumbDir.y);
        if (thumbMag === 0) return 0;
        
        thumbDir.x /= thumbMag;
        thumbDir.y /= thumbMag;
        
        // Approximation of opposition angle
        // This would be better with 3D data, but we're approximating from 2D
        return Math.PI/4 * (1 - Math.abs(thumbDir.x));
    };
    
    // Calculate thumb bend angle
    const calculateThumbBend = (base, mcp, ip, tip) => {
        // Similar to finger bend, but specific for thumb
        if (!base || !mcp || !ip || !tip) return 0;
        
        const v1 = { x: mcp.x - base.x, y: mcp.y - base.y };
        const v2 = { x: tip.x - ip.x, y: tip.y - ip.y };
        
        const v1Mag = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
        const v2Mag = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
        
        if (v1Mag === 0 || v2Mag === 0) return 0;
        
        v1.x /= v1Mag;
        v1.y /= v1Mag;
        v2.x /= v2Mag;
        v2.y /= v2Mag;
        
        const dotProduct = Math.max(-1, Math.min(1, v1.x * v2.x + v1.y * v2.y));
        return Math.acos(dotProduct) * 0.8; // Scale down slightly
    };
    
    // Calculate wrist rotation on X axis (pitch)
    const calculateWristRotationX = (landmarks) => {
        const wrist = landmarks[0];
        const middle_mcp = landmarks[9]; // Middle finger MCP
        
        if (!wrist || !middle_mcp) return 0;
        
        // Calculate pitch based on middle finger MCP position relative to wrist
        // Positive Y is down in image coordinates, so we invert
        const pitch = (middle_mcp.y - wrist.y) / 100; // Scale factor
        
        return Math.max(-Math.PI/4, Math.min(Math.PI/4, pitch));
    };
    
    // Calculate wrist rotation on Y axis (yaw)
    const calculateWristRotationY = (landmarks) => {
        const wrist = landmarks[0];
        const index_mcp = landmarks[5]; // Index finger MCP
        const pinky_mcp = landmarks[17]; // Pinky finger MCP
        
        if (!wrist || !index_mcp || !pinky_mcp) return 0;
        
        // Calculate yaw based on index and pinky MCP positions
        const handDir = { 
            x: index_mcp.x - pinky_mcp.x,
            y: index_mcp.y - pinky_mcp.y
        };
        
        const yaw = Math.atan2(handDir.y, handDir.x) * 0.5; // Scale factor
        
        return Math.max(-Math.PI/4, Math.min(Math.PI/4, yaw));
    };
    
    // Calculate wrist rotation on Z axis (roll)
    const calculateWristRotationZ = (landmarks) => {
        const index_mcp = landmarks[5]; // Index finger MCP
        const pinky_mcp = landmarks[17]; // Pinky finger MCP
        
        if (!index_mcp || !pinky_mcp) return 0;
        
        // Calculate roll based on height difference between index and pinky MCPs
        const heightDiff = index_mcp.y - pinky_mcp.y;
        const roll = heightDiff / 50; // Scale factor
        
        return Math.max(-Math.PI/6, Math.min(Math.PI/6, roll));
    };
    
    // Calculate arm rotation based on wrist and hand position
    const calculateArmRotation = (landmarks, handedness) => {
        const wrist = landmarks[0];
        const middle_mcp = landmarks[9]; // Middle finger MCP
        
        if (!wrist || !middle_mcp) return handedness === -1 ? -Math.PI/3 : Math.PI/3;
        
        // Calculate a base arm rotation (simplified)
        const xDiff = middle_mcp.x - wrist.x;
        const baseRotation = (handedness * xDiff) / 100; // Scale factor
        
        // Ensure we don't exceed reasonable limits
        const minRotation = handedness === -1 ? -Math.PI/2 : Math.PI/4;
        const maxRotation = handedness === -1 ? -Math.PI/4 : Math.PI/2;
        
        return Math.max(minRotation, Math.min(maxRotation, baseRotation));
    };
    
    // Calculate arm Y rotation
    const calculateArmYRotation = (landmarks) => {
        const wrist = landmarks[0];
        const indexMcp = landmarks[5];
        const pinkyMcp = landmarks[17];
        
        if (!wrist || !indexMcp || !pinkyMcp) return 0;
        
        // Approximation of arm y-rotation based on hand orientation
        const handOrientation = Math.atan2(
            pinkyMcp.y - indexMcp.y,
            pinkyMcp.x - indexMcp.x
        );
        
        return handOrientation * 0.25; // Scale down for subtler movement
    };
    
    // Create neutral position frame
    const createNeutralPositionFrame = () => {
        const neutralFrame = [];
        
        // Left hand reset
        const leftFingers = ['Index', 'Middle', 'Ring', 'Pinky'];
        leftFingers.forEach(finger => {
            neutralFrame.push([`mixamorigLeftHand${finger}1`, "rotation", "z", 0, "+"]);
            neutralFrame.push([`mixamorigLeftHand${finger}2`, "rotation", "z", 0, "+"]);
            neutralFrame.push([`mixamorigLeftHand${finger}3`, "rotation", "z", 0, "+"]);
        });
        
        neutralFrame.push(["mixamorigLeftHandThumb1", "rotation", "y", 0, "+"]);
        neutralFrame.push(["mixamorigLeftHandThumb2", "rotation", "z", 0, "+"]);
        neutralFrame.push(["mixamorigLeftHandThumb3", "rotation", "z", 0, "+"]);
        
        neutralFrame.push(["mixamorigLeftForeArm", "rotation", "z", 0, "+"]);
        neutralFrame.push(["mixamorigLeftArm", "rotation", "z", -Math.PI/3, "+"]);
        neutralFrame.push(["mixamorigLeftArm", "rotation", "y", 0, "-"]);
        neutralFrame.push(["mixamorigLeftHand", "rotation", "x", 0, "-"]);
        neutralFrame.push(["mixamorigLeftHand", "rotation", "y", 0, "-"]);
        
        // Right hand reset
        const rightFingers = ['Index', 'Middle', 'Ring', 'Pinky'];
        rightFingers.forEach(finger => {
            neutralFrame.push([`mixamorigRightHand${finger}1`, "rotation", "z", 0, "-"]);
            neutralFrame.push([`mixamorigRightHand${finger}2`, "rotation", "z", 0, "-"]);
            neutralFrame.push([`mixamorigRightHand${finger}3`, "rotation", "z", 0, "-"]);
        });
        
        neutralFrame.push(["mixamorigRightHandThumb1", "rotation", "y", 0, "-"]);
        neutralFrame.push(["mixamorigRightHandThumb2", "rotation", "z", 0, "-"]);
        neutralFrame.push(["mixamorigRightHandThumb3", "rotation", "z", 0, "-"]);
        
        neutralFrame.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
        neutralFrame.push(["mixamorigRightArm", "rotation", "z", Math.PI/3, "-"]);
        neutralFrame.push(["mixamorigRightArm", "rotation", "y", 0, "-"]);
        neutralFrame.push(["mixamorigRightHand", "rotation", "x", 0, "-"]);
        neutralFrame.push(["mixamorigRightHand", "rotation", "y", 0, "-"]);
        
        return neutralFrame;
    };
    
    // Create placeholder animation data similar to your TIME example
    const createPlaceholderAnimationData = () => {
        const animations = [];
        
        // First frame - hands in position
        let frame1 = [];
        
        // Left hand fingers bent
        const leftFingers = ['Index', 'Middle', 'Ring', 'Pinky'];
        leftFingers.forEach(finger => {
            frame1.push([`mixamorigLeftHand${finger}1`, "rotation", "z", -Math.PI/2, "-"]);
            frame1.push([`mixamorigLeftHand${finger}2`, "rotation", "z", -Math.PI/2, "-"]);
            frame1.push([`mixamorigLeftHand${finger}3`, "rotation", "z", -Math.PI/2, "-"]);
        });
        
        // Left thumb position
        frame1.push(["mixamorigLeftHandThumb1", "rotation", "y", -Math.PI/4, "-"]);
        
        // Left arm and hand position
        frame1.push(["mixamorigLeftForeArm", "rotation", "z", -Math.PI/4, "-"]);
        frame1.push(["mixamorigLeftArm", "rotation", "z", -Math.PI/2.5, "-"]);
        frame1.push(["mixamorigLeftHand", "rotation", "x", Math.PI/6, "+"]);
        
        // Right hand fingers
        const rightFingers = ['Index', 'Middle', 'Ring', 'Pinky'];
        rightFingers.forEach(finger => {
            frame1.push([`mixamorigRightHand${finger}1`, "rotation", "z", Math.PI/2, "+"]);
            frame1.push([`mixamorigRightHand${finger}2`, "rotation", "z", Math.PI/2, "+"]);
            frame1.push([`mixamorigRightHand${finger}3`, "rotation", "z", Math.PI/2, "+"]);
        });
        
        // Right arm and hand position
        frame1.push(["mixamorigRightArm", "rotation", "z", Math.PI/3.5, "+"]);
        frame1.push(["mixamorigRightArm", "rotation", "y", Math.PI/9, "+"]);
        frame1.push(["mixamorigRightForeArm", "rotation", "z", Math.PI/12, "+"]);
        frame1.push(["mixamorigRightHand", "rotation", "x", Math.PI/6, "+"]);
        frame1.push(["mixamorigRightHand", "rotation", "y", Math.PI/6, "+"]);
        
        animations.push(frame1);
        
        // Intermediate movement frame
        let frame2 = [];
        frame2.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
        animations.push(frame2);
        
        // Another intermediate movement frame
        let frame3 = [];
        frame3.push(["mixamorigRightForeArm", "rotation", "z", Math.PI/12, "+"]);
        animations.push(frame3);
        
        // Final frame - returning to neutral position
        animations.push(createNeutralPositionFrame());
        
        return {
            animations: animations,
            frameCount: 4,
            duration: 2
        };
    };
    
    // Function to save new sign to the database
    const saveSignToDatabase = (sign) => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('SignBridgeDB', 1);
            
            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(['signs'], 'readwrite');
                const objectStore = transaction.objectStore('signs');
                
                const addRequest = objectStore.add(sign);
                
                addRequest.onsuccess = () => {
                    resolve('Sign added successfully');
                };
                
                addRequest.onerror = (event) => {
                    reject('Error adding sign: ' + event.target.error);
                };
            };
            
            request.onerror = (event) => {
                reject('Database error: ' + event.target.error);
            };
        });
    };
    
    const handleAddSign = async () => {
        if (!signName.trim()) {
            setUploadStatus("Please enter a name for the sign");
            return;
        }
        
        // Check if we have a video
        const videoElement = videoPreviewRef.current?.querySelector('video');
        if (!videoElement) {
            setUploadStatus("Please select a video file");
            return;
        }
        
        // Check if the model is loaded
        if (!isModelLoaded) {
            setUploadStatus("Please wait for the hand pose detection model to load");
            return;
        }
        
        setUploadStatus("Processing video...");
        setProcessingProgress(0);
        
        try {
            // Get the video URL
            const videoUrl = videoElement.src;
            
            // Wait for video to be fully loaded
            if (videoElement.readyState < 2) {
                await new Promise(resolve => {
                    videoElement.onloadeddata = resolve;
                });
            }
            
            // Process video to extract motion data
            const motionData = await analyzeVideoForHandPose(videoElement);
            
            // Create sign object
            const sign = {
                id: Date.now().toString(),
                name: signName,
                videoUrl: videoUrl,
                motionData: motionData,
                createdAt: new Date().toISOString()
            };
            
            // Save to database
            await saveSignToDatabase(sign);
            
            setUploadStatus("Sign added successfully!");
            setProcessingStatus("Sign will be available for translation.");
            
            // Clear form
            setSignName("");
            fileInputRef.current.value = "";
            if (videoPreviewRef.current) {
                videoPreviewRef.current.innerHTML = "No video selected";
            }
            
            // Refresh dictionary
            loadSignDictionary();
            
        } catch (error) {
            console.error("Error processing sign:", error);
            setUploadStatus("Error: Could not process the sign.");
            setProcessingStatus("Please try again with a different video.");
        }
    };
    
    return (
        <div className="add-sign-container">
            <div className="form-section">
                <h2>Add New Sign</h2>
                <div className="form-group">
                    <label htmlFor="sign-name">Sign Name:</label>
                    <input 
                        type="text" 
                        id="sign-name" 
                        value={signName}
                        onChange={(e) => setSignName(e.target.value)}
                        placeholder="Enter name for this sign" 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="sign-video">Upload Video:</label>
                    <input 
                        type="file" 
                        id="sign-video" 
                        ref={fileInputRef}
                        onChange={handleVideoSelection}
                        accept="video/*" 
                    />
                </div>
                <button 
                    id="add-sign-btn" 
                    onClick={handleAddSign}
                    disabled={!isModelLoaded}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z"/>
                    </svg>
                    Add Sign
                </button>
                <div id="upload-status">{uploadStatus}</div>
                {processingProgress > 0 && processingProgress < 100 && (
                    <div className="progress-bar-container">
                        <div 
                            className="progress-bar" 
                            style={{width: `${processingProgress}%`}}
                        ></div>
                        <div className="progress-text">{processingProgress}%</div>
                    </div>
                )}
            </div>
            <div className="preview-section">
                <h2>Video Preview</h2>
                <div id="video-preview" ref={videoPreviewRef}>No video selected</div>
                <div id="processing-status">{processingStatus}</div>
                {!isModelLoaded && <div className="model-loading">Loading hand pose detection model...</div>}
            </div>
            
            <div className="dictionary-section">
                <h2>Sign Dictionary</h2>
                <div id="sign-dictionary" className="dictionary-container">
                    {dictionary.length === 0 ? (
                        <p>No signs in the dictionary yet. Add your first sign above!</p>
                    ) : (
                        dictionary.map(sign => (
                            <div key={sign.id} className="dictionary-item">
                                <video src={sign.videoUrl} controls></video>
                                <div className="dictionary-item-info">
                                    <h3>{sign.name}</h3>
                                    <p>
                                        Animation frames: {sign.motionData?.animations?.length || 0}
                                        <br />
                                        Added: {new Date(sign.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            
            <style jsx>{`
                .add-sign-container {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    padding: 1rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                
                .form-section, .preview-section, .dictionary-section {
                    background: #f9f9f9;
                    border-radius: 8px;
                    padding: 1.5rem;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .form-group {
                    margin-bottom: 1rem;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                }
                
                .form-group input {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 1rem;
                }
                
                #add-sign-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 0.75rem 1.5rem;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                
                #add-sign-btn:hover {
                    background: #388E3C;
                }
                
                #add-sign-btn:disabled {
                    background: #9E9E9E;
                    cursor: not-allowed;
                }
                
                #upload-status {
                    margin-top: 1rem;
                    font-weight: 600;
                    color: #4CAF50;
                }
                
                #processing-status {
                    margin-top: 1rem;
                    color: #2196F3;
                    font-style: italic;
                }
                
                #video-preview {
                    margin-top: 1rem;
                    background: #000;
                    border-radius: 4px;
                    overflow: hidden;
                    min-height: 200px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                }
                
                #video-preview video {
                    width: 100%;
                    max-height: 350px;
                }
                
                .dictionary-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 1.5rem;
                    margin-top: 1rem;
                }
                
                .dictionary-item {
                    background: white;
                    border-radius: 4px;
                    overflow: hidden;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    transition: transform 0.2s;
                }
                
                .dictionary-item:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                }
                
                .dictionary-item video {
                    width: 100%;
                    height: 180px;
                    object-fit: cover;
                    background: #000;
                }
                
                .dictionary-item-info {
                    padding: 1rem;
                }
                
                .dictionary-item-info h3 {
                    margin: 0 0 0.5rem 0;
                    font-size: 1.1rem;
                    color: #333;
                }
                
                .dictionary-item-info p {
                    margin: 0;
                    font-size: 0.9rem;
                    color: #666;
                }
                
                .model-loading {
                    margin-top: 1rem;
                    padding: 0.75rem;
                    background: #FFF9C4;
                    border-radius: 4px;
                    border-left: 4px solid #FBC02D;
                    color: #F57F17;
                }
                
                .progress-bar-container {
                    margin-top: 1rem;
                    height: 20px;
                    background-color: #e0e0e0;
                    border-radius: 10px;
                    overflow: hidden;
                    position: relative;
                }
                
                .progress-bar {
                    height: 100%;
                    background-color: #4CAF50;
                    transition: width 0.3s ease;
                }
                
                .progress-text {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    line-height: 20px;
                    text-align: center;
                    color: white;
                    font-size: 0.8rem;
                    font-weight: bold;
                    text-shadow: 0 0 2px rgba(0,0,0,0.5);
                }
                
                @media (max-width: 768px) {
                    .dictionary-container {
                        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    }
                }
            `}</style>
        </div>
    );
};

export default AddSign;
