import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const BgMusicContext = createContext();

export const useBgMusic = () => useContext(BgMusicContext);

export const BgMusicProvider = ({ children }) => {
    // Default tracks - in a real app these would be imported or fetched
    const tracks = [
        { id: 'none', label: 'None', src: '' },
        { id: 'om', label: 'Om Chanting', src: '/audio/om_chant.mp3' },
        { id: 'flute', label: 'Meditation Flute', src: '/audio/flute_meditation.mp3' },
        { id: 'rain', label: 'Gentle Rain', src: '/audio/rain_ambience.mp3' },
        { id: 'temple', label: 'Temple Bells', src: '/audio/temple_bells.mp3' },
    ];

    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedTrackId, setSelectedTrackId] = useState(() => {
        return localStorage.getItem('bg_music_track') || 'none';
    });
    const [volume, setVolume] = useState(() => {
        return parseFloat(localStorage.getItem('bg_music_volume')) || 0.5;
    });

    const audioRef = useRef(new Audio());

    // Persist settings
    useEffect(() => {
        localStorage.setItem('bg_music_track', selectedTrackId);
    }, [selectedTrackId]);

    useEffect(() => {
        localStorage.setItem('bg_music_volume', volume);
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Handle track changes
    useEffect(() => {
        const track = tracks.find(t => t.id === selectedTrackId);

        // Stop current audio
        audioRef.current.pause();
        audioRef.current.currentTime = 0;

        if (track && track.src) {
            audioRef.current.src = track.src;
            audioRef.current.loop = true;
            audioRef.current.volume = volume;

            // If it was already playing (and we just changed tracks), keep playing
            // if (isPlaying) {
            //    startAudio();
            // } 
            // Better UX: Don't auto-start on track change unless active, 
            // but usually changing track in settings implies preview?
            // For now, let's respect the isPlaying state.
            if (isPlaying) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log("Audio playback failed:", error);
                    });
                }
            }
        } else {
            // 'None' selected
            audioRef.current.src = '';
        }
    }, [selectedTrackId]);

    // Watch isPlaying state
    useEffect(() => {
        const track = tracks.find(t => t.id === selectedTrackId);
        if (!track || !track.src) return;

        if (isPlaying) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Audio playback failed:", error);
                    setIsPlaying(false);
                });
            }
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, selectedTrackId]);


    const play = () => {
        if (selectedTrackId !== 'none') {
            setIsPlaying(true);
        }
    };

    const pause = () => {
        setIsPlaying(false);
    };

    const stop = () => {
        setIsPlaying(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    return (
        <BgMusicContext.Provider value={{
            tracks,
            selectedTrackId,
            setSelectedTrackId,
            volume,
            setVolume,
            isPlaying,
            play,
            pause,
            stop
        }}>
            {children}
        </BgMusicContext.Provider>
    );
};
