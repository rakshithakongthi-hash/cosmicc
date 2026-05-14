/**
 * DisasterSense AI - Live Disaster Map
 */
import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import useStore from '../../store/useStore';
import { getSeverityColor, getDisasterEmoji, timeAgo } from '../../utils/helpers';
import 'leaflet/dist/leaflet.css';

function FitBounds({ alerts }) {
  const map = useMap();
  useEffect(() => {
    if (alerts.length === 0) return;
    const bounds = alerts.filter(a => a.latitude && a.longitude).map(a => [a.latitude, a.longitude]);
    if (bounds.length > 0) map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
  }, [alerts, map]);
  return null;
}

export default function DisasterMap({ height = '500px', alerts: propAlerts }) {
  const storeAlerts = useStore((s) => s.alerts);
  const alerts = propAlerts || storeAlerts;
  const validAlerts = alerts.filter(a => a.latitude && a.longitude);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card overflow-hidden"
      style={{ height }}
    >
      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', borderRadius: '16px' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        <FitBounds alerts={validAlerts} />
        {validAlerts.map((alert) => {
          const color = getSeverityColor(alert.severity);
          const radius = alert.severity === 'Critical' ? 14 : alert.severity === 'High' ? 11 : 8;
          return (
            <CircleMarker
              key={alert.id}
              center={[alert.latitude, alert.longitude]}
              radius={radius}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.3,
                weight: 2,
                opacity: 0.8,
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{getDisasterEmoji(alert.disaster_type)}</span>
                    <span className="font-bold text-sm" style={{ color: '#f1f5f9' }}>{alert.disaster_type}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase" style={{ background: `${color}25`, color }}>{alert.severity}</span>
                  </div>
                  <p className="text-xs mb-1" style={{ color: '#94a3b8' }}>{alert.location}</p>
                  <p className="text-[11px] mb-2" style={{ color: '#64748b' }}>{alert.summary?.slice(0, 120)}...</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px]" style={{ color: '#64748b' }}>{timeAgo(alert.created_at)}</span>
                    <span className="text-[10px] font-bold" style={{ color: alert.credibility_score >= 0.8 ? '#22c55e' : '#eab308' }}>
                      {Math.round(alert.credibility_score * 100)}% credible
                    </span>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </motion.div>
  );
}
