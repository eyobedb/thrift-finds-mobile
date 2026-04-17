import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = 'https://ctykjpcrfsstaxprfrqg.supabase.co';
const supabaseAnonKey = 'sb_publishable_1L2EwR0Jigl5ngcKm-KRlA_9ltODhM1';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const fetchRecommendedProducts = async (limit = 12) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .limit(limit)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching recommended products:', error);
    throw error;
  }

  return data || [];
};

export const updateProductPrice = async (id: string, price: number) => {
  const { data, error } = await supabase
    .from('products')
    .update({ price })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating product price:', error);
    throw error;
  }

  return data;
};

export const updateProduct = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }

  return data;
};