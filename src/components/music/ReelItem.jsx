import React, { useState, useEffect, useRef } from 'react';
import { Heart, Share2, Volume2, VolumeX, Bookmark, Play, Pause } from 'lucide-react';
import styles from './Reels.module.css';

const ReelItem = ({ reel, isActive, shouldPreload, onLike }) => {
    const [liked, setLiked] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true); // Internal play state
    const [showPlayIcon, setShowPlayIcon] = useState(false); // For animation

    // Sanitize ID
    let videoId = reel.videoId;
    try {
        if (videoId.includes('shorts/')) videoId = videoId.split('shorts/')[1].split('?')[0];
        if (videoId.includes('v=')) videoId = videoId.split('v=')[1].split('&')[0];
    } catch (e) { }

    // Effect: Reset state when active changes
    useEffect(() => {
        if (isActive) {
            setIsPlaying(true);
            // Reset mute only if needed, or keep global preference? Keeping per-video for now or global?
            // User requirement: "Instantly play... instantly pause prev".
            // We'll let `isActive` control the mounting/autoplay mostly.
        } else {
            setIsPlaying(false);
        }
    }, [isActive]);

    const handleLike = (e) => {
        e.stopPropagation();
        if (!liked) {
            setLiked(true);
            onLike(reel.id); // Note: parent expects uniqueId if updated logic used
        }
    };

    const handleShare = (e) => {
        e.stopPropagation();
        const url = `https://youtube.com/shorts/${videoId}`;
        if (navigator.share) {
            navigator.share({ title: reel.title, url }).catch(() => { });
        } else {
            // navigator.clipboard.writeText(url);
            // Alert or toast could go here
        }
    };

    const toggleMute = (e) => {
        e.stopPropagation();
        setIsMuted(!isMuted);
    };

    const togglePlay = () => {
        const newState = !isPlaying;
        setIsPlaying(newState);
        setShowPlayIcon(true);
        setTimeout(() => setShowPlayIcon(false), 800);
    };

    // YouTube Iframe Config
    // Scale: 1.35 to zoom in and hide controls/branding
    // Controls=0, ModestBranding=1, Loop=1
    // Autoplay logic: Active && isPlaying

    const shouldRenderIframe = isActive || shouldPreload;
    const iFrameSrc = `https://www.youtube.com/embed/${videoId}?autoplay=${isActive && isPlaying ? 1 : 0}&controls=0&disablekb=1&fs=0&loop=1&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3&playlist=${videoId}&mute=${isMuted ? 1 : 0}`;

    return (
        <div className={styles.reelItem} onClick={togglePlay}>
            {/* Video Container */}
            <div className={styles.videoWrapper}>
                {shouldRenderIframe ? (
                    <div className={styles.iframeContainer}>
                        {/* Click blocker to prevent YouTube interactions but allow scrolling/overlay clicks */}
                        <div className={styles.clickBlocker} />
                        <iframe
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
                            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} // Try maxres
                            alt={reel.title}
                            className={styles.thumbnail}
                            onError={(e) => e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                        />
                    </div>
                )}
            </div>

            {/* Play/Pause Animation Overlay */}
            {showPlayIcon && (
                <div className={styles.playIconOverlay}>
                    {isPlaying ? <Play size={50} fill="white" /> : <Pause size={50} fill="white" />}
                </div>
            )}

            {/* Content Overlays */}
            <div className={styles.overlayGradient} />

            {/* Main Info */}
            <div className={styles.bottomInfo}>
                <div className={styles.tagsRow}>
                    <span className={styles.categoryBadge}>{reel.category}</span>
                </div>
                <h3 className={styles.reelTitle}>{reel.title}</h3>
                <p className={styles.reelDescription}>Divine Moments • Spiritual</p>
            </div>

            {/* Right Side Actions */}
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

                {/* Mute Toggle */}
                <button className={styles.actionBtn} onClick={toggleMute}>
                    {isMuted ? <VolumeX size={26} /> : <Volume2 size={26} />}
                    <span className={styles.actionLabel}>{isMuted ? 'Mute' : 'Audio'}</span>
                </button>
            </div>
        </div>
    );
};

export default ReelItem;
