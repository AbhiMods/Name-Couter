import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReelItem from './ReelItem';
import { DIVINE_REELS } from '../../data/divineReels';
import styles from './Reels.module.css';



const ReelsFeed = () => {
    const [displayedReels, setDisplayedReels] = useState([]);
    const [activeReelIndex, setActiveReelIndex] = useState(0);
    const [isGlobalMuted, setIsGlobalMuted] = useState(false);

    // Smart Randomization State
    const [availableIds, setAvailableIds] = useState([]); // Pool of IDs yet to be shown in this cycle

    // Dynamic Stats State
    const [sessionLikes, setSessionLikes] = useState(() => {
        // Initialize from LocalStorage
        try {
            const saved = localStorage.getItem('shorts_likes');
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    }); // Map of uniqueId (or originalId) -> addedLikes

    const containerRef = useRef(null);

    // Initial Setup: Create first batch
    useEffect(() => {
        initializeFeed();
    }, []);

    const shuffle = (array) => {
        return [...array].sort(() => Math.random() - 0.5);
    };

    const initializeFeed = () => {
        // Check for Shared Reel ID in URL
        const searchParams = new URL(window.location.href).searchParams;
        const sharedId = searchParams.get('id');

        let allReels = [...DIVINE_REELS];

        if (sharedId) {
            const index = allReels.findIndex(r => r.id === sharedId);
            if (index !== -1) {
                // Remove shared reel from list
                const sharedReel = allReels.splice(index, 1)[0];
                // Shuffle the remaining reels
                allReels = shuffle(allReels);
                // Prepend the shared reel to the start
                allReels.unshift(sharedReel);
            } else {
                // Shared ID invalid/not found, just shuffle all
                allReels = shuffle(allReels);
            }
        } else {
            // No shared ID, standard shuffle
            allReels = shuffle(allReels);
        }

        // Take first batch (e.g., 5) to display
        const initialBatchSize = Math.min(5, allReels.length);
        const firstBatch = allReels.slice(0, initialBatchSize);
        const remaining = allReels.slice(initialBatchSize);

        const reelsWithKeys = firstBatch.map(createReelWithKey);

        setDisplayedReels(reelsWithKeys);
        setAvailableIds(remaining);

        // Initialize dynamic likes for first batch
        updateDynamicStats(reelsWithKeys);
    };

    const createReelWithKey = (reel) => ({
        ...reel,
        originalId: reel.id,
        uniqueId: `${reel.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

    const updateDynamicStats = (reels) => {
        setSessionLikes(prev => {
            const next = { ...prev };
            reels.forEach(r => {
                if (!next[r.uniqueId]) {
                    // Random boost between 5 and 50 to simulate "live" activity
                    next[r.uniqueId] = Math.floor(Math.random() * 45) + 5;
                }
            });
            return next;
        });
    };

    const loadMoreReels = useCallback(() => {
        setDisplayedReels(prev => {
            let nextReel;
            let newAvailable = [...availableIds];

            // Strategy: Exhaust the 'available' pool first (Guarantee no repeats in cycle)
            if (newAvailable.length > 0) {
                nextReel = newAvailable.shift();
                setAvailableIds(newAvailable);
            } else {
                // Cycle Complete! Reshuffle everything
                // Ensure the NEW first item isn't the same as the OLD last item
                const lastReelId = prev[prev.length - 1].originalId;
                let fullPool = shuffle([...DIVINE_REELS]);

                if (fullPool[0].id === lastReelId) {
                    // Swap first with second to avoid direct duplicate
                    [fullPool[0], fullPool[1]] = [fullPool[1], fullPool[0]];
                }

                nextReel = fullPool.shift();
                setAvailableIds(fullPool); // Reset pool with remainder
            }

            const newReelObj = createReelWithKey(nextReel);
            updateDynamicStats([newReelObj]);
            return [...prev, newReelObj];
        });
    }, [availableIds]);

    // Scroll Handler
    const handleScroll = () => {
        if (!containerRef.current) return;
        const container = containerRef.current;

        // Use rounding to find nearest slide
        const index = Math.round(container.scrollTop / container.clientHeight);

        if (index !== activeReelIndex) {
            setActiveReelIndex(index);

            // "Viewer Effect": When user lands on a reel, maybe bump likes slightly again?
            // Let's keep it simple: Just initial random boost is enough for "fake realism"
        }

        // Infinite Scroll Threshold: Load more when close to end
        if (index >= displayedReels.length - 2) {
            loadMoreReels();
        }
    };

    const handleLike = (originalId) => {
        setSessionLikes(prev => {
            const isCurrentlyLiked = !!prev[originalId];
            const newLikes = { ...prev, [originalId]: !isCurrentlyLiked };
            localStorage.setItem('shorts_likes', JSON.stringify(newLikes));
            return newLikes;
        });
    };

    const toggleGlobalMute = () => {
        setIsGlobalMuted(prev => !prev);
    };

    if (displayedReels.length === 0) return null;

    return (
        <div
            className={styles.reelsContainer}
            ref={containerRef}
            onScroll={handleScroll}
        >
            {displayedReels.map((reel, index) => {
                // Calculate Total Likes: Base + Session Random Boost + User Likes
                const dynamicLikeCount = (reel.likes || 0) + (sessionLikes[reel.uniqueId] || 0);

                return (
                    <ReelItem
                        key={reel.uniqueId}
                        reel={{ ...reel, likes: dynamicLikeCount }} // Pass computed likes

                        isActive={index === activeReelIndex}
                        shouldPreload={index === activeReelIndex + 1}

                        isMuted={isGlobalMuted}
                        toggleMute={toggleGlobalMute}

                        onLike={() => handleLike(reel.uniqueId)}
                    />
                );
            })}
        </div>
    );
};

export default ReelsFeed;
