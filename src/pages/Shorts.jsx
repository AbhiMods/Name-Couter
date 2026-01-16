import React, { useEffect } from 'react';
import { useBhajan } from '../context/BhajanContext';
import ReelsFeed from '../components/music/ReelsFeed';
import styles from './Shorts.module.css';

const Shorts = () => {
     const { isPlaying, pause } = useBhajan();

     // Exclusive Playback Logic: Stop Music when entering Shorts
     useEffect(() => {
          if (isPlaying) {
               pause();
          }
     }, [isPlaying, pause]);

     return (
          <div className={styles.container}>
               <ReelsFeed />
          </div>
     );
};

export default Shorts;
