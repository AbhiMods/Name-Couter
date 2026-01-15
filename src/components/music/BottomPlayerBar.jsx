import React from 'react';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { useBhajan } from '../../context/BhajanContext';
import styles from './BottomPlayerBar.module.css';
import clsx from 'clsx';

const BottomPlayerBar = ({ onExpand, isExiting }) => {
    const { currentSong, isPlaying, playTrack, pause, next, prev, duration, currentTime } = useBhajan();

    if (!currentSong) return null;

    const progress = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div
            className={clsx(styles.playerBar, isExiting && styles.playerBarExiting)}
            onClick={onExpand}
        >
            {/* Progress Line */}
            <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>

            <div className={styles.trackInfo}>
                <img
                    src={currentSong.thumbnail || '/vite.svg'}
                    alt="Thumb"
                    className={styles.thumbnail}
                />
                <div className={styles.textContainer}>
                    <span className={styles.title}>{currentSong.title}</span>
                    <span className={styles.artist}>{currentSong.artist}</span>
                </div>
            </div>

            <div className={styles.controls}>
                <button
                    className={styles.controlBtn}
                    onClick={(e) => {
                        e.stopPropagation();
                        prev();
                    }}
                >
                    <SkipBack size={24} />
                </button>
                <button
                    className={styles.playBtn}
                    onClick={(e) => {
                        e.stopPropagation();
                        isPlaying ? pause() : playTrack(currentSong);
                    }}
                >
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                </button>
                <button
                    className={styles.controlBtn}
                    onClick={(e) => {
                        e.stopPropagation();
                        next();
                    }}
                >
                    <SkipForward size={24} />
                </button>
            </div>
        </div>
    );
};

export default BottomPlayerBar;
