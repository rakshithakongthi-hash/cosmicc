/**
 * DisasterSense AI - Home / Landing Page
 */
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, Shield, MapPin, Activity, ArrowRight, Globe,
  Radio, Brain, BarChart3, AlertTriangle, CheckCircle2, Eye,
} from 'lucide-react';

const features = [
  { icon: Brain, title: 'AI Detection', desc: 'Llama 3.3 70B analyzes social media posts for real disaster signals', color: '#8b5cf6' },
  { icon: Shield, title: 'Cross-Verification', desc: 'Validates against USGS, NASA FIRMS, Open-Meteo, and GDELT', color: '#3b82f6' },
  { icon: Eye, title: 'Fake News Filter', desc: 'Credibility scoring to eliminate misinformation and false reports', color: '#ef4444' },
  { icon: MapPin, title: 'Geospatial Intel', desc: 'Real-time interactive map with heat zones and severity markers', color: '#22c55e' },
  { icon: Radio, title: 'Live Monitoring', desc: 'Continuous ingestion from Reddit, news feeds, and social platforms', color: '#f97316' },
  { icon: BarChart3, title: 'Analytics', desc: 'Trend analysis, severity breakdown, and response time metrics', color: '#06b6d4' },
];

const stats = [
  { value: '1,284', label: 'Posts Analyzed' },
  { value: '47', label: 'Alerts Generated' },
  { value: '94%', label: 'Avg Credibility' },
  { value: '<5min', label: 'Response Time' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative text-center pt-12">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }} />
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
              <Zap size={24} className="text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            <span className="gradient-text">DisasterSense</span>{' '}
            <span className="text-white">AI</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Real-time social media disaster detection, cross-verification, and emergency alert platform powered by AI
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={() => navigate('/dashboard')}
              className="btn-glow flex items-center gap-2 text-sm">
              Open Dashboard <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/map')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(148,163,184,0.15)' }}>
              <Globe size={16} /> Live Map
            </button>
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-card p-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl md:text-3xl font-bold gradient-text">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Features Grid */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white">Intelligent Disaster Response</h2>
          <p className="text-sm text-slate-500 mt-2">End-to-end pipeline from detection to verified emergency alerts</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * i }}
              className="glass-card p-5 group"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                <f.icon size={20} style={{ color: f.color }} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pipeline Visualization */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="glass-card p-8"
      >
        <h2 className="text-xl font-bold text-white text-center mb-8">Detection Pipeline</h2>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {[
            { icon: Radio, label: 'Ingest', desc: 'Social media monitoring', color: '#3b82f6' },
            { icon: Brain, label: 'Analyze', desc: 'LLM classification', color: '#8b5cf6' },
            { icon: CheckCircle2, label: 'Verify', desc: 'Cross-API verification', color: '#22c55e' },
            { icon: BarChart3, label: 'Score', desc: 'Credibility scoring', color: '#f97316' },
            { icon: AlertTriangle, label: 'Alert', desc: 'Emergency dispatch', color: '#ef4444' },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-2 min-w-[100px]">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: `${step.color}15`, border: `1px solid ${step.color}25` }}>
                  <step.icon size={24} style={{ color: step.color }} />
                </div>
                <p className="text-xs font-semibold text-white">{step.label}</p>
                <p className="text-[10px] text-slate-500 text-center">{step.desc}</p>
              </div>
              {i < 4 && <ArrowRight size={16} className="text-slate-600 hidden md:block" />}
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
