import React, { useState } from 'react';
import { useNotes } from '../context/NotesContext';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { StatCard } from '../components/StatCard';
import { NoteCard } from '../components/NoteCard';
import { NoteEditorModal } from '../components/NoteEditorModal';
import { KeyboardShortcutsModal } from '../components/KeyboardShortcutsModal';
import { ImportExportModal } from '../components/ImportExportModal';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import {
  FileText,
  Star,
  Archive,
  Trash2,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Plus,
  Pin
} from 'lucide-react';

const ControlsBar = ({ headingTitle, noteCount, sortBy, setSortBy, viewMode, setViewMode }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
    <div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{headingTitle}</h2>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {noteCount} {noteCount === 1 ? 'note' : 'notes'} matching current filters
      </p>
    </div>

    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
        <SlidersHorizontal className="w-4 h-4 text-brand-500" />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
        >
          <option value="newest">Sort: Newest First</option>
          <option value="oldest">Sort: Oldest First</option>
          <option value="alphabetical">Sort: Alphabetical</option>
          <option value="updated">Sort: Recently Updated</option>
        </select>
      </div>

      <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
        <button
          onClick={() => setViewMode('grid')}
          className={`p-1.5 rounded-lg transition ${viewMode === 'grid'
              ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-600'
            }`}
          title="Grid View"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`p-1.5 rounded-lg transition ${viewMode === 'list'
              ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-600'
            }`}
          title="List View"
        >
          <List className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

const NotesGridContent = ({ loading, notes, pinnedNotes, otherNotes, activeTab, viewMode }) => {
  if (loading) {
    return <SkeletonLoader />;
  }

  if (notes.length === 0) {
    return <EmptyState />;
  }

  const isPinnedActive = pinnedNotes.length > 0 && activeTab === 'active';
  const displayNotes = isPinnedActive ? otherNotes : notes;
  const gridLayout = viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3';

  return (
    <div className="space-y-6">
      {isPinnedActive && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <Pin className="w-4 h-4" /> Pinned Notes ({pinnedNotes.length})
          </div>
          <div className={gridLayout}>
            {pinnedNotes.map((note) => (
              <NoteCard key={note.id} note={note} viewMode={viewMode} />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {isPinnedActive && (
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Other Notes ({otherNotes.length})
          </div>
        )}
        <div className={gridLayout}>
          {displayNotes.map((note) => (
            <NoteCard key={note.id} note={note} viewMode={viewMode} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const DashboardPage = () => {
  const {
    notes,
    stats,
    loading,
    activeTab,
    setActiveTab,
    sortBy,
    setSortBy,
    selectedCategory,
    setSelectedCategory,
    openEditor
  } = useNotes();
  const [viewMode, setViewMode] = useState('grid');

  const pinnedNotes = notes.filter((n) => n.is_pinned === 1 && !n.is_deleted);
  const otherNotes = notes.filter((n) => n.is_pinned !== 1);

  const getHeadingTitle = () => {
    if (activeTab === 'favorites') return 'Favorite Notes';
    if (activeTab === 'archived') return 'Archived Notes';
    if (activeTab === 'trash') return 'Trash Bin';
    return selectedCategory ? `${selectedCategory} Notes` : 'All Workspace Notes';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col selection:bg-brand-500 selection:text-white">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Top Dashboard Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Notes"
              count={stats.total}
              icon={FileText}
              gradient="from-brand-600 to-indigo-600"
              isActive={activeTab === 'active' && !selectedCategory}
              onClick={() => {
                setActiveTab('active');
                setSelectedCategory('');
              }}
            />
            <StatCard
              title="Favorites"
              count={stats.favorites}
              icon={Star}
              gradient="from-amber-500 to-orange-500"
              isActive={activeTab === 'favorites'}
              onClick={() => setActiveTab('favorites')}
            />
            <StatCard
              title="Archived"
              count={stats.archived}
              icon={Archive}
              gradient="from-purple-600 to-pink-600"
              isActive={activeTab === 'archived'}
              onClick={() => setActiveTab('archived')}
            />
            <StatCard
              title="Trash Bin"
              count={stats.deleted}
              icon={Trash2}
              gradient="from-rose-600 to-red-600"
              isActive={activeTab === 'trash'}
              onClick={() => setActiveTab('trash')}
            />
          </div>

          <ControlsBar
            headingTitle={getHeadingTitle()}
            noteCount={notes.length}
            sortBy={sortBy}
            setSortBy={setSortBy}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

          <NotesGridContent
            loading={loading}
            notes={notes}
            pinnedNotes={pinnedNotes}
            otherNotes={otherNotes}
            activeTab={activeTab}
            viewMode={viewMode}
          />
        </main>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => openEditor()}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-brand-600 to-purple-600 text-white flex items-center justify-center shadow-2xl shadow-brand-500/40 hover:scale-110 active:scale-95 transition duration-200"
        title="Create New Note"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>

      {/* Modals */}
      <NoteEditorModal />
      <KeyboardShortcutsModal />
      <ImportExportModal />
    </div>
  );
};
