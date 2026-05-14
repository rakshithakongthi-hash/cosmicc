/**
 * DisasterSense AI - Weather Verification Service
 * Uses Open-Meteo API for weather data verification.
 */

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1';

/**
 * Get current weather data for a location.
 */
export async function getCurrentWeather(latitude, longitude) {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: 'temperature_2m,relative_humidity_2m,precipitation,rain,wind_speed_10m,wind_gusts_10m,weather_code',
      hourly: 'precipitation,rain,wind_speed_10m',
      forecast_days: '1',
      timezone: 'auto',
    });

    const response = await fetch(`${OPEN_METEO_URL}/forecast?${params}`);
    if (!response.ok) throw new Error(`Open-Meteo error: ${response.status}`);
    
    return await response.json();
  } catch (error) {
    console.error('Weather fetch error:', error);
    return null;
  }
}

/**
 * Verify flood conditions based on weather data.
 */
export async function verifyFloodConditions(latitude, longitude) {
  const weather = await getCurrentWeather(latitude, longitude);
  if (!weather?.current) return { verified: false, reason: 'No weather data available' };

  const { precipitation, rain, wind_speed_10m } = weather.current;
  const heavyRain = (precipitation > 10 || rain > 10);
  const recentRain = weather.hourly?.precipitation?.some(p => p > 5) || false;

  return {
    verified: heavyRain || recentRain,
    precipitation: precipitation,
    rain: rain,
    wind_speed: wind_speed_10m,
    heavy_rain_detected: heavyRain,
    recent_heavy_rain: recentRain,
    reason: heavyRain
      ? `Heavy precipitation detected: ${precipitation}mm`
      : recentRain
        ? 'Recent heavy rainfall detected in hourly data'
        : 'No significant precipitation detected',
    data: weather.current,
  };
}

/**
 * Verify storm/cyclone conditions.
 */
export async function verifyStormConditions(latitude, longitude) {
  const weather = await getCurrentWeather(latitude, longitude);
  if (!weather?.current) return { verified: false, reason: 'No weather data available' };

  const { wind_speed_10m, wind_gusts_10m, weather_code } = weather.current;
  const highWind = wind_speed_10m > 60 || wind_gusts_10m > 90;
  const stormCodes = [95, 96, 99]; // Thunderstorm weather codes

  return {
    verified: highWind || stormCodes.includes(weather_code),
    wind_speed: wind_speed_10m,
    wind_gusts: wind_gusts_10m,
    weather_code: weather_code,
    reason: highWind
      ? `High wind speeds detected: ${wind_speed_10m} km/h (gusts: ${wind_gusts_10m} km/h)`
      : stormCodes.includes(weather_code)
        ? 'Thunderstorm weather code detected'
        : 'No storm conditions detected',
    data: weather.current,
  };
}

/**
 * General weather verification for any disaster type.
 */
export async function verifyWeather(disasterType, latitude, longitude) {
  switch (disasterType?.toLowerCase()) {
    case 'flood':
      return verifyFloodConditions(latitude, longitude);
    case 'cyclone':
    case 'hurricane':
    case 'storm':
    case 'tornado':
      return verifyStormConditions(latitude, longitude);
    default:
      return { verified: false, reason: `No weather verification available for ${disasterType}` };
  }
}

export default { getCurrentWeather, verifyFloodConditions, verifyStormConditions, verifyWeather };
