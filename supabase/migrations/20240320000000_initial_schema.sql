-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own profile." 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  category TEXT,
  image_url TEXT,
  location TEXT,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL
);

-- Enable RLS for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone." 
  ON public.products FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert products." 
  ON public.products FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products." 
  ON public.products FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own products." 
  ON public.products FOR DELETE 
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_user_id ON public.products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();