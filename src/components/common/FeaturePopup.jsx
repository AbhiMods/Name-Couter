import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { useFeature } from '../../context/FeatureContext';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const FeaturePopup = () => {
     const { feature, isVisible, dismissFeature } = useFeature();
     const navigate = useNavigate();

     // If dismissed or no feature, don't show
     if (!isVisible || !feature) return null;

     const handleAction = () => {
          dismissFeature();
          if (feature.targetPath) {
               if (feature.targetPath.startsWith('http')) {
                    window.open(feature.targetPath, '_blank');
               } else {
                    navigate(feature.targetPath);
               }
          }
     };

     return (
          <AnimatePresence>
               {isVisible && (
                    <motion.div
                         initial={{ opacity: 0, y: 150, scale: 0.9 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         exit={{ opacity: 0, y: 150, scale: 0.9 }}
                         transition={{ type: "spring", damping: 22, stiffness: 260 }}
                         style={{
                              position: 'fixed',
                              bottom: '90px',
                              left: '16px',
                              right: '16px',
                              maxWidth: '400px',
                              margin: '0 auto',
                              zIndex: 10002, // Topmost
                         }}
                    >
                         <div style={{
                              background: 'rgba(20, 20, 25, 0.95)',
                              backdropFilter: 'blur(20px)',
                              borderRadius: '24px',
                              boxShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,215,0,0.15)',
                              overflow: 'hidden',
                              display: 'flex',
                              flexDirection: 'column',
                              position: 'relative'
                         }}>
                              {/* Image Header with Gradient Overlay */}
                              {feature.image && (
                                   <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative' }}>
                                        <motion.img
                                             initial={{ scale: 1.1 }}
                                             animate={{ scale: 1 }}
                                             transition={{ duration: 10 }}
                                             src={feature.image}
                                             alt="Feature"
                                             style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <div style={{
                                             position: 'absolute', inset: 0,
                                             background: 'linear-gradient(to bottom, transparent 40%, rgba(20,20,25,0.95) 100%)'
                                        }} />

                                        {/* Close Button (Floating) */}
                                        <button
                                             onClick={dismissFeature}
                                             style={{
                                                  position: 'absolute',
                                                  top: '12px',
                                                  right: '12px',
                                                  background: 'rgba(0,0,0,0.4)',
                                                  border: '1px solid rgba(255,255,255,0.1)',
                                                  borderRadius: '50%',
                                                  width: '32px',
                                                  height: '32px',
                                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                  cursor: 'pointer',
                                                  color: 'white',
                                                  backdropFilter: 'blur(8px)',
                                                  zIndex: 10
                                             }}
                                        >
                                             <X size={16} />
                                        </button>
                                   </div>
                              )}

                              <div style={{ padding: '24px', paddingTop: feature.image ? '0' : '24px', position: 'relative', textAlign: 'center' }}>
                                   {/* Decorative Sparkle (Absolute) */}
                                   {!feature.image && (
                                        <div style={{
                                             position: 'absolute', top: '-10px', right: '-10px',
                                             color: 'rgba(255,215,0,0.1)', transform: 'rotate(15deg)'
                                        }}>
                                             <Sparkles size={100} strokeWidth={1} />
                                        </div>
                                   )}

                                   {/* Badge - Centered */}
                                   <div style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        marginBottom: '12px',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        background: 'linear-gradient(90deg, rgba(255,215,0,0.15), rgba(255,165,0,0.1))',
                                        border: '1px solid rgba(255,215,0,0.3)',
                                        color: '#FFD700', fontSize: '11px',
                                        fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px'
                                   }}>
                                        <Sparkles size={12} fill="#FFD700" />
                                        <span>New Update</span>
                                   </div>

                                   <h3 style={{
                                        margin: '0 0 8px 0',
                                        color: 'white',
                                        fontSize: '22px',
                                        fontWeight: '700',
                                        fontFamily: 'var(--font-display)',
                                        letterSpacing: '0.5px',
                                        lineHeight: '1.2'
                                   }}>
                                        {feature.title}
                                   </h3>

                                   <p style={{
                                        margin: '0 0 24px 0',
                                        color: 'rgba(255,255,255,0.7)',
                                        fontSize: '15px',
                                        lineHeight: '1.5'
                                   }}>
                                        {feature.description}
                                   </p>

                                   {/* Primary Action Button with Shine - Smaller & Centered */}
                                   <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Button
                                             variant="primary"
                                             style={{
                                                  width: 'auto',
                                                  minWidth: '160px',
                                                  padding: '0 24px',
                                                  justifyContent: 'center',
                                                  height: '44px', // Reduced height
                                                  borderRadius: '22px', // More rounded
                                                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                                  color: 'black',
                                                  fontWeight: '700',
                                                  fontSize: '14px', // Smaller font
                                                  letterSpacing: '0.5px',
                                                  position: 'relative',
                                                  overflow: 'hidden',
                                                  border: 'none',
                                                  outline: 'none',
                                                  boxShadow: '0 4px 15px rgba(255, 165, 0, 0.4)'
                                             }}
                                             onClick={handleAction}
                                        >
                                             {/* Shine Effect */}
                                             <motion.div
                                                  style={{
                                                       position: 'absolute',
                                                       top: 0,
                                                       left: '-100%',
                                                       width: '50%',
                                                       height: '100%',
                                                       background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                                                       transform: 'skewX(-20deg)'
                                                  }}
                                                  animate={{ left: '250%' }}
                                                  transition={{
                                                       repeat: Infinity,
                                                       duration: 3,
                                                       ease: "easeInOut",
                                                       repeatDelay: 1
                                                  }}
                                             />
                                             <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
                                                  {feature.buttonText || 'Try Now'}
                                                  <ArrowRight size={16} style={{ marginLeft: '6px' }} strokeWidth={2.5} />
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

export default FeaturePopup;
