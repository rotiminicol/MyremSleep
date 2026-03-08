
-- Create user_carts table for server-side cart persistence
CREATE TABLE public.user_carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  cart_id text,
  checkout_url text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.user_carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own cart" ON public.user_carts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cart" ON public.user_carts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cart" ON public.user_carts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cart" ON public.user_carts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Add preferred_currency to profiles
ALTER TABLE public.profiles ADD COLUMN preferred_currency text DEFAULT 'GBP';
