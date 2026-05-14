/**
 * DisasterSense AI - Dashboard Page
 */
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldCheck, ShieldX, Activity, Eye, Radio, Clock, TrendingUp } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import TrendsChart from '../components/charts/TrendsChart';
import AlertCard from '../components/alerts/AlertCard';
import DisasterMap from '../components/maps/DisasterMap';
import useStore from '../store/useStore';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { stats, alerts, setSelectedAlert } = useStore();
  const navigate = useNavigate();

  const handleAlertClick = (alert) => {
    setSelectedAlert(alert);
    navigate(`/alerts`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Command Center</h1>
        <p className="text-sm text-slate-500 mt-1">Real-time disaster monitoring and analytics</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Alerts" value={stats.total_alerts} subtitle="Last 24 hours" icon={AlertTriangle} color="#3b82f6" trend={12} delay={0} />
        <StatCard title="Verified" value={stats.verified_alerts} subtitle={`${Math.round(stats.verified_alerts/stats.total_alerts*100)}% verification rate`} icon={ShieldCheck} color="#22c55e" trend={8} delay={0.05} />
        <StatCard title="Pending Review" value={stats.pending_review} subtitle="Awaiting verification" icon={Eye} color="#eab308" trend={-5} delay={0.1} />
        <StatCard title="Fake Detected" value={stats.fake_detected} subtitle="Misinformation filtered" icon={ShieldX} color="#ef4444" trend={-15} delay={0.15} />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Posts Analyzed" value={stats.posts_analyzed.toLocaleString()} icon={Activity} color="#8b5cf6" delay={0.2} />
        <StatCard title="Active Monitors" value={stats.active_monitors} icon={Radio} color="#06b6d4" delay={0.25} />
        <StatCard title="Avg Credibility" value={`${Math.round(stats.avg_credibility * 100)}%`} icon={TrendingUp} color="#22c55e" delay={0.3} />
        <StatCard title="Avg Response" value={stats.response_time_avg} icon={Clock} color="#f97316" delay={0.35} />
      </div>

      {/* Charts + Map Row */}
      <div className="grid lg:grid-cols-2 gap-4">
        <TrendsChart />
        <DisasterMap height="380px" />
      </div>

      {/* Recent Alerts */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Recent Alerts</h2>
            <p className="text-xs text-slate-500">Latest disaster detections</p>
          </div>
          <button onClick={() => navigate('/alerts')} className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">
            View All →
          </button>
        </div>
        <div className="space-y-3">
          {alerts.slice(0, 4).map((alert, i) => (
            <AlertCard key={alert.id} alert={alert} onClick={handleAlertClick} index={i} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
