/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { SlidersHorizontal, Info } from "lucide-react";
import { useDashboardStore } from "../store/useDashboardStore";

export const SimulationPanel = () => {
  const { simulation, updateSimulation } = useDashboardStore();

  return (
    <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800 flex items-center">
          <SlidersHorizontal size={18} className="mr-2 text-indigo-500" />
          Simulação de Cenário
        </h3>
      </div>
      
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-tighter">
            <span>Recuperação Inadimp.</span>
            <span className="text-indigo-600">+{simulation.reductionInadimp}%</span>
          </div>
          <input 
            type="range" 
            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            min="0" max="100" step="5"
            value={simulation.reductionInadimp}
            onChange={(e) => updateSimulation({ reductionInadimp: parseInt(e.target.value) })}
          />
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-gray-900 block">Tolerância de Variação</span>
              <span className="text-[10px] text-gray-400 font-medium italic">Ajusta o rigor da identificação de distorções</span>
            </div>
            <span className={`text-xs font-black px-2 py-1 rounded-lg ${simulation.outlierBuffer > 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {simulation.outlierBuffer > 0 ? '+' : ''}{simulation.outlierBuffer}%
            </span>
          </div>
          <input 
            type="range" 
            min="-50" 
            max="100" 
            step="5"
            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            value={simulation.outlierBuffer}
            onChange={(e) => updateSimulation({ outlierBuffer: Number(e.target.value) })}
          />
          <div className="flex justify-between text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
            <span>Mais Rigoroso</span>
            <span>Mais Flexível</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-50">
        <div className="p-3 bg-indigo-50 rounded-2xl flex items-start space-x-3">
          <Info size={16} className="text-indigo-600 mt-1 flex-shrink-0" />
          <p className="text-[11px] text-indigo-800 leading-relaxed">
            Ajuste os parâmetros acima para projetar o impacto financeiro nas métricas consolidadas do dashboard.
          </p>
        </div>
      </div>
    </section>
  );
};
