"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  ShieldCheck, Users, Store, TrendingUp, ArrowLeft, ArrowRight, 
  Loader2, CheckCircle2, XCircle, Power, AlertCircle, Clock
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MasterAdminPage() {
  const [mounted, setMounted] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [stats, setStats] = useState({ totalRestos: 0, totalSales: 0 });
  const [restaurants, setRestaurants] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    checkAdminAndFetchData();

    // Synchronisation en temps réel : si un resto s'inscrit, la liste s'actualise seule
    const channel = supabase.channel('master_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'restaurants' }, () => fetchData())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const checkAdminAndFetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.replace('/auth/login');

      const { data: profile } = await supabase
        .from('restaurants')
        .select('is_super_admin')
        .eq('id', user.id)
        .single();

      if (!profile?.is_super_admin) {
        return router.replace('/dashboard');
      }

      await fetchData();
      setAuthLoading(false);
    } catch (err) {
      router.replace('/dashboard');
    }
  };

  const fetchData = async () => {
    const [restosRes, transRes] = await Promise.all([
      supabase.from('restaurants').select('*').order('created_at', { ascending: false }),
      supabase.from('transactions').select('amount')
    ]);

    const totalCA = transRes.data?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0;

    setRestaurants(restosRes.data || []);
    setStats({
      totalRestos: restosRes.data?.length || 0,
      totalSales: totalCA
    });
  };

  const toggleStatus = async (restoId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('restaurants')
        .update({ is_active: !currentStatus })
        .eq('id', restoId);

      if (error) throw error;
      fetchData(); 
    } catch (err) {
      alert("Erreur technique lors de l'activation");
    }
  };

  // --- FILTRAGE DES DONNÉES ---
  const pendingRestos = restaurants.filter(r => !r.is_active);
  const activeRestos = restaurants.filter(r => r.is_active);

  if (!mounted) return null;
  if (authLoading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="animate-spin text-[#00D9FF]" size={40} /></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-[family-name:var(--font-lexend)] p-8">
      
      {/* HEADER MASTER */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <div className="text-left">
          <div className="flex items-center gap-3 text-[#00D9FF] mb-2 font-black uppercase tracking-widest text-[10px]">
            <ShieldCheck size={20} /> Master Control System
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">Gestion du SaaS</h1>
        </div>
        <Link href="/dashboard" className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold hover:bg-white/10 transition-all">
          <ArrowRight size={16} className="rotate-180" /> Retour Dashboard
        </Link>
      </div>

      {/* CARTES DE STATISTIQUES */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <StatCard label="Total Restaurants" value={stats.totalRestos} color="text-white" />
        <StatCard label="Chiffre d'Affaire Global" value={`${stats.totalSales.toLocaleString()} F`} color="text-green-500" />
        <StatCard label="En attente de validation" value={pendingRestos.length} color="text-orange-500" highlight={pendingRestos.length > 0} />
      </div>

      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* SECTION 1 : LES NOUVEAUX INSCRITS (VISIBLE UNIQUEMENT S'IL Y EN A) */}
        {pendingRestos.length > 0 && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-700">
            <h3 className="flex items-center gap-3 text-orange-500 font-black italic uppercase tracking-tighter mb-6 ml-4">
              <AlertCircle size={22} /> Alertes : Nouvelles inscriptions à valider
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingRestos.map(resto => (
                <div key={resto.id} className="bg-orange-500/5 border border-orange-500/20 p-6 rounded-[35px] flex justify-between items-center">
                  <div className="text-left">
                    <p className="font-black uppercase text-sm tracking-tight">{resto.name}</p>
                    <p className="text-[10px] opacity-50 font-bold">{resto.owner_email || 'Email inconnu'}</p>
                  </div>
                  <button 
                    onClick={() => toggleStatus(resto.id, false)}
                    className="bg-orange-500 text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                  >
                    Activer l'accès
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2 : LISTE COMPLÈTE DU PORTEFEUILLE */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[45px] overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-left">Portefeuille Clients</h3>
            <span className="text-[9px] font-bold opacity-30 uppercase tracking-[0.2em]">Flux en temps réel</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.02]">
                  <th className="px-8 py-5 text-[10px] uppercase font-black opacity-30 text-left">Restaurant</th>
                  <th className="px-8 py-5 text-[10px] uppercase font-black opacity-30 text-left">Statut</th>
                  <th className="px-8 py-5 text-[10px] uppercase font-black opacity-30 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {activeRestos.map((resto) => (
                  <tr key={resto.id} className="group hover:bg-white/[0.01]">
                    <td className="px-8 py-6 text-left">
                      <p className="font-black text-sm uppercase">{resto.name}</p>
                      <p className="text-[10px] opacity-40">{resto.owner_email}</p>
                    </td>
                    <td className="px-8 py-6 text-left">
                      <span className="flex items-center gap-2 text-[9px] font-black uppercase text-green-500 tracking-widest">
                        <CheckCircle2 size={14} /> Compte Actif
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => toggleStatus(resto.id, true)}
                        className="text-red-500 bg-red-500/10 border border-red-500/20 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                      >
                        Suspendre
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, highlight }) {
  return (
    <div className={`p-8 bg-[#0a0a0a] border ${highlight ? 'border-orange-500/50' : 'border-white/5'} rounded-[40px] text-left transition-all`}>
      <p className="text-[10px] uppercase font-black opacity-30 tracking-widest mb-1">{label}</p>
      <p className={`text-3xl font-black italic tracking-tighter ${color}`}>{value}</p>
    </div>
  );
}