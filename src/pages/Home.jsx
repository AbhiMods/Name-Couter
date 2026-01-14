import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Target, X, Maximize2, Minimize2, LogOut, Mic, MicOff, Play, Pause, Zap } from 'lucide-react';
import SessionSummary from '../components/chant/SessionSummary';
import ImageCarousel from '../components/chant/ImageCarousel';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

import BhajanModal from '../components/chant/BhajanModal';
import TargetSettings from '../components/chant/TargetSettings';
import FeatureGuideModal from '../components/common/FeatureGuideModal';
import { useName } from '../context/NameContext';
import { useStats } from '../context/StatsContext';
import { useTheme } from '../context/ThemeContext';
import { useBgMusic } from '../context/BgMusicContext';
import { useBhajan } from '../context/BhajanContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import styles from './Home.module.css';
import useVoiceCommand from '../hooks/useVoiceCommand';

const Home = () => {
    useDocumentTitle('Divine Name | Japa Counter');
    const navigate = useNavigate();
    const [count, setCount] = useState(() => {
        return parseInt(localStorage.getItem('divine_count'), 10) || 0;
    });

    const [showTargetModal, setShowTargetModal] = useState(false);

    const [isAnimating, setIsAnimating] = useState(false);
    const [target, setTarget] = useState(() => {
        return parseInt(localStorage.getItem('divine_target'), 10) || 0;
    });
    const [floatingTexts, setFloatingTexts] = useState([]);
    const [showBhajanModal, setShowBhajanModal] = useState(false);

    // Auto Count State
    const [isAutoCounting, setIsAutoCounting] = useState(false);

    // Onboarding Logic
    const [seenFeatures, setSeenFeatures] = useState(() => {
        const saved = localStorage.getItem('divine_onboarding_seen');
        return saved ? JSON.parse(saved) : {};
    });
    const [activeGuide, setActiveGuide] = useState(null); // { key, title, desc, action }

    const tryFeatureAction = (key, title, description, action) => {
        if (seenFeatures[key]) {
            action();
        } else {
            setActiveGuide({ key, title, description, action });
        }
    };

    const confirmFeatureGuide = () => {
        if (activeGuide) {
            const newSeen = { ...seenFeatures, [activeGuide.key]: true };
            setSeenFeatures(newSeen);
            localStorage.setItem('divine_onboarding_seen', JSON.stringify(newSeen));

            const actionToRun = activeGuide.action;
            setActiveGuide(null);

            // Small delay to allow modal to close before action triggers (smoother UX)
            setTimeout(() => {
                actionToRun();
            }, 100);
        }
    };

    // Session State
    const [showSummary, setShowSummary] = useState(false);
    const [sessionStartTime, setSessionStartTime] = useState(null);
    const [sessionStartCount, setSessionStartCount] = useState(0);
    const [sessionDuration, setSessionDuration] = useState('00:00');
    const [liveTimer, setLiveTimer] = useState('00:00');

    const { selectedName, playChant, toggleSound, soundEnabled } = useName();
    const { incrementStats, setIsJapaActive } = useStats();
    const {
        immersiveMode, toggleImmersiveMode, immersiveConfig,
        floatingAnimations, floatingTextColor
    } = useTheme();

    const { play: playBgMusic, stop: stopBgMusic, isPlaying: isBgMusicPlaying, volume: bgMusicVolume, setVolume: setBgMusicVolume } = useBgMusic();
    const [isBgMuted, setIsBgMuted] = useState(false);
    const prevVolumeRef = useRef(0.5);

    const toggleBgMute = (e) => {
        if (e) e.stopPropagation();
        if (isBgMuted) {
            setBgMusicVolume(prevVolumeRef.current || 0.5);
            setIsBgMuted(false);
        } else {
            prevVolumeRef.current = bgMusicVolume;
            setBgMusicVolume(0);
            setIsBgMuted(true);
        }
    };

    const { pause: pauseBhajan, currentSong, isPlaying, playTrack } = useBhajan();

    // Voice Command Integration
    const [isVoiceMode, setIsVoiceMode] = useState(false);

    const toggleVoiceMode = () => {
        setIsVoiceMode(prev => {
            const nextMode = !prev;
            if (nextMode) {
                // Entering Voice Mode -> Mute Music
                prevVolumeRef.current = bgMusicVolume > 0 ? bgMusicVolume : (prevVolumeRef.current || 0.5);
                setBgMusicVolume(0);
                setIsBgMuted(true);
            } else {
                // Exiting Voice Mode -> Unmute Music (Restore volume)
                setIsBgMuted(false);
                setBgMusicVolume(prevVolumeRef.current || 0.5);
            }
            return nextMode;
        });
    };

    // We pass the currently selected name text (first word only as simplified target)
    const targetWord = selectedName ? selectedName.text.split(' ')[0] : 'Sitaram';

    // Use ref to access latest handleIncrement to prevent dependency cycles
    const handleIncrementRef = useRef(null);
    useEffect(() => {
        handleIncrementRef.current = handleIncrement;
    });

    const handleVoiceMatch = useCallback((matchCount = 1) => {
        if (handleIncrementRef.current) {
            // Pass silent: true to prevent sound on voice match
            handleIncrementRef.current(matchCount, true);
        }
    }, []);

    const {
        isListening,
        matchStatus,
        transcript,
        lastDetected,
        startListening,
        stopListening,
        error: voiceError
    } = useVoiceCommand(targetWord, handleVoiceMatch);

    // ... (useEffect for isVoiceMode stays same)

    // ... (handleContainerClick and handleKeyDown stay same)

    // ... (localStorage effects stay same)

    const startSession = () => {
        setSessionStartTime(Date.now());
        setSessionStartCount(count);
        setIsJapaActive(true);

        // Auto-play music if not already playing and not muted
        if (!isBgMusicPlaying && !isBgMuted) {
            playBgMusic();
        }

        if (!immersiveMode) {
            toggleImmersiveMode();
        }
    };

    // Cleanup: Stop music when leaving the page
    useEffect(() => {
        return () => {
            stopBgMusic();
            pauseBhajan();
        };
    }, []);

    const handleIncrement = (amount = 1, silent = false, clientX = null, clientY = null) => {
        if (!sessionStartTime) startSession();

        setIsJapaActive(true);

        const nextCount = count + amount;
        setCount(nextCount);
        incrementStats(amount);

        // Removed playChant() call here to stop "Radha Radha" text-to-speech
        // Only custom audio would play if configured, but default is silent now.

        if (navigator.vibrate) {
            const isMalaComplete = nextCount % 108 === 0;
            const isTargetComplete = isTargetMode && nextCount === target;

            if (isTargetComplete || isMalaComplete) {
                try { navigator.vibrate([100, 50, 100]); } catch (e) { }
            } else {
                try { navigator.vibrate(10); } catch (e) { }
            }
        }

        if (isTargetMode && nextCount === target) {
            handleSessionComplete();
        }

        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 400);

        if (floatingAnimations) {
            const id = Date.now() + Math.random();
            let x, y;

            if (clientX !== null && clientY !== null) {
                // Use exact click coordinates relative to viewport
                // We'll use fixed positioning for these texts to be safe across containers
                x = clientX;
                y = clientY;
            } else {
                // Fallback for keyboard/auto: Center of screen approx
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                x = centerX + (Math.random() - 0.5) * 100;
                y = centerY - 50 - Math.random() * 50;
            }

            setFloatingTexts(prev => [...prev.slice(-15), {
                id,
                text: selectedName.hindiText || selectedName.text.split(' ')[0], // Use Hindi if available
                x,
                y
            }]);

            setTimeout(() => {
                setFloatingTexts(prev => prev.filter(t => t.id !== id));
            }, 2000);
        }
    };

    // Auto Count Effect
    useEffect(() => {
        let interval;
        if (isAutoCounting && immersiveMode) {
            interval = setInterval(() => {
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                const randomX = centerX + (Math.random() - 0.5) * 50;
                const randomY = centerY + (Math.random() - 0.5) * 50;

                if (handleIncrementRef.current) {
                    handleIncrementRef.current(1, false, randomX, randomY);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isAutoCounting, immersiveMode]);


    // Start/Stop listening based on isVoiceMode toggle
    useEffect(() => {
        if (isVoiceMode) {
            startListening();
        } else {
            stopListening();
        }
    }, [isVoiceMode, startListening, stopListening]);

    // Progress Calculation
    const MALA_SIZE = 108;
    const isTargetMode = target > 0;
    const progressMax = isTargetMode ? target : MALA_SIZE;
    const progressCurrent = isTargetMode ? Math.min(count, target) : count % MALA_SIZE;
    const progressRatio = progressCurrent / progressMax;

    const radius = 150;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - progressRatio * circumference;
    const malasCompleted = Math.floor(count / MALA_SIZE);

    const remainingCount = isTargetMode ? (target - count) : (MALA_SIZE - (count % MALA_SIZE));

    // Double Tap & Zen Logic
    const lastTapTime = useRef(0);
    const [isGhostVisible, setIsGhostVisible] = useState(false);
    const controlTimeoutRef = useRef(null);

    const handleContainerClick = (e) => {
        if (e.target.closest('button') || e.target.closest('.modal-content')) return;

        if (!sessionStartTime) {
            startSession();
        }

        // In tap-anywhere mode (default), click increments
        // We pass the coordinates to spawn text there
        if (!e.target.closest(`.${styles.counterCircle}`)) {
            handleIncrement(1, false, e.clientX, e.clientY);
        }

        lastTapTime.current = new Date().getTime();
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
    }, [count, target, isTargetMode, soundEnabled, selectedName, sessionStartTime]);

    useEffect(() => {
        const savedCount = localStorage.getItem('divine_count');
        if (savedCount) {
            const parsed = parseInt(savedCount, 10);
            if (count === 0 && parsed > 0) {
                // We only sync if local state is 0 to avoid overwriting current session?
                // Actually this logic was flawed in original code if it was running.
                // But since we initialize state lazy, this effect is redundant or just a failsafe.
                // We'll leave it but trust the lazy init more.
                setCount(parsed);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('divine_count', count);
    }, [count]);

    useEffect(() => {
        localStorage.setItem('divine_target', target);
    }, [target]);

    useEffect(() => {
        let interval;
        if (sessionStartTime && !showSummary) {
            interval = setInterval(() => {
                const now = Date.now();
                const diff = now - sessionStartTime;
                setLiveTimer(formatDuration(diff));
            }, 1000);
        } else if (!sessionStartTime) {
            setLiveTimer('00:00');
        }
        return () => clearInterval(interval);
    }, [sessionStartTime, showSummary]);



    const formatDuration = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSessionComplete = () => {
        const durationMs = sessionStartTime ? Date.now() - sessionStartTime : 0;
        setSessionDuration(formatDuration(durationMs));
        setShowSummary(true);
        setIsJapaActive(false);
        setIsAutoCounting(false); // Stop Auto Count
        stopBgMusic();
        pauseBhajan();
    };

    const handleContinue = () => {
        setShowSummary(false);
        setSessionStartTime(Date.now());
        setIsJapaActive(true);
    };

    const handleEndSession = () => {
        if (immersiveMode) toggleImmersiveMode(); // Force exit Zen Mode
        setShowSummary(false); // Do not show summary
        setCount(0);
        setSessionStartCount(0);
        setSessionStartTime(null);
        setLiveTimer('00:00');
        setIsJapaActive(false);
        setIsAutoCounting(false);
        stopBgMusic();
        pauseBhajan();
    };

    return (
        <div
            className={clsx(styles.container, immersiveMode && styles.immersiveContainer)}
            style={immersiveMode ? { justifyContent: 'center', height: '100%', padding: '0' } : {}}
            onClick={handleContainerClick}
        >
            <FeatureGuideModal
                isOpen={!!activeGuide}
                title={activeGuide?.title}
                description={activeGuide?.description}
                onConfirm={confirmFeatureGuide}
                onClose={() => setActiveGuide(null)}
            />

            {showTargetModal && (
                <TargetSettings currentTarget={target} onSetTarget={setTarget} onClose={() => setShowTargetModal(false)} />
            )}

            {showBhajanModal && <BhajanModal onClose={() => setShowBhajanModal(false)} />}

            {/* Image Carousel */}
            <div
                className={clsx(styles.imageWrapper, immersiveMode && styles.zenImageWrapper)}
                onClick={(e) => e.stopPropagation()}
            >
                <ImageCarousel />
                {immersiveMode && <div className={styles.imageOverlay} />}
            </div>

            {/* Combined Session Stats (Timer + Progress) - Relocated */}
            <div className={styles.sessionLine}>
                <span>{liveTimer}</span>
                <span className={styles.statDivider}>•</span>
                <span>{isTargetMode ? `${Math.round(progressRatio * 100)}% Goal` : `${malasCompleted} Malas`}</span>
            </div>

            <AnimatePresence>
                {showSummary && (
                    <SessionSummary
                        count={count - sessionStartCount}
                        duration={sessionDuration}
                        onContinue={handleContinue}
                        onEnd={handleEndSession}
                    />
                )}
            </AnimatePresence>

            <motion.div
                layout
                className={styles.counterWrapper}
                style={immersiveMode ? { transform: 'scale(1.1)', marginTop: '2rem' } : { marginTop: '1rem' }}
            >
                <svg className={styles.progressRing} viewBox="0 0 340 340" preserveAspectRatio="xMidYMid meet">
                    <circle className={styles.progressCircleBg} stroke="white" strokeWidth="6" fill="transparent" r={radius} cx="170" cy="170" />
                    <circle className={styles.progressCircleFg} stroke="white" strokeWidth="6" fill="transparent" r={radius} cx="170" cy="170"
                        style={{ strokeDasharray: `${circumference} ${circumference}`, strokeDashoffset, transition: 'stroke-dashoffset 0.1s linear' }}
                    />
                </svg>

                <button className={styles.counterCircle} onClick={(e) => { e.stopPropagation(); handleIncrement(1, false, e.clientX, e.clientY); }} aria-label="Increment Counter">
                    <motion.div
                        className={styles.breathingCircle}
                        animate={{
                            scale: [1, 1.05, 1],
                            opacity: [0.3, 0.6, 0.3],
                            filter: ['blur(10px)', 'blur(15px)', 'blur(10px)']
                        }}
                        transition={{
                            duration: 3.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <AnimatePresence>
                        {isAnimating && (
                            <motion.div
                                className={styles.pulseWave}
                                initial={{ scale: 0.8, opacity: 0.5 }}
                                animate={{ scale: 1.4, opacity: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                        )}
                    </AnimatePresence>

                    <div className={styles.countValue}>{count}</div>

                    <div className={styles.remainingLabel}>
                        <span style={{ opacity: 0.8 }}>{remainingCount}</span> chants remaining
                    </div>

                    <div className={clsx(styles.tapFeedback, isAnimating && styles.animating)}></div>

                    {!isVoiceMode && <div className={styles.tapInstruction}>Tap to Count</div>}
                </button>

            </motion.div>

            {/* Voice Mode Indicator - Pill Style (Relocated) */}
            <AnimatePresence>
                {isVoiceMode && isListening && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className={styles.voiceIndicator}
                    >
                        <div className={styles.micIconWrapper}>
                            <div className={clsx(styles.micRing, styles.activeRing)} />
                            <Mic
                                size={20}
                                className={clsx(
                                    styles.micIcon,
                                    matchStatus === 'match' ? styles.successMic : styles.activeMic
                                )}
                            />
                        </div>

                        <div className={styles.textContent}>
                            <span className={styles.voiceLabel}>
                                {matchStatus === 'match' ? 'Success' : 'Listening'}
                            </span>

                            <AnimatePresence mode='wait'>
                                {lastDetected && matchStatus === 'match' ? (
                                    <motion.span
                                        key={lastDetected.timestamp}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className={clsx(styles.voiceStatus, styles.detectedSuccess)}
                                    >
                                        {lastDetected.word} (+{lastDetected.count})
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="listening"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className={styles.voiceStatus}
                                    >
                                        Say: "{targetWord}"
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>



            {/* STANDARD CONTROLS */}
            <AnimatePresence>
                {!immersiveMode && (
                    <div className={styles.controlsWrapper}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className={styles.controls}
                        >
                            <Button
                                variant="secondary"
                                size="icon"
                                onClick={() => setShowTargetModal(true)}
                                title="Set Goal"
                                className={target > 0 ? styles.activeButton : ''}
                            >
                                <Target size={20} />
                            </Button>

                            <Button
                                variant={isVoiceMode ? "primary" : "secondary"}
                                size="icon"
                                onClick={() => tryFeatureAction(
                                    'voice_mode',
                                    'Voice Chanting',
                                    'Enable hands-free chanting! The app will listen for your voice and count automatically when you say "Radha" or "Ram".',
                                    toggleVoiceMode
                                )}
                                title={isVoiceMode ? "Disable Voice Mode" : "Enable Voice Mode"}
                                className={isVoiceMode ? styles.activeButton : ''}
                            >
                                {isVoiceMode ? <Mic size={20} /> : <MicOff size={20} />}
                            </Button>

                            <Button
                                variant={!isBgMuted ? "primary" : "secondary"}
                                size="icon"
                                onClick={(e) => tryFeatureAction(
                                    'music_control',
                                    'Background Ambience',
                                    'Immerse yourself in devotion. Tap this button to Mute or Unmute the background music.',
                                    () => toggleBgMute(e)
                                )}
                                title={!isBgMuted ? "Mute Background Music" : "Unmute Music"}
                            >
                                {!isBgMuted ? <Volume2 size={20} /> : <VolumeX size={20} />}
                            </Button>



                            <Button
                                variant="secondary"
                                size="icon"
                                onClick={() => tryFeatureAction(
                                    'zen_mode',
                                    'Zen Mode',
                                    'Enter a focused, full-screen view for deep meditation. Tap the minimize icon to exit.',
                                    toggleImmersiveMode
                                )}
                                title="Enter Zen Mode"
                            >
                                <Maximize2 size={20} />
                            </Button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Zen Mode Controls (Bottom) */}
            <AnimatePresence>
                {immersiveMode && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className={styles.zenControls}
                    >
                        <button
                            className={clsx(styles.zenButton, isAutoCounting && styles.activeZenButton)}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsAutoCounting(!isAutoCounting);
                            }}
                        >
                            {isAutoCounting ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                            <span>{isAutoCounting ? 'Stop Auto' : 'Auto Count'}</span>
                        </button>

                        <button
                            className={styles.zenButton}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSessionComplete();
                            }}
                        >
                            <LogOut size={18} />
                            <span>End Session</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Global Floating Text Overlay */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
                <AnimatePresence>
                    {floatingTexts.map((item) => (
                        <motion.span
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.5, y: 0, x: "-50%" }}
                            animate={{ opacity: 1, scale: 1.5, y: -100 }}
                            exit={{ opacity: 0, scale: 0.8, y: -150 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={styles.floatingText}
                            style={{
                                position: 'absolute',
                                left: item.x,
                                top: item.y,
                                color: floatingTextColor || 'var(--color-primary)',
                                textShadow: '0 0 10px rgba(var(--color-primary-rgb), 0.5)',
                                fontWeight: 'bold'
                            }}
                        >
                            {item.text}
                        </motion.span>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Home;
