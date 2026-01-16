import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useName } from '../context/NameContext';
import { Target, Music, Zap, Heart, Star, LayoutGrid } from 'lucide-react';
import styles from './Counters.module.css';

const Counters = () => {
    const navigate = useNavigate();
    const { updateName, allNames } = useName();

    const presets = [
        {
            id: '108_counter',
            title: '108 Mala Count',
            subtitle: 'Traditional Practice',
            icon: <Target size={32} color="#FFD700" />, // Gold
            color: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            action: () => {
                localStorage.setItem('divine_target', '108');
                navigate('/');
            }
        },
        {
            id: 'radha_counter',
            title: 'Radha Radha',
            subtitle: 'Divine Love Chant',
            icon: <Heart size={32} color="#ff4d4d" />, // Red
            color: 'linear-gradient(135deg, #2a0a0a 0%, #3d1414 100%)',
            action: () => {
                updateName('radha');
                localStorage.setItem('divine_target', '0'); // Unlimited
                navigate('/');
            }
        },
        {
            id: 'krishna_counter',
            title: 'Hare Krishna',
            subtitle: 'Eternal Joy',
            icon: <Music size={32} color="#4da6ff" />, // Blue
            color: 'linear-gradient(135deg, #0a1a2a 0%, #14283d 100%)',
            action: () => {
                updateName('krishna');
                localStorage.setItem('divine_target', '0');
                navigate('/');
            }
        },
        {
            id: 'ram_counter',
            title: 'Ram Ram',
            subtitle: 'Strength & Virtue',
            icon: <Zap size={32} color="#ff9933" />, // Saffron
            color: 'linear-gradient(135deg, #2a1a0a 0%, #3d2814 100%)',
            action: () => {
                updateName('ram');
                localStorage.setItem('divine_target', '0');
                navigate('/');
            }
        },
        {
            id: 'jai_shri_ram_counter',
            title: 'Jai Shri Ram',
            subtitle: 'Power & Devotion',
            icon: <Star size={32} color="#ff9933" />,
            color: 'linear-gradient(135deg, #2a1a0a 0%, #3d2814 100%)',
            action: () => {
                updateName('jai_shri_ram');
                localStorage.setItem('divine_target', '0');
                navigate('/');
            }
        },
        {
            id: 'custom_counter',
            title: 'Zen Mode',
            subtitle: 'Focus & Silence',
            icon: <LayoutGrid size={32} color="#e0e0e0" />,
            color: 'linear-gradient(135deg, #1f1f1f 0%, #333 100%)',
            action: () => {
                // Just go home, keep settings as is
                navigate('/');
            }
        }
    ];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className="text-gradient" style={{ fontSize: '2rem', fontFamily: 'var(--font-display)' }}>Name Counter Tools</h1>
                <p className={styles.subtitle}>Choose your spiritual practice tool</p>
            </header>

            <div className={styles.grid}>
                {presets.map((preset) => (
                    <div
                        key={preset.id}
                        className={styles.card}
                        style={{ background: preset.color }}
                        onClick={preset.action}
                    >
                        <div className={styles.cardIcon}>
                            {preset.icon}
                        </div>
                        <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>{preset.title}</h3>
                            <p className={styles.cardSubtitle}>{preset.subtitle}</p>
                        </div>
                        <div className={styles.arrowIcon}>→</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Counters;
