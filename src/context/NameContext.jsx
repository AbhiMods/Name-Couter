import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const NameContext = createContext();

export const NAMES = [
    { id: 'ram', label: 'Ram Ram', subtitle: 'Peace & Virtue', text: 'Ram Ram' },
    { id: 'radha', label: 'Radha Radha', subtitle: 'Divine Love', text: 'Radha Radha' },
    { id: 'jai_shri_ram', label: 'Jai Shri Ram', subtitle: 'Strength & Devotion', text: 'Jai Shri Ram' },
];

export const NameProvider = ({ children }) => {
    const [selectedNameId, setSelectedNameId] = useState(() => {
        return localStorage.getItem('divine_selected_name') || 'ram';
    });

    // Audio Settings
    const [soundEnabled, setSoundEnabled] = useState(() => {
        return localStorage.getItem('divine_sound_enabled') === 'true';
    });
    const [volume, setVolume] = useState(0.5);

    // Custom Admin Audio Mappings (nameId -> base64Data)
    const [customAudios, setCustomAudios] = useState(() => {
        const saved = localStorage.getItem('divine_custom_audios');
        return saved ? JSON.parse(saved) : {};
    });

    // Audio Ref to prevent multiple overlaps
    const audioRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('divine_selected_name', selectedNameId);
    }, [selectedNameId]);

    useEffect(() => {
        localStorage.setItem('divine_sound_enabled', soundEnabled);
    }, [soundEnabled]);

    useEffect(() => {
        localStorage.setItem('divine_custom_audios', JSON.stringify(customAudios));
    }, [customAudios]);

    const selectedName = NAMES.find(n => n.id === selectedNameId) || NAMES[0];

    const updateName = (id) => {
        if (NAMES.find(n => n.id === id)) {
            setSelectedNameId(id);
        }
    };

    const toggleSound = () => setSoundEnabled(prev => !prev);

    const updateCustomAudio = (nameId, audioData) => {
        setCustomAudios(prev => {
            const next = { ...prev };
            if (audioData) {
                next[nameId] = audioData;
            } else {
                delete next[nameId];
            }
            return next;
        });
    };

    // Simple audio player
    const playChant = () => {
        if (!soundEnabled) return;

        try {
            // Priority 1: Admin Custom Audio
            if (customAudios[selectedNameId]) {
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                }
                const audio = new Audio(customAudios[selectedNameId]);
                audio.volume = volume;
                audio.play().catch(e => console.warn('Audio play blocked:', e));
                audioRef.current = audio;
                return;
            }

            // Priority 2: Fallback to SpeechSynthesis (TTS)
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();

                const utterance = new SpeechSynthesisUtterance(selectedName.text);
                utterance.rate = 1.1;
                utterance.pitch = 0.9;
                utterance.volume = volume;

                utterance.onerror = (e) => console.warn('Speech synthesis error:', e);

                const voices = window.speechSynthesis.getVoices();
                const hindiVoice = voices.find(v => v.lang.includes('hi'));
                if (hindiVoice) utterance.voice = hindiVoice;

                window.speechSynthesis.speak(utterance);
            }
        } catch (e) {
            console.error('Audio playback failed', e);
        }
    };

    return (
        <NameContext.Provider value={{
            selectedName,
            selectedNameId,
            updateName,
            allNames: NAMES,
            soundEnabled,
            toggleSound,
            volume,
            setVolume,
            playChant,
            customAudios,
            updateCustomAudio
        }}>
            {children}
        </NameContext.Provider>
    );
};

export const useName = () => {
    const context = useContext(NameContext);
    if (!context) {
        throw new Error('useName must be used within a NameProvider');
    }
    return context;
};
