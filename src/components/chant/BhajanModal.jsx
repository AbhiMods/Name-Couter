import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, SkipBack, SkipForward, Volume2, Music, Heart, Download, CheckCircle, WifiOff } from 'lucide-react';
import { useBhajan } from '../../context/BhajanContext';
import styles from './BhajanModal.module.css';

const BhajanModal = ({ onClose }) => {
    const {
        playlist, currentSong, isPlaying, volume, setVolume,
        playTrack, pause, next, prev,
        favorites, toggleFavorite,
        downloadTrack, downloadedTracks, favoriteTracks
    } = useBhajan();

    const [activeTab, setActiveTab] = useState('all'); // 'all', 'favorites', 'playlists'

    const getDisplayList = () => {
        if (activeTab === 'favorites') return favoriteTracks;
        // For playlists, we could categorize, but for now 'all' is fine or we group them
        return playlist;
    };

    const displayList = getDisplayList();

    // Grouping for 'Playlists' tab (optional feature extension)
    const categories = [...new Set(playlist.map(t => t.category))];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.overlay}
            onClick={onClose}
        >
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={styles.modal}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <Music size={20} color="var(--color-primary)" />
                        <h3>Bhajan Playlist</h3>
                    </div>
                    <button onClick={onClose} className={styles.closeButton}>
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'all' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All
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

                {/* Now Playing (if active) */}
                {currentSong && (
                    <div className={styles.nowPlaying}>
                        <div className={styles.nowPlayingInfo}>
                            <h4 className={styles.trackTitle}>{currentSong.title}</h4>
                            <p className={styles.trackArtist}>{currentSong.artist}</p>
                        </div>
                        <div className={styles.controls}>
                            <button onClick={() => toggleFavorite(currentSong.id)} className={styles.controlBtnSm}>
                                <Heart size={20} fill={favorites.has(currentSong.id) ? "var(--color-primary)" : "none"} color="var(--color-primary)" />
                            </button>
                            <button onClick={prev} className={styles.controlBtnSm}><SkipBack size={20} /></button>
                            <button onClick={() => isPlaying ? pause() : playTrack(currentSong)} className={styles.playBtn}>
                                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                            </button>
                            <button onClick={next} className={styles.controlBtnSm}><SkipForward size={20} /></button>
                        </div>
                    </div>
                )}

                {/* Content Area */}
                <div className={styles.playlist}>
                    {activeTab === 'playlists' ? (
                        <div className={styles.categories}>
                            {categories.map(cat => (
                                <div key={cat} className={styles.categoryCard}>
                                    <h4>{cat} Collection</h4>
                                    <p>{playlist.filter(t => t.category === cat).length} tracks</p>
                                </div>
                            ))}
                            {/* Recommended Section in Playlists for now */}
                            <div className={styles.categoryCard} style={{ background: 'linear-gradient(45deg, var(--color-primary-dark), var(--color-primary))', color: 'white' }}>
                                <h4>✨ Recommended for You</h4>
                                <p>Curated based on your history</p>
                            </div>
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
                                    >
                                        <div
                                            className={styles.trackMain}
                                            onClick={() => playTrack(track)}
                                        >
                                            <div className={styles.trackIcon}>
                                                {isCurrent && isPlaying ? (
                                                    <div className={styles.equalizer}>
                                                        <div className={styles.bar}></div>
                                                        <div className={styles.bar}></div>
                                                        <div className={styles.bar}></div>
                                                    </div>
                                                ) : (
                                                    <span className={styles.trackNumber}>{track.id}</span>
                                                )}
                                            </div>
                                            <div className={styles.trackInfo}>
                                                <h4 className={styles.listTitle}>{track.title}</h4>
                                                <p className={styles.listArtist}>{track.artist} • {track.category}</p>
                                            </div>
                                        </div>

                                        <div className={styles.trackActions}>
                                            {/* Offline Icon */}
                                            {isDownloaded && <CheckCircle size={14} className={styles.downloadedIcon} />}

                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id); }}
                                                className={styles.actionBtn}
                                            >
                                                <Heart size={18} fill={isFav ? "var(--color-text-tertiary)" : "none"} color={isFav ? "var(--color-primary)" : "var(--color-text-tertiary)"} />
                                            </button>

                                            {!isDownloaded && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); downloadTrack(track.id); }}
                                                    className={styles.actionBtn}
                                                    title="Download for Offline"
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
                                <Heart size={48} color="var(--color-text-tertiary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                                <p>No favorites yet.</p>
                                <button onClick={() => setActiveTab('all')} className={styles.textBtn}>Browse All</button>
                            </div>
                        )
                    )}
                </div>

                {/* Volume Footer */}
                <div className={styles.footer}>
                    <Volume2 size={18} color="var(--color-text-secondary)" />
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className={styles.volumeSlider}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
};

export default BhajanModal;
