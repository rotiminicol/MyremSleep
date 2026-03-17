import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
  product_handle?: string;
  product_title?: string;
  product_external_id?: number;
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

// Fetch all reviews for the shop (Judge.me Index doesn't support handle filtering)
export function useProductReviews(_productHandle: string, page: number = 1, perPage: number = 10) {
  return useQuery({
    queryKey: ['reviews', page, perPage],
    queryFn: async (): Promise<ReviewsResponse> => {
      try {
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
      } catch {
        return {
          reviews: [],
          current_page: page,
          total_count: 0,
          per_page: perPage,
        };
      }
    },
    retry: 1,
    staleTime: 2 * 60 * 1000,
  });
}

// Fetch all reviews (for store page hero slider etc.)
export function useAllReviews(page: number = 1, perPage: number = 20) {
  return useQuery({
    queryKey: ['all-reviews', page, perPage],
    queryFn: async (): Promise<ReviewsResponse> => {
      try {
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
      } catch {
        return {
          reviews: [],
          current_page: page,
          total_count: 0,
          per_page: perPage,
        };
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
}

interface CreateReviewInput {
  name: string;
  rating: number;
  title: string;
  reviewBody: string;
  productId: string;
  productHandle?: string;
  email?: string;
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateReviewInput) => {
      if (!input.email) {
        throw new Error('Email is required to submit a review');
      }

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
      queryClient.invalidateQueries({ queryKey: ['all-reviews'] });
    },
  });
}
