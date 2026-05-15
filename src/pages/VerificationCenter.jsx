/**
 * DisasterSense AI - Verification Center Page
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Brain, Loader2, CheckCircle2, XCircle, AlertCircle, Send } from 'lucide-react';
import CredibilityRing from '../components/verification/CredibilityRing';
import { analyzePost } from '../services/groq';
import { verifyIncident } from '../services/verification';
import { sendEmailAlert, sendTelegramAlert } from '../services/notifications';
import useStore from '../store/useStore';
import { getDisasterEmoji } from '../utils/helpers';

export default function VerificationCenter() {
  const { posts, addNotification, addAlert } = useStore();
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
      
      let verification = null;
      if (analysis.is_disaster) {
        verification = await verifyIncident(analysis);
        analysis.verification = verification;
      }
      
      setResult(analysis);
    } catch (err) {
      setError(err.message || 'Analysis failed. Check your Groq API key.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleBroadcast = async () => {
    if (!result || !result.is_disaster) return;
    const success = await sendEmailAlert(result);
    if (success) {
      addNotification({ title: 'Email Broadcast', message: 'Email broadcast sent successfully!', type: 'success' });
    } else {
      addNotification({ title: 'Email Broadcast Failed', message: 'Failed to send email. Check console or your EmailJS config in .env.', type: 'error' });
    }
  };

  const handleTelegramBroadcast = async () => {
    if (!result || !result.is_disaster) return;
    const success = await sendTelegramAlert(result);
    if (success) {
      addNotification({ title: 'Telegram Broadcast', message: 'Telegram broadcast sent successfully!', type: 'success' });
    } else {
      addNotification({ title: 'Telegram Broadcast Failed', message: 'Failed to send Telegram alert. Check your Bot Token in .env.', type: 'error' });
    }
  };

  const handleSaveAlert = () => {
    if (!result || !result.is_disaster) return;
    const newAlert = {
      id: `alert-${Date.now()}`,
      disaster_type: result.disaster_type,
      location: result.location,
      latitude: result.latitude || 20,
      longitude: result.longitude || 0,
      severity: result.severity,
      urgency: result.urgency,
      confidence: result.confidence,
      credibility_score: result.verification?.credibility_score || result.confidence,
      fake_probability: result.verification?.fake_probability || 0,
      verification_status: 'Verified',
      summary: result.summary,
      recommended_action: result.recommended_action,
      created_at: new Date().toISOString(),
      source_count: 1
    };
    addAlert(newAlert);
    addNotification({ title: 'Alert Saved', message: 'Alert added to the map successfully!', type: 'success' });
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
              <div className="flex flex-col md:flex-row items-center justify-around gap-6 py-4">
                <CredibilityRing score={result.confidence} label="AI Confidence" />
                {result.verification && (
                  <CredibilityRing 
                    score={result.verification.credibility_score} 
                    label="Verified Credibility" 
                    color={result.verification.credibility_score >= 0.8 ? '#22c55e' : result.verification.credibility_score >= 0.5 ? '#eab308' : '#ef4444'} 
                  />
                )}
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

              {/* Translation (Innovation #4) */}
              {result.original_language && result.original_language.toLowerCase() !== 'english' && (
                <div className="p-4 rounded-xl border border-blue-500/20" style={{ background: 'rgba(59,130,246,0.05)' }}>
                  <p className="text-[11px] text-blue-400 font-medium uppercase mb-1 flex items-center gap-1">
                    🌍 Translated from {result.original_language}
                  </p>
                  <p className="text-sm text-slate-300 italic">"{result.translated_text}"</p>
                </div>
              )}

              {/* Automated Logistics AI (Innovation #3) */}
              {result.logistics_needed && (
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase mb-3 flex items-center gap-2">
                    🚁 Automated Logistics AI
                  </h4>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="p-3 rounded-lg text-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
                      <p className="text-[10px] text-slate-400 mb-1">Ambulances</p>
                      <p className="text-lg font-bold text-red-400">{result.logistics_needed.ambulances_estimated || 0}</p>
                    </div>
                    <div className="p-3 rounded-lg text-center" style={{ background: 'rgba(59,130,246,0.1)' }}>
                      <p className="text-[10px] text-slate-400 mb-1">Shelters</p>
                      <p className="text-lg font-bold text-blue-400">{result.logistics_needed.shelters_estimated || 0}</p>
                    </div>
                    <div className="p-3 rounded-lg text-center" style={{ background: 'rgba(34,197,94,0.1)' }}>
                      <p className="text-[10px] text-slate-400 mb-1">Rescue Teams</p>
                      <p className="text-lg font-bold text-green-400">{result.logistics_needed.rescue_teams || 0}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cross-Verification & Fake News Results */}
              {result.verification && (
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase mb-3 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-green-400" /> Cross-Verification & Fake News Filter
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                    <div className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <p className="text-[10px] text-slate-500 mb-1">Weather API</p>
                      <p className={`text-sm font-bold ${result.verification.weather_verified ? 'text-green-400' : 'text-slate-400'}`}>
                        {result.verification.weather_verified ? 'Verified' : 'Unverified/N/A'}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <p className="text-[10px] text-slate-500 mb-1">News Coverage (GDELT)</p>
                      <p className={`text-sm font-bold ${result.verification.official_source_verified ? 'text-green-400' : 'text-slate-400'}`}>
                        {result.verification.official_source_verified ? 'Verified' : 'None Found'}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <p className="text-[10px] text-slate-500 mb-1">Fake Probability</p>
                      <p className={`text-sm font-bold ${result.verification.fake_probability > 0.5 ? 'text-red-400' : 'text-green-400'}`}>
                        {Math.round(result.verification.fake_probability * 100)}%
                      </p>
                    </div>
                  </div>
                  {result.verification.verification_notes.filter(Boolean).length > 0 && (
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <p className="text-[10px] text-slate-400 uppercase mb-2">Verification Notes</p>
                      <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                        {result.verification.verification_notes.filter(Boolean).map((note, idx) => (
                          <li key={idx}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Local NLP Metadata */}
          {result.nlp_metadata && (
            <div className="mt-4 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-semibold text-slate-400 uppercase mb-3">Local NLP Extraction</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <p className="text-[10px] text-slate-500 mb-1">Sentiment Score</p>
                  <p className={`text-sm font-bold ${result.nlp_metadata.sentiment.score < 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {result.nlp_metadata.sentiment.score} {result.nlp_metadata.sentiment.isNegative ? '(Negative)' : '(Positive/Neutral)'}
                  </p>
                </div>
                <div className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <p className="text-[10px] text-slate-500 mb-1">Extracted Entities (Places)</p>
                  <p className="text-sm text-slate-300">
                    {result.nlp_metadata.entities.places.length > 0 ? result.nlp_metadata.entities.places.join(', ') : 'None'}
                  </p>
                </div>
              </div>
              {result.nlp_metadata.keywords.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.nlp_metadata.keywords.map((kw, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-300">
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Broadcast Action */}
          {result.is_disaster && (
            <div className="mt-4 flex flex-wrap justify-end gap-3">
              <button 
                onClick={handleSaveAlert}
                className="btn-glow flex items-center gap-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition-all"
              >
                <AlertCircle size={14} /> Add to Map
              </button>
              <button 
                onClick={handleTelegramBroadcast}
                className="btn-glow flex items-center gap-2 text-sm bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-xl transition-all"
              >
                <Send size={14} /> Telegram Alert
              </button>
              <button 
                onClick={handleBroadcast}
                className="btn-glow flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all"
              >
                <Send size={14} /> Email Alert
              </button>
            </div>
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
