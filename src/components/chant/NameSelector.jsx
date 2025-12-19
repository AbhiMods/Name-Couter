import React from 'react';
import { Check } from 'lucide-react';
import clsx from 'clsx';
import { useName } from '../../context/NameContext';
import styles from './NameSelector.module.css';

const NameSelector = ({ className }) => {
    const { allNames, selectedNameId, updateName } = useName();

    return (
        <div className={clsx(styles.grid, className)}>
            {allNames.map((name) => (
                <button
                    key={name.id}
                    className={clsx(
                        styles.selectorCard,
                        selectedNameId === name.id && styles.selected
                    )}
                    onClick={() => updateName(name.id)}
                    role="radio"
                    aria-checked={selectedNameId === name.id}
                >
                    <span className={styles.label}>{name.label}</span>
                    <span className={styles.subtitle}>{name.subtitle}</span>

                    <Check size={16} className={styles.checkIcon} />
                </button>
            ))}
        </div>
    );
};

export default NameSelector;
