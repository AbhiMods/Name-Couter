import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('divine_theme') || 'dark';
    });

    const [textSize, setTextSize] = useState(() => {
        return localStorage.getItem('divine_text_size') || 'normal';
    });

    const [contrast, setContrast] = useState(() => {
        return localStorage.getItem('divine_contrast') || 'normal';
    });

    const [immersiveMode, setImmersiveMode] = useState(false);

    const [immersiveConfig, setImmersiveConfig] = useState(() => {
        const saved = localStorage.getItem('divine_immersive_config');
        return saved ? JSON.parse(saved) : { showName: false, showControls: false };
    });

    const [floatingAnimations, setFloatingAnimations] = useState(() => {
        return localStorage.getItem('divine_floating_animations') !== 'false';
    });

    const [floatingTextColor, setFloatingTextColor] = useState(() => {
        return localStorage.getItem('divine_floating_text_color') || '';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.setAttribute('data-theme', theme);
        root.setAttribute('data-text-size', textSize);
        root.setAttribute('data-contrast', contrast);
        localStorage.setItem('divine_theme', theme);
        localStorage.setItem('divine_text_size', textSize);
        localStorage.setItem('divine_contrast', contrast);
    }, [theme, textSize, contrast]);

    useEffect(() => {
        localStorage.setItem('divine_immersive_config', JSON.stringify(immersiveConfig));
    }, [immersiveConfig]);

    useEffect(() => {
        localStorage.setItem('divine_floating_animations', floatingAnimations);
    }, [floatingAnimations]);

    useEffect(() => {
        localStorage.setItem('divine_floating_text_color', floatingTextColor);
    }, [floatingTextColor]);

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    const toggleTextSize = () => setTextSize(prev => prev === 'normal' ? 'large' : 'normal');
    const toggleContrast = () => setContrast(prev => prev === 'normal' ? 'high' : 'normal');
    const toggleImmersiveMode = () => setImmersiveMode(prev => !prev);

    const updateImmersiveConfig = (key) => setImmersiveConfig(prev => ({
        ...prev,
        [key]: !prev[key]
    }));

    return (
        <ThemeContext.Provider value={{
            theme, toggleTheme,
            textSize, toggleTextSize,
            contrast, toggleContrast,
            immersiveMode, toggleImmersiveMode,
            immersiveConfig, updateImmersiveConfig,
            floatingAnimations, setFloatingAnimations,
            floatingTextColor, setFloatingTextColor
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};
