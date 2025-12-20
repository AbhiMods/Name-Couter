import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useBgMusic } from '../context/BgMusicContext';
import { useBhajan } from '../context/BhajanContext';
import { useStats } from '../context/StatsContext';
import {
    Palette, Type, MousePointerClick, Moon, Sun,
    Music, Volume2, Maximize2, Coffee, Zap,
    Eye, Activity, Download, Trash2, Smartphone,
    Youtube, Instagram, Send, Globe, Heart,
    Bell, Clock, Award
} from 'lucide-react';
import styles from './Settings.module.css';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

// Custom Toggle Component if Switch doesn't exist
const Toggle = ({ active, onToggle }) => (
    <div
        onClick={onToggle}
        style={{
            width: '44px',
            height: '24px',
            background: active ? 'var(--color-primary)' : 'var(--color-surface-hover)',
            borderRadius: '12px',
            position: 'relative',
            cursor: 'pointer',
            transition: 'background 0.3s'
        }}
    >
        <div style={{
            width: '20px',
            height: '20px',
            background: '#fff',
            borderRadius: '50%',
            position: 'absolute',
            top: '2px',
            left: active ? '22px' : '2px',
            transition: 'left 0.3s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }} />
    </div>
);

const Settings = () => {
    useDocumentTitle('Settings | Divine Name');

    // Theme Context
    const {
        theme, toggleTheme,
        textSize, toggleTextSize,
        contrast, toggleContrast,
        immersiveConfig, updateImmersiveConfig,
        floatingAnimations, setFloatingAnimations,
        floatingTextColor, setFloatingTextColor
    } = useTheme();

    // Contexts
    const { tracks, selectedTrackId, setSelectedTrackId, volume: bgVolume, setVolume: setBgVolume } = useBgMusic();
    const { volume: chantVolume, setVolume: setChantVolume } = useBhajan();
    const { milestoneAlerts, setMilestoneAlerts, reminderTime, setReminderTime } = useStats();

    // Local States for new features (Mocking for now as per prompt "Add features without cluttering")
    const [zenPreset, setZenPreset] = useState('custom');
    const [fadeDuration, setFadeDuration] = useState(3);
    const [hapticStrength, setHapticStrength] = useState('medium');

    const colorPresets = [
        { name: 'Default', value: '' },
        { name: 'Gold', value: '#ffd700' },
        { name: 'Saffron', value: '#ff9933' },
        { name: 'Red', value: '#ff4d4d' },
        { name: 'Blue', value: '#4da6ff' },
    ];

    const applyZenPreset = (preset) => {
        setZenPreset(preset);
        if (preset === 'focus') {
            if (immersiveConfig.showName) updateImmersiveConfig('showName');
            if (immersiveConfig.showControls) updateImmersiveConfig('showControls');
        } else if (preset === 'relaxed') {
            if (!immersiveConfig.showName) updateImmersiveConfig('showName');
            if (!immersiveConfig.showControls) updateImmersiveConfig('showControls');
        }
    };

    // Request permissions when enabling features
    const requestNotificationPermission = async () => {
        if ("Notification" in window && Notification.permission !== "granted") {
            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
                alert("Please enable notifications in your browser settings to receive alerts.");
            }
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className="text-gradient" style={{ fontSize: '2rem', fontFamily: 'var(--font-display)' }}>Settings</h1>
                <p className={styles.subtitle}>Customize your spiritual space</p>
            </header>

            {/* 1. APPEARANCE */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Appearance</h2>
                <div className={styles.card}>
                    <div className={styles.row}>
                        <div className={styles.rowContent}>
                            <div className={styles.rowIcon}>{theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}</div>
                            <div className={styles.rowText}>
                                <span className={styles.label}>App Theme</span>
                                <span className={styles.description}>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                            </div>
                        </div>
                        <Toggle active={theme === 'dark'} onToggle={toggleTheme} />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.rowContent}>
                            <div className={styles.rowIcon}><MousePointerClick size={20} /></div>
                            <div className={styles.rowText}>
                                <span className={styles.label}>Floating Text</span>
                                <span className={styles.description}>Visual ripple on tap</span>
                            </div>
                        </div>
                        <Toggle active={floatingAnimations} onToggle={() => setFloatingAnimations(!floatingAnimations)} />
                    </div>

                    {floatingAnimations && (
                        <div className={styles.row} style={{ background: 'var(--color-bg-secondary)' }}>
                            <div className={styles.colorGrid}>
                                {colorPresets.map((c) => (
                                    <button
                                        key={c.name}
                                        className={`${styles.colorBtn} ${floatingTextColor === c.value ? styles.active : ''}`}
                                        style={{ background: c.value || 'var(--color-primary)' }}
                                        onClick={() => setFloatingTextColor(c.value)}
                                        title={c.name}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* 2. NOTIFICATIONS (NEW) */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Notifications</h2>
                <div className={styles.card}>
                    {/* Daily Reminder */}
                    <div className={styles.row}>
                        <div className={styles.rowContent}>
                            <div className={styles.rowIcon}><Clock size={20} /></div>
                            <div className={styles.rowText}>
                                <span className={styles.label}>Daily Reminder</span>
                                <span className={styles.description}>Set a time to practice</span>
                            </div>
                        </div>
                        <input
                            type="time"
                            className={styles.select}
                            value={reminderTime}
                            onChange={(e) => {
                                setReminderTime(e.target.value);
                                requestNotificationPermission();
                            }}
                            style={{ padding: '0.4rem', borderRadius: '8px', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', background: 'var(--color-bg-tertiary)' }}
                        />
                    </div>

                    {/* Milestone Alerts */}
                    <div className={styles.row}>
                        <div className={styles.rowContent}>
                            <div className={styles.rowIcon}><Award size={20} /></div>
                            <div className={styles.rowText}>
                                <span className={styles.label}>Milestone Alerts</span>
                                <span className={styles.description}>Cheer on every 100 counts</span>
                            </div>
                        </div>
                        <Toggle
                            active={milestoneAlerts}
                            onToggle={() => {
                                setMilestoneAlerts(!milestoneAlerts);
                                if (!milestoneAlerts) requestNotificationPermission();
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* 3. SOUND & AMBIENCE */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Sound & Ambience</h2>
                <div className={styles.card}>
                    {/* Bg Music Selector */}
                    <div className={styles.row}>
                        <div className={styles.rowContent}>
                            <div className={styles.rowIcon}><Music size={20} /></div>
                            <div className={styles.rowText}>
                                <span className={styles.label}>Background Music</span>
                            </div>
                        </div>
                        <select
                            className={styles.select}
                            value={selectedTrackId}
                            onChange={(e) => setSelectedTrackId(e.target.value)}
                        >
                            {tracks.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                        </select>
                    </div>

                    {/* Chant Volume */}
                    <div className={styles.row} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '0.5rem' }}>
                            <span className={styles.label}>Chant Volume</span>
                            <span className={styles.description}>{Math.round(chantVolume * 100)}%</span>
                        </div>
                        <input
                            type="range" min="0" max="1" step="0.05"
                            value={chantVolume} onChange={(e) => setChantVolume(parseFloat(e.target.value))}
                            className={styles.slider}
                        />
                    </div>

                    {/* Bg Volume */}
                    {selectedTrackId !== 'none' && (
                        <div className={styles.row} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '0.5rem' }}>
                                <span className={styles.label}>Ambience Volume</span>
                                <span className={styles.description}>{Math.round(bgVolume * 100)}%</span>
                            </div>
                            <input
                                type="range" min="0" max="1" step="0.05"
                                value={bgVolume} onChange={(e) => setBgVolume(parseFloat(e.target.value))}
                                className={styles.slider}
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* 4. ZEN MODE */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Zen Mode</h2>
                <div className={styles.card}>
                    <div className={styles.presetGrid}>
                        <div
                            className={`${styles.presetBtn} ${zenPreset === 'focus' ? styles.active : ''}`}
                            onClick={() => applyZenPreset('focus')}
                        >
                            <Moon size={24} className={styles.presetIcon} />
                            <span className={styles.presetLabel}>Deep Focus</span>
                        </div>
                        <div
                            className={`${styles.presetBtn} ${zenPreset === 'relaxed' ? styles.active : ''}`}
                            onClick={() => applyZenPreset('relaxed')}
                        >
                            <Coffee size={24} className={styles.presetIcon} />
                            <span className={styles.presetLabel}>Relaxed</span>
                        </div>
                        <div
                            className={`${styles.presetBtn} ${zenPreset === 'custom' ? styles.active : ''}`}
                            onClick={() => setZenPreset('custom')}
                        >
                            <Zap size={24} className={styles.presetIcon} />
                            <span className={styles.presetLabel}>Custom</span>
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.rowContent}>
                            <div className={styles.rowText}>
                                <span className={styles.label}>Show Name</span>
                                <span className={styles.description}>In full screen</span>
                            </div>
                        </div>
                        <Toggle
                            active={immersiveConfig.showName}
                            onToggle={() => {
                                updateImmersiveConfig('showName');
                                setZenPreset('custom');
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* 5. ACCESSIBILITY */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Accessibility</h2>
                <div className={styles.card}>
                    <div className={styles.row}>
                        <div className={styles.rowContent}>
                            <div className={styles.rowIcon}><Type size={20} /></div>
                            <div className={styles.rowText}>
                                <span className={styles.label}>Large Text</span>
                            </div>
                        </div>
                        <Toggle active={textSize === 'large'} onToggle={toggleTextSize} />
                    </div>
                    <div className={styles.row}>
                        <div className={styles.rowContent}>
                            <div className={styles.rowIcon}><Eye size={20} /></div>
                            <div className={styles.rowText}>
                                <span className={styles.label}>High Contrast</span>
                            </div>
                        </div>
                        <Toggle active={contrast === 'high'} onToggle={toggleContrast} />
                    </div>
                    <div className={styles.row}>
                        <div className={styles.rowContent}>
                            <div className={styles.rowIcon}><Smartphone size={20} /></div>
                            <div className={styles.rowText}>
                                <span className={styles.label}>Haptic Feedback</span>
                                <span className={styles.description}>{hapticStrength}</span>
                            </div>
                        </div>
                        {/* Mock Toggle for now */}
                        <Toggle
                            active={hapticStrength !== 'off'}
                            onToggle={() => setHapticStrength(hapticStrength === 'off' ? 'medium' : 'off')}
                        />
                    </div>
                </div>
            </section>

            {/* 6. PRIVACY & DATA */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Privacy & Data</h2>
                <div className={styles.card}>
                    <div className={styles.row} onClick={() => alert('Data export started...')} style={{ cursor: 'pointer' }}>
                        <div className={styles.rowContent}>
                            <div className={styles.rowIcon}><Download size={20} /></div>
                            <div className={styles.rowText}>
                                <span className={styles.label}>Export Data</span>
                                <span className={styles.description}>Download your progress</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.row} onClick={() => { if (confirm('Reset all progress?')) localStorage.clear(); }} style={{ cursor: 'pointer' }}>
                        <div className={styles.rowContent}>
                            <div className={styles.rowIcon} style={{ background: 'rgba(255,0,0,0.1)', color: 'red' }}>
                                <Trash2 size={20} />
                            </div>
                            <div className={styles.rowText}>
                                <span className={styles.label} style={{ color: 'red' }}>Reset Progress</span>
                                <span className={styles.description}>Clear local data</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. ABOUT & SOCIAL */}
            <section className={styles.section}>
                <div className={styles.aboutCard}>
                    <div className={styles.socialRow}>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><Youtube size={24} /></a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><Instagram size={24} /></a>
                        <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><Send size={24} /></a>
                        <a href="https://features.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><Globe size={24} /></a>
                    </div>
                    <p className={styles.version}>Divine Name v1.0.0</p>
                    <div className={styles.devotion}>
                        <Heart size={12} style={{ display: 'inline', marginRight: '4px', fill: 'currentColor' }} />
                        Made with devotion
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Settings;
