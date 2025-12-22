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
    const shouldShowPlayer = isPlaying && !isHome && !immersiveMode;

    const isMusicInfo = location.pathname.startsWith('/music');

    return (
        <div className={styles.layout}>
            {!immersiveMode && <Header />}
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
            {shouldShowPlayer && <MiniPlayer onExpand={() => navigate('/music')} />}
            {!immersiveMode && <Footer />}
            {!immersiveMode && <BottomNav />}
        </div>
    );
};

export default Layout;
