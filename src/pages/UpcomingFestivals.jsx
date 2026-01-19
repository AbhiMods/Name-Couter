import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FestivalCalendar from '../components/library/FestivalCalendar';
import styles from './Counters.module.css';

const UpcomingFestivals = () => {
     const navigate = useNavigate();

     return (
          <div className={styles.container} style={{
               paddingTop: '1rem',
               minHeight: '100vh',
               background: 'var(--color-bg-dark)'
          }}>
               {/* Floating/Integrated Back Button */}
               <div style={{
                    padding: '0.5rem 1rem',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    background: 'transparent', // Let calendar header take visual focus
                    display: 'flex',
                    alignItems: 'center'
               }}>
                    <button
                         onClick={() => navigate('/library')}
                         style={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid var(--color-border)',
                              borderRadius: '12px',
                              width: '40px',
                              height: '40px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--color-text-primary)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                         }}
                    >
                         <ArrowLeft size={20} />
                    </button>
               </div>

               <FestivalCalendar />
          </div>
     );
};

export default UpcomingFestivals;
