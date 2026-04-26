/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export const Badge = ({ tipo }: { tipo: "alto" | "baixo" | "normal" }) => {
  const map = {
    alto: "bg-red-50 text-red-600 border-red-100",
    baixo: "bg-blue-50 text-blue-600 border-blue-100",
    normal: "bg-emerald-50 text-emerald-600 border-emerald-100"
  };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[tipo]} capitalize`}>{tipo}</span>;
};
