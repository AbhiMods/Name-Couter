import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useName } from '../context/NameContext';
import { Target, Music, Zap, Heart, Star, LayoutGrid, Sun, Moon, Sparkles, Feather, Flame, Flower, Pin, Calendar as CalendarIcon, BookOpen } from 'lucide-react';
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
            'krishna': <Feather size={28} color="#4da6ff" />,
            'jai_shri_ram': <Star size={28} color="#ff9933" />,
            'om_namah_shivaya': <Moon size={28} color="#E0E0E0" />,
            'ganesh': <Flower size={28} color="#FFD700" />,
            'hanuman': <Flame size={28} color="#ff5722" />,
            'gayatri': <Sun size={28} color="#FFD700" />,
            'vasudevaya': <Sparkles size={28} color="#4da6ff" />,
            'durga': <Target size={28} color="#ff0000" />,
            'om': <Music size={28} color="#fff" />,
            'guru': <Sparkles size={28} color="#FFA500" />,
        };
        return icons[id] || <Sparkles size={28} color="#fff" />;
    };

    const getGradientForId = (id) => {
        const gradients = {
            'ram': 'linear-gradient(135deg, rgba(255, 153, 51, 0.1) 0%, rgba(255, 153, 51, 0.02) 100%)',
            'radha': 'linear-gradient(135deg, rgba(255, 77, 77, 0.1) 0%, rgba(255, 77, 77, 0.02) 100%)',
            'krishna': 'linear-gradient(135deg, rgba(77, 166, 255, 0.1) 0%, rgba(77, 166, 255, 0.02) 100%)',
            'om_namah_shivaya': 'linear-gradient(135deg, rgba(200, 200, 255, 0.1) 0%, rgba(200, 200, 255, 0.02) 100%)',
            'ganesh': 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.02) 100%)',
            'default': 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)'
        };
        return gradients[id] || gradients['default'];
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
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
            localStorage.setItem('divine_target', '0');
        }
        navigate('/radha-naam-jap-counter');
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
                newPinned = [id, ...prev];
            }
            localStorage.setItem('pinned_mantras', JSON.stringify(newPinned));
            return newPinned;
        });
    };

    const handleCardClick = (item) => {
        if (item.link) {
            navigate(item.link);
        } else {
            handleSelect(item.id);
        }
    };

    // Combine all pinnable items
    const allItems = [
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
            id: 'hare_krishna',
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
        ...allNames.map(item => ({
            ...item,
            icon: null,
            bg: getGradientForId(item.id)
        }))
    ];

    const sortedItems = [...allItems].sort((a, b) => {
        const isAPinned = pinnedIds.includes(a.id);
        const isBPinned = pinnedIds.includes(b.id);
        if (isAPinned && !isBPinned) return -1;
        if (!isAPinned && isBPinned) return 1;
        return 0;
    });
    const today = new Date();
    const dayName = today.toLocaleDateString('en-US', { weekday: 'short' });
    const dateNum = today.getDate();

    /* ... */

    return (
        <div className={styles.container}>
            {/* Dynamic Banner Carousel */}
            <BannerCarousel />

            {/* Quick Access Row - iOS Style */}
            <div className={styles.quickAccessRow}>
                {/* 1. Calendar App Icon */}
                <Link to="/calendar" className={styles.quickAccessItem}>
                    <div className={clsx(styles.appIconBox, styles.calendarBox)}>
                        <div className={styles.calendarHeader}>
                            <span className={styles.calendarDay}>{dayName}</span>
                        </div>
                        <div className={styles.calendarBody}>
                            <span className={styles.calendarDate}>{dateNum}</span>
                        </div>
                    </div>
                    <span className={styles.quickAccessLabel}>Calendar</span>
                </Link>

                {/* 2. Bhajan App Icon */}
                <Link to="/bhajan" className={styles.quickAccessItem}>
                    <div className={styles.appIconBox}>
                        <Music size={32} color="#FF5722" fill="#FF5722" fillOpacity={0.2} />
                    </div>
                    <span className={styles.quickAccessLabel}>Bhajan</span>
                </Link>

                {/* 3. Prarthana App Icon */}
                <Link to="/library" className={styles.quickAccessItem}>
                    <div className={styles.appIconBox}>
                        <BookOpen size={32} color="#2196F3" fill="#2196F3" fillOpacity={0.2} />
                    </div>
                    <span className={styles.quickAccessLabel}>Prarthana</span>
                </Link>

                {/* 4. Japa App Icon (New) */}
                <Link to="/radha-naam-jap-counter" className={styles.quickAccessItem}>
                    <div className={styles.appIconBox}>
                        <Sparkles size={32} color="#4CAF50" fill="#4CAF50" fillOpacity={0.2} />
                    </div>
                    <span className={styles.quickAccessLabel}>Japa</span>
                </Link>
            </div>



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
