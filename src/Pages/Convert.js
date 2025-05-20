// src/Pages/Convert.js

import '../App.css';
import React, { useState, useEffect, useRef } from "react";
import Slider from 'react-input-slider';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import xbot from '../Models/xbot/xbot.glb';
import ybot from '../Models/ybot/ybot.glb';
import xbotPic from '../Models/xbot/xbot.png';
import ybotPic from '../Models/ybot/ybot.png';

// Import the default export for dynamic access to all signs
import words from '../Animations/words';
import { getAllSignNames } from '../Animations/words';
import * as alphabets from '../Animations/alphabets';
import { defaultPose } from '../Animations/defaultPose';

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function Convert() {
    const [text, setText] = useState("");
    const [bot, setBot] = useState(ybot);
    const [speed, setSpeed] = useState(0.1);
    const [pause, setPause] = useState(800);
    const [availableSigns, setAvailableSigns] = useState([]);
    const [customSigns, setCustomSigns] = useState({});
    const [avatarAdded, setAvatarAdded] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState("");
    const [debugInfo, setDebugInfo] = useState("");
    const [activeTab, setActiveTab] = useState("text"); // Controls which input method is active
    const [searchTerm, setSearchTerm] = useState(""); // For filtering dictionary signs
    
    // Refs
    const componentRef = useRef({});
    const { current: ref } = componentRef;
    const canvasRef = useRef(null);
    const cleanupRunRef = useRef(false);
    
    const textFromAudio = useRef(null);
    const textFromInput = useRef(null);
    const lastProcessedTranscriptLength = useRef(0);

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    // Debug model paths immediately on component mount
    useEffect(() => {
        // FIX: Check model file types and paths
        console.log("Model file paths:", {
            xbot: typeof xbot === 'string' ? xbot : 'Not a string path',
            ybot: typeof ybot === 'string' ? ybot : 'Not a string path'
        });
        
        console.log("Model paths:", {
            xbot: xbot,
            ybot: ybot
        });
        
        // Check if browser supports speech recognition
        if (!browserSupportsSpeechRecognition) {
            console.warn("Browser doesn't support speech recognition.");
        }
    }, [browserSupportsSpeechRecognition]);

    // Load available signs on component mount and when IndexedDB changes
    useEffect(() => {
        setLoadingStatus("Loading signs...");
        
        // Get available signs from words.js
        const availableSignsArray = getAllSignNames();
        
        // Create combined list of available signs
        const allSigns = [...availableSignsArray].sort();
        
        // Set available signs
        setAvailableSigns(allSigns);
        setLoadingStatus("");
        
        // Function to handle sign updates
        const handleSignsLoaded = () => {
            setLoadingStatus("Refreshing signs...");
            const updatedSignsArray = getAllSignNames();
            setAvailableSigns([...updatedSignsArray].sort());
            setLoadingStatus("");
            console.log("Signs updated in Convert.js");
        };
        
        // Listen for sign changes
        window.addEventListener('signs-loaded', handleSignsLoaded);
        window.addEventListener('storage-changed', handleSignsLoaded);
        
        return () => {
            window.removeEventListener('signs-loaded', handleSignsLoaded);
            window.removeEventListener('storage-changed', handleSignsLoaded);
        };
    }, []);

    // Function to load custom signs from IndexedDB - keep for backward compatibility
    const loadCustomSignsFromDB = () => {
        return new Promise((resolve, reject) => {
            const signs = {};
            
            try {
                const request = indexedDB.open('SignBridgeDB', 1);
                
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains('signs')) {
                        db.createObjectStore('signs', { keyPath: 'id' });
                    }
                };
                
                request.onsuccess = (event) => {
                    try {
                        const db = event.target.result;
                        const transaction = db.transaction(['signs'], 'readonly');
                        const objectStore = transaction.objectStore('signs');
                        const getAllRequest = objectStore.getAll();
                        
                        getAllRequest.onsuccess = () => {
                            try {
                                const results = getAllRequest.result;
                                console.log("Raw sign data from IndexedDB:", results);
                                
                                // Process each sign into a function
                                if (Array.isArray(results)) {
                                    results.forEach(sign => {
                                        if (!sign || !sign.name) {
                                            console.warn("Found invalid sign entry without name:", sign);
                                            return; // Skip this invalid entry
                                        }
                                        
                                        // Convert sign name to uppercase
                                        const signName = sign.name.toUpperCase();
                                        
                                        // Check if motion data exists and is properly formatted
                                        if (sign.motionData && sign.motionData.animations && 
                                            Array.isArray(sign.motionData.animations) && 
                                            sign.motionData.animations.length > 0) {
                                            
                                            // Create a function that will apply the animations
                                            signs[signName] = (ref) => {
                                                if (!ref) {
                                                    console.error("Invalid ref passed to custom sign:", signName);
                                                    return;
                                                }
                                                
                                                console.log(`Playing custom sign: ${signName}`);
                                                
                                                // Add each animation frame to the ref.animations array
                                                sign.motionData.animations.forEach(frame => {
                                                    // Make sure the frame is properly formatted before adding it
                                                    if (Array.isArray(frame)) {
                                                        if (!Array.isArray(ref.animations)) {
                                                            ref.animations = [];
                                                        }
                                                        ref.animations.push(frame);
                                                    } else {
                                                        console.error(`Invalid frame format for sign ${signName}:`, frame);
                                                    }
                                                });
                                                
                                                // Start animation if it's not already running
                                                if (!ref.pending) {
                                                    ref.pending = true;
                                                    if (typeof ref.animate === 'function') {
                                                        ref.animate();
                                                    }
                                                }
                                            };
                                        } else {
                                            console.warn(`Sign ${signName} has invalid or missing motion data`);
                                        }
                                    });
                                } else {
                                    console.warn("IndexedDB returned non-array result:", results);
                                }
                                
                                resolve(signs);
                            } catch (error) {
                                console.error("Error processing sign data:", error);
                                resolve({});
                            }
                        };
                        
                        getAllRequest.onerror = (event) => {
                            console.error("Error loading signs from IndexedDB:", event.target.error);
                            reject("Error loading custom signs: " + event.target.error);
                        };
                    } catch (error) {
                        console.error("Error in database transaction:", error);
                        resolve({});
                    }
                };
                
                request.onerror = (event) => {
                    console.error("IndexedDB error:", event.target.error);
                    reject("Database error: " + event.target.error);
                };
            } catch (error) {
                console.error("Error accessing IndexedDB:", error);
                resolve({});
            }
        });
    };

    // FIX: Add a force render function
    const forceRender = () => {
        if (ref.renderer && ref.scene && ref.camera) {
            console.log("Forcing render call");
            ref.renderer.render(ref.scene, ref.camera);
            return true;
        }
        console.warn("Can't force render - missing renderer, scene, or camera");
        return false;
    };
    
    // FIX: Add debug cube function
    const addDebugCube = () => {
        if (!ref.scene) {
            console.error("No scene available to add debug cube");
            setDebugInfo(prev => prev + "\nNo scene available for debug cube");
            return;
        }
        
        // Create a simple colored cube
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 1, 0); // Position it at eye level
        
        ref.scene.add(cube);
        console.log("Debug cube added to scene");
        setDebugInfo(prev => prev + "\nDebug cube added to scene");
        
        // If we have a renderer and camera, render the scene
        forceRender();
    };

    // Initialize Three.js setup with a new approach that isolates it from React's DOM management
    useEffect(() => {
        // Skip if we don't have the canvas ref yet
        if (!canvasRef || !canvasRef.current) {
            console.log("Canvas ref not available yet, skipping Three.js initialization");
            return;
        }
        
        // Reset state and prevent multiple cleanups
        cleanupRunRef.current = false;
        
        // If there's a previous instance, clean it up first
        if (typeof ref.cleanup === 'function') {
            console.log("Cleaning up previous Three.js instance before creating new one");
            ref.cleanup();
        }
        
        // Reset avatar added flag
        setAvatarAdded(false);
        setLoadingStatus("Loading 3D avatar...");
        
        // FIX: Log full model path
        console.log("Full model path:", bot);
        setDebugInfo("Initializing with model: " + bot);
        
        console.log("Starting avatar initialization with model:", bot);
        
        // Check if model file exists
        fetch(bot)
            .then(response => {
                if (!response.ok) {
                    console.error(`Model file fetch failed: ${response.status} ${response.statusText}`);
                    setLoadingStatus(`Model file not found: ${response.status}`);
                    setDebugInfo(prev => prev + `\nModel fetch error: ${response.status} ${response.statusText}`);
                } else {
                    console.log("Model file exists and is accessible");
                    setDebugInfo(prev => prev + "\nModel file accessible");
                    initializeThreeJS();
                }
            })
            .catch(error => {
                console.error("Error checking model file:", error);
                setLoadingStatus(`Cannot access model file: ${error.message}`);
                setDebugInfo(prev => prev + `\nModel access error: ${error.message}`);
                // Try to initialize anyway, in case it's a CORS issue with fetch but not with loader
                initializeThreeJS();
            });
        
        function initializeThreeJS() {
            try {
                // Get the canvas element from the ref
                const canvas = canvasRef.current;
                if (!canvas) {
                    console.error("Canvas element not found");
                    setLoadingStatus("Error: Canvas element not found");
                    return;
                }
                
                // Create new scene
                const scene = new THREE.Scene();
                scene.background = new THREE.Color(0xf7f7f7); // Lighter background
                ref.scene = scene;
        
                // FIX: Enhanced lighting setup
                // Main directional light (like sun)
                const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
                directionalLight.position.set(1, 2, 3);
                scene.add(directionalLight);

                // Fill light from the opposite side
                const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
                fillLight.position.set(-1, 1, 0);
                scene.add(fillLight);

                // Ambient light for overall illumination
                const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
                scene.add(ambientLight);
                
                // Create camera - MODIFIED FOR UPPER BODY FOCUS
                const camera = new THREE.PerspectiveCamera(
                    25, // Reduced FOV for more zoom (was 30)
                    canvas.clientWidth / canvas.clientHeight,
                    0.1,
                    1000
                );

                // Change camera position to focus on upper body
                camera.position.z = 2.0;  // Closer to avatar (was 3)
                camera.position.y = 1.2;  // Higher to aim at upper body (was 1)
                // Make camera look at upper body area
                camera.lookAt(new THREE.Vector3(0, 1.5, 0));


                
                ref.camera = camera;
                
                // Create renderer using the existing canvas element
                const renderer = new THREE.WebGLRenderer({ 
                    canvas: canvas,  // Use the canvas managed by React
                    antialias: true 
                });
                
                // FIX: Explicit sizing with fallback dimensions
                const containerWidth = Math.max(canvas.clientWidth, 500); // Fallback minimum width
                const containerHeight = Math.max(canvas.clientHeight, 400); // Fallback minimum height
                renderer.setSize(containerWidth, containerHeight);
                camera.aspect = containerWidth / containerHeight;
                camera.updateProjectionMatrix();
                
                renderer.shadowMap.enabled = true;
                ref.renderer = renderer;
                
                console.log("THREE.js renderer initialized with dimensions:", {
                    width: containerWidth,
                    height: containerHeight,
                    clientWidth: canvas.clientWidth,
                    clientHeight: canvas.clientHeight
                });
                setDebugInfo(prev => prev + `\nCanvas size: ${containerWidth}x${containerHeight}`);
        
                // Simple rendering loop to see if the scene is working
                function testRender() {
                    if (renderer && scene && camera) {
                        renderer.render(scene, camera);
                        console.log("Test render completed");
                    }
                }
                testRender();
        
                // Define animation function
                ref.animate = () => {
                    console.log("Animate function called");
                    if (!ref.animationFrameId) {
                        animateFrame();
                    }
                };
        
                // Initialize animation state
                ref.flag = false;
                ref.pending = false;
                ref.animations = [];
                ref.characters = [];
        
                // Load avatar model with explicit error handling
                console.log("Loading avatar model from:", bot);
                const loader = new GLTFLoader();
                
                loader.load(
                    bot, // URL to the model
                    (gltf) => {
                        console.log("Avatar model loaded successfully!");
                        setDebugInfo(prev => prev + "\nModel loaded successfully");
                        
                        // Process model
                        gltf.scene.traverse((child) => {
                            if (child.type === 'SkinnedMesh') {
                                child.frustumCulled = false;
                                child.castShadow = true;
                                child.receiveShadow = true;
                            }
                        });
                        
                        // Add avatar to scene
                        ref.avatar = gltf.scene;
                        scene.add(gltf.scene);
                        
                        // FIX: Center and position the avatar
                        gltf.scene.position.set(0, 0, 0); // Center at origin
                        gltf.scene.scale.set(1, 1, 1); // Ensure proper scale
                        console.log("Avatar positioned and scaled");
                        
                        // Debug - list all bones
                        let boneList = [];
                        gltf.scene.traverse((child) => {
                            if (child.isBone) {
                                boneList.push(child.name);
                            }
                        });
                        console.log("Model bones:", boneList);
                        setDebugInfo(prev => prev + `\nBones count: ${boneList.length}`);
                        
                        // Set default pose
                        if (typeof defaultPose === 'function') {
                            try {
                                defaultPose(ref);
                                console.log("Default pose applied");
                                setDebugInfo(prev => prev + "\nDefault pose applied");
                            } catch (error) {
                                console.error("Error applying default pose:", error);
                                setDebugInfo(prev => prev + `\nPose error: ${error.message}`);
                            }
                        } else {
                            console.error("defaultPose function not found");
                            setDebugInfo(prev => prev + "\ndefaultPose function not found");
                        }
                        
                        // Test render the scene
                        renderer.render(scene, camera);
                        
                        // Start animation loop
                        animateFrame();
                        
                        // Set flag to prevent duplicate avatar
                        setAvatarAdded(true);
                        setLoadingStatus("");
                        
                        // FIX: Force a render call
                        forceRender();
                        
                        // Auto-start animation with default text
                        setTimeout(() => {
                            if (textFromInput && textFromInput.current) {
                                textFromInput.current.value = "";
                                processText(textFromInput.current.value);
                            }
                        }, 500);
                    },
                    (xhr) => {
                        if (xhr.lengthComputable) {
                            const loadingPercentage = Math.floor((xhr.loaded / xhr.total) * 100);
                            console.log(`Avatar loading progress: ${loadingPercentage}%`);
                            setLoadingStatus(`Loading avatar: ${loadingPercentage}%`);
                        } else {
                            setLoadingStatus(`Loading avatar...`);
                        }
                    },
                    (error) => {
                        console.error("Error loading avatar model:", error);
                        setLoadingStatus(`Avatar loading failed: ${error.message}`);
                        setDebugInfo(prev => prev + `\nModel loading error: ${error.message}`);
                        
                        // Try loading the alternate model as fallback
                        const fallbackModel = bot === xbot ? ybot : xbot;
                        console.log("Trying fallback model:", fallbackModel);
                        setDebugInfo(prev => prev + `\nTrying fallback model: ${fallbackModel}`);
                        
                        loader.load(
                            fallbackModel,
                            (gltf) => {
                                console.log("Fallback model loaded successfully!");
                                setDebugInfo(prev => prev + "\nFallback model loaded");
                                
                                // Process model (same as above)
                                gltf.scene.traverse((child) => {
                                    if (child.type === 'SkinnedMesh') {
                                        child.frustumCulled = false;
                                        child.castShadow = true;
                                        child.receiveShadow = true;
                                    }
                                });
                                
                                ref.avatar = gltf.scene;
                                scene.add(gltf.scene);
                                
                                // FIX: Center and position the avatar - MODIFIED FOR UPPER BODY FOCUS
                                gltf.scene.position.set(0, -0.7, 0); // Move down to focus on upper body (was 0, 0, 0)
                                gltf.scene.scale.set(1, 1, 1); // Keep original scale
                                
                                try {
                                    defaultPose(ref);
                                    setDebugInfo(prev => prev + "\nDefault pose applied to fallback");
                                } catch (error) {
                                    console.error("Error applying default pose to fallback model:", error);
                                    setDebugInfo(prev => prev + `\nFallback pose error: ${error.message}`);
                                }
                                
                                renderer.render(scene, camera);
                                animateFrame();
                                forceRender(); // FIX: Force render
                                
                                setAvatarAdded(true);
                                setLoadingStatus("Using fallback avatar model");
                                
                                setTimeout(() => {
                                    if (textFromInput && textFromInput.current) {
                                        textFromInput.current.value = "HELLO";
                                        processText(textFromInput.current.value);
                                    }
                                }, 500);
                            },
                            null,
                            (secondError) => {
                                console.error("Fallback model also failed:", secondError);
                                setLoadingStatus("Could not load any avatar model");
                                setDebugInfo(prev => prev + `\nFallback model also failed: ${secondError.message}`);
                                // FIX: Add debug cube as last resort
                                addDebugCube();
                            }
                        );
                    }
                );
                
                // Handle window resize
                const handleResize = () => {
                    if (camera && renderer && canvasRef.current) {
                        const width = Math.max(canvasRef.current.clientWidth, 500);
                        const height = Math.max(canvasRef.current.clientHeight, 400);
                        camera.aspect = width / height;
                        camera.updateProjectionMatrix();
                        renderer.setSize(width, height);
                        renderer.render(scene, camera);
                    }
                };
                
                window.addEventListener('resize', handleResize);
                
                // Store cleanup function in ref for later use - FIXED APPROACH
                ref.cleanup = () => {
                    // Prevent multiple cleanups
                    if (cleanupRunRef.current) {
                        console.log("Cleanup already ran, skipping");
                        return;
                    }
                    
                    console.log("Running THREE.js cleanup...");
                    cleanupRunRef.current = true;
                    
                    window.removeEventListener('resize', handleResize);
                    
                    // Cancel animation frame
                    if (ref.animationFrameId) {
                        console.log("Canceling animation frame");
                        cancelAnimationFrame(ref.animationFrameId);
                        ref.animationFrameId = null;
                    }
                    
                    // Just dispose of WebGL resources without touching the DOM
                    if (ref.renderer) {
                        console.log("Disposing renderer");
                        // Only dispose of the renderer's context, not the canvas element
                        ref.renderer.dispose();
                        // IMPORTANT: Do not try to remove the canvas from the DOM!
                    }
                    
                    // Clear references
                    ref.scene = null;
                    ref.camera = null;
                    ref.renderer = null;
                    ref.avatar = null;
                    ref.animations = [];
                    ref.characters = [];
                };
            } catch (error) {
                console.error("Error initializing Three.js:", error);
                setLoadingStatus("Failed to initialize 3D environment");
                setDebugInfo(prev => prev + `\nTHREE.js init error: ${error.message}`);
            }
        }
        
        // Return cleanup function
        return () => {
            if (typeof ref.cleanup === 'function' && !cleanupRunRef.current) {
                ref.cleanup();
            }
        };
    }, [bot]);

    // Animation function with frame ID tracking and error handling - FIXED
    const animateFrame = () => {
        try {
            // Check if required components exist
            if (!ref.renderer || !ref.scene || !ref.camera) {
                console.warn("Missing THREE.js core components, can't animate");
                return;
            }
            
            // Schedule next frame
            ref.animationFrameId = requestAnimationFrame(animateFrame);
            
            // If avatar not ready, just render the scene
            if (!ref.avatar || !avatarAdded) {
                ref.renderer.render(ref.scene, ref.camera);
                return;
            }
            
            // If no animations left, update pending flag and render
            if (!ref.animations || !Array.isArray(ref.animations) || ref.animations.length === 0) {
                ref.pending = false;
                ref.renderer.render(ref.scene, ref.camera);
                return;
            }
            
            // Process current animation frame - FIX: Validate animation array structure
            if (Array.isArray(ref.animations[0]) && ref.animations[0].length > 0) {
                // Only process if not in pause state
                if (!ref.flag) {
                    // Handle text animation - FIX: Proper validation of add-text command
                    if (Array.isArray(ref.animations[0]) && ref.animations[0][0] === 'add-text' && ref.animations[0].length >= 2) {
                        // Get the text content safely
                        const textContent = ref.animations[0][1] || '';
                        // Replace text content instead of appending
                        setText(textContent);
                        ref.animations.shift();
                    } else {
                        // Process bone animations
                        for (let i = 0; i < ref.animations[0].length;) {
                            try {
                                const animCommand = ref.animations[0][i];
                                
                                // Validate animation command format
                                if (!Array.isArray(animCommand) || animCommand.length < 5) {
                                    console.error("Invalid animation command format:", animCommand);
                                    ref.animations[0].splice(i, 1);
                                    continue;
                                }
                                
                                const [boneName, action, axis, limit, sign] = animCommand;
                                
                                // Skip if any part is missing
                                if (!boneName || !action || !axis || typeof limit !== 'number' || !sign) {
                                    console.error("Missing animation command parameter:", animCommand);
                                    ref.animations[0].splice(i, 1);
                                    continue;
                                }
                                
                                // Find bone in the avatar
                                const bone = ref.avatar.getObjectByName(boneName);
                                if (!bone) {
                                    ref.animations[0].splice(i, 1);
                                    continue;
                                }
                                
                                // Make sure the bone has the required action and axis
                                if (!bone[action] || typeof bone[action][axis] !== 'number') {
                                    console.error(`Bone ${boneName} doesn't have ${action}.${axis}`);
                                    ref.animations[0].splice(i, 1);
                                    continue;
                                }
                                
                                // Apply animation based on sign
                                if (sign === "+" && bone[action][axis] < limit) {
                                    bone[action][axis] += speed;
                                    bone[action][axis] = Math.min(bone[action][axis], limit);
                                    i++;
                                } else if (sign === "-" && bone[action][axis] > limit) {
                                    bone[action][axis] -= speed;
                                    bone[action][axis] = Math.max(bone[action][axis], limit);
                                    i++;
                                } else {
                                    // Animation completed or invalid, remove it
                                    ref.animations[0].splice(i, 1);
                                }
                            } catch (error) {
                                console.error("Error during animation:", error);
                                // Remove problematic animation
                                if (i < ref.animations[0].length) {
                                    ref.animations[0].splice(i, 1);
                                } else {
                                    break;
                                }
                            }
                        }
                    }
                }
            } else if (ref.animations.length > 0) {
                // Current frame is completed or invalid, move to next
                ref.flag = true;
                setTimeout(() => {
                    ref.flag = false;
                }, pause);
                ref.animations.shift();
            }
            if (ref.animations.length === 0 && !ref.pending) {
                setText('');
            }
            
            // Render the scene
            ref.renderer.render(ref.scene, ref.camera);
        } catch (error) {
            console.error("Animation frame error:", error);
            // Try to recover by clearing animations
            if (ref.animations) {
                ref.animations = [];
            }
            ref.pending = false;
            
            // Try to render one more time
            if (ref.renderer && ref.scene && ref.camera) {
                ref.renderer.render(ref.scene, ref.camera);
            }
        }
    };

    // Process text and animate signs
    const processText = (inputText) => {
        if (!inputText || !ref.avatar || !avatarAdded) {
            console.warn("Avatar not ready or no input text, can't process text");
            return;
        }
        
        try {
            // Clean the input text by removing periods
            var str = inputText.replace(/\./g, '').toUpperCase();
            var strWords = str.split(' ').filter(word => word.trim() !== '');
            setText('');
            setDebugInfo(""); // Clear debug info
                    
            console.log("Processing text:", str);
            
            // FIX: Ensure animations array is initialized
            if (!Array.isArray(ref.animations)) {
                ref.animations = [];
            }

            for (let word of strWords) {
                // Add the word to the output text - FIX: Use explicit array
                ref.animations.push(['add-text', word + ' ']);
                
                // Check if it's a custom sign
                if (customSigns[word]) {
                    try {
                        console.log(`Attempting to play custom sign: ${word}`);
                        customSigns[word](ref);
                        console.log(`Added custom sign animations for: ${word}`);
                        continue; // Skip to next word if custom sign was used
                    } catch (error) {
                        console.error(`Error animating custom sign "${word}":`, error);
                        setDebugInfo(prev => prev + `\nError with custom sign ${word}: ${error.message}`);
                        // If error, fall through to built-in sign check
                    }
                }
                
                // Check if it's a built-in sign
                if (typeof words[word] === 'function') {
                    try {
                        console.log(`Playing built-in sign: ${word}`);
                        words[word](ref);
                    } catch (error) {
                        console.error(`Error animating word "${word}":`, error);
                        setDebugInfo(prev => prev + `\nError with built-in sign ${word}: ${error.message}`);
                        // Fall back to letter-by-letter on error
                        animateLetterByLetter(word);
                    }
                } else { 
                    // If not a known word, animate letter by letter
                    console.log(`No sign found for "${word}", spelling letter-by-letter`);
                    animateLetterByLetter(word);
                }
            }

            // Start animation if not already running
            if (Array.isArray(ref.animations[0]) && ref.animations[0][0] === 'add-text' && ref.animations[0].length >= 2) {
                // Get the text content safely
                const textContent = ref.animations[0][1] || '';
                // Replace text content instead of appending
                setText(textContent);
                ref.animations.shift();
            }
            
            // If animations were added and animation isn't running, start it
            if (ref.animations.length > 0 && !ref.pending) {
                ref.pending = true;
                if (typeof ref.animate === 'function') {
                    ref.animate();
                }
            }
        } catch (error) {
            console.error("Error processing text:", error);
            setDebugInfo(`Error processing text: ${error.message}`);
        }
    };
    
    // Helper function to animate a word letter by letter - FIXED
    const animateLetterByLetter = (word) => {
        if (!word) {
            console.warn("Trying to animate undefined or empty word");
            return;
        }
        
        // FIX: Ensure animations array is initialized
        if (!Array.isArray(ref.animations)) {
            ref.animations = [];
        }
        
        for (const [index, ch] of word.split('').entries()) {
            if (index === word.length - 1) {
                ref.animations.push(['add-text', ch + ' ']);
            } else {
                ref.animations.push(['add-text', ch]);
            }
            
            if (alphabets[ch]) {
                try {
                    alphabets[ch](ref);
                } catch (error) {
                    console.error(`Error animating letter "${ch}":`, error);
                }
            } else {
                console.warn(`No animation for letter: ${ch}`);
            }
        }
    };

    // Auto-process transcript when it changes
    useEffect(() => {
        if (transcript && avatarAdded && listening) {
            // Clean the transcript by removing periods
            const cleanTranscript = transcript.replace(/\./g, '');
            
            // Only process new words that weren't processed before
            if (cleanTranscript.length > lastProcessedTranscriptLength.current) {
                // Get only the new part of the transcript
                const newPart = cleanTranscript.substring(lastProcessedTranscriptLength.current);
                
                if (newPart.trim()) {
                    // Process only the new part
                    processText(newPart);
                    
                    // Update the last processed length
                    lastProcessedTranscriptLength.current = cleanTranscript.length;
                }
            }
        }
    }, [transcript, avatarAdded, listening]);

    // Speech recognition handlers
    const startListening = () => {
        if (browserSupportsSpeechRecognition) {
            // Reset processed transcript counter
            lastProcessedTranscriptLength.current = 0;
            // Reset any previous transcript
            resetTranscript();
            // Start continuous listening
            SpeechRecognition.startListening({ continuous: true });
        } else {
            setDebugInfo("Your browser does not support speech recognition.");
        }
    };

    const stopListening = () => {
        if (browserSupportsSpeechRecognition) {
            SpeechRecognition.stopListening();
            // Final processing of transcript when stopping
            if (transcript) {
                const cleanTranscript = transcript.replace(/\./g, '');
                if (cleanTranscript.trim()) {
                    processText(cleanTranscript);
                }
            }
        }
    };
    
    // Filter signs for the dictionary view
    const filteredSigns = availableSigns.filter(sign => 
        !searchTerm || sign.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="convert-page">
            {/* Page header with gradient background */}
            <div className="page-header bg-gradient-primary text-white py-3 mb-4">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8 mx-auto text-center">
                            <h1 className="display-5 fw-bold mb-3">Text to Sign Conversion</h1>
                            <div className="divider divider-light my-3 mx-auto"></div>
                            <p className="lead mb-0">
                                Transform text or speech into fluid sign language animations
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mb-5">
                <div className="row">
                    {/* Left panel - Avatar display */}
                    <div className="col-lg-8 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-0">
                                {/* FIX: Add border and background to canvas container */}
                                <div className="canvas-container position-relative" 
                                    style={{ 
                                        height: "500px",
                                        border: "1px solid #ccc",  // Add border to see the container
                                        backgroundColor: "#eaeaea" // Background color to distinguish from page
                                    }}>
                                    <canvas 
                                        ref={canvasRef}
                                        className="w-100 h-100"
                                        style={{ 
                                            display: loadingStatus ? "none" : "block" 
                                        }}
                                    />
                                    
                                    {loadingStatus && (
                                        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                                            <div className="text-center">
                                                <div className="spinner-border text-primary mb-3" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                <p className="fw-bold mb-0">{loadingStatus}</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* FIX: Add debug controls */}
                                    <div className="position-absolute bottom-0 start-0 p-2">
                                        <div className="btn-group btn-group-sm">
                                            <button 
                                                className="btn btn-secondary"
                                                onClick={forceRender}
                                                title="Force render the scene"
                                            >
                                                <i className="fa fa-refresh me-1"></i>
                                                Force Render
                                            </button>
                                            <button 
                                                className="btn btn-warning"
                                                onClick={addDebugCube}
                                                title="Add a debug cube to test rendering"
                                            >
                                                <i className="fa fa-cube me-1"></i>
                                                Debug Cube
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer bg-light p-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    
                                    <div className="avatar-selector">
                                        <h6 className="mb-2 text-center">Select Avatar</h6>
                                        <div className="d-flex gap-3">
                                            <div 
                                                className={`avatar-choice ${bot === xbot ? 'active' : ''}`} 
                                                onClick={() => setBot(xbot)}
                                            >
                                                <img 
                                                    src={xbotPic} 
                                                    alt="XBOT" 
                                                    className="img-fluid rounded"
                                                    width="50"
                                                />
                                            </div>
                                            <div 
                                                className={`avatar-choice ${bot === ybot ? 'active' : ''}`} 
                                                onClick={() => setBot(ybot)}
                                            >
                                                <img 
                                                    src={ybotPic} 
                                                    alt="YBOT" 
                                                    className="img-fluid rounded"
                                                    width="50"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right panel - Input methods and controls */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header bg-white p-0">
                                <ul className="nav nav-tabs nav-fill">
                                    <li className="nav-item">
                                        <button 
                                            className={`nav-link py-3 ${activeTab === 'text' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('text')}
                                        >
                                            <i className="fa fa-keyboard-o me-2"></i>
                                            Text Input
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button 
                                            className={`nav-link py-3 ${activeTab === 'speech' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('speech')}
                                        >
                                            <i className="fa fa-microphone me-2"></i>
                                            Speech Input
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button 
                                            className={`nav-link py-3 ${activeTab === 'dictionary' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('dictionary')}
                                        >
                                            <i className="fa fa-book me-2"></i>
                                            Sign Dictionary
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <div className="card-body p-4">
                                {/* Text input tab content */}
                                <div className={activeTab === 'text' ? 'd-block' : 'd-none'}>
                                    <div className="form-floating mb-3">
                                        <textarea
                                            ref={textFromInput}
                                            className="form-control"
                                            placeholder="Type text to sign here..."
                                            defaultValue=""
                                            style={{ height: "150px" }}
                                            id="textInput"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    processText(textFromInput.current.value);
                                                }
                                            }}
                                        ></textarea>
                                        <label htmlFor="textInput">Type text to sign here...</label>
                                    </div>
                                    <div className="d-grid">
                                        <button 
                                            className="btn btn-primary py-3"
                                            onClick={() => processText(textFromInput.current.value)}
                                            disabled={!avatarAdded}
                                        >
                                            <i className="fa fa-play-circle me-2"></i>
                                            Animate Text
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Speech input tab content */}
                                <div className={activeTab === 'speech' ? 'd-block' : 'd-none'}>
                                    <div className="text-center mb-4">
                                        <div className={`speech-status-indicator mb-3 ${listening ? 'active' : ''}`}>
                                        <i className={`fa fa-microphone fa-3x ${listening ? 'text-danger pulse' : 'text-muted'}`}></i>
                                            <p className="mt-2 mb-0 fw-bold">
                                                {listening ? 'Listening... Speak now' : 'Ready to listen'}
                                            </p>
                                        </div>
                                        
                                        <div className="btn-group">
                                            <button 
                                                className="btn btn-primary px-4 py-2"
                                                onClick={startListening}
                                                disabled={listening || !browserSupportsSpeechRecognition}
                                            >
                                                <i className="fa fa-play me-2"></i>
                                                Start
                                            </button>
                                            <button 
                                                className="btn btn-danger px-4 py-2"
                                                onClick={stopListening}
                                                disabled={!listening}
                                            >
                                                <i className="fa fa-stop me-2"></i>
                                                Stop
                                            </button>
                                            <button 
                                                className="btn btn-secondary px-4 py-2"
                                                onClick={resetTranscript}
                                            >
                                                <i className="fa fa-refresh me-2"></i>
                                                Clear
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="form-floating">
                                        <textarea
                                            ref={textFromAudio}
                                            className="form-control"
                                            placeholder="Speech will be transcribed here..."
                                            value={transcript}
                                            style={{ height: "120px" }}
                                            id="speechInput"
                                            readOnly
                                        ></textarea>
                                        <label htmlFor="speechInput">Speech transcription</label>
                                    </div>
                                    
                                    {!browserSupportsSpeechRecognition && (
                                        <div className="alert alert-warning mt-3">
                                            <i className="fa fa-exclamation-triangle me-2"></i>
                                            Your browser does not support speech recognition.
                                        </div>
                                    )}
                                </div>
                                
                                {/* Dictionary tab content */}
                                <div className={activeTab === 'dictionary' ? 'd-block' : 'd-none'}>
                                    <div className="mb-3">
                                        <input 
                                            type="text" 
                                            className="form-control form-control-lg" 
                                            placeholder="Search available signs..." 
                                            aria-label="Search signs"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    
                                    <div className="dictionary-container p-3 bg-light rounded" style={{ maxHeight: "250px", overflow: "auto" }}>
                                        {availableSigns.length === 0 ? (
                                            <div className="text-center py-4">
                                                <div className="spinner-border text-primary me-2" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                <span>Loading signs...</span>
                                            </div>
                                        ) : filteredSigns.length === 0 ? (
                                            <div className="text-center py-4">
                                                <i className="fa fa-search fa-2x text-muted mb-2"></i>
                                                <p className="mb-0">No signs match your search</p>
                                            </div>
                                        ) : (
                                            <div className="row g-2">
                                                {filteredSigns.map((sign, index) => (
                                                    <div className="col-lg-4 col-md-4 col-6" key={index}>
                                                        <div 
                                                            className={`sign-item p-2 rounded text-center ${customSigns[sign] ? 'custom-sign' : ''}`}
                                                            onClick={() => {
                                                                processText(sign);
                                                                if (textFromInput.current) {
                                                                    textFromInput.current.value = sign;
                                                                }
                                                            }}
                                                        >
                                                            {sign}
                                                            {customSigns[sign] && (
                                                                <span className="custom-badge">Custom</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Animation controls */}
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white">
                                <h5 className="card-title mb-0">
                                    <i className="fa fa-sliders me-2 text-primary"></i>
                                    Animation Controls
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="mb-4">
                                    <label className="form-label d-flex justify-content-between">
                                        <span>Animation Speed</span>
                                        <span className="text-primary fw-bold">{Math.round(speed * 100) / 100}</span>
                                    </label>
                                    <Slider 
                                        axis="x" 
                                        xmin={0.05} 
                                        xmax={0.50} 
                                        xstep={0.01} 
                                        x={speed} 
                                        onChange={({ x }) => setSpeed(x)} 
                                        styles={{
                                            track: { backgroundColor: '#e9ecef', height: '10px', borderRadius: '5px' },
                                            active: { backgroundColor: '#3a7bd5', height: '10px', borderRadius: '5px' },
                                            thumb: { width: 20, height: 20, backgroundColor: '#fff', border: '2px solid #3a7bd5', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }
                                        }}
                                    />
                                    <div className="d-flex justify-content-between text-muted mt-1">
                                        <small>Slower</small>
                                        <small>Faster</small>
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <label className="form-label d-flex justify-content-between">
                                        <span>Pause Between Signs</span>
                                        <span className="text-primary fw-bold">{pause} ms</span>
                                    </label>
                                    <Slider 
                                        axis="x" 
                                        xmin={0} 
                                        xmax={2000} 
                                        xstep={100} 
                                        x={pause} 
                                        onChange={({ x }) => setPause(x)} 
                                        styles={{
                                            track: { backgroundColor: '#e9ecef', height: '10px', borderRadius: '5px' },
                                            active: { backgroundColor: '#3a7bd5', height: '10px', borderRadius: '5px' },
                                            thumb: { width: 20, height: 20, backgroundColor: '#fff', border: '2px solid #3a7bd5', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }
                                        }}
                                    />
                                    <div className="d-flex justify-content-between text-muted mt-1">
                                        <small>No Pause</small>
                                        <small>Long Pause</small>
                                    </div>
                                </div>
                                
                                <div className="steps">
                                    <div className="step d-flex mb-2">
                                        <div className="step-number me-2">
                                            <span className="badge rounded-pill bg-primary">1</span>
                                        </div>
                                        <div>
                                            <small className="fw-bold">Enter text or speak</small>
                                        </div>
                                    </div>
                                    <div className="step d-flex mb-2">
                                        <div className="step-number me-2">
                                            <span className="badge rounded-pill bg-primary">2</span>
                                        </div>
                                        <div>
                                            <small className="fw-bold">Adjust animation settings</small>
                                        </div>
                                    </div>
                                    <div className="step d-flex">
                                        <div className="step-number me-2">
                                            <span className="badge rounded-pill bg-primary">3</span>
                                        </div>
                                        <div>
                                            <small className="fw-bold">Watch the 3D avatar sign</small>
                                        </div>
                                    </div>
                                </div>
                                
                                {debugInfo && (
                                    <div className="mt-3">
                                        <div className="alert alert-info small">
                                            <strong><i className="fa fa-info-circle me-1"></i> Debug Info:</strong>
                                            <pre className="mt-2 mb-0" style={{ whiteSpace: 'pre-wrap' }}>{debugInfo}</pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Additional CSS for this page */}
            <style jsx="true">{`
                .convert-page {
                    background-color: #f8f9fa;
                    min-height: 100vh;
                }
                
                .bg-gradient-primary {
                    background: linear-gradient(120deg, #3a7bd5, #00d2ff);
                }
                
                .divider {
                    height: 3px;
                    width: 80px;
                    background-color: #fff;
                    margin: 30px auto;
                }
                
                .divider-light {
                    background-color: white;
                }
                
                .speech-status-indicator {
                    padding: 20px;
                    border-radius: 8px;
                    background-color: rgba(0,0,0,0.02);
                }
                
                .speech-status-indicator.active {
                    background-color: rgba(220, 53, 69, 0.1);
                }
                
                .pulse {
                    animation: pulse 1.5s infinite;
                }
                
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
                
                .avatar-choice {
                    cursor: pointer;
                    border-radius: 6px;
                    padding: 2px;
                    transition: all 0.2s;
                }
                
                .avatar-choice:hover {
                    transform: translateY(-2px);
                }
                
                .avatar-choice.active {
                    border: 2px solid #3a7bd5;
                }
                
                .sign-item {
                    cursor: pointer;
                    background: #f8f9fa;
                    transition: all 0.2s;
                    position: relative;
                    overflow: hidden;
                }
                
                .sign-item:hover {
                    background: #e9ecef;
                    transform: translateY(-2px);
                    box-shadow: 0 3px 6px rgba(0,0,0,0.1);
                }
                
                .custom-sign {
                    background: #e3f2fd;
                    color: #1976d2;
                }
                
                .custom-badge {
                    position: absolute;
                    top: 0;
                    right: 0;
                    font-size: 8px;
                    background: #1976d2;
                    color: white;
                    padding: 2px 4px;
                    border-radius: 0 0 0 4px;
                }
                
                .nav-tabs .nav-link {
                    border: none;
                    color: #6c757d;
                    font-weight: 500;
                }
                
                .nav-tabs .nav-link.active {
                    color: #3a7bd5;
                    border-bottom: 2px solid #3a7bd5;
                }
                
                .output-display {
                    min-height: 40px;
                    max-height: 100px;
                    overflow-y: auto;
                }
                
                @media (max-width: 768px) {
                    .canvas-container {
                        height: 350px !important;
                    }
                    
                    .btn-group {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                    }
                    
                    .btn-group .btn {
                        border-radius: 4px !important;
                    }
                }
            `}</style>
        </div>
    );
}

export default Convert;