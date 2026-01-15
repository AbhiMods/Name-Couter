import React, { useState, useMemo } from 'react';
import { useStats } from '../context/StatsContext';
import { Calendar, TrendingUp, BarChart2, Award, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Leaderboard from './Leaderboard';
import Badges from '../components/stats/Badges';
import TimeAnalytics from '../components/stats/TimeAnalytics';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import FeedbackModal from '../components/stats/FeedbackModal';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import styles from './Progress.module.css';

const Progress = () => {
    useDocumentTitle('Progress | Divine Name');
    const { getHistory, totalCount, getStreak } = useStats();
    const [viewRange, setViewRange] = useState(7); // 7 for weekly, 30 for monthly
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    const historyData = useMemo(() => getHistory(viewRange), [getHistory, viewRange]);
    const maxCount = useMemo(() => Math.max(...historyData.map(d => d.count), 1), [historyData]);

    const averageChants = useMemo(() => {
        const sum = historyData.reduce((acc, curr) => acc + curr.count, 0);
        return Math.round(sum / viewRange);
    }, [historyData, viewRange]);

    const chartHeight = 200;
    const chartPadding = 20;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className="text-gradient">Your Progress</h1>
                <p className={styles.subtitle}>Track your spiritual journey</p>
            </header>

            {/* SECTION 1: REPORT & STATS */}
            <section className={styles.section}>
                <div className={styles.overviewGrid}>
                    <Card className={styles.statCard}>
                        <div className={styles.statIcon}><TrendingUp size={20} /></div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>Total Chants</span>
                            <span className={styles.statValue}>
                                <AnimatedCounter value={totalCount} />
                            </span>
                        </div>
                    </Card>
                    <Card className={styles.statCard}>
                        <div className={styles.statIcon}><Calendar size={20} /></div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>Daily Average</span>
                            <span className={styles.statValue}>
                                <AnimatedCounter value={averageChants} />
                            </span>
                        </div>
                    </Card>
                    <Card className={styles.statCard}>
                        <div className={styles.statIcon}><Award size={20} color="var(--color-primary)" /></div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>Current Streak</span>
                            <span className={styles.statValue}>
                                <AnimatedCounter value={getStreak()} suffix=" Days" />
                            </span>
                        </div>
                    </Card>
                </div>

                <Card className={styles.chartCard} style={{ marginTop: '1rem' }}>
                    <div className={styles.chartHeader}>
                        <div className={styles.chartTitle}>
                            <BarChart2 size={20} className={styles.titleIcon} />
                            <h3>Chanting Activity</h3>
                        </div>
                        <div className={styles.rangeSelector}>
                            <button
                                className={viewRange === 7 ? styles.activeRange : ''}
                                onClick={() => setViewRange(7)}
                            >
                                Last 7 Days
                            </button>
                            <button
                                className={viewRange === 30 ? styles.activeRange : ''}
                                onClick={() => setViewRange(30)}
                            >
                                Last 30 Days
                            </button>
                        </div>
                    </div>

                    <div className={styles.chartBody}>
                        <svg className={styles.svgChart} preserveAspectRatio="none" viewBox={`0 0 ${historyData.length * 40} ${chartHeight}`}>
                            {/* Grid Lines */}
                            {[0, 0.25, 0.5, 0.75, 1].map((level) => (
                                <line
                                    key={level}
                                    x1="0"
                                    y1={chartHeight - level * (chartHeight - chartPadding)}
                                    x2="100%"
                                    y2={chartHeight - level * (chartHeight - chartPadding)}
                                    stroke="var(--color-border)"
                                    strokeWidth="1"
                                />
                            ))}

                            {/* Bars */}
                            {historyData.map((d, i) => {
                                const barHeight = (d.count / maxCount) * (chartHeight - chartPadding);
                                const x = i * 40 + 10;
                                const y = chartHeight - barHeight;

                                return (
                                    <g key={d.date} className={styles.barGroup}>
                                        <motion.rect
                                            initial={{ height: 0, y: chartHeight }}
                                            animate={{ height: barHeight, y }}
                                            transition={{ duration: 0.8, delay: i * 0.02 }}
                                            x={x}
                                            width="20"
                                            rx="4"
                                            className={styles.bar}
                                            fill={d.count > 0 ? "var(--color-primary)" : "var(--color-surface-active)"}
                                        />
                                        {viewRange === 7 && (
                                            <text
                                                x={x + 10}
                                                y={chartHeight + 15}
                                                textAnchor="middle"
                                                className={styles.chartLabel}
                                            >
                                                {d.label.split(',')[0]}
                                            </text>
                                        )}
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                </Card>
            </section>

            {/* SECTION 1.5: TIME ANALYTICS */}
            <section className={styles.section}>
                <TimeAnalytics />
            </section>

            {/* SECTION 2: ACHIEVEMENTS */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <Award size={24} className={styles.sectionIcon} />
                    <h2>Achievements</h2>
                </div>
                <Badges />
            </section>

            {/* SECTION 3: LEADERBOARD */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <Trophy size={24} className={styles.sectionIcon} />
                    <h2>Global Leaderboard</h2>
                </div>
                <Leaderboard />
            </section>

            {/* SECTION 4: FEEDBACK */}
            <section className={styles.section}>
                <Card className={styles.feedbackCard}>
                    <button
                        className={styles.feedbackButton}
                        onClick={() => setIsFeedbackOpen(true)}
                    >
                        Give Feedback
                    </button>
                </Card>
            </section>

            <FeedbackModal
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
            />
        </div>
    );
};

export default Progress;
