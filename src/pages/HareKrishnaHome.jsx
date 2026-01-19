import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Target, X, Maximize2, Minimize2, LogOut, Mic, MicOff, Play, Pause, Zap, Timer, Clock } from 'lucide-react';
import SessionSummary from '../components/chant/SessionSummary';
import ImageCarousel from '../components/chant/ImageCarousel';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

import BhajanModal from '../components/chant/BhajanModal';
import TargetSettings from '../components/chant/TargetSettings';
import CelebrationModal from '../components/chant/CelebrationModal';
import FeatureGuideModal from '../components/common/FeatureGuideModal';
// import { useName } from '../context/NameContext'; // REMOVED: Using hardcoded name
import { useStats } from '../context/StatsContext';
import { useTheme } from '../context/ThemeContext';
import { useBgMusic } from '../context/BgMusicContext';
import { useBhajan } from '../context/BhajanContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import styles from './HareKrishnaHome.module.css'; // Updated CSS import
import useVoiceCommand from '../hooks/useVoiceCommand';

const HareKrishnaHome = () => {
     useDocumentTitle('Hare Krishna | Japa Counter');
     const navigate = useNavigate();

     // STORAGE KEY: hk_count
     const [count, setCount] = useState(() => {
          return parseInt(localStorage.getItem('hk_count'), 10) || 0;
     });

     const [showTargetModal, setShowTargetModal] = useState(false);

     const [isAnimating, setIsAnimating] = useState(false);

     // STORAGE KEY: hk_target
     const [target, setTarget] = useState(() => {
          const saved = localStorage.getItem('hk_target');
          return saved ? parseInt(saved, 10) : 108;
     });

     const [floatingTexts, setFloatingTexts] = useState([]);
     const [showBhajanModal, setShowBhajanModal] = useState(false);
     const [showCelebration, setShowCelebration] = useState(false);
     const [pendingEndSession, setPendingEndSession] = useState(false);
     const [isAutoCounting, setIsAutoCounting] = useState(false);

     const [seenFeatures, setSeenFeatures] = useState(() => {
          const saved = localStorage.getItem('divine_onboarding_seen');
          return saved ? JSON.parse(saved) : {};
     });
     const [activeGuide, setActiveGuide] = useState(null);

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

     // Hardcoded Name
     const selectedName = { text: 'Hare Krishna', hindiText: 'हरे कृष्ण' };

     // const { selectedName, playChant, toggleSound, soundEnabled } = useName(); // REMOVED
     const soundEnabled = false; // Default off for now as playChant is removed

     const { incrementStats, setIsJapaActive } = useStats();
     const {
          immersiveMode, toggleImmersiveMode, immersiveConfig,
          floatingAnimations, floatingTextColor
     } = useTheme();

     const { play: playBgMusic, stop: stopBgMusic, isPlaying: isBgMusicPlaying, volume: bgMusicVolume, setVolume: setBgMusicVolume, selectedTrackId, setSelectedTrackId } = useBgMusic();
     const [isBgMuted, setIsBgMuted] = useState(false);
     const prevVolumeRef = useRef(0.5);

     // --- CUSTOM BG MUSIC LOGIC ---
     // Load HK-specific track preference on mount
     useEffect(() => {
          const hkTrack = localStorage.getItem('hk_bg_music_track');
          if (hkTrack && hkTrack !== 'none') {
               if (activeTrackRef.current !== hkTrack) {
                    setSelectedTrackId(hkTrack);
               }
          }
          // If not set, it uses default or whatever was last set. 
          // Ideally we should enforce a default if empty?
     }, [setSelectedTrackId]);

     // Save track preference changes to hk_bg_music_track while this component is active
     const activeTrackRef = useRef(selectedTrackId);
     useEffect(() => {
          activeTrackRef.current = selectedTrackId;
          localStorage.setItem('hk_bg_music_track', selectedTrackId);
     }, [selectedTrackId]);

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

     const [isVoiceMode, setIsVoiceMode] = useState(false);

     const toggleVoiceMode = () => {
          setIsVoiceMode(prev => {
               const nextMode = !prev;
               if (nextMode) {
                    prevVolumeRef.current = bgMusicVolume > 0 ? bgMusicVolume : (prevVolumeRef.current || 0.5);
                    setBgMusicVolume(0);
                    setIsBgMuted(true);
               } else {
                    setIsBgMuted(false);
                    setBgMusicVolume(prevVolumeRef.current || 0.5);
               }
               return nextMode;
          });
     };

     const targetWord = 'Krishna'; // Simplified voice target

     const handleIncrementRef = useRef(null);
     useEffect(() => {
          handleIncrementRef.current = handleIncrement;
     });

     const handleVoiceMatch = useCallback((matchCount = 1) => {
          if (handleIncrementRef.current) {
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

     // Cleanup: Stop music when leaving the page
     useEffect(() => {
          return () => {
               stopBgMusic();
          };
     }, []);

     const startSession = () => {
          setSessionStartTime(Date.now());
          setSessionStartCount(count);
          setIsJapaActive(true);

          if (!isBgMusicPlaying && !isBgMuted) {
               playBgMusic();
          }

          if (!immersiveMode) {
               toggleImmersiveMode();
          }
     };

     const handleIncrement = (amount = 1, silent = false, clientX = null, clientY = null) => {
          if (!sessionStartTime) startSession();

          setIsJapaActive(true);

          const nextCount = count + amount;
          setCount(nextCount);
          incrementStats(amount);

          if (navigator.vibrate) {
               const isMalaComplete = isTargetMode && nextCount > 0 && nextCount % target === 0;
               try { navigator.vibrate(10); } catch (e) { }

               if (isMalaComplete) {
                    try { navigator.vibrate([200, 100, 200]); } catch (e) { }
                    handleCycleComplete();
               }
          } else if (isTargetMode && nextCount > 0 && nextCount % target === 0) {
               handleCycleComplete();
          }

          const currentTarget = target > 0 ? target : 108;
          const MALAS_FOR_CELEBRATION = 5;
          const celebrationCount = currentTarget * MALAS_FOR_CELEBRATION;

          if (nextCount > 0 && nextCount % celebrationCount === 0) {
               setShowCelebration(true);
               setPendingEndSession(false);
               pauseBhajan();
          }

          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 400);

          if (floatingAnimations) {
               const id = Date.now() + Math.random();
               let x, y;

               if (clientX !== null && clientY !== null) {
                    x = clientX;
                    y = clientY;
               } else {
                    const centerX = window.innerWidth / 2;
                    const centerY = window.innerHeight / 2;
                    x = centerX + (Math.random() - 0.5) * 100;
                    y = centerY - 50 - Math.random() * 50;
               }

               setFloatingTexts(prev => [...prev.slice(-15), {
                    id,
                    text: selectedName.hindiText || selectedName.text,
                    x,
                    y
               }]);

               setTimeout(() => {
                    setFloatingTexts(prev => prev.filter(t => t.id !== id));
               }, 2000);
          }
     };

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
               }, 1500);
          }
          return () => clearInterval(interval);
     }, [isAutoCounting, immersiveMode]);


     useEffect(() => {
          if (isVoiceMode) {
               startListening();
          } else {
               stopListening();
          }
     }, [isVoiceMode, startListening, stopListening]);

     const MALA_SIZE = 108;
     const isTargetMode = target > 0;
     const currentCycleCount = isTargetMode ? (count % target) : (count % MALA_SIZE);
     const progressMax = isTargetMode ? target : MALA_SIZE;
     const progressValue = currentCycleCount;
     const progressRatio = progressValue / progressMax;
     const radius = 150;
     const circumference = 2 * Math.PI * radius;
     const strokeDashoffset = circumference - (progressRatio * circumference);
     const roundsCompleted = isTargetMode ? Math.floor(count / target) : Math.floor(count / MALA_SIZE);
     const remainingInCycle = isTargetMode ? (target - currentCycleCount) : (MALA_SIZE - (count % MALA_SIZE));

     const lastTapTime = useRef(0);
     const [isGhostVisible, setIsGhostVisible] = useState(false);
     const controlTimeoutRef = useRef(null);

     const handleContainerClick = (e) => {
          if (e.target.closest('button') || e.target.closest('.modal-content')) return;

          if (!sessionStartTime) {
               startSession();
          }

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
     }, [count, target, isTargetMode, soundEnabled, sessionStartTime]);

     useEffect(() => {
          const savedCount = localStorage.getItem('hk_count');
          if (savedCount) {
               const parsed = parseInt(savedCount, 10);
               if (count === 0 && parsed > 0) {
                    setCount(parsed);
               }
          }
     }, []);

     useEffect(() => {
          localStorage.setItem('hk_count', count);
     }, [count]);

     useEffect(() => {
          localStorage.setItem('hk_target', target);
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

     const handleCycleComplete = () => {
     };

     const handleSessionComplete = () => {
          if (immersiveMode) toggleImmersiveMode();
          setShowSummary(true);
          setIsJapaActive(false);
          setIsAutoCounting(false);
          stopBgMusic();
          pauseBhajan();
     };

     const confirmEndSession = () => {
          if (immersiveMode) toggleImmersiveMode();
          setShowCelebration(false);
          setShowSummary(true);
     };

     const handleContinue = () => {
          setShowSummary(false);
          setIsJapaActive(true);
     };

     const handleEndSession = () => {
          if (immersiveMode) toggleImmersiveMode();
          setShowSummary(false);
          setCount(0);
          setSessionStartCount(0);
          setSessionStartTime(null);
          setLiveTimer('00:00');
          setIsJapaActive(false);
          setIsAutoCounting(false);
          setPendingEndSession(false);
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

               <CelebrationModal
                    isOpen={showCelebration}
                    count={count}
                    target={target}
                    onContinue={() => {
                         setShowCelebration(false);
                         setPendingEndSession(false);
                         setIsJapaActive(true);
                    }}
                    onClose={() => {
                         setShowCelebration(false);
                         setPendingEndSession(false);
                    }}
                    isEndSession={pendingEndSession}
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

               {/* Combined Session Stats (Timer + Progress) */}
               <div className={styles.sessionLine}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                         <Clock size={15} style={{ color: 'var(--color-primary)', opacity: 0.9 }} />
                         <span>{liveTimer}</span>
                    </div>
                    <span className={styles.statDivider}>•</span>
                    <span>{roundsCompleted > 0 ? `${roundsCompleted} Cycles Done` : (isTargetMode ? `${Math.round(progressRatio * 100)}%` : 'Invincible')}</span>
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
                              <span style={{ opacity: 0.8 }}>{isTargetMode ? remainingInCycle : count}</span> {isTargetMode ? 'remaining' : 'chants'}
                         </div>

                         <div className={clsx(styles.tapFeedback, isAnimating && styles.animating)}></div>

                         {!isVoiceMode && <div className={styles.tapInstruction}>Tap to Count</div>}
                    </button>

               </motion.div>

               {/* Voice Mode Indicator */}
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
                                             'Enable hands-free chanting! The app will listen for your voice and count automatically when you say "Hare Krishna" or "Krishna".',
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
                                   animate={{ opacity: 1, scale: item.special ? 2 : 1.5, y: -100 }}
                                   exit={{ opacity: 0, scale: 0.8, y: -150 }}
                                   transition={{ duration: 1.5, ease: "easeOut" }}
                                   className={styles.floatingText}
                                   style={{
                                        position: 'absolute',
                                        left: item.x,
                                        top: item.y,
                                        color: item.special ? '#FFD700' : (floatingTextColor || 'var(--color-primary)'),
                                        textShadow: item.special ? '0 0 20px rgba(255, 215, 0, 0.8)' : '0 0 10px rgba(var(--color-primary-rgb), 0.5)',
                                        fontWeight: 'bold',
                                        zIndex: item.special ? 10001 : 9999,
                                        whiteSpace: 'nowrap'
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

export default HareKrishnaHome;
