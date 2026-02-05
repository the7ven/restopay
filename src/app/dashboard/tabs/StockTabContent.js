"use client";

import React, { useState } from "react";
import {
  Package,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  ClipboardList,
} from "lucide-react";

export default function StockTabContent({ isDarkMode }) {
  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: "Riz Parfumé",
      category: "Épicerie",
      stock: 15,
      unit: "Sacs 25kg",
      minStock: 5,
    },
    {
      id: 2,
      name: "Poisson Capitaine",
      category: "Frais",
      stock: 8,
      unit: "kg",
      minStock: 10,
    },
    {
      id: 3,
      name: "Bouteille Gaz (B21)",
      category: "Énergie",
      stock: 1,
      unit: "Unité",
      minStock: 2,
    },
    {
      id: 4,
      name: "Huile de Palme",
      category: "Liquide",
      stock: 4,
      unit: "Bidons 20L",
      minStock: 2,
    },
    {
      id: 5,
      name: "Attiéké",
      category: "Frais",
      stock: 50,
      unit: "Boules",
      minStock: 20,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // --- LOGIQUE ACTIONS ---
  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem({
      name: "",
      category: "Épicerie",
      stock: 0,
      unit: "",
      minStock: 0,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Voulez-vous vraiment supprimer cet article ?")) {
      setInventory(inventory.filter((item) => item.id !== id));
    }
  };

  const getStatusColor = (item) => {
    if (item.stock <= item.minStock / 2)
      return "text-red-500 bg-red-500/10 border-red-500/20";
    if (item.stock <= item.minStock)
      return "text-orange-500 bg-orange-500/10 border-orange-500/20";
    return "text-green-500 bg-green-500/10 border-green-500/20";
  };

  const getStatusText = (item) => {
    if (item.stock <= item.minStock / 2) return "Critique";
    if (item.stock <= item.minStock) return "Alerte";
    return "Normal";
  };

  // --- CALCULS DES STATS ---
  const criticalCount = inventory.filter(
    (item) => item.stock <= item.minStock,
  ).length;

  return (
    <div className="fade-in text-left">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h3 className="text-3xl font-black italic tracking-tighter">
            Inventaire & Stocks
          </h3>
          <p className="opacity-50 text-sm font-light uppercase tracking-widest">
            Suivi des consommables et approvisionnement
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="bg-[#00D9FF] text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all flex items-center gap-3"
        >
          <Plus size={16} /> Ajouter un article
        </button>
      </div>

      {/* --- STATS RAPIDES (Remises ici) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StockStatCard
          isDarkMode={isDarkMode}
          label="Articles en Alerte"
          value={String(criticalCount).padStart(2, "0")}
          icon={<AlertTriangle className="text-red-500" />}
        />
        <StockStatCard
          isDarkMode={isDarkMode}
          label="Valeur estimée"
          value="450.000 F"
          icon={<Package className="text-[#00D9FF]" />}
        />
        <StockStatCard
          isDarkMode={isDarkMode}
          label="Dernier Arrivage"
          value="Ce matin"
          icon={<ClipboardList className="text-green-500" />}
        />
      </div>

      {/* --- TABLEAU --- */}
      <div
        className={`rounded-[40px] border overflow-hidden ${isDarkMode ? "bg-[#0a0a0a] border-white/5" : "bg-white border-gray-100 shadow-sm"}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className={`border-b ${isDarkMode ? "border-white/5" : "border-gray-50"}`}
              >
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-black opacity-40">
                  Produit
                </th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-black opacity-40">
                  Stock / Min
                </th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-black opacity-40">
                  Statut
                </th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-black opacity-40 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {inventory.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-white/[0.01] transition-colors"
                >
                  <td className="px-8 py-6">
                    <p className="font-black text-sm tracking-tight">
                      {item.name}
                    </p>
                    <p className="text-[10px] opacity-40 font-bold">
                      {item.category} • {item.unit}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <p className="font-black text-lg">{item.stock}</p>
                      <span className="text-[10px] opacity-30">
                        / min {item.minStock}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(item)}`}
                    >
                      {getStatusText(item)}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      {/* Bouton Modifier */}
                      <button
                        onClick={() => handleEdit(item)}
                        className={`p-2.5 rounded-xl transition-all ${
                          isDarkMode
                            ? "bg-white/5 text-white/40 hover:text-[#00D9FF] hover:bg-[#00D9FF]/10"
                            : "bg-gray-100 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 shadow-sm"
                        }`}
                      >
                        <Edit3 size={16} />
                      </button>

                      {/* Bouton Supprimer */}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className={`p-2.5 rounded-xl transition-all ${
                          isDarkMode
                            ? "bg-white/5 text-white/40 hover:text-red-500 hover:bg-red-500/10"
                            : "bg-gray-100 text-gray-500 hover:text-red-600 hover:bg-red-50 shadow-sm"
                        }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALE ÉDITION / AJOUT --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 backdrop-blur-xl bg-black/60">
          <div
            className={`w-full max-w-lg rounded-[45px] p-10 border shadow-2xl ${isDarkMode ? "bg-[#0a0a0a] border-white/10 text-white" : "bg-white border-gray-100"}`}
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black italic tracking-tighter">
                {editingItem?.id ? "Modifier l'article" : "Nouvel article"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="opacity-40 hover:opacity-100"
              >
                <X />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-4 text-left block">
                  Nom de l'article
                </label>
                <input
                  type="text"
                  defaultValue={editingItem?.name}
                  className={`w-full mt-2 px-6 py-4 rounded-2xl border outline-none ${isDarkMode ? "bg-white/5 border-white/10 focus:border-[#00D9FF]" : "bg-gray-50 border-gray-100"}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-4 text-left block">
                    Unité
                  </label>
                  <input
                    type="text"
                    defaultValue={editingItem?.unit}
                    className={`w-full mt-2 px-6 py-4 rounded-2xl border outline-none ${isDarkMode ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-4 text-left block">
                    Catégorie
                  </label>
                  <select
                    className={`w-full mt-2 px-6 py-4 rounded-2xl border outline-none ${isDarkMode ? "bg-[#151515] border-white/10" : "bg-gray-50 border-gray-100"}`}
                  >
                    <option>Épicerie</option>
                    <option>Frais</option>
                    <option>Énergie</option>
                    <option>Liquide</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-4 text-left block">
                    Stock Actuel
                  </label>
                  <input
                    type="number"
                    defaultValue={editingItem?.stock}
                    className={`w-full mt-2 px-6 py-4 rounded-2xl border outline-none ${isDarkMode ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-4 text-left block">
                    Stock d'alerte
                  </label>
                  <input
                    type="number"
                    defaultValue={editingItem?.minStock}
                    className={`w-full mt-2 px-6 py-4 rounded-2xl border outline-none ${isDarkMode ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl font-bold opacity-50 hover:opacity-100 transition-opacity"
                >
                  Annuler
                </button>
                <button className="flex-1 py-4 rounded-2xl font-black bg-[#00D9FF] text-black shadow-lg shadow-cyan-500/20">
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StockStatCard({ isDarkMode, label, value, icon }) {
  return (
    <div
      className={`p-6 rounded-[35px] border flex items-center gap-5 ${isDarkMode ? "bg-white/[0.02] border-white/5" : "bg-white border-gray-100 shadow-sm"}`}
    >
      <div
        className={`p-3.5 rounded-2xl ${isDarkMode ? "bg-white/5" : "bg-gray-50"}`}
      >
        {icon}
      </div>
      <div className="text-left">
        <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-black">
          {label}
        </p>
        <p className="text-2xl font-black italic tracking-tighter">{value}</p>
      </div>
    </div>
  );
}
