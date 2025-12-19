import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Simulating API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for persisted session
        const storedUser = localStorage.getItem('divine_auth_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Auth parsing error", e);
                localStorage.removeItem('divine_auth_user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        await delay(800); // Fake network request

        // Mock validation
        // In a real app, this goes to backend
        if (!email.includes('@')) throw new Error('Invalid email address');
        if (password.length < 6) throw new Error('Password must be at least 6 characters');

        // Simulate success
        const isAdmin = email.toLowerCase() === 'admin@example.com';
        const mockUser = {
            id: 'u_123',
            email,
            name: email.split('@')[0],
            role: isAdmin ? 'admin' : 'user'
        };
        setUser(mockUser);
        localStorage.setItem('divine_auth_user', JSON.stringify(mockUser));
        return mockUser;
    };

    const register = async (email, password, name) => {
        await delay(800);

        if (!email.includes('@')) throw new Error('Invalid email address');
        if (password.length < 6) throw new Error('Password must be at least 6 characters');

        const mockUser = { id: 'u_' + Date.now(), email, name: name || email.split('@')[0] };
        setUser(mockUser);
        localStorage.setItem('divine_auth_user', JSON.stringify(mockUser));
        return mockUser;
    };

    const logout = async () => {
        await delay(400);
        setUser(null);
        localStorage.removeItem('divine_auth_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
