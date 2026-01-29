import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OfflineIndicator = () => {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <AnimatePresence>
            {isOffline && (
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        position: 'fixed',
                        bottom: '90px', // Raised to clear bottom nav
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10000, // Higher than bottom nav
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        backgroundColor: 'rgba(189, 43, 43, 0.95)', // Slightly translucent red
                        backdropFilter: 'blur(8px)', // Glass effect
                        color: 'white',
                        borderRadius: '24px', // Standard pill shape
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
                        fontWeight: '500',
                        fontSize: '0.85rem',
                        pointerEvents: 'none',
                        whiteSpace: 'nowrap'
                    }}
                >
                    <WifiOff size={18} />
                    <span>You are offline</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OfflineIndicator;
