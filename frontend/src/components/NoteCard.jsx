import React, { useState } from 'react';
import { useNotes } from '../context/NotesContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Archive,
  Trash2,
  Pin,
  MoreVertical,
  Copy,
  Edit3,
  RotateCcw,
  FileDown,
  FileCode,
  FileSpreadsheet
} from 'lucide-react';
import toast from 'react-hot-toast';

export const NoteCard = ({ note, viewMode = 'grid' }) => {
  const {
    openEditor,
    toggleFavorite,
    toggleArchive,
    toggleTrash,
    restoreNote,
    deletePermanent,
    duplicateNote,
    updateNote
  } = useNotes();
  const [showMenu, setShowMenu] = useState(false);

  // Helper to strip HTML tags for card preview text
  const stripHtml = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html || '';
    return tmp.textContent || tmp.innerText || '';
  };

  // Export to PDF
  const exportPdf = () => {
    try {
      import('html2pdf.js').then((html2pdfModule) => {
        const html2pdf = html2pdfModule.default;
        const element = document.createElement('div');
        element.style.padding = '20px';
        element.style.fontFamily = 'Arial, sans-serif';
        element.innerHTML = `
          <h1 style="color: #4f46e5; border-bottom: 2px solid #e0e7ff; padding-bottom: 8px;">${note.title}</h1>
          <p style="color: #64748b; font-size: 12px;">Category: ${note.category} | Created: ${new Date(note.created_at).toLocaleDateString()}</p>
          <div style="margin-top: 20px; line-height: 1.6;">${note.content}</div>
        `;
        const opt = {
          margin: 1,
          filename: `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().from(element).set(opt).save();
        toast.success('PDF download started!');
      });
    } catch (e) {
      toast.error('Failed to generate PDF');
    }
  };

  // Export to Markdown
  const exportMarkdown = () => {
    const mdText = `# ${note.title}\n\n**Category:** ${note.category}\n**Created:** ${new Date(note.created_at).toLocaleDateString()}\n\n---\n\n${stripHtml(note.content)}`;
    const blob = new Blob([mdText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    link.click();
    toast.success('Markdown downloaded!');
  };

  // Export to CSV
  const exportCsv = () => {
    const csvContent = `data:text/csv;charset=utf-8,ID,Title,Category,Tags,Content,Created\n"${note.id}","${note.title.replace(/"/g, '""')}","${note.category}","${note.tags}","${stripHtml(note.content).replace(/"/g, '""')}","${note.created_at}"`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV downloaded!');
  };

  const tagList = note.tags ? note.tags.split(',').filter(t => t.trim()) : [];
  const previewText = stripHtml(note.content);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`group glass-card rounded-2xl p-4 flex flex-col justify-between relative transition-all duration-200 border-l-4 ${
        viewMode === 'list' ? 'flex-row items-center py-3' : 'h-64'
      }`}
      style={{ borderLeftColor: note.color || '#4f46e5' }}
    >
      {/* Note Header */}
      <div className="w-full">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            {note.is_pinned === 1 && (
              <span className="p-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-md" title="Pinned Note">
                <Pin className="w-3.5 h-3.5 fill-amber-500/20" />
              </span>
            )}
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {note.category || 'General'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleFavorite(note.id)}
              className={`p-1.5 rounded-lg transition ${
                note.is_favorite
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                  : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={note.is_favorite ? 'Remove Favorite' : 'Mark Favorite'}
            >
              <Star className={`w-4 h-4 ${note.is_favorite ? 'fill-amber-500' : ''}`} />
            </button>

            {/* Action Menu Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 5 }}
                    className="absolute right-0 mt-1 w-48 glass-panel rounded-2xl shadow-xl p-1.5 z-40 text-xs space-y-0.5"
                  >
                    {!note.is_deleted ? (
                      <>
                        <button
                          onClick={() => { setShowMenu(false); openEditor(note); }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-brand-500" /> Edit Note
                        </button>

                        <button
                          onClick={() => { setShowMenu(false); updateNote(note.id, { is_pinned: !note.is_pinned }); }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          <Pin className="w-3.5 h-3.5 text-amber-500" /> {note.is_pinned ? 'Unpin Note' : 'Pin to Top'}
                        </button>

                        <button
                          onClick={() => { setShowMenu(false); duplicateNote(note.id); }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          <Copy className="w-3.5 h-3.5 text-indigo-500" /> Duplicate
                        </button>

                        <button
                          onClick={() => { setShowMenu(false); toggleArchive(note.id); }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          <Archive className="w-3.5 h-3.5 text-amber-600" /> {note.is_archived ? 'Unarchive' : 'Archive'}
                        </button>

                        <div className="border-t border-slate-200 dark:border-slate-800 my-1"></div>

                        <button
                          onClick={() => { setShowMenu(false); exportPdf(); }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          <FileDown className="w-3.5 h-3.5 text-rose-500" /> Export PDF
                        </button>
                        <button
                          onClick={() => { setShowMenu(false); exportMarkdown(); }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          <FileCode className="w-3.5 h-3.5 text-sky-500" /> Export Markdown
                        </button>
                        <button
                          onClick={() => { setShowMenu(false); exportCsv(); }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" /> Export CSV
                        </button>

                        <div className="border-t border-slate-200 dark:border-slate-800 my-1"></div>

                        <button
                          onClick={() => { setShowMenu(false); toggleTrash(note.id); }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Move to Trash
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => { setShowMenu(false); restoreNote(note.id); }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Restore Note
                        </button>
                        <button
                          onClick={() => { setShowMenu(false); deletePermanent(note.id); }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition font-medium"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete Permanently
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Title */}
        <h4
          onClick={() => !note.is_deleted && openEditor(note)}
          className="text-base font-bold text-slate-900 dark:text-slate-100 hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer line-clamp-1 transition"
        >
          {note.title}
        </h4>

        {/* Preview Content */}
        <p
          onClick={() => !note.is_deleted && openEditor(note)}
          className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-3 cursor-pointer leading-relaxed"
        >
          {previewText || 'No content...'}
        </p>
      </div>

      {/* Note Footer */}
      <div className="w-full mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 overflow-hidden">
          {tagList.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 truncate"
            >
              #{tag.trim()}
            </span>
          ))}
          {tagList.length > 3 && (
            <span className="text-[10px] text-slate-400">+{tagList.length - 3}</span>
          )}
        </div>

        <span className="text-[10px] text-slate-400 shrink-0">
          {new Date(note.updated_at || note.created_at).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
          })}
        </span>
      </div>
    </motion.div>
  );
};
