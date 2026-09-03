import React from 'react';
import { useNotes } from '../context/NotesContext';
import { useAuth } from '../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FileText,
  Star,
  Archive,
  Trash2,
  User,
  Settings,
  Plus,
  Tag,
  Folder,
  SlidersHorizontal,
  LogOut
} from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab, stats, openEditor, selectedCategory, setSelectedCategory, setSelectedTag } = useNotes();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { id: 'active', label: 'All Notes', icon: FileText, count: stats.total },
    { id: 'favorites', label: 'Favorites', icon: Star, count: stats.favorites },
    { id: 'archived', label: 'Archived', icon: Archive, count: stats.archived },
    { id: 'trash', label: 'Trash Bin', icon: Trash2, count: stats.deleted }
  ];

  const categories = ['General', 'Work', 'Engineering', 'Personal', 'Ideas', 'Projects'];

  return (
    <aside className="w-64 shrink-0 glass-panel border-r border-slate-200/80 dark:border-slate-800/80 p-4 hidden md:flex flex-col justify-between min-h-[calc(100vh-61px)]">
      <div className="space-y-6">
        {/* Floating Quick Action */}
        <button
          onClick={() => openEditor()}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-brand-600 via-purple-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg shadow-brand-500/25 hover:shadow-xl transition-all duration-200 active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span>Create New Note</span>
        </button>

        {/* Primary Navigation */}
        <div className="space-y-1">
          <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
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
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${isActive
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isActive
                      ? 'bg-brand-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Category Filters */}
        <div className="space-y-1">
          <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Categories
          </p>
          <button
            onClick={() => setSelectedCategory('')}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition ${selectedCategory === '' ? 'text-brand-600 font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
          >
            • All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${selectedCategory === cat
                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                }`}
            >
              <Folder className="w-3.5 h-3.5 text-purple-500/70" />
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${isActive ? 'bg-slate-200/80 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`
          }
        >
          <User className="w-4 h-4 text-slate-400" />
          <span>Profile & Settings</span>
        </NavLink>

        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
