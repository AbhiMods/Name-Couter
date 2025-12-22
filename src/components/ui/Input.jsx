import React from 'react';
import styles from './Input.module.css';

const Input = ({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    icon: Icon,
    required = false,
    ...props
}) => {
    return (
        <div className={styles.container}>
            {label && (
                <label className={styles.label}>
                    {label} {required && <span style={{ color: 'var(--color-primary)' }}>*</span>}
                </label>
            )}
            <div className={styles.inputWrapper}>
                {Icon && <Icon size={20} className={styles.icon} />}
                <input
                    type={type}
                    className={`${styles.input} ${Icon ? styles.hasIcon : ''}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    style={Icon ? { paddingLeft: '3rem' } : {}}
                    {...props}
                />
            </div>
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
};

export default Input;
