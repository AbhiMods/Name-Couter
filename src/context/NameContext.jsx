import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const NameContext = createContext();

export const NAMES = [
    { id: 'ram', label: 'Ram Ram', subtitle: 'Peace & Virtue', text: 'Ram Ram' },
    { id: 'radha', label: 'Radha Radha', subtitle: 'Divine Love', text: 'Radha Radha' },
    { id: 'jai_shri_ram', label: 'Jai Shri Ram', subtitle: 'Strength & Devotion', text: 'Jai Shri Ram' },
    { id: 'krishna', label: 'Hare Krishna', subtitle: 'Joy & Wisdom', text: 'Hare Krishna' },
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

    // Custom User Names
    const [customNames, setCustomNames] = useState(() => {
        const saved = localStorage.getItem('divine_custom_names');
        return saved ? JSON.parse(saved) : [];
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

    useEffect(() => {
        localStorage.setItem('divine_custom_names', JSON.stringify(customNames));
    }, [customNames]);

    const allNames = [...NAMES, ...customNames];
    const selectedName = allNames.find(n => n.id === selectedNameId) || allNames[0];

    const updateName = (id) => {
        if (allNames.find(n => n.id === id)) {
            setSelectedNameId(id);
        }
    };

    const addCustomName = (name, subtitle) => {
        const id = name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
        const newName = { id, label: name, subtitle: subtitle || 'Custom Chant', text: name };
        setCustomNames(prev => [...prev, newName]);
        setSelectedNameId(id); // Auto-select new name
    };

    const removeCustomName = (id) => {
        setCustomNames(prev => prev.filter(n => n.id !== id));
        if (selectedNameId === id) setSelectedNameId(NAMES[0].id);
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

            // Priority 2: Fallback to SpeechSynthesis (TTS) - REMOVED per user request
            // if ('speechSynthesis' in window) { ... }
        } catch (e) {
            console.error('Audio playback failed', e);
        }
    };

    return (
        <NameContext.Provider value={{
            selectedName,
            selectedNameId,
            updateName,
            allNames,
            addCustomName,
            removeCustomName,
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
