import React, { useState } from 'react';
import { X, Video, Tag, Loader } from 'lucide-react';
import styles from './AddReelModal.module.css';

const AddReelModal = ({ onClose, onAdded }) => {
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Bhakti');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const res = await fetch('http://localhost:5000/api/reels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, title, category })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to add reel');
            }

            onAdded(); // Refresh feed
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <header className={styles.header}>
                    <h3>Add Divine Reel</h3>
                    <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
                </header>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.field}>
                        <label><Video size={16} /> YouTube URL</label>
                        <input
                            type="text"
                            placeholder="https://youtube.com/shorts/..."
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            required
                        />
                        <p className={styles.hint}>Supports Shorts, Videos, and Share links</p>
                    </div>

                    <div className={styles.field}>
                        <label>Title (Optional)</label>
                        <input
                            type="text"
                            placeholder="e.g. Morning Prayer"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>

                    <div className={styles.field}>
                        <label><Tag size={16} /> Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value)}>
                            <option value="Bhakti">Bhakti</option>
                            <option value="Motivation">Motivation</option>
                            <option value="Knowledge">Knowledge</option>
                            <option value="Meditation">Meditation</option>
                        </select>
                    </div>

                    <button type="submit" disabled={submitting} className={styles.submitBtn}>
                        {submitting ? <Loader className={styles.spin} size={18} /> : 'Add Reel'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddReelModal;
