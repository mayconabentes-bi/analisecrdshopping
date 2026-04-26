/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StoreData } from "../types";
import * as XLSX from "xlsx";

export async function fetchFromGoogleSheet(url: string): Promise<StoreData[]> {
  try {
    // Convert regular Google Sheet URL to CSV export URL
    // Format: https://docs.google.com/spreadsheets/d/ID/export?format=csv
    let exportUrl = url;
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    
    if (match && match[1]) {
      const sheetId = match[1];
      exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    }

    const response = await fetch(exportUrl);
    if (!response.ok) {
      throw new Error("Não foi possível acessar a planilha. Verifique se ela está pública.");
    }

    const csvText = await response.text();
    const workbook = XLSX.read(csvText, { type: "string" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(worksheet) as any[];

    return json.map((item, index) => ({
      id: item.id || item.ID || String(index + 1),
      loja: item.loja || item.Unidade || item.Nome || "Unidade " + (index + 1),
      tipo: (item.tipo || item.Tipo || "Satélite") as any,
      area: Number(item.area || item.Area || 0),
      condominio: Number(item.condominio || item.Condominio || item.Custo || 0),
      status: (item.status || item.Status || "ativa").toLowerCase() === "vaga" ? "vaga" : "ativa",
      faturado: Number(item.faturado || item.Faturado || item.Valor || 0),
      pago: Number(item.pago || item.Pago || 0),
    }));
  } catch (error) {
    console.error("Google Sheets Sync Error:", error);
    throw error;
  }
}
