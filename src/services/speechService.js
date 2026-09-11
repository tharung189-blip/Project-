/**
 * Web Speech API wrapper for Text-to-Speech (TTS) and Speech-to-Text (STT)
 */

class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.recognition = null;
    this.isListening = false;
    this.initRecognition();
  }

  initRecognition() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      }
    }
  }

  speak(text, onEnd = () => {}) {
    if (!this.synth) {
      onEnd();
      return;
    }

    this.synth.cancel(); // Stop any current speech

    if (!text) {
      onEnd();
      return;
    }

    const cleanText = text.replace(/[*_#`]/g, ''); // strip markdown chars
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick a natural English voice if available
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(v => (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => onEnd();
    utterance.onerror = () => onEnd();

    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  startListening(onResult, onError) {
    // If recognition isn't available yet, try to prompt for mic permission
    if (!this.recognition) {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Request mic permission; once granted, initialize recognition and start
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
          // we only needed permission; stop tracks immediately
          try { stream.getTracks().forEach(t => t.stop()); } catch (e) {}
          this.initRecognition();
          if (!this.recognition) {
            if (onError) onError('Speech recognition is not available after granting microphone permission.');
            return;
          }
          this._startRecognition(onResult, onError);
        }).catch(err => {
          if (onError) onError(err.name === 'NotAllowedError' ? 'Microphone permission denied.' : (err.message || 'Microphone access error'));
        });
        // indicate that a request to start was initiated (permission prompt shown)
        return true;
      }

      if (onError) onError('Speech recognition is not supported in this browser.');
      return false;
    }

    return this._startRecognition(onResult, onError);
  }

  _startRecognition(onResult, onError) {
    if (this.isListening) return true;

    try {
      this.recognition.onstart = () => { this.isListening = true; };

      this.recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (onResult) onResult(transcript);
      };

      this.recognition.onerror = (err) => {
        this.isListening = false;
        if (onError) onError(err.error || err.message || 'Speech input error');
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
      // note: some browsers will fire onstart asynchronously
      return true;
    } catch (e) {
      this.isListening = false;
      if (onError) onError(e.message);
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}

export const speechService = new SpeechService();
