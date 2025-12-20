import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useBgMusic } from './BgMusicContext';

const BhajanContext = createContext();

export const useBhajan = () => useContext(BhajanContext);

export const BhajanProvider = ({ children }) => {
    const { pause: pauseBgMusic } = useBgMusic();

    const playlist = [
        { id: '1', title: 'Shri Ram Chandra Kripalu', artist: 'Traditional', duration: '5:32', src: '/audio/bhajans/ram_chandra.mp3', category: 'Ram' },
        { id: '2', title: 'Achyutam Keshavam', artist: 'Devotional', duration: '4:45', src: '/audio/bhajans/achyutam.mp3', category: 'Krishna' },
        { id: '3', title: 'Radhe Radhe Govinda', artist: 'Kirtan', duration: '6:12', src: '/audio/bhajans/radhe_govinda.mp3', category: 'Krishna' },
        { id: '4', title: 'Hanuman Chalisa', artist: 'M.S. Subbulakshmi', duration: '9:55', src: '/audio/bhajans/hanuman_chalisa.mp3', category: 'Hanuman' },
        { id: '5', title: 'Hey Ram Hey Ram', artist: 'Jagjit Singh', duration: '5:10', src: '/audio/bhajans/hey_ram.mp3', category: 'Ram' },
        { id: '6', title: 'Raghupati Raghav Raja Ram', artist: 'Traditional', duration: '4:20', src: '/audio/bhajans/raghupati.mp3', category: 'Ram' },
        { id: '7', title: 'Vaishnav Jan To', artist: 'Instrumental', duration: '3:50', src: '/audio/bhajans/vaishnav_jan.mp3', category: 'General' },
        { id: '8', title: 'Hare Krishna Mahamantra', artist: 'Spiritual', duration: '7:30', src: '/audio/bhajans/hare_krishna.mp3', category: 'Krishna' },
        { id: '9', title: 'Shiv Tandav Stotram', artist: 'Powerful', duration: '8:15', src: '/audio/bhajans/shiv_tandav.mp3', category: 'Shiva' },
        { id: '10', title: 'Om Jai Jagdish Hare', artist: 'Aarti', duration: '5:45', src: '/audio/bhajans/om_jai.mp3', category: 'General' },
    ];

    // State
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const audioRef = useRef(new Audio());

    // New State: Favorites & History
    const [favorites, setFavorites] = useState(() => {
        try {
            const saved = localStorage.getItem('bhajan_favorites');
            return new Set(saved ? JSON.parse(saved) : []);
        } catch (e) { return new Set(); }
    });

    const [history, setHistory] = useState(() => {
        try {
            const saved = localStorage.getItem('bhajan_history');
            return saved ? JSON.parse(saved) : [];
        } catch (e) { return []; }
    });

    // Mock download state
    const [downloadedTracks, setDownloadedTracks] = useState(new Set());

    // Persistence
    useEffect(() => {
        localStorage.setItem('bhajan_favorites', JSON.stringify([...favorites]));
    }, [favorites]);

    useEffect(() => {
        localStorage.setItem('bhajan_history', JSON.stringify(history));
    }, [history]);

    // Volume control
    useEffect(() => {
        audioRef.current.volume = volume;
    }, [volume]);

    // Handle song end (auto-next)
    useEffect(() => {
        const handleEnded = () => {
            next();
        };
        audioRef.current.addEventListener('ended', handleEnded);
        return () => audioRef.current.removeEventListener('ended', handleEnded);
    }, [currentSong]);

    const playTrack = (track) => {
        if (currentSong?.id === track.id && isPlaying) {
            pause();
            return;
        }

        pauseBgMusic();

        if (currentSong?.id === track.id && !isPlaying) {
            audioRef.current.play().catch(e => console.log('Playback failed', e));
            setIsPlaying(true);
            return;
        }

        setCurrentSong(track);
        // Add to history (remove duplicates, keep recent)
        setHistory(prev => {
            const newHistory = [track.id, ...prev.filter(id => id !== track.id)].slice(0, 20);
            return newHistory;
        });

        audioRef.current.src = track.src || '';
        audioRef.current.play().catch(e => console.log('Playback failed (placeholder URL?)', e));
        setIsPlaying(true);
    };

    const pause = () => {
        audioRef.current.pause();
        setIsPlaying(false);
    };

    const next = () => {
        if (!currentSong) return;
        const currentIndex = playlist.findIndex(t => t.id === currentSong.id);
        const nextIndex = (currentIndex + 1) % playlist.length;
        playTrack(playlist[nextIndex]);
    };

    const prev = () => {
        if (!currentSong) return;
        const currentIndex = playlist.findIndex(t => t.id === currentSong.id);
        const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        playTrack(playlist[prevIndex]);
    };

    const toggleFavorite = (trackId) => {
        setFavorites(prev => {
            const newFavs = new Set(prev);
            if (newFavs.has(trackId)) {
                newFavs.delete(trackId);
            } else {
                newFavs.add(trackId);
            }
            return newFavs;
        });
    };

    const downloadTrack = (trackId) => {
        // Mock download logic
        setTimeout(() => {
            setDownloadedTracks(prev => new Set([...prev, trackId]));
        }, 1500); // Simulate network delay
    };

    // Derived Lists
    const favoriteTracks = playlist.filter(t => favorites.has(t.id));
    const recommendedTracks = playlist.filter(t => !history.includes(t.id)).slice(0, 5); // Simple recommendation: unused tracks

    return (
        <BhajanContext.Provider value={{
            playlist,
            currentSong,
            isPlaying,
            volume,
            favorites,
            history,
            downloadedTracks,
            setVolume,
            playTrack,
            pause,
            next,
            prev,
            toggleFavorite,
            downloadTrack,
            favoriteTracks,
            recommendedTracks
        }}>
            {children}
        </BhajanContext.Provider>
    );
};
