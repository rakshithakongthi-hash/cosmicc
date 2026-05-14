/**
 * DisasterSense AI - Alert Card Component
 */
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, ChevronRight, ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import { cn } from '../../utils/cn';
import { timeAgo, getDisasterEmoji, formatCredibility, getSeverityClass } from '../../utils/helpers';

const statusConfig = {
  Verified: { icon: ShieldCheck, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  'Needs Review': { icon: ShieldAlert, color: '#eab308', bg: 'rgba(234,179,8,0.1)' },
  'Likely Fake': { icon: ShieldX, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
};

export default function AlertCard({ alert, onClick, index = 0 }) {
  const status = statusConfig[alert.verification_status] || statusConfig['Needs Review'];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={() => onClick?.(alert)}
      className="glass-card p-4 cursor-pointer group"
    >
      <div className="flex items-start gap-4">
        {/* Disaster Type Icon */}
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.05)' }}>
          {getDisasterEmoji(alert.disaster_type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-white">{alert.disaster_type}</h3>
            <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase', getSeverityClass(alert.severity))}>
              {alert.severity}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1"
              style={{ background: status.bg, color: status.color, border: `1px solid ${status.color}30` }}>
              <StatusIcon size={10} />
              {alert.verification_status}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">{alert.summary}</p>
          <div className="flex items-center gap-4 mt-2.5 flex-wrap">
            <span className="flex items-center gap-1 text-[11px] text-slate-500">
              <MapPin size={11} /> {alert.location}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-500">
              <Clock size={11} /> {timeAgo(alert.created_at)}
            </span>
            {alert.source_count && (
              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                <Users size={11} /> {alert.source_count} sources
              </span>
            )}
          </div>
        </div>

        {/* Credibility + Arrow */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="text-right">
            <p className="text-lg font-bold" style={{ color: status.color }}>
              {formatCredibility(alert.credibility_score)}
            </p>
            <p className="text-[10px] text-slate-500">credibility</p>
          </div>
          <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
        </div>
      </div>
    </motion.div>
  );
}
