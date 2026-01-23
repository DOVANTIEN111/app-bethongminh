import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';

const AudioCtx = window.AudioContext || window.webkitAudioContext;

// Vocabulary audio mapping (ElevenLabs - Rachel voice)
import vocabMapping from '../data/vocabAudioMapping';

// Preload common sounds
const SOUNDS = {
  correct: { freq: [523.25, 659.25, 783.99], duration: 0.15 },
  wrong: { freq: [200, 150], duration: 0.2 },
  click: { freq: [800], duration: 0.05 },
  complete: { freq: [523.25, 659.25, 783.99, 1046.5], duration: 0.2 },
  levelUp: { freq: [392, 523.25, 659.25, 783.99], duration: 0.25 },
  star: { freq: [880, 1108.73], duration: 0.15 },
  achievement: { freq: [523.25, 659.25, 783.99, 1046.5, 1318.5], duration: 0.3 },
  pop: { freq: [600, 900], duration: 0.08 },
};

// Check if Speech Recognition is supported
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const audioCtxRef = useRef(null);
  const audioRef = useRef(null);
  const recognitionRef = useRef(null);

  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [musicEnabled, setMusicEnabled] = useState(() => {
    const saved = localStorage.getItem('musicEnabled');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // NEW: Loading state for TTS

  // Detect iOS/iPad
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  // Check if speech recognition is supported (NOT supported on iOS Safari)
  const speechSupported = !!SpeechRecognition && !isIOS; // FIX: iOS doesn't support Speech Recognition

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

  // Preload voices
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

  // Helper function cho speechSynthesis - MOVED UP before speak/speakSlow
  const useSpeechSynthesis = useCallback((text, lang = 'en-US', rate = 0.85) => {
    if (!('speechSynthesis' in window)) {
      setIsSpeaking(false);
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Event handlers for loading state
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

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

  // Helper: Get local MP3 file path for vocabulary word
  const getVocabAudioPath = useCallback((text) => {
    if (!text) return null;
    const normalizedText = text.toLowerCase().trim();
    const filename = vocabMapping[normalizedText];
    if (filename) {
      return `/audio/vocabulary/${filename}`;
    }
    return null;
  }, []);

  // Helper: Play local MP3 file
  const playLocalAudio = useCallback((audioPath, onError) => {
    const audio = new Audio(audioPath);
    audioRef.current = audio;

    audio.onloadstart = () => setIsSpeaking(true);
    audio.onended = () => setIsSpeaking(false);
    audio.onerror = () => {
      console.log('Local MP3 failed, using fallback');
      onError?.();
    };

    audio.play()
      .catch((error) => {
        console.log('Local MP3 play failed:', error);
        onError?.();
      });
  }, []);

  // Speak function - ưu tiên file MP3 local (ElevenLabs)
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

    setIsSpeaking(true);

    // 1. Kiểm tra có file MP3 local không (ElevenLabs - chất lượng cao)
    const localAudioPath = getVocabAudioPath(text);
    if (localAudioPath) {
      playLocalAudio(localAudioPath, () => {
        // Fallback nếu file MP3 lỗi
        useSpeechSynthesis(text, lang, 0.85);
      });
      return;
    }

    // 2. Trên iOS - dùng speechSynthesis (Google TTS không hoạt động)
    if (isIOS) {
      useSpeechSynthesis(text, lang, 0.85);
      return;
    }

    // 3. Trên Desktop - thử Google TTS, fallback sang Web Speech API
    const encodedText = encodeURIComponent(text);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang.split('-')[0]}&client=tw-ob&q=${encodedText}`;

    const audio = new Audio(url);
    audioRef.current = audio;

    audio.onloadstart = () => setIsSpeaking(true);
    audio.onended = () => setIsSpeaking(false);
    audio.onerror = () => {
      console.log('Google TTS failed, using Web Speech API fallback');
      useSpeechSynthesis(text, lang, 0.85);
    };

    const timeout = setTimeout(() => {
      if (audio.readyState < 2) {
        console.log('Google TTS timeout, using fallback');
        audio.pause();
        useSpeechSynthesis(text, lang, 0.85);
      }
    }, 3000);

    audio.play()
      .then(() => clearTimeout(timeout))
      .catch((error) => {
        clearTimeout(timeout);
        console.log('Google TTS play failed:', error);
        useSpeechSynthesis(text, lang, 0.85);
      });
  }, [soundEnabled, isIOS, useSpeechSynthesis, getVocabAudioPath, playLocalAudio]);

  // Speak slow - cho học từ vựng (dùng Web Speech API với tốc độ chậm)
  const speakSlow = useCallback((text, lang = 'en-US') => {
    if (!soundEnabled || !text) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(true);

    // Dùng Web Speech API với tốc độ chậm để học phát âm
    // (không dùng file MP3 vì cần phát chậm hơn bình thường)
    useSpeechSynthesis(text, lang, 0.6);
  }, [soundEnabled, useSpeechSynthesis]);

  // Speak Vietnamese
  const speakVietnamese = useCallback((text) => {
    if (!soundEnabled || !text) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      setIsSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.9;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

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
    setIsSpeaking(false);
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  const toggleMusic = useCallback(() => {
    setMusicEnabled(prev => !prev);
  }, []);

  // Calculate similarity between two strings (Levenshtein distance based)
  // FIX: Memoized with useCallback
  const calculateSimilarity = useCallback((str1, str2) => {
    if (str1 === str2) return 1;
    if (!str1 || !str2) return 0;

    const len1 = str1.length;
    const len2 = str2.length;

    // Create distance matrix
    const matrix = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(null));

    for (let i = 0; i <= len1; i++) matrix[0][i] = i;
    for (let j = 0; j <= len2; j++) matrix[j][0] = j;

    for (let j = 1; j <= len2; j++) {
      for (let i = 1; i <= len1; i++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + cost
        );
      }
    }

    const distance = matrix[len2][len1];
    const maxLen = Math.max(len1, len2);
    return 1 - (distance / maxLen);
  }, []);

  // Speech Recognition - for pronunciation practice
  const startListening = useCallback((targetWord, callback) => {
    // FIX: Better error handling for iOS
    if (isIOS) {
      callback?.({
        error: 'ios_not_supported',
        message: 'iPhone/iPad không hỗ trợ nhận diện giọng nói. Vui lòng dùng máy tính hoặc điện thoại Android.'
      });
      return;
    }

    if (!SpeechRecognition) {
      callback?.({
        error: 'not_supported',
        message: 'Trình duyệt không hỗ trợ nhận diện giọng nói. Vui lòng dùng Chrome hoặc Edge.'
      });
      return;
    }

    if (!targetWord) {
      callback?.({ error: 'no_word' });
      return;
    }

    // Stop any existing recognition
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error === 'no-speech') {
          callback?.({
            error: 'no_speech',
            message: 'Không nghe thấy giọng nói. Hãy nói to và rõ hơn!'
          });
        } else if (event.error === 'not-allowed') {
          callback?.({
            error: 'not_allowed',
            message: 'Chưa cấp quyền microphone. Vui lòng cho phép truy cập microphone trong cài đặt trình duyệt.'
          });
        } else if (event.error === 'network') {
          callback?.({
            error: 'network',
            message: 'Lỗi mạng. Vui lòng kiểm tra kết nối internet.'
          });
        } else {
          callback?.({
            error: event.error,
            message: `Lỗi: ${event.error}`
          });
        }
      };

      recognition.onresult = (event) => {
        setIsListening(false);
        const results = event.results[0];

        // Check all alternatives for a match
        let bestMatch = null;
        let bestScore = 0;

        for (let i = 0; i < results.length; i++) {
          const transcript = results[i].transcript.toLowerCase().trim();
          const target = targetWord.toLowerCase().trim();

          // Calculate similarity score
          const score = calculateSimilarity(transcript, target);

          if (score > bestScore) {
            bestScore = score;
            bestMatch = transcript;
          }
        }

        const scorePercent = Math.round(bestScore * 100);

        callback?.({
          success: scorePercent >= 70,
          score: scorePercent,
          transcript: bestMatch || results[0].transcript,
        });
      };

      recognition.start();
    } catch (error) {
      console.error('Speech recognition error:', error);
      setIsListening(false);
      callback?.({
        error: 'failed',
        message: 'Không thể khởi động nhận diện giọng nói. Vui lòng thử lại.'
      });
    }
  }, [isIOS, calculateSimilarity]); // FIX: Added calculateSimilarity to dependencies

  // Stop speech recognition
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      setIsListening(false);
    }
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
      // TTS state
      isSpeaking,
      // Speech Recognition
      speechSupported,
      isListening,
      startListening,
      stopListening,
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
