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
    const silenceTimerRef = useRef(null);

    // Keep onMatch fresh without re-triggering effects
    useEffect(() => {
        onMatchRef.current = onMatch;
    }, [onMatch]);

    useEffect(() => {
        isListeningRef.current = isListening;
    }, [isListening]);

    const stopSilenceTimer = () => {
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
        }
    };

    // Use callback so we can pass it to dependencies if needed, 
    // though really we just access the ref inside effects.
    const startSilenceTimer = useCallback(() => {
        stopSilenceTimer();
        silenceTimerRef.current = setTimeout(() => {
            console.log("Auto-pausing due to silence");
            stopListening();
        }, 5000); // 5 seconds silence timeout
    }, []);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            setIsListening(false); // This triggers the ref update, so onend won't restart
            recognitionRef.current.stop();
            setMatchStatus('idle');
            stopSilenceTimer();
        }
    }, [startSilenceTimer]); // Added startSilenceTimer to dep though strictly not needed as it's stable

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
        recognition.lang = 'en-US'; // Ideally match this to user preference in future

        recognition.onstart = () => {
            setError(null);
            setMatchStatus('listening');
            startSilenceTimer();
        };

        recognition.onend = () => {
            // If the user wants to be listening (isListening state is true),
            // and we didn't stop it on purpose (e.g. silence timer), then restart.
            // However, if the silence timer killed it, isListening would be set to false already.

            if (isListeningRef.current) {
                // Engine stopped but we want to keep going. Restart.
                try {
                    recognition.start();
                } catch (e) {
                    console.warn("Failed to restart recognition:", e);
                    setIsListening(false);
                    setMatchStatus('idle');
                }
            } else {
                setMatchStatus('idle');
                stopSilenceTimer();
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            if (event.error === 'not-allowed') {
                setError('Microphone access denied.');
                setIsListening(false); // Force stop on permission error
            } else if (event.error === 'no-speech') {
                // Ignore no-speech errors in continuous mode usually, 
                // but if it triggers, we might want to restart or let the auto-restart handle it.
            } else {
                // Other errors
            }
        };

        recognition.onresult = (event) => {
            // Activity detected, reset silence timer
            startSilenceTimer();

            let finalTranscript = '';
            let newMatches = 0;

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const result = event.results[i];
                const chunk = result[0].transcript;

                if (result.isFinal) {
                    finalTranscript += chunk;

                    // Normalize: Lowercase, remove common punctuation, trim
                    // Keeping it simple but effective for chanting
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
                } else {
                    // Interim... we can show this in UI
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

            // Update transcript for UI (showing only last few words ideally, or full buffer?)
            // For chanting, seeing the last thing you said is most helpful.
            // Let's just show the latest interim or final chunk to keep UI clean.
            const lastResult = event.results[event.results.length - 1];
            if (lastResult) {
                setTranscript(lastResult[0].transcript);
            }
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) recognitionRef.current.abort();
            stopSilenceTimer();
        };
    }, [targetWord, startSilenceTimer, stopListening]);

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
