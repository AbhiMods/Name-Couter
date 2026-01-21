import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlayCircle, Music, LibraryBig } from 'lucide-react'; // Changed Clapperboard to PlayCircle
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
                    to="/aastha"
                    className={({ isActive }) =>
                        isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
                    }
                >
                    <div className={styles.iconWrapper}>
                        <PlayCircle size={24} className={styles.icon} />
                    </div>
                    <span className={styles.label}>Aastha</span>
                </NavLink>

                <NavLink
                    to="/bhajan"
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
                    <span className={styles.label}>Bhajan</span>
                </NavLink>

                <NavLink
                    to="/library"
                    className={({ isActive }) =>
                        isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
                    }
                >
                    <div className={styles.iconWrapper}>
                        <LibraryBig size={24} className={styles.icon} />
                    </div>
                    <span className={styles.label}>Library</span>
                </NavLink>
            </div>
        </nav>
    );
};

export default BottomNav;
