import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useName } from '../context/NameContext';
import { Target, Music, Zap, Heart, Star, LayoutGrid, Sun, Moon, Sparkles, Feather, Flame, Flower, Pin } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './Counters.module.css';
import BannerCarousel from '../components/common/BannerCarousel';
import clsx from 'clsx';

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

    const [pinnedIds, setPinnedIds] = React.useState(() => {
        const saved = localStorage.getItem('pinned_mantras');
        return saved ? JSON.parse(saved) : [];
    });

    const togglePin = (e, id) => {
        e.stopPropagation();
        setPinnedIds(prev => {
            const isPinned = prev.includes(id);
            let newPinned;
            if (isPinned) {
                newPinned = prev.filter(p => p !== id);
            } else {
                newPinned = [id, ...prev]; // Add to top
            }
            localStorage.setItem('pinned_mantras', JSON.stringify(newPinned));
            return newPinned;
        });
    };

    // Sort names: Pinned first, then original order
    const sortedNames = [...allNames].sort((a, b) => {
        const isAPinned = pinnedIds.includes(a.id);
        const isBPinned = pinnedIds.includes(b.id);
        if (isAPinned && !isBPinned) return -1;
        if (!isAPinned && isBPinned) return 1;
        return 0; // Maintain original relative order
    });

    // Combine all pinnable items
    const allItems = [
        // Special Cards
        {
            id: '108_counter',
            label: '108 Mala Practice',
            subtitle: 'Traditional Counting',
            hindiText: '१०८',
            special: true,
            icon: Target,
            color: '#FFD700',
            bg: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.05) 100%)',
            border: '1px solid rgba(255, 215, 0, 0.2)',
            iconBg: 'rgba(255, 215, 0, 0.2)'
        },
        {
            id: 'hare_krishna', // Changed to consistent ID for pinning logic
            label: 'Hare Krishna',
            subtitle: 'Maha Mantra Counter',
            hindiText: 'हरे कृष्ण',
            special: true,
            icon: Feather,
            color: '#4da6ff',
            bg: 'linear-gradient(135deg, rgba(77, 166, 255, 0.15) 0%, rgba(77, 166, 255, 0.05) 100%)',
            border: '1px solid rgba(77, 166, 255, 0.2)',
            iconBg: 'rgba(77, 166, 255, 0.2)',
            link: '/hare-krishna-naam-jap-counter'
        },
        // Standard Mantras
        ...allNames.map(item => ({
            ...item,
            icon: null, // Will use getIconForId
            bg: getGradientForId(item.id)
        }))
    ];

    // Sort items: Pinned first, then original order
    const sortedItems = [...allItems].sort((a, b) => {
        const isAPinned = pinnedIds.includes(a.id);
        const isBPinned = pinnedIds.includes(b.id);
        if (isAPinned && !isBPinned) return -1;
        if (!isAPinned && isBPinned) return 1;
        return 0;
    });

    const handleCardClick = (item) => {
        if (item.link) {
            navigate(item.link);
        } else {
            handleSelect(item.id);
        }
    };

    return (
        <div className={styles.container}>
            {/* Dynamic Banner Carousel */}
            <BannerCarousel />

            <header className={styles.header}>
                <motion.h1
                    className={styles.title}
                    style={{ fontSize: '1.75rem', marginTop: '0.5rem', marginBottom: '0.25rem' }}
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
                {sortedItems.map((item) => {
                    const isPinned = pinnedIds.includes(item.id);
                    const ItemIcon = item.icon; // For special cards that define it directly

                    return (
                        <motion.div
                            layout
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            key={item.id}
                            className={styles.card}
                            variants={itemVariants}
                            onClick={() => handleCardClick(item)}
                            style={{
                                background: item.bg,
                                border: item.border || '1px solid var(--color-border)'
                            }}
                        >
                            <button
                                className={clsx(styles.pinButton, isPinned && styles.pinned)}
                                onClick={(e) => togglePin(e, item.id)}
                                title={isPinned ? "Unpin Mantra" : "Pin to Top"}
                            >
                                <Pin size={16} fill={isPinned ? "currentColor" : "none"} />
                            </button>

                            {item.hindiText && <div className={styles.hindiText}>{item.hindiText}</div>}

                            <div className={styles.cardIcon} style={item.iconBg ? { background: item.iconBg, color: item.color } : {}}>
                                {ItemIcon ? <ItemIcon size={32} /> : getIconForId(item.id)}
                            </div>

                            <div className={styles.cardContent}>
                                <h3 className={styles.cardTitle}>{item.label}</h3>
                                <p className={styles.cardSubtitle}>{item.subtitle}</p>
                            </div>

                            <div className={styles.arrowIcon}>→</div>
                        </motion.div>
                    );
                })}

                {/* Zen Mode / Custom Placeholder (Always Last, Unpinnable) */}
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
