import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

class AvatarService {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.avatar = null;
        this.mixer = null;
        this.clock = new THREE.Clock();
        this.animationActions = {};
        this.currentAction = null;
    }
    
    init(container) {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            35, 
            container.clientWidth / container.clientHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(0, 1.6, 3);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(this.renderer.domElement);
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 10, 10);
        this.scene.add(directionalLight);
        
        // Add a front light
        const frontLight = new THREE.DirectionalLight(0xffffff, 0.6);
        frontLight.position.set(0, 0, 5);
        this.scene.add(frontLight);
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (container && this.renderer && this.camera) {
                this.camera.aspect = container.clientWidth / container.clientHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(container.clientWidth, container.clientHeight);
            }
        });
        
        // Start animation loop
        this.animate();
    }
    
    loadAvatar(avatarUrl) {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            
            loader.load(
                avatarUrl,
                (gltf) => {
                    this.avatar = gltf.scene;
                    this.scene.add(this.avatar);
                    
                    // Adjust avatar position
                    this.avatar.position.y = -1.0;
                    
                    // Create animation mixer
                    this.mixer = new THREE.AnimationMixer(this.avatar);
                    
                    // Store animations that came with the model
                    if (gltf.animations && gltf.animations.length > 0) {
                        gltf.animations.forEach(animation => {
                            const action = this.mixer.clipAction(animation);
                            this.animationActions[animation.name.toLowerCase()] = action;
                        });
                    }
                    
                    // Create default animations
                    this.createDefaultAnimations();
                    
                    // Play idle animation by default
                    this.playAnimation('idle');
                    
                    resolve(this.avatar);
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                (error) => {
                    console.error('Error loading GLB model:', error);
                    reject(error);
                }
            );
        });
    }
    
    animate = () => {
        requestAnimationFrame(this.animate);
        
        if (this.mixer) {
            this.mixer.update(this.clock.getDelta());
        }
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    };
    
    createDefaultAnimations() {
        // Create idle animation
        const idleClip = this.createIdleAnimation();
        this.animationActions['idle'] = this.mixer.clipAction(idleClip);
        
        // Create wave animation
        const waveClip = this.createWaveAnimation();
        this.animationActions['wave'] = this.mixer.clipAction(waveClip);
        
        // Create nod animation
        const nodClip = this.createNodAnimation();
        this.animationActions['nod'] = this.mixer.clipAction(nodClip);
    }
    
    createIdleAnimation() {
        const frames = 30;
        const times = [];
        const values = [];
        
        // Create a slight breathing animation
        for (let i = 0; i <= frames; i++) {
            times.push(i / frames);
            
            // Slight up and down movement for breathing effect
            const y = 0.003 * Math.sin(i / frames * Math.PI * 2);
            values.push(1, 1 + y, 1);
        }
        
        const track = new THREE.KeyframeTrack('.scale', times, values);
        return new THREE.AnimationClip('idle', frames / 30, [track]);
    }
    
    createWaveAnimation() {
        // Find the right arm bones
        let rightArmBone = null;
        let rightForeArmBone = null;
        let rightHandBone = null;
        
        if (this.avatar) {
            this.avatar.traverse((object) => {
                if (object.isBone) {
                    const name = object.name.toLowerCase();
                    if (name.includes('rightarm') || name.includes('right_arm') || name.includes('arm_r')) {
                        rightArmBone = object;
                    }
                    if (name.includes('rightforearm') || name.includes('right_forearm') || name.includes('forearm_r')) {
                        rightForeArmBone = object;
                    }
                    if (name.includes('righthand') || name.includes('right_hand') || name.includes('hand_r')) {
                        rightHandBone = object;
                    }
                }
            });
        }
        
        // If bones not found, create a simple animation
        if (!rightArmBone) {
            const frames = 60;
            const times = [];
            const posValues = [];
            
            for (let i = 0; i <= frames; i++) {
                times.push(i / frames);
                
                // Simple waving motion for whole avatar
                const x = 0.02 * Math.sin(i / frames * Math.PI * 4);
                posValues.push(x, 0, 0);
            }
            
            const posTrack = new THREE.KeyframeTrack('.position', times, posValues);
            return new THREE.AnimationClip('wave', 2, [posTrack]);
        }
        
        // Create arm wave animation with the found bones
        const frames = 60;
        const times = [];
        for (let i = 0; i <= frames; i++) {
            times.push(i / frames);
        }
        
        const tracks = [];
        
        // Right upper arm animation
        if (rightArmBone) {
            const upperArmValues = [];
            for (let i = 0; i <= frames; i++) {
                const t = i / frames;
                // Wave motion for upper arm
                const x = 0.1 + 0.3 * Math.sin(t * Math.PI * 2); // Pitch
                const y = 0.8 + 0.1 * Math.sin(t * Math.PI * 4); // Yaw
                const z = 0.3 * Math.sin(t * Math.PI * 2); // Roll
                
                upperArmValues.push(x, y, z);
            }
            
            tracks.push(new THREE.KeyframeTrack(
                `${rightArmBone.name}.rotation`,
                times,
                upperArmValues
            ));
        }
        
        // Right forearm animation
        if (rightForeArmBone) {
            const forearmValues = [];
            for (let i = 0; i <= frames; i++) {
                const t = i / frames;
                // Elbow bend for forearm
                const x = 0.3 + 0.1 * Math.sin(t * Math.PI * 4);
                const y = 0.1 * Math.sin(t * Math.PI * 2);
                const z = 0.1 * Math.sin(t * Math.PI * 3);
                
                forearmValues.push(x, y, z);
            }
            
            tracks.push(new THREE.KeyframeTrack(
                `${rightForeArmBone.name}.rotation`,
                times,
                forearmValues
            ));
        }
        
        // Hand animation
        if (rightHandBone) {
            const handValues = [];
            for (let i = 0; i <= frames; i++) {
                const t = i / frames;
                // Wrist flection for hand
                const x = 0.2 * Math.sin(t * Math.PI * 6);
                const y = 0.1 * Math.sin(t * Math.PI * 3);
                const z = 0.15 * Math.sin(t * Math.PI * 4);
                
                handValues.push(x, y, z);
            }
            
            tracks.push(new THREE.KeyframeTrack(
                `${rightHandBone.name}.rotation`,
                times,
                handValues
            ));
        }
        
        return new THREE.AnimationClip('wave', 3, tracks);
    }
    
    createNodAnimation() {
        // Find the head bone
        let headBone = null;
        let neckBone = null;
        
        if (this.avatar) {
            this.avatar.traverse((object) => {
                if (object.isBone) {
                    const name = object.name.toLowerCase();
                    if (name.includes('head')) {
                        headBone = object;
                    }
                    if (name.includes('neck')) {
                        neckBone = object;
                    }
                }
            });
        }
        
        // If bones not found, create a simple animation
        if (!headBone && !neckBone) {
            const frames = 45;
            const times = [];
            const rotValues = [];
            
            for (let i = 0; i <= frames; i++) {
                times.push(i / frames);
                
                // Simple head nodding motion
                const rotX = Math.sin(i / frames * Math.PI * 4) * 0.1;
                rotValues.push(rotX, 0, 0);
            }
            
            const rotTrack = new THREE.KeyframeTrack('.rotation', times, rotValues);
            return new THREE.AnimationClip('nod', 1.5, [rotTrack]);
        }
        
        // Create nodding animation with the found bones
        const frames = 45;
        const times = [];
        for (let i = 0; i <= frames; i++) {
            times.push(i / frames);
        }
        
        const tracks = [];
        
        // Head animation
        if (headBone) {
            const headValues = [];
            for (let i = 0; i <= frames; i++) {
                const t = i / frames;
                // Nodding motion for head
                const x = 0.3 * Math.sin(t * Math.PI * 4); // Pitch (nodding)
                const y = 0.05 * Math.sin(t * Math.PI * 2); // Yaw (small side to side)
                const z = 0.02 * Math.sin(t * Math.PI * 3); // Roll (slight tilt)<span class="cursor">█</span>
                headValues.push(x, y, z);
            }
            
            tracks.push(new THREE.KeyframeTrack(
                `${headBone.name}.rotation`,
                times,
                headValues
            ));
        }
        
        // Neck animation
        if (neckBone) {
            const neckValues = [];
            for (let i = 0; i <= frames; i++) {
                const t = i / frames;
                // Complementary neck motion
                const x = 0.15 * Math.sin(t * Math.PI * 4); // Pitch
                const y = 0.03 * Math.sin(t * Math.PI * 2); // Yaw
                const z = 0.01 * Math.sin(t * Math.PI * 3); // Roll
                
                neckValues.push(x, y, z);
            }
            
            tracks.push(new THREE.KeyframeTrack(
                `${neckBone.name}.rotation`,
                times,
                neckValues
            ));
        }
        
        return new THREE.AnimationClip('nod', 1.5, tracks);
    }
    
    playAnimation(name) {
        // Stop current animation if playing
        if (this.currentAction) {
            this.currentAction.fadeOut(0.5);
        }
        
        // Look for exact match first
        let action = this.animationActions[name.toLowerCase()];
        
        // If no exact match, try alternatives
        if (!action) {
            // Look for partial matches
            const nameWords = name.toLowerCase().split(/\s+/);
            for (const word of nameWords) {
                if (this.animationActions[word]) {
                    action = this.animationActions[word];
                    break;
                }
            }
            
            // Fall back to standard animations for common phrases
            if (!action) {
                if (name.toLowerCase().includes('hello') || name.toLowerCase().includes('hi')) {
                    action = this.animationActions['wave'] || this.animationActions['hello'];
                } else if (name.toLowerCase().includes('thank') || name.toLowerCase().includes('thanks')) {
                    action = this.animationActions['nod'] || this.animationActions['thank you'];
                } else {
                    // Default to idle
                    action = this.animationActions['idle'];
                }
            }
        }
        
        // Play the selected animation
        if (action) {
            this.currentAction = action;
            this.currentAction.reset().fadeIn(0.5).play();
        }
    }
    
    // Create sign animation from motion data
    createSignAnimation(signName, motionData) {
        if (!this.avatar || !this.mixer) return null;
        
        // Find important bones
        const bones = {};
        this.avatar.traverse((object) => {
            if (object.isBone) {
                const name = object.name.toLowerCase();
                // Store key bones
                if (name.includes('head')) bones.head = object;
                if (name.includes('neck')) bones.neck = object;
                
                // Right arm
                if (name.includes('rightarm') || name.includes('right_arm') || name.includes('arm_r')) {
                    bones.rightUpperArm = object;
                }
                if (name.includes('rightforearm') || name.includes('right_forearm') || name.includes('forearm_r')) {
                    bones.rightForeArm = object;
                }
                if (name.includes('righthand') || name.includes('right_hand') || name.includes('hand_r')) {
                    bones.rightHand = object;
                }
                
                // Left arm
                if (name.includes('leftarm') || name.includes('left_arm') || name.includes('arm_l')) {
                    bones.leftUpperArm = object;
                }
                if (name.includes('leftforearm') || name.includes('left_forearm') || name.includes('forearm_l')) {
                    bones.leftForeArm = object;
                }
                if (name.includes('lefthand') || name.includes('left_hand') || name.includes('hand_l')) {
                    bones.leftHand = object;
                }
            }
        });
        
        // Create animation tracks
        const tracks = [];
        
        // Prepare timeline
        const frames = motionData.keyframes ? motionData.keyframes.length : 60;
        const duration = motionData.duration || 3;
        const times = Array.from({length: frames}, (_, i) => i * duration / frames);
        
        // If we have motion data, use it
        if (motionData.keyframes && motionData.keyframes.length > 0) {
            // Add animation tracks for each bone with motion data
            if (bones.rightUpperArm && motionData.keyframes.some(k => k.rightArm)) {
                const values = [];
                
                for (let i = 0; i < frames; i++) {
                    const keyframe = motionData.keyframes[Math.min(i, motionData.keyframes.length - 1)];
                    
                    if (keyframe.rightArm && keyframe.rightArm.shoulder) {
                        values.push(
                            keyframe.rightArm.shoulder.x,
                            keyframe.rightArm.shoulder.y,
                            keyframe.rightArm.shoulder.z
                        );
                    } else {
                        // Fallback
                        const t = i / frames;
                        values.push(
                            0.5 * Math.sin(t * Math.PI * 2),
                            0.3 * Math.cos(t * Math.PI * 3),
                            0.2 * Math.sin(t * Math.PI * 4)
                        );
                    }
                }
                
                tracks.push(new THREE.KeyframeTrack(
                    `${bones.rightUpperArm.name}.rotation`,
                    times,
                    values
                ));
            }
            
            // Add other bone tracks similarly
            // This is a simplified version - you would add similar code for other bones
        }
        
        // If no tracks were created or no motion data, create a procedural animation
        if (tracks.length === 0) {
            // Use the sign name to seed a pseudo-random animation
            const seed = signName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const random = () => {
                const x = Math.sin(seed++) * 10000;
                return x - Math.floor(x);
            };
            
            // Add procedural animations for important bones
            if (bones.rightUpperArm) {
                const values = [];
                
                for (let i = 0; i < frames; i++) {
                    const t = i / frames;
                    const amplitude = 0.3 + random() * 0.4;
                    const frequency = 2 + Math.floor(random() * 3);
                    
                    values.push(
                        amplitude * Math.sin(t * Math.PI * frequency),
                        0.5 + 0.3 * Math.cos(t * Math.PI * frequency),
                        0.2 * Math.sin(t * Math.PI * (frequency + 1))
                    );
                }
                
                tracks.push(new THREE.KeyframeTrack(
                    `${bones.rightUpperArm.name}.rotation`,
                    times,
                    values
                ));
            }
            
            // Add other procedural animations for other bones
        }
        
        // Create the animation clip if we have tracks
        if (tracks.length > 0) {
            const clip = new THREE.AnimationClip(signName.toLowerCase(), duration, tracks);
            this.animationActions[signName.toLowerCase()] = this.mixer.clipAction(clip);
            return this.animationActions[signName.toLowerCase()];
        }
        
        return null;
    }
    
    // Translate text to sign language animations
    translateText(text) {
        // Split text into words
        const words = text.toLowerCase().split(/[\s,.?!]+/).filter(word => word.length > 0);
        
        if (words.length === 0) return;
        
        // Play animation for the first word (or the whole phrase)
        this.playAnimation(text.toLowerCase());
        
        // In a real implementation, you would:
        // 1. Check if any words match sign animations
        // 2. Queue animations for multiple words
        // 3. Handle special phrases
        // 4. Spell words using letter signs if no matching sign exists
    }
    
    // Clean up resources
    dispose() {
        window.removeEventListener('resize', this.handleResize);
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        // Stop animations
        if (this.mixer) {
            this.mixer.stopAllAction();
        }
        
        // Clear scene
        if (this.scene) {
            this.scene.clear();
        }
    }
}

export default AvatarService;
