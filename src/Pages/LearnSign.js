// src/Pages/LearnSign.js
import '../App.css';
import React, { useState, useEffect, useRef } from "react";
import Slider from 'react-input-slider';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import xbot from '../Models/xbot/xbot.glb';
import ybot from '../Models/ybot/ybot.glb';
import xbotPic from '../Models/xbot/xbot.png';
import ybotPic from '../Models/ybot/ybot.png';

import words, { wordList, getAllSignNames, loadSignsFromLocalStorage, customSignsLoadStatus } from '../Animations/words';
import * as alphabets from '../Animations/alphabets';
import { defaultPose } from '../Animations/defaultPose';

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function LearnSign() {
    const [bot, setBot] = useState(ybot);
    const [speed, setSpeed] = useState(0.1);
    const [pause, setPause] = useState(800);
    const [availableSigns, setAvailableSigns] = useState([]);
    const [avatarAdded, setAvatarAdded] = useState(false);
    const [activeAlphabet, setActiveAlphabet] = useState(null);
    const [loadingStatus, setLoadingStatus] = useState("");
    const [debugInfo, setDebugInfo] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const componentRef = useRef({});
    const { current: ref } = componentRef;

    // Load signs
    useEffect(() => {
        setLoadingStatus("Loading signs...");

        const loadSigns = async () => {
            try {
                await loadSignsFromLocalStorage();
                const allSigns = getAllSignNames();
                
                setAvailableSigns(allSigns);
                setLoadingStatus("");
                setDebugInfo(prev => prev + `\nLoaded ${allSigns.length} signs (${customSignsLoadStatus})`);
            } catch (error) {
                console.error("Sign loading error:", error);
                setLoadingStatus("Failed to load signs");
                setDebugInfo(prev => prev + `\nSign loading error: ${error.message}`);
                setAvailableSigns(wordList);
            }
        };

        loadSigns();

        const handleSignsUpdate = () => {
            console.log("Signs update triggered");
            setLoadingStatus("Refreshing signs...");
            loadSigns().then(() => {
                setLoadingStatus("");
                setDebugInfo(prev => prev + "\nSigns refreshed");
            });
        };

        let lastStorageHash = localStorage.getItem('signsHash') || '';
        const pollStorage = setInterval(() => {
            const currentHash = localStorage.getItem('signsHash') || '';
            if (currentHash !== lastStorageHash) {
                lastStorageHash = currentHash;
                handleSignsUpdate();
            }
        }, 1000);

        window.addEventListener('signs-loaded', handleSignsUpdate);
        window.addEventListener('storage', handleSignsUpdate);

        return () => {
            clearInterval(pollStorage);
            window.removeEventListener('signs-loaded', handleSignsUpdate);
            window.removeEventListener('storage', handleSignsUpdate);
        };
    }, []);

    // Initialize Three.js
    useEffect(() => {
        setAvatarAdded(false);
        setLoadingStatus("Loading 3D avatar...");
        
        ref.flag = false;
        ref.pending = false;
        ref.animations = [];
        ref.characters = [];
        
        if (ref.scene) {
            while(ref.scene.children.length > 0) { 
                ref.scene.remove(ref.scene.children[0]); 
            }
            if (ref.renderer && document.getElementById("canvas")) {
                try {
                    document.getElementById("canvas").removeChild(ref.renderer.domElement);
                } catch (error) {
                    console.log("Element may have already been removed");
                }
            }
        }
        
        ref.scene = new THREE.Scene();
        ref.scene.background = new THREE.Color(0xf7f7f7);
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        ref.scene.add(ambientLight);

        const spotLight = new THREE.SpotLight(0xffffff, 1.5);
        spotLight.position.set(0, 5, 5);
        spotLight.castShadow = true;
        ref.scene.add(spotLight);

        ref.camera = new THREE.PerspectiveCamera(
            30,
            window.innerWidth * 0.6 / (window.innerHeight - 60),
            0.1,
            1000
        );

        ref.renderer = new THREE.WebGLRenderer({ antialias: true });
        ref.renderer.setSize(window.innerWidth * 0.6, (window.innerHeight - 60));
        ref.renderer.shadowMap.enabled = true;
        
        if (document.getElementById("canvas")) {
            document.getElementById("canvas").innerHTML = "";
            document.getElementById("canvas").appendChild(ref.renderer.domElement);
        }

        ref.camera.position.z = 2.0;
        ref.camera.position.y = 1.3;

        ref.animate = () => {
            if (!ref.animationFrameId) {
                animate();
            }
        };

        let loader = new GLTFLoader();
        loader.load(
            bot,
            (gltf) => {
                gltf.scene.traverse((child) => {
                    if (child.type === 'SkinnedMesh') {
                        child.frustumCulled = false;
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                
                setAvatarAdded(true);
                setLoadingStatus("");
                
                ref.avatar = gltf.scene;
                ref.scene.add(ref.avatar);
                defaultPose(ref);
                
                animate();
            },
            (xhr) => {
                const percentage = Math.floor((xhr.loaded / xhr.total) * 100);
                console.log(`${percentage}% loaded`);
                setLoadingStatus(`Loading avatar: ${percentage}%`);
            },
            (error) => {
                console.error("Error loading model:", error);
                setLoadingStatus(`Avatar loading failed: ${error.message}`);
                setDebugInfo(prev => prev + `\nModel loading error: ${error.message}`);
            }
        );
        
        const handleResize = () => {
            if (ref.camera && ref.renderer) {
                ref.camera.aspect = window.innerWidth * 0.6 / (window.innerHeight - 60);
                ref.camera.updateProjectionMatrix();
                ref.renderer.setSize(window.innerWidth * 0.6, (window.innerHeight - 60));
            }
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            
            if (ref.animationFrameId) {
                cancelAnimationFrame(ref.animationFrameId);
            }
            
            if (ref.renderer && document.getElementById("canvas")) {
                try {
                    document.getElementById("canvas").removeChild(ref.renderer.domElement);
                } catch (error) {
                    console.log("Element may have already been removed");
                }
            }
        };
    }, [ref, bot]);

    const animate = () => {
        ref.animationFrameId = requestAnimationFrame(animate);
        
        if (!ref.avatar || !avatarAdded) {
            ref.renderer.render(ref.scene, ref.camera);
            return;
        }
        
        if (ref.animations.length === 0) {
            ref.pending = false;
            ref.renderer.render(ref.scene, ref.camera);
            return;
        }
        
        if (ref.animations[0] && ref.animations[0].length) {
            if (!ref.flag) {
                for (let i = 0; i < ref.animations[0].length;) {
                    let [boneName, action, axis, limit, sign] = ref.animations[0][i];
                    
                    if (!ref.avatar || !ref.avatar.getObjectByName(boneName)) {
                        ref.animations[0].splice(i, 1);
                        continue;
                    }
                    
                    if (sign === "+" && ref.avatar.getObjectByName(boneName)[action][axis] < limit) {
                        ref.avatar.getObjectByName(boneName)[action][axis] += speed;
                        ref.avatar.getObjectByName(boneName)[action][axis] = Math.min(
                            ref.avatar.getObjectByName(boneName)[action][axis],
                            limit
                        );
                        i++;
                    } else if (sign === "-" && ref.avatar.getObjectByName(boneName)[action][axis] > limit) {
                        ref.avatar.getObjectByName(boneName)[action][axis] -= speed;
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
        } else if (ref.animations.length > 0) {
            ref.flag = true;
            setTimeout(() => {
                ref.flag = false;
            }, pause);
            ref.animations.shift();
        }
        
        ref.renderer.render(ref.scene, ref.camera);
    };

    const playSignAnimation = (signName) => {
        if (!ref.avatar || !avatarAdded) {
            console.warn("Avatar not ready, cannot play sign:", signName);
            setDebugInfo(prev => prev + `\nAvatar not ready for sign: ${signName}`);
            return;
        }
        
        if (ref.animations.length === 0) {
            try {
                if (typeof words[signName] === 'function') {
                    words[signName](ref);
                    console.log(`Playing sign: ${signName}`);
                    setDebugInfo(prev => prev + `\nPlaying sign: ${signName}`);
                } else {
                    console.error(`Animation for '${signName}' is not a function`);
                    setDebugInfo(prev => prev + `\nNo animation function for: ${signName}`);
                }
            } catch (error) {
                console.error(`Error playing animation for ${signName}:`, error);
                setDebugInfo(prev => prev + `\nError playing sign ${signName}: ${error.message}`);
            }
        }
    };

    const playLetterAnimation = (letter) => {
        if (ref.animations.length === 0 && alphabets[letter]) {
            setActiveAlphabet(letter);
            alphabets[letter](ref);
            
            setTimeout(() => {
                setActiveAlphabet(null);
            }, 1500);
        }
    };

    const filteredSigns = availableSigns.filter(sign => 
        !searchTerm || sign.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedSigns = filteredSigns.reduce((acc, sign) => {
        const firstLetter = sign.charAt(0).toUpperCase();
        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }
        acc[firstLetter].push(sign);
        return acc;
    }, {});

    const builtInSigns = wordList;

    return (
        <div className="learn-sign-page">
            <div className="page-header bg-gradient-primary text-white py-3 mb-4">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8 mx-auto text-center">
                            <h1 className="display-5 fw-bold mb-3">Learn Sign Language</h1>
                            <div className="divider divider-light my-3 mx-auto"></div>
                            <p className="lead mb-0">
                                Master sign language through interactive 3D demonstrations
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="learn-sign-layout">
                    <div className="side-panel card border-0 shadow-sm p-3 mb-4">
                        <div className="alphabet-section mb-4">
                            <h5 className="card-title mb-3">
                                <i className="fa fa-sort-alpha-asc me-2 text-primary"></i>
                                Alphabets
                            </h5>
                            <div className="alphabet-grid">
                                {Array.from(Array(26)).map((_, i) => {
                                    const letter = String.fromCharCode(i + 65);
                                    return (
                                        <button 
                                            key={i}
                                            className={`alphabet-btn ${activeAlphabet === letter ? 'active' : ''}`}
                                            onClick={() => playLetterAnimation(letter)}
                                        >
                                            {letter}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        
                        <div className="words-section">
                            <h5 className="card-title mb-3">
                                <i className="fa fa-book me-2 text-primary"></i>
                                Words
                            </h5>
                            <div className="input-group mb-3">
                                <input 
                                    type="text"
                                    className="form-control"
                                    placeholder="Search for signs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button className="btn btn-outline-primary" type="button">
                                    <i className="fa fa-search"></i>
                                </button>
                            </div>
                            <div className="words-container" style={{maxHeight: "500px", overflowY: "auto"}}>
                                {loadingStatus && (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-primary me-2" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <span>{loadingStatus}</span>
                                    </div>
                                )}
                                {!loadingStatus && Object.keys(groupedSigns).length === 0 ? (
                                    <div className="text-center py-4">
                                        <i className="fa fa-search fa-2x text-muted mb-2"></i>
                                        <p className="mb-0">No signs match your search</p>
                                    </div>
                                ) : (
                                    Object.keys(groupedSigns).sort().map(letter => (
                                        <div key={letter} className="word-group mb-3">
                                            <h6 className="word-group-letter">{letter}</h6>
                                            <div className="row g-2">
                                                {groupedSigns[letter].map((sign, index) => {
                                                    const isCustomSign = !builtInSigns.includes(sign);
                                                    return (
                                                        <div className="col-md-4 col-6" key={index}>
                                                            <button 
                                                                className={`word-btn w-100 ${isCustomSign ? 'custom-word' : ''}`}
                                                                onClick={() => playSignAnimation(sign)}
                                                            >
                                                                {sign}
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="main-panel">
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-body p-0">
                                <div id="canvas" className="canvas-display" style={{ height: "500px" }}></div>
                                
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
                                
                                {activeAlphabet && (
                                    <div className="position-absolute top-0 end-0 m-3 bg-white rounded-pill px-3 py-2 shadow-sm">
                                        <span className="fw-bold">Now signing: </span>
                                        <span className="text-primary">{activeAlphabet}</span>
                                    </div>
                                )}
                            </div>
                            <div className="card-footer bg-light p-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="controls-section d-flex align-items-center">
                                        <h6 className="mb-0 me-3">Animation Controls:</h6>
                                        <div className="d-flex align-items-center me-4">
                                            <small className="me-2">Speed</small>
                                            <Slider 
                                                axis="x" 
                                                xmin={0.05} 
                                                xmax={0.50} 
                                                xstep={0.01} 
                                                x={speed} 
                                                onChange={({ x }) => setSpeed(x)} 
                                                styles={{
                                                    track: { backgroundColor: '#e9ecef', width: '100px' },
                                                    active: { backgroundColor: '#3a7bd5' },
                                                    thumb: { width: 14, height: 14 }
                                                }}
                                            />
                                            <small className="ms-2 text-primary">{speed.toFixed(2)}</small>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <small className="me-2">Pause</small>
                                            <Slider 
                                                axis="x" 
                                                xmin={0} 
                                                xmax={2000} 
                                                xstep={100} 
                                                x={pause} 
                                                onChange={({ x }) => setPause(x)} 
                                                styles={{
                                                    track: { backgroundColor: '#e9ecef', width: '100px' },
                                                    active: { backgroundColor: '#3a7bd5' },
                                                    thumb: { width: 14, height: 14 }
                                                }}
                                            />
                                            <small className="ms-2 text-primary">{pause}ms</small>
                                        </div>
                                    </div>
                                    <div className="avatar-section">
                                        <div className="avatar-options d-flex gap-2">
                                            <div 
                                                className={`avatar-choice ${bot === xbot ? 'active' : ''}`} 
                                                onClick={() => setBot(xbot)}
                                                title="XBOT"
                                            >
                                                <img 
                                                    src={xbotPic} 
                                                    alt="XBOT" 
                                                    className="img-fluid rounded"
                                                    width="40"
                                                />
                                            </div>
                                            <div 
                                                className={`avatar-choice ${bot === ybot ? 'active' : ''}`} 
                                                onClick={() => setBot(ybot)}
                                                title="YBOT"
                                            >
                                                <img 
                                                    src={ybotPic} 
                                                    alt="YBOT" 
                                                    className="img-fluid rounded"
                                                    width="40"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {debugInfo && (
                            <div className="card border-0 shadow-sm">
                                <div className="card-body">
                                    <div className="alert alert-info small">
                                        <strong><i className="fa fa-info-circle me-1"></i> Debug Info:</strong>
                                        <pre className="mt-2 mb-0" style={{ whiteSpace: 'pre-wrap' }}>{debugInfo}</pre>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <style jsx="true">{`
                .learn-sign-page {
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
                }
                
                .divider-light {
                    background-color: white;
                }
                
                .learn-sign-layout {
                    display: grid;
                    grid-template-columns: 350px 1fr;
                    gap: 20px;
                    position: relative;
                }
                
                .alphabet-grid {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: 8px;
                    margin-bottom: 10px;
                }
                
                .alphabet-btn {
                    background-color: #f8f9fa;
                    border: 1px solid #dee2e6;
                    border-radius: 4px;
                    padding: 8px 0;
                    font-weight: 500;
                    transition: all 0.2s;
                }
                
                .alphabet-btn:hover {
                    background-color: #e9ecef;
                    transform: translateY(-2px);
                }
                
                .alphabet-btn.active {
                    background-color: #3a7bd5;
                    color: white;
                    border-color: #3a7bd5;
                }
                
                .word-btn {
                    background-color: #f8f9fa;
                    border: 1px solid #dee2e6;
                    border-radius: 4px;
                    padding: 6px;
                    font-size: 0.85rem;
                    transition: all 0.2s;
                }
                
                .word-btn:hover {
                    background-color: #e9ecef;
                    transform: translateY(-2px);
                    box-shadow: 0 3px 6px rgba(0,0,0,0.1);
                }
                
                .word-btn.custom-word {
                    background-color: #e3f2fd;
                    color: #1976d2;
                    border-color: #bbdefb;
                }
                
                .word-group-letter {
                    color: #3a7bd5;
                    font-weight: 600;
                    border-bottom: 2px solid #e9ecef;
                    padding-bottom: 4px;
                    margin-bottom: 8px;
                }
                
                .canvas-display {
                    width: 100%;
                    height: 100%;
                    position: relative;
                }
                
                .avatar-choice {
                    cursor: pointer;
                    border-radius: 6px;
                    padding: 2px;
                    transition: all 0.2s;
                    border: 2px solid transparent;
                }
                
                .avatar-choice:hover {
                    transform: translateY(-2px);
                }
                
                .avatar-choice.active {
                    border: 2px solid #3a7bd5;
                }
                
                @media (max-width: 992px) {
                    .learn-sign-layout {
                        grid-template-columns: 1fr;
                    }
                    
                    .side-panel {
                        order: 2;
                    }
                    
                    .main-panel {
                        order: 1;
                    }
                }
                
                @media (max-width: 768px) {
                    .alphabet-grid {
                        grid-template-columns: repeat(4, 1fr);
                    }
                }
            `}</style>
        </div>
    );
}

export default LearnSign;