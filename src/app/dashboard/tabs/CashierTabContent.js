"use client";

import React, { useState, useEffect } from 'react';
import { 
  Wallet, Banknote, Smartphone, CreditCard, 
  Search, Filter, ArrowUpRight, ArrowDownRight,
  Clock, Calendar as CalendarIcon, ChevronRight,
  Receipt, Printer, Download, Trash2, AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function CashierTabContent({ isDarkMode, selectedDate }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ daily: 0, count: 0 });

  useEffect(() => {
    fetchTransactions();
    
    // Temps réel pour la caisse
    const channel = supabase.channel('cashier_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transactions' }, fetchTransactions)
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, [selectedDate]);

  const fetchTransactions = async () => {
  // --- SÉCURITÉ : Si la date n'est pas encore prête, on arrête tout ---
  if (!selectedDate) {
    console.log("Date non définie, attente du chargement...");
    return;
  }

  try {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    // On s'assure que selectedDate est bien une chaîne propre
    const start = `${selectedDate}T00:00:00.000Z`;
    const end = `${selectedDate}T23:59:59.999Z`;

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('restaurant_id', user.id)
      .gte('created_at', start)
      .lte('created_at', end)
      .order('created_at', { ascending: false });

    if (error) throw error;

    setTransactions(data || []);
    const total = data?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
    setStats({ daily: total, count: data?.length || 0 });
  } catch (error) {
    console.error('Erreur Caisse:', error.message);
  } finally {
    setLoading(false);
  }
};

  const getMethodIcon = (method) => {
    switch (method) {
      case 'Orange Money': return <Smartphone className="text-orange-500" />;
      case 'Wave': return <CreditCard className="text-blue-500" />;
      default: return <Banknote className="text-green-500" />;
    }
  };

  return (
    <div className="fade-in text-left">
      {/* --- BANNIÈRE STATS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left">
        <div className={`p-8 rounded-[40px] border ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Recette du Jour</p>
          <h2 className="text-3xl font-black italic text-[#00D9FF]">{stats.daily.toLocaleString()} F</h2>
        </div>
        <div className={`p-8 rounded-[40px] border ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Transactions</p>
          <h2 className="text-3xl font-black italic">{stats.count}</h2>
        </div>
        <div className={`p-8 rounded-[40px] border ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Panier Moyen</p>
          <h2 className="text-3xl font-black italic">
            {stats.count > 0 ? Math.round(stats.daily / stats.count).toLocaleString() : 0} F
          </h2>
        </div>
      </div>

      {/* --- LISTE DES TRANSACTIONS --- */}
      <div className={`rounded-[45px] border overflow-hidden ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-xl'}`}>
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <h3 className="text-xl font-black italic uppercase tracking-tighter">Journal de Caisse</h3>
          <div className="flex gap-2">
             <button className="p-3 rounded-2xl bg-white/5 opacity-50 hover:opacity-100 transition-all"><Download size={18}/></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-8 py-5 text-[10px] font-black uppercase opacity-30 text-left">Heure</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase opacity-30 text-left">Source</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase opacity-30 text-left">Méthode</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase opacity-30 text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center opacity-20 italic">Aucun encaissement pour cette date</td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="group hover:bg-white/[0.01] transition-colors">
                    <td className="px-8 py-6 text-left">
                      <div className="flex items-center gap-3 text-left">
                        <div className="p-2 rounded-xl bg-white/5 text-white/40"><Clock size={14} /></div>
                        <span className="text-xs font-bold text-left">
                          {new Date(tx.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-left">
                      <span className="text-xs font-black uppercase tracking-tight text-left">{tx.table_number}</span>
                    </td>
                    <td className="px-8 py-6 text-left">
                      <div className="flex items-center gap-2 text-left">
                        {getMethodIcon(tx.payment_method)}
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60 text-left">{tx.payment_method}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-sm font-black text-[#00D9FF]">{tx.amount.toLocaleString()} F</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}