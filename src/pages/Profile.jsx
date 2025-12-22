import React from 'react';
import { Award, Calendar, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStats } from '../context/StatsContext';
import { useName } from '../context/NameContext';
import styles from './Profile.module.css';

const Profile = () => {
    const { user } = useAuth();
    const { totalCount, todayCount, achievements, unlockedAchievements } = useStats();
    const { selectedName } = useName();

    return (
        <div className={styles.profileContainer}>
            <header className={styles.header}>
                <div className={styles.welcome}>Om Shanti,</div>
                <h1 className={styles.username}>{user?.name || 'Seeker'}</h1>
                <div className={styles.email} style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
                    {user?.email}
                </div>
                <div className={styles.activeName}>
                    Currently Chanting: <strong>{selectedName.label}</strong>
                </div>
            </header>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>{todayCount.toLocaleString()}</div>
                    <div className={styles.statLabel}>Today's Chants</div>
                    <Activity size={16} style={{ marginTop: 'auto', opacity: 0.5 }} />
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statValue}>{totalCount.toLocaleString()}</div>
                    <div className={styles.statLabel}>Lifetime Total</div>
                    <Calendar size={16} style={{ marginTop: 'auto', opacity: 0.5 }} />
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statValue}>{unlockedAchievements.length} / {achievements.length}</div>
                    <div className={styles.statLabel}>Milestones</div>
                    <Award size={16} style={{ marginTop: 'auto', opacity: 0.5 }} />
                </div>
            </div>

            <div className={styles.achievementsSection}>
                <h3 className={styles.sectionTitle}>
                    <Award size={24} color="var(--color-primary)" />
                    Achievements
                </h3>

                <div className={styles.achievementList}>
                    {achievements.map((ach) => {
                        const isUnlocked = unlockedAchievements.includes(ach.id);
                        return (
                            <div
                                key={ach.id}
                                className={`${styles.achievementItem} ${isUnlocked ? styles.unlocked : ''}`}
                            >
                                <div className={styles.achievementIcon}>
                                    {isUnlocked ? ach.icon : '🔒'}
                                </div>
                                <div className={styles.achievementInfo}>
                                    <span className={styles.achievementName}>{ach.label}</span>
                                    <span className={styles.achievementDesc}>{ach.desc}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto' }}>
                <button
                    onClick={useAuth().logout}
                    style={{
                        background: 'rgba(255, 77, 77, 0.1)',
                        color: '#ff4d4d',
                        border: '1px solid rgba(255, 77, 77, 0.2)',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                    }}
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Profile;
