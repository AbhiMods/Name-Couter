import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './ImageCarousel.module.css';

// Import images
import img1 from '../../assets/nature_sunrise.png';
import img2 from '../../assets/temple_peaceful.png';
import img3 from '../../assets/cosmic_energy.png';

const images = [img1, img2, img3];

const variants = {
    enter: (direction) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction) => ({
        zIndex: 0,
        x: direction < 0 ? '100%' : '-100%',
        opacity: 0
    })
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
};

const ImageCarousel = () => {
    const [page, setPage] = useState(0);
    const [direction, setDirection] = useState(0);

    // We use modulo to wrap the index, but handle negative numbers correctly
    // Javascript's % operator returns negative results for negative numbers
    const imageIndex = ((page % images.length) + images.length) % images.length;

    const paginate = (newDirection) => {
        setPage(page + newDirection);
        setDirection(newDirection);
    };

    return (
        <div className={styles.carouselContainer}>
            <AnimatePresence initial={false} custom={direction}>
                <motion.img
                    key={page}
                    src={images[imageIndex]}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);

                        if (swipe < -swipeConfidenceThreshold) {
                            paginate(1);
                        } else if (swipe > swipeConfidenceThreshold) {
                            paginate(-1);
                        }
                    }}
                    className={styles.imageSlide}
                    alt="Spiritual Background"
                />
            </AnimatePresence>
            <div className={styles.controls}>
                <button className={styles.arrow} onClick={() => paginate(-1)} aria-label="Previous Image">
                    <ChevronLeft size={20} />
                </button>
                <button className={styles.arrow} onClick={() => paginate(1)} aria-label="Next Image">
                    <ChevronRight size={20} />
                </button>
            </div>
            <div className={styles.dots}>
                {images.map((_, idx) => (
                    <div
                        key={idx}
                        className={`${styles.dot} ${idx === imageIndex ? styles.dotActive : ''}`}
                        onClick={() => {
                            const diff = idx - imageIndex;
                            // Just jump to that page, simplistic logic
                            // This might cause weird transition if jumping far, but ok for now
                            setPage(page + diff);
                            setDirection(diff > 0 ? 1 : -1);
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageCarousel;
