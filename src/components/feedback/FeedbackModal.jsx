import React, { useState } from 'react';
import { X, Star, Send, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import styles from './FeedbackModal.module.css';

const FeedbackModal = ({ onClose }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [text, setText] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            alert("Please select a rating.");
            return;
        }

        setIsSubmitting(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Create feedback object
        const feedback = {
            id: Date.now(),
            rating,
            text,
            email: email || 'anonymous',
            timestamp: new Date().toISOString()
        };

        // Persist to local storage mock 'db'
        try {
            const existing = JSON.parse(localStorage.getItem('divine_feedback_queue') || '[]');
            localStorage.setItem('divine_feedback_queue', JSON.stringify([...existing, feedback]));
        } catch (err) {
            console.error(err);
        }

        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className={styles.overlay}>
                <div className={styles.modal}>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <X size={24} />
                    </button>
                    <div className={styles.successContainer}>
                        <CheckCircle size={64} className={styles.successIcon} />
                        <h3 className={styles.title}>Thank You!</h3>
                        <p className={styles.description}>
                            Your feedback helps us improve the Divine Name experience.
                            <br />Jai Shri Ram! 🙏
                        </p>
                        <Button variant="primary" onClick={onClose}>Close</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button onClick={onClose} className={styles.closeBtn}>
                    <X size={24} />
                </button>

                <h3 className={styles.title}>Send Feedback</h3>
                <p className={styles.description}>How is your chanting experience?</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.ratingContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={styles.starBtn}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    size={32}
                                    className={(hoverRating || rating) >= star ? styles.starFilled : ''}
                                    fill={(hoverRating || rating) >= star ? 'currentColor' : 'none'}
                                />
                            </button>
                        ))}
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Message (Optional)</label>
                        <textarea
                            className={styles.textarea}
                            placeholder="Share your thoughts, bugs, or feature requests..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Email (Optional)</label>
                        <input
                            type="email"
                            className={styles.input}
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className={styles.submitBtn}>
                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            disabled={isSubmitting || rating === 0}
                        >
                            {isSubmitting ? 'Sending...' : (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    Send Feedback <Send size={16} />
                                </span>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeedbackModal;
