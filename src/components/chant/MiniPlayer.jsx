import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, Music } from 'lucide-react';
import { useBhajan } from '../../context/BhajanContext';
import styles from './MiniPlayer.module.css'; // New CSS module
import { useTheme } from '../../context/ThemeContext'; // Check if we need to adjust position based on layout

const MiniPlayer = ({ onExpand }) => {
    const { currentSong, isPlaying, playTrack, pause, stop } = useBhajan();

    if (!currentSong) return null;

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className={styles.container}
            onClick={onExpand}
        >
            <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: '45%' }}></div> {/* Mock progress */}
            </div>

            <div className={styles.content}>
                <div className={styles.icon}>
                    <Music size={18} color="var(--color-primary)" />
                </div>
                <div className={styles.info}>
                    <h4 className={styles.title}>{currentSong.title}</h4>
                    <p className={styles.artist}>{currentSong.artist}</p>
                </div>

                <div className={styles.controls}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            isPlaying ? pause() : playTrack(currentSong);
                        }}
                        className={styles.playBtn}
                    >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default MiniPlayer;
