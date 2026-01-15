export const FeatureService = {
     async getConfig() {
          try {
               const response = await fetch('/feature-config.json?t=' + Date.now());
               if (!response.ok) {
                    console.warn('Failed to fetch feature config');
                    return null;
               }
               return await response.json();
          } catch (error) {
               console.error('Error loading feature config:', error);
               return null;
          }
     }
};
