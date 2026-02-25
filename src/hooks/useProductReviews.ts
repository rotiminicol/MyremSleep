import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


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
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/judgeme-reviews?action=fetch&page=${page}&per_page=${perPage}`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        }
      );

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
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/judgeme-reviews?action=create`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        }
      );

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
