/**
 * DisasterSense AI - Supabase Client
 * Handles database operations, authentication, and real-time subscriptions.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================
// Authentication Helpers
// ============================================================

export async function signUp(email, password, metadata = {}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  });
  return { data, error };
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return { session: data?.session, error };
}

// ============================================================
// Database Operations
// ============================================================

/** Fetch alerts with optional filters */
export async function fetchAlerts({ severity, status, limit = 50 } = {}) {
  let query = supabase
    .from('alerts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (severity) query = query.eq('severity', severity);
  if (status) query = query.eq('verification_status', status);

  const { data, error } = await query;
  return { data, error };
}

/** Fetch analyzed posts */
export async function fetchAnalyzedPosts({ limit = 100 } = {}) {
  const { data, error } = await supabase
    .from('analyzed_posts')
    .select('*')
    .order('analyzed_at', { ascending: false })
    .limit(limit);
  return { data, error };
}

/** Insert a new alert */
export async function createAlert(alert) {
  const { data, error } = await supabase
    .from('alerts')
    .insert(alert)
    .select()
    .single();
  return { data, error };
}

/** Update alert status */
export async function updateAlertStatus(id, status) {
  const { data, error } = await supabase
    .from('alerts')
    .update({ verification_status: status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

/** Fetch verification results */
export async function fetchVerificationResults(alertId) {
  const { data, error } = await supabase
    .from('verification_results')
    .select('*')
    .eq('alert_id', alertId);
  return { data, error };
}

/** Subscribe to real-time alert changes */
export function subscribeToAlerts(callback) {
  return supabase
    .channel('alerts-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, callback)
    .subscribe();
}

/** Fetch active agencies for broadcast */
export async function fetchActiveAgencies() {
  const { data, error } = await supabase
    .from('agencies')
    .select('email, region, contact_number')
    .eq('is_active', true);
  return { data, error };
}

export default supabase;
