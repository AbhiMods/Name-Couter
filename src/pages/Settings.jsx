import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Type, Eye, Palette, Maximize2, TrendingUp } from 'lucide-react';
import styles from './Home.module.css'; // Reusing sectionTitle style if exists or I'll add new
import Button from '../components/ui/Button';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const Settings = () => {
    useDocumentTitle('Settings | Divine Name');
    const {
        theme, toggleTheme,
        textSize, toggleTextSize,
        contrast, toggleContrast,
        immersiveConfig, updateImmersiveConfig,
        floatingAnimations, setFloatingAnimations,
        floatingTextColor, setFloatingTextColor
    } = useTheme();

    const colorPresets = [
        { name: 'Default', value: '' },
        { name: 'Gold', value: '#ffd700' },
        { name: 'Saffron', value: '#ff9933' },
        { name: 'Deep Red', value: '#8b0000' },
        { name: 'Indigo', value: '#4b0082' },
        { name: 'Divine White', value: '#ffffff' },
    ];

    return (
        <div className="container" style={{ maxWidth: '600px', padding: '2rem 1rem' }}>
            <h1 className="text-gradient" style={{ marginBottom: '2rem', fontSize: '2rem', fontFamily: 'var(--font-display)' }}>
                Settings
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* SECTION: Appearance */}
                <div>
                    <h2 className={styles.sectionTitle}>Appearance</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Theme Toggle */}
                        <div className="card" style={{ padding: '1.25rem', background: 'var(--color-bg-secondary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <Palette size={20} color="var(--color-primary)" />
                                    <div>
                                        <h3 style={{ fontSize: '1rem', margin: 0 }}>Theme</h3>
                                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
                                    </div>
                                </div>
                                <Button onClick={toggleTheme} variant="secondary" size="sm">Toggle</Button>
                            </div>
                        </div>

                        {/* Floating Text Animation */}
                        <div className="card" style={{ padding: '1.25rem', background: 'var(--color-bg-secondary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: floatingAnimations ? '1rem' : 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <TrendingUp size={20} color="var(--color-primary)" />
                                    <div>
                                        <h3 style={{ fontSize: '1rem', margin: 0 }}>Floating Text</h3>
                                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Visual feedback on click</p>
                                    </div>
                                </div>
                                <Button onClick={() => setFloatingAnimations(!floatingAnimations)} variant="secondary" size="sm">
                                    {floatingAnimations ? 'On' : 'Off'}
                                </Button>
                            </div>
                            {floatingAnimations && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    {colorPresets.map((c) => (
                                        <button
                                            key={c.name}
                                            onClick={() => setFloatingTextColor(c.value)}
                                            style={{
                                                width: '28px',
                                                height: '28px',
                                                borderRadius: '50%',
                                                border: floatingTextColor === c.value ? '2px solid white' : 'none',
                                                background: c.value || 'var(--color-primary)',
                                                cursor: 'pointer'
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* SECTION: Zen/Focus Mode */}
                <div>
                    <h2 className={styles.sectionTitle}>Zen Mode</h2>
                    <div className="card" style={{ padding: '1.25rem', background: 'var(--color-bg-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                            <Maximize2 size={20} color="var(--color-primary)" />
                            <div>
                                <h3 style={{ fontSize: '1rem', margin: 0 }}>Full Screen Prefs</h3>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Visibility during deep focus</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.9rem' }}>Show Name</span>
                                <Button onClick={() => updateImmersiveConfig('showName')} variant="ghost" size="sm">
                                    {immersiveConfig.showName ? 'Visible' : 'Hidden'}
                                </Button>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.9rem' }}>Show Controls</span>
                                <Button onClick={() => updateImmersiveConfig('showControls')} variant="ghost" size="sm">
                                    {immersiveConfig.showControls ? 'Visible' : 'Hidden'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION: Accessibility */}
                <div>
                    <h2 className={styles.sectionTitle}>Accessibility</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="card" style={{ padding: '1.25rem', background: 'var(--color-bg-secondary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <Type size={20} color="var(--color-primary)" />
                                    <div>
                                        <h3 style={{ fontSize: '1rem', margin: 0 }}>Large Text</h3>
                                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Enhanced legibility</p>
                                    </div>
                                </div>
                                <Button onClick={toggleTextSize} variant="secondary" size="sm">
                                    {textSize === 'large' ? 'Disable' : 'Enable'}
                                </Button>
                            </div>
                        </div>
                        <div className="card" style={{ padding: '1.25rem', background: 'var(--color-bg-secondary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <Eye size={20} color="var(--color-primary)" />
                                    <div>
                                        <h3 style={{ fontSize: '1rem', margin: 0 }}>High Contrast</h3>
                                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Maximum visibility</p>
                                    </div>
                                </div>
                                <Button onClick={toggleContrast} variant="secondary" size="sm">
                                    {contrast === 'high' ? 'Disable' : 'Enable'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION: Feedback/About */}
                <div>
                    <h2 className={styles.sectionTitle}>About</h2>
                    <div className="card" style={{ padding: '1.25rem', background: 'var(--color-bg-secondary)', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                            Divine Name version 1.0.0
                        </p>
                        <Button variant="ghost" size="sm" style={{ width: '100%' }}>Send Feedback</Button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Settings;
