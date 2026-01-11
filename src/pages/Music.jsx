import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play, Pause, SkipBack, SkipForward, Heart, Music as MusicIcon,
    Download, CheckCircle
} from 'lucide-react';
import { useBhajan } from '../context/BhajanContext';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/ui/Card';
import ReelsFeed from '../components/music/ReelsFeed';
import styles from './Music.module.css';

const Music = () => {
    const {
        playlist, currentSong, isPlaying,
        duration, seek,
        playTrack, pause, next, prev,
        favorites, toggleFavorite,
        downloadTrack, downloadedTracks, favoriteTracks
    } = useBhajan();

    const [mainTab, setMainTab] = useState('bhajans'); // 'bhajans' | 'reels'
    const [bhajanFilter, setBhajanFilter] = useState('all'); // 'all' | 'favorites' | 'playlists'

    const [isDragging, setIsDragging] = useState(false);
    const [dragTime, setDragTime] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0); // Hack to re-mount/refresh feed

    const getDisplayList = () => {
        if (bhajanFilter === 'favorites') return favoriteTracks;
        return playlist;
    };

    const displayList = getDisplayList();

    // Time formatting helper
    const formatTime = (time) => {
        if (!time || isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Seek Handlers
    const handleSeekChange = (e) => {
        setDragTime(Number(e.target.value));
        setIsDragging(true);
    };

    const handleSeekCommit = () => {
        seek(dragTime);
        setIsDragging(false);
    };

    // Effective time to show (drag time if dragging, else current playback time)
    // Note: useBhajan needs to export `currentTime` if not already
    const currentTime = useBhajan().currentTime || 0;
    const displayTime = isDragging ? dragTime : currentTime;
    const progressPercent = duration > 0 ? (displayTime / duration) * 100 : 0;

    return (
        <div className={`${styles.container} ${mainTab === 'reels' ? styles.reelsMode : ''}`}>
            {/* Header / Tabs */}
            <div className={styles.header}>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${mainTab === 'bhajans' ? styles.activeTab : ''}`}
                        onClick={() => setMainTab('bhajans')}
                    >
                        Bhajans
                    </button>
                    <button
                        className={`${styles.tab} ${mainTab === 'reels' ? styles.activeTab : ''}`}
                        onClick={() => setMainTab('reels')}
                    >
                        Reels
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {mainTab === 'bhajans' ? (
                <div className={styles.contentArea}>

                    {/* Now Playing Widget */}
                    {currentSong && (
                        <Card className={styles.nowPlayingCard}>
                            <div className={styles.nowPlayingContent}>
                                <div className={styles.albumArt}>
                                    <MusicIcon size={32} color="var(--color-primary)" />
                                </div>
                                <div className={styles.trackDetails}>
                                    <h3>{currentSong.title}</h3>
                                    <p>{currentSong.artist}</p>
                                </div>
                            </div>

                            <div className={styles.controls}>
                                <button onClick={() => toggleFavorite(currentSong.id)} className={styles.iconBtn}>
                                    <Heart size={20} fill={favorites.has(currentSong.id) ? "var(--color-primary)" : "none"} color="var(--color-primary)" />
                                </button>
                                <button onClick={prev} className={styles.iconBtn}><SkipBack size={24} /></button>
                                <button onClick={() => isPlaying ? pause() : playTrack(currentSong)} className={styles.playBtn}>
                                    {isPlaying ? <Pause size={28} /> : <Play size={28} />}
                                </button>
                                <button onClick={next} className={styles.iconBtn}><SkipForward size={24} /></button>
                            </div>

                            {/* Seek Bar */}
                            <div className={styles.seekContainer}>
                                <div className={styles.timeLabels}>
                                    <span>{formatTime(displayTime)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max={duration || 100}
                                    value={displayTime}
                                    onChange={handleSeekChange}
                                    onMouseUp={handleSeekCommit}
                                    onTouchEnd={handleSeekCommit}
                                    className={styles.seekBar}
                                    style={{
                                        background: `linear-gradient(to right, var(--color-primary) ${progressPercent}%, rgba(255,255,255,0.1) ${progressPercent}%)`
                                    }}
                                />
                            </div>
                        </Card>
                    )}

                    {/* Filter Tabs for Bhajans */}
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
                                        onClick={() => isCurrent && isPlaying ? pause() : playTrack(track)}
                                    >
                                        <div className={`${styles.cardThumbnail} ${isCurrent && isPlaying ? styles.playingThumbnail : ''}`}>
                                            {track.thumbnail ? (
                                                <img src={track.thumbnail} alt={track.title} className={styles.cardCustomThumb} />
                                            ) : (
                                                <MusicIcon size={32} />
                                            )}

                                            {/* Hover/Active Overlay */}
                                            <div className={styles.playOverlay}>
                                                <div className={styles.cardPlayBtn}>
                                                    {isCurrent && isPlaying ? (
                                                        <div className={styles.equalizer}>
                                                            <span className={styles.bar} style={{ animationDelay: '0s' }}></span>
                                                            <span className={styles.bar} style={{ animationDelay: '0.2s' }}></span>
                                                            <span className={styles.bar} style={{ animationDelay: '0.4s' }}></span>
                                                        </div>
                                                    ) : (
                                                        <Play size={20} fill="white" />
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
            ) : (
                /* REELS SECTION */
                <div className={styles.reelsArea}>
                    <ReelsFeed key={refreshKey} />
                </div>
            )}
        </div>
    );
};

export default Music;
