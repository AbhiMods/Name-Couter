import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { NameProvider } from './context/NameContext';
import { StatsProvider } from './context/StatsContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
const Settings = lazy(() => import('./pages/Settings'));

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
      <ThemeProvider>
        <NameProvider>
          <StatsProvider>
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
          </StatsProvider>
        </NameProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
