import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';
import MiniPlayer from '../chant/MiniPlayer';
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
    // Hide global player on Music page (because it has its own premium player)
    // We show it on Home now so playback is visible and controllable
    const shouldShowPlayer = isPlaying && !isMusicPage && !immersiveMode;

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

    const isMusicInfo = location.pathname.startsWith('/music');
    // Basic mobile detection (width < 768px)
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const shouldHideHeader = isMusicPage && isMobile;

    return (
        <div className={styles.layout}>
            {!immersiveMode && !shouldHideHeader && <Header />}
            <main
                className={clsx(styles.main, shouldShowPlayer && styles.mainWithPlayer)}
                style={isMusicInfo ? { padding: 0 } : {}}
            >
                <div
                    className="container"
                    style={
                        immersiveMode
                            ? { height: '100vh', padding: 0, maxWidth: '100%' }
                            : (isMusicInfo ? { padding: 0, maxWidth: '100%' } : {})
                    }
                >
                    <Outlet />
                </div>
            </main>
            {delayedShowPlayer && <MiniPlayer onExpand={() => navigate('/music')} isExiting={isExiting} />}
            {!immersiveMode && !isMusicPage && <Footer />}
            {!immersiveMode && <BottomNav />}
        </div>
    );
};

export default Layout;
