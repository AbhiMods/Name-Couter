import React, { createContext, useContext, useState, useEffect } from 'react';
import { FeatureService } from '../services/FeatureService';

const FeatureContext = createContext();

export const useFeature = () => useContext(FeatureContext);

export const FeatureProvider = ({ children }) => {
     const [feature, setFeature] = useState(null);
     const [isVisible, setIsVisible] = useState(false);

     useEffect(() => {
          const fetchConfig = async () => {
               const data = await FeatureService.getConfig();
               console.log('Feature Config:', data);
               if (data && data.show) {
                    checkEligibility(data);
               }
          };

          fetchConfig();
     }, []);

     const checkEligibility = (data) => {
          // Global Status (Lifetime impressions)
          const storedStatus = localStorage.getItem('divine_feature_status');
          let globalStatus = storedStatus ? JSON.parse(storedStatus) : {};

          // Reset if new ID
          if (globalStatus.id !== data.id) {
               globalStatus = { id: data.id, count: 0 };
          }

          const maxImpressions = data.maxImpressions || 3;

          // Check if under limit
          if (globalStatus.count < maxImpressions) {
               setFeature(data);
               setIsVisible(true);

               // Increment global count
               globalStatus.count += 1;
               globalStatus.id = data.id;
               localStorage.setItem('divine_feature_status', JSON.stringify(globalStatus));
          }
     };

     const dismissFeature = () => {
          setIsVisible(false);
     };

     return (
          <FeatureContext.Provider value={{ feature, isVisible, dismissFeature }}>
               {children}
          </FeatureContext.Provider>
     );
};
