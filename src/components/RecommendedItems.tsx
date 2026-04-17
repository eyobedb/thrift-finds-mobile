import React, { useEffect, useState } from 'react';
import { Product, Language } from '../types';
import { ProductCard } from './ProductCard';
import { fetchRecommendedProducts } from '../lib/supabase';
import { translations } from '../translations';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

interface RecommendedItemsProps {
  onBack: () => void;
  onProductClick: (product: Product) => void;
  lang: Language;
}

export const RecommendedItems: React.FC<RecommendedItemsProps> = ({ 
  onBack, 
  onProductClick, 
  lang 
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const t = translations[lang];

  useEffect(() => {
    const loadRecommended = async () => {
      try {
        setIsLoading(true);
        const data = await fetchRecommendedProducts(20);
        setProducts(data);
      } catch (error) {
        console.error('Failed to load recommended items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommended();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500 mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">{t.recommended}...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-4 pb-12"
    >
      <div className="flex items-center gap-2 mb-8">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-orange-50">
          <ArrowLeft className="h-6 w-6 text-slate-600" />
        </Button>
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-orange-500 fill-orange-500" />
          <h1 className="text-3xl font-bold text-slate-900">{t.recommended}</h1>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard
                product={product}
                onClick={onProductClick}
                lang={lang}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
          <div className="bg-orange-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-8 w-8 text-orange-300" />
          </div>
          <p className="text-slate-500 text-lg font-medium">{t.no_items}</p>
          <Button 
            variant="link" 
            onClick={onBack}
            className="text-orange-600 font-semibold mt-2"
          >
            {t.back_to_home}
          </Button>
        </div>
      )}
    </motion.div>
  );
};