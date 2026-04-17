import React from 'react';
import { Search, Plus, ShoppingBag, User, LogOut, Languages, LayoutGrid, Store } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion } from 'framer-motion';
import { translations } from '../translations';
import { Language, View, Mode } from '../types';
import { supabase } from '../lib/supabase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';

interface NavbarProps {
  onNavigate: (view: View) => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  user: any;
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onNavigate, 
  lang, 
  onLanguageChange, 
  user,
  mode,
  onModeChange
}) => {
  const t = translations[lang];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onNavigate('home');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 max-w-7xl">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => {
            onNavigate('home');
            onModeChange('buyer');
          }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white shadow-md shadow-orange-100 transition-transform group-hover:scale-110">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-orange-600 hidden xs:block">Daily Thrift</span>
        </div>

        <div className="hidden flex-1 px-8 md:flex max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t.search}
              className="w-full pl-10 focus-visible:ring-orange-500 border-slate-200 bg-slate-50/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Switcher Desktop */}
          <div className="hidden md:flex bg-slate-100 p-1 rounded-full">
            <button 
              onClick={() => onModeChange('buyer')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mode === 'buyer' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {t.buyer_mode}
            </button>
            <button 
              onClick={() => onModeChange('seller')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mode === 'seller' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {t.seller_mode}
            </button>
          </div>

          {/* Always Visible "Post an Item" Button for Desktop */}
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="hidden sm:block"
          >
            <Button 
              onClick={() => onNavigate('post')}
              className="bg-orange-500 hover:bg-orange-600 text-white gap-2 font-bold px-6 h-10 rounded-full shadow-lg shadow-orange-200"
            >
              <Plus className="h-5 w-5" />
              {t.post_an_item}
            </Button>
          </motion.div>

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-600 hover:bg-orange-50 rounded-full">
                <Languages className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem onClick={() => onLanguageChange('en')} className="cursor-pointer">
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onLanguageChange('am')} className="cursor-pointer">
                አማርኛ (Amharic)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                <div className="px-2 py-1.5 md:hidden">
                   <p className="text-xs font-bold text-slate-400 uppercase px-2 mb-1">Marketplace Mode</p>
                   <div className="flex flex-col gap-1">
                      <DropdownMenuItem onClick={() => onModeChange('buyer')} className="cursor-pointer">
                        <LayoutGrid className="mr-2 h-4 w-4" />
                        <span>{t.buyer_mode}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onModeChange('seller')} className="cursor-pointer">
                        <Store className="mr-2 h-4 w-4" />
                        <span>{t.seller_mode}</span>
                      </DropdownMenuItem>
                   </div>
                   <DropdownMenuSeparator />
                </div>
                
                <DropdownMenuItem onClick={() => onNavigate('my-items')} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4 text-orange-500" />
                  <span>{t.my_items}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer font-medium">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t.logout}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="outline"
              onClick={() => onNavigate('auth')}
              className="border-orange-500 text-orange-600 hover:bg-orange-50 font-bold rounded-full px-5"
            >
              {t.login}
            </Button>
          )}
        </div>
      </div>
      
      {/* Search for Mobile */}
      <div className="px-4 pb-3 md:hidden">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t.search}
            className="w-full pl-10 focus-visible:ring-orange-500 bg-slate-100/50 border-none rounded-xl"
          />
        </div>
      </div>
    </nav>
  );
};