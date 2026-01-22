import { useEffect } from 'react';

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: (...args: unknown[]) => void;
  }
}

// Facebook Pixel integration for Parkour app
// The pixel is loaded via Shopify's Parkour app, this component handles custom events
export function FacebookPixel() {
  useEffect(() => {
    // Check if fbq is available (loaded by Parkour/Shopify)
    if (typeof window.fbq === 'function') {
      // Track page view
      window.fbq('track', 'PageView');
    }
  }, []);

  return null;
}

// Helper functions for tracking events
export function trackEvent(eventName: string, parameters?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    if (parameters) {
      window.fbq('track', eventName, parameters);
    } else {
      window.fbq('track', eventName);
    }
  }
}

export function trackCustomEvent(eventName: string, parameters?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    if (parameters) {
      window.fbq('trackCustom', eventName, parameters);
    } else {
      window.fbq('trackCustom', eventName);
    }
  }
}

// Track email subscription
export function trackSubscription(email: string) {
  trackEvent('Lead', { content_name: 'Email Subscription' });
  trackCustomEvent('EmailSubscription', { email_domain: email.split('@')[1] });
}

// Track questionnaire completion
export function trackQuestionnaireComplete(data: { bedSize?: string; colors?: string[]; feel?: string; priority?: string; bedFeeling?: string }) {
  trackCustomEvent('QuestionnaireComplete', { ...data });
}

export default FacebookPixel;
