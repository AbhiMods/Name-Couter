import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import styles from './Layout.module.css';
import { useTheme } from '../../context/ThemeContext';

const Layout = () => {
    const { immersiveMode } = useTheme();

    return (
        <div className={styles.layout}>
            {!immersiveMode && <Header />}
            <main className={styles.main}>
                <div className="container" style={immersiveMode ? { height: '100vh', padding: 0, maxWidth: '100%' } : {}}>
                    <Outlet />
                </div>
            </main>
            {!immersiveMode && <Footer />}
        </div>
    );
};

export default Layout;
