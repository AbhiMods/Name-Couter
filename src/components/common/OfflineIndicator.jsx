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
                        bottom: '24px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 20px',
                        backgroundColor: '#bd2b2b', // Red-ish for warning, or primary color? User wants "offline mode activate", red is clear.
                        color: 'white',
                        borderRadius: '30px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        fontWeight: '500',
                        fontSize: '0.9rem',
                        pointerEvents: 'none' // Don't block clicks
                    }}
                >
                    <WifiOff size={18} />
                    <span>You are offline. App is ready.</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OfflineIndicator;
