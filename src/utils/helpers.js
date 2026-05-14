/**
 * DisasterSense AI - Helper Utilities
 */
import { formatDistanceToNow, format } from 'date-fns';
import { CREDIBILITY_THRESHOLDS, SEVERITY_LEVELS } from './constants';

/** Format a date to relative time (e.g., "5 minutes ago") */
export function timeAgo(date) {
  if (!date) return 'Unknown';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/** Format a date to readable string */
export function formatDate(date, fmt = 'MMM dd, yyyy HH:mm') {
  if (!date) return 'Unknown';
  return format(new Date(date), fmt);
}

/** Get verification status from credibility score */
export function getVerificationStatus(score) {
  if (score >= CREDIBILITY_THRESHOLDS.VERIFIED) return 'verified';
  if (score >= CREDIBILITY_THRESHOLDS.NEEDS_REVIEW) return 'review';
  return 'fake';
}

/** Get severity badge CSS class */
export function getSeverityClass(severity) {
  const s = severity?.toLowerCase();
  if (s === 'critical') return 'badge-critical';
  if (s === 'high') return 'badge-high';
  if (s === 'medium') return 'badge-medium';
  return 'badge-low';
}

/** Get severity color */
export function getSeverityColor(severity) {
  return SEVERITY_LEVELS[severity?.toLowerCase()]?.color || '#94a3b8';
}

/** Format credibility score as percentage */
export function formatCredibility(score) {
  return `${Math.round((score || 0) * 100)}%`;
}

/** Generate a unique ID */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/** Truncate text */
export function truncate(text, maxLen = 100) {
  if (!text) return '';
  return text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
}

/** Debounce function */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Get disaster emoji */
export function getDisasterEmoji(type) {
  const map = {
    flood: '🌊', earthquake: '🌍', wildfire: '🔥', fire: '🔥',
    cyclone: '🌀', hurricane: '🌀', landslide: '⛰️',
    tsunami: '🌊', tornado: '🌪️', drought: '☀️', storm: '⛈️',
  };
  return map[type?.toLowerCase()] || '⚠️';
}

/** Format large numbers */
export function formatNumber(num) {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num?.toString() || '0';
}
