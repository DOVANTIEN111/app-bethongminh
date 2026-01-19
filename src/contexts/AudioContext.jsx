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
  const [speechSupported] = useState(!!SpeechRecognition);
  
  const audioCtxRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  
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
  
  // ============================================
  // GOOGLE TTS - Phát âm chuẩn bản ngữ
  // ============================================
  const speak = useCallback((text, lang = 'en-US') => {
    if (!soundEnabled) return;
    
    // Dừng audio đang phát
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    // Sử dụng Google Translate TTS API (miễn phí, chuẩn bản ngữ)
    const encodedText = encodeURIComponent(text);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodedText}`;
    
    const audio = new Audio(url);
    audioRef.current = audio;
    
    audio.play().catch((error) => {
      // Fallback về Web Speech API nếu Google TTS không hoạt động
      console.log('Google TTS failed, using fallback:', error);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.85;
        
        // Chọn giọng tiếng Anh tốt nhất
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(v => 
          v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))
        ) || voices.find(v => v.lang.includes('en-US'));
        
        if (englishVoice) {
          utterance.voice = englishVoice;
        }
        
        window.speechSynthesis.speak(utterance);
      }
    });
  }, [soundEnabled]);
  
  // Phát âm chậm (cho học từ vựng)
  const speakSlow = useCallback((text) => {
    if (!soundEnabled) return;
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    const encodedText = encodeURIComponent(text);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodedText}&ttsspeed=0.5`;
    
    const audio = new Audio(url);
    audio.playbackRate = 0.8; // Chậm hơn
    audioRef.current = audio;
    
    audio.play().catch(() => {
      // Fallback
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.6; // Rất chậm
        window.speechSynthesis.speak(utterance);
      }
    });
  }, [soundEnabled]);
  
  // ============================================
  // Speech Recognition - Kiểm tra phát âm
  // ============================================
  const startListening = useCallback((targetWord, onResult) => {
    if (!SpeechRecognition) {
      onResult({ success: false, error: 'not_supported', transcript: '' });
      return;
    }
    
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
      
      for (let i = 0; i < results.length; i++) {
        transcripts.push(results[i].transcript.toLowerCase().trim());
      }
      
      const mainTranscript = transcripts[0];
      const targetLower = targetWord.toLowerCase().trim();
      
      const isMatch = transcripts.some(t => {
        if (t === targetLower) return true;
        if (t.includes(targetLower) || targetLower.includes(t)) return true;
        const similarity = calculateSimilarity(t, targetLower);
        return similarity >= 0.7;
      });
      
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
      speakSlow,
      startListening,
      stopListening,
      isListening,
      speechSupported
    }}>
      {children}
    </AudioContext.Provider>
  );
}

// Calculate string similarity
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
