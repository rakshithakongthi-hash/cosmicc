/**
 * DisasterSense AI - Live Map Page (Full Screen)
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Filter, AlertTriangle } from 'lucide-react';
import DisasterMap from '../components/maps/DisasterMap';
import useStore from '../store/useStore';
import { cn } from '../utils/cn';
import { getDisasterEmoji, timeAgo } from '../utils/helpers';

const typeFilters = ['All', 'Flood', 'Earthquake', 'Wildfire', 'Cyclone', 'Landslide'];

export default function LiveMap() {
  const { alerts } = useStore();
  const [activeType, setActiveType] = useState('All');

  const filtered = activeType === 'All' ? alerts : alerts.filter(a => a.disaster_type === activeType);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Live Disaster Map</h1>
          <p className="text-sm text-slate-600 mt-1">Real-time geospatial overview of all incidents</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {typeFilters.map(t => (
            <button key={t} onClick={() => setActiveType(t)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                activeType === t ? 'text-white' : 'text-slate-600 hover:text-slate-900')}
              style={activeType === t
                ? { background: '#2563eb', border: '1px solid #2563eb' }
                : { background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        {/* Map */}
        <div className="lg:col-span-3">
          <DisasterMap height="calc(100vh - 220px)" alerts={filtered} />
        </div>

        {/* Sidebar Legend + List */}
        <div className="space-y-4">
          {/* Legend */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Layers size={14} className="text-slate-400" />
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Legend</h3>
            </div>
            <div className="space-y-2">
              {[
                { color: '#ef4444', label: 'Critical' },
                { color: '#f97316', label: 'High' },
                { color: '#eab308', label: 'Medium' },
                { color: '#22c55e', label: 'Low' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: l.color, boxShadow: `0 0 8px ${l.color}60` }} />
                  <span className="text-xs text-slate-600">{l.label} Severity</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Incidents List */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="glass-card p-4 max-h-[calc(100vh-400px)] overflow-y-auto">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Active Incidents</h3>
            <div className="space-y-2">
              {filtered.map(a => (
                <div key={a.id} className="p-3 rounded-xl cursor-pointer hover:bg-white/5 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{getDisasterEmoji(a.disaster_type)}</span>
                    <span className="text-xs font-medium text-white flex-1 truncate">{a.disaster_type}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase"
                      style={{
                        color: a.severity === 'Critical' ? '#ef4444' : a.severity === 'High' ? '#f97316' : '#eab308',
                        background: a.severity === 'Critical' ? 'rgba(239,68,68,0.1)' : a.severity === 'High' ? 'rgba(249,115,22,0.1)' : 'rgba(234,179,8,0.1)',
                      }}>
                      {a.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 truncate">{a.location}</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">{timeAgo(a.created_at)}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
