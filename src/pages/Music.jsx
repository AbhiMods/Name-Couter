import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Heart, Music as MusicIcon, Download, CheckCircle } from 'lucide-react';
import { useBhajan } from '../context/BhajanContext';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/ui/Card';
import styles from './Music.module.css';

const Music = () => {
    const {
        playlist, currentSong, isPlaying, volume,
        currentTime, duration, seek,
        playTrack, pause, next, prev,
        favorites, toggleFavorite,
        downloadTrack, downloadedTracks, favoriteTracks
    } = useBhajan();
    const { theme } = useTheme();

    const [activeTab, setActiveTab] = useState('all');
    const [isDragging, setIsDragging] = useState(false);
    const [dragTime, setDragTime] = useState(0);

    const getDisplayList = () => {
        if (activeTab === 'favorites') return favoriteTracks;
        return playlist;
    };

    const displayList = getDisplayList();
    const categories = [...new Set(playlist.map(t => t.category))];

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

    const handleSeekEnd = (e) => {
        // For mouse up / touch end
        seek(Number(e.target.value));
        setIsDragging(false);
    };

    // Effective time to show (drag time if dragging, else current playback time)
    const displayTime = isDragging ? dragTime : currentTime;
    const progressPercent = duration > 0 ? (displayTime / duration) * 100 : 0;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className="text-gradient">Divine Music</h1>
                <p className={styles.subtitle}>Bhajans & Kirtans for your soul</p>
            </header>

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

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'all' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    All Tracks
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'favorites' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('favorites')}
                >
                    Favorites
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'playlists' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('playlists')}
                >
                    Playlists
                </button>
            </div>

            <div className={styles.trackList}>
                {activeTab === 'playlists' ? (
                    <div className={styles.grid}>
                        {categories.map(cat => (
                            <Card key={cat} className={styles.categoryCard} onClick={() => setActiveTab('all')}>
                                <h3>{cat}</h3>
                                <p>{playlist.filter(t => t.category === cat).length} Tracks</p>
                            </Card>
                        ))}
                    </div>
                ) : (
                    displayList.length > 0 ? (
                        displayList.map((track) => {
                            const isCurrent = currentSong?.id === track.id;
                            const isFav = favorites.has(track.id);
                            const isDownloaded = downloadedTracks.has(track.id);

                            return (
                                <div
                                    key={track.id}
                                    className={`${styles.trackItem} ${isCurrent ? styles.activeTrack : ''}`}
                                    onClick={() => playTrack(track)}
                                >
                                    <div className={styles.trackLeft}>
                                        <div className={styles.trackIcon}>
                                            {isCurrent && isPlaying ? (
                                                <div className={styles.equalizer}>
                                                    <span className={styles.bar}></span>
                                                    <span className={styles.bar}></span>
                                                    <span className={styles.bar}></span>
                                                </div>
                                            ) : (
                                                <MusicIcon size={18} />
                                            )}
                                        </div>
                                        <div className={styles.trackInfo}>
                                            <h4>{track.title}</h4>
                                            <p className={styles.trackMeta}>
                                                {track.artist}
                                                <span className={styles.metaDot}>•</span>
                                                {track.category}
                                                {track.deity && (
                                                    <>
                                                        <span className={styles.metaDot}>•</span>
                                                        {track.deity}
                                                    </>
                                                )}
                                                {track.mood && (
                                                    <>
                                                        <span className={styles.metaDot}>•</span>
                                                        {track.mood}
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className={styles.trackRight}>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id); }}
                                            className={styles.actionBtn}
                                        >
                                            <Heart size={18} fill={isFav ? "var(--color-primary)" : "none"} color={isFav ? "var(--color-primary)" : "var(--color-text-tertiary)"} />
                                        </button>
                                        {isDownloaded ? (
                                            <CheckCircle size={16} className={styles.downloadedIcon} />
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
                            );
                        })
                    ) : (
                        <div className={styles.emptyState}>
                            <p>No tracks found.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Music;
