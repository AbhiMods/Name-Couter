import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, Music } from 'lucide-react';
import { useBhajan } from '../../context/BhajanContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './MiniPlayer.module.css';

const MiniPlayer = ({ onExpand }) => {
    const { currentSong, isPlaying, playTrack, pause, next, currentTime, duration, seek } = useBhajan();
    const { immersiveMode } = useTheme();
    const [isDragging, setIsDragging] = useState(false);
    const [dragTime, setDragTime] = useState(0);

    // Hide in Zen Mode (Immersive Mode)
    if (!currentSong || immersiveMode) return null;

    const handleSeekChange = (e) => {
        setDragTime(Number(e.target.value));
        setIsDragging(true);
    };

    const handleSeekCommit = () => {
        seek(dragTime);
        setIsDragging(false);
    };

    const displayTime = isDragging ? dragTime : currentTime;
    const progressPercent = duration > 0 ? (displayTime / duration) * 100 : 0;

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={styles.container}
            onClick={onExpand}
        >
            <input
                type="range"
                min="0"
                max={duration || 100}
                value={displayTime}
                onChange={handleSeekChange}
                onMouseUp={handleSeekCommit}
                onTouchEnd={handleSeekCommit}
                onClick={(e) => e.stopPropagation()} // Prevent expand on seek
                className={styles.miniSeekBar}
                style={{
                    background: `linear-gradient(to right, var(--color-primary) ${progressPercent}%, rgba(255,255,255,0.1) ${progressPercent}%)`
                }}
            />

            <div className={styles.playerCard}>
                <div className={styles.content}>
                    <div className={styles.icon}>
                        {isPlaying ? (
                            <div className={styles.equalizer}>
                                <div className={styles.bar}></div>
                                <div className={styles.bar}></div>
                                <div className={styles.bar}></div>
                            </div>
                        ) : (
                            <Music size={20} color="var(--color-primary)" />
                        )}
                    </div>

                    <div className={styles.info}>
                        <h4 className={styles.title}>{currentSong.title}</h4>
                        <div className={styles.meta}>
                            <span>{currentSong.category}</span>
                            {currentSong.deity && (
                                <>
                                    <span className={styles.metaDot}></span>
                                    <span>{currentSong.deity}</span>
                                </>
                            )}
                            {currentSong.mood && (
                                <>
                                    <span className={styles.metaDot}></span>
                                    <span>{currentSong.mood}</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className={styles.controls}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                isPlaying ? pause() : playTrack(currentSong);
                            }}
                            className={styles.playBtn}
                        >
                            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                next();
                            }}
                            className={styles.controlBtn}
                        >
                            <SkipForward size={20} />
                        </button>
                    </div>
                </div>

                {/* Progress Bar inside Card */}
                <div className={styles.progressBar}>
                    {/* Mock Progress for now - can be connected to real time if exposed */}
                    <div className={styles.progressFill} style={{ width: isPlaying ? '100%' : '0%', transitionDuration: isPlaying ? '30s' : '0s' }}></div>
                </div>
            </div>
        </motion.div>
    );
};

export default MiniPlayer;
