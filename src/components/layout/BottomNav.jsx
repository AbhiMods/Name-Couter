import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart2, Settings, Music2 } from 'lucide-react';
import styles from './BottomNav.module.css';
import { useBhajan } from '../../context/BhajanContext';

const BottomNav = () => {
    // We assume useBhajan is available. If not, we can skip the animation or add import.
    // Ideally we import it: import { useBhajan } from '../../context/BhajanContext';
    // But since I cannot see imports in this replace block easily, I will just stick to structure updates first.
    // Wait, I can see imports at the top of file view.

    // Let's modify the whole file content to be safe and include the hook.
    // Since this tool replaces a block, I'll target the whole component.

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

                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
                    }
                >
                    <div className={styles.iconWrapper}>
                        <Settings size={24} className={styles.icon} />
                    </div>
                    <span className={styles.label}>Settings</span>
                </NavLink>
            </div>
        </nav>
    );
};

export default BottomNav;
