import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
      const { data, error } = await supabase.functions.invoke('judgeme-reviews', {
        body: {
          action: 'list',
          shopDomain: SHOP_DOMAIN,
          page,
          perPage,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to fetch reviews');
      }

      return {
        reviews: data?.reviews || [],
        current_page: data?.current_page || page,
        total_count: data?.total_count || 0,
        per_page: data?.per_page || perPage,
      };
    },
    retry: 1,
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
      const { data, error } = await supabase.functions.invoke('judge-me-proxy', {
        body: {
          action: 'create',
          shopDomain: SHOP_DOMAIN,
          productId: input.productId,
          name: input.name,
          email: input.email,
          rating: input.rating,
          title: input.title,
          reviewBody: input.reviewBody,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to submit review');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}
