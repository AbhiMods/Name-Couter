import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { NameProvider } from './context/NameContext';
import { StatsProvider } from './context/StatsContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LeaderboardProvider } from './context/LeaderboardContext';
import { BgMusicProvider } from './context/BgMusicContext';
import { BhajanProvider } from './context/BhajanContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
const Settings = lazy(() => import('./pages/Settings'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const Login = lazy(() => import('./pages/Login'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Progress = lazy(() => import('./pages/Progress'));
const Music = lazy(() => import('./pages/Music'));

const PageLoader = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '50vh',
    color: 'var(--color-primary)', fontFamily: 'var(--font-display)'
  }}>
    Loading...
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <StatsProvider>
            <BgMusicProvider>
              <BhajanProvider>
                <NameProvider>
                  <LeaderboardProvider>
                    <BrowserRouter>
                      <Suspense fallback={<PageLoader />}>
                        <Routes>
                          <Route path="/login" element={<Login />} />
                          <Route path="/" element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="leaderboard" element={<Leaderboard />} />
                            <Route path="progress" element={<Progress />} />
                            <Route path="music" element={<Music />} />
                            <Route
                              path="admin"
                              element={
                                <ProtectedRoute>
                                  <AdminPanel />
                                </ProtectedRoute>
                              }
                            />
                            <Route path="*" element={<Navigate to="/" replace />} />
                          </Route>
                        </Routes>
                      </Suspense>
                    </BrowserRouter>
                  </LeaderboardProvider>
                </NameProvider>
              </BhajanProvider>
            </BgMusicProvider>
          </StatsProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
