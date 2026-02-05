"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Receipt,
  UtensilsCrossed,
  Users,
  Settings,
  LogOut,
  Wallet,
  Plus,
  Grid,
  Flame,
  TrendingUp,
  Clock,
  CheckCircle2,
  Menu as MenuIcon,
  X,
  ChevronDown,
  Sun,
  Moon,
  Package,
  FileText,
  ShoppingBag,
  History,
  ArrowRight,
  Calendar as CalendarIcon,
  Settings2,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
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
  const { isDarkMode, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const dateInputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const date = new Date();
    setCurrentDate(
      date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    );
  }, []);

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate)) {
      setCurrentDate(
        newDate.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      );
    }
  };

  const openCalendar = () => {
    if (dateInputRef.current) {
      if ("showPicker" in HTMLInputElement.prototype) {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.click();
      }
    }
  };

  if (!mounted) return null;

 const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTabContent
            isDarkMode={isDarkMode}
            setActiveTab={setActiveTab}
          />
        );
      
      case "orders":
        return <OrdersTabContent isDarkMode={isDarkMode} />;

      case "menu":
        return <MenuTabContent isDarkMode={isDarkMode} />;

      case "tables":
        return <TablesTabContent isDarkMode={isDarkMode} />;

      case "cashier":
        return <CashierTabContent isDarkMode={isDarkMode} />;

      case "stock":
        return <StockTabContent isDarkMode={isDarkMode} />;

      case "history":
        return <HistoryTabContent isDarkMode={isDarkMode} />;

      case "reports":
        return <ReportsTabContent isDarkMode={isDarkMode} />;

      case "expenses":
        return <ExpensesTabContent isDarkMode={isDarkMode} />;

      case "staff":
        return <StaffTabContent isDarkMode={isDarkMode} />;

      case "settings":
        return <SettingsTabContent isDarkMode={isDarkMode} />;

      default:
        return <PlaceholderSection isDarkMode={isDarkMode} title={activeTab} />;
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 font-[family-name:var(--font-lexend)] flex overflow-x-hidden ${isDarkMode ? "bg-[#050505] text-white" : "bg-[#F9FAFB] text-[#1F2937]"}`}
    >
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-[200] w-72 border-r transition-all duration-300 lg:translate-x-0 lg:static lg:h-screen flex flex-col p-6 ${isDarkMode ? "bg-[#0a0a0a] border-white/5" : "bg-white border-gray-200 shadow-xl"} ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between mb-10 text-left">
          <div className="flex items-center gap-3 text-xl font-extrabold tracking-tighter text-[#00D9FF]">
            <LayoutDashboard size={28} />
            <span>RestoPay Admin</span>
          </div>
          <button
            className="lg:hidden p-2 opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar text-left">
          <p className="text-[10px] uppercase tracking-widest opacity-30 mb-4 px-3 font-bold text-left">
            Principal
          </p>
          <NavItem
            isDarkMode={isDarkMode}
            icon={<TrendingUp size={20} />}
            label="Vue d'ensemble"
            active={activeTab === "overview"}
            onClick={() => {
              setActiveTab("overview");
              setIsSidebarOpen(false);
            }}
          />
          <NavItem
            isDarkMode={isDarkMode}
            icon={<ShoppingBag size={20} />}
            label="Commandes"
            active={activeTab === "orders"}
            onClick={() => {
              setActiveTab("orders");
              setIsSidebarOpen(false);
            }}
          />
          <NavItem
            isDarkMode={isDarkMode}
            icon={<UtensilsCrossed size={20} />}
            label="Menu & Plats"
            active={activeTab === "menu"}
            onClick={() => {
              setActiveTab("menu");
              setIsSidebarOpen(false);
            }}
          />
          <NavItem
            isDarkMode={isDarkMode}
            icon={<Grid size={20} />}
            label="Plan de Salle"
            active={activeTab === "tables"}
            onClick={() => {
              setActiveTab("tables");
              setIsSidebarOpen(false);
            }}
          />

          <p className="text-[10px] uppercase tracking-widest opacity-30 mt-6 mb-4 px-3 font-bold text-left">
            Gestion & Finance
          </p>
          <NavItem
            isDarkMode={isDarkMode}
            icon={<Wallet size={20} />}
            label="Caisse"
            active={activeTab === "cashier"}
            onClick={() => {
              setActiveTab("cashier");
              setIsSidebarOpen(false);
            }}
          />
          <NavItem
            isDarkMode={isDarkMode}
            icon={<Package size={20} />}
            label="Stocks"
            active={activeTab === "stock"}
            onClick={() => {
              setActiveTab("stock");
              setIsSidebarOpen(false);
            }}
          />
          <NavItem
            isDarkMode={isDarkMode}
            icon={<History size={20} />}
            label="Historique"
            active={activeTab === "history"}
            onClick={() => {
              setActiveTab("history");
              setIsSidebarOpen(false);
            }}
          />

          <NavItem
            isDarkMode={isDarkMode}
            icon={<FileText size={20} />}
            label="Dépenses"
            active={activeTab === "expenses"}
            onClick={() => {
              setActiveTab("expenses");
              setIsSidebarOpen(false);
            }}
          />

          <NavItem
            isDarkMode={isDarkMode}
            icon={<FileText size={20} />}
            label="Rapports"
            active={activeTab === "reports"}
            onClick={() => {
              setActiveTab("reports");
              setIsSidebarOpen(false);
            }}
          />

          <p className="text-[10px] uppercase tracking-widest opacity-30 mt-6 mb-4 px-3 font-bold text-left">
            Système
          </p>
          <NavItem
            isDarkMode={isDarkMode}
            icon={<Users size={20} />}
            label="Personnel"
            active={activeTab === "staff"}
            onClick={() => {
              setActiveTab("staff");
              setIsSidebarOpen(false);
            }}
          />
          <NavItem
            isDarkMode={isDarkMode}
            icon={<Settings size={20} />}
            label="Paramètres"
            active={activeTab === "settings"}
            onClick={() => {
              setActiveTab("settings");
              setIsSidebarOpen(false);
            }}
          />
        </nav>

        <Link
          href="/"
          className="mt-6 flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-bold group no-underline"
        >
          <LogOut
            size={20}
            className="group-hover:rotate-12 transition-transform"
          />
          <span>Déconnexion</span>
        </Link>
      </aside>

      <main className="flex-1 lg:ml-0 p-4 lg:p-8 w-full max-h-screen overflow-y-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6 text-left">
          <div className="flex items-center gap-4">
            <button
              className={`lg:hidden p-3 border rounded-xl text-[#00D9FF] transition-colors ${isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-200 shadow-sm"}`}
              onClick={() => setIsSidebarOpen(true)}
            >
              <MenuIcon size={24} />
            </button>
            <div
              className="relative group cursor-pointer"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="flex items-center gap-2">
                <h2
                  className={`text-xl lg:text-3xl font-black tracking-tight leading-tight transition-colors ${isDarkMode ? "text-white" : "text-gray-900"}`}
                >
                  Bonjour, Corneille
                </h2>
                <ChevronDown
                  size={20}
                  className={`text-[#00D9FF] transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </div>
              <p className="text-[#888] text-xs lg:text-base font-medium uppercase tracking-tighter">
                Manager @ RestoPay Cloud
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4 w-full sm:w-auto">
            <div className="relative">
              <input
                type="date"
                ref={dateInputRef}
                onChange={handleDateChange}
                className="absolute invisible w-0 h-0"
              />
              <div
                onClick={openCalendar}
                className={`flex items-center gap-3 px-4 py-2.5 border rounded-2xl cursor-pointer transition-all active:scale-95 select-none ${isDarkMode ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-white border-gray-200 text-gray-700 shadow-sm hover:shadow-md"}`}
              >
                <CalendarIcon size={18} className="text-[#00D9FF]" />
                <span className="text-sm font-bold whitespace-nowrap">
                  {currentDate}
                </span>
                <ChevronDown size={14} className="opacity-50" />
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`p-2 lg:p-3 border rounded-full transition-all ${isDarkMode ? "bg-white/5 border-white/10 text-yellow-400" : "bg-white border-gray-200 text-indigo-600 shadow-sm"}`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
          </div>
        </header>

        {renderContent()}
      </main>

      <style jsx>{`
        .fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

/** * COMPOSANT : VUE D'ENSEMBLE (Avec liens interactifs) */
function OverviewTabContent({ isDarkMode, setActiveTab }) {
  const chartData = [
    { day: "01", sales: 2340000 },
    { day: "03", sales: 559000 },
    { day: "05", sales: 450000 },
    { day: "07", sales: 696700 },
    { day: "09", sales: 885000 },
    { day: "11", sales: 750000 },
    { day: "13", sales: 900000 },
    { day: "15", sales: 1650000 },
    { day: "17", sales: 500000 },
    { day: "19", sales: 1000850 },
    { day: "21", sales: 1950000 },
    { day: "23", sales: 2700000 },
    { day: "25", sales: 700000 },
    { day: "28", sales: 3100000 },
  ];

  return (
    <div className="fade-in">
      {/* --- CAISSE --- */}
      <div
        onClick={() => setActiveTab("cashier")}
        className={`mb-8 p-8 rounded-[32px] border transition-all relative overflow-hidden group cursor-pointer ${isDarkMode ? "bg-[#0a0a0a] border-[#00D9FF]/20 hover:border-[#00D9FF]/50" : "bg-white border-cyan-100 shadow-xl shadow-cyan-500/5 hover:shadow-cyan-500/10"}`}
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
          <Wallet size={120} className="text-[#00D9FF]" />
        </div>
        <div className="relative z-10 text-left">
          <p className="text-[#00D9FF] text-sm font-black uppercase tracking-[0.2em] mb-2">
            Montant réel en caisse
          </p>
          <h2
            className={`text-4xl lg:text-6xl font-black ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            845.500{" "}
            <span className="text-xl lg:text-2xl opacity-50 font-bold">
              FCFA
            </span>
          </h2>
          <div className="flex items-center gap-2 mt-4">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-green-500 text-sm font-bold">
              Ouverture de caisse : 12:30
            </p>
          </div>
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-10 text-left">
        {/* Recettes -> pointe vers Caisse */}
        <StatCard
          isDarkMode={isDarkMode}
          label="Recettes attendues"
          value="456.800 F"
          sub="+12% vs hier"
          icon={<Wallet size={24} />}
          color="cyan"
          onClick={() => setActiveTab("cashier")}
        />

        {/* Commandes -> pointe vers Commandes */}
        <StatCard
          isDarkMode={isDarkMode}
          label="Commandes"
          value="128"
          sub="8 en cours"
          icon={<Clock size={24} />}
          color="purple"
          onClick={() => setActiveTab("orders")}
        />

        {/* Satisfaction -> Reste statique ou peut pointer vers Rapports */}
        <div className="sm:col-span-2 lg:col-span-1">
          <StatCard
            isDarkMode={isDarkMode}
            label="Satisfaction"
            value="98%"
            sub="24 avis"
            icon={<CheckCircle2 size={24} />}
            color="green"
          />
        </div>
      </section>

      {/* --- GRAPHIQUE --- */}
      <div
        className={`mb-8 p-8 rounded-[32px] border transition-all ${isDarkMode ? "bg-[#0a0a0a] border-white/5" : "bg-white border-gray-100 shadow-sm"}`}
      >
        <div className="flex justify-between items-end mb-8 text-left">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              Ventes du mois <TrendingUp size={20} className="text-[#00D9FF]" />
            </h3>
            <p className="text-xs opacity-50 font-medium uppercase tracking-widest mt-1">
              Performance • Février 2026
            </p>
          </div>
          <div className="text-right">
            <p
              className={`text-2xl font-black ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              12.4M F
            </p>
            <p className="text-[10px] text-green-500 font-black">
              +18.4% ce mois
            </p>
          </div>
        </div>
        <div className="h-64 lg:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00D9FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={
                  isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
                }
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: isDarkMode ? "#555" : "#999",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
                dy={10}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#0f0f0f" : "#fff",
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  fontWeight: "bold",
                }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#00D9FF"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorSales)"
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- SECTIONS INTERACTIVES --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Commandes -> Redirige vers 'orders' */}
        <div
          onClick={() => setActiveTab("orders")}
          className={`xl:col-span-2 border rounded-[24px] lg:rounded-[32px] p-6 lg:p-8 transition-all cursor-pointer group ${isDarkMode ? "bg-[#0a0a0a] border-white/5 hover:border-[#00D9FF]/30" : "bg-white border-gray-100 shadow-sm hover:shadow-md"}`}
        >
          <div className="flex justify-between items-center mb-6">
            <h3
              className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}
            >
              Dernières Commandes{" "}
              <ArrowRight
                size={18}
                className="text-[#00D9FF] opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0"
              />
            </h3>
            <button className="text-[#00D9FF] text-sm font-bold">
              Voir tout
            </button>
          </div>
          <div className="space-y-4">
            <OrderRow
              isDarkMode={isDarkMode}
              table="T.05"
              dishes="Poisson Grillé, Bissap"
              total="3.500 F"
              status="En cours"
            />
            <OrderRow
              isDarkMode={isDarkMode}
              table="T.12"
              dishes="Garba Royal, Coca"
              total="2.500 F"
              status="Prêt"
            />
            <OrderRow
              isDarkMode={isDarkMode}
              table="T.02"
              dishes="Alloco, Poulet"
              total="5.000 F"
              status="Servi"
            />
          </div>
        </div>

        {/* Top Plats -> Redirige vers 'menu' */}
        <div
          onClick={() => setActiveTab("menu")}
          className={`border rounded-[24px] lg:rounded-[32px] p-6 lg:p-8 transition-all cursor-pointer group ${isDarkMode ? "bg-[#0a0a0a] border-white/5 hover:border-[#00D9FF]/30" : "bg-white border-gray-100 shadow-sm hover:shadow-md"}`}
        >
          <div className="flex justify-between items-center mb-6">
            <h3
              className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}
            >
              Top Plats <Flame size={18} className="text-orange-500" />
            </h3>
            <ArrowRight
              size={18}
              className="text-[#00D9FF] opacity-0 group-hover:opacity-100 transition-all"
            />
          </div>
          <div className="space-y-6">
            <PopularItem
              isDarkMode={isDarkMode}
              name="Poisson Grillé"
              count="45 ventes"
              trend="+5%"
            />
            <PopularItem
              isDarkMode={isDarkMode}
              name="Garba Spécial"
              count="32 ventes"
              trend="+2%"
            />
            <PopularItem
              isDarkMode={isDarkMode}
              name="Alloco"
              count="28 ventes"
              trend="-1%"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// COMPOSANTS DE STRUCTURE
function PlaceholderSection({ title, isDarkMode }) {
  return (
    <div
      className={`p-20 text-center border-2 border-dashed rounded-[32px] fade-in ${isDarkMode ? "border-white/5 bg-white/[0.01]" : "border-gray-100 bg-gray-50"}`}
    >
      <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter">
        Module {title}
      </h3>
      <p className="opacity-40 italic">
        Ce module sera bientôt codé séparément.
      </p>
    </div>
  );
}

function NavItem({ icon, label, active, onClick, isDarkMode }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${active ? "bg-[#00D9FF] text-black shadow-lg shadow-cyan-500/10" : isDarkMode ? "text-[#555] hover:text-white hover:bg-white/5" : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"}`}
    >
      {icon} <span>{label}</span>
    </button>
  );
}

function StatCard({ label, value, sub, icon, color, isDarkMode, onClick }) {
  const colorMap = { 
    cyan: 'text-[#00D9FF] bg-[#00D9FF]/10', 
    purple: 'text-[#A259FF] bg-[#A259FF]/10', 
    green: 'text-[#00FF85] bg-[#00FF85]/10' 
  };

  return (
    <div 
      onClick={onClick}
      className={`border p-6 lg:p-8 rounded-[24px] lg:rounded-[32px] flex items-center gap-4 lg:gap-6 transition-all ${
        onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-95' : ''
      } ${isDarkMode ? 'bg-[#0a0a0a] border-white/5 hover:border-white/10' : 'bg-white border-gray-100 shadow-sm hover:shadow-md'}`}
    >
      <div className={`p-3 lg:p-4 rounded-2xl ${colorMap[color]}`}>{icon}</div>
      <div className="text-left">
        <p className="text-[#555] text-[10px] lg:text-xs mb-1 uppercase tracking-widest font-bold">{label}</p>
        <h3 className={`text-xl lg:text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</h3>
        <p className={`text-[10px] mt-1 font-bold ${color === 'green' ? 'text-green-500' : 'text-[#00D9FF]'}`}>{sub}</p>
      </div>
    </div>
  );
}


function OrderRow({ table, dishes, total, status, isDarkMode }) {
  const colors = {
    "En cours": "text-blue-500 bg-blue-500/10",
    Prêt: "text-green-500 bg-green-500/10",
    Servi: "text-white/30 bg-white/5",
  };
  return (
    <div
      className={`flex items-center justify-between p-3 lg:p-4 border rounded-2xl transition-all ${isDarkMode ? "bg-white/[0.02] border-white/5" : "bg-gray-50 border-gray-100 hover:bg-white"}`}
    >
      <div className="flex items-center gap-4 text-left">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-[#00D9FF] ${isDarkMode ? "bg-white/5" : "bg-white shadow-sm"}`}
        >
          {table}
        </div>
        <div>
          <h4
            className={`font-bold text-sm ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            {dishes}
          </h4>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
            {total}
          </p>
        </div>
      </div>
      <span
        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${colors[status]}`}
      >
        {status}
      </span>
    </div>
  );
}

function PopularItem({ name, count, trend, isDarkMode }) {
  return (
    <div className="flex justify-between items-center group cursor-pointer text-left">
      <div>
        <h4
          className={`font-bold text-base group-hover:text-[#00D9FF] transition-colors ${isDarkMode ? "text-white" : "text-gray-800"}`}
        >
          {name}
        </h4>
        <p className="text-xs text-gray-500 font-medium">{count}</p>
      </div>
      <span
        className={`text-xs font-bold ${trend.startsWith("+") ? "text-green-500" : "text-red-500"}`}
      >
        {trend}
      </span>
    </div>
  );
}
