/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, FileText, TrendingDown, AlertCircle, CheckCircle2, Printer, Download } from "lucide-react";
import { AnalyticsResult } from "../types";
import { exportToPDF } from "../utils/export";

interface AuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analytics: AnalyticsResult;
}

export const AuditReportModal = ({ isOpen, onClose, analytics }: AuditReportModalProps) => {
  const outliers = analytics.data.filter(d => d.impacto > 0).sort((a, b) => b.impacto - a.impacto);
  const totalImpacto = outliers.reduce((acc, d) => acc + d.impacto, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[80]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="fixed inset-0 m-auto w-full max-w-5xl h-[90vh] bg-white rounded-[3rem] shadow-2xl z-[90] overflow-hidden flex flex-col"
          >
            {/* Header Relatório */}
            <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-100">
                  <FileText size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Relatório Axioma • Auditoria de CRD</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Inteligência de Mercado e Desenvolvimento de Soluções</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => exportToPDF(analytics)}
                  className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  <Download size={18} />
                  <span>Exportar PDF</span>
                </button>
                <button onClick={onClose} className="p-3 hover:bg-gray-200 rounded-full text-gray-400 transition-colors">
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Conteúdo Relatório */}
            <div className="flex-1 overflow-y-auto p-10 space-y-10">
              
              {/* Resumo Executivo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-red-50 rounded-3xl border border-red-100">
                  <div className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2">Impacto Total Identificado</div>
                  <div className="text-3xl font-black text-red-600">R$ {totalImpacto.toLocaleString()}</div>
                  <div className="text-xs text-red-400 mt-1 font-medium italic">Potencial de recuperação mensal</div>
                </div>
                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Distorção Média</div>
                  <div className="text-3xl font-black text-gray-900">R$ {analytics.std.toFixed(2)}</div>
                  <div className="text-xs text-gray-400 mt-1 font-medium italic">Variação padrão do custo/m²</div>
                </div>
                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Unidades em Risco</div>
                  <div className="text-3xl font-black text-gray-900">{outliers.length}</div>
                  <div className="text-xs text-gray-400 mt-1 font-medium italic">Focos de auditoria imediata</div>
                </div>
              </div>

              {/* Lista de Distorções */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <TrendingDown size={20} className="mr-2 text-red-500" />
                  Detalhamento de Unidades Fora do Padrão
                </h3>
                <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <th className="px-6 py-4">Unidade</th>
                        <th className="px-6 py-4">Preço/m²</th>
                        <th className="px-6 py-4">Variação vs Média</th>
                        <th className="px-6 py-4 text-right">Impacto Financeiro</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {outliers.map((d) => (
                        <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-gray-900">{d.loja}</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase">{d.tipo}</div>
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-600">R$ {d.custo_m2.toFixed(2)}</td>
                          <td className="px-6 py-4">
                             <span className="text-red-500 font-bold">+{((d.custo_m2 / analytics.mean - 1) * 100).toFixed(1)}%</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-sm font-black text-red-600">R$ {d.impacto.toLocaleString()}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recomendações */}
              <div className="bg-indigo-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <CheckCircle2 size={24} className="mr-3 text-indigo-300" />
                    Parecer de Auditoria (Recomendações)
                  </h3>
                  <ul className="space-y-4 text-indigo-100 text-sm">
                    <li className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-indigo-800 flex items-center justify-center text-[10px] font-bold mr-3 mt-0.5">01</div>
                      <p>Priorizar negociação com as <strong>Top 3 unidades</strong> da lista acima para ajuste imediato de coeficiente de rateio.</p>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-indigo-800 flex items-center justify-center text-[10px] font-bold mr-3 mt-0.5">02</div>
                      <p>Auditar faturamento informado das lojas com <strong>Nível de Risco alto</strong> para validar o Peso no Fat.</p>
                    </li>
                  </ul>
                </div>
                <div className="absolute top-0 right-0 p-10 opacity-10">
                  <AlertCircle size={150} />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
