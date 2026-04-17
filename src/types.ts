import { Database } from './types/supabase';

export type Product = Database['public']['Tables']['products']['Row'];
export type View = 'home' | 'detail' | 'post' | 'auth' | 'my-items' | 'recommended';
export type Language = 'en' | 'am';
export type Mode = 'buyer' | 'seller';