import React from 'react';
import { CATEGORIES } from '../data';
import { motion, Variants } from 'framer-motion';
import { translations } from '../translations';
import { Language } from '../types';

interface CategoryListProps {
  lang: Language;
  onCategorySelect: (id: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({ lang, onCategorySelect }) => {
  const t = translations[lang];
  
  const getCategoryName = (id: string) => {
    switch (id) {
      case 'electronics': return t.electronics;
      case 'clothing': return t.clothing;
      case 'home': return t.home_category;
      case 'books': return t.books;
      case 'toys': return t.toys;
      case 'beauty': return t.beauty;
      case 'sports': return t.sports;
      default: return id;
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.browse_categories}
          </h2>
        </div>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4"
      >
        {CATEGORIES.map((cat) => (
          <motion.div
            key={cat.id}
            variants={itemVariants}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategorySelect(cat.id)}
            className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <img 
              src={cat.image} 
              alt={cat.name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300" />
            
            <div className="absolute inset-0 p-2 flex flex-col justify-end">
              <span className="text-white font-bold text-xs md:text-sm leading-tight text-center">
                {getCategoryName(cat.id)}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};