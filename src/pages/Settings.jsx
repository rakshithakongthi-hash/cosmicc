/**
 * DisasterSense AI - Settings Page
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Monitor, Shield, Database, Zap, Save, CheckCircle2 } from 'lucide-react';
import useStore from '../store/useStore';
import { requestNotificationPermission } from '../services/notifications';
import { toast } from 'sonner';

export default function Settings() {
  const { isDemoMode, toggleDemoMode } = useStore();
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true, emailAlerts: false, soundAlerts: true,
    autoRefresh: true, refreshInterval: 30,
    minSeverity: 'medium', minCredibility: 0.5,
    monitorReddit: true, monitorNews: true, monitorTwitter: false,
  });

  const handleSave = () => {
    setSaved(true);
    toast.success('Settings saved successfully');
    setTimeout(() => setSaved(false), 2000);
  };

  const handleEnableNotifs = async () => {
    const perm = await requestNotificationPermission();
    if (perm === 'granted') toast.success('Browser notifications enabled!');
    else toast.error('Notification permission denied');
  };

  const Toggle = ({ checked, onChange }) => (
    <button onClick={() => onChange(!checked)}
      className="relative w-10 h-5 rounded-full transition-colors duration-200"
      style={{ background: checked ? 'rgba(59,130,246,0.6)' : 'rgba(148,163,184,0.2)' }}>
      <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
        style={{ transform: checked ? 'translateX(22px)' : 'translateX(2px)' }} />
    </button>
  );

  const Section = ({ icon: Icon, title, desc, color, children }) => (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="text-[11px] text-slate-500">{desc}</p>
        </div>
      </div>
      <div className="space-y-4 pl-12">{children}</div>
    </motion.div>
  );

  const Row = ({ label, desc, children }) => (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-300">{label}</p>
        {desc && <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Configure your DisasterSense AI platform</p>
        </div>
        <button onClick={handleSave} className="btn-glow flex items-center gap-2 text-sm">
          {saved ? <><CheckCircle2 size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
        </button>
      </div>

      <Section icon={Bell} title="Notifications" desc="Alert delivery preferences" color="#3b82f6">
        <Row label="Browser Push Notifications" desc="Receive browser alerts for verified incidents">
          <div className="flex items-center gap-3">
            <Toggle checked={settings.notifications} onChange={(v) => setSettings(s => ({...s, notifications: v}))} />
            <button onClick={handleEnableNotifs} className="text-[11px] text-blue-400 hover:text-blue-300">Enable</button>
          </div>
        </Row>
        <Row label="Sound Alerts" desc="Play alert sound for critical incidents">
          <Toggle checked={settings.soundAlerts} onChange={(v) => setSettings(s => ({...s, soundAlerts: v}))} />
        </Row>
        <Row label="Email Notifications" desc="Send email for high/critical alerts">
          <Toggle checked={settings.emailAlerts} onChange={(v) => setSettings(s => ({...s, emailAlerts: v}))} />
        </Row>
      </Section>

      <Section icon={Monitor} title="Monitoring" desc="Data source configuration" color="#8b5cf6">
        <Row label="Reddit" desc="Monitor disaster-related subreddits">
          <Toggle checked={settings.monitorReddit} onChange={(v) => setSettings(s => ({...s, monitorReddit: v}))} />
        </Row>
        <Row label="News Feeds" desc="RSS and GDELT news monitoring">
          <Toggle checked={settings.monitorNews} onChange={(v) => setSettings(s => ({...s, monitorNews: v}))} />
        </Row>
        <Row label="Twitter/X" desc="Social media post monitoring">
          <Toggle checked={settings.monitorTwitter} onChange={(v) => setSettings(s => ({...s, monitorTwitter: v}))} />
        </Row>
        <Row label="Auto-Refresh Interval" desc="Seconds between data refreshes">
          <select value={settings.refreshInterval} onChange={(e) => setSettings(s => ({...s, refreshInterval: +e.target.value}))}
            className="px-3 py-1.5 rounded-lg text-xs text-white outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(148,163,184,0.1)' }}>
            <option value={15}>15s</option><option value={30}>30s</option><option value={60}>60s</option><option value={120}>120s</option>
          </select>
        </Row>
      </Section>

      <Section icon={Shield} title="Verification" desc="Credibility thresholds" color="#22c55e">
        <Row label="Minimum Severity" desc="Only alert for this severity and above">
          <select value={settings.minSeverity} onChange={(e) => setSettings(s => ({...s, minSeverity: e.target.value}))}
            className="px-3 py-1.5 rounded-lg text-xs text-white outline-none capitalize"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(148,163,184,0.1)' }}>
            <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
          </select>
        </Row>
        <Row label="Minimum Credibility Score" desc="Threshold for generating alerts">
          <span className="text-sm font-bold text-white">{Math.round(settings.minCredibility * 100)}%</span>
        </Row>
      </Section>

      <Section icon={Database} title="System" desc="Platform configuration" color="#f97316">
        <Row label="Demo Mode" desc="Use simulated data for demonstration">
          <Toggle checked={isDemoMode} onChange={toggleDemoMode} />
        </Row>
        <Row label="API Status">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-green-400 font-medium">Connected</span>
          </div>
        </Row>
      </Section>
    </div>
  );
}
