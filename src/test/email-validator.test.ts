import { describe, it, expect } from 'vitest';
import { isValidEmailFormat, isDisposableEmail, validateEmailForSubscription, isProperEmail } from '../lib/email-validator';

describe('Email Validator', () => {
    describe('isValidEmailFormat', () => {
        it('should return true for valid emails', () => {
            expect(isValidEmailFormat('test@gmail.com')).toBe(true);
            expect(isValidEmailFormat('user.name+tag@example.co.uk')).toBe(true);
            expect(isValidEmailFormat('business@company.com')).toBe(true);
        });

        it('should return false for invalid emails', () => {
            expect(isValidEmailFormat('plainaddress')).toBe(false);
            expect(isValidEmailFormat('#@%^%#$@#$@#.com')).toBe(false);
            expect(isValidEmailFormat('@example.com')).toBe(false);
            expect(isValidEmailFormat('Joe Smith <email@example.com>')).toBe(false);
            expect(isValidEmailFormat('email.example.com')).toBe(false);
            expect(isValidEmailFormat('email@example@example.com')).toBe(false);
            expect(isValidEmailFormat('.email@example.com')).toBe(false);
            expect(isValidEmailFormat('email.@example.com')).toBe(false);
            expect(isValidEmailFormat('email@example.com.')).toBe(false);
            expect(isValidEmailFormat('email@example..com')).toBe(false);
        });
    });

    describe('isDisposableEmail', () => {
        it('should return true for disposable domains', () => {
            expect(isDisposableEmail('test@mailinator.com')).toBe(true);
            expect(isDisposableEmail('user@temp-mail.org')).toBe(true);
            expect(isDisposableEmail('anybody@yopmail.com')).toBe(true);
        });

        it('should return false for regular domains', () => {
            expect(isDisposableEmail('test@gmail.com')).toBe(false);
            expect(isDisposableEmail('user@outlook.com')).toBe(false);
            expect(isDisposableEmail('someone@remsleep.com')).toBe(false);
        });
    });

    describe('isProperEmail', () => {
        it('should return true for proper emails', () => {
            expect(isProperEmail('test@gmail.com')).toBe(true);
            expect(isProperEmail('kikioella@gmail.com')).toBe(true);
            expect(isProperEmail('kiki@me.com')).toBe(true); // Short but known
        });

        it('should return false for rubbish emails', () => {
            expect(isProperEmail('ti@gmail.com')).toBe(false); // Local part too short
            expect(isProperEmail('timi@g.com')).toBe(false); // Domain label too short
            expect(isProperEmail('kiki@ge.com')).toBe(false); // Domain label too short and unknown
            expect(isProperEmail('kikioella@de.com')).toBe(false); // Domain label too short and unknown
        });
    });

    describe('validateEmailForSubscription', () => {
        it('should validate correctly and return success for valid email', () => {
            const result = validateEmailForSubscription('valid@gmail.com');
            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('should return error for empty email', () => {
            const result = validateEmailForSubscription('');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Email address is required');
        });

        it('should return error for invalid format', () => {
            const result = validateEmailForSubscription('invalid-email');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Please enter a valid email address');
        });

        it('should return error for disposable email', () => {
            const result = validateEmailForSubscription('test@mailinator.com');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Disposable email addresses are not allowed');
        });

        it('should return error for rubbish email', () => {
            const result = validateEmailForSubscription('timi@g.com');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Please enter a proper email address (e.g., name@gmail.com)');
        });
    });
});
