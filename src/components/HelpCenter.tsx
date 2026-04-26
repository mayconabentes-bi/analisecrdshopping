/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, BookOpen, Calculator, Target, LayoutGrid, FileSpreadsheet, AlertTriangle, TrendingUp } from "lucide-react";

export const HelpCenter = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const instructions = [
    {
      icon: <FileSpreadsheet size={20} className="text-indigo-500" />,
      title: "01. Conceitos Fundamentais",
      content: "CTO (Custo de Ocupação) = Peso do condomínio no faturamento da loja (Ideal: < 15%). CRD (Rateio) = Parcela do condomínio paga. Se o CRD Financeiro for muito maior que o CRD Área, há distorção!"
    },
    {
      icon: <LayoutGrid size={20} className="text-slate-700" />,
      title: "02. Leitura da Tabela Operacional",
      content: "Números alinhados à direita seguem o padrão contábil. Lojas com CTO laranja (> 15%) estão sofrendo para pagar as contas. O Índice de Risco combina CTO alto com Inadimplência."
    },
    {
      icon: <Calculator size={20} className="text-emerald-500" />,
      title: "03. Simulador Estratégico (Obrigatório)",
      content: "Antes de ir para uma reunião com o lojista, clique em 'Simulador' no topo. Coloque as vendas atuais e o condomínio. A ferramenta dirá exatamente em Reais (R$) quanto ceder de desconto para evitar quebra."
    },
    {
      icon: <TrendingUp size={20} className="text-blue-500" />,
      title: "04. Painel de Simulação (Sidebar)",
      content: "Use os controles laterais para modelar o futuro do shopping. Ajuste a 'Recuperação de Atrasos' para prever a entrada de caixa e mexa na 'Tolerância' para apertar o cerco da auditoria."
    },
    {
      icon: <AlertTriangle size={20} className="text-red-500" />,
      title: "05. Focos de Auditoria (Ação Imediata)",
      content: "Atenção: A caixa vermelha à direita faz a análise de Pareto por você. Ela isola apenas as 4 lojas com maior distorção financeira por m² que puxam o lucro do shopping para baixo."
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] p-8 overflow-y-auto border-l border-slate-100"
          >
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manual do Analista</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Guia de Bolso CRD Analytics</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-8">
              {instructions.map((item, index) => (
                <div key={index} className="flex space-x-4 group">
                  <div className="mt-1 p-2 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors">{item.icon}</div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                <Target size={80} />
              </div>
              <h4 className="font-black text-[10px] text-indigo-600 mb-2 uppercase tracking-widest">Resumo de Ouro</h4>
              <p className="text-xs text-slate-700 leading-relaxed font-bold">
                "Nunca confie apenas no custo por m². Uma loja âncora sempre pagará menos por m², mas se o <span className="text-indigo-600">CTO estiver muito alto</span>, ela é um risco financeiro. Use o Simulador antes de aprovar qualquer renovação."
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
