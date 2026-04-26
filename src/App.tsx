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
import { Plus, HelpCircle } from "lucide-react";

export default function Dashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
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
    <div className="bg-[#f8f9fb] min-h-screen text-gray-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <LayoutGrid size={22} />
          </div>
          <div>
            <h1 className="text-lg font-black leading-none tracking-tight">AXIOMA</h1>
            <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-[0.2em] font-bold italic">Inteligência de Mercado e Soluções</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative group">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar unidade..."
              className="pl-10 pr-4 py-1.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all w-48"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="h-8 w-[1px] bg-gray-100 mx-1" />

          <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:bg-white transition-all">
            <input 
              type="text" 
              placeholder="Link Google Sheets..."
              className="bg-transparent border-none text-xs focus:outline-none w-48"
              value={googleSheetUrl}
              onChange={(e) => setGoogleSheetUrl(e.target.value)}
            />
            <button 
              onClick={handleSyncGoogleSheet}
              className="ml-2 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider"
            >
              Sincronizar
            </button>
          </div>

          <div className="h-8 w-[1px] bg-gray-100 mx-1" />
          
          <FileImporter />

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-2xl text-sm font-bold hover:bg-indigo-100 transition-all shadow-sm"
          >
            <Plus size={16} />
            <span>Inserir Manual</span>
          </button>

          <div className="h-8 w-[1px] bg-gray-100 mx-2" />

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => exportToExcel(analytics)}
              className="px-4 py-2 bg-white border border-gray-100 text-gray-600 rounded-2xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all flex items-center"
            >
              Excel
            </button>
            <button 
              onClick={() => exportToPDF(analytics)}
              className="px-4 py-2 bg-gray-900 text-white rounded-2xl text-sm font-bold shadow-lg shadow-gray-200 hover:bg-black transition-all flex items-center"
            >
              Relatório PDF
            </button>

            <div className="h-8 w-[1px] bg-gray-100 mx-1" />

            <button 
              onClick={() => setIsHelpOpen(true)}
              className="flex items-center space-x-2 px-3 py-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"
            >
              <HelpCircle size={18} />
              <span className="text-xs font-bold">Ajuda</span>
            </button>

            <div className="h-8 w-[1px] bg-gray-100 mx-1" />

            <button 
              onClick={clearData}
              title="Limpar Dashboard"
              className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
            >
              <Trash2 size={20} />
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
                className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
              >
                Carregar Dados de Exemplo
              </button>
              <div className="h-12 w-[1px] bg-gray-100" />
              <button 
                onClick={downloadTemplate}
                className="px-6 py-3 bg-white border border-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center"
              >
                <Download size={18} className="mr-2" />
                Baixar Modelo
              </button>
              <FileImporter />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <StoreTable data={filteredData} />
          </div>

          {/* Sidebar Area: Simulation & Insights */}
          <aside className="space-y-6">
            
            {/* Simulation Panel */}
            <SimulationPanel />

            {/* Strategic: Distorções Críticas (Pareto) */}
            <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 flex items-center">
                  <TrendingDown size={18} className="mr-2 text-red-500" />
                  Focos de Auditoria
                </h3>
                <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">Prioridades</span>
              </div>
              <div className="space-y-3">
                {analytics.data
                  .filter(d => d.impacto > 0)
                  .sort((a, b) => b.impacto - a.impacto)
                  .slice(0, 4)
                  .map((d, i) => (
                    <div key={d.id} className="p-3 bg-red-50/50 rounded-2xl border border-red-100/30 group hover:bg-red-50 transition-all cursor-default">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-gray-900 truncate pr-2">{d.loja}</span>
                        <span className="text-[10px] font-black text-red-600">#{i+1}</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-[9px] text-gray-500 font-medium">Impacto Negativo</div>
                        <div className="text-sm font-black text-red-600">R$ {d.impacto.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                {analytics.data.filter(d => d.impacto > 0).length === 0 && (
                  <div className="text-center py-6 text-xs text-gray-400 italic">
                    Nenhuma distorção crítica identificada.
                  </div>
                )}
              </div>
              <button 
                onClick={() => setIsAuditModalOpen(true)}
                className="w-full mt-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-2xl text-[10px] font-bold transition-colors flex items-center justify-center uppercase tracking-widest"
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
    </div>
  );
}
