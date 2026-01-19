import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const AudioCtx = window.AudioContext || window.webkitAudioContext;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const SOUNDS = {
  correct: { freq: [523, 659, 784], duration: 0.15 },
  wrong: { freq: [200, 180], duration: 0.2 },
  click: { freq: [800], duration: 0.05 },
  levelUp: { freq: [523, 659, 784, 1047], duration: 0.15 },
  achievement: { freq: [440, 550, 660, 880], duration: 0.12 },
  pop: { freq: [600, 400], duration: 0.06 },
};

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try { return localStorage.getItem('gdtm_sound') !== 'false'; }
    catch { return true; }
  });
  
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(!!SpeechRecognition);
  
  const audioCtxRef = useRef(null);
  const recognitionRef = useRef(null);
  
  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
    return audioCtxRef.current;
  }, []);
  
  const playSound = useCallback((name) => {
    if (!soundEnabled) return;
    const sound = SOUNDS[name];
    if (!sound) return;
    
    try {
      const ctx = getAudioCtx();
      sound.freq.forEach((f, i) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = f;
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + sound.duration);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + sound.duration);
        }, i * 80);
      });
    } catch (e) { console.log('Audio error:', e); }
  }, [soundEnabled, getAudioCtx]);
  
  const toggleSound = useCallback(() => {
    const newVal = !soundEnabled;
    setSoundEnabled(newVal);
    localStorage.setItem('gdtm_sound', String(newVal));
    return newVal;
  }, [soundEnabled]);
  
  const speak = useCallback((text, rate = 0.85) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
  }, [soundEnabled]);
  
  // Speech Recognition - Listen and check pronunciation
  const startListening = useCallback((targetWord, onResult) => {
    if (!SpeechRecognition) {
      onResult({ success: false, error: 'not_supported', transcript: '' });
      return;
    }
    
    // Stop any existing recognition
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event) => {
      const results = event.results[0];
      const transcripts = [];
      
      // Get all alternatives
      for (let i = 0; i < results.length; i++) {
        transcripts.push(results[i].transcript.toLowerCase().trim());
      }
      
      const mainTranscript = transcripts[0];
      const targetLower = targetWord.toLowerCase().trim();
      
      // Check if any alternative matches
      const isMatch = transcripts.some(t => {
        // Exact match
        if (t === targetLower) return true;
        // Contains the word
        if (t.includes(targetLower) || targetLower.includes(t)) return true;
        // Similarity check (for slight mispronunciations)
        const similarity = calculateSimilarity(t, targetLower);
        return similarity >= 0.7;
      });
      
      // Calculate confidence score
      const confidence = results[0].confidence || 0.5;
      const similarity = calculateSimilarity(mainTranscript, targetLower);
      
      let score = 0;
      let feedback = '';
      
      if (isMatch && similarity >= 0.9) {
        score = 100;
        feedback = 'perfect';
      } else if (isMatch && similarity >= 0.7) {
        score = 80;
        feedback = 'good';
      } else if (similarity >= 0.5) {
        score = 50;
        feedback = 'close';
      } else {
        score = 0;
        feedback = 'try_again';
      }
      
      onResult({
        success: isMatch,
        transcript: mainTranscript,
        allTranscripts: transcripts,
        confidence,
        similarity,
        score,
        feedback,
        targetWord
      });
      
      setIsListening(false);
    };
    
    recognition.onerror = (event) => {
      let errorType = 'error';
      if (event.error === 'no-speech') errorType = 'no_speech';
      else if (event.error === 'audio-capture') errorType = 'no_mic';
      else if (event.error === 'not-allowed') errorType = 'not_allowed';
      
      onResult({
        success: false,
        error: errorType,
        transcript: '',
        score: 0,
        feedback: 'error'
      });
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    try {
      recognition.start();
    } catch (e) {
      onResult({ success: false, error: 'error', transcript: '', score: 0 });
      setIsListening(false);
    }
  }, []);
  
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      setIsListening(false);
    }
  }, []);
  
  return (
    <AudioContext.Provider value={{ 
      soundEnabled, 
      toggleSound, 
      playSound, 
      speak,
      startListening,
      stopListening,
      isListening,
      speechSupported
    }}>
      {children}
    </AudioContext.Provider>
  );
}

// Calculate string similarity (Levenshtein distance based)
function calculateSimilarity(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  
  if (len1 === 0) return len2 === 0 ? 1 : 0;
  if (len2 === 0) return 0;
  
  const matrix = [];
  
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  
  const distance = matrix[len1][len2];
  const maxLen = Math.max(len1, len2);
  return (maxLen - distance) / maxLen;
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within AudioProvider');
  return context;
}

export default AudioContext;
