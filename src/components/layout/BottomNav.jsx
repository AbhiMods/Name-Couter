import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart2, Sparkles, Music2 } from 'lucide-react';
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
                    to="/counters"
                    className={({ isActive }) =>
                        isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
                    }
                >
                    <div className={styles.iconWrapper}>
                        <Sparkles size={24} className={styles.icon} />
                    </div>
                    <span className={styles.label}>Spiritual</span>
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
                            <Music2 size={24} className={styles.icon} />
                        )}
                    </div>
                    <span className={styles.label}>Music</span>
                </NavLink>

                <NavLink
                    to="/progress"
                    className={({ isActive }) =>
                        isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
                    }
                >
                    <div className={styles.iconWrapper}>
                        <BarChart2 size={24} className={styles.icon} />
                    </div>
                    <span className={styles.label}>Progress</span>
                </NavLink>
            </div>
        </nav>
    );
};

export default BottomNav;
