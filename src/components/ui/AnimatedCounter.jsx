import React, { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

/**
 * AnimatedCounter
 * Animates a number from 0 to value when it comes into view.
 * 
 * @param {number} value - The target number to count to.
 * @param {string} suffix - Optional suffix (e.g., "%", " Days").
 * @param {string} prefix - Optional prefix.
 * @param {number} duration - Animation duration in seconds (note: spring doesn't use duration directly but damping/stiffness).
 */
const AnimatedCounter = ({ value, prefix = '', suffix = '' }) => {
    const ref = useRef(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 30,
        stiffness: 100,
        duration: 2 // Fallback/Spring configuration
    });
    const isInView = useInView(ref, { once: true, margin: "-10px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [motionValue, isInView, value]);

    // Format immediately for display to avoid hydration mismatch if possible, 
    // but here we rely on ref textContent update.
    useEffect(() => {
        const unsubscribe = springValue.on("change", (latest) => {
            if (ref.current) {
                // Formatting: 1,234
                const formatted = Math.floor(latest).toLocaleString();
                ref.current.textContent = `${prefix}${formatted}${suffix}`;
            }
        });

        return () => unsubscribe();
    }, [springValue, prefix, suffix]);

    return <span ref={ref} />;
};

export default AnimatedCounter;
