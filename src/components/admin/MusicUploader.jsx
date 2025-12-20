import React, { useState } from 'react';
import { Upload, Check, AlertCircle, Music } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

const MusicUploader = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success'|'error', text: '' }

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected && selected.type.startsWith('audio/')) {
            setFile(selected);
            setMessage(null);
        } else {
            setMessage({ type: 'error', text: 'Please select a valid audio file (MP3, WAV).' });
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('audio', file);

        try {
            const res = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            setMessage({ type: 'success', text: `Uploaded "${file.name}" successfully!` });
            setFile(null);
            // Optional: Refresh list mechanism if we passed a callback
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to upload. Ensure the backend server is running.' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <Music size={24} color="var(--color-primary)" />
                <h3 style={{ margin: 0 }}>Upload New Bhajan</h3>
            </div>

            <div style={{
                border: '2px dashed rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center',
                background: 'rgba(0,0,0,0.2)'
            }}>
                <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="bhajan-upload"
                />

                {!file ? (
                    <label htmlFor="bhajan-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <Upload size={32} color="var(--color-text-secondary)" />
                        <span style={{ color: 'var(--color-text-secondary)' }}>Click to select MP3 file</span>
                    </label>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-primary)' }}>
                            <Music size={20} />
                            <span>{file.name}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Button
                                variant="secondary"
                                onClick={() => setFile(null)}
                                disabled={uploading}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleUpload}
                                disabled={uploading}
                            >
                                {uploading ? 'Uploading...' : 'Upload Now'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {message && (
                <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    background: message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: message.type === 'success' ? '#34d399' : '#f87171',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                    {message.text}
                </div>
            )}
        </Card>
    );
};

export default MusicUploader;
