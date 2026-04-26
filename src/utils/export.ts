/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { AnalyticsResult, AnalyticsStore } from "../types";

export const exportToExcel = (analytics: AnalyticsResult) => {
  const worksheet = XLSX.utils.json_to_sheet(
    analytics.data.map((d) => ({
      Unidade: d.loja,
      Tipo: d.tipo,
      "Área (m²)": d.area,
      "Condomínio (R$)": d.condominio,
      "Custo/m² (R$)": d.custo_m2.toFixed(2),
      "Inadimplência (%)": (d.inadimplencia * 100).toFixed(1),
      Status: d.classe,
      "Impacto Financeiro (R$)": d.impacto.toFixed(2),
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Análise CRD");
  XLSX.writeFile(workbook, `Analise_CRD_Shopping_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportToPDF = (analytics: AnalyticsResult) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString("pt-BR");

  // Header
  doc.setFontSize(22);
  doc.setTextColor(20, 20, 20); // Darker
  doc.text("AXIOMA", 14, 22);
  
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("Inteligência de Mercado e Desenvolvimento de Soluções", 14, 28);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Data de Emissão: ${date}`, 14, 38);
  doc.text(`Custo Médio Geral: R$ ${analytics.mean.toFixed(2)} / m²`, 14, 43);

  // Table
  autoTable(doc, {
    startY: 50,
    head: [["Unidade", "Segmento", "Área", "Preço/m²", "Atrasos", "Risco", "Impacto"]],
    body: analytics.data.map((d) => [
      d.loja,
      d.tipo,
      `${d.area}m²`,
      `R$ ${d.custo_m2.toFixed(2)}`,
      `${(d.inadimplencia * 100).toFixed(0)}%`,
      d.esforco.toFixed(1),
      `R$ ${d.impacto.toFixed(0)}`,
    ]),
    headStyles: { fillColor: [79, 70, 229] },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    styles: { fontSize: 8 },
  });

  doc.save(`Relatorio_AXIOMA_${new Date().getTime()}.pdf`);
};

export const downloadTemplate = () => {
  const template = [
    {
      Unidade: "Loja Exemplo 01",
      Tipo: "Satélite",
      Area: 50,
      Condominio: 3500,
      Status: "ativa",
      Faturado: 3500,
      Pago: 3500
    },
    {
      Unidade: "Loja Exemplo 02 (Vaga)",
      Tipo: "Satélite",
      Area: 80,
      Condominio: 6000,
      Status: "vaga",
      Faturado: 0,
      Pago: 0
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(template);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Modelo CRD");
  XLSX.writeFile(workbook, "Modelo_Importacao_CRD.xlsx");
};
