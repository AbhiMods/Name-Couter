import React from 'react';
import clsx from 'clsx';
import styles from './Card.module.css';

const Card = ({
    children,
    className,
    hoverable = false,
    onClick,
    ...props
}) => {
    return (
        <div
            className={clsx(
                styles.card,
                hoverable && styles.hoverable,
                onClick && styles.interactive,
                className
            )}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
