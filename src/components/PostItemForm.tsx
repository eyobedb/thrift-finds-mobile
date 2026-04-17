import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, Loader2, CheckCircle2, X, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { translations } from '../translations';
import { Language, Product } from '../types';
import { CATEGORIES } from '../data';

interface PostItemFormProps {
  onBack: () => void;
  onSubmit: () => void;
  lang: Language;
  user: any;
  initialProduct?: Product | null;
}

export const PostItemForm: React.FC<PostItemFormProps> = ({ 
  onBack, 
  onSubmit, 
  lang, 
  user,
  initialProduct 
}) => {
  const t = translations[lang];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialProduct?.images || []);
  const [price, setPrice] = useState<string>(initialProduct?.price.toString() || '');
  const [sellerPhone, setSellerPhone] = useState<string>(initialProduct?.seller_phone || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialProduct) {
      setPrice(initialProduct.price.toString());
      setSellerPhone(initialProduct.seller_phone || '');
      setPreviewUrls(initialProduct.images || [initialProduct.image_url].filter(Boolean) as string[]);
    }
  }, [initialProduct]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newFiles = [...imageFiles, ...files].slice(0, 8); // Limit to 8 photos
      setImageFiles(newFiles);
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviews].slice(0, 8));
    }
    // Reset input so the same file can be selected again if removed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    // If it's a file being uploaded
    const isNewFile = index >= (initialProduct?.images?.length || 0);
    
    if (isNewFile) {
        const fileIndex = index - (initialProduct?.images?.length || 0);
        const newFiles = [...imageFiles];
        newFiles.splice(fileIndex, 1);
        setImageFiles(newFiles);
    }

    const newPreviews = [...previewUrls];
    if (newPreviews[index].startsWith('blob:')) {
        URL.revokeObjectURL(newPreviews[index]);
    }
    newPreviews.splice(index, 1);
    setPreviewUrls(newPreviews);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get('title') as string;
    const itemPrice = Number(price);
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const location = formData.get('location') as string;
    
    if (!title || !itemPrice || !category || !sellerPhone) {
        toast.error("Please fill in all required fields");
        return;
    }

    if (previewUrls.length === 0) {
      toast.error("Please select at least one image for your item");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const uploadedUrls: string[] = [...previewUrls.filter(url => !url.startsWith('blob:'))];

      // Upload each NEW image to Supabase Storage
      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `products/${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
        
        uploadedUrls.push(publicUrl);
      }

      const productData = {
        title,
        price: itemPrice,
        description,
        category,
        location,
        seller_phone: sellerPhone,
        image_url: uploadedUrls[0],
        images: uploadedUrls,
      };

      if (initialProduct) {
          // Update existing product
          const { error } = await supabase.from('products').update(productData).eq('id', initialProduct.id);
          if (error) throw error;
          toast.success(t.successfully_updated);
      } else {
          // Insert product record
          const { error } = await supabase.from('products').insert({
            ...productData,
            user_id: user.id,
          });
          if (error) throw error;
          toast.success(t.successfully_posted);
      }

      setIsSuccess(true);
      
      setTimeout(() => {
          onSubmit();
      }, 2000);
    } catch (error: any) {
      console.error('Operation error:', error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8 max-w-2xl"
    >
      <div className="mb-8 flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-orange-50">
          <ArrowLeft className="h-6 w-6 text-slate-600" />
        </Button>
        <h1 className="text-2xl font-bold text-slate-900">{initialProduct ? t.edit_item : t.post_an_item}</h1>
      </div>

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-12 rounded-2xl shadow-xl border border-orange-100 flex flex-col items-center text-center space-y-4"
          >
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{initialProduct ? t.successfully_updated : t.successfully_posted}</h2>
            <p className="text-slate-500">{t.item_live}</p>
            <Loader2 className="h-6 w-6 animate-spin text-orange-500 mt-4" />
          </motion.div>
        ) : (
          <motion.form 
            key="form"
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleSubmit} 
            className="space-y-6 bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-orange-50"
          >
            <div className="space-y-4">
              <Label className="text-slate-700 font-semibold block">Photos (At least 4 recommended)</Label>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-100 shadow-sm">
                    <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-orange-500 text-white text-[10px] font-bold text-center py-0.5 uppercase tracking-wider">
                        Main Photo
                      </div>
                    )}
                  </div>
                ))}
                
                {previewUrls.length < 8 && (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1 bg-slate-50 hover:bg-orange-50 hover:border-orange-200 transition-colors cursor-pointer"
                  >
                    <Plus className="h-6 w-6 text-slate-400" />
                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter">Add Photo</span>
                  </div>
                )}
              </div>

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                multiple
                className="hidden"
              />

              <div className="grid gap-2">
                <Label htmlFor="title" className="text-slate-700 font-semibold">{t.title}</Label>
                <Input 
                  id="title" 
                  name="title" 
                  defaultValue={initialProduct?.title}
                  placeholder="What are you selling?" 
                  className="h-12 border-slate-200 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price" className="text-slate-700 font-semibold">{t.price} ({t.currency})</Label>
                  <Input 
                    id="price" 
                    name="price" 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00" 
                    step="0.01"
                    className="h-12 border-slate-200 focus:ring-orange-500"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category" className="text-slate-700 font-semibold">{t.category}</Label>
                  <Select name="category" required defaultValue={initialProduct?.category || "electronics"}>
                    <SelectTrigger className="h-12 border-slate-200 focus:ring-orange-500">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {getCategoryName(cat.id)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="seller_phone" className="text-slate-700 font-semibold">{t.seller_phone}</Label>
                <Input 
                  id="seller_phone" 
                  name="seller_phone" 
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  placeholder={t.seller_phone_placeholder} 
                  className="h-12 border-slate-200 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description" className="text-slate-700 font-semibold">{t.description}</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  defaultValue={initialProduct?.description || ""}
                  placeholder="Tell us about the item's condition and features..." 
                  className="min-h-[120px] border-slate-200 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location" className="text-slate-700 font-semibold">{t.location}</Label>
                <Input 
                  id="location" 
                  name="location" 
                  defaultValue={initialProduct?.location || ""}
                  placeholder="e.g. Bole, Addis Ababa" 
                  className="h-12 border-slate-200 focus:ring-orange-500"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white h-14 text-lg font-bold rounded-xl shadow-lg shadow-orange-100 mt-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {initialProduct ? 'Updating...' : 'Posting...'}
                </>
              ) : (initialProduct ? t.update_item : t.post_your_item)}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
};