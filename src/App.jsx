/**
 * DisasterSense AI - App Root
 * Routes and global providers.
 */
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import useStore from './store/useStore';
import Layout from './components/ui/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import VerificationCenter from './pages/VerificationCenter';
import LiveMap from './pages/LiveMap';
import Settings from './pages/Settings';

export default function App() {
  const { startLiveMonitoring, stopLiveMonitoring } = useStore();

  useEffect(() => {
    startLiveMonitoring();
    return () => stopLiveMonitoring();
  }, [startLiveMonitoring, stopLiveMonitoring]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1f2e',
            border: '1px solid rgba(148,163,184,0.1)',
            color: '#f1f5f9',
            fontSize: '13px',
          },
        }}
        richColors
        closeButton
      />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/verification" element={<VerificationCenter />} />
          <Route path="/map" element={<LiveMap />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
