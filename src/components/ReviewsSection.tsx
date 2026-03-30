import { Star, Loader2, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProductReviews, useAllReviews, Review } from '@/hooks/useProductReviews';
import { useState, useRef, useEffect } from 'react';

const REVIEW_TOPICS = ['INSTRUCTIONS', 'SIZE', 'FABRIC', 'COLOUR', 'FIT', 'COMFORT', 'FINISH', 'SHEET'];

interface ReviewsSectionProps {
  productHandle: string;
  reviewPage: number;
  setReviewPage: React.Dispatch<React.SetStateAction<number>>;
  reviewFilter: string | null;
  setReviewFilter: React.Dispatch<React.SetStateAction<string | null>>;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  reviewDrawerOpen: boolean;
  setReviewDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SORT_OPTIONS = [
  { value: 'rating_desc', label: 'Highest Rated' },
  { value: 'rating_asc', label: 'Lowest Rated' },
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
}

function sortReviews(reviews: Review[], sortBy: string): Review[] {
  return [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'rating_desc':
        return b.rating - a.rating;
      case 'rating_asc':
        return a.rating - b.rating;
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      default:
        return 0;
    }
  });
}

/** Bespoke animated dropdown  replaces the native <select> */
function SortDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative inline-block select-none">
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'group flex items-center gap-3 px-5 py-3 border transition-all duration-200 focus:outline-none',
          'bg-white text-gray-900 text-[11px] font-bold tracking-[0.16em] uppercase',
          open
            ? 'border-gray-900 shadow-[inset_0_0_0_1px_#111]'
            : 'border-[#e0dbd5] hover:border-gray-400'
        )}
      >
        <span className="text-[10px] text-gray-400 font-sans font-normal tracking-[0.1em] uppercase mr-1">
          Sort
        </span>
        <span>{selected.label}</span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ml-1',
            open && 'rotate-180'
          )}
          strokeWidth={2.5}
        />
      </button>

      {/* Panel */}
      <div
        className={cn(
          'absolute left-0 top-full mt-1 z-50 min-w-full bg-white border border-gray-900',
          'shadow-[4px_4px_0px_0px_#2D2D2D] overflow-hidden',
          'transition-all duration-150 origin-top',
          open ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-95 pointer-events-none'
        )}
        role="listbox"
      >
        {SORT_OPTIONS.map((option, i) => {
          const isActive = option.value === value;
          return (
            <button
              key={option.value}
              role="option"
              aria-selected={isActive}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={cn(
                'w-full flex items-center justify-between gap-6 px-5 py-3',
                'text-[11px] font-bold tracking-[0.16em] uppercase text-left',
                'transition-colors duration-100',
                i !== SORT_OPTIONS.length - 1 && 'border-b border-[#f0ece8]',
                isActive
                  ? 'bg-[#2D2D2D] text-white'
                  : 'text-gray-700 hover:bg-[#f7f4f1]'
              )}
            >
              <span>{option.label}</span>
              {isActive && (
                <Check className="h-3 w-3 flex-shrink-0" strokeWidth={3} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Star rating filter pills */
function RatingFilter({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10px] text-gray-400 font-sans tracking-[0.1em] uppercase mr-1">Filter</span>
      {[5, 4, 3, 2, 1].map((star) => {
        const key = String(star);
        const isActive = value === key;
        return (
          <button
            key={star}
            onClick={() => onChange(isActive ? null : key)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 border text-[10px] font-bold tracking-[0.14em] uppercase transition-all duration-150',
              isActive
                ? 'bg-[#2D2D2D] border-[#2D2D2D] text-white shadow-[2px_2px_0px_0px_#555]'
                : 'border-[#e0dbd5] text-gray-600 hover:border-gray-400 bg-white'
            )}
          >
            <Star
              className="h-2.5 w-2.5"
              fill={isActive ? 'white' : '#9CA3AF'}
              stroke={isActive ? 'white' : '#9CA3AF'}
            />
            {star}
          </button>
        );
      })}
      {value && (
        <button
          onClick={() => onChange(null)}
          className="text-[10px] text-gray-400 hover:text-gray-700 font-sans underline underline-offset-2 transition-colors ml-1"
        >
          Clear
        </button>
      )}
    </div>
  );
}

export function ReviewsSection({
  productHandle,
  reviewPage,
  setReviewPage,
  reviewFilter,
  setReviewFilter,
  sortBy,
  setSortBy,
  reviewDrawerOpen,
  setReviewDrawerOpen,
}: ReviewsSectionProps) {
  const REVIEWS_PER_PAGE = 5;
  const { data, isLoading } = useProductReviews(productHandle, reviewPage, REVIEWS_PER_PAGE);
  const { data: allReviewsData } = useAllReviews(1, 1000);

  const rawReviews = data?.reviews || [];
  const allReviews = allReviewsData?.reviews || [];
  const totalCount = allReviewsData?.total_count || allReviews.length || 0;

  // Apply filter then sort on the current page's reviews
  const filteredReviews = reviewFilter
    ? rawReviews.filter((r) => r.rating === Number(reviewFilter))
    : rawReviews;

  const reviews = sortReviews(filteredReviews, sortBy);

  // For pagination, derive total from filtered set when filtering
  const displayTotal = reviewFilter
    ? allReviews.filter((r) => r.rating === Number(reviewFilter)).length
    : totalCount;
  const totalPages = Math.max(1, Math.ceil(displayTotal / REVIEWS_PER_PAGE));

  const averageRating =
    allReviews.length > 0
      ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
      : '0';

  // Reset to page 1 when filter or sort changes
  const handleFilterChange = (v: string | null) => {
    setReviewFilter(v);
    setReviewPage(1);
  };
  const handleSortChange = (v: string) => {
    setSortBy(v);
    setReviewPage(1);
  };

  return (
    <section className="mt-0 py-16 px-4 md:px-0 border-t border-[#e0dbd5]">
      {/* ── Header ── */}
      <div className="text-center mb-12">
        <h2 className="font-serif text-4xl text-gray-900 mb-8">Customer Reviews</h2>

        <div className="flex flex-col items-center gap-3">
          {allReviews.length > 0 ? (
            <>
              <div className="flex items-baseline gap-4">
                <span className="font-serif text-5xl text-gray-900">{averageRating}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-5 w-5"
                      fill={star <= Math.round(Number(averageRating)) ? '#2D2D2D' : 'none'}
                      stroke={star <= Math.round(Number(averageRating)) ? '#2D2D2D' : '#D1D5DB'}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500 font-sans">
                Based on {totalCount.toLocaleString()} review{totalCount !== 1 ? 's' : ''}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-500 font-sans italic">
              {isLoading ? 'Loading reviews…' : 'No reviews yet  be the first to share your experience.'}
            </p>
          )}

          <button
            onClick={() => setReviewDrawerOpen(true)}
            className="mt-3 px-10 py-3.5 bg-[#2D2D2D] hover:bg-black text-white text-[11px] font-bold tracking-[0.2em] uppercase transition-colors"
          >
            Write a Review
          </button>
        </div>
      </div>

      {/* ── Controls: Sort + Filter ── */}
      {rawReviews.length > 0 && (
        <div className="max-w-4xl mx-auto mb-10 flex flex-col sm:flex-row sm:items-center gap-4">
          <SortDropdown value={sortBy} onChange={handleSortChange} />
          <div className="sm:border-l sm:border-[#e0dbd5] sm:pl-5">
            <RatingFilter value={reviewFilter} onChange={handleFilterChange} />
          </div>
        </div>
      )}

      {/* ── Loading ── */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      )}

      {/* ── Empty filtered state ── */}
      {!isLoading && rawReviews.length > 0 && reviews.length === 0 && (
        <div className="max-w-4xl mx-auto py-16 text-center">
          <p className="text-sm text-gray-500 font-sans italic">
            No {reviewFilter}-star reviews on this page.
          </p>
          <button
            onClick={() => handleFilterChange(null)}
            className="mt-4 text-[11px] font-bold tracking-[0.16em] uppercase text-gray-700 underline underline-offset-2 hover:text-gray-900 transition-colors"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* ── Reviews list ── */}
      {!isLoading && reviews.length > 0 && (
        <div className="max-w-4xl mx-auto divide-y divide-[#e0dbd5] border-t border-[#e0dbd5]">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="py-8 grid grid-cols-1 md:grid-cols-[180px_1fr_auto] gap-4 md:gap-6"
            >
              <div className="space-y-1.5">
                <p className="text-[12px] font-bold text-gray-900 uppercase tracking-wide">
                  {review.reviewer?.name || 'Anonymous'}
                </p>
                {review.verified === 'buyer' && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#2D2D2D] flex items-center justify-center flex-shrink-0">
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path
                          d="M1.5 4L3.5 6L6.5 2"
                          stroke="white"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-[11px] text-gray-500 font-sans">Verified Buyer</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-3.5 w-3.5"
                      fill={star <= review.rating ? '#2D2D2D' : 'none'}
                      stroke={star <= review.rating ? '#2D2D2D' : '#D1D5DB'}
                    />
                  ))}
                </div>
                <h4 className="font-serif text-lg text-gray-900 leading-snug">{review.title}</h4>
                <p className="text-sm text-gray-600 font-sans leading-relaxed">{review.body}</p>
              </div>

              <div className="md:text-right">
                <span className="text-[11px] text-gray-400 font-sans whitespace-nowrap">
                  {formatDate(review.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {!isLoading && reviews.length > 0 && (
        <div className="max-w-4xl mx-auto flex items-center justify-between pt-10">
          <button
            onClick={() => setReviewPage((p) => Math.max(1, p - 1))}
            disabled={reviewPage === 1}
            className="flex items-center gap-2 px-6 py-3 border border-[#e0dbd5] text-gray-700 hover:border-gray-900 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-[12px] font-medium"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Previous
          </button>

          <span className="text-[12px] text-gray-500 font-medium">
            {totalPages > 1
              ? `Page ${reviewPage} of ${totalPages}`
              : `${reviews.length} Review${reviews.length !== 1 ? 's' : ''}`}
          </span>

          <button
            onClick={() => setReviewPage((p) => Math.min(totalPages, p + 1))}
            disabled={reviewPage === totalPages || totalPages === 1}
            className="flex items-center gap-2 px-6 py-3 border border-[#e0dbd5] text-gray-700 hover:border-gray-900 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-[12px] font-medium"
          >
            Next
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
