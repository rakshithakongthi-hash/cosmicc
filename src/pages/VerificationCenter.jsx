/**
 * DisasterSense AI - Verification Center Page
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Brain, Loader2, CheckCircle2, XCircle, AlertCircle, Send } from 'lucide-react';
import CredibilityRing from '../components/verification/CredibilityRing';
import { analyzePost } from '../services/groq';
import useStore from '../store/useStore';
import { getDisasterEmoji } from '../utils/helpers';

export default function VerificationCenter() {
  const { posts } = useStore();
  const [inputText, setInputText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setAnalyzing(true);
    setError(null);
    setResult(null);
    try {
      const analysis = await analyzePost(inputText, { source: 'Manual Input', timestamp: new Date().toISOString() });
      setResult(analysis);
    } catch (err) {
      setError(err.message || 'Analysis failed. Check your Groq API key.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Verification Center</h1>
        <p className="text-sm text-slate-500 mt-1">Analyze and verify disaster reports using AI</p>
      </div>

      {/* Manual Analysis Input */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Brain size={18} className="text-purple-400" />
          <h2 className="text-sm font-semibold text-white">AI Post Analyzer</h2>
        </div>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste a social media post or disaster report here for AI analysis..."
          rows={4}
          className="w-full p-4 rounded-xl text-sm text-white placeholder-slate-500 outline-none resize-none"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(148,163,184,0.1)' }}
        />
        <div className="flex items-center justify-between mt-3">
          <p className="text-[11px] text-slate-500">Powered by Llama 3.3 70B via Groq</p>
          <button onClick={handleAnalyze} disabled={analyzing || !inputText.trim()}
            className="btn-glow flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            {analyzing ? <><Loader2 size={14} className="animate-spin" /> Analyzing...</> : <><Send size={14} /> Analyze</>}
          </button>
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl flex items-center gap-3"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <XCircle size={18} className="text-red-400" />
          <p className="text-sm text-red-300">{error}</p>
        </motion.div>
      )}

      {/* Analysis Result */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{result.is_disaster ? getDisasterEmoji(result.disaster_type) : '✅'}</span>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {result.is_disaster ? result.disaster_type : 'Not a Disaster'}
                </h3>
                <p className="text-xs text-slate-400">{result.location}</p>
              </div>
            </div>
            <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${result.is_disaster ? 'text-red-400' : 'text-green-400'}`}
              style={{ background: result.is_disaster ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)' }}>
              {result.is_disaster ? '⚠ Disaster Detected' : '✓ Safe Content'}
            </div>
          </div>

          {result.is_disaster && (
            <>
              <div className="flex items-center justify-center">
                <CredibilityRing score={result.confidence} label="AI Confidence" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Severity', value: result.severity, color: result.severity === 'Critical' ? '#ef4444' : result.severity === 'High' ? '#f97316' : '#eab308' },
                  { label: 'Urgency', value: result.urgency, color: '#3b82f6' },
                  { label: 'Confidence', value: `${Math.round(result.confidence * 100)}%`, color: '#8b5cf6' },
                  { label: 'Type', value: result.disaster_type, color: '#06b6d4' },
                ].map((m, i) => (
                  <div key={i} className="p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-[10px] text-slate-500 mb-1">{m.label}</p>
                    <p className="text-sm font-bold" style={{ color: m.color }}>{m.value}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-[11px] text-slate-500 font-medium uppercase mb-1">Summary</p>
                <p className="text-sm text-slate-300">{result.summary}</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-[11px] text-slate-500 font-medium uppercase mb-1">Recommended Action</p>
                <p className="text-sm text-slate-300">{result.recommended_action}</p>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Recent Posts Feed */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Recent Post Feed</h2>
        <div className="space-y-3">
          {posts.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card p-4 cursor-pointer" onClick={() => setInputText(post.text)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: post.source === 'Reddit' ? 'rgba(255,69,0,0.15)' : 'rgba(29,161,242,0.15)', color: post.source === 'Reddit' ? '#ff4500' : '#1da1f2' }}>
                      {post.source}
                    </span>
                    <span className="text-[11px] text-slate-500">{post.author}</span>
                  </div>
                  <p className="text-sm text-slate-300">{post.text}</p>
                </div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${post.is_disaster ? 'text-red-400' : 'text-green-400'}`}
                  style={{ background: post.is_disaster ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)' }}>
                  {post.is_disaster ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
