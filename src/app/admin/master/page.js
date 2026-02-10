"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, Users, Store, TrendingUp, ArrowLeft, Loader2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MasterAdminPage() {
  const [mounted, setMounted] = useState(false); // Sécurité anti-hydratation
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalRestos: 0, totalSales: 0, totalOrders: 0 });
  const [restaurants, setRestaurants] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setMounted(true); // Le composant est maintenant prêt
    checkAdminAndFetchData();
  }, []);

  const checkAdminAndFetchData = async () => {
    try {
      // On ne fait rien si le router n'est pas prêt
      if (!router) return;

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return router.replace('/auth/login'); // .replace est mieux que .push pour les redirects
      }

      const { data: profile } = await supabase
        .from('restaurants')
        .select('is_super_admin')
        .eq('id', user.id)
        .single();

      if (!profile?.is_super_admin) {
        console.warn("Accès Super Admin refusé.");
        return router.replace('/dashboard'); // On redirige proprement
      }

      // Si OK, on charge les données
      const [restosRes, transRes, ordersRes] = await Promise.all([
        supabase.from('restaurants').select('*'),
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

    } catch (err) {
      console.error("Erreur Master Admin:", err);
      // On utilise replace pour éviter de polluer l'historique
      router.replace('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Ne rien afficher tant que le composant n'est pas monté
  if (!mounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#00D9FF] mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">Sécurisation de la session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-[family-name:var(--font-lexend)] p-8">
      {/* ... Le reste de ton JSX (Header, Stats, Table) ... */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 text-left">
        <div>
          <div className="flex items-center gap-3 text-[#00D9FF] mb-2">
            <ShieldCheck size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Master Control Center</span>
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter">SUPERVISION GLOBALE</h1>
        </div>
        <Link href="/dashboard" className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-bold">
          <ArrowLeft size={18} /> Retour Dashboard
        </Link>
      </div>

      {/* STATS GLOBALES */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <StatCard label="Restaurants Actifs" value={stats.totalRestos} icon={<Store className="text-purple-500" />} />
        <StatCard label="Chiffre d'Affaires Global" value={`${stats.totalSales.toLocaleString()} F`} icon={<TrendingUp className="text-green-500" />} />
        <StatCard label="Commandes Totales" value={stats.totalOrders} icon={<Users className="text-[#00D9FF]" />} />
      </div>

      {/* TABLEAU */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[45px] overflow-hidden shadow-2xl">
          {/* ... Contenu de ton tableau ... */}
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-xl font-black italic tracking-tighter">Portefeuille Clients</h3>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left">
               {/* Garde ton <thead> et <tbody> d'avant */}
               <thead>
                <tr className="bg-white/[0.02]">
                  <th className="px-8 py-5 text-[10px] uppercase font-black opacity-30">Restaurant</th>
                  <th className="px-8 py-5 text-[10px] uppercase font-black opacity-30">Contact Manager</th>
                  <th className="px-8 py-5 text-[10px] uppercase font-black opacity-30 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {restaurants.map((resto) => (
                  <tr key={resto.id} className="group hover:bg-white/[0.01]">
                    <td className="px-8 py-6 uppercase font-bold text-sm">{resto.name}</td>
                    <td className="px-8 py-6 opacity-60">{resto.owner_email}</td>
                    <td className="px-8 py-6 text-right">
                       <button className="px-4 py-2 rounded-xl bg-[#00D9FF]/10 text-[#00D9FF] text-[10px] font-black uppercase">Inspecter</button>
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

function StatCard({ label, value, icon }) {
  return (
    <div className="p-8 bg-[#0a0a0a] border border-white/5 rounded-[40px] shadow-xl text-left">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6">{icon}</div>
      <p className="text-[10px] uppercase font-black opacity-40 tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-black italic tracking-tighter">{value}</p>
    </div>
  );
}