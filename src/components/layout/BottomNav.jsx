import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart2, Settings, Music2 } from 'lucide-react';
import styles from './BottomNav.module.css';

const BottomNav = () => {
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
                    <Home size={24} className={styles.icon} />
                    <span className={styles.label}>Home</span>
                </NavLink>

                <NavLink
                    to="/music"
                    className={({ isActive }) =>
                        isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
                    }
                >
                    <Music2 size={24} className={styles.icon} />
                    <span className={styles.label}>Music</span>
                </NavLink>

                <NavLink
                    to="/progress"
                    className={({ isActive }) =>
                        isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
                    }
                >
                    <BarChart2 size={24} className={styles.icon} />
                    <span className={styles.label}>Progress</span>
                </NavLink>

                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
                    }
                >
                    <Settings size={24} className={styles.icon} />
                    <span className={styles.label}>Settings</span>
                </NavLink>
            </div>
        </nav>
    );
};

export default BottomNav;
