import React, { useState } from 'react';
import { useName } from '../context/NameContext';
import { useAuth } from '../context/AuthContext';
import { Music, Upload, Trash2, Play, Pause, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import styles from './AdminPanel.module.css';

const AdminPanel = () => {
    const { allNames, customAudios, updateCustomAudio } = useName();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [playingId, setPlayingId] = useState(null);
    const [audioInstance, setAudioInstance] = useState(null);

    if (user?.role !== 'admin') {
        return (
            <div className={styles.errorContainer}>
                <h2>Access Denied</h2>
                <p>You do not have permission to view this page.</p>
                <Button onClick={() => navigate('/')}>Return Home</Button>
            </div>
        );
    }

    const handleFileUpload = (nameId, e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Limit size to ~1MB for localStorage safety (base64 increases size by ~33%)
        if (file.size > 1024 * 1024) {
            alert('File too large. Please upload an audio file smaller than 1MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            updateCustomAudio(nameId, event.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleTogglePreview = (nameId) => {
        if (playingId === nameId) {
            audioInstance.pause();
            setPlayingId(null);
            setAudioInstance(null);
        } else {
            if (audioInstance) audioInstance.pause();

            const audioData = customAudios[nameId];
            if (!audioData) return;

            const audio = new Audio(audioData);
            audio.onended = () => {
                setPlayingId(null);
                setAudioInstance(null);
            };
            audio.play();
            setPlayingId(nameId);
            setAudioInstance(audio);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate('/')}>
                    <ArrowLeft size={20} />
                    Back to Counter
                </button>
                <h1 className={styles.title}>Admin Panel</h1>
                <p className={styles.subtitle}>Configure custom audio for chanting names</p>
            </header>

            <div className={styles.grid}>
                {allNames.map((name) => (
                    <Card key={name.id} className={styles.nameCard}>
                        <div className={styles.cardInfo}>
                            <h3>{name.label}</h3>
                            <p>{name.subtitle}</p>
                        </div>

                        <div className={styles.audioSection}>
                            {customAudios[name.id] ? (
                                <div className={styles.activeAudio}>
                                    <div className={styles.status}>
                                        <Music size={16} className={styles.statusIcon} />
                                        <span>Custom Audio Active</span>
                                    </div>
                                    <div className={styles.actions}>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            onClick={() => handleTogglePreview(name.id)}
                                            title="Preview Audio"
                                        >
                                            {playingId === name.id ? <Pause size={18} /> : <Play size={18} />}
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            onClick={() => updateCustomAudio(name.id, null)}
                                            className={styles.deleteBtn}
                                            title="Remove Audio"
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.uploadPlaceholder}>
                                    <p className={styles.fallbackNote}>Currently using System TTS</p>
                                    <input
                                        type="file"
                                        id={`upload-${name.id}`}
                                        className={styles.fileInput}
                                        accept="audio/*"
                                        onChange={(e) => handleFileUpload(name.id, e)}
                                    />
                                    <label htmlFor={`upload-${name.id}`} className={styles.uploadLabel}>
                                        <Upload size={18} />
                                        Upload Custom Audio
                                    </label>
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            <div className={styles.infoBox}>
                <p>Note: Admin-set audio is stored in your local browser for this demonstration. Audio files are limited to 1MB.</p>
            </div>
        </div>
    );
};

export default AdminPanel;
