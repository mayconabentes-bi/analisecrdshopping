/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from "react";
import { 
  BarChart3, 
  TrendingDown, 
  Search, 
  LayoutGrid,
  Info,
  Store,
  ArrowRight,
  Trash2,
  Download
} from "lucide-react";

// Store
import { useDashboardStore } from "./store/useDashboardStore";

// Services
import { fetchFromGoogleSheet } from "./services/googleSheets";

// Types
import { SimulationParams } from "./types";

// Utils
import { computeAnalytics } from "./utils/analytics";
import { exportToExcel, exportToPDF, downloadTemplate } from "./utils/export";

// Components
import { KPI } from "./components/KPI";
import { StoreTable } from "./components/StoreTable";
import { SimulationPanel } from "./components/SimulationPanel";
import { StoreDetail } from "./components/StoreDetail";
import { FileImporter } from "./components/FileImporter";
import { AddStoreModal } from "./components/AddStoreModal";
import { HelpCenter } from "./components/HelpCenter";
import { AuditReportModal } from "./components/AuditReportModal";
import { QuickCalculatorModal } from "./components/QuickCalculatorModal";
import { Plus, HelpCircle, Calculator } from "lucide-react";

export default function Dashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const { 
    data, 
    loading, 
    error, 
    searchTerm, 
    selectedId, 
    simulation,
    googleSheetUrl,
    setData,
    setSearchTerm,
    setGoogleSheetUrl,
    setLoading,
    setError,
    loadSampleData,
    clearData
  } = useDashboardStore();

  const handleSyncGoogleSheet = async () => {
    if (!googleSheetUrl) return;
    try {
      setLoading(true);
      const newData = await fetchFromGoogleSheet(googleSheetUrl);
      setData(newData);
    } catch (err: any) {
      setError(err.message || "Erro ao sincronizar planilha");
    } finally {
      setLoading(false);
    }
  };

  const baseAnalytics = useMemo(() => computeAnalytics(data, { reductionInadimp: 0, occupancyGain: 0, outlierBuffer: 0 }), [data]);
  const analytics = useMemo(() => computeAnalytics(data, simulation), [data, simulation]);

  const filteredData = analytics.data.filter(d => 
    d.loja.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const diffMean = analytics.mean - baseAnalytics.mean;
  const diffStd = analytics.std - baseAnalytics.std;
  const diffVacancia = analytics.vacancia - baseAnalytics.vacancia;

  const selectedStore = analytics.data.find(d => d.id === selectedId) || null;

  return (
    <div className="bg-[#fcfdfe] min-h-screen text-slate-900 font-sans selection:bg-indigo-100 relative overflow-x-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/50 to-transparent -z-10" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-6 py-4 flex justify-between items-center transition-all">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-md animate-float">
            <LayoutGrid size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black leading-none tracking-tight text-slate-900">CRD Analytics</h1>
            <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-[0.1em] font-bold">Axioma - Inteligência de Mercado e Desenvolvimento</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative group hidden md:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar unidade..."
              className="pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200/50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-300 transition-all w-48 font-medium text-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="h-8 w-[1px] bg-slate-200/50 hidden md:block" />

          <div className="flex items-center bg-slate-50/50 border border-slate-200/50 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:bg-white focus-within:border-indigo-300 transition-all hidden lg:flex">
            <input 
              type="text" 
              placeholder="Link Google Sheets..."
              className="bg-transparent border-none text-xs focus:outline-none w-40 font-medium text-slate-600"
              value={googleSheetUrl}
              onChange={(e) => setGoogleSheetUrl(e.target.value)}
            />
            <button 
              onClick={handleSyncGoogleSheet}
              className="ml-2 px-2 py-1 bg-slate-200 text-slate-600 rounded-lg text-[9px] font-bold hover:bg-slate-300 transition-colors uppercase tracking-widest"
            >
              Sync
            </button>
          </div>

          <div className="h-8 w-[1px] bg-slate-200/50 hidden lg:block" />
          
          <div className="hidden sm:block">
            <FileImporter />
          </div>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 hover:shadow-[0_10px_15px_-3px_rgba(199,210,254,0.5)] transition-all active:scale-95 shadow-sm"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Nova Unidade</span>
          </button>

          <div className="h-8 w-[1px] bg-slate-200/50" />

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsCalculatorOpen(true)}
              title="Calculadora Estratégica (Simulações)"
              className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 hover:text-indigo-700 transition-all active:scale-95 shadow-sm font-bold text-[10px] uppercase tracking-widest"
            >
              <Calculator size={16} />
              <span className="hidden sm:inline">Simulador</span>
            </button>

            <button 
              onClick={() => exportToPDF(analytics)}
              title="Exportar Relatório em PDF"
              className="inline-flex items-center justify-center p-2 bg-slate-900 text-white rounded-xl hover:bg-black hover:shadow-md transition-all active:scale-95 shadow-sm"
            >
              <Download size={16} />
            </button>

            <button 
              onClick={() => setIsHelpOpen(true)}
              title="Central de Ajuda"
              className="inline-flex items-center justify-center p-2 bg-transparent text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-95"
            >
              <HelpCircle size={18} />
            </button>

            <button 
              onClick={clearData}
              title="Limpar Dashboard"
              className="inline-flex items-center justify-center p-2 bg-transparent text-red-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all active:scale-95"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 font-medium animate-pulse">Sincronizando com Base Real-Time...</p>
          </div>
        ) : error ? (
          <div className="p-8 bg-red-50 border border-red-100 rounded-3xl text-center">
            <p className="text-red-600 font-bold">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-red-200"
            >
              Tentar Novamente
            </button>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200 shadow-inner">
            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-500 mb-6">
              <LayoutGrid size={40} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2 italic tracking-tighter">PLATAFORMA AXIOMA</h2>
            <p className="text-gray-500 max-w-md text-center mb-8">
              Para começar a análise, importe uma planilha local, conecte um Google Sheet ou use nossos dados de exemplo para testes.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={loadSampleData}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-black hover:shadow-[0_10px_15px_-3px_rgba(203,213,225,0.5)] transition-all active:scale-95 uppercase tracking-widest shadow-sm"
              >
                Carregar Dados de Exemplo
              </button>
              <div className="h-12 w-[1px] bg-slate-200/50" />
              <button 
                onClick={downloadTemplate}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 uppercase tracking-widest shadow-sm"
              >
                <Download size={18} />
                <span>Baixar Modelo</span>
              </button>
              <FileImporter />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-8">
              
              {/* KPIs Section */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <KPI 
                  label="Preço Médio por m²" 
                  value={`R$ ${analytics.mean.toFixed(2)}`} 
                  icon={BarChart3} 
                  simulatedDiff={diffMean !== 0 ? `R$ ${diffMean > 0 ? '+' : ''}${diffMean.toFixed(2)}` : undefined}
                />
                <KPI 
                  label="Variação entre Lojas" 
                  value={analytics.std.toFixed(2)} 
                  icon={Info} 
                  simulatedDiff={diffStd !== 0 ? `${diffStd > 0 ? '+' : ''}${diffStd.toFixed(2)}` : undefined}
                />
                <KPI 
                  label="Lojas Vazias" 
                  value={(analytics.vacancia * 100).toFixed(1) + "%"} 
                  icon={LayoutGrid} 
                  trend={analytics.vacancia > 0.1 ? "down" : "up"} 
                  simulatedDiff={diffVacancia !== 0 ? `${(diffVacancia * 100).toFixed(1)}%` : undefined}
                />
                <KPI label="Área Total" value={analytics.totalArea + "m²"} icon={Store} />
              </div>

              {/* Operacional: Tabela de Lojas */}
              <div className="bg-white border border-slate-100 rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(79,70,229,0.06)] hover:border-indigo-50 transition-all duration-300 overflow-hidden">
                <StoreTable data={filteredData} />
              </div>
            </div>

          {/* Sidebar Area: Simulation & Insights */}
          <aside className="space-y-6">
            
            {/* Simulation Panel */}
            <SimulationPanel />

            {/* Strategic: Distorções Críticas (Pareto) */}
            <section className="bg-white border border-slate-100 rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(79,70,229,0.06)] hover:border-indigo-50 transition-all duration-300 p-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                <TrendingDown size={80} />
              </div>
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="font-black text-slate-800 flex items-center text-sm uppercase tracking-widest">
                  <TrendingDown size={18} className="mr-3 text-red-500" />
                  Focos de Auditoria
                </h3>
              </div>
              <div className="space-y-3 relative z-10">
                {analytics.data
                  .filter(d => d.impacto > 0)
                  .sort((a, b) => b.impacto - a.impacto)
                  .slice(0, 4)
                  .map((d, i) => (
                    <div key={d.id} className="p-4 bg-red-50/50 rounded-2xl border border-red-100/30 group hover:bg-red-50 transition-all cursor-default">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-slate-900 truncate pr-2">{d.loja}</span>
                        <span className="text-[10px] font-black text-red-600">#{i+1}</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-[9px] text-slate-500 font-medium">Impacto Negativo</div>
                        <div className="text-sm font-black text-red-600">R$ {d.impacto.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                {analytics.data.filter(d => d.impacto > 0).length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-400 italic">
                    Nenhuma distorção crítica identificada.
                  </div>
                )}
              </div>
              <button 
                onClick={() => setIsAuditModalOpen(true)}
                className="w-full mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 uppercase tracking-widest shadow-sm relative z-10"
              >
                Relatório de Auditoria
                <ArrowRight size={14} className="ml-2" />
              </button>
            </section>

          </aside>
        </div>
        )}
      </main>

      {/* Drill-down Detail */}
      <StoreDetail store={selectedStore} />

      {/* Modals */}
      <AddStoreModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      <HelpCenter 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
      />

      <AuditReportModal 
        isOpen={isAuditModalOpen} 
        onClose={() => setIsAuditModalOpen(false)} 
        analytics={analytics}
      />
      <QuickCalculatorModal 
        isOpen={isCalculatorOpen} 
        onClose={() => setIsCalculatorOpen(false)} 
        totalMallArea={analytics.totalArea}
      />
    </div>
  );
}
