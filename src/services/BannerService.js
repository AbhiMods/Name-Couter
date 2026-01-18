/**
 * Service to fetch and manage banner configuration.
 * Fetches from public/banner-config.json with cache busting.
 */
export const BannerService = {
     async getConfig() {
          try {
               // Add timestamp to prevent caching
               const response = await fetch(`/banner-config.json?t=${Date.now()}`);
               if (!response.ok) {
                    console.warn('Failed to fetch banner config');
                    return null;
               }
               const config = await response.json();

               // Filter only active banners
               if (config && config.banners) {
                    config.banners = config.banners.filter(banner => banner.active);
               }

               return config;
          } catch (error) {
               console.error('Error loading banner config:', error);
               return null;
          }
     }
};
