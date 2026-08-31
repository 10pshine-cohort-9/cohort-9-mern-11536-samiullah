import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotes } from '../context/NotesContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Sun,
  Moon,
  Bell,
  Command,
  Plus,
  User,
  LogOut,
  Sparkles,
  Download,
  HelpCircle,
  Menu,
  X,
  FileText,
  Star,
  Archive,
  Trash2,
  Folder
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const {
    searchQuery,
    setSearchQuery,
    openEditor,
    setIsShortcutsOpen,
    setIsImportExportOpen,
    activeTab,
    setActiveTab,
    stats,
    selectedCategory,
    setSelectedCategory,
    setSelectedTag
  } = useNotes();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const navigate = useNavigate();

  const navItems = [
    { id: 'active', label: 'All Notes', icon: FileText, count: stats.total },
    { id: 'favorites', label: 'Favorites', icon: Star, count: stats.favorites },
    { id: 'archived', label: 'Archived', icon: Archive, count: stats.archived },
    { id: 'trash', label: 'Trash Bin', icon: Trash2, count: stats.deleted }
  ];

  const categories = ['General', 'Work', 'Engineering', 'Personal', 'Ideas', 'Projects'];

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 px-3 sm:px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Section: Mobile Drawer Toggle & Logo */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
            className="p-1.5 md:hidden text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            title="Toggle Menu"
          >
            {isMobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/dashboard" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-brand-600 via-purple-600 to-indigo-600 dark:from-brand-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                ZenNotes
              </span>
              <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 rounded-md uppercase tracking-wider border border-brand-200/50 dark:border-brand-800/50 hidden xs:inline-block">
                Pro
              </span>
            </div>
          </Link>
        </div>

        {/* Global Search Bar (Desktop) */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes... (Ctrl+F)"
              className="w-full pl-10 pr-12 py-2 bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition"
            />
            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-200/60 dark:bg-slate-700/60 px-1.5 py-0.5 rounded border border-slate-300/40 dark:border-slate-600/40"
              title="Keyboard Shortcuts"
            >
              <Command className="w-3 h-3" /> F
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Mobile Search Button Toggle */}
          <button
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="p-2 md:hidden text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition"
            title="Search Notes"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Quick Create Note */}
          <button
            onClick={() => openEditor()}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 text-white font-medium text-xs sm:text-sm rounded-xl shadow-md shadow-brand-500/20 hover:shadow-lg transition-all duration-200 active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Note</span>
          </button>

          {/* Import / Export Trigger */}
          <button
            onClick={() => setIsImportExportOpen(true)}
            className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition"
            title="Import / Export Data"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
            </button>
            <AnimatePresence>
              {isNotifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-72 glass-panel rounded-2xl shadow-xl p-4 z-50 text-sm"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-2">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Notifications</span>
                    <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">All caught up</span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                    <p className="p-2 bg-slate-100 dark:bg-slate-800/50 rounded-lg">🚀 Welcome to ZenNotes! Try shortcuts Ctrl+N to quickly compose notes.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 pl-1 pr-1.5 py-1 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition"
            >
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.full_name || 'User'}`}
                alt="Avatar"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full ring-2 ring-brand-500/30 object-cover"
              />
              <span className="text-xs font-semibold max-w-[100px] truncate hidden lg:block text-slate-800 dark:text-slate-200">
                {user?.full_name}
              </span>
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl shadow-xl p-2 z-50 text-sm space-y-1"
                >
                  <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{user?.full_name}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <User className="w-4 h-4 text-brand-500" /> My Profile
                  </Link>
                  <button
                    onClick={() => { setIsMenuOpen(false); setIsShortcutsOpen(true); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <HelpCircle className="w-4 h-4 text-purple-500" /> Shortcuts
                  </button>
                  <div className="border-t border-slate-200 dark:border-slate-800 my-1"></div>
                  <button
                    onClick={() => { setIsMenuOpen(false); logout(); navigate('/'); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition font-medium"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Expansion */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden pt-2 px-1 overflow-hidden"
          >
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Drawer Overlay */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Slide-over Content */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-72 max-w-[80vw] glass-panel h-full p-4 flex flex-col justify-between z-10 overflow-y-auto"
            >
              <div className="space-y-6">
                {/* Header inside drawer */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-lg text-slate-900 dark:text-white">ZenNotes</span>
                  </div>
                  <button
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Create Note Quick Button */}
                <button
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    openEditor();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold rounded-xl text-sm shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Note</span>
                </button>

                {/* Views List */}
                <div className="space-y-1">
                  <p className="px-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Views
                  </p>
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setSelectedCategory('');
                          setSelectedTag('');
                          setIsMobileDrawerOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium text-xs transition ${
                          isActive
                            ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold border border-brand-500/20'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.count > 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Categories List */}
                <div className="space-y-1">
                  <p className="px-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Categories
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setIsMobileDrawerOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                      selectedCategory === '' ? 'text-brand-600 font-bold' : 'text-slate-500'
                    }`}
                  >
                    • All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsMobileDrawerOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
                        selectedCategory === cat
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Folder className="w-3.5 h-3.5 text-purple-500" />
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
                <Link
                  to="/profile"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400"
                >
                  <User className="w-4 h-4 text-slate-400" /> Profile & Settings
                </Link>
                <button
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
