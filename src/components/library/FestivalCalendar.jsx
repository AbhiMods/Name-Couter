import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Sparkles, Clock, ArrowRight } from 'lucide-react';
import styles from './FestivalCalendar.module.css';

const FestivalCalendar = () => {
     const [festivals, setFestivals] = useState([]);

     useEffect(() => {
          const fetchFestivals = async () => {
               try {
                    const response = await fetch('/festivals-2025.json');
                    const data = await response.json();

                    // Get today's date at midnight for accurate comparison
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    // Filter and Sort: Only future/today events, sorted by date
                    const upcoming = data.festivals
                         .filter(f => new Date(f.date) >= today)
                         .sort((a, b) => new Date(a.date) - new Date(b.date));

                    setFestivals(upcoming);
               } catch (error) {
                    console.error("Failed to load festivals", error);
               }
          };

          fetchFestivals();
     }, []);

     const formatDate = (dateStr) => {
          const date = new Date(dateStr);
          return {
               day: date.getDate(),
               month: date.toLocaleString('default', { month: 'short' }),
               weekday: date.toLocaleString('default', { weekday: 'long' }),
               fullDate: date.toLocaleDateString('default', { year: 'numeric', month: 'long', day: 'numeric' })
          };
     };

     const getDaysRemaining = (dateStr) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const target = new Date(dateStr);
          target.setHours(0, 0, 0, 0);

          const diffTime = target - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 0) return 'Today';
          if (diffDays === 1) return 'Tomorrow';
          return `In ${diffDays} Days`;
     };

     if (festivals.length === 0) {
          return (
               <div className={styles.container}>
                    <div className={styles.emptyState}>
                         <p>No upcoming festivals found for this year.</p>
                    </div>
               </div>
          );
     }

     return (
          <div className={styles.container}>
               <div className={styles.headerRow}>
                    <h2 className={styles.heading}>
                         <Calendar size={24} className={styles.icon} />
                         Upcoming Festivals
                    </h2>

               </div>

               <div className={styles.listContainer}>
                    {festivals.map((festival, index) => {
                         const dateInfo = formatDate(festival.date);
                         const daysLeft = getDaysRemaining(festival.date);
                         const isNext = index === 0;

                         return (
                              <motion.div
                                   key={festival.id}
                                   className={`${styles.card} ${isNext ? styles.cardFeatured : ''}`}
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ delay: index * 0.1, duration: 0.5 }}
                              >
                                   {/* Left: Date Box */}
                                   <div className={styles.dateBox}>
                                        <span className={styles.month}>{dateInfo.month}</span>
                                        <span className={styles.day}>{dateInfo.day}</span>
                                        <span className={styles.weekdayShort}>{dateInfo.weekday.slice(0, 3)}</span>
                                   </div>

                                   {/* Center: Content */}
                                   <div className={styles.content}>
                                        <div className={styles.topRow}>
                                             {isNext && (
                                                  <span className={styles.nextBadge}>
                                                       <Sparkles size={12} fill="currentColor" /> Up Next
                                                  </span>
                                             )}
                                             <span className={styles.daysLeftBadge}>
                                                  <Clock size={12} /> {daysLeft}
                                             </span>
                                        </div>

                                        <h3 className={styles.name}>{festival.name}</h3>
                                        <p className={styles.description}>{festival.description}</p>
                                   </div>

                                   {/* Right: Action/Decor */}
                                   <div className={styles.actionColumn}>
                                        <div className={styles.arrowCircle}>
                                             <ArrowRight size={20} />
                                        </div>
                                   </div>
                              </motion.div>
                         );
                    })}
               </div>
          </div>
     );
};

export default FestivalCalendar;
