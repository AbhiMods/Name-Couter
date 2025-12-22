import React, { useState, useEffect, useRef } from 'react';
import { Heart, Share2, Volume2, VolumeX, Bookmark, Play, Pause, AlertCircle } from 'lucide-react';
import styles from './Reels.module.css';

const ReelItem = ({ reel, isActive, shouldPreload, onLike }) => {
    const [liked, setLiked] = useState(false);
    const [isMuted, setIsMuted] = useState(true); // Default muted for mobile autoplay
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
            // When active, try to play
            setIsPlaying(true);
            setTimeout(() => {
                sendCommand('playVideo');
                // Ensure mute state matches our state (redundancy for race conditions)
                if (isMuted) sendCommand('mute');
                else sendCommand('unMute');
            }, 100); // Slight delay for iframe ready
        } else {
            // When inactive
            setIsPlaying(false);
            if (shouldPreload) {
                // If preloading, pause it but keep it loaded
                sendCommand('pauseVideo');
                sendCommand('mute'); // Preload muted just in case
            } else {
                // Otherwise pauses/stops (unmount handled by parent usually, but good to be safe)
                sendCommand('pauseVideo');
            }
        }
    }, [isActive, shouldPreload]);

    // Update Mute State on Iframe when isMuted changes
    useEffect(() => {
        if (isMuted) sendCommand('mute');
        else sendCommand('unMute');
    }, [isMuted]);


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

    const toggleMute = (e) => {
        e.stopPropagation();
        setIsMuted(prev => !prev);
    };

    // Main Toggle (Play/Pause)
    // On mobile, first tap often needs to enable sound AND ensure play if autoplay failed
    const handleMainClick = () => {
        // If it was muted, first tap should just Unmute (User friendly)
        if (isPlaying && isMuted) {
            setIsMuted(false);
            setShowPlayIcon(true); // Feedback
            // No need to toggle play state, just unmute
            setTimeout(() => setShowPlayIcon(false), 800);
            return;
        }

        // Otherwise toggle play/pause
        if (isPlaying) {
            setIsPlaying(false);
            sendCommand('pauseVideo');
            setShowPlayIcon(true);
        } else {
            setIsPlaying(true);
            sendCommand('playVideo');
            setShowPlayIcon(true);
        }
        setTimeout(() => setShowPlayIcon(false), 800);
    };

    // Ensure we render if active OR shouldPreload
    const shouldRender = isActive || shouldPreload;

    // Iframe Src Construction
    // Note: We use autoplay=1 still, but rely on postMessage for fine control.
    // mute=1 is critical for mobile initial load.
    const iFrameSrc = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=${isActive ? 1 : 0}&mute=1&controls=0&disablekb=1&fs=0&loop=1&playlist=${videoId}&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3&origin=${window.location.origin}`;

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
                    {/* Different icon logic could be added here, e.g. Volume/Play */}
                    {isPlaying && !isMuted ? <Volume2 size={40} fill="white" /> : (isPlaying ? <Play size={50} fill="white" /> : <Pause size={50} fill="white" />)}
                </div>
            )}

            {/* Static Overlay Gradient */}
            <div className={styles.overlayGradient} />

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

                {/* Mute/Unmute Indicator Button */}
                <button className={styles.actionBtn} onClick={toggleMute}>
                    {isMuted ? <VolumeX size={26} /> : <Volume2 size={26} />}
                    <span className={styles.actionLabel}>{isMuted ? 'Mute' : 'Audio'}</span>
                </button>
            </div>

            {/* "Tap to Unmute" Hint (Only show if playing, muted, and very shortly after load?) 
                 Or just permanent small indicator? Staying clean for now as per "Minimal controls".
                 The Volume icon on the right serves as status.
             */}
        </div>
    );
};

export default ReelItem;
