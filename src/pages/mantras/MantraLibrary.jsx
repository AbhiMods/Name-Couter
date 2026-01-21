import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Flame, Sun, ChevronRight } from 'lucide-react';
import styles from '../Counters.module.css'; // Reusing existing styles for consistency

const MantraLibrary = () => {
    const navigate = useNavigate();

    const mantras = [
        {
            id: 'hanuman-chalisa',
            title: 'Hanuman Chalisa',
            subtitle: 'Shree Guru Charan Saroj Raj...',
            icon: Flame,
            link: '/hanuman-chalisa',
            color: '#ff5722', // Orange
            bgGradient: 'linear-gradient(135deg, rgba(255, 87, 34, 0.1) 0%, rgba(255, 87, 34, 0.02) 100%)'
        },
        {
            id: 'gayatri-mantra',
            title: 'Gayatri Mantra',
            subtitle: 'Om Bhur Bhuva Swaha...',
            icon: Sun,
            link: '/gayatri-mantra',
            color: '#FFD700', // Gold
            bgGradient: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.02) 100%)'
        }
    ];

    return (
        <div className={styles.container}>
            <header className={styles.header} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <button 
                    onClick={() => navigate(-1)}
                    style={{
                        position: 'absolute',
                        left: 0,
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-primary)',
                        cursor: 'pointer',
                        padding: '0.5rem'
                    }}
                >
                    <ArrowLeft size={24} />
                </button>
                <motion.h1
                    className={styles.title}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ fontSize: '2rem', marginBottom: 0 }}
                >
                    Mantra Library
                </motion.h1>
            </header>

            <motion.div 
                className={styles.grid}
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
            >
                {mantras.map((mantra) => (
                    <motion.div
                        key={mantra.id}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                    >
                        <Link to={mantra.link} style={{ textDecoration: 'none' }}>
                            <div
                                className={styles.card}
                                style={{
                                    background: mantra.bgGradient,
                                    minHeight: '120px'
                                }}
                            >
                                <div className={styles.cardIcon} style={{ background: 'rgba(255,255,255,0.1)' }}>
                                    <mantra.icon size={28} color={mantra.color} />
                                </div>
                                <div className={styles.cardContent}>
                                    <h3 className={styles.cardTitle}>{mantra.title}</h3>
                                    <p className={styles.cardSubtitle}>{mantra.subtitle}</p>
                                </div>
                                <div className={styles.arrowIcon}>
                                    <ChevronRight size={18} />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default MantraLibrary;
