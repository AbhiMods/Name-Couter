import React from 'react';
import { useLeaderboard } from '../context/LeaderboardContext';
import { Trophy, Medal, Star, User, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import styles from './Leaderboard.module.css';

const Leaderboard = () => {
    useDocumentTitle('Leaderboard | Divine Name');
    const { leaderboardData, myRank } = useLeaderboard();

    const getMedalIcon = (rank) => {
        switch (rank) {
            case 1: return <Trophy size={24} className={styles.gold} />;
            case 2: return <Medal size={24} className={styles.silver} />;
            case 3: return <Medal size={24} className={styles.bronze} />;
            default: return <span className={styles.rankNumber}>{rank}</span>;
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className="text-gradient">Spiritual Leaderboard</h1>
                <p className={styles.subtitle}>Fellow seekers on the path of devotion</p>
            </header>

            <div className={styles.statsOverview}>
                <Card className={styles.myRankCard}>
                    <div className={styles.myRankLabel}>Your Current Rank</div>
                    <div className={styles.myRankValue}>#{myRank}</div>
                    <div className={styles.myRankTrend}>
                        <ChevronUp size={16} />
                        Keep chanting to climb higher!
                    </div>
                </Card>
            </div>

            <div className={styles.board}>
                <div className={styles.boardHeader}>
                    <div className={styles.colRank}>Rank</div>
                    <div className={styles.colUser}>Seeker</div>
                    <div className={styles.colCount}>Total Chants</div>
                </div>

                <div className={styles.rows}>
                    {leaderboardData.map((item, index) => {
                        const rank = index + 1;
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`${styles.row} ${item.isMe ? styles.highlighted : ''}`}
                            >
                                <div className={styles.colRank}>
                                    {getMedalIcon(rank)}
                                </div>
                                <div className={styles.colUser}>
                                    <div className={styles.avatar}>{item.avatar}</div>
                                    <span className={styles.userName}>
                                        {item.name}
                                        {item.isMe && <span className={styles.meBadge}>YOU</span>}
                                    </span>
                                </div>
                                <div className={styles.colCount}>
                                    <div className={styles.countValue}>
                                        {item.count.toLocaleString()}
                                    </div>
                                    {rank <= 3 && <Star size={14} className={styles.starIcon} />}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <footer className={styles.footer}>
                <p>Leaderboard updates in real-time as you chant.</p>
                <div className={styles.tip}>
                    <Star size={12} />
                    Friendly competition encourages mindfulness and consistency.
                </div>
            </footer>
        </div>
    );
};

export default Leaderboard;
