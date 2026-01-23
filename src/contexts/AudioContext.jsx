import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';

const AudioCtx = window.AudioContext || window.webkitAudioContext;

// Preload common sounds
const SOUNDS = {
  correct: { freq: [523.25, 659.25, 783.99], duration: 0.15 },
  wrong: { freq: [200, 150], duration: 0.2 },
  click: { freq: [800], duration: 0.05 },
  complete: { freq: [523.25, 659.25, 783.99, 1046.5], duration: 0.2 },
  levelUp: { freq: [392, 523.25, 659.25, 783.99], duration: 0.25 },
  star: { freq: [880, 1108.73], duration: 0.15 },
};

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const audioCtxRef = useRef(null);
  const audioRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [musicEnabled, setMusicEnabled] = useState(() => {
    const saved = localStorage.getItem('musicEnabled');
    return saved !== null ? JSON.parse(saved) : false;
  });
  
  // Detect iOS/iPad
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
    return audioCtxRef.current;
  }, []);

  useEffect(() => {
    localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('musicEnabled', JSON.stringify(musicEnabled));
  }, [musicEnabled]);

  // Unlock audio on iOS - cần user interaction
  useEffect(() => {
    const unlockAudio = () => {
      if (isIOS) {
        // Tạo và play silent audio để unlock
        const ctx = getAudioCtx();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        
        // Preload speechSynthesis trên iOS
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance('');
          utterance.volume = 0;
          window.speechSynthesis.speak(utterance);
        }
      }
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('click', unlockAudio);
    };

    document.addEventListener('touchstart', unlockAudio);
    document.addEventListener('click', unlockAudio);

    return () => {
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('click', unlockAudio);
    };
  }, [isIOS, getAudioCtx]);

  // Preload voices on iOS
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Load voices
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  const playSound = useCallback((type) => {
    if (!soundEnabled || !SOUNDS[type]) return;
    
    try {
      const ctx = getAudioCtx();
      if (ctx.state === 'suspended') ctx.resume();
      
      const { freq, duration } = SOUNDS[type];
      
      freq.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = f;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + duration + i * 0.1);
      });
    } catch (e) { console.log('Audio error:', e); }
  }, [soundEnabled, getAudioCtx]);

  // Speak function - ưu tiên speechSynthesis trên iOS
  const speak = useCallback((text, lang = 'en-US') => {
    if (!soundEnabled || !text) return;
    
    // Dừng audio đang phát
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // Trên iOS - chỉ dùng speechSynthesis
    if (isIOS) {
      useSpeechSynthesis(text, lang, 0.85);
      return;
    }
    
    // Trên Desktop - thử Google TTS trước
    const encodedText = encodeURIComponent(text);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang.split('-')[0]}&client=tw-ob&q=${encodedText}`;
    
    const audio = new Audio(url);
    audioRef.current = audio;
    
    audio.play().catch((error) => {
      console.log('Google TTS failed, using fallback:', error);
      useSpeechSynthesis(text, lang, 0.85);
    });
  }, [soundEnabled, isIOS]);

  // Speak slow - cho học từ vựng
  const speakSlow = useCallback((text, lang = 'en-US') => {
    if (!soundEnabled || !text) return;
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // Trên iOS - chỉ dùng speechSynthesis
    if (isIOS) {
      useSpeechSynthesis(text, lang, 0.6);
      return;
    }
    
    // Trên Desktop - thử Google TTS trước
    const encodedText = encodeURIComponent(text);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang.split('-')[0]}&client=tw-ob&q=${encodedText}&ttsspeed=0.5`;
    
    const audio = new Audio(url);
    audioRef.current = audio;
    
    audio.play().catch((error) => {
      console.log('Google TTS failed, using fallback:', error);
      useSpeechSynthesis(text, lang, 0.6);
    });
  }, [soundEnabled, isIOS]);

  // Helper function cho speechSynthesis
  const useSpeechSynthesis = useCallback((text, lang = 'en-US', rate = 0.85) => {
    if (!('speechSynthesis' in window)) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Lấy voice phù hợp
    const voices = window.speechSynthesis.getVoices();
    const langCode = lang.split('-')[0];
    
    // Ưu tiên voice theo thứ tự
    const preferredVoice = voices.find(v => 
      v.lang.includes(lang) && (
        v.name.includes('Google') || 
        v.name.includes('Samantha') || 
        v.name.includes('Daniel') ||
        v.name.includes('Karen') ||
        v.name.includes('Moira')
      )
    ) || voices.find(v => v.lang.includes(lang))
      || voices.find(v => v.lang.includes(langCode));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  }, []);

  // Speak Vietnamese
  const speakVietnamese = useCallback((text) => {
    if (!soundEnabled || !text) return;
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.9;
      
      const voices = window.speechSynthesis.getVoices();
      const vnVoice = voices.find(v => v.lang.includes('vi'));
      if (vnVoice) utterance.voice = vnVoice;
      
      window.speechSynthesis.speak(utterance);
    }
  }, [soundEnabled]);

  // Stop all audio
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  const toggleMusic = useCallback(() => {
    setMusicEnabled(prev => !prev);
  }, []);

  return (
    <AudioContext.Provider value={{ 
      playSound, 
      speak, 
      speakSlow,
      speakVietnamese,
      stopAudio,
      soundEnabled,
      musicEnabled,
      toggleSound,
      toggleMusic,
      isIOS,
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}

export default AudioContext;
