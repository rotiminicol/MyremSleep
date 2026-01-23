// Klaviyo Service for Email Subscription
// Uses edge function for secure API communication

import { supabase } from "@/integrations/supabase/client";

export interface SubscriberData {
  email: string;
  firstName: string;
}

export interface QuestionnaireData {
  bedSize?: string;
  colors?: string[];
  colorOther?: string;
  feel?: string;
  priority?: string;
  bedFeeling?: string;
}

export async function subscribeToKlaviyo(data: SubscriberData): Promise<boolean> {
  try {
    console.log('[Klaviyo] Subscribing:', data);
    
    // Always store locally first so we have firstName for questionnaire updates
    storeLocally(data);
    
    const { data: response, error } = await supabase.functions.invoke('klaviyo-subscribe', {
      body: {
        email: data.email,
        firstName: data.firstName,
      },
    });

    if (error) {
      console.error('[Klaviyo] Subscription error:', error);
      return false;
    }

    console.log('[Klaviyo] Subscription successful:', response);
    return true;
  } catch (error) {
    console.error('[Klaviyo] Subscription error:', error);
    return false;
  }
}

export async function updateProfileWithQuestionnaire(
  email: string, 
  questionnaire: QuestionnaireData
): Promise<boolean> {
  try {
    console.log('[Klaviyo] Updating profile with questionnaire:', { email, questionnaire });
    
    // Get the first name from local storage
    const existing = JSON.parse(localStorage.getItem('remsleep_subscribers') || '[]');
    const subscriber = existing.find((sub: SubscriberData) => sub.email === email);
    const firstName = subscriber?.firstName || '';

    const { data: response, error } = await supabase.functions.invoke('klaviyo-subscribe', {
      body: {
        email,
        firstName,
        questionnaire,
      },
    });

    if (error) {
      console.error('[Klaviyo] Update profile error:', error);
      // Store locally as fallback
      updateLocalQuestionnaire(email, questionnaire);
      return false;
    }

    console.log('[Klaviyo] Profile updated with questionnaire:', response);
    // Also update local storage
    updateLocalQuestionnaire(email, questionnaire);
    return true;
  } catch (error) {
    console.error('[Klaviyo] Update profile error:', error);
    updateLocalQuestionnaire(email, questionnaire);
    return false;
  }
}

export function trackQuestionnaireSkipped(email: string): void {
  console.log('[Klaviyo] Questionnaire skipped:', email);
  
  const existing = JSON.parse(localStorage.getItem('remsleep_subscribers') || '[]');
  const updated = existing.map((sub: SubscriberData & { questionnaireSkipped?: boolean }) => {
    if (sub.email === email) {
      return { ...sub, questionnaireSkipped: true, skippedAt: new Date().toISOString() };
    }
    return sub;
  });
  localStorage.setItem('remsleep_subscribers', JSON.stringify(updated));
}

// Helper functions for local storage fallback
function storeLocally(data: SubscriberData): void {
  const existing = JSON.parse(localStorage.getItem('remsleep_subscribers') || '[]');
  // Avoid duplicates
  const alreadyExists = existing.some((sub: SubscriberData) => sub.email === data.email);
  if (!alreadyExists) {
    existing.push({ ...data, subscribedAt: new Date().toISOString() });
    localStorage.setItem('remsleep_subscribers', JSON.stringify(existing));
  }
}

function updateLocalQuestionnaire(email: string, questionnaire: QuestionnaireData): void {
  const existing = JSON.parse(localStorage.getItem('remsleep_subscribers') || '[]');
  const updated = existing.map((sub: SubscriberData & { questionnaire?: QuestionnaireData }) => {
    if (sub.email === email) {
      return { ...sub, questionnaire, questionnaireCompletedAt: new Date().toISOString() };
    }
    return sub;
  });
  localStorage.setItem('remsleep_subscribers', JSON.stringify(updated));
}

// Get all stored subscribers (for admin/debugging)
export function getStoredSubscribers(): Array<SubscriberData & { questionnaire?: QuestionnaireData }> {
  return JSON.parse(localStorage.getItem('remsleep_subscribers') || '[]');
}
