-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS for the storage bucket
-- Allow public access to read files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated'
);

-- Allow users to update/delete their own files
CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images' AND
  auth.uid() = owner
);

CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' AND
  auth.uid() = owner
);

-- Update products table to support multiple images
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Migration: If image_url exists, put it into images array (if we had data)
-- UPDATE public.products SET images = ARRAY[image_url] WHERE image_url IS NOT NULL AND (images IS NULL OR array_length(images, 1) IS NULL);