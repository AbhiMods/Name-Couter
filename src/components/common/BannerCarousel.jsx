import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BannerService } from '../../services/BannerService';
import { Loader } from 'lucide-react';

const BannerCarousel = () => {
     const [banners, setBanners] = useState([]);
     const [currentIndex, setCurrentIndex] = useState(0);
     const [loading, setLoading] = useState(true);
     const [config, setConfig] = useState(null);
     const navigate = useNavigate();

     useEffect(() => {
          const fetchBanners = async () => {
               const data = await BannerService.getConfig();
               if (data && data.banners && data.banners.length > 0) {
                    setBanners(data.banners);
                    setConfig(data);
               }
               setLoading(false);
          };

          fetchBanners();
     }, []);

     useEffect(() => {
          if (banners.length <= 1) return;

          const intervalTime = config?.interval || 5000;
          const timer = setInterval(() => {
               setCurrentIndex((prev) => (prev + 1) % banners.length);
          }, intervalTime);

          return () => clearInterval(timer);
     }, [banners, config]);

     const handleBannerClick = (banner) => {
          if (banner.link) {
               if (banner.link.startsWith('http')) {
                    window.open(banner.link, '_blank');
               } else {
                    navigate(banner.link);
               }
          }
     };

     if (loading) return null;
     if (banners.length === 0) return null;

     return (
          <div style={{
               position: 'relative',
               width: '100%',
               overflow: 'hidden',
               borderRadius: '16px',
               marginBottom: '1.5rem',
               aspectRatio: '16/9', // Default, but can be controlled slightly by CSS
               maxHeight: '220px', // Limit height on large screens
               boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
               <AnimatePresence mode='wait'>
                    <motion.div
                         key={currentIndex}
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         exit={{ opacity: 0, x: -20 }}
                         transition={{ duration: 0.5 }}
                         style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              cursor: banners[currentIndex].link ? 'pointer' : 'default'
                         }}
                         onClick={() => handleBannerClick(banners[currentIndex])}
                    >
                         <img
                              src={banners[currentIndex].imageUrl}
                              alt={banners[currentIndex].title}
                              style={{
                                   width: '100%',
                                   height: '100%',
                                   objectFit: 'cover',
                                   display: 'block'
                              }}
                         />

                         {/* Optional Title Overlay */}
                         {banners[currentIndex].title && (
                              <div style={{
                                   position: 'absolute',
                                   bottom: 0,
                                   left: 0,
                                   right: 0,
                                   background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                   padding: '1rem',
                                   color: '#fff',
                                   fontSize: '1rem',
                                   fontWeight: '600'
                              }}>
                                   {banners[currentIndex].title}
                              </div>
                         )}
                    </motion.div>
               </AnimatePresence>

               {/* Dots Indicator */}
               {banners.length > 1 && (
                    <div style={{
                         position: 'absolute',
                         bottom: '10px',
                         right: '10px',
                         display: 'flex',
                         gap: '6px',
                         zIndex: 2
                    }}>
                         {banners.map((_, idx) => (
                              <div
                                   key={idx}
                                   style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: idx === currentIndex ? '#fff' : 'rgba(255,255,255,0.4)',
                                        transition: 'all 0.3s'
                                   }}
                              />
                         ))}
                    </div>
               )}
          </div>
     );
};

export default BannerCarousel;
