// Klaviyo Service for Email Subscription
// Note: Klaviyo API requires server-side integration for full functionality
// This is a client-side implementation that will need a backend edge function

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

// Store subscriber data locally until Klaviyo backend is set up
let pendingSubscribers: Array<SubscriberData & { questionnaire?: QuestionnaireData }> = [];

export async function subscribeToKlaviyo(data: SubscriberData): Promise<boolean> {
  try {
    // Store locally for now - will be sent to Klaviyo via edge function
    console.log('[Klaviyo] Subscribing:', data);
    pendingSubscribers.push(data);
    
    // Store in localStorage as backup
    const existing = JSON.parse(localStorage.getItem('remsleep_subscribers') || '[]');
    existing.push({ ...data, subscribedAt: new Date().toISOString() });
    localStorage.setItem('remsleep_subscribers', JSON.stringify(existing));
    
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
    
    // Update local storage with questionnaire data
    const existing = JSON.parse(localStorage.getItem('remsleep_subscribers') || '[]');
    const updated = existing.map((sub: SubscriberData & { questionnaire?: QuestionnaireData }) => {
      if (sub.email === email) {
        return { ...sub, questionnaire, questionnaireCompletedAt: new Date().toISOString() };
      }
      return sub;
    });
    localStorage.setItem('remsleep_subscribers', JSON.stringify(updated));
    
    return true;
  } catch (error) {
    console.error('[Klaviyo] Update profile error:', error);
    return false;
  }
}

export function trackQuestionnaireSkipped(email: string): void {
  console.log('[Klaviyo] Questionnaire skipped:', email);
  
  // Update local storage to mark as skipped
  const existing = JSON.parse(localStorage.getItem('remsleep_subscribers') || '[]');
  const updated = existing.map((sub: SubscriberData & { questionnaireSkipped?: boolean }) => {
    if (sub.email === email) {
      return { ...sub, questionnaireSkipped: true, skippedAt: new Date().toISOString() };
    }
    return sub;
  });
  localStorage.setItem('remsleep_subscribers', JSON.stringify(updated));
}

// Get all stored subscribers (for admin/debugging)
export function getStoredSubscribers(): Array<SubscriberData & { questionnaire?: QuestionnaireData }> {
  return JSON.parse(localStorage.getItem('remsleep_subscribers') || '[]');
}
