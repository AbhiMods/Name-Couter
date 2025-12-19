import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import Button from '../ui/Button';
import styles from './TargetSettings.module.css';

const PRESETS = [
    { label: '1 Mala', value: 108 },
    { label: '3 Malas', value: 324 },
    { label: '16 Malas', value: 1728 },
    { label: 'Freedom', value: 0 } // No limit
];

const TargetSettings = ({ currentTarget, onSetTarget, onClose }) => {
    const [customVal, setCustomVal] = useState('');

    const handleCustomSubmit = (e) => {
        e.preventDefault();
        if (customVal && !isNaN(customVal)) {
            onSetTarget(parseInt(customVal, 10));
            onClose();
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <h3 className={styles.title}>Set Chanting Goal</h3>

                <div className={styles.grid}>
                    {PRESETS.map(preset => (
                        <Button
                            key={preset.label}
                            variant={currentTarget === preset.value ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={() => {
                                onSetTarget(preset.value);
                                onClose();
                            }}
                        >
                            {preset.label}
                        </Button>
                    ))}
                </div>

                <form onSubmit={handleCustomSubmit} className={styles.customInputWrapper}>
                    <input
                        type="number"
                        placeholder="Custom count..."
                        className={styles.input}
                        value={customVal}
                        onChange={e => setCustomVal(e.target.value)}
                        min="1"
                    />
                    <Button type="submit" variant="secondary" size="icon">
                        <Check size={18} />
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default TargetSettings;
