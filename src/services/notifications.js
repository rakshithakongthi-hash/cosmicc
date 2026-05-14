/**
 * DisasterSense AI - Notification Service
 * Handles browser push notifications and email alerts.
 */

/** Request browser notification permission */
export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  const perm = await Notification.requestPermission();
  return perm;
}

/** Send browser push notification */
export function sendBrowserNotification(title, options = {}) {
  if (Notification.permission !== 'granted') return null;
  return new Notification(title, {
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200],
    ...options,
  });
}

/** Send disaster alert notification */
export function notifyDisasterAlert(alert) {
  const severityEmoji = { Critical: '🔴', High: '🟠', Medium: '🟡', Low: '🟢' };
  const emoji = severityEmoji[alert.severity] || '⚠️';
  sendBrowserNotification(
    `${emoji} ${alert.disaster_type} Alert - ${alert.severity}`,
    {
      body: `${alert.location}\n${alert.summary}`,
      tag: `alert-${alert.id}`,
      requireInteraction: alert.severity === 'Critical',
      data: { alertId: alert.id, url: `/alerts/${alert.id}` },
    }
  );
}

/** Play alert sound */
export function playAlertSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) { /* silent fail */ }
}

export default { requestNotificationPermission, sendBrowserNotification, notifyDisasterAlert, playAlertSound };
