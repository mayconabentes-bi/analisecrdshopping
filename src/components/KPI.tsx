/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown } from "lucide-react";

export const KPI = ({ label, value, icon: Icon, trend, simulatedDiff }: { label: string; value: string; icon: any; trend?: "up" | "down"; simulatedDiff?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-5 shadow-sm border border-gray-100 rounded-3xl bg-white relative overflow-hidden"
  >
    {simulatedDiff && (
      <div className="absolute top-0 right-0 p-1 px-3 bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-widest rounded-bl-xl">
        Projeção
      </div>
    )}
    <div className="flex justify-between items-start mb-2">
      <div className="p-2 bg-gray-50 rounded-xl">
        <Icon size={20} className="text-gray-600" />
      </div>
      {trend && (
        <span className={`flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {trend === 'up' ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
          2.4%
        </span>
      )}
    </div>
    <div className="text-sm text-gray-500 font-medium">{label}</div>
    <div className="flex items-baseline space-x-2">
      <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
      {simulatedDiff && (
        <div className="text-xs font-bold text-indigo-600 animate-pulse">
          ({simulatedDiff})
        </div>
      )}
    </div>
  </motion.div>
);
