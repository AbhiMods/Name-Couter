import React, { createContext, useContext, useState, useEffect } from 'react';

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

    useEffect(() => {
        localStorage.setItem('divine_selected_name', selectedNameId);
    }, [selectedNameId]);

    useEffect(() => {
        localStorage.setItem('divine_sound_enabled', soundEnabled);
    }, [soundEnabled]);

    const selectedName = NAMES.find(n => n.id === selectedNameId) || NAMES[0];

    const updateName = (id) => {
        if (NAMES.find(n => n.id === id)) {
            setSelectedNameId(id);
        }
    };

    const toggleSound = () => setSoundEnabled(prev => !prev);

    // Simple audio player (TTS for now)
    const playChant = () => {
        if (!soundEnabled) return;

        try {
            // In a real app, check for selectedName.audioSrc first
            // Fallback to SpeechSynthesis
            if ('speechSynthesis' in window) {
                // Cancel previous to avoid queue buildup on fast tapping
                window.speechSynthesis.cancel();

                const utterance = new SpeechSynthesisUtterance(selectedName.text);
                utterance.rate = 1.1; // Slightly faster for chanting
                utterance.pitch = 0.9; // Slightly deeper
                utterance.volume = volume;

                // Error handler for specific utterance
                utterance.onerror = (e) => console.warn('Speech synthesis error:', e);

                // Try to find a Hindi voice if available
                const voices = window.speechSynthesis.getVoices();
                const hindiVoice = voices.find(v => v.lang.includes('hi'));
                if (hindiVoice) utterance.voice = hindiVoice;

                window.speechSynthesis.speak(utterance);
            }
        } catch (e) {
            console.error('Audio playback failed', e);
            // Optionally disable sound if it keeps failing
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
            playChant
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
