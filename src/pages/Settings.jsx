import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Type, Eye, Palette, Maximize2 } from 'lucide-react';
import Button from '../components/ui/Button';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const Settings = () => {
    useDocumentTitle('Settings | Divine Name');
    const {
        theme, toggleTheme,
        textSize, toggleTextSize,
        contrast, toggleContrast,
        immersiveConfig, updateImmersiveConfig
    } = useTheme();

    return (
        <div className="container" style={{ maxWidth: '600px', padding: '2rem 1rem' }}>
            <h1 className="text-gradient" style={{ marginBottom: '2rem', fontSize: '2rem', fontFamily: 'var(--font-display)' }}>
                Appearance & Accessibility
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Theme Toggle */}
                <div className="card" style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Palette size={24} color="var(--color-primary)" />
                            <div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Color Theme</h3>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                                </p>
                            </div>
                        </div>
                        <Button onClick={toggleTheme} variant="secondary">
                            Toggle
                        </Button>
                    </div>
                </div>

                {/* Text Size */}
                <div className="card" style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Type size={24} color="var(--color-primary)" />
                            <div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Large Text</h3>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                    {textSize === 'large' ? 'Enabled' : 'Disabled'}
                                </p>
                            </div>
                        </div>
                        <Button onClick={toggleTextSize} variant="secondary">
                            {textSize === 'large' ? 'Disable' : 'Enable'}
                        </Button>
                    </div>
                </div>

                {/* High Contrast */}
                <div className="card" style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Eye size={24} color="var(--color-primary)" />
                            <div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>High Contrast</h3>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                    {contrast === 'high' ? 'High Contrast' : 'Standard'}
                                </p>
                            </div>
                        </div>
                        <Button onClick={toggleContrast} variant="secondary">
                            {contrast === 'high' ? 'Disable' : 'Enable'}
                        </Button>
                    </div>
                </div>

                <h2 className="text-gradient" style={{ marginTop: '1rem', marginBottom: '1rem', fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>
                    Zen Mode
                </h2>

                {/* Zen Mode Settings */}
                <div className="card" style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <Maximize2 size={24} color="var(--color-primary)" />
                        <div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Full Screen Preferences</h3>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Customize what you see in Zen Mode</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Show Name</span>
                            <Button onClick={() => updateImmersiveConfig('showName')} variant="ghost" size="sm">
                                {immersiveConfig.showName ? 'Visible' : 'Hidden'}
                            </Button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Show Controls</span>
                            <Button onClick={() => updateImmersiveConfig('showControls')} variant="ghost" size="sm">
                                {immersiveConfig.showControls ? 'Visible' : 'Hidden'}
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Settings;
