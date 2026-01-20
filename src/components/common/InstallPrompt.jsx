import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download } from 'lucide-react';
import Button from '../ui/Button';

const InstallPrompt = () => {
     const [deferredPrompt, setDeferredPrompt] = useState(null);
     const [isVisible, setIsVisible] = useState(false);
     const [isInstalled, setIsInstalled] = useState(false);

     useEffect(() => {
          // Check if already in standalone mode
          if (window.matchMedia('(display-mode: standalone)').matches) {
               setIsInstalled(true);
          }

          const handleBeforeInstallPrompt = (e) => {
               // Prevent the mini-infobar from appearing on mobile
               e.preventDefault();
               // Stash the event so it can be triggered later.
               setDeferredPrompt(e);
               // Update UI notify the user they can install the PWA
               setIsVisible(true);
          };

          const handleAppInstalled = () => {
               setIsInstalled(true);
               setIsVisible(false);
               setDeferredPrompt(null);
               console.log('PWA was installed');
          };

          window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
          window.addEventListener('appinstalled', handleAppInstalled);

          return () => {
               window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
               window.removeEventListener('appinstalled', handleAppInstalled);
          };
     }, []);

     const handleInstallClick = async () => {
          if (!deferredPrompt) return;

          // Show the install prompt
          deferredPrompt.prompt();

          // Wait for the user to respond to the prompt
          const { outcome } = await deferredPrompt.userChoice;
          console.log(`User response to the install prompt: ${outcome}`);

          // We've used the prompt, so clear it
          setDeferredPrompt(null);
          setIsVisible(false);
     };



     if (!isVisible || isInstalled) return null;

     return (
          <AnimatePresence>
               {isVisible && (
                    <motion.div
                         initial={{ opacity: 0, y: 100, scale: 0.9 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         exit={{ opacity: 0, y: 100, scale: 0.9 }}
                         transition={{ type: "spring", damping: 20, stiffness: 300 }}
                         style={{
                              position: 'fixed',
                              bottom: '90px', // Matches PromoPopup positioning
                              left: '16px',
                              right: '16px',
                              maxWidth: '400px',
                              margin: '0 auto',
                              zIndex: 9999, // Slightly below PromoPopup if both exist
                         }}
                    >
                         <div style={{
                              background: 'rgba(20, 20, 20, 0.90)',
                              backdropFilter: 'blur(20px)',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              borderRadius: '24px',
                              padding: '20px',
                              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                              overflow: 'hidden',
                              display: 'flex',
                              flexDirection: 'column',
                              position: 'relative'
                         }}>
                              {/* Decorative Glow */}
                              <div style={{
                                   position: 'absolute',
                                   top: '-50%',
                                   right: '-20%',
                                   width: '200px',
                                   height: '200px',
                                   background: 'radial-gradient(circle, rgba(var(--color-primary-rgb), 0.15) 0%, transparent 70%)',
                                   pointerEvents: 'none',
                              }} />

                              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                                   <div style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '16px',
                                        background: 'linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.3), rgba(var(--color-primary-rgb), 0.1))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--color-primary)',
                                        flexShrink: 0,
                                        border: '1px solid rgba(var(--color-primary-rgb), 0.2)'
                                   }}>
                                        <Download size={24} />
                                   </div>

                                   <div style={{ color: 'white', flex: 1, paddingRight: '20px' }}>
                                        <h3 style={{
                                             margin: '0 0 4px 0',
                                             fontSize: '17px',
                                             fontWeight: '700',
                                             fontFamily: 'var(--font-display)',
                                             letterSpacing: '0.5px'
                                        }}>
                                             Install App
                                        </h3>
                                        <p style={{
                                             margin: 0,
                                             fontSize: '13px',
                                             opacity: 0.8,
                                             lineHeight: '1.4',
                                             color: '#E0E0E0'
                                        }}>
                                             Install our app for a better, fullscreen experience.
                                        </p>
                                   </div>
                              </div>

                              <div style={{ marginTop: '20px', width: '100%', position: 'relative', zIndex: 1 }}>
                                   <Button
                                        variant="primary"
                                        style={{
                                             width: '100%',
                                             justifyContent: 'center',
                                             height: '48px',
                                             position: 'relative',
                                             overflow: 'hidden',
                                             borderRadius: '16px'
                                        }}
                                        onClick={handleInstallClick}
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
                                        <span style={{ fontWeight: '600', letterSpacing: '0.5px', fontSize: '15px' }}>
                                             Install Now
                                        </span>
                                   </Button>
                              </div>
                         </div>
                    </motion.div>
               )}
          </AnimatePresence>
     );
};

export default InstallPrompt;
