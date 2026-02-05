/**
 * Enhanced Email Validation Utility
 * 
 * Provides robust email validation including:
 * 1. Correct format (Regex)
 * 2. Blocking disposable/temporary email domains
 * 3. Specific protection against spam
 */

// List of common disposable email domains
// In a production environment, this could be a larger list or an external API call
export const DISPOSABLE_EMAIL_DOMAINS = new Set([
    'mailinator.com',
    'temp-mail.org',
    'guerrillamail.com',
    '10minutemail.com',
    'throwawaymail.com',
    'trashmail.com',
    'yopmail.com',
    'disposable-mail.com',
    'tempmail.net',
    'mail7.io',
    'sharklasers.com',
    'guerrillamailblock.com',
    'guerrillamail.net',
    'guerrillamail.biz',
    'guerrillamail.org',
    'grr.la',
    'pokemail.net',
    'spam4.me',
    'dispostable.com',
    'getairmail.com',
    'maildrop.cc',
    'mailforyou.com',
    'temp-mail.com',
    'burnemail.com',
    'temp-mail.link',
    'temp-mail.io',
    'mailtothis.com',
    'mytemp.email',
    'emlhub.com',
    'emlpro.com',
    'emlten.com',
    'moakt.com',
    'disposablemail.com',
    'temp-mail.fr',
    'temp-mail.de',
    'temp-mail.es',
    'tempmail.be',
    'temporary-mail.net',
    'instant-mail.io',
    'fake-mail.net',
    'get-mail.io',
    'temp-email.org',
    'dismail.org',
    'mailcatch.com',
    'mailnesia.com',
    'mailfree.cc'
]);

/**
 * Validates email format using a robust regex
 */
export function isValidEmailFormat(email: string): boolean {
    // RFC 5322 compliant-ish regex
    // A standard, robust email regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

    if (!email || email.length > 254) return false;

    if (!emailRegex.test(email)) return false;

    const parts = email.split('@');
    if (parts.length !== 2) return false;

    const localPart = parts[0];
    const domain = parts[1];

    // Local part checks: no starting/ending dots, no consecutive dots
    if (localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) return false;

    // Domain checks: ensure at least one dot, no starting/ending dots
    if (!domain.includes('.') || domain.startsWith('.') || domain.endsWith('.')) return false;

    return true;
}

/**
 * Checks if the email domain is in the disposable list
 */
export function isDisposableEmail(email: string): boolean {
    const parts = email.toLowerCase().split('@');
    if (parts.length !== 2) return false;

    const domain = parts[1];
    return DISPOSABLE_EMAIL_DOMAINS.has(domain);
}

/**
 * Checks if the email is "proper" (not rubbish/test data)
 */
const KNOWN_SHORT_DOMAIN_LABELS = new Set(['me', 'io', 'ai', 'co', 'uk', 'us', 'tv', 'ly']);

export function isProperEmail(email: string): boolean {
    const parts = email.toLowerCase().split('@');
    if (parts.length !== 2) return false;

    const [localPart, domain] = parts;
    const domainParts = domain.split('.');
    if (domainParts.length < 2) return false;

    const mainLabel = domainParts[0];

    // Rule 1: Local part must be at least 3 characters
    if (localPart.length < 3) return false;

    // Rule 2: Main domain label (e.g., 'gmail' in 'gmail.com') must be at least 3 characters
    // OR be a known valid short label (like 'me' for me.com)
    if (mainLabel.length < 3 && !KNOWN_SHORT_DOMAIN_LABELS.has(mainLabel)) {
        return false;
    }

    // Rule 3: Main domain label cannot be just a single character
    if (mainLabel.length < 2) return false;

    return true;
}

/**
 * Multi-layered email validation for subscription
 */
export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export function validateEmailForSubscription(email: string): ValidationResult {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
        return { isValid: false, error: 'Email address is required' };
    }

    if (!isValidEmailFormat(trimmedEmail)) {
        return { isValid: false, error: 'Please enter a valid email address' };
    }

    if (isDisposableEmail(trimmedEmail)) {
        return { isValid: false, error: 'Disposable email addresses are not allowed' };
    }

    if (!isProperEmail(trimmedEmail)) {
        return { isValid: false, error: 'Please enter a proper email address (e.g., name@gmail.com)' };
    }

    return { isValid: true };
}
