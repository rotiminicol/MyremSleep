import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const JUDGEME_API_TOKEN = import.meta.env.VITE_JUDGEME_API_TOKEN;
const SHOP_DOMAIN = 'zr4ktm-7m.myshopify.com';

export interface Review {
  id: number;
  rating: number;
  title: string;
  body: string;
  reviewer: {
    name: string;
  };
  created_at: string;
  verified: string;
}

interface ReviewsResponse {
  reviews: Review[];
  current_page: number;
  total_count: number;
  per_page: number;
}

export function useProductReviews(productHandle: string, page: number = 1, perPage: number = 10) {
  return useQuery({
    queryKey: ['reviews', productHandle, page, perPage],
    queryFn: async (): Promise<ReviewsResponse> => {
      const apiUrl = `/api/judge.me/api/v1/reviews?shop_domain=${SHOP_DOMAIN}&api_token=${JUDGEME_API_TOKEN}&per_page=${perPage}&page=${page}`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const result = await response.json();
      return {
        reviews: result.reviews || [],
        current_page: result.current_page || page,
        total_count: result.total_count || 0,
        per_page: result.per_page || perPage,
      };
    },
    staleTime: 2 * 60 * 1000,
  });
}

interface CreateReviewInput {
  name: string;
  rating: number;
  title: string;
  reviewBody: string;
  productId: string;
  email?: string;
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateReviewInput) => {
      const response = await fetch('/api/judge.me/api/v1/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shop_domain: SHOP_DOMAIN,
          api_token: JUDGEME_API_TOKEN,
          platform: 'shopify',
          id: input.productId,
          url: SHOP_DOMAIN,
          review: {
            rating: input.rating,
            title: input.title,
            body: input.reviewBody,
            reviewer: {
              name: input.name,
              email: input.email || `${input.name.replace(/\s/g, '').toLowerCase()}@review.local`,
            },
          },
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to submit review');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}
