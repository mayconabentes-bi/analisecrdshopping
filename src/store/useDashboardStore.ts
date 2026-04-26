/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreData, SimulationParams } from "../types";

interface DashboardState {
  // State
  data: StoreData[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedId: string | null;
  simulation: SimulationParams;
  googleSheetUrl: string;

  // Actions
  setData: (data: StoreData[]) => void;
  addStore: (store: StoreData) => void;
  setSearchTerm: (term: string) => void;
  setSelectedId: (id: string | null) => void;
  updateSimulation: (params: Partial<SimulationParams>) => void;
  setGoogleSheetUrl: (url: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loadSampleData: () => void;
  clearData: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      // Initial State
      data: [],
      loading: false,
      error: null,
      searchTerm: "",
      selectedId: null,
      googleSheetUrl: "",
      simulation: {
        reductionInadimp: 0,
        occupancyGain: 0,
        outlierBuffer: 0,
      },

      // Actions
      setData: (data) => set({ data, loading: false, error: null }),
  
      addStore: (store) => set((state) => ({ 
        data: [...state.data, store],
        loading: false,
        error: null
      })),

      setSearchTerm: (searchTerm) => set({ searchTerm }),
      
      setSelectedId: (selectedId) => set({ selectedId }),

      updateSimulation: (params) => set((state) => ({
        simulation: { ...state.simulation, ...params }
      })),

      setGoogleSheetUrl: (googleSheetUrl) => set({ googleSheetUrl }),
      
      setLoading: (loading) => set({ loading }),
      
      setError: (error) => set({ error }),

      loadSampleData: () => set({
        data: [
          { id: "1", loja: "Âncora Riachuelo", tipo: "Âncora", area: 2500, condominio: 45000, status: "ativa", faturado: 120000, pago: 110000 },
          { id: "2", loja: "Starbucks", tipo: "Satélite", area: 45, condominio: 6500, status: "ativa", faturado: 15000, pago: 15000 },
          { id: "3", loja: "Praça de Alimentação 01", tipo: "Serviço", area: 120, condominio: 8000, status: "vaga", faturado: 0, pago: 0 },
          { id: "4", loja: "Nike Store", tipo: "Satélite", area: 150, condominio: 12000, status: "ativa", faturado: 35000, pago: 28000 },
          { id: "5", loja: "Cinema IMAX", tipo: "Âncora", area: 3000, condominio: 55000, status: "ativa", faturado: 200000, pago: 200000 },
        ],
        loading: false,
        error: null
      }),

      clearData: () => set({
        data: [],
        selectedId: null,
        error: null,
        googleSheetUrl: ""
      }),
    }),
    {
      name: "crd-dashboard-storage", // key for localStorage
    }
  )
);
