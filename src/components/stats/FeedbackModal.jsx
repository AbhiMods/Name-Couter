import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import { Star, Mail } from 'lucide-react';
import styles from './FeedbackModal.module.css';

const FeedbackModal = ({ isOpen, onClose }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send data to your backend
        console.log({ rating, email, message });
        alert('Thank you for your feedback!');

        // Reset and close
        setRating(0);
        setEmail('');
        setMessage('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="We value your feedback">
            <form onSubmit={handleSubmit} className={styles.form}>

                {/* Star Rating */}
                <div className={styles.ratingSection}>
                    <span className={styles.ratingLabel}>Rate your experience</span>
                    <div className={styles.stars}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={`${styles.starBtn} ${(hoverRating || rating) >= star ? styles.starFilled : ''}`}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    size={32}
                                    fill={(hoverRating || rating) >= star ? "currentColor" : "none"}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Email Input */}
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="your@email.com"
                    icon={Mail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                {/* Message Input */}
                <div className={styles.inputGroup}>
                    <textarea
                        className={styles.textarea}
                        placeholder="Share your thoughts, suggestions, or issues..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className={styles.submitBtn}>
                    Submit Feedback
                </button>
            </form>
        </Modal>
    );
};

export default FeedbackModal;
