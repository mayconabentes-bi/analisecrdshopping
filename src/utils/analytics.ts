/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StoreData, SimulationParams, AnalyticsResult, AnalyticsStore } from "../types";

export function computeAnalytics(data: StoreData[], simulation: SimulationParams): AnalyticsResult {
  // Pré-cálculo dos totais do shopping para as fórmulas de CRD
  const totalAreaShopping = data.reduce((acc, d) => acc + d.area, 0);
  const totalCondominioShopping = data.reduce((acc, d) => acc + d.condominio, 0);

  // Apply simulation to data
  const simulatedData: AnalyticsStore[] = data.map(d => {
    let s_pago = d.pago;
    let s_faturado = d.faturado;

    // Simulate reduction in delinquency (inadimplência = não pagou o condomínio todo)
    if (d.status === "ativa" && d.condominio > d.pago) {
      const devendo = d.condominio - d.pago;
      s_pago = d.pago + (devendo * (simulation.reductionInadimp / 100));
    }

    const custo_m2 = d.area ? d.condominio / d.area : 0;
    
    // Inadimplência: O quanto deixou de pagar do condomínio
    const inadimplencia = d.condominio > 0 ? 1 - (s_pago / d.condominio) : 0;
    
    // CTO (Custo Total de Ocupação): O peso do condomínio sobre as VENDAS (faturado da loja)
    const cto = d.faturado > 0 ? (d.condominio / d.faturado) : 0;
    const custo_ocupacao = cto; // Alias para compatibilidade legada

    // CRD (Coeficiente de Rateio de Despesas)
    // CRD por Área (O que deveria ser pago matematicamente)
    const crd_area = totalAreaShopping > 0 ? (d.area / totalAreaShopping) : 0;
    // CRD Financeiro (O que está efetivamente sendo cobrado no boleto)
    const crd_financeiro = totalCondominioShopping > 0 ? (d.condominio / totalCondominioShopping) : 0;

    // Ponto de Equilíbrio: Faturamento necessário para ter um CTO saudável de 15%
    const breakEven = d.condominio / 0.15;

    // Índice de Esforço (0-10): Combinação de CTO e Inadimplência
    const esforco = Math.min(10, (cto * 20) + (inadimplencia * 30));

    return {
      ...d,
      s_pago,
      custo_m2,
      inadimplencia,
      cto,
      custo_ocupacao,
      crd_area,
      crd_financeiro,
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

    // Distorção: Se o CRD Financeiro é maior que o CRD de Área, a loja está pagando proporcionalmente mais do que deveria (ou vice-versa dependendo do peso do tipo da loja)
    // Para simplificar a auditoria, impacto financeiro continua focado no custo/m2 outlier
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
