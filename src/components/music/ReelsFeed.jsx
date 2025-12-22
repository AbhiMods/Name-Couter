import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReelItem from './ReelItem';
import { DIVINE_REELS } from '../../data/divineReels';
import styles from './Reels.module.css';

const ReelsFeed = () => {
    const [displayedReels, setDisplayedReels] = useState([]);
    const [activeReelIndex, setActiveReelIndex] = useState(0);
    const containerRef = useRef(null);

    // Helper to shuffle array
    const shuffleArray = (array) => {
        let currentIndex = array.length, randomIndex;
        const newArray = [...array];
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
        }
        return newArray;
    };

    // Load initial batch
    useEffect(() => {
        const shuffled = shuffleArray(DIVINE_REELS);
        // Ensure we have enough duplicates to scroll if list is short
        let initialList = [...shuffled];
        if (initialList.length < 5) {
            initialList = [...initialList, ...initialList, ...initialList]; // Triple it if very short
        }
        setDisplayedReels(initialList);
    }, []);

    // Load more when reaching end (Infinite Loop Logic)
    const loadMoreReels = useCallback(() => {
        setDisplayedReels(prev => {
            const shuffled = shuffleArray(DIVINE_REELS);
            // Ensure no immediate repeat of the very last item
            if (prev.length > 0 && shuffled[0].id === prev[prev.length - 1].originalId) {
                shuffled.push(shuffled.shift());
            }

            // Generate unique keys for the new batch to avoid React key collisions
            const newBatch = shuffled.map(reel => ({
                ...reel,
                originalId: reel.id,
                uniqueId: `${reel.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            }));

            // Keep list size manageable? 
            // For now, just append. If it gets too huge (100+), we might need to slice from top, 
            // but that messes up scroll position. Virtualization is better but complex.
            // Let's stick to appending for now, user unlikely to scroll 1000s in one session.
            return [...prev, ...newBatch];
        });
    }, []);

    // Handle Scroll & Active Detection
    const handleScroll = () => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const scrollPosition = container.scrollTop;
        const itemHeight = container.clientHeight;

        // Find which index is most visible
        const index = Math.round(scrollPosition / itemHeight);

        if (index !== activeReelIndex) {
            setActiveReelIndex(index);
        }

        // Infinite Scroll Trigger
        // If we are within 2 items of the end, load more
        if (displayedReels.length > 0 && index >= displayedReels.length - 2) {
            loadMoreReels();
        }
    };

    const handleLike = (uniqueId) => {
        setDisplayedReels(prev => prev.map(r =>
            r.uniqueId === uniqueId ? { ...r, likes: (r.likes || 0) + 1 } : r
        ));
    };

    if (displayedReels.length === 0) return null;

    return (
        <div
            className={styles.reelsContainer}
            ref={containerRef}
            onScroll={handleScroll}
        >
            {displayedReels.map((reel, index) => (
                <ReelItem
                    key={reel.uniqueId || reel.id} // Support both for safety
                    reel={reel}
                    isActive={index === activeReelIndex}
                    // Preload next 1 reel (render but maybe paused)
                    shouldPreload={index === activeReelIndex + 1}
                    onLike={() => handleLike(reel.uniqueId)}
                />
            ))}
        </div>
    );
};

export default ReelsFeed;
