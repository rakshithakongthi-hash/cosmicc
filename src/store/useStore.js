/**
 * DisasterSense AI - Zustand Store
 * Central state management with demo data for showcasing.
 */
import { create } from 'zustand';
import { subscribeToAlerts, fetchAlerts } from '../services/supabase.js';
import { notifyDisasterAlert } from '../services/notifications.js';

// ====================================================================
// Demo Data - Realistic disaster incidents for demonstration
// ====================================================================
const DEMO_ALERTS = [
  {
    id: 'alert-001', disaster_type: 'Flood', location: 'Chennai, Tamil Nadu, India',
    latitude: 13.0827, longitude: 80.2707, severity: 'Critical', urgency: 'Immediate',
    confidence: 0.96, credibility_score: 0.92, fake_probability: 0.08,
    verification_status: 'Verified', summary: 'Severe flooding reported in residential areas of Chennai due to unprecedented rainfall. Multiple neighborhoods submerged with water levels rising above 4 feet.',
    recommended_action: 'Deploy rescue teams immediately. Issue evacuation warnings for low-lying areas. Open emergency shelters.',
    source: 'Reddit + News', source_count: 12, affected_population: '~50,000',
    created_at: new Date(Date.now() - 1800000).toISOString(),
    verification_notes: ['Heavy rainfall confirmed by Open-Meteo (82mm)', 'Multiple independent reports from same area', 'ReliefWeb has related coverage'],
    weather_verified: true, official_source_verified: true, multi_source_verified: true,
  },
  {
    id: 'alert-002', disaster_type: 'Earthquake', location: 'Kathmandu, Nepal',
    latitude: 27.7172, longitude: 85.3240, severity: 'High', urgency: 'Immediate',
    confidence: 0.91, credibility_score: 0.88, fake_probability: 0.12,
    verification_status: 'Verified', summary: 'Magnitude 5.8 earthquake struck near Kathmandu. Buildings damaged in old city area. Aftershocks reported.',
    recommended_action: 'Activate search and rescue protocols. Assess structural damage. Prepare medical response teams.',
    source: 'USGS + Reddit', source_count: 8, affected_population: '~200,000',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    verification_notes: ['USGS confirmed M5.8 earthquake', 'Multiple social media reports', 'News coverage from 3 sources'],
    weather_verified: false, official_source_verified: true, multi_source_verified: true,
  },
  {
    id: 'alert-003', disaster_type: 'Wildfire', location: 'Los Angeles, California, USA',
    latitude: 34.0522, longitude: -118.2437, severity: 'Critical', urgency: 'Immediate',
    confidence: 0.94, credibility_score: 0.91, fake_probability: 0.09,
    verification_status: 'Verified', summary: 'Fast-moving wildfire spreading through northern LA neighborhoods. Mandatory evacuations issued. Over 5,000 acres burned.',
    recommended_action: 'Enforce mandatory evacuation zones. Deploy aerial firefighting resources. Set up evacuation centers.',
    source: 'NASA FIRMS + News', source_count: 15, affected_population: '~30,000',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    verification_notes: ['NASA FIRMS detected 23 active fire hotspots', 'GDELT reports extensive coverage', 'ReliefWeb situation report published'],
    weather_verified: true, official_source_verified: true, multi_source_verified: true,
  },
  {
    id: 'alert-004', disaster_type: 'Cyclone', location: 'Odisha Coast, India',
    latitude: 19.8135, longitude: 85.8312, severity: 'High', urgency: 'High',
    confidence: 0.89, credibility_score: 0.85, fake_probability: 0.15,
    verification_status: 'Verified', summary: 'Cyclonic storm approaching Odisha coast with wind speeds of 130 km/h. Landfall expected within 12 hours.',
    recommended_action: 'Evacuate coastal villages. Secure fishing boats. Alert disaster response teams.',
    source: 'IMD + Reddit', source_count: 6, affected_population: '~1,000,000',
    created_at: new Date(Date.now() - 5400000).toISOString(),
    verification_notes: ['High wind speeds confirmed by Open-Meteo', 'Official weather warnings issued', 'Multiple news sources reporting'],
    weather_verified: true, official_source_verified: true, multi_source_verified: false,
  },
  {
    id: 'alert-005', disaster_type: 'Landslide', location: 'Shimla, Himachal Pradesh, India',
    latitude: 31.1048, longitude: 77.1734, severity: 'Medium', urgency: 'Moderate',
    confidence: 0.78, credibility_score: 0.65, fake_probability: 0.35,
    verification_status: 'Needs Review', summary: 'Reports of landslide blocking highway near Shimla. Some vehicles reportedly trapped.',
    recommended_action: 'Send assessment teams. Clear alternative routes. Prepare rescue equipment.',
    source: 'Reddit', source_count: 3, affected_population: '~500',
    created_at: new Date(Date.now() - 10800000).toISOString(),
    verification_notes: ['Heavy rainfall in region confirmed', 'Limited official confirmation', 'Only social media reports'],
    weather_verified: true, official_source_verified: false, multi_source_verified: false,
  },
  {
    id: 'alert-006', disaster_type: 'Flood', location: 'Bangkok, Thailand',
    latitude: 13.7563, longitude: 100.5018, severity: 'Medium', urgency: 'Moderate',
    confidence: 0.72, credibility_score: 0.58, fake_probability: 0.42,
    verification_status: 'Needs Review', summary: 'Flash flooding reported in downtown Bangkok after heavy monsoon rains. Some roads impassable.',
    recommended_action: 'Monitor water levels. Prepare pumping stations. Issue travel advisories.',
    source: 'Twitter + Reddit', source_count: 4, affected_population: '~10,000',
    created_at: new Date(Date.now() - 14400000).toISOString(),
    verification_notes: ['Moderate rainfall detected', 'Some social media confirmation', 'No official alerts yet'],
    weather_verified: true, official_source_verified: false, multi_source_verified: false,
  },
];

const DEMO_POSTS = [
  { id: 'post-001', text: 'BREAKING: Massive flooding in Chennai! Water entering houses. People stranded on rooftops. Please send help! #ChennaiFloods', source: 'Reddit', author: 'u/chennai_reporter', timestamp: new Date(Date.now() - 2000000).toISOString(), is_disaster: true, analyzed: true },
  { id: 'post-002', text: 'Just felt a strong earthquake in Kathmandu. Buildings shaking. Everyone rushing outside. Stay safe everyone!', source: 'Reddit', author: 'u/nepal_news', timestamp: new Date(Date.now() - 3800000).toISOString(), is_disaster: true, analyzed: true },
  { id: 'post-003', text: 'The sky is orange in LA. Wildfire smoke everywhere. Evacuation orders for our neighborhood. Packing now.', source: 'Twitter', author: '@la_resident', timestamp: new Date(Date.now() - 7500000).toISOString(), is_disaster: true, analyzed: true },
  { id: 'post-004', text: 'Beautiful sunset at the beach today! The colors were amazing 🌅', source: 'Reddit', author: 'u/beachlover', timestamp: new Date(Date.now() - 9000000).toISOString(), is_disaster: false, analyzed: true },
  { id: 'post-005', text: 'Cyclone warning for Odisha coast! Please evacuate immediately if you are near the shore. Wind speeds increasing rapidly.', source: 'Reddit', author: 'u/odisha_updates', timestamp: new Date(Date.now() - 5600000).toISOString(), is_disaster: true, analyzed: true },
  { id: 'post-006', text: 'Road blocked by landslide near Shimla. Stuck in traffic for 3 hours now. Anyone know alternative routes?', source: 'Reddit', author: 'u/traveler_hp', timestamp: new Date(Date.now() - 11000000).toISOString(), is_disaster: true, analyzed: true },
  { id: 'post-007', text: 'Flash floods in Bangkok streets! Vehicles submerged. Be careful if traveling downtown.', source: 'Twitter', author: '@bkk_alerts', timestamp: new Date(Date.now() - 14600000).toISOString(), is_disaster: true, analyzed: true },
  { id: 'post-008', text: 'FAKE NEWS: There is NO tsunami heading to Mumbai. Please stop spreading rumors! Official sources confirm no threat.', source: 'Reddit', author: 'u/factchecker', timestamp: new Date(Date.now() - 16000000).toISOString(), is_disaster: false, analyzed: true },
];

const calculateStats = (alerts, posts) => {
  const total = alerts.length;
  const verified = alerts.filter(a => a.verification_status === 'Verified').length;
  const pending = alerts.filter(a => a.verification_status === 'Needs Review' || a.verification_status === 'Pending').length;
  const fake = alerts.filter(a => a.verification_status === 'Fake').length;
  
  const avgCredibility = total > 0 
    ? alerts.reduce((acc, a) => acc + (a.credibility_score || 0), 0) / total 
    : 0;

  return {
    total_alerts: total,
    verified_alerts: verified,
    pending_review: pending,
    fake_detected: fake,
    posts_analyzed: posts.length,
    active_monitors: 6,
    avg_credibility: avgCredibility,
    response_time_avg: '4.2 min',
  };
};

const DEMO_STATS = calculateStats(DEMO_ALERTS, DEMO_POSTS);

const DEMO_TRENDS = [
  { date: 'May 08', floods: 3, earthquakes: 1, wildfires: 2, cyclones: 0, landslides: 1 },
  { date: 'May 09', floods: 5, earthquakes: 0, wildfires: 3, cyclones: 1, landslides: 0 },
  { date: 'May 10', floods: 4, earthquakes: 2, wildfires: 1, cyclones: 0, landslides: 2 },
  { date: 'May 11', floods: 7, earthquakes: 1, wildfires: 4, cyclones: 1, landslides: 1 },
  { date: 'May 12', floods: 6, earthquakes: 0, wildfires: 2, cyclones: 2, landslides: 0 },
  { date: 'May 13', floods: 8, earthquakes: 3, wildfires: 5, cyclones: 1, landslides: 3 },
  { date: 'May 14', floods: 10, earthquakes: 2, wildfires: 3, cyclones: 1, landslides: 1 },
];

// ====================================================================
// Zustand Store
// ====================================================================
const useStore = create((set, get) => ({
  // State
  alerts: DEMO_ALERTS,
  posts: DEMO_POSTS,
  stats: DEMO_STATS,
  trends: DEMO_TRENDS,
  selectedAlert: null,
  filters: { severity: 'all', status: 'all', type: 'all', search: '' },
  isLoading: false,
  isDemoMode: true,
  sidebarOpen: true,
  notifications: [],
  darkMode: true,

  // Actions
  setAlerts: (alerts) => set((s) => ({ alerts, stats: calculateStats(alerts, s.posts) })),
  addAlert: (alert) => set((s) => {
    const updatedAlerts = [alert, ...s.alerts];
    return { alerts: updatedAlerts, stats: calculateStats(updatedAlerts, s.posts) };
  }),
  setSelectedAlert: (alert) => set({ selectedAlert: alert }),
  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),
  setLoading: (isLoading) => set({ isLoading }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleDemoMode: () => set((s) => ({ isDemoMode: !s.isDemoMode })),

  addNotification: (notification) => set((s) => ({
    notifications: [{ id: Date.now(), timestamp: new Date().toISOString(), ...notification }, ...s.notifications].slice(0, 50),
  })),
  clearNotifications: () => set({ notifications: [] }),

  // Live Monitoring with Real Open-Source APIs and Supabase
  liveMonitorInterval: null,
  supabaseChannel: null,
  seenPostIds: new Set(),
  startLiveMonitoring: () => {
    if (get().liveMonitorInterval || get().supabaseChannel) return;
    
    // Fetch initial alerts from Supabase
    const loadAlerts = async () => {
      set({ isLoading: true });
      const { data, error } = await fetchAlerts();
      if (!error && data && data.length > 0) {
        set({ alerts: data, stats: calculateStats(data, get().posts) });
      }
      set({ isLoading: false });
    };
    loadAlerts();
    
    // 1. Supabase Real-Time Subscription
    try {
      const channel = subscribeToAlerts((payload) => {
        console.log('Real-time alert change:', payload);
        const { eventType, new: newAlert, old: oldAlert } = payload;
        
        set((s) => {
          let updatedAlerts = [...s.alerts];
          
          if (eventType === 'INSERT') {
            if (!updatedAlerts.some(a => a.id === newAlert.id)) {
              updatedAlerts = [newAlert, ...updatedAlerts];
              
              // Trigger EmailJS and Browser Notifications
              try {
                notifyDisasterAlert(newAlert);
              } catch (e) {
                console.error('Notification error:', e);
              }
              
              get().addNotification({
                title: 'New Alert Received',
                message: `${newAlert.disaster_type} at ${newAlert.location}`,
                type: 'info'
              });
            }
          } else if (eventType === 'UPDATE') {
            updatedAlerts = updatedAlerts.map(a => a.id === newAlert.id ? newAlert : a);
          } else if (eventType === 'DELETE') {
            updatedAlerts = updatedAlerts.filter(a => a.id !== oldAlert.id);
          }
          
          return { alerts: updatedAlerts, stats: calculateStats(updatedAlerts, s.posts) };
        });
      });
      
      set({ supabaseChannel: channel });
    } catch (err) {
      console.error('Supabase subscription error:', err);
    }

    // 2. Open-Source API Polling (USGS)
    const fetchRealData = async () => {
      try {
        const newPosts = [];
        const seen = get().seenPostIds;

        // Fetch USGS Earthquakes (Past Hour)
        const usgsRes = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson');
        if (usgsRes.ok) {
          const usgsData = await usgsRes.json();
          usgsData.features.forEach(quake => {
            if (!seen.has(quake.id)) {
              seen.add(quake.id);
              newPosts.push({
                id: quake.id,
                text: `URGENT: Magnitude ${quake.properties.mag} earthquake detected at ${quake.properties.place}.`,
                source: 'USGS Live',
                author: 'System Sensor',
                timestamp: new Date(quake.properties.time).toISOString(),
                is_disaster: true,
                analyzed: true
              });
            }
          });
        }

        if (newPosts.length > 0) {
          set((s) => {
            const updatedPosts = [...newPosts, ...s.posts].slice(0, 100);
            return {
              posts: updatedPosts,
              stats: calculateStats(s.alerts, updatedPosts),
              seenPostIds: seen
            };
          });

          const latest = newPosts[0];
          get().addNotification({ 
            title: 'Real-Time Incident Detected', 
            message: latest.text.substring(0, 60) + '...', 
            type: 'warning' 
          });
        }
      } catch (err) {
        console.error('Live feed error:', err);
      }
    };

    fetchRealData();
    const interval = setInterval(fetchRealData, 30000);
    set({ liveMonitorInterval: interval });
  },
  stopLiveMonitoring: () => {
    const interval = get().liveMonitorInterval;
    if (interval) clearInterval(interval);
    
    const channel = get().supabaseChannel;
    if (channel) channel.unsubscribe();
    
    set({ liveMonitorInterval: null, supabaseChannel: null });
  },

  // Computed / Filtered alerts
  getFilteredAlerts: () => {
    const { alerts, filters } = get();
    return alerts.filter((a) => {
      if (filters.severity !== 'all' && a.severity?.toLowerCase() !== filters.severity) return false;
      if (filters.status !== 'all' && a.verification_status !== filters.status) return false;
      if (filters.type !== 'all' && a.disaster_type?.toLowerCase() !== filters.type) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return a.location?.toLowerCase().includes(q) || a.summary?.toLowerCase().includes(q) || a.disaster_type?.toLowerCase().includes(q);
      }
      return true;
    });
  },
}));

export default useStore;
