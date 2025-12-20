import React, { useState } from 'react';
import { useStats } from '../../context/StatsContext';
import { Share2, Lock, X, Award } from 'lucide-react';
import styles from './Badges.module.css';
import { AnimatePresence, motion } from 'framer-motion';

const Badges = () => {
    const { achievements, unlockedAchievements, totalCount } = useStats();
    const [toastMsg, setToastMsg] = useState('');
    const [selectedBadge, setSelectedBadge] = useState(null);

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(''), 2500);
    };

    // Calculate Progress
    const totalAchievements = achievements.length;
    const unlockedCount = unlockedAchievements.length;
    const progressPercent = (unlockedCount / totalAchievements) * 100;

    // Group by Category
    const categories = achievements.reduce((acc, ach) => {
        const cat = ach.category || 'General';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(ach);
        return acc;
    }, {});

    const orderedCategories = ['Beginner', 'Consistency', 'Spiritual Depth'];

    const handleShare = async (achievement) => {
        if (!achievement) {
            // Share General Stats
            const text = `I've completed ${totalCount} chants on Divine Name! ✨ Unlocked ${unlockedCount}/${totalAchievements} achievements. Share your devotion. 🙏 #DivineName #Bhakti`;
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'Divine Name Progress',
                        text: text,
                        url: window.location.href
                    });
                } catch (err) { }
            } else {
                navigator.clipboard.writeText(text);
                showToast('Progress copied to clipboard!');
            }
            return;
        }

        // Share Specific Achievement
        const text = `I just unlocked the '${achievement.label}' achievement on Divine Name! 🌟 "${achievement.desc}" Ram Ram! 🙏 #DivineName #Bhakti`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'New Achievement Unlocked!',
                    text: text,
                    url: window.location.href
                });
            } catch (err) { }
        } else {
            navigator.clipboard.writeText(text);
            showToast('Achievement copied for sharing!');
        }
    };

    return (
        <div className={styles.badgesContainer}>
            <div className={styles.header}>
                <h2 className={styles.title}>Your Journey</h2>

                <div className={styles.progressContainer}>
                    <div className={styles.progressBarTrack}>
                        <div
                            className={styles.progressBarFill}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <div className={styles.progressLabel}>
                        {unlockedCount} of {totalAchievements} Milestones Unlocked
                    </div>
                </div>

                <button className={styles.shareGlobalBtn} onClick={() => handleShare(null)}>
                    <Share2 size={14} /> Share your devotion ✨
                </button>
            </div>

            <div className={styles.badgesList}>
                {orderedCategories.map(cat => {
                    const categoryAchievements = categories[cat];
                    if (!categoryAchievements) return null;

                    return (
                        <div key={cat} className={styles.categorySection}>
                            <h3 className={styles.categoryTitle}>{cat}</h3>
                            <div className={styles.categoryGrid}>
                                {categoryAchievements.map((ach) => {
                                    const isUnlocked = unlockedAchievements.includes(ach.id);
                                    return (
                                        <motion.div
                                            key={ach.id}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`${styles.badge} ${isUnlocked ? styles.badgeUnlocked : styles.badgeLocked}`}
                                            onClick={() => setSelectedBadge({ ...ach, isUnlocked })}
                                        >
                                            <div className={styles.icon}>{ach.icon}</div>
                                            <span className={styles.label}>{ach.label}</span>
                                            {isUnlocked && <div className={styles.shareHint}><Share2 size={12} /></div>}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Detail Popup */}
            <AnimatePresence>
                {selectedBadge && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.popupOverlay}
                        onClick={() => setSelectedBadge(null)}
                    >
                        <motion.div
                            className={`${styles.popupContent} ${selectedBadge.isUnlocked ? styles.unlocked : ''}`}
                            onClick={e => e.stopPropagation()}
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                        >
                            <button className={styles.closeBtn} onClick={() => setSelectedBadge(null)}>
                                <X size={24} />
                            </button>

                            <div className={styles.popupIcon}>{selectedBadge.icon}</div>
                            <h3 className={styles.popupTitle}>{selectedBadge.label}</h3>
                            <p className={styles.popupDesc}>{selectedBadge.desc}</p>

                            {!selectedBadge.isUnlocked ? (
                                <div className={styles.popupCondition}>
                                    <Lock size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
                                    {selectedBadge.condition || 'Keep chanting to unlock!'}
                                </div>
                            ) : (
                                <button
                                    className={styles.shareGlobalBtn}
                                    style={{ margin: '0 auto', background: 'rgba(255,215,0,0.15)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.3)' }}
                                    onClick={() => { handleShare(selectedBadge); setSelectedBadge(null); }}
                                >
                                    <Share2 size={16} /> Share Achievement
                                </button>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {toastMsg && <div className={styles.toast}>{toastMsg}</div>}
        </div>
    );
};

export default Badges;
