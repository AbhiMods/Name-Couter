import React, { useState, useEffect, useRef } from 'react';
import { Heart, Share2, Volume2, VolumeX, Bookmark, Play, Pause, AlertCircle } from 'lucide-react';
import styles from './Reels.module.css';

const ReelItem = ({ reel, isActive, shouldPreload, onLike, isMuted, toggleMute, onEnded, isLiked }) => {
    // const [liked, setLiked] = useState(false); // REMOVED: Managed by Parent
    const [isPlaying, setIsPlaying] = useState(false); // Tracks desired state
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
        onLike(); // Parent handles toggling logic
    };

    const handleShare = (e) => {
        e.stopPropagation();
        // Generate Deep Link to this specific reel on our app
        const url = `${window.location.origin}/shorts?id=${reel.id}`;

        if (navigator.share) {
            navigator.share({ title: reel.title, url }).catch(() => {
                // Fallback: Copy to clipboard if share fails or isn't supported (optional but good UX)
                navigator.clipboard.writeText(url);
                alert("Link copied to clipboard!");
            });
        } else {
            navigator.clipboard.writeText(url);
            alert("Link copied to clipboard!");
        }
    };

    // Main Interaction Handler
    const handleMainClick = () => {
        // Toggle Play/Pause
        if (isPlaying) {
            setIsPlaying(false);
            sendCommand('pauseVideo');
        } else {
            setIsPlaying(true);
            // Force Sound ON - Never Toggle Mute here
            if (isMuted) toggleMute(); // Only unmute if currently muted
            sendCommand('unMute');
            sendCommand('setVolume', [100]);
            sendCommand('playVideo');
        }
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

            {/* Play/Pause/Unmute Feedback Animation REMOVED */}{/* No Overlay */}

            {/* Static Overlay Gradient */}
            <div className={styles.overlayGradient} />

            {/* Tap for Sound Hint REMOVED */}

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
                    className={`${styles.actionBtn} ${isLiked ? styles.liked : ''}`}
                    onClick={handleLike}
                >
                    <Heart size={28} fill={isLiked ? "#ef4444" : "rgba(0,0,0,0.5)"} strokeWidth={isLiked ? 0 : 2} />
                    <span className={styles.actionLabel}>{reel.likes}</span>
                </button>

                <button className={styles.actionBtn} onClick={handleShare}>
                    <Share2 size={26} />
                    <span className={styles.actionLabel}>Share</span>
                </button>

                {/* Unmute Button REMOVED */}{/* No Mute Toggle UI */}
            </div>
        </div>
    );
};

export default ReelItem;
