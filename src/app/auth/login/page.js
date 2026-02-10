"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LayoutDashboard, Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        alert("Erreur de connexion : " + error.message);
      } else {
        // --- CRUCIAL POUR LE MIDDLEWARE ---
        // Force Next.js à rafraîchir les données de la page actuelle 
        // pour envoyer les nouveaux cookies au serveur
        router.refresh(); 
        
        // Redirection vers le dashboard
        router.push('/dashboard');
      }
    } catch (err) {
      alert("Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-[family-name:var(--font-lexend)] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 text-2xl font-black tracking-tighter text-[#00D9FF] mb-12 justify-center">
          <LayoutDashboard size={32} />
          <span>RestoPay Luxe</span>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 p-10 rounded-[45px] shadow-2xl">
          <h2 className="text-3xl font-black italic tracking-tighter mb-2">BON RETOUR</h2>
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 mb-8 font-bold text-[#00D9FF]">Accédez à votre console de gestion</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-[9px] uppercase font-black opacity-30 ml-4 tracking-widest">Email</label>
              <div className="relative mt-2">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 opacity-20" size={18} />
                <input 
                  required 
                  type="email" 
                  placeholder="manager@votre-resto.com"
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="w-full bg-white/5 border border-white/10 px-12 py-4 rounded-2xl outline-none focus:border-[#00D9FF] transition-all font-bold placeholder:text-white/10" 
                />
              </div>
            </div>

            <div>
              <label className="text-[9px] uppercase font-black opacity-30 ml-4 tracking-widest">Mot de passe</label>
              <div className="relative mt-2">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 opacity-20" size={18} />
                <input 
                  required 
                  type="password" 
                  placeholder="••••••••"
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full bg-white/5 border border-white/10 px-12 py-4 rounded-2xl outline-none focus:border-[#00D9FF] transition-all font-bold placeholder:text-white/10" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-5 bg-[#00D9FF] text-black font-black rounded-2xl shadow-lg uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Vérification...</span>
                </>
              ) : (
                <>
                  <span>OUVRIR LA SESSION</span>
                  <LogIn size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] font-bold opacity-30">
            PAS ENCORE DE COMPTE ? <Link href="/auth/signup" className="text-[#00D9FF] hover:underline hover:text-cyan-300 transition-colors">CRÉER MON RESTAURANT</Link>
          </p>
        </div>
      </div>
    </div>
  );
}