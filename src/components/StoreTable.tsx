/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Store } from "lucide-react";
import { Badge } from "./Badge";
import { AnalyticsStore } from "../types";
import { useDashboardStore } from "../store/useDashboardStore";

interface StoreTableProps {
  data: AnalyticsStore[];
}

export const StoreTable = ({ data }: StoreTableProps) => {
  const { selectedId, setSelectedId } = useDashboardStore();

  return (
    <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
        <h2 className="font-bold text-gray-800 flex items-center">
          <Store size={20} className="mr-2 text-indigo-500" />
          Base Operacional de Lojas
        </h2>
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">{data.length} Unidades</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-gray-400 uppercase text-[10px] tracking-widest font-bold">
              <th className="px-6 py-4">Unidade</th>
              <th className="px-6 py-4">Segmento</th>
              <th className="px-6 py-4">Área</th>
              <th className="px-6 py-4">Condomínio</th>
              <th className="px-6 py-4">Preço/m²</th>
              <th className="px-6 py-4 text-center">Peso no Fat.</th>
              <th className="px-6 py-4 text-center">Atrasos</th>
              <th className="px-6 py-4 text-center">Nível de Risco</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((d) => (
              <motion.tr 
                key={d.id}
                layoutId={d.id}
                onClick={() => setSelectedId(d.id)}
                className={`hover:bg-gray-100/50 cursor-pointer transition-colors ${selectedId === d.id ? 'bg-indigo-50/50' : ''}`}
              >
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">{d.loja}</div>
                  <div className="text-[10px] text-gray-400">ID: #{d.id}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">{d.tipo}</span>
                </td>
                <td className="px-6 py-4 font-medium">{d.area}m²</td>
                <td className="px-6 py-4 text-gray-600">R$ {d.condominio.toLocaleString()}</td>
                <td className="px-6 py-4 font-bold text-indigo-600">R$ {d.custo_m2.toFixed(2)}</td>
                <td className="px-6 py-4 text-center">
                  <div className={`text-xs font-black ${d.custo_ocupacao > 0.15 ? 'text-amber-500' : 'text-gray-900'}`}>
                    {(d.custo_ocupacao * 100).toFixed(1)}%
                  </div>
                  <div className="text-[9px] text-gray-400 uppercase font-bold">Peso</div>
                </td>
                <td className="px-6 py-4 text-center font-bold text-gray-600">
                  {(d.inadimplencia * 100).toFixed(0)}%
                </td>
                <td className="px-6 py-4 text-center">
                  <div className={`inline-block px-3 py-1 rounded-xl text-xs font-black ${
                    d.esforco > 7 ? 'bg-red-50 text-red-600 border border-red-100' : 
                    d.esforco > 4 ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                    'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  }`}>
                    {d.esforco.toFixed(1)}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
