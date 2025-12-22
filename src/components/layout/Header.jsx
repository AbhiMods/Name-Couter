import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Flower, Settings, Sun, Moon, WifiOff, CloudUpload, Shield, User, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useStats } from '../../context/StatsContext';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../auth/AuthModal';
import styles from './Header.module.css';

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const { isOnline, pendingSync } = useStats();
    const { user, logout } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    React.useEffect(() => {
        const params = new URLSearchParams(location.search);
        const authAction = params.get('auth');
        if (authAction === 'login' || authAction === 'register') {
            setIsAuthModalOpen(true);
        }
    }, [location.search]);

    return (
        <header className={styles.header}>
            <div className={`container ${styles.headerContent}`}>
                <NavLink to="/" className={styles.logo}>
                    <Flower className={styles.logoIcon} size={28} />
                    <span className="text-gradient">Name Couter</span>
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



                    {user ? (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <NavLink
                                to="/profile"
                                className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
                                title="My Profile"
                            >
                                <User size={24} />
                            </NavLink>

                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className={styles.navLink}
                            title="Login / Register"
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <User size={24} />
                        </button>
                    )}

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
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </header>
    );
};

export default Header;
