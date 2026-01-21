/**
 * QuestionnaireModal Component
 * 5-step skippable questionnaire for collecting sleep preferences
 * Smooth animations and professional UX
 */

import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { updateProfileWithQuestionnaire, trackQuestionnaireSkipped, type QuestionnaireData } from '@/services/klaviyo';

interface QuestionnaireModalProps {
  isOpen: boolean;
  email: string;
  onComplete: () => void;
  onClose: () => void;
}

const TOTAL_STEPS = 5;

// Q1: Bed Size Options
const bedSizeOptions = [
  { value: 'single', label: 'Single' },
  { value: 'double', label: 'Double' },
  { value: 'king', label: 'King' },
  { value: 'super-king', label: 'Super King' },
  { value: 'multiple', label: 'I buy for more than one bed (I will tell you later)' },
];

// Q2: Color Options (select up to 3)
const colorOptions = [
  { value: 'white', label: 'White' },
  { value: 'ivory-cream', label: 'Ivory / Cream' },
  { value: 'oat-sand', label: 'Oat / Sand' },
  { value: 'stone-taupe', label: 'Stone / Taupe' },
  { value: 'warm-grey', label: 'Warm Grey' },
  { value: 'charcoal', label: 'Charcoal' },
  { value: 'deep-olive', label: 'Deep Olive' },
  { value: 'espresso-cocoa', label: 'Espresso / Cocoa' },
  { value: 'muted-blush', label: 'Muted Blush (soft, earthy pink)' },
  { value: 'other', label: 'Other (please specify)' },
];

// Q3: Feel Options
const feelOptions = [
  { value: 'crisp-hotel', label: 'Crisp, hotel-feel', description: 'Cool and structured' },
  { value: 'smooth-silky', label: 'Smooth, silky', description: 'Soft luxury' },
  { value: 'ultra-soft-cosy', label: 'Ultra-soft and cosy', description: '' },
  { value: 'airy-breathable', label: 'Airy and breathable', description: 'Light, relaxed' },
  { value: 'low-maintenance', label: 'Low-maintenance', description: 'Minimal wrinkles, easy care' },
];

// Q4: Priority Options
const priorityOptions = [
  { value: 'comfort-feel', label: 'Comfort and feel', description: 'Softness, breathability' },
  { value: 'look-aesthetic', label: 'Look and aesthetic', description: 'Colour, minimal luxury' },
  { value: 'durability', label: 'Durability', description: 'How long it lasts' },
  { value: 'easy-care', label: 'Easy care', description: 'Washing, wrinkling, drying' },
];

// Q5: Bed Feeling Options
const bedFeelingOptions = [
  { value: 'sanctuary', label: 'A sanctuary', description: 'Calm, safe, grounded' },
  { value: 'retreat', label: 'A retreat', description: 'Soft, luxurious, indulgent' },
  { value: 'reset', label: 'A reset', description: 'Clean, fresh, energising' },
  { value: 'hotel', label: 'A hotel', description: 'Crisp, polished, structured' },
  { value: 'cocoon', label: 'A cocoon', description: 'Warm, cosy, tucked-in' },
];

export function QuestionnaireModal({ isOpen, email, onComplete, onClose }: QuestionnaireModalProps) {
  const [step, setStep] = useState(1);
  const [bedSize, setBedSize] = useState<string | null>(null);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [colorOther, setColorOther] = useState('');
  const [feel, setFeel] = useState<string | null>(null);
  const [priority, setPriority] = useState<string | null>(null);
  const [bedFeeling, setBedFeeling] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setBedSize(null);
      setSelectedColors([]);
      setColorOther('');
      setFeel(null);
      setPriority(null);
      setBedFeeling(null);
      setIsExiting(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleSkip();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleClose = (skipTracking = false) => {
    setIsExiting(true);
    setTimeout(() => {
      if (!skipTracking) {
        trackQuestionnaireSkipped(email);
      }
      onClose();
    }, 300);
  };

  const handleSkip = () => {
    handleClose(false);
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors(prev => {
      if (prev.includes(color)) {
        return prev.filter(c => c !== color);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, color];
    });
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!bedSize;
      case 2: return selectedColors.length > 0 && (selectedColors.includes('other') ? colorOther.trim() !== '' : true);
      case 3: return !!feel;
      case 4: return !!priority;
      case 5: return !!bedFeeling;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS && canProceed()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const data: QuestionnaireData = {
      bedSize: bedSize || undefined,
      colors: selectedColors.length > 0 ? selectedColors : undefined,
      colorOther: colorOther || undefined,
      feel: feel || undefined,
      priority: priority || undefined,
      bedFeeling: bedFeeling || undefined,
    };

    try {
      await updateProfileWithQuestionnaire(email, data);
      setIsExiting(true);
      setTimeout(() => {
        onComplete();
      }, 300);
    } catch (error) {
      console.error('[QuestionnaireModal] Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Which bed size would you buy in our first drop?';
      case 2: return 'Which colours would you actually buy for your bedroom?';
      case 3: return 'What "feel" do you want most from bedding?';
      case 4: return 'Which matters more to you when choosing bedding?';
      case 5: return 'What do you want your bed to feel like?';
      default: return '';
    }
  };

  const getStepSubtitle = () => {
    if (step === 2) return 'Select up to 3';
    return null;
  };

  return (
    <div 
      className={`fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center sm:p-4 transition-opacity duration-300 z-50 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={(e) => e.target === e.currentTarget && handleSkip()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="questionnaire-title"
    >
      <div 
        className={`relative max-h-[85vh] sm:max-h-[90vh] w-full sm:max-w-lg bg-background rounded-t-2xl sm:rounded-2xl shadow-xl p-5 sm:p-6 transition-all duration-300 overflow-y-auto ${
          isExiting ? 'animate-modal-exit' : 'animate-modal-enter'
        } [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
      >
        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 text-muted-foreground hover:text-foreground transition-colors z-10"
          aria-label="Close questionnaire"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5 sm:mb-6 pr-8">
          <p className="text-xs sm:text-sm text-muted-foreground tracking-wider uppercase mb-2 font-body">
            Question {step} of {TOTAL_STEPS}
          </p>
          <h2 id="questionnaire-title" className="text-lg sm:text-headline text-foreground leading-tight font-display">
            {getStepTitle()}
          </h2>
          {getStepSubtitle() && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-body">{getStepSubtitle()}</p>
          )}
        </div>

        {/* Step 1: Bed Size */}
        {step === 1 && (
          <div className="space-y-2 sm:space-y-3 mb-5 sm:mb-6">
            {bedSizeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setBedSize(option.value)}
                className={`selection-card w-full text-left py-3 sm:py-4 px-3 sm:px-4 ${
                  bedSize === option.value ? 'selected' : ''
                }`}
              >
                <div className="font-medium text-sm sm:text-base text-foreground font-body">{option.label}</div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Colors (multi-select up to 3) */}
        {step === 2 && (
          <div className="space-y-2 sm:space-y-3 mb-5 sm:mb-6">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 sm:gap-3">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleColorToggle(option.value)}
                  disabled={selectedColors.length >= 3 && !selectedColors.includes(option.value)}
                  className={`selection-card text-left flex items-center justify-between py-3 px-3 sm:py-4 sm:px-4 ${
                    selectedColors.includes(option.value) ? 'selected' : ''
                  } ${selectedColors.length >= 3 && !selectedColors.includes(option.value) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="font-medium text-xs sm:text-base text-foreground font-body">{option.label}</div>
                  {selectedColors.includes(option.value) && (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 ml-1" />
                  )}
                </button>
              ))}
            </div>
            
            {/* Other text input */}
            {selectedColors.includes('other') && (
              <input
                type="text"
                value={colorOther}
                onChange={(e) => setColorOther(e.target.value)}
                placeholder="Please specify your preferred colour..."
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-border rounded-lg bg-background text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-body"
              />
            )}
            
            <p className="text-xs text-muted-foreground text-center font-body">
              {selectedColors.length}/3 selected
            </p>
          </div>
        )}

        {/* Step 3: Feel */}
        {step === 3 && (
          <div className="space-y-2 sm:space-y-3 mb-5 sm:mb-6">
            {feelOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFeel(option.value)}
                className={`selection-card w-full text-left py-3 px-3 sm:py-4 sm:px-4 ${
                  feel === option.value ? 'selected' : ''
                }`}
              >
                <div className="font-medium text-sm sm:text-base text-foreground font-body">{option.label}</div>
                {option.description && (
                  <div className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 font-body">{option.description}</div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Step 4: Priority */}
        {step === 4 && (
          <div className="space-y-2 sm:space-y-3 mb-5 sm:mb-6">
            {priorityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setPriority(option.value)}
                className={`selection-card w-full text-left py-3 px-3 sm:py-4 sm:px-4 ${
                  priority === option.value ? 'selected' : ''
                }`}
              >
                <div className="font-medium text-sm sm:text-base text-foreground font-body">{option.label}</div>
                {option.description && (
                  <div className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 font-body">{option.description}</div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Step 5: Bed Feeling */}
        {step === 5 && (
          <div className="space-y-2 sm:space-y-3 mb-5 sm:mb-6">
            {bedFeelingOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setBedFeeling(option.value)}
                className={`selection-card w-full text-left py-3 px-3 sm:py-4 sm:px-4 ${
                  bedFeeling === option.value ? 'selected' : ''
                }`}
              >
                <div className="font-medium text-sm sm:text-base text-foreground font-body">{option.label}</div>
                {option.description && (
                  <div className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 font-body">{option.description}</div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2 sm:gap-3">
          <div className="flex gap-2 sm:gap-3">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="btn-ghost text-muted-foreground flex-1 py-2.5 sm:py-3 text-sm sm:text-base font-body"
              >
                Back
              </button>
            )}
            
            {step < TOTAL_STEPS ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`btn-premium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 py-2.5 sm:py-3 text-sm sm:text-base font-body ${step > 1 ? 'flex-1' : 'w-full'}`}
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !canProceed()}
                className="btn-premium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 flex-1 py-2.5 sm:py-3 text-sm sm:text-base font-body"
              >
                {isSubmitting ? 'Saving...' : 'Complete'}
              </button>
            )}
          </div>
          
          <button onClick={handleSkip} className="btn-ghost text-muted-foreground text-xs sm:text-sm py-2 font-body">
            Skip for now
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div 
              key={i} 
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
                i + 1 <= step ? 'bg-primary' : 'bg-border'
              }`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuestionnaireModal;
