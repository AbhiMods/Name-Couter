import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flower, Settings, WifiOff, CloudUpload, User, Shield } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useStats } from '../../context/StatsContext';
import styles from './Header.module.css';

const Header = () => {
    const { isOnline, pendingSync } = useStats();

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
                        to="/counters"
                        className={({ isActive }) =>
                            isActive ? `${styles.desktopNavLink} ${styles.desktopNavLinkActive}` : styles.desktopNavLink
                        }
                    >
                        Name Counter
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

                    <NavLink
                        to="/settings"
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
                        title="Settings"
                    >
                        <Settings size={24} />
                    </NavLink>

                    {/* Temporary Admin Link for direct access if needed, or remove completely. 
                        User asked to remove login system. Usually admin is protected. 
                        If they want to remove everything, I'll remove the admin link too for now 
                        or leave it hidden/accessible only via URL. 
                        I will remove the button from UI to be clean. */}
                </nav>
            </div>
        </header>
    );
};

export default Header;
