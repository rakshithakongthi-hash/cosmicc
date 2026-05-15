/**
 * DisasterSense AI - Alerts Page
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, MapPin, Clock, Users, ShieldCheck, ShieldAlert, ShieldX, ChevronDown, ExternalLink, AlertTriangle, Send } from 'lucide-react';
import AlertCard from '../components/alerts/AlertCard';
import CredibilityRing from '../components/verification/CredibilityRing';
import useStore from '../store/useStore';
import { sendEmailAlert } from '../services/notifications';
import { cn } from '../utils/cn';
import { timeAgo, getDisasterEmoji, formatDate } from '../utils/helpers';

const severityOptions = ['all', 'critical', 'high', 'medium', 'low'];
const statusOptions = ['all', 'Verified', 'Needs Review', 'Likely Fake'];
const typeOptions = ['all', 'flood', 'earthquake', 'wildfire', 'cyclone', 'landslide'];

export default function Alerts() {
  const { filters, setFilters, selectedAlert, setSelectedAlert, getFilteredAlerts, addNotification } = useStore();
  const filteredAlerts = getFilteredAlerts();
  const [showFilters, setShowFilters] = useState(false);

  const handleBroadcast = async (alert) => {
    const success = await sendEmailAlert(alert);
    if (success) {
      addNotification({ title: 'Email Broadcast', message: 'Email broadcast sent successfully!', type: 'success' });
    } else {
      addNotification({ title: 'Email Broadcast Failed', message: 'Failed to send email. Check console or your EmailJS config in .env.', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Alert Center</h1>
          <p className="text-sm text-slate-500 mt-1">{filteredAlerts.length} alerts found</p>
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(148,163,184,0.15)' }}>
          <Filter size={14} /> Filters <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="glass-card p-4 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Severity</label>
                <div className="flex flex-wrap gap-1.5">
                  {severityOptions.map(s => (
                    <button key={s} onClick={() => setFilters({ severity: s })}
                      className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize',
                        filters.severity === s ? 'text-white' : 'text-slate-500 hover:text-slate-300')}
                      style={filters.severity === s ? { background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)' } : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(148,163,184,0.08)' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Status</label>
                <div className="flex flex-wrap gap-1.5">
                  {statusOptions.map(s => (
                    <button key={s} onClick={() => setFilters({ status: s })}
                      className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                        filters.status === s ? 'text-white' : 'text-slate-500 hover:text-slate-300')}
                      style={filters.status === s ? { background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)' } : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(148,163,184,0.08)' }}>
                      {s === 'all' ? 'All' : s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Type</label>
                <div className="flex flex-wrap gap-1.5">
                  {typeOptions.map(s => (
                    <button key={s} onClick={() => setFilters({ type: s })}
                      className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize',
                        filters.type === s ? 'text-white' : 'text-slate-500 hover:text-slate-300')}
                      style={filters.type === s ? { background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)' } : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(148,163,184,0.08)' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Alert List */}
        <div className="lg:col-span-3 space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-slate-500 text-sm">No alerts match your filters</p>
            </div>
          ) : (
            filteredAlerts.map((alert, i) => (
              <AlertCard key={alert.id} alert={alert} onClick={setSelectedAlert} index={i} />
            ))
          )}
        </div>

        {/* Alert Detail Panel */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedAlert ? (
              <motion.div key={selectedAlert.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="glass-card p-5 sticky top-24 space-y-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getDisasterEmoji(selectedAlert.disaster_type)}</span>
                    <div>
                      <h2 className="text-lg font-bold text-white">{selectedAlert.disaster_type}</h2>
                      <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={11} />{selectedAlert.location}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedAlert(null)} className="text-slate-500 hover:text-white"><X size={16} /></button>
                </div>

                {/* Credibility */}
                <div className="flex items-center justify-center py-2">
                  <CredibilityRing score={selectedAlert.credibility_score} />
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-[11px] text-slate-500 font-medium uppercase mb-1">Summary</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{selectedAlert.summary}</p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-[11px] text-slate-500 font-medium uppercase mb-1">Recommended Action</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{selectedAlert.recommended_action}</p>
                  </div>
                </div>

                {/* Verification Notes */}
                <div>
                  <p className="text-[11px] text-slate-500 font-medium uppercase mb-2">Verification Notes</p>
                  <div className="space-y-1.5">
                    {selectedAlert.verification_notes?.map((note, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                        <ShieldCheck size={12} className="text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{note}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Meta */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 rounded-lg text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-[10px] text-slate-500">Confidence</p>
                    <p className="text-sm font-bold text-white">{Math.round(selectedAlert.confidence * 100)}%</p>
                  </div>
                  <div className="p-2 rounded-lg text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-[10px] text-slate-500">Fake Probability</p>
                    <p className="text-sm font-bold text-red-400">{Math.round(selectedAlert.fake_probability * 100)}%</p>
                  </div>
                  <div className="p-2 rounded-lg text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-[10px] text-slate-500">Sources</p>
                    <p className="text-sm font-bold text-white">{selectedAlert.source_count}</p>
                  </div>
                  <div className="p-2 rounded-lg text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-[10px] text-slate-500">Detected</p>
                    <p className="text-sm font-bold text-white">{timeAgo(selectedAlert.created_at)}</p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button 
                    onClick={() => handleBroadcast(selectedAlert)}
                    className="btn-glow flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all"
                  >
                    <Send size={14} /> Broadcast Email Alert
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="glass-card p-12 text-center sticky top-24">
                <AlertTriangle size={32} className="text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-500">Select an alert to view details</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
