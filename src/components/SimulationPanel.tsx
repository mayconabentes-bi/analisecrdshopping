import React from "react";
import { TrendingUp, SlidersHorizontal, Info } from "lucide-react";
import { useDashboardStore } from "../store/useDashboardStore";

export const SimulationPanel = () => {
  const { simulation, updateSimulation } = useDashboardStore();

  return (
    <section className="bg-white border border-slate-100 rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(79,70,229,0.06)] hover:border-indigo-50 transition-all duration-300 p-6 space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
        <TrendingUp size={120} />
      </div>

      <div className="relative z-10">
        <h3 className="font-black text-slate-800 flex items-center text-sm uppercase tracking-widest mb-1">
          Projeções Estratégicas
        </h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Simulador de Cenários</p>
      </div>

      <div className="space-y-10 relative z-10">
        {/* Delinquency Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Recuperação de Atrasos</span>
              <span className="text-[10px] text-slate-400 font-medium italic">Reduzir dívida pendente</span>
            </div>
            <span className="text-xs font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-xl border border-emerald-100 shadow-sm">
              +{simulation.reductionInadimp}%
            </span>
          </div>
          <input 
            type="range" 
            min="0" max="100" step="5"
            className="w-full"
            value={simulation.reductionInadimp}
            onChange={(e) => updateSimulation({ reductionInadimp: Number(e.target.value) })}
          />
          <div className="flex justify-between text-[9px] text-slate-400 font-black uppercase tracking-widest">
            <span>Atual</span>
            <span>Meta 100%</span>
          </div>
        </div>

        {/* Outlier Tolerance Slider */}
        <div className="space-y-4 pt-4 border-t border-slate-50">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Tolerância de Variação</span>
              <span className="text-[10px] text-slate-400 font-medium italic">Rigor da auditoria</span>
            </div>
            <span className={`text-xs font-black px-3 py-1 rounded-xl border shadow-sm ${
              simulation.outlierBuffer > 0 ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
            }`}>
              {simulation.outlierBuffer > 0 ? '+' : ''}{simulation.outlierBuffer}%
            </span>
          </div>
          <input 
            type="range" 
            min="-50" 
            max="100" 
            step="5"
            className="w-full"
            value={simulation.outlierBuffer}
            onChange={(e) => updateSimulation({ outlierBuffer: Number(e.target.value) })}
          />
          <div className="flex justify-between text-[9px] text-slate-400 font-black uppercase tracking-widest">
            <span>Mais Rígido</span>
            <span>Mais Flexível</span>
          </div>
        </div>
      </div>

      <div className="pt-2 relative z-10">
        <div className="p-4 bg-slate-50/50 rounded-2xl flex items-start space-x-3 border border-slate-100/50">
          <Info size={14} className="text-slate-400 mt-1 flex-shrink-0" />
          <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
            Ajuste os parâmetros para projetar o impacto financeiro nas métricas consolidadas.
          </p>
        </div>
      </div>
    </section>
  );
};
