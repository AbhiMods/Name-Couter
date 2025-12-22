import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useStats } from './StatsContext';
import { useAuth } from './AuthContext';

const LeaderboardContext = createContext(null);

const MOCK_LEADERBOARD = [
    { id: 'dev_1', name: 'Abhishek Sharma', count: 125400, avatar: '🕉️' },
    { id: 'dev_2', name: 'Aman Maurya', count: 98200, avatar: '✨' },
    { id: 'dev_3', name: 'Kajal Singh', count: 85000, avatar: '🙏' },
    { id: 'dev_4', name: 'Suraj Iyer', count: 62100, avatar: '📿' },
    { id: 'dev_5', name: 'Reyansh Gupta', count: 45000, avatar: '🌟' },
    { id: 'dev_6', name: 'Zoya Khan', count: 32000, avatar: '🌙' },
    { id: 'dev_7', name: 'Arjun Das', count: 21500, avatar: '🔥' },
    { id: 'dev_8', name: 'Meera Reddy', count: 18200, avatar: '🌸' },
    { id: 'dev_9', name: 'Siddharth Roy', count: 5400, avatar: '⚡' },
];

export const LeaderboardProvider = ({ children }) => {
    const { totalCount } = useStats();
    const { user } = useAuth();

    const leaderboardData = useMemo(() => {
        const currentUser = {
            id: user?.id || 'me',
            name: user?.name || 'You',
            count: totalCount,
            avatar: '🧘',
            isMe: true
        };

        const combined = [...MOCK_LEADERBOARD, currentUser];
        // Sort descending
        return combined.sort((a, b) => b.count - a.count);
    }, [totalCount, user]);

    const myRank = useMemo(() => {
        return leaderboardData.findIndex(item => item.isMe) + 1;
    }, [leaderboardData]);

    return (
        <LeaderboardContext.Provider value={{
            leaderboardData,
            myRank
        }}>
            {children}
        </LeaderboardContext.Provider>
    );
};

export const useLeaderboard = () => {
    const context = useContext(LeaderboardContext);
    if (!context) throw new Error('useLeaderboard must be used within LeaderboardProvider');
    return context;
};
