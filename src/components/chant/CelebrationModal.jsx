import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCcw, PartyPopper } from 'lucide-react';
import Button from '../ui/Button';
import styles from './CelebrationModal.module.css';
import confetti from 'canvas-confetti';

const CelebrationModal = ({ isOpen, count, target, onContinue, onClose }) => {
     useEffect(() => {
          if (isOpen) {
               // Fire confetti
               const duration = 3000;
               const end = Date.now() + duration;

               const frame = () => {
                    confetti({
                         particleCount: 2,
                         angle: 60,
                         spread: 55,
                         origin: { x: 0 },
                         colors: ['#FFD700', '#FFA500', '#FF4500']
                    });
                    confetti({
                         particleCount: 2,
                         angle: 120,
                         spread: 55,
                         origin: { x: 1 },
                         colors: ['#FFD700', '#FFA500', '#FF4500']
                    });

                    if (Date.now() < end) {
                         requestAnimationFrame(frame);
                    }
               };
               frame();
          }
     }, [isOpen]);

     if (!isOpen) return null;

     return (
          <AnimatePresence>
               <motion.div
                    className={styles.overlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
               >
                    <motion.div
                         className={styles.modal}
                         initial={{ scale: 0.8, opacity: 0, y: 50 }}
                         animate={{ scale: 1, opacity: 1, y: 0 }}
                         exit={{ scale: 0.8, opacity: 0, y: 50 }}
                         transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                         <div className={styles.iconWrapper}>
                              <Trophy size={48} color="#FFD700" fill="rgba(255, 215, 0, 0.2)" />
                         </div>

                         <h2 className={styles.title}>Session Complete</h2>
                         <p className={styles.subtitle}>
                              You have completed <strong>{count}</strong> chants.
                              <br />
                              {Math.floor(count / target)} Mala(s) achieved.
                         </p>

                         <div className={styles.actions}>
                              <Button
                                   variant="primary"
                                   size="lg"
                                   onClick={onClose}
                                   className={styles.continueButton}
                              >
                                   Done
                              </Button>

                              <Button
                                   variant="ghost"
                                   size="sm"
                                   onClick={onContinue} // Renamed concept: Continue means "Go back" / "Cancel End"
                                   className={styles.closeButton}
                              >
                                   Back to Chant
                              </Button>
                         </div>
                    </motion.div>
               </motion.div>
          </AnimatePresence>
     );
};

export default CelebrationModal;
