/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, BookOpen, Target, BarChart, Download, FileSpreadsheet, AlertTriangle, FileText } from "lucide-react";

export const HelpCenter = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const instructions = [
    {
      icon: <Download size={20} className="text-blue-500" />,
      title: "01. Como Começar",
      content: "Use o botão 'Baixar Modelo' na tela inicial. Preencha os dados e importe. O sistema usa esses dados para criar o seu padrão de CRD."
    },
    {
      icon: <Target size={20} className="text-indigo-500" />,
      title: "02. Meta de Vendas p/ Saúde",
      content: "Calculamos quanto cada loja precisa vender para que o custo de ocupação seja de 15%. Se a loja vende menos que isso, ela está em zona de risco."
    },
    {
      icon: <AlertTriangle size={20} className="text-red-500" />,
      title: "03. Nível de Risco (0-10)",
      content: "É o nosso termômetro consolidado. Ele combina atrasos de pagamento com o peso do custo. Acima de 7.0, a loja precisa de atenção imediata."
    },
    {
      icon: <FileText size={20} className="text-red-600" />,
      title: "04. Tela de Auditoria",
      content: "Ao clicar em 'Relatório de Auditoria', abrimos uma tela exclusiva que isola as distorções que mais pesam no bolso do shopping (Pareto)."
    },
    {
      icon: <BarChart size={20} className="text-emerald-500" />,
      title: "05. Tolerância de Variação",
      content: "Use o slider lateral para ajustar o rigor. Se quiser ser mais rígido na auditoria, mova para a esquerda. Para focar só nos grandes erros, mova para a direita."
    },
    {
      icon: <FileSpreadsheet size={20} className="text-amber-500" />,
      title: "06. Integração Google",
      content: "Você pode conectar uma planilha Google Sheets. Lembre-se de usar o menu 'Arquivo > Compartilhar > Publicar na Web' no formato CSV."
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
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60]"
          />
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] p-8 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Guia de Uso</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Manual do Analista</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-8">
              {instructions.map((item, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="mt-1">{item.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
              <h4 className="font-bold text-sm text-gray-900 mb-2">Dica de Ouro:</h4>
              <p className="text-xs text-gray-500 leading-relaxed italic">
                "Foque nas unidades listadas em 'Focos de Auditoria'. Elas representam as maiores distorções do seu CRD e são onde você terá o melhor resultado em uma negociação."
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
