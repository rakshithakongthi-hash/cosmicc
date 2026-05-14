/**
 * DisasterSense AI - Application Constants
 */

export const DISASTER_TYPES = [
  { id: 'flood', label: 'Flood', icon: '🌊', color: '#3b82f6' },
  { id: 'earthquake', label: 'Earthquake', icon: '🌍', color: '#f97316' },
  { id: 'wildfire', label: 'Wildfire', icon: '🔥', color: '#ef4444' },
  { id: 'cyclone', label: 'Cyclone', icon: '🌀', color: '#8b5cf6' },
  { id: 'landslide', label: 'Landslide', icon: '⛰️', color: '#eab308' },
  { id: 'tsunami', label: 'Tsunami', icon: '🌊', color: '#06b6d4' },
  { id: 'tornado', label: 'Tornado', icon: '🌪️', color: '#a855f7' },
  { id: 'drought', label: 'Drought', icon: '☀️', color: '#d97706' },
];

export const SEVERITY_LEVELS = {
  critical: { label: 'Critical', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', order: 0 },
  high: { label: 'High', color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)', order: 1 },
  medium: { label: 'Medium', color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)', order: 2 },
  low: { label: 'Low', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)', order: 3 },
};

export const VERIFICATION_STATUS = {
  verified: { label: 'Verified', color: '#22c55e', icon: '✓' },
  pending: { label: 'Pending Review', color: '#eab308', icon: '⏳' },
  fake: { label: 'Likely Fake', color: '#ef4444', icon: '✗' },
  review: { label: 'Needs Review', color: '#f97316', icon: '⚠' },
};

export const CREDIBILITY_THRESHOLDS = {
  VERIFIED: 0.80,
  NEEDS_REVIEW: 0.50,
  LIKELY_FAKE: 0,
};

export const CREDIBILITY_WEIGHTS = {
  LLM_CONFIDENCE: 0.30,
  WEATHER_MATCH: 0.25,
  OFFICIAL_SOURCE: 0.20,
  MULTI_POST: 0.15,
  TEMPORAL: 0.10,
};

export const ALERT_RULES = {
  MIN_CONFIDENCE: 0.75,
  MIN_CREDIBILITY: 0.80,
  REQUIRED_SEVERITY: ['High', 'Critical'],
};

export const SOURCES = [
  { id: 'reddit', name: 'Reddit', icon: '🔴', type: 'social' },
  { id: 'twitter', name: 'Twitter/X', icon: '🐦', type: 'social' },
  { id: 'news', name: 'News Feed', icon: '📰', type: 'news' },
  { id: 'gdelt', name: 'GDELT', icon: '🌐', type: 'official' },
  { id: 'reliefweb', name: 'ReliefWeb', icon: '🏥', type: 'official' },
  { id: 'usgs', name: 'USGS', icon: '🔬', type: 'official' },
  { id: 'nasa', name: 'NASA FIRMS', icon: '🛰️', type: 'official' },
];

export const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: 'Home' },
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/alerts', label: 'Alerts', icon: 'AlertTriangle' },
  { path: '/verification', label: 'Verification', icon: 'ShieldCheck' },
  { path: '/map', label: 'Live Map', icon: 'Map' },
  { path: '/settings', label: 'Settings', icon: 'Settings' },
];
