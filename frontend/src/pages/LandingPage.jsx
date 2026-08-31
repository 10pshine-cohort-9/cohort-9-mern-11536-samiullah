import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Notebook,
  Zap,
  ShieldCheck,
  FileText,
  Lock,
  Layers,
  ArrowRight,
  Sun,
  Moon,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const LandingPage = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 glass-panel border-b border-slate-200/80 dark:border-slate-800/80 px-3 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white shadow-md sm:shadow-lg shadow-brand-500/25">
              <Notebook className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-lg sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-brand-600 via-purple-600 to-indigo-600 dark:from-brand-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              ZenNotes
            </span>
          </Link>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            {user ? (
              <Link
                to="/dashboard"
                className="whitespace-nowrap px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-md shadow-brand-500/20 hover:shadow-lg transition active:scale-95 flex items-center gap-1.5"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-3">
                <Link
                  to="/login"
                  className="whitespace-nowrap px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="whitespace-nowrap px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-md shadow-brand-500/20 hover:shadow-lg transition active:scale-95"
                >
                  <span className="hidden sm:inline">Get Started Free</span>
                  <span className="sm:hidden">Get Started</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col items-center text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider">
            <Notebook className="w-3.5 h-3.5" /> Next-Generation Workspace
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Organize thoughts cleanly with{' '}
            <span className="bg-gradient-to-r from-brand-600 via-purple-600 to-indigo-600 dark:from-brand-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Enterprise Elegance
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            A production-ready notes management platform featuring rich text editing, global search, color categorization, PDF/Markdown/CSV export, and JWT security.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to={user ? '/dashboard' : '/register'}
              className="px-8 py-4 bg-gradient-to-r from-brand-600 via-purple-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-brand-500/25 hover:shadow-2xl transition-all duration-200 active:scale-95 flex items-center gap-3 text-base"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-12">
          {[
            {
              icon: Zap,
              title: 'Rich Text & Hotkeys',
              desc: 'React Quill editor supporting headings, code blocks, lists, alignment, and keyboard shortcuts (Ctrl+N, Ctrl+F).',
              gradient: 'from-amber-500 to-orange-500'
            },
            {
              icon: Layers,
              title: 'Search & Tagging',
              desc: 'Instant debounced global search with category filtering, favorite pinning, archive bin, and trash restoration.',
              gradient: 'from-brand-500 to-indigo-500'
            },
            {
              icon: ShieldCheck,
              title: 'Enterprise Security',
              desc: 'Express.js MVC API with Pino logging, JWT token authentication, rate limiting, and dual MySQL/SQLite engine.',
              gradient: 'from-purple-500 to-pink-500'
            }
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="glass-card rounded-3xl p-6 text-left space-y-3 relative overflow-hidden"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feature.gradient} flex items-center justify-center text-white shadow-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{feature.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-200 dark:border-slate-800 py-6 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto items-center justify-between gap-4">
          <p>© 2026 ZenNotes Management System. Engineered for High Performance.</p>
        </div>
      </footer>
    </div>
  );
};
