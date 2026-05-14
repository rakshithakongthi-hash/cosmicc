/**
 * DisasterSense AI - Sidebar Navigation
 */
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, LayoutDashboard, AlertTriangle, ShieldCheck,
  Map, Settings, ChevronLeft, ChevronRight, Activity, Zap,
} from 'lucide-react';
import useStore from '../../store/useStore';
import { cn } from '../../utils/cn';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { path: '/verification', label: 'Verification', icon: ShieldCheck },
  { path: '/map', label: 'Live Map', icon: Map },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, alerts } = useStore();
  const activeAlerts = alerts.filter(a => a.verification_status === 'Verified').length;

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 260 : 72 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col border-r"
      style={{
        background: 'linear-gradient(180deg, #0f1629 0%, #0a0e1a 100%)',
        borderColor: 'rgba(148, 163, 184, 0.08)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b" style={{ borderColor: 'rgba(148,163,184,0.08)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
          <Zap size={20} className="text-white" />
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="overflow-hidden whitespace-nowrap">
              <h1 className="text-sm font-bold text-white">DisasterSense</h1>
              <p className="text-[10px] text-slate-500">AI Detection Platform</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative',
              isActive
                ? 'text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div layoutId="activeNav" className="absolute inset-0 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1))', border: '1px solid rgba(59,130,246,0.2)' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                )}
                <Icon size={18} className="relative z-10 flex-shrink-0" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10">
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {label === 'Alerts' && activeAlerts > 0 && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[20px] h-5 flex items-center justify-center rounded-full text-[10px] font-bold text-white z-10"
                    style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}>
                    {activeAlerts}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Status + Collapse */}
      <div className="p-3 border-t" style={{ borderColor: 'rgba(148,163,184,0.08)' }}>
        {sidebarOpen && (
          <div className="mb-3 px-2 py-2 rounded-lg" style={{ background: 'rgba(34,197,94,0.08)' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] text-green-400 font-medium">System Active</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Activity size={12} className="text-slate-500" />
              <span className="text-[10px] text-slate-500">Monitoring 6 sources</span>
            </div>
          </div>
        )}
        <button onClick={toggleSidebar} className="w-full flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors">
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
    </motion.aside>
  );
}
