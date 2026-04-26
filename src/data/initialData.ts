/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StoreData } from "../types";

export const INITIAL_DATA: StoreData[] = [
  { id: "1", loja: "Loja A", tipo: "Âncora", area: 100, condominio: 5000, status: "ativa", faturado: 5000, pago: 5000 },
  { id: "2", loja: "Loja B", tipo: "Satélite", area: 80, condominio: 6000, status: "ativa", faturado: 6000, pago: 3000 },
  { id: "3", loja: "Loja C", tipo: "Satélite", area: 120, condominio: 4000, status: "vaga", faturado: 0, pago: 0 },
  { id: "4", loja: "Loja D", tipo: "Serviço", area: 60, condominio: 5500, status: "ativa", faturado: 5500, pago: 5500 },
  { id: "5", loja: "Loja E", tipo: "Âncora", area: 150, condominio: 7000, status: "ativa", faturado: 7000, pago: 6500 },
  { id: "6", loja: "Loja F", tipo: "Satélite", area: 45, condominio: 3200, status: "vaga", faturado: 0, pago: 0 },
];
