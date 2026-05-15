/**
 * DisasterSense AI - Notification Service
 * Handles browser push notifications and email alerts.
 */
import emailjs from '@emailjs/browser';
import { fetchActiveAgencies } from './supabase.js';


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
export function notifyDisasterAlert(alert, sendEmail = false) {
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
  
  if (sendEmail || alert.severity === 'Critical' || alert.severity === 'High') {
    sendEmailAlert(alert);
  }
}

/** Send disaster alert email using EmailJS (Broadcasts to all active agencies) */
export async function sendEmailAlert(alert) {
  try {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    const isDemo = import.meta.env.VITE_DEMO_MODE === 'true';

    // If in demo mode, simulate success to prevent error popups for the user
    if (isDemo) {
      console.log('DEMO MODE: Simulating email alert send.');
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate delay
      return true;
    }

    if (!serviceId || serviceId === 'your-emailjs-service-id') {
      console.warn('EmailJS not configured properly.');
      return false;
    }

    const templateParams = {
      disaster_type: alert.disaster_type || 'Unknown Disaster',
      severity: alert.severity || 'Unknown',
      location: alert.location || 'Unknown Location',
      summary: alert.summary || 'No summary available.',
      recommended_action: alert.recommended_action || 'Stay safe.',
      confidence: alert.confidence ? Math.round(alert.confidence * 100) + '%' : 'N/A'
    };

    // Fetch active agencies to broadcast to
    const { data: agencies, error } = await fetchActiveAgencies();
    const emails = agencies ? agencies.map(a => a.email).filter(Boolean) : [];

    if (emails.length > 0) {
      // Broadcast to all agencies
      const promises = emails.map(email => {
        return emailjs.send(serviceId, templateId, { ...templateParams, to_email: email }, publicKey);
      });
      await Promise.allSettled(promises);
      console.log(`Email broadcasted to ${emails.length} agencies.`);
    } else {
      // Fallback: Send to default recipient in template
      const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
      console.log('Email sent to default recipient.', response.status, response.text);
    }

    return true;
  } catch (error) {
    console.error('Failed to send email alert:', error);
    return false;
  }
}

/** Send Telegram Alert via Bot API (Innovation #6) */
export async function sendTelegramAlert(alert) {
  try {
    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

    if (!botToken || !chatId || botToken === 'your-telegram-bot-token') {
      console.warn('Telegram Webhook not configured.');
      return false;
    }

    const message = `🚨 *${alert.severity.toUpperCase()} DISASTER ALERT* 🚨\n\n*Type:* ${alert.disaster_type}\n*Location:* ${alert.location}\n\n*Summary:* ${alert.summary}\n\n*Action:* ${alert.recommended_action}\n\n*Credibility:* ${Math.round((alert.confidence || alert.credibility_score || 0) * 100)}%`;

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to send Telegram alert:', error);
    return false;
  }
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

export default { requestNotificationPermission, sendBrowserNotification, notifyDisasterAlert, playAlertSound, sendEmailAlert, sendTelegramAlert };
