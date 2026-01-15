export const PromotionsService = {
     async getConfig() {
          try {
               // Add timestamp to prevent caching so updates are seen immediately
               const response = await fetch('/promo-config.json?t=' + Date.now());
               if (!response.ok) {
                    console.warn('Failed to fetch promo config');
                    return null;
               }
               return await response.json();
          } catch (error) {
               console.error('Error loading promo config:', error);
               return null;
          }
     }
};
