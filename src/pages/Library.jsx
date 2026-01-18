import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import styles from './Counters.module.css'; // Reusing Counters styles for consistency

const Library = () => {
     return (
          <div className={styles.container}>
               <header className={styles.header}>
                    <motion.h1
                         className={styles.title}
                         initial={{ opacity: 0, y: -20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.6 }}
                    >
                         Mantra Library
                    </motion.h1>
                    <motion.p
                         className={styles.subtitle}
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         transition={{ delay: 0.2, duration: 0.6 }}
                    >
                         Explore our collection of divine mantras and texts.
                    </motion.p>
               </header>

               <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '40vh',
                    color: 'rgba(255,255,255,0.6)',
                    textAlign: 'center',
                    padding: '2rem'
               }}>
                    <BookOpen size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p>Library content coming soon...</p>
               </div>
          </div>
     );
};

export default Library;
