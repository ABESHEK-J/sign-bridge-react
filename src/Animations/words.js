/* src/Animations/words/index.js */

// Dynamically import all built-in signs from src/Animations/Words/words
const builtInSigns = {};
const requireContext = require.context('./Words/words', false, /\.js$/);
requireContext.keys().forEach(fileName => {
    const signName = fileName.replace(/^\.\/(.+)\.js$/, '$1').toUpperCase();
    const signModule = requireContext(fileName);
    builtInSigns[signName] = signModule[signName]; // Use named export
});

// Alternative for Vite:
// const builtInSigns = {};
// const modules = import.meta.glob('./Words/words/*.js', { eager: true });
// Object.entries(modules).forEach(([path, module]) => {
//     const signName = path.replace(/^\.\/Words\/words\/(.+)\.js$/, '$1').toUpperCase();
//     builtInSigns[signName] = module[signName];
// });

// Global variable to store all signs
let allSigns = { ...builtInSigns };

// Initial word list with built-in signs
export const wordList = Object.keys(builtInSigns).sort();

// Flag to track loading state
let isLoadingCustomSigns = false;

// Load status
export let customSignsLoadStatus = '';

// Transform sign data into animation functions
function createFunctionFromSignData(sign) {
    return function(ref) {
        try {
            console.log(`Executing animation for sign: ${sign.name}`);
            
            if (Array.isArray(ref.characters)) {
                ref.characters.push(sign.name);
            }
            
            if (sign.motionData && sign.motionData.animations && 
                Array.isArray(sign.motionData.animations) && 
                sign.motionData.animations.length > 0) {
                
                console.log(`Using motion data for sign: ${sign.name}`);
                
                if (!Array.isArray(ref.animations)) ref.animations = [];
                sign.motionData.animations.forEach(frame => {
                    if (Array.isArray(frame) && frame.length > 0) {
                        ref.animations.push(frame);
                    }
                });
                
                if (!ref.pending && typeof ref.animate === 'function') {
                    ref.pending = true;
                    ref.animate();
                }
                
                return;
            }
            
            if (sign.code) {
                console.log(`Using code for sign: ${sign.name}`);
                
                try {
                    const codeToExecute = sign.code.replace(
                        new RegExp(`export\\s+const\\s+${sign.name}\\s*=\\s*`, 'i'), 
                        ''
                    );
                    
                    const signFunction = new Function('ref', `
                        try {
                            ${codeToExecute}
                        } catch(e) {
                            console.error("Error in custom sign code:", e);
                        }
                    `);
                    
                    signFunction(ref);
                    return;
                } catch (codeError) {
                    console.error(`Error executing code for sign ${sign.name}:`, codeError);
                }
            }
            
            console.log(`Using fallback animation for sign: ${sign.name}`);
            
            if (!Array.isArray(ref.animations)) ref.animations = [];
            let animation = [];
            animation.push(["mixamorigRightArm", "rotation", "z", Math.PI/3, "+"]);
            animation.push(["mixamorigRightArm", "rotation", "x", -Math.PI/6, "-"]);
            ref.animations.push(animation);
            
            animation = [];
            animation.push(["mixamorigRightArm", "rotation", "z", 0, "-"]);
            animation.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
            ref.animations.push(animation);
            
            if (!ref.pending && typeof ref.animate === 'function') {
                ref.pending = true;
                ref.animate();
            }
        } catch (error) {
            console.error(`Error executing animation for ${sign.name}:`, error);
        }
    };
}

// Load custom signs from localStorage
export const loadSignsFromLocalStorage = async (forceRefresh = false) => {
    if (isLoadingCustomSigns && !forceRefresh) return;
    
    try {
        isLoadingCustomSigns = true;
        customSignsLoadStatus = 'Loading custom signs...';
        
        console.log('Loading custom signs from localStorage');
        const signsData = localStorage.getItem('customSigns');
        const signs = signsData ? JSON.parse(signsData) : [];
        
        if (Array.isArray(signs)) {
            console.log(`Loaded ${signs.length} custom signs from localStorage`);
            
            const customSigns = {};
            signs.forEach(sign => {
                if (!sign || !sign.name) {
                    console.warn('Invalid sign data:', sign);
                    return;
                }
                
                const signName = sign.name.toUpperCase();
                customSigns[signName] = createFunctionFromSignData(sign);
            });
            
            allSigns = { ...builtInSigns, ...customSigns };
            
            // Trigger update
            const signsHash = Date.now().toString();
            localStorage.setItem('signsHash', signsHash);
            
            window.dispatchEvent(new Event('signs-loaded'));
            window.dispatchEvent(new Event('storage'));
            
            customSignsLoadStatus = `Loaded ${signs.length} custom signs`;
        } else {
            console.log('No custom signs found');
            customSignsLoadStatus = 'No custom signs found';
        }
    } catch (error) {
        console.error("Failed to load custom signs:", error);
        customSignsLoadStatus = `Error: ${error.message}`;
    } finally {
        isLoadingCustomSigns = false;
    }
};

// Save a custom sign to localStorage
export async function saveSign(sign) {
    try {
        const signsData = localStorage.getItem('customSigns');
        const signs = signsData ? JSON.parse(signsData) : [];
        
        const upperName = sign.name.toUpperCase();
        const existingIndex = signs.findIndex(s => s.name.toUpperCase() === upperName);
        
        if (existingIndex !== -1) {
            signs[existingIndex] = sign;
        } else {
            signs.push(sign);
        }
        
        localStorage.setItem('customSigns', JSON.stringify(signs));
        
        // Update allSigns
        const customSigns = {};
        signs.forEach(s => {
            customSigns[s.name.toUpperCase()] = createFunctionFromSignData(s);
        });
        allSigns = { ...builtInSigns, ...customSigns };
        
        const signsHash = Date.now().toString();
        localStorage.setItem('signsHash', signsHash);
        
        window.dispatchEvent(new Event('signs-loaded'));
        window.dispatchEvent(new Event('storage'));
        
        return true;
    } catch (error) {
        console.error("Error saving sign:", error);
        return false;
    }
}

// Delete a custom sign
export async function deleteSign(signName) {
    try {
        const upperName = signName.toUpperCase();
        const signsData = localStorage.getItem('customSigns');
        const signs = signsData ? JSON.parse(signsData) : [];
        
        const updatedSigns = signs.filter(s => s.name.toUpperCase() !== upperName);
        localStorage.setItem('customSigns', JSON.stringify(updatedSigns));
        
        delete allSigns[upperName];
        
        const signsHash = Date.now().toString();
        localStorage.setItem('signsHash', signsHash);
        
        window.dispatchEvent(new Event('signs-loaded'));
        window.dispatchEvent(new Event('storage'));
        
        return true;
    } catch (error) {
        console.error("Error deleting sign:", error);
        return false;
    }
}

// Get custom signs status
export function getCustomSignsStatus() {
    const signsData = localStorage.getItem('customSigns');
    const signs = signsData ? JSON.parse(signsData) : [];
    return {
        isLoading: isLoadingCustomSigns,
        status: customSignsLoadStatus,
        count: signs.length
    };
}

// Get all sign names
export function getAllSignNames() {
    return Object.keys(allSigns).sort();
}

// Load signs on module import
loadSignsFromLocalStorage();

// Export built-in signs
export const { TIME, HOME, PERSON, YOU } = builtInSigns;

// Export default
export default allSigns;