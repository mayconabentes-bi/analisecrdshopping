/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Store, X, ChevronRight } from "lucide-react";
import { AnalyticsStore } from "../types";
import { useDashboardStore } from "../store/useDashboardStore";

interface StoreDetailProps {
  store: AnalyticsStore | null;
}

export const StoreDetail = ({ store }: StoreDetailProps) => {
  const { setSelectedId } = useDashboardStore();

  return (
    <AnimatePresence>
      {store && (
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100 shadow-2xl p-8 rounded-t-[3rem]"
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-indigo-500">
                  <Store size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{store.loja}</h2>
                  <p className="text-gray-500 font-medium">{store.tipo} • ID #{store.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedId(null)}
                className="p-3 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-1">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Meta de Vendas p/ Saúde</div>
                <div className="text-xl font-black text-indigo-600">R$ {store.breakEven.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                <div className="text-[9px] text-gray-400 font-bold uppercase italic">Vendas ideais para o lojista</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Vendas Atuais</div>
                <div className="text-xl font-bold">R$ {store.faturado.toLocaleString()}</div>
                <div className={`text-[9px] font-black uppercase ${store.faturado >= store.breakEven ? 'text-emerald-500' : 'text-red-500'}`}>
                  {store.faturado >= store.breakEven ? 'Operação Saudável' : `Faltam: R$ ${(store.breakEven - store.faturado).toLocaleString()}`}
                </div>
              </div>
              <div className="space-y-1 border-l border-gray-100 pl-8">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nível de Risco</div>
                <div className={`text-3xl font-black ${store.esforco > 7 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {store.esforco.toFixed(1)}
                </div>
              </div>
              <div className="space-y-1 text-right">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ajuste de Custo (CRD)</div>
                <div className={`text-3xl font-black ${store.impacto > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {store.impacto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
              </div>
            </div>

            <div className="mt-10 flex space-x-4">
              <button className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center">
                Abrir histórico completo
                <ChevronRight size={18} className="ml-1" />
              </button>
              <button className="flex-1 py-4 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-2xl font-bold transition-all">
                Notificar Lojista
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
