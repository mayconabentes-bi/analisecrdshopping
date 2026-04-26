/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Store as StoreIcon } from "lucide-react";
import { useDashboardStore } from "../store/useDashboardStore";
import { StoreType, StoreStatus } from "../types";

export const AddStoreModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { addStore } = useDashboardStore();
  const [formData, setFormData] = useState({
    loja: "",
    tipo: "Satélite" as StoreType,
    area: "",
    condominio: "",
    status: "ativa" as StoreStatus,
    faturado: "",
    pago: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStore({
      id: Math.random().toString(36).substr(2, 9),
      loja: formData.loja,
      tipo: formData.tipo,
      area: Number(formData.area),
      condominio: Number(formData.condominio),
      status: formData.status,
      faturado: Number(formData.faturado),
      pago: Number(formData.pago),
    });
    onClose();
    setFormData({
      loja: "",
      tipo: "Satélite",
      area: "",
      condominio: "",
      status: "ativa",
      faturado: "",
      pago: "",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="fixed inset-0 m-auto w-full max-w-lg h-fit bg-white rounded-[2.5rem] shadow-2xl z-50 p-8 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                  <Plus size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Nova Unidade</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nome da Loja</label>
                <input 
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white outline-none transition-all"
                  value={formData.loja}
                  onChange={e => setFormData({...formData, loja: e.target.value})}
                  placeholder="Ex: Starbucks"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Tipo</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white outline-none transition-all appearance-none"
                    value={formData.tipo}
                    onChange={e => setFormData({...formData, tipo: e.target.value as StoreType})}
                  >
                    <option>Satélite</option>
                    <option>Âncora</option>
                    <option>Serviço</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Status</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white outline-none transition-all appearance-none"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as StoreStatus})}
                  >
                    <option value="ativa">Ativa</option>
                    <option value="vaga">Vaga</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Área (m²)</label>
                  <input 
                    type="number"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white outline-none transition-all"
                    value={formData.area}
                    onChange={e => setFormData({...formData, area: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Condomínio (R$)</label>
                  <input 
                    type="number"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white outline-none transition-all"
                    value={formData.condominio}
                    onChange={e => setFormData({...formData, condominio: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Faturado (R$)</label>
                  <input 
                    type="number"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white outline-none transition-all"
                    value={formData.faturado}
                    onChange={e => setFormData({...formData, faturado: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Pago (R$)</label>
                  <input 
                    type="number"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white outline-none transition-all"
                    value={formData.pago}
                    onChange={e => setFormData({...formData, pago: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full mt-4 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center space-x-2"
              >
                <Plus size={18} />
                <span>Salvar Unidade</span>
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
