import React, { useState, useEffect } from 'react';
import {
     format,
     addMonths,
     subMonths,
     startOfMonth,
     endOfMonth,
     startOfWeek,
     endOfWeek,
     isSameMonth,
     isSameDay,
     addDays,
     eachDayOfInterval,
     isToday
} from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, X, Calendar as CalendarIcon, Bookmark, Trash2 } from 'lucide-react';
import styles from './CalendarPage.module.css';
import { useNavigate } from 'react-router-dom';
import FestivalCalendar from '../components/library/FestivalCalendar';

const CalendarPage = () => {
     const navigate = useNavigate();
     const [currentDate, setCurrentDate] = useState(new Date());
     const [selectedDate, setSelectedDate] = useState(new Date());
     const [events, setEvents] = useState(() => {
          const saved = localStorage.getItem('calendar_events');
          return saved ? JSON.parse(saved) : {};
     });
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [newEventText, setNewEventText] = useState('');


     const [time, setTime] = useState(new Date());

     useEffect(() => {
          const timer = setInterval(() => setTime(new Date()), 1000);
          return () => clearInterval(timer);
     }, []);

     useEffect(() => {
          localStorage.setItem('calendar_events', JSON.stringify(events));
     }, [events]);

     const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
     const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
     const goToToday = () => {
          const today = new Date();
          setCurrentDate(today);
          setSelectedDate(today);
     };

     const onDateClick = (day) => {
          setSelectedDate(day);
          setIsModalOpen(true);
     };

     const addEvent = () => {
          if (!newEventText.trim()) return;
          const dateKey = format(selectedDate, 'yyyy-MM-dd');
          setEvents(prev => ({
               ...prev,
               [dateKey]: [...(prev[dateKey] || []), { id: Date.now(), text: newEventText }]
          }));
          setNewEventText('');
     };

     const deleteEvent = (dateKey, eventId) => {
          setEvents(prev => ({
               ...prev,
               [dateKey]: prev[dateKey].filter(e => e.id !== eventId)
          }));
     };

     const renderHeader = () => {
          const dateFormat = "MMMM yyyy";
          return (
               <div className={styles.header}>
                    <button className={styles.navBtn} onClick={prevMonth}><ChevronLeft /></button>
                    <div className={styles.monthLabel}>
                         <span onClick={goToToday} className={styles.monthText}>{format(currentDate, dateFormat)}</span>
                    </div>
                    <button className={styles.navBtn} onClick={nextMonth}><ChevronRight /></button>
               </div>
          );
     };

     const renderDays = () => {
          const days = [];
          const dateFormat = "EEE";
          const startDate = startOfWeek(currentDate);

          for (let i = 0; i < 7; i++) {
               days.push(
                    <div className={styles.col} key={i}>
                         {format(addDays(startDate, i), dateFormat)}
                    </div>
               );
          }
          return <div className={styles.daysRow}>{days}</div>;
     };

     const renderCells = () => {
          const monthStart = startOfMonth(currentDate);
          const monthEnd = endOfMonth(monthStart);
          const startDate = startOfWeek(monthStart);
          const endDate = endOfWeek(monthEnd);

          const rows = [];
          let days = [];
          let day = startDate;
          let formattedDate = "";

          while (day <= endDate) {
               for (let i = 0; i < 7; i++) {
                    formattedDate = format(day, "d");
                    const cloneDay = day;
                    const dateKey = format(day, 'yyyy-MM-dd');
                    const dayEvents = events[dateKey] || [];
                    const isSelected = isSameDay(day, selectedDate);
                    const isCurrentMonth = isSameMonth(day, monthStart);

                    days.push(
                         <div
                              className={`${styles.cell} ${!isCurrentMonth
                                   ? styles.disabled
                                   : isSelected
                                        ? styles.selected
                                        : ""
                                   } ${isToday(day) ? styles.today : ''}`}
                              key={day}
                              onClick={() => onDateClick(cloneDay)}
                         >
                              <div className={styles.number}>{formattedDate}</div>
                              {dayEvents.length > 0 && (
                                   <div className={styles.dots}>
                                        {dayEvents.map((_, idx) => (
                                             <div key={idx} className={styles.dot}></div>
                                        ))}
                                   </div>
                              )}
                         </div>
                    );
                    day = addDays(day, 1);
               }
               rows.push(
                    <div className={styles.row} key={day}>
                         {days}
                    </div>
               );
               days = [];
          }
          return <div className={styles.body}>{rows}</div>;
     };

     return (
          <div className={styles.wrapper}>
               <div className={styles.clockContainer}>
                    <h2 className={styles.clockTime}>
                         {format(time, 'hh')}
                         <span className={styles.blink}>:</span>
                         {format(time, 'mm')}
                         <span className={styles.blink}>:</span>
                         <span className={styles.seconds}>{format(time, 'ss')}</span>
                         <span className={styles.ampm}>{format(time, 'a')}</span>
                    </h2>
                    <p className={styles.clockDate}>{format(time, 'EEEE, MMMM d, yyyy')}</p>
               </div>

               <div className={styles.container}>
                    {renderHeader()}
                    {renderDays()}
                    {renderCells()}
               </div>

               <div className={styles.festivalsSection}>
                    <FestivalCalendar />
               </div>

               {/* Event Details / Modal */}
               <AnimatePresence>
                    {isModalOpen && (
                         <motion.div
                              className={styles.modalOverlay}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              onClick={() => setIsModalOpen(false)}
                         >
                              <motion.div
                                   className={styles.modalContent}
                                   initial={{ y: 100, opacity: 0 }}
                                   animate={{ y: 0, opacity: 1 }}
                                   exit={{ y: 100, opacity: 0 }}
                                   onClick={(e) => e.stopPropagation()}
                              >
                                   <div className={styles.modalHeader}>
                                        <h2>{format(selectedDate, 'MMMM d, yyyy')}</h2>
                                        <button onClick={() => setIsModalOpen(false)}><X /></button>
                                   </div>

                                   <div className={styles.eventList}>
                                        {events[format(selectedDate, 'yyyy-MM-dd')]?.length > 0 ? (
                                             events[format(selectedDate, 'yyyy-MM-dd')].map(event => (
                                                  <div key={event.id} className={styles.eventItem}>
                                                       <span>{event.text}</span>
                                                       <button onClick={() => deleteEvent(format(selectedDate, 'yyyy-MM-dd'), event.id)}>
                                                            <Trash2 size={16} />
                                                       </button>
                                                  </div>
                                             ))
                                        ) : (
                                             <p className={styles.noEvents}>No notes for this day.</p>
                                        )}
                                   </div>

                                   <div className={styles.inputGroup}>
                                        <input
                                             type="text"
                                             placeholder="Add a note or memory..."
                                             value={newEventText}
                                             onChange={(e) => setNewEventText(e.target.value)}
                                             onKeyDown={(e) => e.key === 'Enter' && addEvent()}
                                        />
                                        <button onClick={addEvent}><Plus /></button>
                                   </div>
                              </motion.div>
                         </motion.div>
                    )}
               </AnimatePresence>
          </div>
     );
};

export default CalendarPage;
