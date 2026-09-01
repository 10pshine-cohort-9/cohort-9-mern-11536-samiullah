import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 text-slate-900 dark:text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 max-w-md"
      >
        <div className="relative inline-flex">
          <span className="text-[120px] font-extrabold bg-gradient-to-br from-brand-600 via-purple-600 to-indigo-600 dark:from-brand-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent leading-none">
            404
          </span>
          <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-purple-500 animate-spin" style={{ animationDuration: '4s' }} />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold">Page Not Found</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-purple-600 text-white font-bold text-sm rounded-xl shadow-lg transition active:scale-95"
          >
            <Home className="w-4 h-4" /> Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};
