import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play, Pause, SkipBack, SkipForward, Heart, Music as MusicIcon,
    Download, CheckCircle
} from 'lucide-react';
import { useBhajan } from '../context/BhajanContext';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/ui/Card';
// import ReelsFeed from '../components/music/ReelsFeed'; // Removed in refactor
import MusicPlayerModal from '../components/music/MusicPlayerModal';
import BottomPlayerBar from '../components/music/BottomPlayerBar';
import styles from './Music.module.css';

const Music = () => {
    const {
        playlist, currentSong, isPlaying,
        duration, seek,
        playTrack, pause, next, prev,
        favorites, toggleFavorite,
        downloadTrack, downloadedTracks, favoriteTracks
    } = useBhajan();

    const [bhajanFilter, setBhajanFilter] = useState('all'); // 'all' | 'favorites' | 'playlists'
    const [isPlayerOpen, setIsPlayerOpen] = useState(false);

    // Delayed Show Logic for BottomPlayerBar
    const [delayedShow, setDelayedShow] = useState(isPlaying);
    const [isExiting, setIsExiting] = useState(false);

    React.useEffect(() => {
        if (isPlaying) {
            setDelayedShow(true);
            setIsExiting(false);
        } else {
            // Start exit sequence
            if (delayedShow) {
                setIsExiting(true);
                const timer = setTimeout(() => {
                    setDelayedShow(false);
                    setIsExiting(false);
                }, 5000); // 5 seconds delay before hiding
                return () => clearTimeout(timer);
            }
        }
    }, [isPlaying, delayedShow]);

    const getDisplayList = () => {
        if (bhajanFilter === 'favorites') return favoriteTracks;
        return playlist;
    };

    const displayList = getDisplayList();

    return (
        <div className={styles.container}>
            {/* Header / Tabs - REMOVED, now just title or implicit */}
            {/* Sticky Header for Filters */}
            <div className={styles.stickyHeader}>
                <div className={styles.filterTabs}>
                    <button
                        className={`${styles.filterTab} ${bhajanFilter === 'all' ? styles.activeFilter : ''}`}
                        onClick={() => setBhajanFilter('all')}
                    >
                        All Tracks
                    </button>
                    <button
                        className={`${styles.filterTab} ${bhajanFilter === 'favorites' ? styles.activeFilter : ''}`}
                        onClick={() => setBhajanFilter('favorites')}
                    >
                        Favorites
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className={styles.contentArea}>
                {/* Grid Layout */}
                <div className={styles.trackGrid}>
                    {displayList.length > 0 ? (
                        displayList.map((track) => {
                            const isCurrent = currentSong?.id === track.id;
                            const isFav = favorites.has(track.id);
                            const isDownloaded = downloadedTracks.has(track.id);

                            return (
                                <div
                                    key={track.id}
                                    className={`${styles.trackCard} ${isCurrent ? styles.activeCard : ''}`}
                                    onClick={() => playTrack(track)}
                                >
                                    <div className={`${styles.cardThumbnail} ${isCurrent ? styles.activeThumbnail : ''} ${isCurrent && isPlaying ? styles.playingThumbnail : ''}`}>
                                        {track.thumbnail ? (
                                            <img src={track.thumbnail} alt={track.title} className={styles.cardCustomThumb} />
                                        ) : (
                                            <MusicIcon size={32} />
                                        )}

                                        {/* Hover/Active Overlay */}
                                        <div className={styles.playOverlay}>
                                            <div className={styles.cardPlayBtn}>
                                                {isCurrent && isPlaying ? (
                                                    <Pause size={24} fill="#000000" />
                                                ) : (
                                                    <Play size={24} fill="#000000" style={{ marginLeft: '4px' }} />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.cardInfo}>
                                        <h4 className={styles.cardTitle}>{track.title}</h4>
                                        <p className={styles.cardArtist}>{track.artist}</p>

                                        <div className={styles.cardActions}>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id); }}
                                                className={styles.actionBtn}
                                            >
                                                <Heart size={18} fill={isFav ? "#ef4444" : "none"} color={isFav ? "#ef4444" : "currentColor"} />
                                            </button>

                                            {isDownloaded ? (
                                                <CheckCircle size={18} className={styles.downloadedIcon} />
                                            ) : (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); downloadTrack(track.id); }}
                                                    className={styles.actionBtn}
                                                >
                                                    <Download size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className={styles.emptyState}>
                            <p>No tracks found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* MUSIC PLAYERS */}
            {/* Only render if we have a song AND (it's playing OR it's in the delayed exit phase) AND Player is NOT open */}
            {
                currentSong && delayedShow && !isPlayerOpen && (
                    <BottomPlayerBar
                        onExpand={() => setIsPlayerOpen(true)}
                        isExiting={isExiting}
                    />
                )
            }
            <MusicPlayerModal isOpen={isPlayerOpen} onClose={() => setIsPlayerOpen(false)} />

        </div>
    );
};

export default Music;
