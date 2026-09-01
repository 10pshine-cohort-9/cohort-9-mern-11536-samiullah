import React from 'react';

export const SkeletonLoader = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <div
          key={n}
          className="glass-card rounded-2xl p-4 h-64 flex flex-col justify-between animate-pulse border-l-4 border-slate-300 dark:border-slate-700"
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
              <div className="w-6 h-6 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
            </div>
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
            <div className="space-y-2 pt-2">
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
            </div>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-12"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
