/**
 * DisasterSense AI - Geocoding Service
 * Uses OpenStreetMap Nominatim for geocoding.
 */
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';

export async function geocode(locationString) {
  if (!locationString || locationString === 'Unknown') return null;
  try {
    const params = new URLSearchParams({ q: locationString, format: 'json', limit: '1', addressdetails: '1' });
    const res = await fetch(`${NOMINATIM_URL}/search?${params}`, {
      headers: { 'User-Agent': 'DisasterSenseAI/1.0' },
    });
    if (!res.ok) throw new Error(`Nominatim error: ${res.status}`);
    const results = await res.json();
    if (!results.length) return null;
    const r = results[0];
    return {
      latitude: parseFloat(r.lat), longitude: parseFloat(r.lon),
      display_name: r.display_name,
      country: r.address?.country, state: r.address?.state,
      city: r.address?.city || r.address?.town || r.address?.village,
    };
  } catch (e) { console.error('Geocoding error:', e); return null; }
}

export async function reverseGeocode(lat, lon) {
  try {
    const params = new URLSearchParams({ lat: lat.toString(), lon: lon.toString(), format: 'json', addressdetails: '1' });
    const res = await fetch(`${NOMINATIM_URL}/reverse?${params}`, {
      headers: { 'User-Agent': 'DisasterSenseAI/1.0' },
    });
    if (!res.ok) return null;
    const r = await res.json();
    return { display_name: r.display_name, country: r.address?.country, state: r.address?.state, city: r.address?.city || r.address?.town };
  } catch (e) { console.error('Reverse geocoding error:', e); return null; }
}

export default { geocode, reverseGeocode };
