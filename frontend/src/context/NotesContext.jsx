import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [stats, setStats] = useState({ total: 0, archived: 0, favorites: 0, deleted: 0 });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('active'); // active, favorites, archived, trash
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, alphabetical, updated
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);

  const fetchNotes = useCallback(async () => {
    const token = localStorage.getItem('zen_token');
    if (!token) {
      setNotes([]);
      setStats({ total: 0, archived: 0, favorites: 0, deleted: 0 });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const params = {
        status: activeTab,
        search: searchQuery,
        category: selectedCategory,
        tag: selectedTag,
        sort: sortBy
      };
      const res = await api.get('/notes', { params });
      setNotes(res.data.data.notes);
      setStats(res.data.data.stats);
    } catch (err) {
      if (err.response?.status !== 401) {
        toast.error('Failed to load notes');
      }
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery, selectedCategory, selectedTag, sortBy]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = async (noteData) => {
    try {
      const res = await api.post('/notes', noteData);
      const newNote = res.data.data.note;
      setNotes(prev => [newNote, ...prev]);
      setStats(prev => ({ ...prev, total: prev.total + 1 }));
      toast.success('Note created successfully!');
      return newNote;
    } catch (err) {
      toast.error('Failed to create note');
      throw err;
    }
  };

  const updateNote = async (id, updatedFields) => {
    try {
      const res = await api.put(`/notes/${id}`, updatedFields);
      const updated = res.data.data.note;
      setNotes(prev => prev.map(n => (n.id === id ? updated : n)));
      toast.success('Note saved');
      return updated;
    } catch (err) {
      toast.error('Failed to update note');
      throw err;
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const res = await api.patch(`/notes/favorite/${id}`);
      const updated = res.data.data.note;
      setNotes(prev => prev.map(n => (n.id === id ? updated : n)));
      toast.success(updated.is_favorite ? 'Added to favorites' : 'Removed from favorites');
      fetchNotes();
    } catch (err) {
      toast.error('Failed to update favorite status');
    }
  };

  const toggleArchive = async (id) => {
    try {
      const res = await api.patch(`/notes/archive/${id}`);
      const updated = res.data.data.note;
      toast.success(updated.is_archived ? 'Note archived' : 'Note restored from archive');
      fetchNotes();
    } catch (err) {
      toast.error('Failed to archive note');
    }
  };

  const toggleTrash = async (id) => {
    try {
      const res = await api.delete(`/notes/${id}`);
      const updated = res.data.data.note;
      toast(
        (t) => (
          <div className="flex items-center justify-between gap-4">
            <span>{updated.is_deleted ? 'Note moved to trash' : 'Note restored'}</span>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                await restoreNote(id);
              }}
              className="px-2 py-1 bg-brand-600 text-white text-xs font-semibold rounded hover:bg-brand-700 transition"
            >
              Undo
            </button>
          </div>
        ),
        { duration: 4000 }
      );
      fetchNotes();
    } catch (err) {
      toast.error('Failed to update trash status');
    }
  };

  const restoreNote = async (id) => {
    try {
      await api.patch(`/notes/restore/${id}`);
      toast.success('Note restored');
      fetchNotes();
    } catch (err) {
      toast.error('Failed to restore note');
    }
  };

  const deletePermanent = async (id) => {
    try {
      await api.delete(`/notes/${id}/permanent`);
      toast.success('Note permanently deleted');
      setNotes(prev => prev.filter(n => n.id !== id));
      fetchNotes();
    } catch (err) {
      toast.error('Failed to delete note');
    }
  };

  const duplicateNote = async (id) => {
    try {
      const res = await api.post(`/notes/duplicate/${id}`);
      const copy = res.data.data.note;
      setNotes(prev => [copy, ...prev]);
      toast.success('Note duplicated!');
      fetchNotes();
    } catch (err) {
      toast.error('Failed to duplicate note');
    }
  };

  const openEditor = (note = null) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setEditingNote(null);
    setIsEditorOpen(false);
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        stats,
        loading,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedTag,
        setSelectedTag,
        sortBy,
        setSortBy,
        isEditorOpen,
        openEditor,
        closeEditor,
        editingNote,
        isShortcutsOpen,
        setIsShortcutsOpen,
        isImportExportOpen,
        setIsImportExportOpen,
        createNote,
        updateNote,
        toggleFavorite,
        toggleArchive,
        toggleTrash,
        restoreNote,
        deletePermanent,
        duplicateNote,
        refreshNotes: fetchNotes
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);
