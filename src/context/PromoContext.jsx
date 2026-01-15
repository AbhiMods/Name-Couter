import React, { createContext, useContext, useState, useEffect } from 'react';
import { PromotionsService } from '../services/PromotionsService';

const PromoContext = createContext();

export const usePromo = () => useContext(PromoContext);

export const PromoProvider = ({ children }) => {
     const [promo, setPromo] = useState(null);
     const [isVisible, setIsVisible] = useState(false);
     const [config, setConfig] = useState(null);

     // Initial Load
     useEffect(() => {
          const fetchPromo = async () => {
               const data = await PromotionsService.getConfig();
               console.log('Promo Config:', data); // Debugging
               if (data && data.show) {
                    setConfig(data);
                    checkEligibility(data);
               }
          };

          fetchPromo();
     }, []);

     const checkEligibility = (data) => {
          // 1. GLOBAL STATUS (Long-term tracking: "Have I seen this 3 times total forever?")
          // stored in localStorage
          const storedStatus = localStorage.getItem('divine_promo_status');
          let globalStatus = storedStatus ? JSON.parse(storedStatus) : {};

          // REMOVED SESSION LOGIC as per user request.
          // The user wants the popup to show on every refresh/visit if under the limit.

          // Check Global ID change (New Campaign)
          if (globalStatus.id !== data.id) {
               globalStatus = { id: data.id, count: 0, dismissed: false };
          }

          const maxImpressions = data.maxImpressions || 1;

          if (globalStatus.count < maxImpressions) {
               setPromo(data);
               setIsVisible(true);

               // Increment global count immediately
               globalStatus.count += 1;
               globalStatus.id = data.id;
               localStorage.setItem('divine_promo_status', JSON.stringify(globalStatus));
          } else {
               console.log(`Global promo limit reached (${globalStatus.count}/${maxImpressions})`);
          }
     };

     const dismissPromo = () => {
          setIsVisible(false);
     };

     const resetPromo = () => {
          localStorage.removeItem('divine_promo_status');
          if (config) {
               checkEligibility(config);
          }
     };

     return (
          <PromoContext.Provider value={{ promo, isVisible, dismissPromo, resetPromo }}>
               {children}
          </PromoContext.Provider>
     );
};
