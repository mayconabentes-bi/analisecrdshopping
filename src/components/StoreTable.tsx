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
    <div className="overflow-x-auto">
      <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
        <h2 className="font-black text-slate-800 flex items-center text-sm uppercase tracking-widest">
          <Store size={18} className="mr-3 text-indigo-500" />
          Base Operacional
        </h2>
        <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{data.length} Unidades</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-slate-400 uppercase text-[9px] tracking-widest font-black whitespace-nowrap">
              <th className="px-4 py-4">Unidade / Seg.</th>
              <th className="px-4 py-4 text-right">Área</th>
              <th className="px-4 py-4 text-right">Condomínio</th>
              <th className="px-4 py-4 text-right">R$/m²</th>
              <th className="px-4 py-4 text-center">CRD (%)</th>
              <th className="px-4 py-4 text-center">CTO (%)</th>
              <th className="px-4 py-4 text-center">Inadimp.</th>
              <th className="px-4 py-4 text-center">Risco</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 whitespace-nowrap">
            {data.map((d) => (
              <motion.tr 
                key={d.id}
                layoutId={d.id}
                onClick={() => setSelectedId(d.id)}
                className={`hover:bg-slate-50 cursor-pointer transition-colors ${selectedId === d.id ? 'bg-indigo-50/50' : ''}`}
              >
                <td className="px-4 py-4">
                  <div className="font-bold text-slate-900">{d.loja}</div>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-[10px] text-slate-400">#{d.id}</span>
                    <span className="text-[9px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">{d.tipo}</span>
                  </div>
                </td>
                <td className="px-4 py-4 font-medium text-slate-700 text-right">{d.area}m²</td>
                <td className="px-4 py-4 text-slate-600 text-right">R$ {d.condominio.toLocaleString()}</td>
                <td className="px-4 py-4 font-bold text-indigo-600 text-right">R$ {d.custo_m2.toFixed(2)}</td>
                <td className="px-4 py-4 text-center">
                  <div className="text-xs font-bold text-slate-700" title={`Área: ${(d.crd_area*100).toFixed(1)}%`}>
                    {(d.crd_financeiro * 100).toFixed(1)}%
                  </div>
                  <div className="text-[9px] text-slate-400 font-bold uppercase">Rateio</div>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className={`text-xs font-black ${d.cto > 0.15 ? 'text-amber-500' : 'text-slate-900'}`}>
                    {(d.cto * 100).toFixed(1)}%
                  </div>
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Faturam.</div>
                </td>
                <td className="px-4 py-4 text-center font-bold text-slate-600">
                  {(d.inadimplencia * 100).toFixed(0)}%
                </td>
                <td className="px-4 py-4 text-center">
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
    </div>
  );
};
