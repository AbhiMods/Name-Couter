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

const Layout = () => {
    const { immersiveMode } = useTheme();
    const { isPlaying } = useBhajan();
    const navigate = useNavigate();
    const location = useLocation();

    // Visibility Logic:
    const isChantPage = location.pathname === '/radha-naam-jap-counter';
    const isMusicPage = location.pathname.startsWith('/music');
    const isShortsPage = location.pathname.startsWith('/shorts');
    const isLibraryPage = location.pathname === '/library';

    // Allowed pages for Mini Player (Home & Library)
    const isAllowedPage = !isMusicPage && !isShortsPage && !immersiveMode;

    // Delayed hiding logic
    const [delayedShowPlayer, setDelayedShowPlayer] = useState(isPlaying && isAllowedPage);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (isPlaying && isAllowedPage) {
            // Case 1: Playing on allowed page -> SHOW
            setDelayedShowPlayer(true);
            setIsExiting(false);
        } else if (!isAllowedPage) {
            // Case 2: Navigated to disallowed page (Music/Shorts) -> HIDE IMMEDIATELY
            setIsExiting(true);
            const timer = setTimeout(() => setDelayedShowPlayer(false), 400); // Match exit animation
            return () => clearTimeout(timer);
        } else {
            // Case 3: Paused on allowed page -> HIDE AFTER DELAY
            const timer = setTimeout(() => {
                setIsExiting(true);
                setTimeout(() => setDelayedShowPlayer(false), 400);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isPlaying, isAllowedPage]);

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

    // Swipe Navigation Logic
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd || immersiveMode) return; // Disable swipe in Immersive Mode
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        const tabs = ['/', '/library', '/shorts', '/music'];
        const currentIndex = tabs.findIndex(path => location.pathname === path);

        if (currentIndex === -1) return; // Not on a main tab

        if (isLeftSwipe) {
            // Next Tab
            if (currentIndex < tabs.length - 1) {
                navigate(tabs[currentIndex + 1]);
            }
        }
        if (isRightSwipe) {
            // Prev Tab
            if (currentIndex > 0) {
                navigate(tabs[currentIndex - 1]);
            }
        }
    };

    return (
        <div
            className={styles.layout}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
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
            {!immersiveMode && <BottomNav />}
        </div>
    );
};

export default Layout;
