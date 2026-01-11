import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import Button from '../ui/Button';

const FeatureGuideModal = ({ isOpen, title, description, onConfirm, onClose }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(8px)'
                }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '24px',
                        padding: '2rem',
                        maxWidth: '400px',
                        width: '100%',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                        textAlign: 'center'
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <h3 style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: 'var(--color-primary)',
                            fontFamily: 'var(--font-display)'
                        }}>
                            {title}
                        </h3>
                        <p style={{
                            color: 'var(--color-text-secondary)',
                            lineHeight: '1.6',
                            fontSize: '1rem'
                        }}>
                            {description}
                        </p>
                    </div>

                    <Button
                        variant="primary"
                        onClick={onConfirm}
                        className="w-full"
                        style={{ padding: '0.75rem', fontSize: '1.1rem' }}
                    >
                        <Check size={20} />
                        <span>Got it!</span>
                    </Button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default FeatureGuideModal;
