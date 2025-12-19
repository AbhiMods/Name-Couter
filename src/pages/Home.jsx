import React, { useState, useEffect, useRef } from 'react';
import { Volume2, RotateCcw, ChevronDown, ChevronUp, VolumeX, Target, Award, X, MessageSquare, Maximize2, Minimize2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import NameSelector from '../components/chant/NameSelector';
import TargetSettings from '../components/chant/TargetSettings';
import Badges from '../components/stats/Badges';
import FeedbackModal from '../components/feedback/FeedbackModal';
import { useName } from '../context/NameContext';
import { useStats } from '../context/StatsContext';
import { useTheme } from '../context/ThemeContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import styles from './Home.module.css';

const Home = () => {
    useDocumentTitle('Divine Name | Japa Counter');
    const [count, setCount] = useState(0);
    const [showSelector, setShowSelector] = useState(false);
    const [showTargetModal, setShowTargetModal] = useState(false);
    const [showBadges, setShowBadges] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [target, setTarget] = useState(() => {
        return parseInt(localStorage.getItem('divine_target'), 10) || 0;
    });

    const { selectedName, playChant, toggleSound, soundEnabled } = useName();
    const { incrementStats } = useStats();
    const { immersiveMode, toggleImmersiveMode, immersiveConfig } = useTheme();

    // Progress Calculation
    const MALA_SIZE = 108;
    const isTargetMode = target > 0;
    const progressMax = isTargetMode ? target : MALA_SIZE;
    const progressCurrent = isTargetMode ? Math.min(count, target) : count % MALA_SIZE;
    const progressRatio = progressCurrent / progressMax;
    const malasCompleted = Math.floor(count / MALA_SIZE);

    const radius = 160;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - progressRatio * circumference;

    // Double Tap Logic
    const lastTapTime = useRef(0);
    const handleContainerClick = (e) => {
        // Ignore clicks on buttons/interactive elements to avoid conflict
        if (e.target.closest('button') || e.target.closest('.modal-content')) return;

        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTapTime.current;
        if (tapLength < 300 && tapLength > 0) {
            toggleImmersiveMode();
            e.preventDefault();
        }
        lastTapTime.current = currentTime;
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                handleIncrement();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [count, target, isTargetMode, soundEnabled, selectedName]);

    useEffect(() => {
        const savedCount = localStorage.getItem('divine_count');
        if (savedCount) setCount(parseInt(savedCount, 10));
    }, []);

    useEffect(() => {
        localStorage.setItem('divine_count', count);
    }, [count]);

    useEffect(() => {
        localStorage.setItem('divine_target', target);
    }, [target]);

    const handleIncrement = () => {
        const nextCount = count + 1;
        setCount(nextCount);
        incrementStats(1);
        playChant();

        if (navigator.vibrate) {
            if (isTargetMode && nextCount === target) {
                try { navigator.vibrate(1000); } catch (e) { }
            } else {
                try { navigator.vibrate(10); } catch (e) { }
            }
        }

        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 400);
    };

    const handleReset = (e) => {
        e.stopPropagation();
        if (window.confirm('Reset counter to zero?')) {
            setCount(0);
        }
    };

    // Determine visibility based on mode and config
    const showName = !immersiveMode || immersiveConfig?.showName;
    const showControls = !immersiveMode || immersiveConfig?.showControls;

    return (
        <div
            className={clsx(styles.container, immersiveMode && styles.immersiveContainer)}
            style={immersiveMode ? { justifyContent: 'center', height: '100%', padding: '2rem 0' } : {}}
            onClick={handleContainerClick}
        >
            {showTargetModal && (
                <TargetSettings currentTarget={target} onSetTarget={setTarget} onClose={() => setShowTargetModal(false)} />
            )}
            {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
            {showBadges && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowBadges(false)}>
                    <div className="relative w-full max-w-lg bg-[#0a0a0f] border border-[#222] rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowBadges(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white">
                            <X size={24} />
                        </button>
                        <Badges />
                    </div>
                </div>
            )}

            <AnimatePresence>
                {showName && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="text-center"
                        style={{ position: 'relative', zIndex: 10 }}
                    >
                        <button className={styles.nameTrigger} onClick={() => setShowSelector(!showSelector)} title="Change Name">
                            <h2 className={styles.nameDisplay}>
                                {selectedName.label}
                                {showSelector ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                            </h2>
                        </button>
                        <p className={styles.mantraSubtitle}>{selectedName.subtitle}</p>
                        {showSelector && (
                            <div className={styles.selectorDropdown}>
                                <NameSelector />
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                layout
                className={styles.counterWrapper}
                style={immersiveMode && !immersiveConfig?.showControls && !immersiveConfig?.showName ? { transform: 'scale(1.1)' } : {}}
            >
                <svg className={styles.progressRing} width="340" height="340">
                    <circle className={styles.progressCircleBg} stroke="white" strokeWidth="4" fill="transparent" r={radius} cx="170" cy="170" />
                    <circle className={styles.progressCircleFg} stroke="white" strokeWidth="4" fill="transparent" r={radius} cx="170" cy="170"
                        style={{ strokeDasharray: `${circumference} ${circumference}`, strokeDashoffset, transition: 'stroke-dashoffset 0.1s linear' }}
                    />
                </svg>

                <button className={styles.counterCircle} onClick={handleIncrement} aria-label="Increment Counter">
                    <div className={styles.countLabel}>Repetitions</div>
                    <div className={styles.countValue}>{count}</div>
                    {isTargetMode && (
                        <div style={{ fontSize: '0.9rem', color: 'var(--color-primary)', marginTop: '0.5rem', opacity: 0.8 }}>
                            Target: {target}
                        </div>
                    )}
                    <div className={clsx(styles.tapFeedback, isAnimating && styles.animating)}></div>
                </button>

                <div className={styles.malaCount}>
                    {isTargetMode ? `${Math.round(progressRatio * 100)}% Completed ${count >= target ? '🎉' : ''}` : `${malasCompleted} Malas Completed`}
                </div>
            </motion.div>

            {/* Immersive Mode Exit Button (Floating) */}
            <AnimatePresence>
                {immersiveMode && !showControls && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={toggleImmersiveMode}
                        className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 shadow-lg hover:bg-white/20 transition-all"
                        title="Exit Full Screen"
                    >
                        <Minimize2 size={24} />
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showControls && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className={styles.controls}
                    >
                        <Button variant="secondary" size="icon" onClick={() => setShowTargetModal(true)} title="Set Goal">
                            <Target size={20} color={target > 0 ? "var(--color-primary)" : "currentColor"} />
                        </Button>
                        <Button variant="secondary" size="icon" onClick={() => setShowBadges(true)} title="Achievements">
                            <Award size={20} />
                        </Button>
                        <Button variant="secondary" size="icon" onClick={toggleImmersiveMode} title={immersiveMode ? "Exit Full Screen" : "Full Screen"}>
                            {immersiveMode ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                        </Button>
                        <Button variant="secondary" size="icon" onClick={() => setShowFeedback(true)} title="Send Feedback">
                            <MessageSquare size={20} />
                        </Button>
                        <Button variant="secondary" size="icon" onClick={handleReset} title="Reset">
                            <RotateCcw size={20} />
                        </Button>
                        <Button variant={soundEnabled ? "primary" : "secondary"} size="icon" onClick={toggleSound} title={soundEnabled ? "Mute Sound" : "Enable Sound"}>
                            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;
