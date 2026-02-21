// src/components/AnalyticsDashboard.js

"use client";
import { X, TrendingUp, Calendar, Award, Target } from "lucide-react";

export default function AnalyticsDashboard({ isOpen, onClose, habits = [] }) {
  if (!isOpen) return null;

  const totalHabits    = habits.length;
  const completedHabits = habits.filter((h) => h.completed).length;
  const completionRate  = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  const totalStreaks = habits.reduce((sum, h) => sum + h.streak, 0);
  const avgStreak   = totalHabits > 0 ? Math.round(totalStreaks / totalHabits) : 0;
  const maxStreak   = Math.max(...habits.map((h) => h.streak), 0);

  const topHabits = [...habits].sort((a, b) => b.streak - a.streak).slice(0, 5);

  return (
    <div className="fixed inset-0 bg-black/90 flex items-end sm:items-center justify-center z-50 backdrop-blur-md p-0 sm:p-4">
      <div className="bg-[#0f172a] border-2 border-cyan-500 rounded-t-2xl sm:rounded-lg p-4 sm:p-6 w-full sm:max-w-3xl relative shadow-[0_0_20px_rgba(6,182,212,0.5)] max-h-[92vh] sm:max-h-[85vh] flex flex-col">

        {/* Drag handle */}
        <div className="sm:hidden w-10 h-1 bg-slate-600 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex justify-between items-start mb-4 border-b border-cyan-900 pb-4">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-mono font-bold text-cyan-400 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 flex-shrink-0" />
              ANALYTICS
            </h2>
            <p className="text-xs text-cyan-600 mt-1">Performance Metrics & Insights</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close analytics"
            className="text-red-500 hover:text-red-400 ml-2 p-1 touch-feedback"
          >
            <X size={20} />
          </button>
        </div>

        {/*
          Stat cards:
          - 2-col on all screen sizes (4 cards → 2×2)
          - Numbers use fluid sizing: text-2xl on mobile, text-3xl on sm+
          - Label text shrinks to avoid overflow on 360px phones
        */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 mb-4 sm:mb-6">

          <StatCard
            icon={<Target className="w-3.5 h-3.5 text-cyan-400" />}
            label="TOTAL"
            sublabel="Active Habits"
            value={totalHabits}
            borderColor="border-cyan-800"
          />
          <StatCard
            icon={<Calendar className="w-3.5 h-3.5 text-green-400" />}
            label="TODAY"
            sublabel={`${completedHabits}/${totalHabits} Done`}
            value={`${completionRate}%`}
            borderColor="border-green-800"
          />
          <StatCard
            icon={<Award className="w-3.5 h-3.5 text-yellow-400" />}
            label="AVG"
            sublabel="Avg Streak"
            value={avgStreak}
            borderColor="border-yellow-800"
          />
          <StatCard
            icon={<TrendingUp className="w-3.5 h-3.5 text-orange-400" />}
            label="BEST"
            sublabel="Best Streak"
            value={maxStreak}
            borderColor="border-orange-800"
          />
        </div>

        {/* Progress bar */}
        <div className="mb-4 sm:mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm font-mono text-cyan-400">Today's Progress</span>
            <span className="text-xs sm:text-sm font-mono text-cyan-400">{completedHabits}/{totalHabits}</span>
          </div>
          <div className="w-full h-3.5 bg-slate-800 border border-cyan-900 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Top performers */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <h3 className="text-sm sm:text-base font-mono font-bold text-cyan-400 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" />
            TOP PERFORMERS
          </h3>

          {topHabits.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Target className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No habits yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {topHabits.map((habit, index) => (
                <div
                  key={habit.id}
                  className="bg-slate-900/50 border border-slate-700 p-2.5 sm:p-3 flex items-center justify-between hover:border-cyan-800 transition-all"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                    <div
                      className={`
                        w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0
                        ${index === 0 ? "bg-yellow-900 text-yellow-300 border border-yellow-600"
                        : index === 1 ? "bg-slate-700 text-slate-300 border border-slate-500"
                        : index === 2 ? "bg-orange-900 text-orange-300 border border-orange-600"
                        :              "bg-slate-800 text-slate-400 border border-slate-600"}
                      `}
                    >
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-mono text-xs sm:text-sm font-bold text-white truncate">
                        {habit.name}
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        {habit.completed ? "✓ Completed" : "⏳ In Progress"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-base sm:text-lg font-bold text-cyan-400">{habit.streak}</p>
                    <p className="text-[9px] text-slate-500">STREAK</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="mt-4 pt-3 border-t border-cyan-900 text-[10px] text-cyan-600 text-center">
          💡 Complete habits daily to increase your streak and climb the ranks
        </p>
      </div>
    </div>
  );
}

/* Extracted stat card so the grid stays clean */
function StatCard({ icon, label, sublabel, value, borderColor }) {
  return (
    <div className={`bg-slate-900/50 border ${borderColor} p-3 sm:p-4 rounded`}>
      <div className="flex items-center gap-1.5 mb-2">
        {icon}
        <span className="text-[10px] sm:text-xs text-slate-400 font-mono">{label}</span>
      </div>
      {/* 
        text-2xl keeps numbers readable without overflow on 360px.
        tabular-nums stops layout shift as digits change.
      */}
      <p className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums leading-none">
        {value}
      </p>
      <p className="text-[10px] text-slate-500 mt-1">{sublabel}</p>
    </div>
  );
}
