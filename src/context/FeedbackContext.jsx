import React, { createContext, useContext, useState, useEffect } from 'react';
import { FeedbackService } from '../services/FeedbackService';

const FeedbackContext = createContext();

export const useFeedback = () => useContext(FeedbackContext);

export const FeedbackProvider = ({ children }) => {
     const [config, setConfig] = useState(null);
     const [isVisible, setIsVisible] = useState(false);

     useEffect(() => {
          const fetchConfig = async () => {
               const data = await FeedbackService.getConfig();
               console.log('Feedback Config:', data);
               if (data && data.show) {
                    checkEligibility(data);
               }
          };

          fetchConfig();
     }, []);

     const checkEligibility = (data) => {
          // Global Status (Lifetime)
          const storedStatus = localStorage.getItem('divine_feedback_status');
          let globalStatus = storedStatus ? JSON.parse(storedStatus) : {};

          // Reset if new ID
          if (globalStatus.id !== data.id) {
               globalStatus = { id: data.id, count: 0, submitted: false };
          }

          // Don't show if already submitted (successfully)
          if (globalStatus.submitted) return;

          const maxImpressions = data.maxImpressions || 3;

          if (globalStatus.count < maxImpressions) {
               setConfig(data);
               setIsVisible(true);

               // Increment global count
               globalStatus.count += 1;
               globalStatus.id = data.id;
               localStorage.setItem('divine_feedback_status', JSON.stringify(globalStatus));
          }
     };

     const closeFeedback = () => {
          setIsVisible(false);
     };

     const submitFeedback = async (rating, text, email) => {
          if (!config) return;

          await FeedbackService.submitFeedback({
               id: config.id,
               rating,
               text,
               email,
               timestamp: new Date().toISOString()
          });

          // Mark as submitted so it doesn't show again for this ID
          const storedStatus = localStorage.getItem('divine_feedback_status');
          let globalStatus = storedStatus ? JSON.parse(storedStatus) : { id: config.id };
          globalStatus.submitted = true;
          localStorage.setItem('divine_feedback_status', JSON.stringify(globalStatus));

          setIsVisible(false);
     };

     return (
          <FeedbackContext.Provider value={{ config, isVisible, closeFeedback, submitFeedback }}>
               {children}
          </FeedbackContext.Provider>
     );
};
