import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calculator, ArrowRight, Target, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface QuickCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalMallArea: number; // For CRD estimates if needed
}

export const QuickCalculatorModal = ({ isOpen, onClose, totalMallArea }: QuickCalculatorModalProps) => {
  const [faturamento, setFaturamento] = useState<string>('100000');
  const [condominio, setCondominio] = useState<string>('15000');
  const [area, setArea] = useState<string>('100');
  const [targetCto, setTargetCto] = useState<string>('15');

  if (!isOpen) return null;

  const numFaturamento = parseFloat(faturamento) || 0;
  const numCondominio = parseFloat(condominio) || 0;
  const numArea = parseFloat(area) || 0;
  const numTargetCto = parseFloat(targetCto) || 15;

  // Cálculos
  const ctoAtual = numFaturamento > 0 ? (numCondominio / numFaturamento) * 100 : 0;
  const precoM2 = numArea > 0 ? numCondominio / numArea : 0;
  
  // Ponto de Equilíbrio (Faturamento necessário para atingir o CTO alvo)
  const breakEvenFaturamento = numTargetCto > 0 ? numCondominio / (numTargetCto / 100) : 0;
  const gapFaturamento = breakEvenFaturamento - numFaturamento;

  // Condomínio Alvo (Qual deveria ser o condomínio para o faturamento atual bater o CTO alvo)
  const condominioAlvo = numFaturamento * (numTargetCto / 100);
  const gapCondominio = numCondominio - condominioAlvo;

  // CRD Simulado
  const crdArea = totalMallArea > 0 ? (numArea / totalMallArea) * 100 : 0;

  // Orientação Estratégica
  let statusColor = "text-emerald-600";
  let bgStatusColor = "bg-emerald-50 border-emerald-200";
  let Icon = CheckCircle2;
  let orientacao = "Parâmetros saudáveis. A loja opera com margem segura.";
  let planoAcao = "Manter acompanhamento padrão. Ideal para renovações com pequeno reajuste.";

  if (ctoAtual > 20) {
    statusColor = "text-red-600";
    bgStatusColor = "bg-red-50 border-red-200";
    Icon = AlertTriangle;
    orientacao = "Nível de Custo de Ocupação CRÍTICO. Risco iminente de quebra/inadimplência.";
    planoAcao = `Negociação de desconto temporário de R$ ${gapCondominio.toLocaleString(undefined, {minimumFractionDigits: 2})} no condomínio ou ação de marketing intensa para gerar +R$ ${gapFaturamento.toLocaleString(undefined, {minimumFractionDigits: 2})} em vendas.`;
  } else if (ctoAtual > numTargetCto) {
    statusColor = "text-amber-600";
    bgStatusColor = "bg-amber-50 border-amber-200";
    Icon = Target;
    orientacao = "Custo de Ocupação acima da meta. Loja pressionada.";
    planoAcao = `Monitorar vendas de perto. Faltam R$ ${gapFaturamento.toLocaleString(undefined, {minimumFractionDigits: 2})} em vendas para atingir o ponto de equilíbrio de ${numTargetCto}% de CTO.`;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] z-[101] overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-white/10 rounded-xl">
                  <Calculator size={20} className="text-indigo-300" />
                </div>
                <div>
                  <h2 className="text-lg font-black tracking-tight">Calculadora Estratégica</h2>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Simulador de Negociação & Planos de Ação</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 overflow-y-auto">
              {/* Entradas */}
              <div className="p-8 border-r border-slate-100 bg-slate-50/50 space-y-6">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>
                  Parâmetros da Unidade
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Área da Loja (m²)</label>
                    <input 
                      type="number"
                      value={area}
                      onChange={e => setArea(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Faturamento (R$)</label>
                      <input 
                        type="number"
                        value={faturamento}
                        onChange={e => setFaturamento(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Condomínio Atual (R$)</label>
                      <input 
                        type="number"
                        value={condominio}
                        onChange={e => setCondominio(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 mt-6">Meta CTO Saudável (%)</label>
                    <input 
                      type="number"
                      value={targetCto}
                      onChange={e => setTargetCto(e.target.value)}
                      className="w-full bg-indigo-50/50 border border-indigo-100 rounded-xl px-4 py-3 text-sm font-black focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-indigo-900"
                    />
                  </div>
                </div>
              </div>

              {/* Saídas e Orientação */}
              <div className="p-8 space-y-8 bg-white">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                  Análise & Orientação
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">CTO Projetado</div>
                    <div className={`text-2xl font-black ${ctoAtual > 20 ? 'text-red-600' : ctoAtual > numTargetCto ? 'text-amber-500' : 'text-emerald-600'}`}>
                      {ctoAtual.toFixed(1)}%
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">R$/m² Projetado</div>
                    <div className="text-2xl font-black text-slate-800">
                      R$ {precoM2.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Verdito Box */}
                <div className={`p-6 rounded-2xl border ${bgStatusColor} relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Icon size={100} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center space-x-2 mb-3">
                      <Icon size={18} className={statusColor} />
                      <span className={`text-[11px] font-black uppercase tracking-widest ${statusColor}`}>Diagnóstico</span>
                    </div>
                    <p className={`text-sm font-bold mb-4 ${statusColor}`}>
                      {orientacao}
                    </p>
                    
                    <div className="h-px w-full bg-black/5 my-4" />
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <ArrowRight size={14} className="text-slate-600" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Plano de Ação Sugerido</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {planoAcao}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Ponto de Equilíbrio: R$ {breakEvenFaturamento.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  {totalMallArea > 0 && <span>CRD Área: {crdArea.toFixed(2)}%</span>}
                </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
