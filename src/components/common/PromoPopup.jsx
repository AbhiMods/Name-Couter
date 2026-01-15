import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Zap } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { usePromo } from '../../context/PromoContext';
import Button from '../ui/Button';

const PromoPopup = () => {
     const { promo, isVisible, dismissPromo } = usePromo();
     const location = useLocation();

     const allowedRoutes = ['/', '/music'];
     const shouldRender = isVisible && promo && allowedRoutes.includes(location.pathname);

     if (!shouldRender) return null;

     return (
          <AnimatePresence>
               {shouldRender && (
                    <motion.div
                         initial={{ opacity: 0, y: 100, scale: 0.9 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         exit={{ opacity: 0, y: 100, scale: 0.9 }}
                         transition={{ type: "spring", damping: 20, stiffness: 300 }}
                         style={{
                              position: 'fixed',
                              bottom: '90px',
                              left: '16px',
                              right: '16px',
                              maxWidth: '400px',
                              margin: '0 auto',
                              zIndex: 10000,
                         }}
                    >
                         <div style={{
                              background: 'rgba(20, 20, 20, 0.90)',
                              backdropFilter: 'blur(20px)',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              borderRadius: '24px',
                              padding: '0',
                              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                              overflow: 'hidden',
                              display: 'flex',
                              flexDirection: 'column'
                         }}>
                              {/* 1. Image Section (Optional) */}
                              {promo.image && (
                                   <div style={{ width: '100%', height: '140px', overflow: 'hidden', position: 'relative' }}>
                                        <img
                                             src={promo.image}
                                             alt="Promo"
                                             style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <div style={{
                                             position: 'absolute', inset: 0,
                                             background: 'linear-gradient(to bottom, transparent 0%, rgba(20,20,20,0.9) 100%)'
                                        }} />
                                   </div>
                              )}

                              <div style={{ padding: '20px', paddingTop: promo.image ? '0' : '20px' }}>
                                   {/* Decorative Glow */}
                                   <div style={{
                                        position: 'absolute',
                                        top: '0%',
                                        right: '0%',
                                        width: '150px',
                                        height: '150px',
                                        background: 'radial-gradient(circle, rgba(var(--color-primary-rgb), 0.2) 0%, transparent 70%)',
                                        pointerEvents: 'none',
                                        zIndex: 0
                                   }} />

                                   <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                                        {!promo.image && (
                                             <div style={{
                                                  width: '44px',
                                                  height: '44px',
                                                  borderRadius: '14px',
                                                  background: 'linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.3), rgba(var(--color-primary-rgb), 0.1))',
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                  color: 'var(--color-primary)',
                                                  flexShrink: 0,
                                                  border: '1px solid rgba(var(--color-primary-rgb), 0.2)'
                                             }}>
                                                  <Zap size={22} />
                                             </div>
                                        )}

                                        <div style={{ color: 'white', flex: 1 }}>
                                             <h3 style={{
                                                  margin: '0 0 6px 0',
                                                  fontSize: '17px',
                                                  fontWeight: '700',
                                                  fontFamily: 'var(--font-display)',
                                                  letterSpacing: '0.5px'
                                             }}>
                                                  Announcement
                                             </h3>
                                             <p style={{
                                                  margin: 0,
                                                  fontSize: '14px',
                                                  opacity: 0.85,
                                                  lineHeight: '1.5',
                                                  color: '#E0E0E0'
                                             }}>
                                                  {promo.text}
                                             </p>
                                        </div>
                                   </div>

                                   {/* Action Buttons: Left Dismiss, Right Join */}
                                   <div style={{ display: 'flex', gap: '12px', marginTop: '20px', position: 'relative', zIndex: 1 }}>
                                        <Button
                                             variant="ghost"
                                             style={{ flex: 1, justifyContent: 'center', background: 'rgba(255,255,255,0.05)', height: '44px' }}
                                             onClick={dismissPromo}
                                        >
                                             {promo.secondaryText || 'Cancel'}
                                        </Button>

                                        <Button
                                             variant="primary"
                                             style={{ flex: 1.5, justifyContent: 'center', height: '44px', position: 'relative', overflow: 'hidden' }}
                                             onClick={() => {
                                                  window.open(promo.url, '_blank');
                                                  dismissPromo(); // Close after clicking join
                                             }}
                                        >
                                             {/* Shine Animation */}
                                             <motion.div
                                                  style={{
                                                       position: 'absolute',
                                                       top: 0,
                                                       left: '-100%',
                                                       width: '50%',
                                                       height: '100%',
                                                       background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                                                       transform: 'skewX(-20deg)'
                                                  }}
                                                  animate={{ left: '200%' }}
                                                  transition={{
                                                       repeat: Infinity,
                                                       duration: 2,
                                                       ease: "easeInOut",
                                                       repeatDelay: 1
                                                  }}
                                             />

                                             <span style={{ fontWeight: '600', letterSpacing: '0.5px' }}>
                                                  {promo.buttonText || 'Join'}
                                             </span>
                                        </Button>
                                   </div>
                              </div>
                         </div>
                    </motion.div>
               )}
          </AnimatePresence>
     );
};

export default PromoPopup;
