import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { translations } from '../translations';
import { Language } from '../types';

interface AuthProps {
  onSuccess: () => void;
  lang: Language;
}

export const Auth: React.FC<AuthProps> = ({ onSuccess, lang }) => {
  const t = translations[lang];
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success(t.welcome);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        toast.success("Check your email for confirmation!");
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-orange-50"
      >
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-200">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {isLogin ? t.login : t.signup}
          </h2>
          <p className="text-slate-500">{t.auth_subtitle}</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="fullName">{t.full_name}</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required={!isLogin}
                className="h-12"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">{t.email}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t.password}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="h-12"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-100 mt-2"
          >
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : isLogin ? t.login : t.signup}
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-semibold text-orange-600 hover:underline"
          >
            {isLogin ? t.dont_have_account : t.already_have_account}
          </button>
        </div>
      </motion.div>
    </div>
  );
};