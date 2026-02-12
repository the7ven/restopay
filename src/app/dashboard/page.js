"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, Receipt, UtensilsCrossed, Users, Settings, LogOut,
  Wallet, Plus, Grid, Flame, TrendingUp, Clock, CheckCircle2,
  Menu as MenuIcon, X, ChevronDown, Sun, Moon, Package, FileText,
  ShoppingBag, History, ArrowRight, Calendar as CalendarIcon, Settings2,
  Banknote, Smartphone, CreditCard, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useTheme } from "@/context/ThemeContext";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { supabase } from '@/lib/supabase';

import MenuTabContent from './tabs/MenuTabContent';
import OrdersTabContent from './tabs/OrdersTabContent'; 
import TablesTabContent from './tabs/TablesTabContent'; 
import CashierTabContent from './tabs/CashierTabContent';
import StockTabContent from './tabs/StockTabContent';
import HistoryTabContent from './tabs/HistoryTabContent';
import ReportsTabContent from './tabs/ReportsTabContent';
import ExpensesTabContent from './tabs/ExpensesTabContent';
import StaffTabContent from './tabs/StaffTabContent';
import SettingsTabContent from './tabs/SettingsTabContent';

export default function AdminDashboard() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null); 
  const [restaurantName, setRestaurantName] = useState("Chargement...");
  const [isActive, setIsActive] = useState(true); // Statut d'activation
  const [selectedDateISO, setSelectedDateISO] = useState(new Date().toISOString().split('T')[0]);
  const [currentDateDisplay, setCurrentDateDisplay] = useState("");
  
  const dateInputRef = useRef(null);
  const [cart, setCart] = useState([]);
  const [pendingOrder, setPendingOrder] = useState(null);

  useEffect(() => {
    setMounted(true);
    updateDisplayDate(new Date());
    fetchUserProfile(); 
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('restaurants')
          .select('name, is_super_admin, is_active')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setRestaurantName(data.name || "Mon Restaurant");
          setIsActive(data.is_active ?? false); // On récupère le statut
          setUserProfile(data);
        }
      }
    } catch (err) {
      console.error("Erreur profil:", err);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erreur:", error.message);
    } else {
      router.refresh();
      router.push('/');
    }
  };

  const updateDisplayDate = (date) => {
    setCurrentDateDisplay(
      date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  };

  const handleDateChange = (e) => {
    const val = e.target.value;
    if (val) {
      setSelectedDateISO(val);
      updateDisplayDate(new Date(val));
    }
  };

  const openCalendar = () => {
    if (dateInputRef.current) {
      if ("showPicker" in HTMLInputElement.prototype) dateInputRef.current.showPicker();
      else dateInputRef.current.click();
    }
  };

  if (!mounted) return null;

  // --- ÉCRAN DE BLOCAGE SI COMPTE INACTIF ---
  if (!isActive && !userProfile?.is_super_admin) {
    return <AccountInactiveScreen restaurantName={restaurantName} handleLogout={handleLogout} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview": return <OverviewTabContent isDarkMode={isDarkMode} setActiveTab={setActiveTab} selectedDate={selectedDateISO} />;
      case "orders": return <OrdersTabContent isDarkMode={isDarkMode} setCart={setCart} setPendingOrder={setPendingOrder} setActiveTab={setActiveTab}  selectedDate={selectedDateISO} />;
      case "menu": return <MenuTabContent isDarkMode={isDarkMode} cart={cart} setCart={setCart} pendingOrder={pendingOrder} setPendingOrder={setPendingOrder} setActiveTab={setActiveTab}/>;
      case "tables": return <TablesTabContent isDarkMode={isDarkMode} setActiveTab={setActiveTab} setPendingOrder={setPendingOrder} />;
      case "cashier": return <CashierTabContent isDarkMode={isDarkMode} setActiveTab={setActiveTab} />;
      case "stock": return <StockTabContent isDarkMode={isDarkMode} />;
      case "history": return <HistoryTabContent isDarkMode={isDarkMode} selectedDate={selectedDateISO} />;
      case "reports": return <ReportsTabContent isDarkMode={isDarkMode} />;
      case "expenses": return <ExpensesTabContent isDarkMode={isDarkMode} setActiveTab={setActiveTab} selectedDate={selectedDateISO} />;
      case "staff": return <StaffTabContent isDarkMode={isDarkMode} />;
      case "settings":
        return (
          <SettingsTabContent 
            isDarkMode={isDarkMode} 
            setGlobalRestoName={setRestaurantName} 
          />
        );
      default: return <div className="p-20 opacity-20 italic">Module en développement...</div>;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-[family-name:var(--font-lexend)] flex overflow-x-hidden ${isDarkMode ? "bg-[#050505] text-white" : "bg-[#F9FAFB] text-[#1F2937]"}`}>
      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] lg:hidden transition-opacity" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-[200] w-72 border-r transition-all duration-300 lg:translate-x-0 lg:static lg:h-screen flex flex-col p-6 ${isDarkMode ? "bg-[#0a0a0a] border-white/5" : "bg-white border-gray-200 shadow-xl"} ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between mb-10 text-left">
          <div className="flex items-center gap-3 text-xl font-extrabold tracking-tighter text-[#00D9FF]">
            <LayoutDashboard size={28} />
            <span>RestoPay Admin</span>
          </div>
          <button className="lg:hidden p-2 opacity-50" onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar text-left">
          <p className="text-[10px] uppercase tracking-widest opacity-30 mb-4 px-3 font-bold">Principal</p>
          <NavItem isDarkMode={isDarkMode} icon={<TrendingUp size={20} />} label="Vue d'ensemble" active={activeTab === "overview"} onClick={() => { setActiveTab("overview"); setIsSidebarOpen(false); }} />
          <NavItem isDarkMode={isDarkMode} icon={<ShoppingBag size={20} />} label="Commandes" active={activeTab === "orders"} onClick={() => { setActiveTab("orders"); setIsSidebarOpen(false); }} />
          <NavItem isDarkMode={isDarkMode} icon={<UtensilsCrossed size={20} />} label="Menu & Plats" active={activeTab === "menu"} onClick={() => { setActiveTab("menu"); setIsSidebarOpen(false); }} />
          <NavItem isDarkMode={isDarkMode} icon={<Grid size={20} />} label="Plan de Salle" active={activeTab === "tables"} onClick={() => { setActiveTab("tables"); setIsSidebarOpen(false); }} />

          <p className="text-[10px] uppercase tracking-widest opacity-30 mt-6 mb-4 px-3 font-bold">Gestion & Finance</p>
          <NavItem isDarkMode={isDarkMode} icon={<Wallet size={20} />} label="Caisse" active={activeTab === "cashier"} onClick={() => { setActiveTab("cashier"); setIsSidebarOpen(false); }} />
          <NavItem isDarkMode={isDarkMode} icon={<Package size={20} />} label="Stocks" active={activeTab === "stock"} onClick={() => { setActiveTab("stock"); setIsSidebarOpen(false); }} />
          <NavItem isDarkMode={isDarkMode} icon={<History size={20} />} label="Historique" active={activeTab === "history"} onClick={() => { setActiveTab("history"); setIsSidebarOpen(false); }} />
          <NavItem isDarkMode={isDarkMode} icon={<FileText size={20} />} label="Dépenses" active={activeTab === "expenses"} onClick={() => { setActiveTab("expenses"); setIsSidebarOpen(false); }} />
          <NavItem isDarkMode={isDarkMode} icon={<FileText size={20} />} label="Rapports" active={activeTab === "reports"} onClick={() => { setActiveTab("reports"); setIsSidebarOpen(false); }} />

          <p className="text-[10px] uppercase tracking-widest opacity-30 mt-6 mb-4 px-3 font-bold">Système</p>
          <NavItem isDarkMode={isDarkMode} icon={<Users size={20} />} label="Personnel" active={activeTab === "staff"} onClick={() => { setActiveTab("staff"); setIsSidebarOpen(false); }} />
          <NavItem isDarkMode={isDarkMode} icon={<Settings size={20} />} label="Paramètres" active={activeTab === "settings"} onClick={() => { setActiveTab("settings"); setIsSidebarOpen(false); }} />
        </nav>

        {userProfile?.is_super_admin && (
          <Link href="/admin/master" className="mt-4 flex items-center gap-3 px-4 py-3 bg-[#00D9FF]/10 text-[#00D9FF] rounded-xl transition-all font-black border border-[#00D9FF]/20 hover:bg-[#00D9FF]/20 no-underline group">
            <ShieldCheck size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="text-xs tracking-widest uppercase">Master Control</span>
          </Link>
        )}

        <button 
          onClick={handleLogout}
          className="mt-2 flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-bold group w-full text-left bg-transparent border-none cursor-pointer"
        >
          <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
          <span>Déconnexion</span>
        </button>
      </aside>

      <main className="flex-1 p-4 lg:p-8 w-full max-h-screen overflow-y-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6 text-left">
          <div className="flex items-center gap-4 text-left">
            <button className={`lg:hidden p-3 border rounded-xl text-[#00D9FF] transition-colors ${isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-200 shadow-sm"}`} onClick={() => setIsSidebarOpen(true)}>
              <MenuIcon size={24} />
            </button>
            <div className="relative group cursor-pointer text-left" onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <div className="flex items-center gap-2">
                <h2 className={`text-xl lg:text-3xl font-black tracking-tight transition-colors ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Bonjour, {restaurantName}
                </h2>
                <ChevronDown size={20} className={`text-[#00D9FF] transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
              </div>
              <p className="text-[#888] text-xs lg:text-base font-medium uppercase tracking-tighter italic">Manager @ RestoPay Cloud</p>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4 w-full sm:w-auto">
            <div className="relative">
              <input type="date" ref={dateInputRef} value={selectedDateISO} onChange={handleDateChange} className="absolute invisible w-0 h-0" />
              <div onClick={openCalendar} className={`flex items-center gap-3 px-4 py-2.5 border rounded-2xl cursor-pointer transition-all active:scale-95 select-none ${isDarkMode ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-white border-gray-200 text-gray-700 shadow-sm hover:shadow-md"}`}>
                <CalendarIcon size={18} className="text-[#00D9FF]" />
                <span className="text-sm font-bold whitespace-nowrap">{currentDateDisplay}</span>
                <ChevronDown size={14} className="opacity-50" />
              </div>
            </div>
            <button onClick={toggleTheme} className={`p-2 lg:p-3 border rounded-full transition-all ${isDarkMode ? "bg-white/5 border-white/10 text-yellow-400" : "bg-white border-gray-200 text-indigo-600 shadow-sm"}`}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>
        {renderContent()}
      </main>
    </div>
  );
}

// --- COMPOSANT D'ATTENTE ACTIVATION ---
function AccountInactiveScreen({ restaurantName, handleLogout }) {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-[family-name:var(--font-lexend)]">
      <div className="max-w-md w-full text-center space-y-8 p-10 rounded-[50px] border border-white/5 bg-[#0a0a0a] shadow-2xl">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-[#00D9FF] blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative bg-white/5 p-8 rounded-full border border-[#00D9FF]/20 text-[#00D9FF]">
            <Clock size={60} strokeWidth={1} className="animate-pulse" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">Activation en cours</h2>
          <p className="text-white/40 text-sm font-medium leading-relaxed">
            Bienvenue chez RestoPay, <span className="text-[#00D9FF]">{restaurantName}</span> ! 
            Votre compte est actuellement en attente de validation par notre équipe.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3">
          <p className="text-[10px] uppercase font-black tracking-widest text-[#00D9FF]">Besoin d'aide ?</p>
          <p className="text-xs text-white/60">Contactez le support technique pour activer votre licence.</p>
          <p className="text-sm font-bold text-white tracking-tight">WhatsApp: +225 0700000000</p>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => window.location.reload()} 
            className="w-full py-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
          >
            Vérifier mon statut
          </button>
          <button 
            onClick={handleLogout}
            className="w-full py-4 rounded-2xl bg-transparent text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-500/10 transition-all"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}

// ... Reste des composants OverviewTabContent, etc ...
function OverviewTabContent({ isDarkMode, setActiveTab, selectedDate }) {
  const [realStats, setRealStats] = useState({ 
    dayTotal: 0, 
    byMethod: { "Espèces": 0, "Orange Money": 0, "Wave": 0 },
    chartData: [],
    popularItems: []
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchRealData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const startOfDay = `${selectedDate}T00:00:00.000Z`;
      const endOfDay = `${selectedDate}T23:59:59.999Z`;

      const { data: transData } = await supabase
        .from('transactions')
        .select('*')
        .eq('restaurant_id', user.id)
        .gte('created_at', startOfDay)
        .lte('created_at', endOfDay)
        .order('created_at', { ascending: false });

      if (transData) {
        const total = transData.reduce((acc, curr) => acc + Number(curr.amount), 0);
        const methods = transData.reduce((acc, curr) => {
          const m = curr.payment_method || "Espèces";
          acc[m] = (acc[m] || 0) + Number(curr.amount);
          return acc;
        }, { "Espèces": 0, "Orange Money": 0, "Wave": 0 });

        const itemCounts = {};
        transData.forEach(t => {
          if (t.items && Array.isArray(t.items)) {
            t.items.forEach(item => {
              itemCounts[item.name] = (itemCounts[item.name] || 0) + 1;
            });
          }
        });
        const sortedItems = Object.entries(itemCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);

        const hourlySales = [...Array(24)].map((_, hour) => {
          const totalInHour = transData
            .filter(t => new Date(t.created_at).getHours() === hour)
            .reduce((sum, t) => sum + Number(t.amount), 0);
          return { day: `${hour}h`, sales: totalInHour };
        });

        setRealStats({ dayTotal: total, byMethod: methods, chartData: hourlySales, popularItems: sortedItems });
        setRecentOrders(transData.slice(0, 4));
      }
    };
    fetchRealData();
  }, [selectedDate]);

  return (
    <div className="fade-in text-left">
      <div onClick={() => setActiveTab("cashier")} className={`mb-8 p-8 rounded-[32px] border transition-all relative overflow-hidden group cursor-pointer ${isDarkMode ? "bg-[#0a0a0a] border-[#00D9FF]/20 hover:border-[#00D9FF]/50" : "bg-white border-cyan-100 shadow-xl"}`}>
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Wallet size={120} className="text-[#00D9FF]" /></div>
        <div className="relative z-10 text-left">
          <p className="text-[#00D9FF] text-xs font-black uppercase tracking-[0.2em] mb-2">Recettes du jour sélectionné</p>
          <h2 className="text-4xl lg:text-6xl font-black">{realStats.dayTotal.toLocaleString()} <span className="text-xl opacity-50 font-bold">FCFA</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 pt-6 border-t border-white/5">
            <PaymentMiniStat label="Espèces" value={realStats.byMethod["Espèces"]} icon={<Banknote size={16}/>} color="green" />
            <PaymentMiniStat label="Orange Money" value={realStats.byMethod["Orange Money"]} icon={<Smartphone size={16}/>} color="orange" />
            <PaymentMiniStat label="Wave" value={realStats.byMethod["Wave"]} icon={<CreditCard size={16}/>} color="blue" />
          </div>
        </div>
      </div>

      <div className={`mb-8 p-8 rounded-[32px] border transition-all ${isDarkMode ? "bg-[#0a0a0a] border-white/5" : "bg-white border-gray-100 shadow-sm"}`}>
        <h3 className="text-xl font-bold flex items-center gap-2 mb-8 text-left uppercase tracking-tighter italic">Rush horaire de la journée <TrendingUp size={20} className="text-[#00D9FF]" /></h3>
        <div className="h-64 lg:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={realStats.chartData}>
              <defs><linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00D9FF" stopOpacity={0.3} /><stop offset="95%" stopColor="#00D9FF" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 10 }} />
              <YAxis hide />
              <Tooltip formatter={(value) => [`${value.toLocaleString()} F`, 'Ventes']} contentStyle={{ borderRadius: '15px', border: 'none', backgroundColor: isDarkMode ? '#111' : '#fff' }} />
              <Area type="monotone" dataKey="sales" stroke="#00D9FF" strokeWidth={4} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 text-left">
        <div onClick={() => setActiveTab("orders")} className={`xl:col-span-2 border rounded-[32px] p-8 transition-all cursor-pointer group ${isDarkMode ? "bg-[#0a0a0a] border-white/5 hover:border-[#00D9FF]/30" : "bg-white border-gray-100 shadow-sm"}`}>
          <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-left uppercase tracking-tighter italic">Ventes du jour <ArrowRight size={18} className="text-[#00D9FF]" /></h3>
          <div className="space-y-4">
            {recentOrders.length === 0 ? <p className="opacity-20 italic">Aucune vente pour ce jour</p> : 
              recentOrders.map((order, i) => (
                <OrderRow key={i} isDarkMode={isDarkMode} table={order.table_number} dishes={order.payment_method || "Espèces"} total={`${order.amount.toLocaleString()} F`} status="Validé" />
              ))
            }
          </div>
        </div>
        <div className={`border rounded-[32px] p-8 ${isDarkMode ? "bg-[#0a0a0a] border-white/5" : "bg-white border-gray-100 shadow-sm"}`}>
          <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-left uppercase tracking-tighter italic">Top Ventes du jour <Flame size={18} className="text-orange-500" /></h3>
          <div className="space-y-6">
              {realStats.popularItems.length === 0 ? <p className="opacity-30 italic text-sm">Rien de vendu ce jour</p> : 
              realStats.popularItems.map((item, i) => (
                <PopularItem key={i} isDarkMode={isDarkMode} name={item.name} count={`${item.count} fois`} trend={i === 0 ? "Bestseller" : ""} />
              ))
              }
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentMiniStat({ label, value, icon, color }) {
  const colors = { green: "bg-green-500/10 text-green-500", orange: "bg-orange-500/10 text-orange-500", blue: "bg-blue-500/10 text-blue-500" };
  return (
    <div className="flex items-center gap-3 text-left">
      <div className={`p-2.5 rounded-xl ${colors[color]}`}>{icon}</div>
      <div className="text-left">
        <p className="text-[9px] uppercase font-black opacity-40 tracking-widest">{label}</p>
        <p className="text-sm font-black">{value?.toLocaleString()} F</p>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick, isDarkMode }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${active ? "bg-[#00D9FF] text-black shadow-lg shadow-cyan-500/10" : isDarkMode ? "text-[#555] hover:text-white hover:bg-white/5" : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"}`}>
      {icon} <span>{label}</span>
    </button>
  );
}

function OrderRow({ table, dishes, total, status, isDarkMode }) {
  return (
    <div className={`flex items-center justify-between p-4 border rounded-2xl transition-all ${isDarkMode ? "bg-white/[0.02] border-white/5" : "bg-gray-50 border-gray-100 shadow-sm hover:bg-white"}`}>
      <div className="flex items-center gap-4 text-left">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold bg-[#00D9FF]/10 text-[#00D9FF]">{table}</div>
        <div className="text-left"><h4 className="font-bold text-sm uppercase">{dishes}</h4><p className="text-[10px] opacity-40 font-medium">{total}</p></div>
      </div>
      <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#00D9FF]/10 text-[#00D9FF]">{status}</span>
    </div>
  );
}

function PopularItem({ name, count, trend, isDarkMode }) {
  return (
    <div className="flex justify-between items-center text-left">
      <div className="text-left"><h4 className="font-bold text-base uppercase">{name}</h4><p className="text-xs opacity-50 font-medium">{count}</p></div>
      <span className="text-xs font-bold text-green-500 uppercase italic tracking-tighter">{trend}</span>
    </div>
  );
}