import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';
import PromoPopup from '../common/PromoPopup';
import FeaturePopup from '../common/FeaturePopup';
import FeedbackPopup from '../common/FeedbackPopup';
import InstallPrompt from '../common/InstallPrompt';
import styles from './Layout.module.css';
import { useTheme } from '../../context/ThemeContext';
import { useBhajan } from '../../context/BhajanContext';
import clsx from 'clsx';
import BottomPlayerBar from '../music/BottomPlayerBar';

const Layout = () => {
    const { immersiveMode } = useTheme();
    const { isPlaying } = useBhajan();
    const navigate = useNavigate();
    const location = useLocation();

    // Visibility Logic:
    const isChantPage = location.pathname === '/radha-naam-jap-counter';
    const isMusicPage = location.pathname.startsWith('/bhajan');
    const isShortsPage = location.pathname.startsWith('/aastha');
    const isLibraryPage = location.pathname === '/library';

    // Allowed pages for Mini Player (Home, Library, & Bhajan)
    // User requested Player to be visible in Bhajan section too.
    // Hidden only in Aastha (Shorts) and Zen Mode.
    const isAllowedPage = !isShortsPage && !immersiveMode;

    // Delayed hiding logic
    const [delayedShowPlayer, setDelayedShowPlayer] = useState(isPlaying && isAllowedPage);
    const [isExiting, setIsExiting] = useState(false);

    // Auto-Stop/Resume for Aastha (Shorts)
    // We use a ref to track if music was playing BEFORE entering Aastha
    const wasPlayingBeforeAastha = React.useRef(false);

    useEffect(() => {
        if (isShortsPage) {
            // Entering Aastha
            if (isPlaying) {
                wasPlayingBeforeAastha.current = true;
                // We need to pause. We can import pause from useBhajan inside component
                // defined below as `pauseBhajan`
            }
            // Note: We can't call pause here because we need the function from context.
            // We'll handle side-effects in a separate effect that has access to `play` and `pause`.
        } else {
            // Leaving Aastha (or regular navigation)
            // If we just left Aastha and stored state is true, resume.
            // But we need to know if we JUST left Aastha.
            // This logic is tricky in a single effect. Use a separate effect below.
        }
    }, [isShortsPage, isPlaying]);

    useEffect(() => {
        if (isPlaying && isAllowedPage) {
            // Case 1: Playing on allowed page -> SHOW
            setDelayedShowPlayer(true);
            setIsExiting(false);
        } else if (!isAllowedPage) {
            // Case 2: Navigated to disallowed page (Aastha) -> HIDE IMMEDIATELY
            setIsExiting(true);
            const timer = setTimeout(() => setDelayedShowPlayer(false), 400);
            return () => clearTimeout(timer);
        } else {
            // Case 3: Paused on allowed page -> HIDE AFTER DELAY (2s)
            const timer = setTimeout(() => {
                setIsExiting(true);
                setTimeout(() => setDelayedShowPlayer(false), 400);
            }, 2000); // Updated to 2 seconds per user request
            return () => clearTimeout(timer);
        }
    }, [isPlaying, isAllowedPage]);

    // Aastha Resume Logic Implementation
    const { pause: pauseBhajan, play: playBhajan } = useBhajan();
    
    useEffect(() => {
        // When entering Aastha
        if (isShortsPage) {
            if (isPlaying) {
                wasPlayingBeforeAastha.current = true;
                pauseBhajan();
            }
        } 
        // When leaving Aastha (not shorts page, but was playing before)
        else {
             if (wasPlayingBeforeAastha.current) {
                playBhajan();
                wasPlayingBeforeAastha.current = false; // Reset
             }
        }
    }, [isShortsPage]); // Depend on location change (isShortsPage derived from location)
    // Note: We don't depend on `isPlaying` here to avoid loops, only on route switch.

    const isFullPage = isMusicPage || isShortsPage;
    // Basic mobile detection (width < 768px)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Only hide header on Shorts page
    const shouldHideHeader = isShortsPage && isMobile;



    return (
        <div
            className={styles.layout}

        >
            {!immersiveMode && !shouldHideHeader && <Header />}
            <main
                className={clsx(styles.main, delayedShowPlayer && styles.mainWithPlayer)}
                style={isFullPage ? { padding: 0 } : {}}
            >
                <div
                    className={
                        // Don't use 'container' class for Home to allow full-width background
                        // Also full width for immersive/music/shorts
                        immersiveMode || isFullPage || location.pathname === '/' ? '' : 'container'
                    }
                    style={
                        immersiveMode || isFullPage || location.pathname === '/'
                            ? { minHeight: '100vh', padding: 0, maxWidth: '100%' }
                            : {}
                    }
                >
                    <Outlet />
                </div>
            </main>
            <FeaturePopup />
            <FeedbackPopup />
            <InstallPrompt />
            {!immersiveMode && !isShortsPage && <Footer />}
            
            {/* Mini Player */}
            {!immersiveMode && delayedShowPlayer && (
                <BottomPlayerBar 
                     isExiting={isExiting} 
                     onExpand={() => navigate('/bhajan')} 
                />
            )}

            {!immersiveMode && <BottomNav />}
        </div>
    );
};

export default Layout;
