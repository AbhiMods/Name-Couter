import React from 'react';
import ReactDOM from 'react-dom';
import { X, Heart, Copy, Check } from 'lucide-react';
import styles from './DonateModal.module.css';
import { motion, AnimatePresence } from 'framer-motion';

const DonateModal = ({ isOpen, onClose }) => {
     const [copied, setCopied] = React.useState(false);
     const upiId = "developer@upi"; // Placeholder

     const handleCopy = () => {
          navigator.clipboard.writeText(upiId);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
     };

     if (!isOpen) return null;

     return ReactDOM.createPortal(
          <AnimatePresence>
               <div className={styles.overlay} onClick={onClose}>
                    <motion.div
                         className={styles.modal}
                         initial={{ scale: 0.9, opacity: 0 }}
                         animate={{ scale: 1, opacity: 1 }}
                         exit={{ scale: 0.9, opacity: 0 }}
                         onClick={(e) => e.stopPropagation()}
                    >
                         <button className={styles.closeButton} onClick={onClose}>
                              <X size={24} />
                         </button>

                         <div className={styles.iconWrapper}>
                              <Heart size={40} color="#EAB308" fill="#EAB308" />
                         </div>

                         <h2 className={styles.title}>Support the Developer</h2>
                         <p className={styles.description}>
                              If you enjoy using Name Counter, consider supporting its development. Your contribution helps us keep the app free and ad-free.
                         </p>

                         {/* QR Code */}
                         <div className={styles.qrContainer}>
                              <img
                                   src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=${upiId}&pn=NameCounterDeveloper&cu=INR`}
                                   alt="UPI QR Code"
                                   className={styles.qrImage}
                              />
                         </div>

                         {/* UPI ID Copy Section */}
                         <div className={styles.upiContainer}>
                              <span className={styles.upiText}>
                                   {upiId}
                              </span>
                              <button
                                   onClick={handleCopy}
                                   className={styles.copyButton}
                                   style={{ color: copied ? '#22c55e' : 'var(--color-primary)' }}
                              >
                                   {copied ? <Check size={20} /> : <Copy size={20} />}
                              </button>
                         </div>

                         <p className={styles.helperText}>
                              Scan with any UPI app (GPay, PhonePe, Paytm)
                         </p>
                    </motion.div>
               </div>
          </AnimatePresence>,
          document.body
     );
};

export default DonateModal;
