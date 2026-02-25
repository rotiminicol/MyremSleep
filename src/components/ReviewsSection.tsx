import { Star, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProductReviews, Review } from '@/hooks/useProductReviews';

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

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
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
  const { data, isLoading } = useProductReviews(productHandle, reviewPage, 10);

  const reviews = data?.reviews || [];
  const totalCount = data?.total_count || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / 10));
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  return (
    <section className="mt-0 py-16 px-4 md:px-0 border-t border-[#e0dbd5]">
      {/* ── Header ── */}
      <div className="text-center mb-12">
        <h2 className="font-serif text-4xl text-gray-900 mb-8">Customer Reviews</h2>

        <div className="flex flex-col items-center gap-3">
          {reviews.length > 0 ? (
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
              {isLoading ? 'Loading reviews...' : 'No reviews yet — be the first to share your experience.'}
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

      {/* ── Filters ── */}
      {reviews.length > 0 && (
        <div className="max-w-4xl mx-auto space-y-5 mb-10">
          <div className="relative inline-block">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-[#e0dbd5] bg-white text-[12px] text-gray-700 px-4 py-2.5 pr-10 font-sans appearance-none cursor-pointer focus:outline-none focus:border-gray-900 transition-colors"
            >
              <option value="rating">Rating</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          <div className="space-y-2.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Popular Topics</p>
            <div className="flex flex-wrap gap-2">
              {REVIEW_TOPICS.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setReviewFilter(reviewFilter === topic ? null : topic)}
                  className={cn(
                    'px-4 py-1.5 text-[11px] font-bold tracking-[0.12em] border transition-colors',
                    reviewFilter === topic
                      ? 'bg-[#2D2D2D] text-white border-[#2D2D2D]'
                      : 'bg-white text-gray-700 border-[#e0dbd5] hover:border-gray-500'
                  )}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Loading ── */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
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
                        <path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
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
      {!isLoading && totalPages > 1 && (
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-1 pt-10">
          <button
            onClick={() => setReviewPage((p) => Math.max(1, p - 1))}
            disabled={reviewPage === 1}
            className="w-9 h-9 flex items-center justify-center border border-[#e0dbd5] text-gray-500 hover:border-gray-900 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setReviewPage(page)}
              className={cn(
                'w-9 h-9 flex items-center justify-center text-[12px] font-bold transition-colors border',
                reviewPage === page
                  ? 'bg-[#2D2D2D] text-white border-[#2D2D2D]'
                  : 'border-[#e0dbd5] text-gray-600 hover:border-gray-900 hover:text-gray-900'
              )}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setReviewPage((p) => Math.min(totalPages, p + 1))}
            disabled={reviewPage === totalPages}
            className="w-9 h-9 flex items-center justify-center border border-[#e0dbd5] text-gray-500 hover:border-gray-900 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
