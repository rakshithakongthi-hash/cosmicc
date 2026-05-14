/**
 * DisasterSense AI - Stat Card Component
 */
import { motion } from 'framer-motion';

export default function StatCard({ title, value, subtitle, icon: Icon, color, trend, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-5 relative overflow-hidden group"
    >
      {/* Glow accent */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-3xl transition-opacity group-hover:opacity-20"
        style={{ background: color }} />
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-xs font-medium ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
              <span className="text-[10px] text-slate-500">vs last hour</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
            <Icon size={20} style={{ color }} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
