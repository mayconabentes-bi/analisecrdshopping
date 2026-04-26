/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StoreData, SimulationParams, AnalyticsResult, AnalyticsStore } from "../types";

export function computeAnalytics(data: StoreData[], simulation: SimulationParams): AnalyticsResult {
  // Apply simulation to data
  const simulatedData: AnalyticsStore[] = data.map(d => {
    let s_pago = d.pago;
    let s_faturado = d.faturado;

    // Simulate occupancy gain (vaca -> ativa)
    // (Logic can be expanded here in the future)

    // Simulate reduction in delinquency
    if (d.status === "ativa" && d.faturado > d.pago) {
      const devendo = d.faturado - d.pago;
      s_pago = d.pago + (devendo * (simulation.reductionInadimp / 100));
    }

    const custo_m2 = d.area ? d.condominio / d.area : 0;
    const inadimplencia = s_faturado ? 1 - s_pago / s_faturado : 0;
    
    // Custo de Ocupação: Quanto o custo fixo pesa no faturamento da loja
    const custo_ocupacao = d.faturado > 0 ? (d.condominio / d.faturado) : 0;

    // Ponto de Equilíbrio: Faturamento necessário para ter um O.C. saudável de 15%
    const breakEven = d.condominio / 0.15;

    // Índice de Esforço (0-10): Combinação de O.C. e Inadimplência
    // O.C. ideal < 15%, Crítico > 25%
    const esforco = Math.min(10, (custo_ocupacao * 20) + (inadimplencia * 30));

    return {
      ...d,
      s_pago,
      custo_m2,
      inadimplencia,
      custo_ocupacao,
      breakEven,
      esforco,
      classe: "normal", 
      impacto: 0        
    } as AnalyticsStore;
  });

  const values = simulatedData.map(d => d.custo_m2);
  const mean = values.reduce((a, b) => a + b, 0) / (values.length || 1);
  const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / Math.max(values.length - 1, 1);
  const std = Math.sqrt(variance) * (1 + simulation.outlierBuffer / 100);

  const classified = simulatedData.map(d => {
    let classe: "alto" | "baixo" | "normal" = "normal";
    if (d.custo_m2 > mean + std) classe = "alto";
    if (d.custo_m2 < mean - std) classe = "baixo";

    const diff = d.custo_m2 - mean;
    const impacto = diff * d.area;

    return { ...d, classe, impacto };
  });

  const rankingImpacto = [...classified].sort((a, b) => Math.abs(b.impacto) - Math.abs(a.impacto));
  
  const vacanciaArea = classified.filter(d => d.status === "vaga").reduce((acc, d) => acc + d.area, 0);
  const totalArea = classified.reduce((acc, d) => acc + d.area, 0);

  return {
    data: classified,
    mean,
    std,
    rankingImpacto,
    vacancia: totalArea ? vacanciaArea / totalArea : 0,
    totalArea
  };
}
