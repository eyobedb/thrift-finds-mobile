import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CategoryList } from './components/CategoryList';
import { ProductCard } from './components/ProductCard';
import { ProductDetail } from './components/ProductDetail';
import { PostItemForm } from './components/PostItemForm';
import { RecommendedItems } from './components/RecommendedItems';
import { Auth } from './components/Auth';
import { Product, View, Language, Mode } from './types';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from './lib/supabase';
import { translations } from './translations';
import { Loader2, Plus, ChevronLeft, Store, LayoutGrid } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [mode, setMode] = useState<Mode>('buyer');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  const t = translations[lang];

  useEffect(() => {
    // Check session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (currentView === 'home' || currentView === 'my-items') {
      fetchProducts();
    }
  }, [currentView, user, selectedCategory, mode]);

  const fetchProducts = async () => {
    let query = supabase.from('products').select('*');
    
    if (mode === 'seller' || currentView === 'my-items') {
        if (!user) return;
        query = query.eq('user_id', user.id);
    } else if (currentView === 'home' && selectedCategory) {
      // Using ilike for category match
      query = query.ilike('category', selectedCategory);
    } else if (currentView === 'home' && !selectedCategory) {
      // Show all or recommended on main home
      query = query.limit(12);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
  };

  // Restore scroll on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView, selectedProduct, selectedCategory]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('detail');
  };

  const handleEditProduct = (product: Product) => {
      setSelectedProduct(product);
      setCurrentView('post');
  };

  const handlePostSuccess = () => {
    if (mode === 'seller') {
        setCurrentView('home');
    } else {
        setCurrentView('home');
        setSelectedCategory(null);
    }
    setSelectedProduct(null);
    fetchProducts();
  };

  const navigateTo = (view: View) => {
    if (view === 'post' && !user) {
        setCurrentView('auth');
        return;
    }
    setCurrentView(view);
    if (view === 'home' || view === 'my-items' || view === 'recommended') {
      setSelectedProduct(null);
      if (view !== 'home') setSelectedCategory(null);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentView('home');
  };

  const getCategoryTitle = (id: string) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 selection:bg-orange-100 selection:text-orange-900 pb-16 md:pb-0">
      <Navbar 
        onNavigate={navigateTo} 
        lang={lang} 
        onLanguageChange={setLang} 
        user={user} 
        mode={mode}
        onModeChange={(newMode) => {
            setMode(newMode);
            setCurrentView('home');
        }}
      />
      
      <main className="container mx-auto max-w-7xl">
        <AnimatePresence mode="wait">
          {(currentView === 'home' || currentView === 'my-items') && (
            <motion.div
              key={`${currentView}-${selectedCategory}-${mode}`}
              initial={{ opacity: 0, x: selectedCategory ? 20 : 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {currentView === 'home' && !selectedCategory && mode === 'buyer' && (
                <div className="px-4 pt-6">
                  <div className="relative overflow-hidden rounded-2xl bg-orange-500 p-8 md:p-12 text-white">
                    <div className="relative z-10 max-w-full">
                      <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight">
                        {t.find_gems}
                      </h2>
                      <p className="text-orange-50 text-lg opacity-90 mb-6">
                        {t.fastest_way}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigateTo('post')}
                        className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-orange-50 transition-colors cursor-pointer"
                      >
                        {t.start_selling}
                      </motion.button>
                    </div>
                    <div className="absolute right-[-10%] top-[-20%] h-64 w-64 rounded-full bg-orange-400 opacity-20 blur-3xl md:block hidden" />
                    <div className="absolute left-[60%] bottom-[-30%] h-80 w-80 rounded-full bg-orange-600 opacity-30 blur-3xl md:block hidden" />
                  </div>
                </div>
              )}

              {currentView === 'home' && !selectedCategory && mode === 'seller' && (
                <div className="px-4 pt-6">
                  <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-8 md:p-12 text-white">
                    <div className="relative z-10">
                      <h2 className="text-2xl md:text-4xl font-extrabold mb-2">{t.seller_mode}</h2>
                      <p className="text-slate-400 mb-6">Manage your listings and track your sales in one place.</p>
                      <Button 
                        onClick={() => navigateTo('post')}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 px-8 rounded-xl"
                      >
                        <Plus className="mr-2 h-5 w-5" />
                        {t.post_an_item}
                      </Button>
                    </div>
                    <Store className="absolute right-8 top-1/2 -translate-y-1/2 h-32 w-32 text-white opacity-5 hidden md:block" />
                  </div>
                </div>
              )}

              {currentView === 'home' && !selectedCategory && mode === 'buyer' && (
                <CategoryList 
                  lang={lang} 
                  onCategorySelect={handleCategoryClick}
                />
              )}

              <div className="px-4 pb-12">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex flex-col gap-1">
                    {selectedCategory && (
                      <button 
                        onClick={() => setSelectedCategory(null)}
                        className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-orange-600 transition-colors mb-2 group"
                      >
                        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        {t.back_to_home}
                      </button>
                    )}
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                        {mode === 'seller' 
                          ? t.my_items 
                          : selectedCategory 
                            ? getCategoryTitle(selectedCategory)
                            : t.recommended}
                      </h2>
                      {mode === 'seller' && (
                          <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">
                            {products.length} Items
                          </span>
                      )}
                    </div>
                  </div>
                  {currentView === 'home' && !selectedCategory && mode === 'buyer' && (
                    <button 
                      onClick={() => navigateTo('recommended')}
                      className="text-orange-600 font-semibold hover:underline cursor-pointer"
                    >
                      {t.see_all}
                    </button>
                  )}
                </div>
                
                {products.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onClick={handleProductClick}
                        lang={lang}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 mx-4">
                    <div className="flex justify-center mb-4">
                       <div className="bg-slate-50 p-4 rounded-full">
                          {mode === 'seller' ? <Store className="h-8 w-8 text-slate-300" /> : <Loader2 className="h-8 w-8 text-slate-300" />}
                       </div>
                    </div>
                    <p className="text-slate-500 font-medium">{mode === 'seller' ? "You haven't posted any items yet." : t.no_items}</p>
                    {mode === 'seller' ? (
                        <Button 
                            onClick={() => navigateTo('post')}
                            className="mt-4 bg-orange-500 text-white font-bold"
                        >
                            Post Your First Item
                        </Button>
                    ) : (
                        <button 
                           onClick={() => setSelectedCategory(null)}
                           className="mt-4 text-orange-600 font-semibold cursor-pointer"
                        >
                          View all products
                        </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {currentView === 'recommended' && (
            <RecommendedItems
              key="recommended"
              lang={lang}
              onBack={() => setCurrentView('home')}
              onProductClick={handleProductClick}
            />
          )}

          {currentView === 'detail' && selectedProduct && (
            <ProductDetail
              key="detail"
              product={selectedProduct}
              onBack={() => setSelectedProduct(null)}
              lang={lang}
              mode={mode}
              isOwner={user?.id === selectedProduct.user_id}
              onEdit={handleEditProduct}
            />
          )}

          {currentView === 'post' && (
            <PostItemForm
              key="post"
              onBack={() => {
                  setCurrentView('home');
                  setSelectedProduct(null);
              }}
              onSubmit={handlePostSuccess}
              lang={lang}
              user={user}
              initialProduct={selectedProduct}
            />
          )}

          {currentView === 'auth' && (
            <Auth 
              key="auth" 
              onSuccess={() => setCurrentView('home')} 
              lang={lang}
            />
          )}
        </AnimatePresence>
      </main>

      <Toaster position="top-center" expand={false} richColors />
      
      <footer className="mt-20 border-t bg-white py-12 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
            <span className="font-bold">DT</span>
          </div>
          <span className="text-lg font-bold text-orange-600">Daily Thrift</span>
        </div>
        <p className="text-slate-500 text-sm">&copy; 2024 Daily Thrift Marketplace. All rights reserved.</p>
      </footer>

      {/* Mobile Sticky Post Button */}
      {!isLoading && currentView !== 'post' && currentView !== 'auth' && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 right-6 md:hidden z-50"
        >
          <button
            onClick={() => navigateTo('post')}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-2xl active:scale-95 transition-transform cursor-pointer"
          >
            <Plus className="h-8 w-8" />
          </button>
        </motion.div>
      )}

      {/* Mobile Bottom Navigation for Mode Switching */}
      {!isLoading && (currentView === 'home' || currentView === 'my-items') && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2 md:hidden z-40">
              <button 
                onClick={() => setMode('buyer')}
                className={`flex flex-col items-center gap-1 p-2 flex-1 rounded-xl transition-colors ${mode === 'buyer' ? 'text-orange-600 bg-orange-50' : 'text-slate-400'}`}
              >
                  <LayoutGrid className="h-5 w-5" />
                  <span className="text-[10px] font-bold">{t.buyer_mode}</span>
              </button>
              <button 
                onClick={() => setMode('seller')}
                className={`flex flex-col items-center gap-1 p-2 flex-1 rounded-xl transition-colors ${mode === 'seller' ? 'text-orange-600 bg-orange-50' : 'text-slate-400'}`}
              >
                  <Store className="h-5 w-5" />
                  <span className="text-[10px] font-bold">{t.seller_mode}</span>
              </button>
          </div>
      )}
    </div>
  );
}

export default App;