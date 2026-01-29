import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useBgMusic } from './BgMusicContext';
import { useStats } from './StatsContext';

const API_URL = 'http://localhost:5000/api/music';

const BhajanContext = createContext();

export const useBhajan = () => useContext(BhajanContext);

export const BhajanProvider = ({ children }) => {
    const { pause: pauseBgMusic } = useBgMusic();
    const { setIsMusicActive } = useStats(); // Use the new setter

    const initialPlaylist = [
        { id: '1', title: 'Shri Ram Chandra Kripalu', artist: 'Traditional', duration: '5:32', src: '/audio/bhajans/3.mp3', category: 'Bhajan', deity: 'Ram', mood: 'Devotional', thumbnail: '/images/ram.png' },
        { id: '2', title: 'Achyutam Keshavam', artist: 'Devotional', duration: '4:45', src: '/audio/bhajans/4.mp3', category: 'Bhajan', deity: 'Krishna', mood: 'Peaceful', thumbnail: '/images/krishna.png' },
        { id: '3', title: 'Radhe Radhe Govinda', artist: 'Kirtan', duration: '6:12', src: '/audio/bhajans/7.mp3', category: 'Kirtan', deity: 'Krishna', mood: 'Joyful', thumbnail: '/images/krishna.png' },
        { id: '4', title: 'Hanuman Chalisa', artist: 'M.S. Subbulakshmi', duration: '9:55', src: '/audio/bhajans/4.mp3', category: 'Stotram', deity: 'Hanuman', mood: 'Powerful', thumbnail: '/images/hanuman.png' },
        { id: '5', title: 'Hey Ram Hey Ram', artist: 'Jagjit Singh', duration: '5:10', src: '/audio/bhajans/5.mp3', category: 'Bhajan', deity: 'Ram', mood: 'Melancholic', thumbnail: '/images/ram.png' },
        { id: '6', title: 'Raghupati Raghav Raja Ram', artist: 'Traditional', duration: '4:20', src: '/audio/bhajans/6.mp3', category: 'Dhun', deity: 'Ram', mood: 'Calm', thumbnail: '/images/ram.png' },
        { id: '7', title: 'Vaishnav Jan To', artist: 'Instrumental', duration: '3:50', src: '/audio/bhajans/Abhishek.mp3', category: 'Instrumental', deity: 'General', mood: 'Peaceful', thumbnail: '/images/temple.png' },
        { id: '8', title: 'Hare Krishna Mahamantra', artist: 'Spiritual', duration: '7:30', src: '/audio/bhajans/Abhishek.mp3', category: 'Mantra', deity: 'Krishna', mood: 'Meditative', thumbnail: '/images/krishna.png' },
        { id: '9', title: 'Shiv Tandav Stotram', artist: 'Powerful', duration: '8:15', src: '/audio/bhajans/Abhishek.mp3', category: 'Stotram', deity: 'Shiva', mood: 'Energetic', thumbnail: '/images/shiva.png' },
        { id: '10', title: 'Om Jai Jagdish Hare', artist: 'Aarti', duration: '5:45', src: '/audio/bhajans/Abhishek.mp3', category: 'Aarti', deity: 'Vishnu', mood: 'Devotional', thumbnail: '/images/temple.png' },
    ];

    const [playlist, setPlaylist] = useState(initialPlaylist);
    const [isLoadingMusic, setIsLoadingMusic] = useState(true);

    // Fetch dynamic music
    useEffect(() => {
        const fetchMusic = async () => {
            try {
                const res = await fetch(API_URL);
                if (res.ok) {
                    const uploadedSongs = await res.json();
                    setPlaylist([...initialPlaylist, ...uploadedSongs]);
                }
            } catch (e) {
                console.log('Backend server offline or unreachable. Using static playlist.');
            } finally {
                setIsLoadingMusic(false);
            }
        };
        fetchMusic();
    }, []);

    // State
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.8);

    // Seek / Time State
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

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

    // Track Music Time Logic - Handled by StatsContext now via active flag
    useEffect(() => {
        setIsMusicActive(isPlaying);
    }, [isPlaying, setIsMusicActive]);

    // Audio Event Listeners (Time & End)
    useEffect(() => {
        const audio = audioRef.current;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => next();

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [currentSong]); // Re-bind if song changes (though ref is stable, good practice to ensure listeners are fresh for new source)

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

    const play = () => {
        if (audioRef.current && currentSong) {
            audioRef.current.play().catch(e => console.log('Resume failed', e));
            setIsPlaying(true);
        }
    };

    const stop = () => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
    };

    const seek = (time) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const next = () => {
        if (!currentSong) return;
        const currentIndex = playlist.findIndex(t => t.id === currentSong.id);
        const nextIndex = (currentIndex + 1) % playlist.length;
        playTrack(playlist[nextIndex]);
    };

    const prev = () => {
        if (!currentSong) return;
        // Prev logic usually just standard order for predictability
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
            isLoadingMusic,
            currentSong,
            isPlaying,
            volume,
            currentTime,
            duration,
            favorites,
            history,
            downloadedTracks,
            setVolume,
            playTrack,
            play,
            pause,
            stop,
            seek,
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
