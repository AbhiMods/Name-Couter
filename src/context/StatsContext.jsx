import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { dbRequest } from '../services/StorageService';

const StatsContext = createContext(null);

const ACHIEVEMENTS_LIST = [
    { id: 'begin', label: 'First Step', threshold: 1, type: 'count', icon: '🙏', desc: 'Chanted your first name' },
    { id: 'mala_1', label: 'One Mala', threshold: 108, type: 'count', icon: '📿', desc: 'Completed 108 chants' },
    { id: 'streak_3', label: 'Dedicated', threshold: 3, type: 'streak', icon: '🔥', desc: '3-day chanting streak' },
    { id: 'mala_10', label: 'Devotee', threshold: 1080, type: 'count', icon: '✨', desc: 'Completed 10 Malas' },
    { id: 'streak_7', label: 'Unstoppable', threshold: 7, type: 'streak', icon: '⚡', desc: '7-day chanting streak' },
    { id: 'grand_10k', label: 'Saintly', threshold: 10000, type: 'count', icon: '🌟', desc: 'Reached 10,000 chants' },
    { id: 'master_100k', label: 'Divine Connection', threshold: 100000, type: 'count', icon: '🕉️', desc: 'Reached 100,000 chants' },
];

export const StatsProvider = ({ children }) => {
    // Initial states with defaults (will hydrate from DB)
    const [totalCount, setTotalCount] = useState(0);
    const [dailyCounts, setDailyCounts] = useState({});
    const [unlockedAchievements, setUnlockedAchievements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Time Stats State (structure: { japa: { date: seconds }, music: { date: seconds }, overlap: { date: seconds } })
    const [timeStats, setTimeStats] = useState({ japa: {}, music: {}, overlap: {} });

    // Active States for Real-time Tracking
    const [isJapaActive, setIsJapaActive] = useState(false);
    const [isMusicActive, setIsMusicActive] = useState(false);

    const lastInteractionTime = useRef(0);

    // Initial Data Fetch
    useEffect(() => {
        const loadData = async () => {
            try {
                const [total, daily, achievements, pending, savedTimeStats] = await Promise.all([
                    dbRequest.getSetting('divine_total_count', 0),
                    dbRequest.getAllDailyStats(),
                    dbRequest.getSetting('divine_achievements', []),
                    dbRequest.getSetting('divine_pending_sync', false),
                    dbRequest.getSetting('divine_time_stats', { japa: {}, music: {}, overlap: {} })
                ]);

                setTotalCount(total);
                setDailyCounts(daily || {});
                setUnlockedAchievements(achievements || []);
                setPendingSync(pending);
                setTimeStats(savedTimeStats || { japa: {}, music: {}, overlap: {} });
            } catch (e) {
                console.error('Failed to load stats', e);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    // Persist Time Stats
    useEffect(() => {
        if (!isLoading) {
            dbRequest.setSetting('divine_time_stats', timeStats);
        }
    }, [timeStats, isLoading]);

    // Persist Effects
    useEffect(() => {
        if (!isLoading) {
            dbRequest.setSetting('divine_total_count', totalCount);
        }
    }, [totalCount, isLoading]);

    useEffect(() => {
        if (!isLoading) {
            dbRequest.setSetting('divine_achievements', unlockedAchievements);
        }
    }, [unlockedAchievements, isLoading]);

    // Helper to get local date string YYYY-MM-DD
    const getTodayKey = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getTodayCount = () => {
        return dailyCounts[getTodayKey()] || 0;
    };

    // Calculate stats for the last N days
    const getHistory = (days = 7) => {
        const history = [];
        const today = new Date();
        for (let i = 0; i < days; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const key = `${year}-${month}-${day}`;
            history.push({
                date: key,
                label: d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' }),
                count: dailyCounts[key] || 0
            });
        }
        return history.reverse(); // Return oldest to newest
    };

    const getStreak = () => {
        let streak = 0;
        const today = new Date();

        // check today
        const todayKey = getTodayKey();
        if ((dailyCounts[todayKey] || 0) > 0) streak++;

        // check past days
        for (let i = 1; i < 365; i++) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const key = `${year}-${month}-${day}`;

            if ((dailyCounts[key] || 0) > 0) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    };

    // Achievement Checker
    const checkAchievements = (newTotal, currentDailyCounts) => {
        const newUnlocked = [];
        const currentStreak = getStreak();

        ACHIEVEMENTS_LIST.forEach(ach => {
            if (unlockedAchievements.includes(ach.id)) return;

            let unlocked = false;
            if (ach.type === 'count' && newTotal >= ach.threshold) unlocked = true;
            if (ach.type === 'streak' && currentStreak >= ach.threshold) unlocked = true;

            if (unlocked) {
                newUnlocked.push(ach.id);
            }
        });

        if (newUnlocked.length > 0) {
            setUnlockedAchievements(prev => [...prev, ...newUnlocked]);
        }
    };

    // Offline / Sync Logic
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [pendingSync, setPendingSync] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            if (pendingSync) {
                setTimeout(() => {
                    setPendingSync(false);
                    dbRequest.setSetting('divine_pending_sync', false);
                }, 1000);
            }
        };
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [pendingSync]);

    const incrementStats = (amount = 1) => {
        const today = getTodayKey();
        const currentTodayCount = dailyCounts[today] || 0;
        const newTodayCount = currentTodayCount + amount;

        // Update interaction time for active session tracking
        lastInteractionTime.current = Date.now();
        // Implicitly active if incrementing stats
        setIsJapaActive(true);

        const newDailyCounts = {
            ...dailyCounts,
            [today]: newTodayCount
        };

        setDailyCounts(newDailyCounts);

        // Secure DB Persist (Individual Record)
        dbRequest.saveDailyStat(today, newTodayCount);

        if (!isOnline) {
            setPendingSync(true);
            dbRequest.setSetting('divine_pending_sync', true);
        }

        setTotalCount(prev => {
            const newTotal = prev + amount;
            checkAchievements(newTotal, newDailyCounts);
            return newTotal;
        });
    };

    // --- TIME TRACKING LOGIC ---

    const incrementTime = (updates) => {
        const today = getTodayKey();
        setTimeStats(prev => {
            const newState = { ...prev };

            Object.keys(updates).forEach(type => {
                if (!newState[type]) newState[type] = {};
                const current = newState[type][today] || 0;
                newState[type][today] = current + updates[type];
            });

            return newState;
        });
    };

    // --- NOTIFICATION LOGIC ---
    const [milestoneAlerts, setMilestoneAlerts] = useState(true);
    const [reminderTime, setReminderTime] = useState(''); // "HH:MM" format

    useEffect(() => {
        dbRequest.getSetting('divine_notification_config', { milestone: true, time: '' })
            .then(config => {
                setMilestoneAlerts(config.milestone);
                setReminderTime(config.time || '');
            });
    }, []);

    useEffect(() => {
        if (!isLoading) {
            dbRequest.setSetting('divine_notification_config', { milestone: milestoneAlerts, time: reminderTime });
        }
    }, [milestoneAlerts, reminderTime, isLoading]);

    const sendNotification = (title, body) => {
        if (!("Notification" in window)) return;

        if (Notification.permission === "granted") {
            new Notification(title, { body, icon: '/vite.svg' });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification(title, { body, icon: '/vite.svg' });
                }
            });
        }
    };

    // Central Timer Interval
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const dateObj = new Date();

            // Daily Reminder Check (Approximate minute match)
            if (reminderTime && reminderTime !== '') {
                const currentHM = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
                // Trigger only at 00 seconds to avoid multiple alerts
                if (currentHM === reminderTime && dateObj.getSeconds() === 0) {
                    sendNotification("Daily Chant Reminder", "It's time for your daily spiritual practice. 🙏");
                }
            }

            // Safe fallback: If last interaction > 60s, assume paused?
            if (isJapaActive && (now - lastInteractionTime.current > 60000)) {
                // Logic kept simple as per original
            }

            const updates = {};
            if (isJapaActive) updates.japa = 1;
            if (isMusicActive) updates.music = 1;

            // Track Overlap
            if (isJapaActive && isMusicActive) {
                updates.overlap = 1;
            }

            if (Object.keys(updates).length > 0) {
                incrementTime(updates);
            }

        }, 1000);

        return () => clearInterval(interval);
    }, [isJapaActive, isMusicActive, reminderTime]); // dependent on reminderTime now


    const getSpiritualTime = (range = 'today') => {
        // range: 'today', 'week', 'month'
        const todayKey = getTodayKey();

        if (range === 'today') {
            const japa = timeStats.japa?.[todayKey] || 0;
            const music = timeStats.music?.[todayKey] || 0;
            const overlap = timeStats.overlap?.[todayKey] || 0;
            return { japa, music, overlap, total: (japa + music - overlap) }; // simple union logic
        }

        // Logic for week/month aggregation can be added here if needed
        return { japa: 0, music: 0, overlap: 0, total: 0 };
    };

    // Aggregation Logic for Week/Month
    const getAggregatedTime = (range) => {
        let japaTotal = 0;
        let musicTotal = 0;
        let overlapTotal = 0;

        const now = new Date();
        const days = range === 'week' ? 7 : (range === 'month' ? 30 : 1);

        for (let i = 0; i < days; i++) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const key = `${year}-${month}-${day}`;

            japaTotal += (timeStats.japa?.[key] || 0);
            musicTotal += (timeStats.music?.[key] || 0);
            overlapTotal += (timeStats.overlap?.[key] || 0);
        }

        return {
            japa: japaTotal,
            music: musicTotal,
            overlap: overlapTotal,
            total: (japaTotal + musicTotal - overlapTotal)
        };
    };

    const value = React.useMemo(() => ({
        totalCount,
        todayCount: dailyCounts[getTodayKey()] || 0,
        incrementStats,
        achievements: ACHIEVEMENTS_LIST,
        unlockedAchievements,
        getHistory,
        getStreak,
        isOnline,
        pendingSync,
        isLoading,
        lastInteractionTime,
        getSpiritualTime,
        getAggregatedTime,
        setIsJapaActive, // Exported setter
        setIsMusicActive, // Exported setter
        isJapaActive,
        isMusicActive,
        // Notifications
        milestoneAlerts, setMilestoneAlerts,
        reminderTime, setReminderTime
    }), [
        totalCount, dailyCounts, unlockedAchievements, isOnline, pendingSync,
        isLoading, timeStats, isJapaActive, isMusicActive,
        milestoneAlerts, reminderTime
    ]);

    return (
        <StatsContext.Provider value={value}>
            {children}
        </StatsContext.Provider>
    );
};

export const useStats = () => {
    const context = useContext(StatsContext);
    if (context === undefined) {
        throw new Error('useStats must be used within a StatsProvider');
    }
    return context;
};
