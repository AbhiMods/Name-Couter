import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Sparkles, Clapperboard, Music } from 'lucide-react';
import styles from './BottomNav.module.css';
import { useBhajan } from '../../context/BhajanContext';

const BottomNav = () => {
    const { isPlaying } = useBhajan();

    return (
        <nav className={styles.bottomNav}>
            <div className={styles.navContainer}>
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                        isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
                    }
                >
                    <div className={styles.iconWrapper}>
                        <Home size={24} className={styles.icon} />
                    </div>
                    <span className={styles.label}>Home</span>
                </NavLink>

                <NavLink
                    to="/name-counter-tools"
                    className={({ isActive }) =>
                        isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
                    }
                >
                    <div className={styles.iconWrapper}>
                        <Sparkles size={24} className={styles.icon} />
                    </div>
                    <span className={styles.label}>Tools</span>
                </NavLink>

                <NavLink
                    to="/shorts"
                    className={({ isActive }) =>
                        isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
                    }
                >
                    <div className={styles.iconWrapper}>
                        <Clapperboard size={24} className={styles.icon} />
                    </div>
                    <span className={styles.label}>Shorts</span>
                </NavLink>

                <NavLink
                    to="/music"
                    className={({ isActive }) =>
                        isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
                    }
                >
                    <div className={styles.iconWrapper}>
                        {isPlaying ? (
                            <div className={styles.visualizer}>
                                <div className={styles.bar} />
                                <div className={styles.bar} />
                                <div className={styles.bar} />
                            </div>
                        ) : (
                            <Music size={24} className={styles.icon} />
                        )}
                    </div>
                    <span className={styles.label}>Music</span>
                </NavLink>
            </div>
        </nav>
    );
};

export default BottomNav;
