import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <p>
                    Made with <span className={styles.heart}>♥</span> Abhishek
                </p>
            </div>
        </footer>
    );
};

export default Footer;
