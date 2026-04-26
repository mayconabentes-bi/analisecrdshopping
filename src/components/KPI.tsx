/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown } from "lucide-react";

export const KPI = ({ label, value, icon: Icon, trend, simulatedDiff }: { label: string; value: string; icon: any; trend?: "up" | "down"; simulatedDiff?: string }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-[0_10px_30px_rgba(79,70,229,0.08)] hover:border-indigo-100 transition-all duration-300 p-6 flex flex-col justify-between h-full min-h-[130px] relative overflow-hidden group"
  >
    <div className="absolute -top-4 -right-4 p-5 opacity-[0.02] group-hover:opacity-[0.05] group-hover:scale-110 transition-all duration-500">
      <Icon size={120} />
    </div>
    
    <div className="flex items-start justify-between relative z-10 mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 group-hover:scale-105 transition-all duration-300">
        <Icon size={22} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
      </div>
      {trend && (
        <span className={`flex items-center text-[10px] font-bold px-2.5 py-1 rounded-xl border ${
          trend === 'up' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
        }`}>
          {trend === 'up' ? '↑' : '↓'}
        </span>
      )}
    </div>

    <div className="relative z-10 mt-auto">
      <div className="text-[11px] font-bold text-slate-400 mb-1 line-clamp-1">{label}</div>
      <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1">
        <div className="text-2xl font-black text-slate-800 tracking-tight">{value}</div>
        {simulatedDiff && (
          <span className={`text-[11px] font-black animate-pulse px-2 py-0.5 rounded-lg ${simulatedDiff.includes('+') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
            {simulatedDiff}
          </span>
        )}
      </div>
    </div>
  </motion.div>
);
