// src/components/AnalyticsDashboard.js
"use client";
import { X, TrendingUp, Calendar, Award, Target } from "lucide-react";

export default function AnalyticsDashboard({ isOpen, onClose, habits = [] }) {
  if (!isOpen) return null;

  // Calculate statistics
  const totalHabits = habits.length;
  const completedHabits = habits.filter(h => h.completed).length;
  const completionRate = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;
  
  const totalStreaks = habits.reduce((sum, h) => sum + h.streak, 0);
  const avgStreak = totalHabits > 0 ? Math.round(totalStreaks / totalHabits) : 0;
  const maxStreak = Math.max(...habits.map(h => h.streak), 0);
  
  const habitsByStreak = [...habits].sort((a, b) => b.streak - a.streak);
  const topHabits = habitsByStreak.slice(0, 5);

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-md p-4">
      <div className="bg-[#0f172a] border-2 border-cyan-500 rounded-lg p-4 md:p-6 w-full max-w-3xl relative shadow-[0_0_20px_rgba(6,182,212,0.5)] max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4 md:mb-6 border-b border-cyan-900 pb-3 md:pb-4">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-mono font-bold text-cyan-400 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
              ANALYTICS
            </h2>
            <p className="text-xs text-cyan-600 mt-1">
              Performance Metrics & Insights
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-red-500 hover:text-red-400 ml-2 touch-feedback"
          >
            <X size={20} className="md:w-6 md:h-6" />
          </button>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          
          {/* Total Habits */}
          <div className="bg-slate-900/50 border border-cyan-800 p-3 md:p-4 rounded">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-cyan-600">TOTAL</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">{totalHabits}</p>
            <p className="text-[10px] text-slate-500 mt-1">Active Habits</p>
          </div>

          {/* Completion Rate */}
          <div className="bg-slate-900/50 border border-green-800 p-3 md:p-4 rounded">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-green-400" />
              <span className="text-xs text-green-600">TODAY</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">{completionRate}%</p>
            <p className="text-[10px] text-slate-500 mt-1">{completedHabits}/{totalHabits} Done</p>
          </div>

          {/* Average Streak */}
          <div className="bg-slate-900/50 border border-yellow-800 p-3 md:p-4 rounded">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-yellow-600">AVG</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">{avgStreak}</p>
            <p className="text-[10px] text-slate-500 mt-1">Avg Streak</p>
          </div>

          {/* Max Streak */}
          <div className="bg-slate-900/50 border border-orange-800 p-3 md:p-4 rounded">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-orange-600">MAX</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">{maxStreak}</p>
            <p className="text-[10px] text-slate-500 mt-1">Best Streak</p>
          </div>
        </div>

        {/* Completion Progress Bar */}
        <div className="mb-4 md:mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-mono text-cyan-400">Today's Progress</span>
            <span className="text-sm font-mono text-cyan-400">{completedHabits}/{totalHabits}</span>
          </div>
          <div className="w-full h-4 bg-slate-800 border border-cyan-900 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Top Performers */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <h3 className="text-sm md:text-base font-mono font-bold text-cyan-400 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" />
            TOP PERFORMERS
          </h3>
          
          {topHabits.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Target className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No habits yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {topHabits.map((habit, index) => (
                <div
                  key={habit.id}
                  className="bg-slate-900/50 border border-slate-700 p-3 rounded flex items-center justify-between hover:border-cyan-800 transition-all"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0
                      ${index === 0 ? 'bg-yellow-900 text-yellow-300 border border-yellow-600' :
                        index === 1 ? 'bg-slate-700 text-slate-300 border border-slate-500' :
                        index === 2 ? 'bg-orange-900 text-orange-300 border border-orange-600' :
                        'bg-slate-800 text-slate-400 border border-slate-600'}
                    `}>
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-mono text-sm font-bold text-white truncate">
                        {habit.name}
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        {habit.completed ? "✓ Completed" : "⏳ In Progress"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-lg font-bold text-cyan-400">{habit.streak}</p>
                    <p className="text-[9px] text-slate-500">STREAK</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-cyan-900 text-xs text-cyan-600 text-center">
          <p>💡 Complete habits daily to increase your streak and climb the ranks</p>
        </div>
      </div>
    </div>
  );
}