import React, { useState } from 'react';
import { ArrowLeft, User, MapPin, Phone, MessageCircle, ShieldCheck, ShoppingCart, Edit3, X, Loader2 } from 'lucide-react';
import { Product, Language, Mode } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { translations } from '../translations';
import { supabase } from '../lib/supabase';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  lang: Language;
  mode: Mode;
  isOwner?: boolean;
  onEdit?: (product: Product) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  onBack, 
  lang, 
  mode,
  isOwner,
  onEdit
}) => {
  const t = translations[lang];
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  
  const handleContact = () => {
    toast.success(`${t.contact_seller}!`, {
        description: `Subject: Inquiry about "${product.title}"`,
        icon: <MessageCircle className="h-4 w-4" />,
    });
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdering(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const buyerName = formData.get('buyer_name') as string;
    const buyerAddress = formData.get('buyer_address') as string;
    const buyerPhone = formData.get('buyer_phone') as string;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase.from('orders').insert({
        product_id: product.id,
        buyer_id: session?.user?.id || null,
        buyer_name: buyerName,
        buyer_address: buyerAddress,
        buyer_phone: buyerPhone,
      });

      if (error) throw error;

      toast.success(t.purchase_success, {
        description: t.purchase_desc,
        icon: <ShoppingCart className="h-4 w-4" />,
      });
      setShowBuyModal(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate order");
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="container mx-auto pb-20 max-w-5xl"
    >
      <div className="p-4 flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-orange-50 rounded-full">
          <ArrowLeft className="h-6 w-6 text-slate-600" />
        </Button>
        <span className="font-bold text-slate-700">{t.back_to_items}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 px-4 mt-2">
        {/* Image Section */}
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-white aspect-[4/5] md:aspect-square lg:aspect-auto lg:h-[600px] relative">
          <img 
            src={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400'} 
            alt={product.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
             <Badge className="bg-white/90 backdrop-blur-sm text-orange-600 hover:bg-white border-none px-4 py-1.5 font-bold shadow-lg">
               {product.category}
             </Badge>
          </div>
        </div>

        {/* Details Section */}
        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 leading-tight">{product.title}</h1>
            <div className="flex items-center gap-4 mb-4">
               <p className="text-4xl font-black text-orange-500">
                 {product.price.toLocaleString()} {t.currency}
               </p>
               <span className="bg-green-100 text-green-700 text-xs font-black px-2 py-1 rounded uppercase tracking-wider">
                 Available
               </span>
            </div>
          </div>
          
          <div className="space-y-8 flex-1">
            <div>
              <h3 className="text-lg font-bold mb-3 text-slate-800 uppercase tracking-wide flex items-center gap-2">
                {t.description}
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl space-y-4 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Private Seller</p>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {product.location}
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="rounded-full border-orange-200 text-orange-600 hover:bg-orange-50 font-bold">
                  View Profile
                </Button>
              </div>
              
              <div className="pt-4 border-t border-slate-50 flex items-center gap-2 text-green-600 text-sm font-medium">
                 <ShieldCheck className="h-4 w-4" />
                 Verified Daily Thrift Member
              </div>

              {product.seller_phone && (
                <div className="pt-4 border-t border-slate-50">
                  <p className="text-sm font-bold text-slate-500 uppercase mb-1">{t.seller_phone}</p>
                  <div className="flex items-center gap-2 text-xl font-black text-slate-900">
                    <Phone className="h-5 w-5 text-orange-500" />
                    <a href={`tel:${product.seller_phone}`} className="hover:text-orange-600 transition-colors">
                      {product.seller_phone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4">
            {mode === 'buyer' ? (
                <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        <Button 
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white h-16 text-xl font-black rounded-2xl shadow-xl shadow-orange-100 transition-all active:scale-[0.98]"
                          onClick={() => setShowBuyModal(true)}
                        >
                          <ShoppingCart className="mr-2 h-6 w-6" />
                          {t.buy_now}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 border-orange-500 text-orange-600 h-16 text-xl font-black rounded-2xl hover:bg-orange-50 transition-all"
                          onClick={handleContact}
                        >
                          {t.contact_seller}
                        </Button>
                    </div>
                    {product.seller_phone && (
                      <Button 
                        asChild
                        variant="outline" 
                        className="h-14 border-slate-200 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-black text-lg shadow-sm"
                      >
                        <a href={`tel:${product.seller_phone}`}>
                          <Phone className="mr-2 h-5 w-5 text-orange-500" />
                          {t.call_seller}
                        </a>
                      </Button>
                    )}
                </div>
            ) : isOwner && (
                <Button 
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white h-16 text-xl font-black rounded-2xl shadow-xl transition-all"
                  onClick={() => onEdit?.(product)}
                >
                  <Edit3 className="mr-2 h-6 w-6" />
                  {t.update_price} / {t.edit_item}
                </Button>
            )}
          </div>
          
          <p className="text-center mt-6 text-slate-400 text-xs">
            By using this platform, you agree to our Terms of Service.
          </p>
        </div>
      </div>

      {/* Buy Now Modal */}
      <AnimatePresence>
        {showBuyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBuyModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">{t.buyer_info}</h2>
                <button 
                  onClick={() => setShowBuyModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>
              
              <form onSubmit={handleOrderSubmit} className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="buyer_name" className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                    {t.buyer_name}
                  </Label>
                  <Input 
                    id="buyer_name" 
                    name="buyer_name" 
                    placeholder="Enter your full name" 
                    required 
                    className="h-12 border-slate-200 focus:ring-orange-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="buyer_phone" className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                    {t.buyer_phone}
                  </Label>
                  <Input 
                    id="buyer_phone" 
                    name="buyer_phone" 
                    placeholder="+251 ..." 
                    required 
                    className="h-12 border-slate-200 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buyer_address" className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                    {t.buyer_address}
                  </Label>
                  <Input 
                    id="buyer_address" 
                    name="buyer_address" 
                    placeholder="Where should we deliver?" 
                    required 
                    className="h-12 border-slate-200 focus:ring-orange-500"
                  />
                </div>

                <div className="pt-4">
                  <div className="flex items-center justify-between mb-4 p-4 bg-orange-50 rounded-2xl">
                    <span className="font-bold text-slate-700">{product.title}</span>
                    <span className="font-black text-orange-600">{product.price.toLocaleString()} {t.currency}</span>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isOrdering}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white h-14 text-lg font-bold rounded-xl shadow-lg shadow-orange-100"
                  >
                    {isOrdering ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : t.confirm_purchase}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};