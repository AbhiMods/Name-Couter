import React, { useState, useEffect, useRef } from 'react';
import { Volume2, RotateCcw, VolumeX, Target, X, Maximize2, Minimize2, MoreVertical, LogOut } from 'lucide-react';
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
    const [showIntention, setShowIntention] = useState(false);

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

        setShowIntention(true);
        setTimeout(() => setShowIntention(false), 4000);

        if (!immersiveMode) {
            toggleImmersiveMode();
        }

        if (!isPlaying) {
            if (currentSong) {
                playTrack(currentSong);
            }
        }
    };

    const handleIncrement = () => {
        if (!sessionStartTime) startSession();

        setIsJapaActive(true);

        const nextCount = count + 1;
        setCount(nextCount);
        incrementStats(1);
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
        if (currentSong) playTrack(currentSong);
    };

    const handleEndSession = () => {
        setShowSummary(false);
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

            <AnimatePresence>
                {showIntention && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={styles.intentionMessage}
                    >
                        Chant with focus and surrender 🙏
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Image Carousel - Now Persist in Zen Mode with extra classes */}
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

            {/* ZEN CONTROLS (Floating Pill) */}
            <AnimatePresence>
                {immersiveMode && (isGhostVisible || immersiveConfig?.showControls) && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.9 }}
                        className={styles.zenControlsPill}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowSummary(true); setIsJapaActive(false); }}
                            className={styles.zenIconButton}
                            title="Pause Session"
                        >
                            <div className={styles.pauseIcon} />
                        </button>

                        <div className={styles.zenDivider} />

                        <button
                            onClick={(e) => { e.stopPropagation(); handleSessionComplete(); }}
                            className={styles.zenIconButton}
                            title="End Session"
                            style={{ color: '#ff4444' }}
                        >
                            <LogOut size={20} />
                        </button>
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
                                variant={soundEnabled ? "primary" : "secondary"}
                                size="icon"
                                onClick={toggleSound}
                                title={soundEnabled ? "Mute Sound" : "Enable Sound"}
                            >
                                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
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
