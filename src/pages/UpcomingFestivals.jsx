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


               <FestivalCalendar />
          </div>
     );
};

export default UpcomingFestivals;
