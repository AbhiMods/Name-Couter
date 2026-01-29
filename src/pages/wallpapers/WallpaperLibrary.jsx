import React, { useState } from 'react';
import { Smartphone, Monitor, Download, Image as ImageIcon, Loader2, Check } from 'lucide-react';

import styles from '../Counters.module.css'; // Reusing existing card styles
import SEO from '../../components/common/SEO';

const WallpaperLibrary = () => {

    const [activeTab, setActiveTab] = useState('phone'); // 'phone' or 'pc'
    const [downloadingId, setDownloadingId] = useState(null);
    const [downloadedIds, setDownloadedIds] = useState(new Set()); // Track all downloaded IDs
    const [toastMessage, setToastMessage] = useState(null);

    // Dummy Data - Placeholders
    const wallpapers = [
        {
            id: 1,
            title: 'Radha Krishna Divine',
            category: 'phone',
            url: 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?q=80&w=1920&auto=format&fit=crop', // Example Image
            description: 'Beautiful divine wallpaper for mobile'
        },
        {
            id: 2,
            title: 'Temple Sunset',
            category: 'phone',
            url: 'https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?q=80&w=1920&auto=format&fit=crop',
            description: 'Serene temple atmosphere'
        },
        {
            id: 3,
            title: 'Sacred Symbols',
            category: 'phone',
            url: 'https://images.unsplash.com/photo-1621360841012-3f9836caf936?q=80&w=1920&auto=format&fit=crop',
            description: 'Om symbol artistic wallpaper'
        },
         {
            id: 4,
            title: 'Vrindavan Vibes',
            category: 'pc',
            url: 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?q=80&w=2400&auto=format&fit=crop', // Reuse same for demo
            description: 'Wide wallpaper for desktop'
        },
        {
            id: 5,
            title: 'Himalayas',
            category: 'pc',
            url: 'https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?q=80&w=2400&auto=format&fit=crop',
            description: 'Wide nature wallpaper'
        }
    ];

    const filteredWallpapers = wallpapers.filter(w => w.category === activeTab);

    // Filter styles for tabs
    const tabStyle = (isActive) => ({
        padding: '0.75rem 1.5rem',
        borderRadius: '2rem',
        border: 'none',
        background: isActive ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.1)',
        color: isActive ? '#fff' : 'var(--color-text-primary)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        boxShadow: isActive ? '0 4px 12px rgba(255, 107, 107, 0.3)' : 'none'
    });

    const handleDownload = async (wallpaper) => {
        if (downloadingId || downloadedIds.has(wallpaper.id)) return; // Prevent multiple downloads if already downloaded

        setDownloadingId(wallpaper.id);
        setToastMessage(`Downloading ${wallpaper.title}...`);

        try {
            const response = await fetch(wallpaper.url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `${wallpaper.title.replace(/\s+/g, '-')}-${wallpaper.category}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);

            setDownloadingId(null);
            setDownloadedIds(prev => new Set(prev).add(wallpaper.id)); // Add to downloaded set
            setToastMessage('Download Complete!');

            // Hide toast after 3 seconds
            setTimeout(() => {
                setToastMessage(null);
            }, 3000);

        } catch (error) {
            console.error('Download failed:', error);
            setDownloadingId(null);
            setToastMessage('Download failed. Please try again.');
            setTimeout(() => setToastMessage(null), 3000);
        }
    };

    return (
        <div className={styles.container} style={{ minHeight: '100vh', paddingBottom: '8rem', paddingTop: '2rem', position: 'relative' }}>
             <SEO 
                title="Wallpaper Library | Download HD Religious Wallpapers"
                description="Download high-quality Radha Krishna, Hindu Gods, and spiritual wallpapers for your phone and desktop (PC)."
                keywords="Hindu Wallpapers, Radha Krishna Wallpaper, God Wallpaper, HD Wallpapers Phone, Desktop Backgrounds"
                url="https://name-counter.com/library/wallpapers"
            />
            
            {/* Toast Notification - Centered */}
            {toastMessage && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(0, 0, 0, 0.95)',
                    color: 'white',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    zIndex: 2000,
                    fontSize: '1rem',
                    fontWeight: 600,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    animation: 'fadeIn 0.3s ease-out',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)'
                }}>
                   {downloadingId ? <Loader2 size={32} className="animate-spin" color="var(--color-primary)" /> : <Check size={32} color="#4CAF50" />}
                   {toastMessage}
                </div>
            )}
            
            {/* Header */}
            <header className={styles.header} style={{ marginBottom: '2rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '1rem' }}>

                    <h1 className="text-2xl font-bold text-center" style={{ margin: 0 }}>Wallpaper Library</h1>
                </div>
                <p className={styles.subtext} style={{ textAlign: 'center' }}>
                    Beautiful backgrounds for your devices
                </p>
            </header>

            {/* Device Selector Tabs */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '1rem', 
                marginBottom: '2rem' 
            }}>
                <button 
                    onClick={() => setActiveTab('phone')}
                    style={tabStyle(activeTab === 'phone')}
                >
                    <Smartphone size={20} />
                    Phone
                </button>
                <button 
                    onClick={() => setActiveTab('pc')}
                    style={tabStyle(activeTab === 'pc')}
                >
                    <Monitor size={20} />
                    PC / Desktop
                </button>
            </div>

            {/* Grid */}
            <div style={{
                display: 'grid',
                // Responsive Grid Logic
                gridTemplateColumns: activeTab === 'phone' 
                    ? 'repeat(auto-fill, minmax(160px, 1fr))' 
                    : 'repeat(auto-fill, minmax(300px, 1fr))', 
                gap: '1.5rem',
                padding: '0 1rem', // Equal side padding
                maxWidth: activeTab === 'pc' ? '1200px' : '600px', 
                margin: '0 auto' 
            }}>
                {filteredWallpapers.map(wallpaper => (
                    <div 
                        key={wallpaper.id} 
                        className={styles.card}
                        style={{ 
                            padding: 0, 
                            overflow: 'hidden', 
                            position: 'relative',
                            aspectRatio: activeTab === 'phone' ? '9/16' : '16/9',
                            cursor: 'pointer',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px' // Smoother corners
                        }}
                    >
                        <img 
                            src={wallpaper.url} 
                            alt={wallpaper.title}
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover',
                                transition: 'transform 0.5s ease'
                            }}
                            className={styles.wallpaperImage} 
                        />
                        
                        {/* Overlay with Download Button */}
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                            padding: '2rem 1rem 1rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end'
                        }}>
                             <span style={{ 
                                 color: 'white', 
                                 fontSize: '0.95rem', 
                                 fontWeight: '600', 
                                 textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                                 flex: 1,
                                 marginRight: '8px'
                             }}>
                                {wallpaper.title}
                             </span>
                             <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(wallpaper);
                                }}
                                style={{
                                    background: downloadedIds.has(wallpaper.id) ? '#4CAF50' : 'var(--color-primary)',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '44px', // Slightly larger touch target
                                    height: '44px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: 'none',
                                    cursor: downloadedIds.has(wallpaper.id) ? 'default' : 'pointer',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                                    transition: 'all 0.3s ease'
                                }}
                                disabled={downloadingId === wallpaper.id}
                             >
                                 {downloadingId === wallpaper.id ? (
                                    <Loader2 size={22} className="animate-spin" />
                                 ) : downloadedIds.has(wallpaper.id) ? (
                                    <Check size={22} />
                                 ) : (
                                    <Download size={22} />
                                 )}
                             </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredWallpapers.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>
                    <ImageIcon size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p>No wallpapers found in this category yet.</p>
                </div>
            )}
        </div>
    );
};

export default WallpaperLibrary;
