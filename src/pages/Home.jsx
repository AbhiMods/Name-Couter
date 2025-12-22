import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, RotateCcw, VolumeX, Target, X, Maximize2, Minimize2, MoreVertical, LogOut, Mic, MicOff } from 'lucide-react';
import SessionSummary from '../components/chant/SessionSummary';
import ImageCarousel from '../components/chant/ImageCarousel';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import NameSelector from '../components/chant/NameSelector';
import BhajanModal from '../components/chant/BhajanModal';
import TargetSettings from '../components/chant/TargetSettings';
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
    const [count, setCount] = useState(0);

    const [showTargetModal, setShowTargetModal] = useState(false);

    const [isAnimating, setIsAnimating] = useState(false);
    const [target, setTarget] = useState(() => {
        return parseInt(localStorage.getItem('divine_target'), 10) || 0;
    });
    const [floatingTexts, setFloatingTexts] = useState([]);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [showBhajanModal, setShowBhajanModal] = useState(false);


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
    const { play: playBgMusic, stop: stopBgMusic } = useBgMusic();
    const { pause: pauseBhajan, currentSong, isPlaying, playTrack } = useBhajan();

    // Voice Command Integration
    const [isVoiceMode, setIsVoiceMode] = useState(false);

    // We pass the currently selected name text (first word only as simplified target)
    const targetWord = selectedName ? selectedName.text.split(' ')[0] : 'Sitaram';

    // Use ref to access latest handleIncrement to prevent dependency cycles
    const handleIncrementRef = useRef(null);
    useEffect(() => {
        handleIncrementRef.current = handleIncrement;
    });

    const handleVoiceMatch = useCallback((matchCount = 1) => {
        if (handleIncrementRef.current) {
            handleIncrementRef.current(matchCount);
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

        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTapTime.current;
        if (tapLength < 300 && tapLength > 0) {
            toggleImmersiveMode();
            e.preventDefault();
        } else {
            // In tap-anywhere mode (default), click increments
            if (!e.target.closest(`.${styles.counterCircle}`)) {
                handleIncrement();
            }

            if (immersiveMode) {
                setIsGhostVisible(true);
                if (controlTimeoutRef.current) clearTimeout(controlTimeoutRef.current);
                controlTimeoutRef.current = setTimeout(() => setIsGhostVisible(false), 2000);
            }
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
    }, [count, target, isTargetMode, soundEnabled, selectedName, sessionStartTime]);

    useEffect(() => {
        const savedCount = localStorage.getItem('divine_count');
        if (savedCount) {
            const parsed = parseInt(savedCount, 10);
            setCount(parsed);
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

    const startSession = () => {
        setSessionStartTime(Date.now());
        setSessionStartCount(count);
        setIsJapaActive(true);

        if (!immersiveMode) {
            toggleImmersiveMode();
        }
    };

    const handleIncrement = (amount = 1) => {
        if (!sessionStartTime) startSession();

        setIsJapaActive(true);

        const nextCount = count + amount;
        setCount(nextCount);
        incrementStats(amount);
        playChant();

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
            const xOffset = (Math.random() - 0.5) * 100;
            const yOffset = -50 - Math.random() * 50;

            setFloatingTexts(prev => [...prev.slice(-15), {
                id,
                text: selectedName.text.split(' ')[0],
                x: xOffset,
                y: yOffset
            }]);

            setTimeout(() => {
                setFloatingTexts(prev => prev.filter(t => t.id !== id));
            }, 2000);
        }
    };

    const handleReset = (e) => {
        if (e) e.stopPropagation();
        if (window.confirm('Reset counter to zero?')) {
            setCount(0);
            setSessionStartCount(0);
            setSessionStartTime(null);
            setLiveTimer('00:00');
            setIsJapaActive(false);
            stopBgMusic();
            pauseBhajan();
        }
    };

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
        stopBgMusic();
        pauseBhajan();
    };

    const handleContinue = () => {
        setShowSummary(false);
        setSessionStartTime(Date.now());
        setIsJapaActive(true);
    };

    const handleEndSession = () => {
        setShowSummary(false);
        setCount(0);
        setSessionStartCount(0);
        setSessionStartTime(null);
        setLiveTimer('00:00');
        setIsJapaActive(false);
        stopBgMusic();
        pauseBhajan();
    };

    return (
        <div
            className={clsx(styles.container, immersiveMode && styles.immersiveContainer)}
            style={immersiveMode ? { justifyContent: 'center', height: '100%', padding: '0' } : {}}
            onClick={handleContainerClick}
        >
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

                {/* Voice Mode Indicator - Pill Style */}
                <AnimatePresence>
                    {isVoiceMode && isListening && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
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

                <button className={styles.counterCircle} onClick={(e) => { e.stopPropagation(); handleIncrement(); }} aria-label="Increment Counter">
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

                    <div className={styles.floatingContainer}>
                        <AnimatePresence>
                            {floatingTexts.map((item) => (
                                <motion.span
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.5, y: 0, x: item.x }}
                                    animate={{ opacity: 1, scale: 1.2, y: item.y }}
                                    exit={{ opacity: 0, scale: 0.8, y: item.y - 100 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className={styles.floatingText}
                                    style={{ color: floatingTextColor || 'var(--color-primary)' }}
                                >
                                    {item.text}
                                </motion.span>
                            ))}
                        </AnimatePresence>
                    </div>
                </button>

                {/* Combined Session Stats (Timer + Progress) */}
                <div className={styles.sessionLine}>
                    <span>{liveTimer}</span>
                    <span className={styles.statDivider}>•</span>
                    <span>{isTargetMode ? `${Math.round(progressRatio * 100)}% Goal` : `${malasCompleted} Malas`}</span>
                </div>
            </motion.div>



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
                                variant={soundEnabled ? "primary" : "secondary"}
                                size="icon"
                                onClick={toggleSound}
                                title={soundEnabled ? "Mute Sound" : "Enable Sound"}
                            >
                                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                            </Button>

                            <Button
                                variant={isVoiceMode ? "primary" : "secondary"}
                                size="icon"
                                onClick={() => setIsVoiceMode(!isVoiceMode)}
                                title={isVoiceMode ? "Disable Voice Mode" : "Enable Voice Mode"}
                                className={isVoiceMode ? styles.activeButton : ''}
                            >
                                {isVoiceMode ? <Mic size={20} /> : <MicOff size={20} />}
                            </Button>

                            <Button
                                variant="secondary"
                                size="icon"
                                onClick={toggleImmersiveMode}
                                title="Enter Zen Mode"
                            >
                                <Maximize2 size={20} />
                            </Button>



                            <Button
                                variant="secondary"
                                size="icon"
                                onClick={() => setShowMoreMenu(!showMoreMenu)}
                                title="More Options"
                                className={showMoreMenu ? styles.activeButton : ''}
                            >
                                <MoreVertical size={20} />
                            </Button>
                        </motion.div>

                        <AnimatePresence>
                            {showMoreMenu && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className={styles.menuBackdrop}
                                        onClick={() => setShowMoreMenu(false)}
                                    />
                                    <motion.div
                                        initial={{ y: "100%", opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: "100%", opacity: 0 }}
                                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                                        className={styles.moreMenu}
                                    >
                                        <div className={styles.menuHeader}>
                                            <div className={styles.menuIndicator} />
                                            <h4>Quick Options</h4>
                                        </div>

                                        <div style={{ marginBottom: '1.5rem', width: '100%' }}>
                                            <h4 style={{
                                                fontSize: '0.8rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.1em',
                                                color: 'var(--color-text-tertiary)',
                                                marginBottom: '0.75rem',
                                                textAlign: 'center'
                                            }}>
                                                Select Divine Name
                                            </h4>
                                            <NameSelector onSelect={() => setShowMoreMenu(false)} />
                                        </div>

                                        <div className={styles.menuGrid}>
                                            <button onClick={() => { handleSessionComplete(); setShowMoreMenu(false); }} className={styles.menuItem}>
                                                <LogOut size={18} />
                                                <span>End Session</span>
                                            </button>
                                            <button onClick={(e) => { handleReset(e); setShowMoreMenu(false); }} className={styles.menuItem}>
                                                <RotateCcw size={18} />
                                                <span>Reset Counter</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;
