/**
 * DisasterSense AI - Top Navigation Bar
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, X, Wifi, WifiOff, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';

export default function Navbar() {
  const { notifications, clearNotifications, isDemoMode, filters, setFilters } = useStore();
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b sticky top-0 z-30"
      style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)', borderColor: 'rgba(148, 163, 184, 0.15)' }}>
      
      {/* Search */}
      <div className={`relative flex items-center transition-all duration-300 ${searchFocused ? 'w-96' : 'w-72'}`}>
        <Search size={16} className="absolute left-3 text-slate-500" />
        <input
          type="text"
          placeholder="Search alerts, locations, disasters..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="w-full pl-10 pr-4 py-2 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
          style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${searchFocused ? 'rgba(56,189,248,0.4)' : 'rgba(148, 163, 184, 0.15)'}` }}
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Connection Status */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium"
          style={{ background: 'rgba(22,163,74,0.1)', color: '#16a34a', border: '1px solid rgba(22,163,74,0.15)' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span>Live</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2.5 rounded-xl text-slate-500 hover:text-slate-900 transition-colors"
            style={{ background: 'rgba(0,0,0,0.05)' }}
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center rounded-full text-[9px] font-bold text-white"
                style={{ background: '#ef4444' }}>
                {notifications.length}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 top-12 w-80 rounded-2xl overflow-hidden shadow-2xl"
                style={{ background: '#0c311e', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgba(148,163,184,0.1)' }}>
                  <span className="text-sm font-semibold text-white">Notifications</span>
                  <button onClick={() => { clearNotifications(); setShowNotifs(false); }} className="text-xs text-slate-500 hover:text-slate-700">Clear all</button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-6 text-center text-sm text-slate-500">No new notifications</p>
                  ) : (
                    notifications.slice(0, 8).map((n) => (
                      <div key={n.id} className="px-4 py-3 border-b hover:bg-white/5 transition-colors" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                        <p className="text-xs text-white">{n.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Login Button */}
        <button
          onClick={() => navigate('/auth')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)' }}
        >
          <LogIn size={14} /> Login
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
          DS
        </div>
      </div>
    </header>
  );
}
