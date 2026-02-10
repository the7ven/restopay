"use client";

import React, { useState, useEffect } from 'react';
import { 
  Wallet, Banknote, Smartphone, CreditCard, 
  ArrowUpRight, ArrowDownRight, History, ShieldCheck, 
  Lock, TrendingUp, Plus, Printer, Share2, X, CheckCircle2,
  Calendar, ChevronRight, PieChart, ShoppingCart, Safe
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { supabase } from '@/lib/supabase';

export default function CashierTabContent({ isDarkMode, setActiveTab }) {
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState('jour'); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCashierData();
    const channel = supabase.channel('cashier_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => fetchCashierData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, () => fetchCashierData())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [filter]);

  const fetchCashierData = async () => {
    try {
      setLoading(true);
      
      // 1. Récupération de l'utilisateur connecté pour l'isolation
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase.from('transactions').select('*').eq('restaurant_id', user.id);
      let expQuery = supabase.from('expenses').select('*').eq('restaurant_id', user.id);

      const now = new Date();
      let startStr;

      if (filter === 'jour') {
        startStr = new Date(now.setHours(0,0,0,0)).toISOString();
      } else if (filter === 'semaine') {
        startStr = new Date(now.setDate(now.getDate() - 7)).toISOString();
      } else if (filter === 'mois') {
        startStr = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      }

      query = query.gte('created_at', startStr);
      expQuery = expQuery.gte('created_at', startStr);

      const { data: transData } = await query.order('created_at', { ascending: false });
      const { data: expData } = await expQuery.order('created_at', { ascending: false });

      setTransactions(transData || []);
      setExpenses(expData || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const totalSales = transactions.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  
  // LE SOLDE RÉEL (Recettes - Dépenses)
  const netCash = totalSales - totalExpenses;

  const totalsByMethod = transactions.reduce((acc, curr) => {
    const method = curr.payment_method || 'Espèces';
    acc[method] = (acc[method] || 0) + (curr.amount || 0);
    return acc;
  }, {});

  const hourlyData = [
    { hour: 'Matin', sales: transactions.filter(t => new Date(t.created_at).getHours() < 12).reduce((a, b) => a + b.amount, 0) },
    { hour: 'Midi', sales: transactions.filter(t => new Date(t.created_at).getHours() >= 12 && new Date(t.created_at).getHours() < 15).reduce((a, b) => a + b.amount, 0) },
    { hour: 'Soir', sales: transactions.filter(t => new Date(t.created_at).getHours() >= 18).reduce((a, b) => a + b.amount, 0) },
  ];

  const handleCloseCashier = () => {
    if (window.confirm(`Confirmer la clôture ? Solde net: ${netCash.toLocaleString()} F`)) {
      alert("Caisse clôturée avec succès !");
    }
  };

  const handleOpenReceipt = (trans) => {
    setSelectedOrder(trans);
    setShowReceipt(true);
  };

  const getPaymentIcon = (method) => {
    switch(method) {
      case 'Orange Money': return <Smartphone size={12} className="text-orange-500" />;
      case 'Wave': return <CreditCard size={12} className="text-blue-500" />;
      default: return <Banknote size={12} className="text-green-500" />;
    }
  };

  return (
    <div className="fade-in text-left relative pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 no-print">
        <div className="text-left">
          <h3 className="text-3xl font-black italic tracking-tighter uppercase">Gestion de Caisse</h3>
          <p className="opacity-50 text-[10px] font-black uppercase tracking-widest text-left">Suivi des flux financiers</p>
        </div>
        
        <div className={`flex p-1 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-100 border-gray-200'}`}>
          {['jour', 'semaine', 'mois'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${filter === f ? 'bg-[#00D9FF] text-black shadow-lg' : 'opacity-40'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 no-print">
        <div className="xl:col-span-2 space-y-8 text-left">
          
          {/* CARTE CHIFFRE D'AFFAIRES PRINCIPALE */}
          <div className={`p-10 rounded-[45px] border relative overflow-hidden group ${isDarkMode ? 'bg-[#0a0a0a] border-[#00D9FF]/20' : 'bg-white border-cyan-100 shadow-xl'}`}>
            <div className="absolute top-0 right-0 p-8 opacity-5"><Wallet size={150} className="text-[#00D9FF]" /></div>
            <div className="relative z-10 text-left">
              <p className="text-[#00D9FF] text-xs font-black uppercase tracking-widest mb-2">Recettes Totales ({filter})</p>
              <h2 className="text-5xl lg:text-7xl font-black mb-6">
                {totalSales.toLocaleString()} <span className="text-xl opacity-30 font-bold italic">FCFA</span>
              </h2>

              {/* --- BLOC SOLDE RÉEL APRÈS DÉPENSES --- */}
              <div className={`mb-8 p-6 rounded-[30px] border flex items-center justify-between ${isDarkMode ? 'bg-green-500/5 border-green-500/20' : 'bg-green-50 border-green-100'}`}>
                <div className="flex items-center gap-4">
                   <div className="p-3 rounded-2xl bg-green-500 text-white shadow-lg shadow-green-500/20">
                      <TrendingUp size={24} />
                   </div>
                   <div className="text-left">
                      <p className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Solde Net en Caisse</p>
                      <h3 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-green-900'}`}>{netCash.toLocaleString()} F</h3>
                   </div>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black opacity-40 uppercase">Avoir Réel</p>
                  <p className="text-xs font-bold opacity-60">après -{totalExpenses.toLocaleString()} F de frais</p>
                </div>
              </div>

              {/* RÉPARTITION DES PAIEMENTS BRUTS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-green-500/10 text-green-500"><Banknote size={16} /></div>
                  <div className="text-left">
                    <p className="text-[8px] uppercase font-black opacity-40">Espèces</p>
                    <p className="text-sm font-black">{(totalsByMethod['Espèces'] || 0).toLocaleString()} F</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500"><Smartphone size={16} /></div>
                  <div className="text-left">
                    <p className="text-[8px] uppercase font-black opacity-40">Orange Money</p>
                    <p className="text-sm font-black">{(totalsByMethod['Orange Money'] || 0).toLocaleString()} F</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500"><CreditCard size={16} /></div>
                  <div className="text-left">
                    <p className="text-[8px] uppercase font-black opacity-40">Wave</p>
                    <p className="text-sm font-black">{(totalsByMethod['Wave'] || 0).toLocaleString()} F</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* GRAPHIQUE PERFORMANCE */}
            <div className={`p-8 rounded-[40px] border ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
              <h4 className="text-sm font-black flex items-center gap-2 mb-6 italic uppercase tracking-widest opacity-60"><TrendingUp size={16} className="text-[#00D9FF]" /> Performance</h4>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyData}>
                    <Bar dataKey="sales" radius={[6, 6, 6, 6]}>
                      {hourlyData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.sales > 0 ? '#00D9FF' : '#222'} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* LISTE DES DÉPENSES */}
            <div className={`p-8 rounded-[40px] border flex flex-col ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-sm font-black flex items-center gap-2 italic uppercase tracking-widest opacity-60"><ShoppingCart size={16} className="text-red-500" /> Dépenses</h4>
                <p className="font-black text-red-500 text-sm">-{totalExpenses.toLocaleString()} F</p>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {expenses.length === 0 ? <p className="text-[10px] opacity-20 py-10 text-center italic">Aucun frais</p> : 
                expenses.map((exp, i) => (
                  <div key={i} className={`flex justify-between items-center p-4 rounded-2xl ${isDarkMode ? 'bg-red-500/5 border border-red-500/10' : 'bg-red-50/50 border border-red-100'}`}>
                    <div className="text-left">
                      <span className="text-xs font-black block leading-none mb-1 uppercase tracking-tighter">{exp.label}</span>
                      <span className="text-[8px] opacity-40 font-bold">{new Date(exp.created_at).toLocaleDateString()}</span>
                    </div>
                    <span className="text-xs font-black text-red-500">-{exp.amount.toLocaleString()} F</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* HISTORIQUE DES VENTES */}
        <div className={`p-8 rounded-[40px] border flex flex-col ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
          <div className="flex items-center gap-3 mb-8 text-left">
            <div className="p-3 rounded-2xl bg-[#00D9FF]/10 text-[#00D9FF]"><History size={20} /></div>
            <div className="text-left">
              <h4 className="text-lg font-black italic tracking-tighter uppercase">Ventes Live</h4>
              <p className="text-[9px] uppercase font-black opacity-30 tracking-widest">Flux entrant</p>
            </div>
          </div>
          
          <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
            {transactions.length === 0 ? <p className="text-center opacity-20 py-20 italic">En attente...</p> : 
            transactions.map((trans) => (
              <div key={trans.id} onClick={() => handleOpenReceipt(trans)} className={`flex items-center justify-between p-4 rounded-3xl cursor-pointer transition-all ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50 border border-transparent hover:border-gray-200'}`}>
                <div className="text-left">
                  <p className="text-xs font-black uppercase tracking-tight">{trans.table_number}</p>
                  <div className="flex items-center gap-1.5 opacity-40">
                    {getPaymentIcon(trans.payment_method)}
                    <p className="text-[9px] font-bold uppercase">{trans.payment_method || 'Espèces'}</p>
                    <span className="text-[9px]">•</span>
                    <p className="text-[9px] font-bold">{new Date(trans.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>
                <p className="font-black text-sm text-[#00D9FF]">+{trans.amount?.toLocaleString()} F</p>
              </div>
            ))}
          </div>

          <button onClick={handleCloseCashier} className="mt-8 flex items-center justify-center gap-3 bg-red-600 text-white py-5 rounded-[25px] font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-red-600/20 active:scale-95 transition-all">
            <Lock size={16} /> Clôturer la caisse
          </button>
        </div>
      </div>

      {showReceipt && selectedOrder && (
        <ReceiptModal
          isDarkMode={isDarkMode}
          order={{
            id: selectedOrder.id,
            items: selectedOrder.items || [],
            total: selectedOrder.amount,
            method: selectedOrder.payment_method,
            table: selectedOrder.table_number
          }}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
}

function ReceiptModal({ isDarkMode, order, onClose }) {
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md no-print text-left">
      <div className="w-full max-w-sm">
        <div className={`p-8 rounded-[40px] overflow-hidden ${isDarkMode ? 'bg-[#111] border border-white/5' : 'bg-white shadow-2xl'}`}>
          <div className="text-center border-b border-dashed border-gray-500/20 pb-6 mb-6">
            <h4 className="text-xl font-black italic tracking-tighter uppercase">RestoPay Luxe</h4>
            <p className="text-[9px] opacity-40 font-bold uppercase tracking-widest mt-1">Transaction ID: {order.id.slice(0,8)}</p>
          </div>
          
          <div className="flex justify-between items-center mb-6">
             <span className="text-[10px] font-black uppercase opacity-40 italic">{order.table}</span>
             <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-white/5 text-[#00D9FF]' : 'bg-gray-100 text-gray-800'}`}>
                {order.method || 'Espèces'}
             </span>
          </div>

          <div className="space-y-3 mb-8">
            {order.items.length > 0 ? order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="font-bold text-[11px] uppercase">{item.name}</span>
                <span className="font-black text-[11px]">{item.price?.toLocaleString()} F</span>
              </div>
            )) : (
              <p className="text-center text-[10px] italic opacity-30">Détails non disponibles</p>
            )}
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-gray-500/20">
            <span className="text-xs font-black uppercase italic">Encaissé</span>
            <span className="text-2xl font-black text-[#00D9FF]">{order.total?.toLocaleString()} F</span>
          </div>
        </div>
        <button onClick={onClose} className="mt-6 w-full py-4 bg-red-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95 transition-all">Fermer</button>
      </div>
    </div>
  );
}