import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
// import { NameProvider } from './context/NameContext'; // REMOVED
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
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const Counters = lazy(() => import('./pages/Counters'));
import UpcomingFestivals from './pages/UpcomingFestivals';
const Library = lazy(() => import('./pages/Library'));
const WallpaperLibrary = lazy(() => import('./pages/wallpapers/WallpaperLibrary'));

const HareKrishnaHome = lazy(() => import('./pages/HareKrishnaHome'));
const MantraLibrary = lazy(() => import('./pages/mantras/MantraLibrary'));
const HanumanChalisa = lazy(() => import('./pages/mantras/HanumanChalisa'));
const GayatriMantra = lazy(() => import('./pages/mantras/GayatriMantra'));

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
                                <Route index element={<Counters />} />
                                <Route path="radha-naam-jap-counter" element={<Home />} />
                                <Route path="hare-krishna-naam-jap-counter" element={<HareKrishnaHome />} />
                                <Route path="library" element={<Library />} />
                                <Route path="library/wallpapers" element={<WallpaperLibrary />} />
                                <Route path="library/upcoming-festivals" element={<UpcomingFestivals />} />
                                <Route path="library/mantras" element={<MantraLibrary />} />
                                <Route path="hanuman-chalisa" element={<HanumanChalisa />} />
                                <Route path="gayatri-mantra" element={<GayatriMantra />} />
                                {/* <Route path="settings" element={<Settings />} /> REMOVED */}
                                <Route path="leaderboard" element={<Leaderboard />} />
                                <Route path="progress" element={<Progress />} />
                                <Route path="bhajan" element={<Music />} />
                                <Route path="aastha" element={<Shorts />} />
                                <Route path="calendar" element={<CalendarPage />} />
                                <Route path="*" element={<Navigate to="/" replace />} />
                              </Route>
                            </Routes>
                          </Suspense>
                        </BrowserRouter>
                      </FeedbackProvider>
                    </FeatureProvider>
                  </PromoProvider>
                </LeaderboardProvider>
            </BhajanProvider>
          </BgMusicProvider>
        </StatsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
