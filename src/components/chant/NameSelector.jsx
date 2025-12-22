import React from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { useName, NAMES } from '../../context/NameContext';
import styles from './NameSelector.module.css';

const NameSelector = ({ className, onSelect }) => {
    const { allNames, selectedNameId, updateName, addCustomName, removeCustomName } = useName();

    const handleAdd = () => {
        const name = prompt("Enter divine name to chant:");
        if (name && name.trim()) {
            addCustomName(name.trim());
            if (onSelect) onSelect();
        }
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (window.confirm("Remove this custom name?")) {
            removeCustomName(id);
        }
    };

    const isCustom = (id) => !NAMES.find(n => n.id === id);

    return (
        <div className={clsx(styles.grid, className)}>
            {allNames.map((name) => (
                <button
                    key={name.id}
                    className={clsx(
                        styles.selectorCard,
                        selectedNameId === name.id && styles.selected
                    )}
                    onClick={() => {
                        updateName(name.id);
                        if (onSelect) onSelect();
                    }}
                    role="radio"
                    aria-checked={selectedNameId === name.id}
                >
                    <span className={styles.label}>{name.label}</span>
                    <span className={styles.subtitle}>{name.subtitle}</span>

                    {selectedNameId === name.id && <Check size={16} className={styles.checkIcon} />}

                    {isCustom(name.id) && (
                        <div
                            className={styles.deleteBtn}
                            onClick={(e) => handleDelete(e, name.id)}
                            title="Remove"
                        >
                            <Trash2 size={14} />
                        </div>
                    )}
                </button>
            ))}

            <button className={clsx(styles.selectorCard, styles.addCard)} onClick={handleAdd}>
                <Plus size={20} />
                <span className={styles.label}>Add Custom</span>
            </button>
        </div>
    );
};

export default NameSelector;
