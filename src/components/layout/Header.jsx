import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flower, Settings, Sun, Moon, WifiOff, CloudUpload, Shield } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useStats } from '../../context/StatsContext';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const { isOnline, pendingSync } = useStats();
    const { user } = useAuth();

    return (
        <header className={styles.header}>
            <div className={`container ${styles.headerContent}`}>
                <NavLink to="/" className={styles.logo}>
                    <Flower className={styles.logoIcon} size={28} />
                    <span className="text-gradient">Divine Name</span>
                </NavLink>

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

                    <button
                        onClick={toggleTheme}
                        className={styles.navLink}
                        title="Toggle Theme"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                    </button>
                    {user?.role === 'admin' && (
                        <NavLink
                            to="/admin"
                            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
                            title="Admin Panel"
                        >
                            <Shield size={24} />
                        </NavLink>
                    )}
                    <NavLink
                        to="/settings"
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
                        title="Settings"
                    >
                        <Settings size={24} />
                    </NavLink>
                </nav>
            </div>
        </header>
    );
};

export default Header;
