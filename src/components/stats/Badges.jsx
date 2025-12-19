import React, { useState } from 'react';
import { useStats } from '../../context/StatsContext';
import { Share2 } from 'lucide-react';
import styles from './Badges.module.css';

const Badges = () => {
    const { achievements, unlockedAchievements, totalCount } = useStats();
    const [toastMsg, setToastMsg] = useState('');

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(''), 2500);
    };

    const handleShare = async (achievement) => {
        if (!achievement) {
            // Share General Stats
            const text = `I've completed ${totalCount} chants on Divine Name! Just unlocked ${unlockedAchievements.length} achievements. Ram Ram! 🙏 #DivineName #Bhakti`;
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'Divine Name Counter',
                        text: text,
                        url: window.location.href
                    });
                } catch (err) {
                    // ignore abort
                }
            } else {
                navigator.clipboard.writeText(text);
                showToast('Stats copied to clipboard!');
            }
            return;
        }

        // Share Specific Achievement
        const text = `I just unlocked the '${achievement.label}' achievement on Divine Name Counter! 🌟 ${achievement.desc}. Ram Ram! 🙏 #DivineName #Bhakti`;

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
                <h2 className={styles.title}>Your Achievements</h2>
                <p className={styles.subtitle}>
                    Unlocked: {unlockedAchievements.length} / {achievements.length}
                </p>
                <button className={styles.shareGlobalBtn} onClick={() => handleShare(null)}>
                    <Share2 size={14} /> Share Progress
                </button>
            </div>

            <div className={styles.grid}>
                {achievements.map((ach) => {
                    const isUnlocked = unlockedAchievements.includes(ach.id);
                    return (
                        <div
                            key={ach.id}
                            className={`${styles.badge} ${isUnlocked ? styles.badgeUnlocked : styles.badgeLocked}`}
                            title={isUnlocked ? "Click to Share" : ach.desc}
                            onClick={() => isUnlocked && handleShare(ach)}
                        >
                            <div className={styles.icon}>{ach.icon}</div>
                            <span className={styles.label}>{ach.label}</span>
                            <div className={styles.desc}>{ach.desc}</div>
                            {isUnlocked && <div className={styles.shareHint}><Share2 size={12} /></div>}
                        </div>
                    );
                })}
            </div>
            {toastMsg && <div className={styles.toast}>{toastMsg}</div>}
        </div>
    );
};

export default Badges;
