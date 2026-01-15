import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Send, Loader2 } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';
import Button from '../ui/Button';

const FeedbackPopup = () => {
     const { config, isVisible, closeFeedback, submitFeedback } = useFeedback();
     const [rating, setRating] = useState(0);
     const [thought, setThought] = useState('');
     const [email, setEmail] = useState('');
     const [isSubmitting, setIsSubmitting] = useState(false);

     if (!isVisible || !config) return null;

     const handleSubmit = async () => {
          if (!thought.trim() && rating === 0) return; // Basic validation
          setIsSubmitting(true);
          await submitFeedback(rating, thought, email);
          setIsSubmitting(false);
     };

     return (
          <AnimatePresence>
               {isVisible && (
                    <div style={{
                         position: 'fixed', inset: 0, zIndex: 10005,
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)'
                    }}>
                         <motion.div
                              initial={{ opacity: 0, scale: 0.9, y: 20 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, y: 20 }}
                              transition={{ type: "spring", duration: 0.5 }}
                              style={{
                                   background: '#1A1A1A',
                                   border: '1px solid rgba(255,255,255,0.1)',
                                   borderRadius: '20px',
                                   width: '90%', maxWidth: '400px',
                                   overflow: 'hidden',
                                   boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
                              }}
                         >
                              <div style={{ padding: '24px', position: 'relative' }}>
                                   <button
                                        onClick={closeFeedback}
                                        style={{
                                             position: 'absolute', top: '16px', right: '16px',
                                             background: 'transparent', border: 'none', color: '#666',
                                             cursor: 'pointer'
                                        }}
                                   >
                                        <X size={20} />
                                   </button>

                                   <h3 style={{ margin: '0 0 8px 0', color: 'white', fontSize: '20px', fontFamily: 'var(--font-display)' }}>
                                        {config.title}
                                   </h3>
                                   <p style={{ margin: '0 0 20px 0', color: '#999', fontSize: '14px' }}>
                                        {config.description}
                                   </p>

                                   {/* Star Rating */}
                                   <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', justifyContent: 'center' }}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                             <button
                                                  key={star}
                                                  onClick={() => setRating(star)}
                                                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                                             >
                                                  <Star
                                                       size={32}
                                                       fill={star <= rating ? "#FFD700" : "transparent"}
                                                       color={star <= rating ? "#FFD700" : "#444"}
                                                       strokeWidth={1.5}
                                                       style={{ transition: 'all 0.2s' }}
                                                  />
                                             </button>
                                        ))}
                                   </div>

                                   {/* Text Input */}
                                   <textarea
                                        value={thought}
                                        onChange={(e) => setThought(e.target.value)}
                                        placeholder={config.placeholder}
                                        style={{
                                             width: '100%', minHeight: '100px',
                                             background: 'rgba(255,255,255,0.05)',
                                             border: '1px solid rgba(255,255,255,0.1)',
                                             borderRadius: '12px',
                                             padding: '12px',
                                             color: 'white',
                                             fontFamily: 'inherit',
                                             fontSize: '14px',
                                             resize: 'none',
                                             marginBottom: '12px',
                                             outline: 'none'
                                        }}
                                   />

                                   {/* Optional Email */}
                                   <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email (optional)"
                                        style={{
                                             width: '100%',
                                             background: 'rgba(255,255,255,0.05)',
                                             border: '1px solid rgba(255,255,255,0.1)',
                                             borderRadius: '12px',
                                             padding: '12px',
                                             color: 'white',
                                             fontSize: '14px',
                                             marginBottom: '20px',
                                             outline: 'none'
                                        }}
                                   />

                                   {/* Submit */}
                                   <Button
                                        variant="primary"
                                        style={{ width: '100%', justifyContent: 'center' }}
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || (rating === 0 && !thought)}
                                   >
                                        {isSubmitting ? (
                                             <Loader2 size={20} className="animate-spin" />
                                        ) : (
                                             <>
                                                  <span>{config.submitText}</span>
                                                  <Send size={16} style={{ marginLeft: '8px' }} />
                                             </>
                                        )}
                                   </Button>
                              </div>
                         </motion.div>
                    </div>
               )}
          </AnimatePresence>
     );
};

export default FeedbackPopup;
