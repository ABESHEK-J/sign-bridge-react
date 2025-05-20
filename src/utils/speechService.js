// Speech recognition service
const speechService = {
    recognition: null,
    isListening: false,
    
    init(onStart, onResult, onEnd, onError) {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';
            
            this.recognition.onstart = () => {
                this.isListening = true;
                if (onStart) onStart();
            };
            
            this.recognition.onresult = (event) => {
                if (onResult) onResult(event);
            };
            
            this.recognition.onend = () => {
                this.isListening = false;
                if (onEnd) onEnd();
            };
            
            this.recognition.onerror = (event) => {
                if (onError) onError(event);
            };
            
            return true;
        }
        return false;
    },
    
    start() {
        if (this.recognition) {
            this.recognition.start();
            return true;
        }
        return false;
    },
    
    stop() {
        if (this.recognition) {
            this.recognition.stop();
            return true;
        }
        return false;
    },
    
    toggle(onStart, onEnd) {
        if (this.isListening) {
            this.stop();
            if (onEnd) onEnd();
        } else {
            this.start();
            if (onStart) onStart();
        }
    }
};

export default speechService;
