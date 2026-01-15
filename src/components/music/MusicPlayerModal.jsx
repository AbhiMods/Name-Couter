import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Play, Pause, SkipBack, SkipForward, Heart, Repeat, Shuffle } from 'lucide-react';
import { useBhajan } from '../../context/BhajanContext';
import styles from './MusicPlayerModal.module.css';

const MusicPlayerModal = ({ isOpen, onClose }) => {
    const {
        currentSong,
        isPlaying,
        duration,
        currentTime,
        seek,
        pause,
        playTrack,
        next,
        prev,
        toggleFavorite,
        favorites
    } = useBhajan();

    const [isDragging, setIsDragging] = useState(false);
    const [dragTime, setDragTime] = useState(0);

    // Close on Escape
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen || !currentSong) return null;

    const displayTime = isDragging ? dragTime : currentTime;

    // Formatting helper
    const formatTime = (time) => {
        if (!time || isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleSeekChange = (e) => {
        setDragTime(Number(e.target.value));
        setIsDragging(true);
    };

    const handleSeekCommit = () => {
        seek(dragTime);
        setIsDragging(false);
    };

    const isFav = favorites.has(currentSong.id);

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className={styles.modalOverlay}>
                    <motion.div
                        className={styles.modalContent}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className={styles.header}>
                            <button onClick={onClose} className={styles.closeBtn}>
                                <ChevronDown size={28} />
                            </button>
                            <span className={styles.headerTitle}>Now Playing</span>
                            <button className={styles.closeBtn}>
                                {/* Meatball menu or empty for symmetry */}
                            </button>
                        </div>

                        {/* Album Art */}
                        <div className={styles.albumArtContainer}>
                            <motion.img
                                src={currentSong.src.includes('bhajans') ? '/vite.svg' : (currentSong.thumbnail || '/vite.svg')} // Placeholder logic, update later
                                alt="Album Art"
                                className={`${styles.albumArt} ${isPlaying ? styles.playing : ''}`}
                                animate={{ scale: isPlaying ? 1.05 : 1 }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>

                        {/* Track Info */}
                        <div className={styles.trackInfo}>
                            <h2 className={styles.trackTitle}>{currentSong.title}</h2>
                            <p className={styles.trackArtist}>{currentSong.artist}</p>
                        </div>

                        {/* Progress */}
                        <div className={styles.progressBarContainer}>
                            <input
                                type="range"
                                min="0"
                                max={duration || 0}
                                value={displayTime}
                                onChange={handleSeekChange}
                                onMouseUp={handleSeekCommit}
                                onTouchEnd={handleSeekCommit}
                                className={styles.progressBar}
                                style={{
                                    background: `linear-gradient(to right, var(--color-primary) ${(displayTime / duration) * 100}%, rgba(255,255,255,0.2) ${(displayTime / duration) * 100}%)`
                                }}
                            />
                            <div className={styles.timeInfo}>
                                <span>{formatTime(displayTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className={styles.controls} style={{ marginBottom: '5rem' }}> {/* Extra bottom padding to clear Nav */}
                            <button className={styles.controlBtn} onClick={() => toggleFavorite(currentSong.id)}>
                                <Heart size={24} fill={isFav ? "var(--color-primary)" : "none"} color={isFav ? "var(--color-primary)" : "white"} />
                            </button>
                            <button className={styles.controlBtn} onClick={prev}>
                                <SkipBack size={28} />
                            </button>

                            <button
                                className={`${styles.controlBtn} ${styles.playPauseBtn}`}
                                onClick={isPlaying ? pause : () => playTrack(currentSong)}
                            >
                                {isPlaying ? <Pause size={32} fill="#1a1a2e" /> : <Play size={32} fill="#1a1a2e" style={{ marginLeft: '4px' }} />}
                            </button>

                            <button className={styles.controlBtn} onClick={next}>
                                <SkipForward size={28} />
                            </button>
                            <button className={styles.controlBtn}>
                                <Repeat size={24} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default MusicPlayerModal;
