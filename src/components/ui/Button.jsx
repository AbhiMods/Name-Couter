import React from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

/**
 * Reusable Button Component
 * @param {string} variant - primary, secondary, ghost
 * @param {string} size - sm, md, lg, icon
 */
const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    isLoading,
    ...props
}) => {
    return (
        <button
            className={clsx(
                styles.button,
                styles[variant],
                styles[size],
                isLoading && styles.loading,
                className
            )}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? <span className={styles.spinner}>...</span> : children}
        </button>
    );
};

export default Button;
