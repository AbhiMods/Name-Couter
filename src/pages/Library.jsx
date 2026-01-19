import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Image as ImageIcon, BookOpen, Sparkles, ChevronRight } from 'lucide-react';
import styles from './Counters.module.css'; // Reusing Counters styles for consistency

const Library = () => {
     // Menu Data
     const tools = [
          {
               id: 'upcoming-festivals',
               title: 'Upcoming Festivals',
               subtitle: 'Check dates for 2026',
               icon: Calendar,
               link: '/library/upcoming-festivals',
               color: '#FFD700', // Gold
               bgGradient: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.02) 100%)',
               featured: true
          },
          {
               id: 'wallpaper',
               title: 'Wallpaper Download',
               subtitle: 'Divine HD Backgrounds',
               icon: ImageIcon,
               link: '#', // Placeholder
               color: '#4FACFE', // Blue
               bgGradient: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.02) 100%)',
               comingSoon: true
          },
          {
               id: 'mantra-library',
               title: 'Mantra Library',
               subtitle: 'Texts & Meanings',
               icon: BookOpen, // Book
               link: '#', // Placeholder
               color: '#FF9A9E', // Pink/Red
               bgGradient: 'linear-gradient(135deg, rgba(255, 154, 158, 0.1) 0%, rgba(254, 207, 239, 0.02) 100%)',
               comingSoon: true
          }
     ];

     return (
          <div className={styles.container}>
               <header className={styles.header}>
                    <motion.h1
                         className={styles.title}
                         initial={{ opacity: 0, y: -20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.6 }}
                    >
                         Library
                    </motion.h1>
                    <motion.p
                         className={styles.subtitle}
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         transition={{ delay: 0.2, duration: 0.6 }}
                    >
                         Tools for your spiritual journey.
                    </motion.p>
               </header>

               <div className={styles.grid}>
                    {tools.map((tool, index) => (
                         <motion.div
                              key={tool.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 + 0.3 }}
                         >
                              <Link
                                   to={tool.link}
                                   style={{ textDecoration: 'none' }}
                                   onClick={(e) => tool.comingSoon && e.preventDefault()}
                              >
                                   <div
                                        className={styles.card}
                                        style={{
                                             background: tool.bgGradient,
                                             minHeight: '160px',
                                             opacity: tool.comingSoon ? 0.7 : 1,
                                             position: 'relative'
                                        }}
                                   >
                                        <div className={styles.cardIcon} style={{ background: 'rgba(255,255,255,0.1)' }}>
                                             <tool.icon size={28} color={tool.color} />
                                        </div>

                                        <div className={styles.cardContent}>
                                             <h3 className={styles.cardTitle}>{tool.title}</h3>
                                             <p className={styles.cardSubtitle}>{tool.subtitle}</p>

                                             {tool.comingSoon && (
                                                  <span style={{
                                                       display: 'inline-block',
                                                       fontSize: '0.7rem',
                                                       padding: '2px 8px',
                                                       borderRadius: '10px',
                                                       background: 'rgba(255,255,255,0.1)',
                                                       marginTop: '0.5rem',
                                                       color: 'var(--color-text-secondary)'
                                                  }}>Coming Soon</span>
                                             )}
                                        </div>

                                        {!tool.comingSoon && (
                                             <div className={styles.arrowIcon}>
                                                  <ChevronRight size={18} />
                                             </div>
                                        )}
                                   </div>
                              </Link>
                         </motion.div>
                    ))}
               </div>
          </div>
     );
};

export default Library;
