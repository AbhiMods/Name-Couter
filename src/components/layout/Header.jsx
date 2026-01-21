import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Flower, WifiOff, CloudUpload, Sun, Moon, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useStats } from '../../context/StatsContext';
import styles from './Header.module.css';

const Header = () => {
    const { isOnline, pendingSync } = useStats();
    const { isDarkMode, toggleTheme } = useTheme();
    const location = useLocation();
    const isHome = location.pathname === '/' || location.pathname === '/chant'; // Apply to both Main List and Chant page? No, just Main List likely. 
    // Actually user said "Home Page". The new Home is '/'.
    // Let's stick to '/' for now. 
    const isTransparent = location.pathname === '/';

    return (
        <header className={`${styles.header} ${isTransparent ? styles.transparentHeader : ''}`}>
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
                        to="/aastha"
                        className={({ isActive }) =>
                            isActive ? `${styles.desktopNavLink} ${styles.desktopNavLinkActive}` : styles.desktopNavLink
                        }
                    >
                        Aastha
                    </NavLink>
                    <NavLink
                        to="/bhajan"
                        className={({ isActive }) =>
                            isActive ? `${styles.desktopNavLink} ${styles.desktopNavLinkActive}` : styles.desktopNavLink
                        }
                    >
                        Bhajan
                    </NavLink>
                    <NavLink
                        to="/library"
                        className={({ isActive }) =>
                            isActive ? `${styles.desktopNavLink} ${styles.desktopNavLinkActive}` : styles.desktopNavLink
                        }
                    >
                        Library
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
