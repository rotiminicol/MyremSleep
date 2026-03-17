import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCreateReview } from '@/hooks/useProductReviews';
import { toast } from 'sonner';

interface WriteReviewDrawerProps {
  open: boolean;
  onClose: () => void;
  productId?: string;
  productHandle?: string;
}

export function WriteReviewDrawer({ open, onClose, productId, productHandle }: WriteReviewDrawerProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [headline, setHeadline] = useState('');
  const [review, setReview] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const createReview = useCreateReview();

  const handleSubmit = async () => {
    if (!rating || !headline || !review || !name) return;

    try {
      await createReview.mutateAsync({
        name,
        email: email || undefined,
        rating,
        title: headline,
        reviewBody: review,
        productId: productId || '',
        productHandle: productHandle || undefined,
      });

      toast.success('Review submitted!', {
        description: 'Thank you for sharing your experience.',
        position: 'top-center',
      });

      // Reset form
      setRating(0);
      setHeadline('');
      setReview('');
      setName('');
      setEmail('');
      setFiles([]);
      onClose();
    } catch (error) {
      toast.error('Failed to submit review', {
        description: 'Please try again later.',
        position: 'top-center',
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const isValid = rating > 0 && headline.trim() && review.trim() && name.trim() && email.trim();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#f5f1ed] shadow-xl z-50 flex flex-col"
          >
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <div className="p-6 space-y-7">
                <div className="flex items-start justify-between">
                  <h2 className="font-serif text-2xl text-gray-900 leading-snug">
                    Share your thoughts
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0 ml-4 mt-0.5"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Rate */}
                <div className="space-y-3">
                  <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-900">
                    Rate Your Experience <span className="text-gray-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const filled = star <= (hoverRating || rating);
                      return (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition-transform hover:scale-110 active:scale-95"
                        >
                          <svg width="32" height="32" viewBox="0 0 24 24" fill={filled ? '#2D2D2D' : 'none'} stroke={filled ? '#2D2D2D' : '#C4BDB6'} strokeWidth="1.5">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Headline */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-900">
                    Add a Headline <span className="text-gray-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Summarize your experience"
                    className="w-full border border-[#C4BDB6] bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 font-sans focus:outline-none focus:border-gray-900 transition-colors"
                  />
                </div>

                {/* Review body */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-900">
                    Write a Review <span className="text-gray-400">*</span>
                  </label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Tell us what you like or dislike"
                    rows={5}
                    className="w-full border border-[#C4BDB6] bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 font-sans focus:outline-none focus:border-gray-900 transition-colors resize-none"
                  />
                </div>

                {/* Media upload */}
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Add media (Optional)</p>
                    <p className="text-xs text-gray-500 mt-0.5 font-sans">
                      Upload up to 10 images and 3 videos (max. file size 2 GB)
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-2 border border-[#C4BDB6] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-700 hover:border-gray-900 hover:text-gray-900 cursor-pointer transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 16 12 12 8 16" />
                      <line x1="12" y1="12" x2="12" y2="21" />
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                    </svg>
                    Upload
                    <input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
                  </label>
                  {files.length > 0 && (
                    <p className="text-xs text-gray-500 font-sans">{files.length} file(s) selected</p>
                  )}
                </div>

                <div className="border-t border-[#e0dbd5]" />

                {/* Name */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-900">
                    Your Name <span className="text-gray-400">*</span>
                  </label>
                  <p className="text-xs text-gray-500 font-sans -mt-1">This will appear publicly with your review</p>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full border border-[#C4BDB6] bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 font-sans focus:outline-none focus:border-gray-900 transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-900">
                    Your Email <span className="text-gray-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full border border-[#C4BDB6] bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 font-sans focus:outline-none focus:border-gray-900 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#e0dbd5] px-6 py-4 bg-[#f5f1ed] flex items-center justify-between flex-shrink-0">
              <p className="text-[11px] text-gray-400 font-sans">* required fields</p>
              <button
                onClick={handleSubmit}
                disabled={!isValid || createReview.isPending}
                className={cn(
                  'px-8 py-3 text-[11px] font-bold tracking-[0.2em] uppercase transition-colors flex items-center gap-2',
                  isValid && !createReview.isPending
                    ? 'bg-[#2D2D2D] hover:bg-black text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                )}
              >
                {createReview.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {createReview.isPending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
