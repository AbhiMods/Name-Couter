import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Play, LogOut } from 'lucide-react';
import styles from './SessionSummary.module.css';

const MESSAGES = [
    "🙏 Today’s chanting session is complete",
    "You spent a few peaceful moments in devotion",
    "May peace stay with you today",
    "Your devotion brings light to the world",
    "Chanting cleanses the dust from the heart"
];

const SessionSummary = ({ count, duration, onContinue, onEnd }) => {
    const message = React.useMemo(() => MESSAGES[Math.floor(Math.random() * MESSAGES.length)], []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.overlay}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={styles.summaryCard}
            >
                <div className={styles.iconWrapper}>
                    <CheckCircle2 size={32} />
                </div>

                <div>
                    <h2 className={styles.title}>Session Complete</h2>
                    <p className={styles.message}>{message}</p>
                </div>

                <div className={styles.statsGrid}>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Chants</span>
                        <span className={styles.statValue}>{count}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Duration</span>
                        <span className={styles.statValue}>{duration}</span>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button onClick={onContinue} className={`${styles.actionButton} ${styles.primaryAction}`}>
                        <Play size={20} fill="currentColor" />
                        Continue Chanting
                    </button>
                    <button onClick={onEnd} className={styles.destructiveAction}>
                        <LogOut size={20} />
                        End Session
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default SessionSummary;
