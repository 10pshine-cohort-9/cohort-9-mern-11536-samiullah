import React from 'react';
import { useNotes } from '../context/NotesContext';
import { FileQuestion, Plus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const EmptyState = ({ title = "No notes found", description = "Get started by creating your first note." }) => {
  const { openEditor } = useNotes();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-3xl p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto my-12 space-y-4 border border-dashed border-slate-300 dark:border-slate-800"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-500/10 to-purple-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-inner">
        <FileQuestion className="w-8 h-8 stroke-[1.5]" />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">{description}</p>
      </div>

      <button
        onClick={() => openEditor()}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 text-white font-medium text-xs rounded-xl shadow-md shadow-brand-500/20 transition active:scale-95"
      >
        <Plus className="w-4 h-4" />
        <span>Create New Note</span>
      </button>
    </motion.div>
  );
};
