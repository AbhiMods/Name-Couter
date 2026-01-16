import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { NameProvider } from './context/NameContext';
import { StatsProvider } from './context/StatsContext';
import { ThemeProvider } from './context/ThemeContext';
import { LeaderboardProvider } from './context/LeaderboardContext';
import { BgMusicProvider } from './context/BgMusicContext';
import { BhajanProvider } from './context/BhajanContext';
import { PromoProvider } from './context/PromoContext';
import { FeatureProvider } from './context/FeatureContext';
import { FeedbackProvider } from './context/FeedbackContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import OfflineIndicator from './components/common/OfflineIndicator';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
// const Settings = lazy(() => import('./pages/Settings')); // Removed
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Progress = lazy(() => import('./pages/Progress'));
const Music = lazy(() => import('./pages/Music'));
const Shorts = lazy(() => import('./pages/Shorts'));
const Counters = lazy(() => import('./pages/Counters'));

const PageLoader = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '50vh',
    color: 'var(--color-primary)', fontFamily: 'var(--font-display)'
  }}>
    Loading...
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <StatsProvider>
          <BgMusicProvider>
            <BhajanProvider>
              <NameProvider>
                <LeaderboardProvider>
                  <PromoProvider>
                    <FeatureProvider>
                      <FeedbackProvider>
                        <BrowserRouter>
                          <OfflineIndicator />
                          <ScrollToTop />
                          <Suspense fallback={<PageLoader />}>
                            <Routes>
                              <Route path="/" element={<Layout />}>
                                <Route index element={<Home />} />
                                <Route path="counters" element={<Counters />} />
                                {/* <Route path="settings" element={<Settings />} /> REMOVED */}
                                <Route path="leaderboard" element={<Leaderboard />} />
                                <Route path="progress" element={<Progress />} />
                                <Route path="music" element={<Music />} />
                                <Route path="shorts" element={<Shorts />} />
                                <Route path="*" element={<Navigate to="/" replace />} />
                              </Route>
                            </Routes>
                          </Suspense>
                        </BrowserRouter>
                      </FeedbackProvider>
                    </FeatureProvider>
                  </PromoProvider>
                </LeaderboardProvider>
              </NameProvider>
            </BhajanProvider>
          </BgMusicProvider>
        </StatsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
