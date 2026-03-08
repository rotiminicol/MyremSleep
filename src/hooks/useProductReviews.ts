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

async function invokeReviewsFunction(body: Record<string, unknown>) {
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  const res = await fetch(
    `https://${projectId}.supabase.co/functions/v1/judgeme-reviews`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(errBody || `Function returned ${res.status}`);
  }

  return res.json();
}

export function useProductReviews(productHandle: string, page: number = 1, perPage: number = 10) {
  return useQuery({
    queryKey: ['reviews', productHandle, page, perPage],
    queryFn: async (): Promise<ReviewsResponse> => {
      const data = await invokeReviewsFunction({
        action: 'list',
        shopDomain: SHOP_DOMAIN,
        page,
        perPage,
      });

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
      const data = await invokeReviewsFunction({
        action: 'create',
        shopDomain: SHOP_DOMAIN,
        productId: input.productId,
        name: input.name,
        email: input.email,
        rating: input.rating,
        title: input.title,
        reviewBody: input.reviewBody,
      });

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
