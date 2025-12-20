import React, { useState, useEffect } from 'react';
import { useStats } from '../../context/StatsContext';
import { Clock, Music, Disc } from 'lucide-react';
import Card from '../ui/Card';
import { motion } from 'framer-motion';
import styles from './TimeAnalytics.module.css';

const TimeAnalytics = () => {
    const { getAggregatedTime } = useStats();
    const [range, setRange] = useState('today'); // today, week, month
    const [stats, setStats] = useState({ japa: 0, music: 0, overlap: 0, total: 0 });

    useEffect(() => {
        setStats(getAggregatedTime(range));
    }, [range, getAggregatedTime]); // Re-fetch when range changes

    const formatTime = (seconds) => {
        if (!seconds) return '0m';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m`;
    };

    const formatDetailedTime = (seconds) => {
        if (!seconds) return '0m';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m ${s}s`;
    };

    // Visualization: Japa (Pure) + Overlap + Music (Pure). 
    // Total = (Japa - Overlap) + Overlap + (Music - Overlap) = Japa + Music - Overlap.
    // We can show segments: Japa Only, Overlap, Music Only.

    const japaOnly = Math.max(0, stats.japa - stats.overlap);
    const musicOnly = Math.max(0, stats.music - stats.overlap);
    const overlap = stats.overlap;

    // Percentages for ring
    const totalDuration = japaOnly + musicOnly + overlap; // Should match stats.total
    const japaPercent = totalDuration > 0 ? (japaOnly / totalDuration) * 100 : 0;
    const overlapPercent = totalDuration > 0 ? (overlap / totalDuration) * 100 : 0;
    // Music is remainder

    // DashArrays for CSS stroke-dasharray (Sequence: Japa, Overlap, Music)
    // We will simplify: just show Japa (Primary) vs Music (Secondary) for now, overlap is implicitly part of both? 
    // Or simpler: Total Ring. Segment 1: Japa. Segment 2: Music (if additive?).
    // Actually, overlapping activities make charts hard.
    // Let's stick to the text breakdown requested.

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleInfo}>
                    <Clock size={20} className={styles.headerIcon} />
                    <h3>Spiritual Time</h3>
                </div>

                <div className={styles.rangeSelector}>
                    <button
                        className={range === 'today' ? styles.activeRange : ''}
                        onClick={() => setRange('today')}
                    >Today</button>
                    <button
                        className={range === 'week' ? styles.activeRange : ''}
                        onClick={() => setRange('week')}
                    >Week</button>
                    <button
                        className={range === 'month' ? styles.activeRange : ''}
                        onClick={() => setRange('month')}
                    >Month</button>
                </div>
            </div>

            {/* Total Devotion Card */}
            <Card className={styles.totalCard}>
                <div className={styles.totalContent}>
                    <div className={styles.ringContainer}>
                        <svg viewBox="0 0 36 36" className={styles.ringChart}>
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="var(--color-surface-active)"
                                strokeWidth="3"
                            />
                            {/* Japa Arc (Gold) */}
                            {stats.japa > 0 && (
                                <motion.path
                                    initial={{ strokeDasharray: "0, 100" }}
                                    animate={{ strokeDasharray: `${(stats.japa / (stats.total || 1)) * 100}, 100` }}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="var(--color-primary)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                            )}
                        </svg>
                        <div className={styles.ringLabel}>
                            <span className={styles.totalValue}>{formatTime(stats.total)}</span>
                            <span className={styles.totalLabel}>Total</span>
                        </div>
                    </div>

                    <div className={styles.breakdown}>
                        <div className={styles.statRow}>
                            <div className={styles.statLabel}>
                                <div className={styles.dot} style={{ background: 'var(--color-primary)' }} />
                                <span>Japa Meditation</span>
                            </div>
                            <span className={styles.statValue}>{formatDetailedTime(stats.japa)}</span>
                        </div>
                        <div className={styles.statRow}>
                            <div className={styles.statLabel}>
                                <div className={styles.dot} style={{ background: '#8b5cf6' }} /> {/* Violet for music */}
                                <span>Music & Kirtan</span>
                            </div>
                            <span className={styles.statValue}>{formatDetailedTime(stats.music)}</span>
                        </div>
                        <div className={styles.statRow} style={{ opacity: 0.7, fontSize: '0.85rem' }}>
                            <div className={styles.statLabel}>
                                <div className={styles.dot} style={{ background: 'var(--color-text-tertiary)' }} />
                                <span>Combined (Overlap)</span>
                            </div>
                            <span className={styles.statValue}>{formatDetailedTime(stats.overlap)}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.message}>
                    {stats.total > 1800
                        ? "Wonderful dedication today! ✨"
                        : "Every moment in devotion counts. 🙏"}
                </div>
            </Card>
        </div>
    );
};

export default TimeAnalytics;
