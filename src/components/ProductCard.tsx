import React from 'react';
import { Product, Language } from '../types';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { translations } from '../translations';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  lang: Language;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, lang }) => {
  const t = translations[lang];
  return (
    <motion.div
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="cursor-pointer"
      onClick={() => onClick(product)}
    >
      <Card className="overflow-hidden border-none shadow-md bg-white">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400'}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          <Badge className="absolute top-2 right-2 bg-white/90 text-orange-600 border-none shadow-sm hover:bg-white">
            {product.category}
          </Badge>
        </div>
        <div className="p-3">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-slate-800 line-clamp-1">{product.title}</h3>
          </div>
          <p className="text-lg font-bold text-orange-600">
            {product.price.toLocaleString()} {t.currency}
          </p>
          <div className="flex items-center gap-1 mt-2 text-slate-500">
            <MapPin className="h-3 w-3" />
            <span className="text-xs">{product.location}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};