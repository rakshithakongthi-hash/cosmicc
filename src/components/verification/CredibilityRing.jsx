/**
 * DisasterSense AI - Credibility Score Ring
 */
import { motion } from 'framer-motion';

export default function CredibilityRing({ score = 0, size = 120, strokeWidth = 8, label = 'Credibility' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - score * circumference;
  const percentage = Math.round(score * 100);

  const getColor = (s) => {
    if (s >= 0.8) return '#22c55e';
    if (s >= 0.5) return '#eab308';
    return '#ef4444';
  };
  const color = getColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth={strokeWidth} />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{percentage}%</span>
        </div>
      </div>
      <span className="text-xs text-slate-500 font-medium">{label}</span>
    </div>
  );
}
