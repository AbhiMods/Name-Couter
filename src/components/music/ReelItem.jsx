import React, { useState, useEffect, useRef } from 'react';
import { Heart, Share2, Volume2, VolumeX, Bookmark, Play, Pause, AlertCircle } from 'lucide-react';
import styles from './Reels.module.css';

const ReelItem = ({ reel, isActive, shouldPreload, onLike, isMuted, toggleMute }) => {
    const [liked, setLiked] = useState(false);
    // const [isMuted, setIsMuted] = useState(true); // REMOVED: Managed by Parent
    const [isPlaying, setIsPlaying] = useState(false); // Tracks desired state
    const [showPlayIcon, setShowPlayIcon] = useState(false); // Animation trigger
    const iframeRef = useRef(null);

    // Sanitize ID
    let videoId = reel.videoId;
    try {
        const match = videoId.match(/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        if (match && match[1]) {
            videoId = match[1];
        }
    } catch (e) { }

    // Helper to send commands to YouTube Iframe
    const sendCommand = (command, args = []) => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: command,
                args: args
            }), '*');
        }
    };

    // Control Logic Effect
    useEffect(() => {
        if (isActive) {
            // Autoplay Strategy:
            // We moved away from "Autoplay Muted" because user dislikes it.
            // We now request "Autoplay with Sound" (mute=0).
            // If browser blocks this (due to no interaction), video will simply NOT play (paused state).
            // This is preferred over playing silently.
            setIsPlaying(true);

            // Try to play immediately
            // If previous interaction occurred, this might work with sound.
            // If not, it might fail/block, waiting for user tap.
            sendCommand('playVideo');

            // Ensure volume is up
            sendCommand('unMute');
            sendCommand('setVolume', [100]);
        } else {
            setIsPlaying(false);
            if (shouldPreload) {
                // Buffer but pause
                // sendCommand('mute'); // No need to mute explicitly if we want sound ready
                sendCommand('pauseVideo');
            } else {
                sendCommand('pauseVideo');
            }
        }
    }, [isActive, shouldPreload]);

    // Update Mute State on Iframe when global isMuted changes
    useEffect(() => {
        if (isActive) {
            // If parent says mute (e.g. via toggle), we respect it.
            // But default start is now unmuted.
            if (isMuted) sendCommand('mute');
            else sendCommand('unMute');
        }
    }, [isMuted, isActive]);


    const handleLike = (e) => {
        e.stopPropagation();
        if (!liked) {
            setLiked(true);
            onLike(reel.id);
        }
    };

    const handleShare = (e) => {
        e.stopPropagation();
        const url = `https://youtube.com/shorts/${videoId}`;
        if (navigator.share) {
            navigator.share({ title: reel.title, url }).catch(() => { });
        }
    };

    // Main Interaction Handler
    const handleMainClick = () => {
        // Toggle Play/Pause
        if (isPlaying) {
            setIsPlaying(false);
            sendCommand('pauseVideo');
            setShowPlayIcon(true);
        } else {
            setIsPlaying(true);
            // Explicit user play -> Force Sound
            sendCommand('unMute');
            sendCommand('setVolume', [100]);
            sendCommand('playVideo');
            setShowPlayIcon(true);

            // Sync global mute state if needed? 
            // If we force play, we assume unmuted.
            if (isMuted && toggleMute) toggleMute();
        }
        setTimeout(() => setShowPlayIcon(false), 800);
    };

    // Ensure we render if active OR shouldPreload
    const shouldRender = isActive || shouldPreload;

    // Iframe Src Construction
    // mute=0: Request sound on start. 
    // autoplay=1: Try to autoplay.
    // If browser blocks (sound+autoplay), video stays paused. User taps -> plays with sound.
    const iFrameSrc = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=${isActive ? 1 : 0}&mute=0&controls=0&disablekb=1&fs=0&loop=1&playlist=${videoId}&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3&origin=${window.location.origin}`;

    return (
        <div className={styles.reelItem} onClick={handleMainClick}>
            <div className={styles.videoWrapper}>
                {shouldRender ? (
                    <div className={styles.iframeContainer}>
                        <div className={styles.clickBlocker} />
                        <iframe
                            ref={iframeRef}
                            className={styles.iframe}
                            src={iFrameSrc}
                            title={reel.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                ) : (
                    <div className={styles.placeholder}>
                        <img
                            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                            alt={reel.title}
                            className={styles.thumbnail}
                            onError={(e) => e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                        />
                    </div>
                )}
            </div>

            {/* Play/Pause/Unmute Feedback Animation */}
            {showPlayIcon && (
                <div className={styles.playIconOverlay}>
                    {/* Visual Feedback for state change */}
                    {!isPlaying ? <Pause size={50} fill="white" /> : (isMuted ? <VolumeX size={50} fill="white" /> : <Volume2 size={40} fill="white" />)}
                </div>
            )}

            {/* Static Overlay Gradient */}
            <div className={styles.overlayGradient} />

            {/* Tap for Sound Hint (Only if Muted and Playing) */}
            {isMuted && isPlaying && !showPlayIcon && (
                <div className={styles.tapOverlay}>
                    <VolumeX size={32} />
                    <span className={styles.tapText}>Tap for Sound</span>
                </div>
            )}

            {/* Info Section */}
            <div className={styles.bottomInfo}>
                <div className={styles.tagsRow}>
                    <span className={styles.categoryBadge}>{reel.category}</span>
                </div>
                <h3 className={styles.reelTitle}>{reel.title}</h3>
                <p className={styles.reelDescription}>Divine Moments • Spiritual</p>
            </div>

            {/* Actions Bar */}
            <div className={styles.actionsBar}>
                <button
                    className={`${styles.actionBtn} ${liked ? styles.liked : ''}`}
                    onClick={handleLike}
                >
                    <Heart size={28} fill={liked ? "#ef4444" : "rgba(0,0,0,0.5)"} strokeWidth={liked ? 0 : 2} />
                    <span className={styles.actionLabel}>{reel.likes + (liked ? 1 : 0)}</span>
                </button>

                <button className={styles.actionBtn} onClick={handleShare}>
                    <Share2 size={26} />
                    <span className={styles.actionLabel}>Share</span>
                </button>

                {/* Mute/Unmute Indicator Button - Only show when Muted to prompt user */}
                {isMuted && (
                    <button className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); toggleMute(); }}>
                        <VolumeX size={26} />
                        <span className={styles.actionLabel}>Unmute</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ReelItem;
