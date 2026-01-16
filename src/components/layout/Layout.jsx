import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';
import MiniPlayer from '../chant/MiniPlayer';
import PromoPopup from '../common/PromoPopup';
import FeaturePopup from '../common/FeaturePopup';
import FeedbackPopup from '../common/FeedbackPopup';
import styles from './Layout.module.css';
import { useTheme } from '../../context/ThemeContext';
import { useBhajan } from '../../context/BhajanContext';
import clsx from 'clsx';

const Layout = () => {
    const { immersiveMode } = useTheme();
    const { currentSong, isPlaying } = useBhajan();
    const navigate = useNavigate();
    const location = useLocation();

    // Visibility Logic:
    // 1. Never on Home ('/')
    // 2. Only if playing (or paused with active song? User said "Hidden instantly when music stops or pauses" -> strictly isPlaying)
    // 3. Never in Immersive Mode
    const isHome = location.pathname === '/';
    const isMusicPage = location.pathname.startsWith('/music');
    const isShortsPage = location.pathname.startsWith('/shorts');

    // Hide global player on Music & Shorts pages
    const shouldShowPlayer = isPlaying && !isMusicPage && !isShortsPage && !immersiveMode;

    // Delayed hiding logic
    const [delayedShowPlayer, setDelayedShowPlayer] = React.useState(shouldShowPlayer);
    const [isExiting, setIsExiting] = React.useState(false);

    React.useEffect(() => {
        if (shouldShowPlayer) {
            setDelayedShowPlayer(true);
            setIsExiting(false);
        } else {
            // Start exit animation
            setIsExiting(true);
            const timer = setTimeout(() => {
                setDelayedShowPlayer(false);
                setIsExiting(false);
            }, 4000); // 4 seconds delay as requested
            return () => clearTimeout(timer);
        }
    }, [shouldShowPlayer]);

    const isFullPage = isMusicPage || isShortsPage;
    // Basic mobile detection (width < 768px)
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Only hide header on Shorts page
    const shouldHideHeader = isShortsPage && isMobile;

    // Swipe Navigation Logic
    const [touchStart, setTouchStart] = React.useState(null);
    const [touchEnd, setTouchEnd] = React.useState(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        const tabs = ['/', '/counters', '/shorts', '/music'];
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
                className={clsx(styles.main, shouldShowPlayer && styles.mainWithPlayer)}
                style={isFullPage ? { padding: 0 } : {}}
            >
                <div
                    className="container"
                    style={
                        immersiveMode || isFullPage
                            ? { height: '100vh', padding: 0, maxWidth: '100%' }
                            : {}
                    }
                >
                    <Outlet />
                </div>
            </main>
            {delayedShowPlayer && <MiniPlayer onExpand={() => navigate('/music')} isExiting={isExiting} />}
            <PromoPopup />
            <FeaturePopup />
            <FeedbackPopup />
            {!immersiveMode && !isShortsPage && <Footer />}
            {!immersiveMode && <BottomNav />}
        </div>
    );
};

export default Layout;
