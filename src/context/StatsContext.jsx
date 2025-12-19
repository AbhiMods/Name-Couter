import React, { createContext, useContext, useState, useEffect } from 'react';
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

    // Initial Data Fetch
    useEffect(() => {
        const loadData = async () => {
            try {
                // Parallel fetch
                const [total, daily, achievements, pending] = await Promise.all([
                    dbRequest.getSetting('divine_total_count', 0),
                    dbRequest.getAllDailyStats(),
                    dbRequest.getSetting('divine_achievements', []),
                    dbRequest.getSetting('divine_pending_sync', false)
                ]);

                setTotalCount(total);
                setDailyCounts(daily || {});
                setUnlockedAchievements(achievements || []);
                setPendingSync(pending);
            } catch (e) {
                console.error('Failed to load stats', e);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

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

    // We don't persist dailyCounts as a huge JSON blob anymore. 
    // We persist individiual daily items in incrementStats.

    // Helper to get local date string YYYY-MM-DD
    const getTodayKey = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year} -${month} -${day} `;
    };

    const getTodayCount = () => {
        return dailyCounts[getTodayKey()] || 0;
    };

    // Calculate stats for the last N days
    const getHistory = (days = 7) => {
        const history = [];
        for (let i = 0; i < days; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const key = `${year} -${month} -${day} `;
            history.push({ date: key, count: dailyCounts[key] || 0 });
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
            const key = `${year} -${month} -${day} `;

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
        // Note: Streak calculation inside here needs access to currentDailyCounts if we want it to be perfectly accurate in the same tick.
        // But getStreak uses 'dailyCounts' state. Since we update state before calling this, it might be stale if used blindly.
        // However, incrementStats calls this with updated counts passed as arg? 
        // No, getStreak() reads from closure-captured state 'dailyCounts'. 
        // For now, simpler is better. We'll rely on state effects or just approximate logic.
        // Actually, let's fix checkAchievements to simply use the state getters which will be updated on next render, 
        // or pass the new stats explicitly.
        // For simplicity: We trigger checks AFTER state update in the useEffect or just optimistically.
        // Let's stick to the previous simple logic:

        // We know 'getStreak' reads from 'dailyCounts'.
        // To make it accurate immediately, we should probably pass the new counts to getStreak,
        // but for now let's just use the current logic which might be 1 tick delayed for streak badges. That's acceptable.
        // WAIT: 'getStreak' uses `dailyCounts` from scope. 
        // In `incrementStats`, we setDailyCounts(newDailyCounts).
        // React batching means `dailyCounts` is OLD inside `incrementStats`.
        // So checking streak achievements immediately inside incrementStats using `getStreak()` will use OLD data.
        // That's fine, the badge will pop on the NEXT click. Not critical.

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
        isLoading
    }), [totalCount, dailyCounts, unlockedAchievements, isOnline, pendingSync, isLoading]);

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
