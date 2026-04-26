/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from "react";
import * as XLSX from "xlsx";
import { Upload } from "lucide-react";
import { useDashboardStore } from "../store/useDashboardStore";
import { StoreData } from "../types";

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
    <div className="flex items-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept=".xlsx, .xls, .csv"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
      >
        <Upload size={16} />
        <span>Importar Excel/CSV</span>
      </button>
    </div>
  );
};
