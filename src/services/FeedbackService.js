export const FeedbackService = {
     async getConfig() {
          try {
               const response = await fetch('/feedback-config.json?t=' + Date.now());
               if (!response.ok) {
                    console.warn('Failed to fetch feedback config');
                    return null;
               }
               return await response.json();
          } catch (error) {
               console.error('Error loading feedback config:', error);
               return null;
          }
     },

     // Mock submission - In real app, this would be a POST request
     async submitFeedback(data) {
          console.log('--- FEEDBACK SUBMITTED ---');
          console.table(data);
          return new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
     }
};
