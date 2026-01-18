import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useName } from '../context/NameContext';
import { Target, Music, Zap, Heart, Star, LayoutGrid, Sun, Moon, Sparkles, Feather, Flame, Flower } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './Counters.module.css';
import BannerCarousel from '../components/common/BannerCarousel';

const Counters = () => {
    const navigate = useNavigate();
    const { updateName, allNames } = useName();

    // Mapping icons to IDs for visual variety
    const getIconForId = (id) => {
        const icons = {
            'ram': <Zap size={28} color="#ff9933" />,
            'radha': <Heart size={28} color="#ff4d4d" />,
            'krishna': <Feather size={28} color="#4da6ff" />, // Feather for Krishna
            'jai_shri_ram': <Star size={28} color="#ff9933" />,
            'om_namah_shivaya': <Moon size={28} color="#E0E0E0" />, // Moon for Shiva
            'ganesh': <Flower size={28} color="#FFD700" />, // Flower/Modak
            'hanuman': <Flame size={28} color="#ff5722" />,
            'gayatri': <Sun size={28} color="#FFD700" />,
            'vasudevaya': <Sparkles size={28} color="#4da6ff" />,
            'durga': <Target size={28} color="#ff0000" />, // Power
            'om': <Music size={28} color="#fff" />,
            'guru': <Sparkles size={28} color="#FFA500" />,
        };
        return icons[id] || <Sparkles size={28} color="#fff" />;
    };

    const getGradientForId = (id) => {
        // Subtle gradients for cards
        const gradients = {
            'ram': 'linear-gradient(135deg, rgba(255, 153, 51, 0.1) 0%, rgba(255, 153, 51, 0.02) 100%)',
            'radha': 'linear-gradient(135deg, rgba(255, 77, 77, 0.1) 0%, rgba(255, 77, 77, 0.02) 100%)',
            'krishna': 'linear-gradient(135deg, rgba(77, 166, 255, 0.1) 0%, rgba(77, 166, 255, 0.02) 100%)',
            'om_namah_shivaya': 'linear-gradient(135deg, rgba(200, 200, 255, 0.1) 0%, rgba(200, 200, 255, 0.02) 100%)',
            'ganesh': 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.02) 100%)',
            // Default dark glass
            'default': 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)'
        };
        return gradients[id] || gradients['default'];
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 300, damping: 24 }
        }
    };

    const handleSelect = (id) => {
        if (id === '108_counter') {
            localStorage.setItem('divine_target', '108');
        } else {
            updateName(id);
            localStorage.setItem('divine_target', '0'); // Default to unlimited for specific mantras
        }
        navigate('/radha-naam-jap-counter');
    };

    // Special Card for 108 Counters (Standard Practice)
    const malaCard = {
        id: '108_counter',
        label: '108 Mala Practice',
        subtitle: 'Traditional Counting',
        hindiText: '१०८',
        special: true
    };

    return (
        <div className={styles.container}>
            {/* Dynamic Banner Carousel */}
            <BannerCarousel />

            <header className={styles.header}>
                <motion.h1
                    className={styles.title}
                    style={{ fontSize: '1.75rem', marginTop: '0.5rem', marginBottom: '0.25rem' }} // Smaller title as requested
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Choose Your Chant
                </motion.h1>
                <motion.p
                    className={styles.subtitle}
                    style={{ fontSize: '0.95rem' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    Select a deity or mantra to begin your spiritual journey.
                </motion.p>
            </header>

            <motion.div
                className={styles.grid}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* 108 Mala Special Card */}
                <motion.div
                    className={styles.card}
                    variants={itemVariants}
                    onClick={() => handleSelect(malaCard.id)}
                    style={{ background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.05) 100%)', border: '1px solid rgba(255, 215, 0, 0.2)' }}
                >
                    <div className={styles.hindiText}>{malaCard.hindiText}</div>
                    <div className={styles.cardIcon} style={{ background: 'rgba(255, 215, 0, 0.2)', color: '#FFD700' }}>
                        <Target size={32} />
                    </div>
                    <div className={styles.cardContent}>
                        <h3 className={styles.cardTitle}>{malaCard.label}</h3>
                        <p className={styles.cardSubtitle}>{malaCard.subtitle}</p>
                    </div>
                    <div className={styles.arrowIcon}>→</div>
                </motion.div>

                {/* All Mantras */}
                {allNames.map((item) => (
                    <motion.div
                        key={item.id}
                        className={styles.card}
                        variants={itemVariants}
                        onClick={() => handleSelect(item.id)}
                        style={{ background: getGradientForId(item.id) }}
                    >
                        {item.hindiText && <div className={styles.hindiText}>{item.hindiText}</div>}

                        <div className={styles.cardIcon}>
                            {getIconForId(item.id)}
                        </div>

                        <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>{item.label}</h3>
                            <p className={styles.cardSubtitle}>{item.subtitle}</p>
                        </div>

                        <div className={styles.arrowIcon}>→</div>
                    </motion.div>
                ))}

                {/* Zen Mode / Custom Placeholder */}
                <motion.div
                    className={styles.card}
                    variants={itemVariants}
                    onClick={() => navigate('/radha-naam-jap-counter')}
                    style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)' }}
                >
                    <div className={styles.cardIcon}>
                        <LayoutGrid size={28} color="#e0e0e0" />
                    </div>
                    <div className={styles.cardContent}>
                        <h3 className={styles.cardTitle}>Zen Mode</h3>
                        <p className={styles.cardSubtitle}>Just Focus (No Preset)</p>
                    </div>
                    <div className={styles.arrowIcon}>→</div>
                </motion.div>

            </motion.div>
        </div>
    );
};

export default Counters;
