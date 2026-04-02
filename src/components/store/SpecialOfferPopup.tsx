import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface SpecialOfferPopupProps {
  onClose: () => void;
}

export function SpecialOfferPopup({ onClose }: SpecialOfferPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Check if offer should be shown (max 2 times per 30 minutes)
  useEffect(() => {
    const checkOfferDisplay = () => {
      const storageKey = 'specialOfferShown';
      const now = Date.now();
      const lastShown = localStorage.getItem(storageKey);
      const timesShown = lastShown ? parseInt(lastShown) : 0;
      
      // Check if 30 minutes have passed since last shown
      if (lastShown) {
        const lastShownTime = parseInt(localStorage.getItem(`${storageKey}_time`) || '0');
        const timeDiff = now - lastShownTime;
        const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
        
        if (timeDiff < thirtyMinutes) {
          return; // Don't show again if within 30 minutes
        }
      }
      
      // Show offer if less than 2 times shown
      if (timesShown < 2) {
        setIsVisible(true);
        localStorage.setItem(storageKey, (timesShown + 1).toString());
        localStorage.setItem(`${storageKey}_time`, now.toString());
      }
    };

    // Check on page load
    checkOfferDisplay();
    
    // Check every 30 seconds in case user stays on page
    const interval = setInterval(checkOfferDisplay, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
        
        <div className="text-center">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">You've got a special offer! 🎉</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-bold text-yellow-800 mb-2">Limited Time Offer</h4>
              <p className="text-yellow-700 text-sm leading-relaxed">
                Get <span className="font-bold text-lg">15% OFF</span> your first order!
              </p>
              <p className="text-yellow-600 text-xs mt-2">
                This special offer is limited to 2 displays per session
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-bold text-gray-800 mb-2">Why wait?</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Premium Egyptian cotton sateen</li>
                <li>• Complete bedding set (6 pieces)</li>
                <li>• 300 thread count quality</li>
                <li>• Limited time discount</li>
              </ul>
            </div>
          </div>
          
          <button
            onClick={handleClose}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Claim Your 15% OFF
          </button>
        </div>
      </div>
    </div>
  );
}
