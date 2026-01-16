import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flower, WifiOff, CloudUpload, Sun, Moon, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useStats } from '../../context/StatsContext';
import styles from './Header.module.css';

const Header = () => {
    const { isOnline, pendingSync } = useStats();
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <header className={styles.header}>
            <div className={`container ${styles.headerContent}`}>
                <NavLink to="/" className={styles.logo}>
                    <Flower className={styles.logoIcon} size={28} />
                    <span className="text-gradient">Name Couter</span>
                </NavLink>

                {/* Desktop Navigation */}
                <nav className={styles.desktopNav}>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive ? `${styles.desktopNavLink} ${styles.desktopNavLinkActive}` : styles.desktopNavLink
                        }
                        end
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/shorts"
                        className={({ isActive }) =>
                            isActive ? `${styles.desktopNavLink} ${styles.desktopNavLinkActive}` : styles.desktopNavLink
                        }
                    >
                        Shorts
                    </NavLink>
                    <NavLink
                        to="/music"
                        className={({ isActive }) =>
                            isActive ? `${styles.desktopNavLink} ${styles.desktopNavLinkActive}` : styles.desktopNavLink
                        }
                    >
                        Music
                    </NavLink>
                    <NavLink
                        to="/progress"
                        className={({ isActive }) =>
                            isActive ? `${styles.desktopNavLink} ${styles.desktopNavLinkActive}` : styles.desktopNavLink
                        }
                    >
                        Progress
                    </NavLink>
                </nav>

                <nav className={styles.nav}>
                    {!isOnline && (
                        <div title="Offline Mode" className={styles.navLink} style={{ color: 'var(--color-text-secondary)' }}>
                            <WifiOff size={20} />
                        </div>
                    )}
                    {isOnline && pendingSync && (
                        <div title="Syncing..." className={styles.navLink} style={{ color: 'var(--color-primary)' }}>
                            <CloudUpload size={20} className="animate-bounce" />
                        </div>
                    )}

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={styles.navLink}
                        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
                    </button>

                    {/* Progress Link - Formerly Bottom Nav */}
                    <NavLink
                        to="/progress"
                        className={styles.navLink}
                        title="Your Progress"
                        style={{ color: 'var(--color-text-primary)' }}
                    >
                        <User size={24} />
                    </NavLink>
                </nav>
            </div>
        </header>
    );
};

export default Header;
