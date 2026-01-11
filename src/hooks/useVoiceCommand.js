import { useState, useEffect, useRef, useCallback } from 'react';

const useVoiceCommand = (targetWord, onMatch) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [matchStatus, setMatchStatus] = useState('idle'); // 'idle', 'listening', 'match', 'no-match'
    const [lastDetected, setLastDetected] = useState(null); // { word: 'Radha', count: 1, timestamp: 123 }
    const [error, setError] = useState(null);

    const recognitionRef = useRef(null);
    const onMatchRef = useRef(onMatch);
    const isListeningRef = useRef(isListening); // Track effective state for auto-restart

    // Keep onMatch fresh without re-triggering effects
    useEffect(() => {
        onMatchRef.current = onMatch;
    }, [onMatch]);

    useEffect(() => {
        isListeningRef.current = isListening;
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            setIsListening(false); // This triggers the ref update, so onend won't restart
            try {
                recognitionRef.current.stop();
            } catch (e) {
                // Ignore stop errors
            }
            setMatchStatus('idle');
        }
    }, []);

    // Initialize Recognition
    useEffect(() => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            setError('Speech recognition not supported in this browser.');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setError(null);
            setMatchStatus('listening');
        };

        recognition.onend = () => {
            // If the user wants to be listening (isListening state is true),
            // and we didn't stop it on purpose, then restart.
            if (isListeningRef.current) {
                console.log("Recognition ended, restarting...");
                try {
                    recognition.start();
                } catch (e) {
                    console.warn("Failed to restart recognition:", e);
                    // Minimal delay retry if instant restart fails
                    setTimeout(() => {
                        if (isListeningRef.current) {
                            try { recognition.start(); } catch (e2) { }
                        }
                    }, 1000);
                }
            } else {
                setMatchStatus('idle');
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            if (event.error === 'not-allowed') {
                setError('Microphone access denied.');
                setIsListening(false);
            } else if (event.error === 'no-speech') {
                // Ignore no-speech errors in continuous mode
                // Just let it restart via onend
            }
        };

        recognition.onresult = (event) => {
            let finalTranscript = '';
            let newMatches = 0;

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const result = event.results[i];
                const chunk = result[0].transcript;

                if (result.isFinal) {
                    finalTranscript += chunk;

                    // Normalize: Lowercase, remove common punctuation, trim
                    const normalizedChunk = chunk.toLowerCase()
                        .replace(/[.,!?;:()]/g, '')
                        .replace(/\s+/g, ' ')
                        .trim();

                    const words = normalizedChunk.split(' ');
                    const target = targetWord.toLowerCase().trim();

                    // Count exact matches in this chunk
                    const chunkCount = words.filter(w => w === target).length;

                    if (chunkCount > 0) {
                        newMatches += chunkCount;
                    }
                }
            }

            // If we have new matches in this final block
            if (newMatches > 0) {
                onMatchRef.current(newMatches);
                setLastDetected({
                    word: targetWord,
                    count: newMatches,
                    timestamp: Date.now()
                });

                setMatchStatus('match');
                // Brief visual pulse reset
                setTimeout(() => {
                    setMatchStatus('listening');
                }, 800);
            }

            const lastResult = event.results[event.results.length - 1];
            if (lastResult) {
                setTranscript(lastResult[0].transcript);
            }
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) recognitionRef.current.abort();
        };
    }, [targetWord, stopListening]);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListeningRef.current) {
            try {
                setTranscript('');
                setLastDetected(null);
                setMatchStatus('listening');
                setIsListening(true);
                recognitionRef.current.start();
            } catch (e) {
                console.warn("Speech start warning:", e);
                // If already started, ensure state is synced
                if (e.message.indexOf('started') !== -1) {
                    setIsListening(true);
                }
            }
        }
    }, []);

    return {
        isListening,
        matchStatus,
        transcript,
        lastDetected,
        error,
        startListening,
        stopListening
    };
};

export default useVoiceCommand;
