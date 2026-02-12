"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, Users, Store, TrendingUp, ArrowLeft, Loader2, Search, CheckCircle2, XCircle, Power } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MasterAdminPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalRestos: 0, totalSales: 0, totalOrders: 0 });
  const [restaurants, setRestaurants] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    checkAdminAndFetchData();

    // Ecoute en temps réel pour synchroniser les activations/désactivations
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
    } catch (err) {
      console.error("Erreur Master Admin:", err);
      router.replace('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    const [restosRes, transRes, ordersRes] = await Promise.all([
      supabase.from('restaurants').select('*').order('created_at', { ascending: false }),
      supabase.from('transactions').select('amount'),
      supabase.from('orders').select('id', { count: 'exact' })
    ]);

    const totalCA = transRes.data?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0;

    setRestaurants(restosRes.data || []);
    setStats({
      totalRestos: restosRes.data?.length || 0,
      totalSales: totalCA,
      totalOrders: ordersRes.count || 0
    });
  };

  const toggleStatus = async (restoId, currentStatus) => {
    try {
      // Optimisme UI : on change l'état localement avant le retour serveur pour plus de fluidité
      const { error } = await supabase
        .from('restaurants')
        .update({ is_active: !currentStatus })
        .eq('id', restoId);

      if (error) throw error;
      fetchData(); // Rafraîchissement complet
    } catch (err) {
      alert("Erreur lors de la modification du statut");
    }
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#00D9FF] mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic text-left">Accès sécurisé Master...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-[family-name:var(--font-lexend)] p-8">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 text-left">
        <div className="text-left">
          <div className="flex items-center gap-3 text-[#00D9FF] mb-2 text-left">
            <ShieldCheck size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Master Control Center</span>
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter text-left uppercase">Supervision SaaS</h1>
        </div>
        <Link href="/dashboard" className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-bold">
          <ArrowLeft size={18} /> Retour Dashboard
        </Link>
      </div>

      {/* STATS GLOBALES */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <StatCard label="Total Restaurants" value={stats.totalRestos} icon={<Store className="text-purple-500" />} />
        <StatCard label="Volume d'Affaires Global" value={`${stats.totalSales.toLocaleString()} F`} icon={<TrendingUp className="text-green-500" />} />
        <StatCard label="Ventes cumulées" value={stats.totalOrders} icon={<Users className="text-[#00D9FF]" />} />
      </div>

      {/* TABLEAU DES CLIENTS */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[45px] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h3 className="text-xl font-black italic tracking-tighter uppercase">Portefeuille Clients</h3>
            <div className="flex items-center gap-2 text-[10px] font-bold opacity-40 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Synchronisation Live
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02]">
                  <th className="px-8 py-5 text-[10px] uppercase font-black opacity-30">Restaurant / Gérant</th>
                  <th className="px-8 py-5 text-[10px] uppercase font-black opacity-30">Localisation</th>
                  <th className="px-8 py-5 text-[10px] uppercase font-black opacity-30">État du Compte</th>
                  <th className="px-8 py-5 text-[10px] uppercase font-black opacity-30 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {restaurants.length === 0 ? (
                  <tr><td colSpan="4" className="px-8 py-20 text-center opacity-20 italic">Aucun restaurant enregistré</td></tr>
                ) : (
                  restaurants.map((resto) => (
                    <tr key={resto.id} className="group hover:bg-white/[0.01] transition-colors">
                      <td className="px-8 py-6 text-left">
                        <p className="font-black text-sm uppercase tracking-tight">{resto.name}</p>
                        <p className="text-[10px] opacity-40 font-bold">{resto.owner_email || 'Email non fourni'}</p>
                      </td>
                      <td className="px-8 py-6 opacity-60 text-sm font-medium italic text-left">
                        {resto.location || "Non renseignée"}
                      </td>
                      <td className="px-8 py-6 text-left">
                        <span className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] ${resto.is_active ? 'text-green-500' : 'text-red-500'}`}>
                          {resto.is_active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                          {resto.is_active ? 'Compte Actif' : 'En Attente / Suspendu'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => toggleStatus(resto.id, resto.is_active)}
                          className={`flex items-center gap-2 ml-auto px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg ${
                            resto.is_active 
                            ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white' 
                            : 'bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/20 hover:bg-[#00D9FF] hover:text-black shadow-[#00D9FF]/20'
                          }`}
                        >
                          <Power size={14} />
                          {resto.is_active ? 'Désactiver' : 'Activer maintenant'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="p-8 bg-[#0a0a0a] border border-white/5 rounded-[40px] shadow-xl text-left relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:scale-125 transition-transform duration-700">
        {icon}
      </div>
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-[#00D9FF]/10 transition-colors">
        {icon}
      </div>
      <p className="text-[10px] uppercase font-black opacity-40 tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-black italic tracking-tighter">{value}</p>
    </div>
  );
}