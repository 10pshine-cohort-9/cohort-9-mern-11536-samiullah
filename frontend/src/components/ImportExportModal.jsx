import React, { useState } from 'react';
import { useNotes } from '../context/NotesContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Upload, FileJson, FileCode, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const ImportExportModal = () => {
  const { isImportExportOpen, setIsImportExportOpen, notes, createNote } = useNotes();
  const [importing, setImporting] = useState(false);

  if (!isImportExportOpen) return null;

  // Export all notes as JSON file
  const exportAllJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `zennotes_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Notes backup JSON exported!');
  };

  // Import JSON notes file
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const importedNotes = JSON.parse(event.target.result);
        if (!Array.isArray(importedNotes)) {
          throw new Error('Invalid JSON format');
        }

        let count = 0;
        for (const item of importedNotes) {
          if (item.title) {
            await createNote({
              title: item.title,
              content: item.content || '',
              category: item.category || 'General',
              tags: item.tags || '',
              color: item.color || '#4f46e5'
            });
            count++;
          }
        }
        toast.success(`Successfully imported ${count} notes!`);
        setIsImportExportOpen(false);
      } catch (err) {
        toast.error('Failed to parse JSON file');
      } finally {
        setImporting(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg glass-panel rounded-3xl p-6 shadow-2xl space-y-6"
        >
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-brand-500" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Import & Export Workspace</h3>
            </div>
            <button
              onClick={() => setIsImportExportOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Export Option */}
            <div className="p-4 bg-slate-100/60 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between space-y-3">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-2">
                  <FileJson className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Export All Notes</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Download a complete backup JSON of all active notes.
                </p>
              </div>
              <button
                onClick={exportAllJson}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl transition shadow-sm"
              >
                Download JSON
              </button>
            </div>

            {/* Import Option */}
            <div className="p-4 bg-slate-100/60 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between space-y-3">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Import Notes File</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Restore or import notes from a previously saved JSON file.
                </p>
              </div>
              <label className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs rounded-xl transition shadow-sm text-center cursor-pointer block">
                {importing ? 'Importing...' : 'Select JSON File'}
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={importing}
                />
              </label>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
