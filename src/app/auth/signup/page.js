"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LayoutDashboard, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', restoName: '' });
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Inscription avec métadonnées pour le Trigger SQL
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { 
            restaurant_name: formData.restoName 
          }
        }
      });

      if (error) {
        alert("Erreur d'inscription : " + error.message);
      } else {
        // 2. Si l'inscription réussit, on vérifie si une session est déjà active 
        // (dépend de la config "Confirm Email" dans Supabase)
        if (data?.session) {
          router.refresh();
          router.push('/dashboard');
        } else {
          alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
          router.push('/auth/login');
        }
      }
    } catch (err) {
      alert("Une erreur est survenue lors de la création du compte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-[family-name:var(--font-lexend)] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 text-2xl font-black tracking-tighter text-[#00D9FF] mb-12 justify-center">
          <LayoutDashboard size={32} />
          <span>RestoPay SaaS</span>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 p-10 rounded-[45px] shadow-2xl">
          <h2 className="text-3xl font-black italic tracking-tighter mb-2">CRÉER UN COMPTE</h2>
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 mb-8 font-bold text-[#00D9FF]">Lancez votre restaurant sur le cloud</p>

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="text-[9px] uppercase font-black opacity-30 ml-4 tracking-widest">Nom du Restaurant</label>
              <div className="relative mt-2">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 opacity-20" size={18} />
                <input 
                  required 
                  type="text" 
                  placeholder="ex: Le Grill du Plateau" 
                  value={formData.restoName} 
                  onChange={e => setFormData({...formData, restoName: e.target.value})} 
                  className="w-full bg-white/5 border border-white/10 px-12 py-4 rounded-2xl outline-none focus:border-[#00D9FF] transition-all font-bold placeholder:text-white/5" 
                />
              </div>
            </div>

            <div>
              <label className="text-[9px] uppercase font-black opacity-30 ml-4 tracking-widest">Email Professionnel</label>
              <div className="relative mt-2">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 opacity-20" size={18} />
                <input 
                  required 
                  type="email" 
                  placeholder="contact@votre-resto.com" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  className="w-full bg-white/5 border border-white/10 px-12 py-4 rounded-2xl outline-none focus:border-[#00D9FF] transition-all font-bold placeholder:text-white/5" 
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
                  placeholder="Min. 6 caractères" 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  className="w-full bg-white/5 border border-white/10 px-12 py-4 rounded-2xl outline-none focus:border-[#00D9FF] transition-all font-bold placeholder:text-white/5" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-5 bg-[#00D9FF] text-black font-black rounded-2xl shadow-lg uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <>DEVENIR PARTENAIRE <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] font-bold opacity-30">
            DÉJÀ MEMBRE ? <Link href="/auth/login" className="text-[#00D9FF] hover:underline">SE CONNECTER</Link>
          </p>
        </div>
      </div>
    </div>
  );
}