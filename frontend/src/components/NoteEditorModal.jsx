import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useNotes } from '../context/NotesContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Save,
  Pin,
  Tag,
  Folder,
  Palette,
  Check,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

const COLOR_OPTIONS = [
  '#4f46e5', // Brand Indigo
  '#0284c7', // Sky Blue
  '#059669', // Emerald
  '#d97706', // Amber
  '#dc2626', // Rose
  '#9333ea', // Purple
  '#2563eb', // Royal Blue
  '#475569'  // Slate Gray
];

const CATEGORY_OPTIONS = ['General', 'Work', 'Engineering', 'Personal', 'Ideas', 'Projects'];

export const NoteEditorModal = () => {
  const { isEditorOpen, closeEditor, editingNote, createNote, updateNote } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [tags, setTags] = useState('');
  const [color, setColor] = useState('#4f46e5');
  const [isPinned, setIsPinned] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title || '');
      setContent(editingNote.content || '');
      setCategory(editingNote.category || 'General');
      setTags(editingNote.tags || '');
      setColor(editingNote.color || '#4f46e5');
      setIsPinned(editingNote.is_pinned === 1);
    } else {
      setTitle('');
      setContent('');
      setCategory('General');
      setTags('');
      setColor('#4f46e5');
      setIsPinned(false);
    }
  }, [editingNote, isEditorOpen]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please provide a note title');
      return;
    }

    setIsSaving(true);
    try {
      const notePayload = {
        title,
        content,
        category,
        tags,
        color,
        is_pinned: isPinned
      };

      if (editingNote) {
        await updateNote(editingNote.id, notePayload);
      } else {
        await createNote(notePayload);
      }
      setLastSaved(new Date().toLocaleTimeString());
      closeEditor();
    } catch (err) {
      // Error handled in context
    } finally {
      setIsSaving(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      [{ align: [] }],
      ['link', 'image'],
      ['clean']
    ]
  };

  if (!isEditorOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-3xl glass-panel rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20 dark:border-slate-800"
        >
          {/* Modal Header */}
          <div
            className="p-4 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80"
            style={{ borderTop: `4px solid ${color}` }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-500" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                {editingNote ? 'Edit Note' : 'Create New Note'}
              </h3>
              {lastSaved && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium ml-2">
                  Saved at {lastSaved}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPinned(!isPinned)}
                className={`p-2 rounded-xl transition ${isPinned
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                    : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                title={isPinned ? 'Unpin' : 'Pin Note'}
              >
                <Pin className={`w-4 h-4 ${isPinned ? 'fill-amber-500' : ''}`} />
              </button>
              <button
                onClick={closeEditor}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5 overflow-y-auto space-y-4 flex-1">
            {/* Title Input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note Title..."
              className="w-full text-2xl font-bold bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
            />

            {/* Controls Bar: Category, Tags, Color */}
            <div className="flex items-center gap-4 flex-wrap text-sm text-slate-600 dark:text-slate-400 pt-2 border-t border-b border-slate-100 dark:border-slate-800/80 py-3">
              {/* Category Selector */}
              <div className="flex items-center gap-1.5">
                <Folder className="w-4 h-4 text-purple-500" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tag Input */}
              <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
                <Tag className="w-4 h-4 text-brand-500" />
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Tags (comma separated)..."
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              {/* Color Label Picker */}
              <div className="flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-indigo-500" />
                <div className="flex items-center gap-1">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className="w-5 h-5 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                      style={{ backgroundColor: c }}
                    >
                      {color === c && <Check className="w-3 h-3 text-white stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Rich Text Editor */}
            <div className="bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={quillModules}
                placeholder="Write your note content here..."
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50">
            <button
              onClick={closeEditor}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 text-white font-medium text-sm rounded-xl shadow-md shadow-brand-500/20 hover:shadow-lg transition active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Note'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
