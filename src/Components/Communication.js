import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Import animations from Sign Kit (adjust paths as needed)
// If these files don't exist yet, you'll need to copy them from Sign Kit
import { defaultPose } from '../animations/defaultPose';
import * as alphabets from '../animations/alphabets';
import * as words from '../animations/words';

const Communication = () => {
    const [text, setText] = useState('');
    const [interimResult, setInterimResult] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [avatarLoaded, setAvatarLoaded] = useState(false);
    
    // Avatar selection state
    const [selectedAvatar, setSelectedAvatar] = useState('ybot');
    const [animationSpeed, setAnimationSpeed] = useState(0.1);
    const [pauseTime, setPauseTime] = useState(800);
    
    const avatarContainerRef = useRef(null);
    const textInputRef = useRef(null);
    const recordingStatusRef = useRef(null);
    
    // Animation refs
    const componentRef = useRef({});
    const { current: ref } = componentRef;
    
    // Speech recognition ref
    const recognitionRef = useRef(null);
    
    useEffect(() => {
        // Initialize component ref
        ref.flag = false;
        ref.pending = false;
        ref.animations = [];
        ref.characters = [];
        
        // Initialize Three.js once the container is available
        if (avatarContainerRef.current) {
            initThreeJS();
        }
        
        // Initialize Speech Recognition
        setupSpeechRecognition();
        
        return () => {
            // Cleanup
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            
            if (ref.renderer && avatarContainerRef.current) {
                avatarContainerRef.current.removeChild(ref.renderer.domElement);
            }
        };
    }, []);
    
    // Effect to reload avatar when selection changes
    useEffect(() => {
        if (ref.scene) {
            loadAvatar();
        }
    }, [selectedAvatar]);
    
    const setupSpeechRecognition = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            recognitionRef.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';
            
            recognitionRef.current.onstart = () => {
                setIsRecording(true);
                if (recordingStatusRef.current) {
                    recordingStatusRef.current.textContent = "Recording...";
                    recordingStatusRef.current.className = "recording";
                }
            };
            
            recognitionRef.current.onend = () => {
                setIsRecording(false);
                if (recordingStatusRef.current) {
                    recordingStatusRef.current.textContent = "Not recording";
                    recordingStatusRef.current.className = "";
                }
                setInterimResult('');
            };
            
            recognitionRef.current.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }
                
                if (finalTranscript) {
                    setText(prev => prev + finalTranscript + ' ');
                }
                
                setInterimResult(interimTranscript);
            };
            
            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
            };
        }
    };
    
    const initThreeJS = () => {
        // Create scene
        ref.scene = new THREE.Scene();
        ref.scene.background = new THREE.Color(0xdddddd);
        
        // Add light
        const spotLight = new THREE.SpotLight(0xffffff, 2);
        spotLight.position.set(0, 5, 5);
        ref.scene.add(spotLight);
        
        // Create renderer
        ref.renderer = new THREE.WebGLRenderer({ antialias: true });
        
        // Create camera
        ref.camera = new THREE.PerspectiveCamera(
            30,
            window.innerWidth * 0.57 / (window.innerHeight - 70),
            0.1,
            1000
        );
        
        ref.renderer.setSize(window.innerWidth * 0.57, (window.innerHeight - 70));
        
        if (avatarContainerRef.current) {
            avatarContainerRef.current.innerHTML = "";
            avatarContainerRef.current.appendChild(ref.renderer.domElement);
        }
        
        ref.camera.position.z = 1.6;
        ref.camera.position.y = 1.4;
        
        // Load avatar
        loadAvatar();
    };
    
    const loadAvatar = () => {
        const loader = new GLTFLoader();
        
        // Get avatar URL based on selection
        const avatarUrl = process.env.PUBLIC_URL + `/assets/models/${selectedAvatar}/${selectedAvatar}.glb`;
        
        loader.load(
            avatarUrl,
            (gltf) => {
                // Remove previous avatar if it exists
                if (ref.avatar) {
                    ref.scene.remove(ref.avatar);
                }
                
                gltf.scene.traverse((child) => {
                    if (child.type === 'SkinnedMesh') {
                        child.frustumCulled = false;
                    }
                });
                
                ref.avatar = gltf.scene;
                ref.scene.add(ref.avatar);
                
                // Apply default pose
                defaultPose(ref);
                
                setAvatarLoaded(true);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.error('Error loading GLB model:', error);
            }
        );
    };
    
    // Animation function from Sign Kit
    ref.animate = () => {
        if (ref.animations.length === 0) {
            ref.pending = false;
            return;
        }
        
        requestAnimationFrame(ref.animate);
        
        if (ref.animations[0].length) {
            if (!ref.flag) {
                if (ref.animations[0][0] === 'add-text') {
                    setText(text + ref.animations[0][1]);
                    ref.animations.shift();
                } else {
                    for (let i = 0; i < ref.animations[0].length;) {
                        let [boneName, action, axis, limit, sign] = ref.animations[0][i];
                        
                        if (sign === "+" && ref.avatar.getObjectByName(boneName)[action][axis] < limit) {
                            ref.avatar.getObjectByName(boneName)[action][axis] += animationSpeed;
                            ref.avatar.getObjectByName(boneName)[action][axis] = Math.min(
                                ref.avatar.getObjectByName(boneName)[action][axis],
                                limit
                            );
                            i++;
                        } else if (sign === "-" && ref.avatar.getObjectByName(boneName)[action][axis] > limit) {
                            ref.avatar.getObjectByName(boneName)[action][axis] -= animationSpeed;
                            ref.avatar.getObjectByName(boneName)[action][axis] = Math.max(
                                ref.avatar.getObjectByName(boneName)[action][axis],
                                limit
                            );
                            i++;
                        } else {
                            ref.animations[0].splice(i, 1);
                        }
                    }
                }
            }
        } else {
            ref.flag = true;
            setTimeout(() => {
                ref.flag = false;
            }, pauseTime);
            ref.animations.shift();
        }
        
        ref.renderer.render(ref.scene, ref.camera);
    };
    
    const sign = (text) => {
        const str = text.toUpperCase();
        const strWords = str.split(' ');
        setText('');
        
        for (let word of strWords) {
            if (words[word]) {
                ref.animations.push(['add-text', word + ' ']);
                words[word](ref);
            } else {
                for (const [index, ch] of word.split('').entries()) {
                    if (index === word.length - 1) {
                        ref.animations.push(['add-text', ch + ' ']);
                    } else {
                        ref.animations.push(['add-text', ch]);
                    }
                    
                    if (alphabets[ch]) {
                        alphabets[ch](ref);
                    }
                }
            }
        }
        
        if (ref.animations.length > 0 && !ref.pending) {
            ref.pending = true;
            ref.animate();
        }
    };
    
    const handleRecording = () => {
        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    };
    
    const handleTranslate = () => {
        const textToTranslate = textInputRef.current.value.trim();
        if (textToTranslate) {
            sign(textToTranslate);
        }
    };
    
    return (
        <div className="communication-container">
            <div className="input-section">
                <h2>Input Text or Voice</h2>
                <div className="voice-controls">
                    <button onClick={handleRecording} className={isRecording ? 'recording' : ''}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 8a3 3 0 0 0 3-3V3a3 3 0 0 0-6 0v2a3 3 0 0 0 3 3z" />
                            <path d="M5 6.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
                            <path d="M7.5 10v2a1.5 1.5 0 0 1-3 0v-2a.5.5 0 0 0-1 0v2a2.5 2.5 0 0 0 5 0v-2a.5.5 0 0 0-1 0z" />
                        </svg>
                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                    </button>
                    <span ref={recordingStatusRef} id="recording-status">Not recording</span>
                </div>
                <div id="interim-results">{interimResult}</div>
                <textarea 
                    ref={textInputRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type text here or use voice recognition"
                />
                <button onClick={handleTranslate}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                    </svg>
                    Translate
                </button>
            </div>
            <div className="avatar-section">
                <h2>Sign Language Avatar</h2>
                <div id="avatar-container" ref={avatarContainerRef}></div>
                
                <div className="avatar-controls">
                    <p className="bot-label">Select Avatar</p>
                    <div className="avatar-selection">
                        <img 
                            src={process.env.PUBLIC_URL + "/assets/models/xbot/xbot.png"} 
                            className={`bot-image ${selectedAvatar === 'xbot' ? 'selected' : ''}`} 
                            onClick={() => setSelectedAvatar('xbot')} 
                            alt="Avatar 1: XBOT"
                        />
                        <img 
                            src={process.env.PUBLIC_URL + "/assets/models/ybot/ybot.png"} 
                            className={`bot-image ${selectedAvatar === 'ybot' ? 'selected' : ''}`} 
                            onClick={() => setSelectedAvatar('ybot')} 
                            alt="Avatar 2: YBOT"
                        />
                    </div>
                    
                    <p className="label-style">Animation Speed: {Math.round(animationSpeed * 100) / 100}</p>
                    <input 
                        type="range" 
                        min="0.05" 
                        max="0.5" 
                        step="0.01" 
                        value={animationSpeed}
                        onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                        className="w-100"
                    />
                    
                    <p className="label-style">Pause Time: {pauseTime} ms</p>
                    <input 
                        type="range" 
                        min="0" 
                        max="2000" 
                        step="100" 
                        value={pauseTime}
                        onChange={(e) => setPauseTime(parseInt(e.target.value))}
                        className="w-100"
                    />
                </div>
            </div>
        </div>
    );
};

export default Communication;
