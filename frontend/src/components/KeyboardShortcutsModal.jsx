import React, { useEffect } from 'react';
import { useNotes } from '../context/NotesContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Command, Keyboard } from 'lucide-react';

export const KeyboardShortcutsModal = () => {
  const { isShortcutsOpen, setIsShortcutsOpen, openEditor } = useNotes();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        openEditor();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]');
        if (searchInput) searchInput.focus();
      } else if (e.key === 'Escape' && isShortcutsOpen) {
        setIsShortcutsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openEditor, isShortcutsOpen, setIsShortcutsOpen]);

  if (!isShortcutsOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + N', desc: 'Create a new note instantly' },
    { key: 'Ctrl + F', desc: 'Focus global search input' },
    { key: 'Esc', desc: 'Close any active modal or menu' }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md glass-panel rounded-3xl p-6 shadow-2xl space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Keyboard className="w-5 h-5 text-brand-500" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Keyboard Shortcuts</h3>
            </div>
            <button
              onClick={() => setIsShortcutsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {shortcuts.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-100/60 dark:bg-slate-800/50 rounded-xl">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.desc}</span>
                <kbd className="px-2.5 py-1 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-brand-600 dark:text-brand-400 shadow-sm">
                  {item.key}
                </kbd>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
