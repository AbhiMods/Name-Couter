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
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        // Simulate initial load
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const currentUserRef = React.useRef(null);

    React.useEffect(() => {
        if (!isLoading && currentUserRef.current) {
            setTimeout(() => {
                currentUserRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500); // Small delay to allow animations to start
        }
    }, [isLoading]);

    const getMedalIcon = (rank) => {
        switch (rank) {
            case 1: return <Trophy size={28} className={styles.gold} />;
            case 2: return <Medal size={26} className={styles.silver} />;
            case 3: return <Medal size={26} className={styles.bronze} />;
            default: return <span className={styles.rankNumber}>{rank}</span>;
        }
    };

    const LoadingSkeleton = () => (
        <div className={styles.skeletonContainer}>
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={styles.skeletonRow}>
                    <div className={styles.skeletonRank} />
                    <div className={styles.skeletonAvatar} />
                    <div className={styles.skeletonText} />
                </div>
            ))}
        </div>
    );

    return (
        <div className={styles.container}>
            {/* ... (Header & Stats Overview remain) */}
            <header className={styles.header}>
                <h1 className="text-gradient">Spiritual Leaderboard</h1>
                <div className={styles.liveIndicator}>
                    <span className={styles.pulsingDot}></span>
                    Live updating
                </div>
            </header>

            <div className={styles.statsOverview}>
                <Card className={styles.myRankCard}>
                    <div className={styles.myRankLabel}>Your Current Rank</div>
                    <div className={styles.myRankValue}>#{myRank}</div>
                    <div className={styles.myRankTrend}>
                        <ChevronUp size={16} />
                        Top {Math.max(1, Math.floor((myRank / 100) * 100))}% of chanters
                    </div>
                </Card>
            </div>

            {isLoading ? (
                <LoadingSkeleton />
            ) : (
                <div className={styles.list}>
                    {leaderboardData.map((item, index) => {
                        const rank = index + 1;
                        const isTop3 = rank <= 3;
                        return (
                            <motion.div
                                key={item.id}
                                ref={item.isMe ? currentUserRef : null}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ delay: index * 0.05 + 0.2 }}
                                className={`
                                    ${styles.card} 
                                    ${item.isMe ? styles.highlighted : ''} 
                                    ${isTop3 ? styles.topRank : ''}
                                `}
                            >
                                <div className={styles.cardLeft}>
                                    <div className={styles.rankBadge}>{getMedalIcon(rank)}</div>
                                    <div className={styles.userInfo}>
                                        <div className={styles.avatar}>{item.avatar}</div>
                                        <div className={styles.nameColumn}>
                                            <span className={styles.userName}>
                                                {item.name}
                                                {item.isMe && <span className={styles.meBadge}>YOU</span>}
                                            </span>
                                            {isTop3 && <span className={styles.topLabel}>Top Seeker</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.cardRight}>
                                    <span className={styles.countValue}>{item.count.toLocaleString()}</span>
                                    <span className={styles.countLabel}>Chants</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* ... (Footer remains) */}
            <footer className={styles.footer}>
                <p>Last updated just now</p>
                <div className={styles.tip}>
                    <Star size={12} />
                    Chant consistently to rise in the spiritual ranks.
                </div>
            </footer>
        </div>
    );
};

export default Leaderboard;
