// Handles local storage and IndexedDB operations
const storageService = {
    // IndexedDB operations
    initDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('SignBridgeDB', 1);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create signs store
                if (!db.objectStoreNames.contains('signs')) {
                    db.createObjectStore('signs', { keyPath: 'id' });
                }
            };
            
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
            
            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    },
    
    // Save a sign to the database
    saveSign(sign) {
        return new Promise((resolve, reject) => {
            this.initDatabase()
                .then(db => {
                    const transaction = db.transaction(['signs'], 'readwrite');
                    const store = transaction.objectStore('signs');
                    
                    const request = store.add(sign);
                    
                    request.onsuccess = () => resolve(true);
                    request.onerror = () => reject(new Error('Failed to save sign'));
                })
                .catch(reject);
        });
    },
    
    // Get all signs from the database
    getAllSigns() {
        return new Promise((resolve, reject) => {
            this.initDatabase()
                .then(db => {
                    const transaction = db.transaction(['signs'], 'readonly');
                    const store = transaction.objectStore('signs');
                    
                    const request = store.getAll();
                    
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(new Error('Failed to get signs'));
                })
                .catch(reject);
        });
    },
    
    // Get a sign by ID
    getSignById(id) {
        return new Promise((resolve, reject) => {
            this.initDatabase()
                .then(db => {
                    const transaction = db.transaction(['signs'], 'readonly');
                    const store = transaction.objectStore('signs');
                    
                    const request = store.get(id);
                    
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(new Error('Failed to get sign'));
                })
                .catch(reject);
        });
    },
    
    // Delete a sign
    deleteSign(id) {
        return new Promise((resolve, reject) => {
            this.initDatabase()
                .then(db => {
                    const transaction = db.transaction(['signs'], 'readwrite');
                    const store = transaction.objectStore('signs');
                    
                    const request = store.delete(id);
                    
                    request.onsuccess = () => resolve(true);
                    request.onerror = () => reject(new Error('Failed to delete sign'));
                })
                .catch(reject);
        });
    },
    
    // LocalStorage operations
    saveToLocalStorage(key, value) {
        try {
            const serializedValue = typeof value === 'object' 
                ? JSON.stringify(value) 
                : String(value);
                
            localStorage.setItem(key, serializedValue);
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },
    
    getFromLocalStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            
            if (item === null) return defaultValue;
            
            // Try to parse as JSON, but return the raw value if that fails
            try {
                return JSON.parse(item);
            } catch (e) {
                return item;
            }
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    },
    
    removeFromLocalStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }
};

export default storageService;
