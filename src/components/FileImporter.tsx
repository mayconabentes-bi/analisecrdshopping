/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from "react";
import * as XLSX from "xlsx";
import { Upload, Download } from "lucide-react";
import { useDashboardStore } from "../store/useDashboardStore";
import { StoreData } from "../types";
import { downloadTemplate } from "../utils/export";

export const FileImporter = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setData } = useDashboardStore();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws) as any[];

      // Map dynamic data to StoreData structure
      const mappedData: StoreData[] = data.map((item, index) => ({
        id: item.id || item.ID || String(index + 1),
        loja: item.loja || item.Unidade || item.Nome || "Unidade " + (index + 1),
        tipo: (item.tipo || item.Tipo || "Satélite") as any,
        area: Number(item.area || item.Area || 0),
        condominio: Number(item.condominio || item.Condominio || item.Custo || 0),
        status: (item.status || item.Status || "ativa").toLowerCase() === "vaga" ? "vaga" : "ativa",
        faturado: Number(item.faturado || item.Faturado || item.Valor || 0),
        pago: Number(item.pago || item.Pago || 0),
      }));

      setData(mappedData);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={downloadTemplate}
        className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-transparent text-slate-500 rounded-xl text-[10px] font-bold hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-95 uppercase tracking-widest"
      >
        <Download size={14} />
        <span className="hidden sm:inline">Baixar Modelo</span>
      </button>

      <div className="h-10 w-[1px] bg-slate-200/50 hidden sm:block" />

      <label className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border-2 border-dashed border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 hover:border-indigo-300 transition-all active:scale-95 uppercase tracking-widest cursor-pointer">
        <Upload size={16} />
        <span className="hidden sm:inline">Importar Planilha</span>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept=".xlsx, .xls, .csv"
        />
      </label>
    </div>
  );
};
