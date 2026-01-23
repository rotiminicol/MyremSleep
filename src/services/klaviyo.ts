// Klaviyo Service - Direct API integration
// Uses Klaviyo's client-side subscribe API with public/company key

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

const KLAVIYO_PUBLIC_KEY = import.meta.env.VITE_KLAVIYO_PUBLIC_KEY;
const KLAVIYO_LIST_ID = import.meta.env.VITE_KLAVIYO_LIST_ID;

export async function subscribeToKlaviyo(data: SubscriberData): Promise<boolean> {
  try {
    console.log('[Klaviyo] Subscribing via Client API:', data);

    if (!KLAVIYO_PUBLIC_KEY) {
      console.error('[Klaviyo] Public Key (Company ID) is missing!');
      return false;
    }
    console.log('[Klaviyo] Using Public Key:', KLAVIYO_PUBLIC_KEY.substring(0, 3) + '...');

    // Store locally first
    storeLocally(data);

    // Use Klaviyo's client-side subscribe API with company_id query param
    const response = await fetch(`https://a.klaviyo.com/client/subscriptions/?company_id=${KLAVIYO_PUBLIC_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'revision': '2024-02-15',
      },
      body: JSON.stringify({
        data: {
          type: 'subscription',
          attributes: {
            profile: {
              data: {
                type: 'profile',
                attributes: {
                  email: data.email,
                  first_name: data.firstName,
                  properties: {
                    source: 'remsleep_website',
                    subscribed_at: new Date().toISOString(),
                  },
                },
              },
            },
            custom_source: 'REMsleep Website',
          },
          relationships: {
            list: {
              data: {
                type: 'list',
                id: KLAVIYO_LIST_ID,
              },
            },
          },
        },
      }),
    });

    if (response.status === 202 || response.ok) {
      console.log('[Klaviyo] Subscription successful');
      return true;
    }

    const errorText = await response.text();
    console.error('[Klaviyo] Subscription failed:', response.status, errorText);
    return false;
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
    console.log('[Klaviyo] Updating profile via Client API:', { email, questionnaire });

    // Get the first name from local storage
    const existing = JSON.parse(localStorage.getItem('remsleep_subscribers') || '[]');
    const subscriber = existing.find((sub: SubscriberData) => sub.email === email);
    const firstName = subscriber?.firstName || '';

    // Build custom properties
    const properties: Record<string, unknown> = {
      source: 'remsleep_website',
    };

    if (questionnaire.bedSize) properties.bed_size = questionnaire.bedSize;
    if (questionnaire.colors && questionnaire.colors.length > 0) {
      properties.preferred_colors = questionnaire.colors.join(", ");
    }
    if (questionnaire.colorOther) properties.color_other = questionnaire.colorOther;
    if (questionnaire.feel) properties.preferred_feel = questionnaire.feel;
    if (questionnaire.priority) properties.purchase_priority = questionnaire.priority;
    if (questionnaire.bedFeeling) properties.bed_feeling = questionnaire.bedFeeling;
    properties.questionnaire_completed = true;
    properties.questionnaire_completed_at = new Date().toISOString();

    // Use Klaviyo's client-side profiles API
    const response = await fetch(`https://a.klaviyo.com/client/profiles/?company_id=${KLAVIYO_PUBLIC_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'revision': '2024-02-15',
      },
      body: JSON.stringify({
        data: {
          type: 'profile',
          attributes: {
            email: email,
            first_name: firstName,
            properties: properties,
          },
        },
      }),
    });

    if (response.status === 201 || response.status === 200 || response.status === 202 || response.ok) {
      console.log('[Klaviyo] Profile updated with questionnaire');
      updateLocalQuestionnaire(email, questionnaire);
      return true;
    }

    const errorText = await response.text();
    console.error('[Klaviyo] Update profile failed:', response.status, errorText);
    updateLocalQuestionnaire(email, questionnaire);
    return false;
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

export function getStoredSubscribers(): Array<SubscriberData & { questionnaire?: QuestionnaireData }> {
  return JSON.parse(localStorage.getItem('remsleep_subscribers') || '[]');
}

export async function trackContactForm(data: { name: string; email: string; subject: string; message: string }): Promise<boolean> {
  try {
    console.log('[Klaviyo] Tracking contact form submission:', data);

    if (!KLAVIYO_PUBLIC_KEY) {
      console.error('[Klaviyo] Public Key (Company ID) is missing!');
      return false;
    }

    // Identify/Create profile + Track Event in one go
    const response = await fetch(`https://a.klaviyo.com/client/events/?company_id=${KLAVIYO_PUBLIC_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'revision': '2024-02-15',
      },
      body: JSON.stringify({
        data: {
          type: 'event',
          attributes: {
            properties: {
              Subject: data.subject,
              Message: data.message,
              Name: data.name,
              Source: 'Contact Form'
            },
            metric: {
              data: {
                type: 'metric',
                attributes: {
                  name: 'Contact Form Submitted'
                }
              }
            },
            profile: {
              data: {
                type: 'profile',
                attributes: {
                  email: data.email,
                  first_name: data.name,
                  properties: {
                    source: 'remsleep_website',
                  }
                }
              }
            }
          }
        }
      }),
    });

    if (response.status === 202 || response.ok) {
      console.log('[Klaviyo] Contact form tracked successfully');
      return true;
    }

    const errorText = await response.text();
    console.error('[Klaviyo] Track contact form failed:', response.status, errorText);
    return false;
  } catch (error) {
    console.error('[Klaviyo] Track contact form error:', error);
    return false;
  }
}
