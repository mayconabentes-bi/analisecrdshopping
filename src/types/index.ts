/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StoreStatus = "ativa" | "vaga";
export type StoreType = "Âncora" | "Satélite" | "Serviço";

export interface StoreData {
  id: string;
  loja: string;
  tipo: StoreType;
  area: number;
  condominio: number;
  status: StoreStatus;
  faturado: number;
  pago: number;
}

export interface AnalyticsStore extends StoreData {
  s_pago: number;
  custo_m2: number;
  inadimplencia: number;
  custo_ocupacao: number; // Manteve para legado, mas é o CTO
  cto: number; // Custo Total de Ocupação (%)
  crd_area: number; // Coeficiente de Rateio por Área (%)
  crd_financeiro: number; // Participação Financeira no Condomínio Total (%)
  breakEven: number;
  esforco: number;
  classe: "alto" | "baixo" | "normal";
  impacto: number;
}

export interface SimulationParams {
  reductionInadimp: number;
  occupancyGain: number;
  outlierBuffer: number;
}

export interface AnalyticsResult {
  data: AnalyticsStore[];
  mean: number;
  std: number;
  rankingImpacto: AnalyticsStore[];
  vacancia: number;
  totalArea: number;
}
