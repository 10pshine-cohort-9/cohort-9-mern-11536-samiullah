import React from 'react';
import { motion } from 'framer-motion';

export const StatCard = ({ title, count, icon: Icon, color, gradient, onClick, isActive }) => {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`cursor-pointer glass-card rounded-2xl p-4 flex items-center justify-between relative overflow-hidden transition-all duration-200 ${
        isActive ? 'ring-2 ring-brand-500 shadow-md' : ''
      }`}
    >
      <div className="space-y-1 relative z-10">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{count}</h3>
      </div>
      <div
        className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${gradient} flex items-center justify-center text-white shadow-md relative z-10`}
      >
        <Icon className="w-5 h-5" />
      </div>
      {/* Soft Backdrop Glow */}
      <div className={`absolute -right-4 -bottom-4 w-20 h-20 bg-gradient-to-tr ${gradient} opacity-10 rounded-full blur-xl pointer-events-none`}></div>
    </motion.div>
  );
};
