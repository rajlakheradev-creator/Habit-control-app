// src/components/AchievementsModal.js
"use client";
import { X, Trophy, Lock, CheckCircle } from "lucide-react";

const ACHIEVEMENTS = [
  {
    id: "first_habit",
    name: "First Step",
    description: "Create your first habit",
    icon: "🎯",
    requirement: (stats) => stats.totalHabits >= 1,
    reward: 50,
  },
  {
    id: "complete_five",
    name: "Momentum Builder",
    description: "Complete 5 habits in one day",
    icon: "⚡",
    requirement: (stats) => stats.completedToday >= 5,
    reward: 100,
  },
  {
    id: "streak_master",
    name: "Streak Master",
    description: "Reach a 7-day streak on any habit",
    icon: "🔥",
    requirement: (stats) => stats.maxStreak >= 7,
    reward: 200,
  },
  {
    id: "collector",
    name: "Item Collector",
    description: "Purchase 5 items from the shop",
    icon: "🛍️",
    requirement: (stats) => stats.itemsPurchased >= 5,
    reward: 150,
  },
  {
    id: "habit_master",
    name: "Habit Master",
    description: "Maintain 10 active habits",
    icon: "🏆",
    requirement: (stats) => stats.totalHabits >= 10,
    reward: 250,
  },
  {
    id: "wealthy",
    name: "Credit Millionaire",
    description: "Earn 1000 total credits",
    icon: "💰",
    requirement: (stats) => stats.totalPointsEarned >= 1000,
    reward: 300,
  },
  {
    id: "dedicated",
    name: "Dedicated",
    description: "Complete 20 habits total",
    icon: "💪",
    requirement: (stats) => stats.completedToday >= 20,
    reward: 200,
  },
  {
    id: "inventory_full",
    name: "Hoarder",
    description: "Own 10 items in inventory",
    icon: "📦",
    requirement: (stats) => stats.inventorySize >= 10,
    reward: 250,
  },
  {
    id: "streak_legend",
    name: "Legendary Streak",
    description: "Reach a 30-day streak",
    icon: "🌟",
    requirement: (stats) => stats.maxStreak >= 30,
    reward: 500,
  },
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "Complete all habits in a day (10+)",
    icon: "✨",
    requirement: (stats) => stats.totalHabits >= 10 && stats.completedToday === stats.totalHabits,
    reward: 400,
  },
];

export default function AchievementsModal({ 
  isOpen, 
  onClose, 
  stats = {}, 
  unlockedAchievements = [], 
  onClaim 
}) {
  if (!isOpen) return null;

  const getAchievementStatus = (achievement) => {
    const isUnlocked = unlockedAchievements.includes(achievement.id);
    const isEligible = achievement.requirement(stats);
    
    return {
      isUnlocked,
      isEligible,
      canClaim: isEligible && !isUnlocked
    };
  };

  const achievementsWithStatus = ACHIEVEMENTS.map(achievement => ({
    ...achievement,
    ...getAchievementStatus(achievement)
  }));

  const claimedCount = achievementsWithStatus.filter(a => a.isUnlocked).length;
  const claimableCount = achievementsWithStatus.filter(a => a.canClaim).length;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-md p-4">
      <div className="bg-[#0f172a] border-2 border-yellow-500 rounded-lg p-4 md:p-6 w-full max-w-2xl relative shadow-[0_0_20px_rgba(234,179,8,0.5)] max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4 md:mb-6 border-b border-yellow-900 pb-3 md:pb-4">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-mono font-bold text-yellow-400 flex items-center gap-2">
              <Trophy className="w-5 h-5 md:w-6 md:h-6" />
              ACHIEVEMENTS
            </h2>
            <div className="flex flex-wrap gap-2 md:gap-3 text-xs text-yellow-600 mt-1">
              <span>Unlocked: {claimedCount}/{ACHIEVEMENTS.length}</span>
              {claimableCount > 0 && (
                <span className="text-green-400 animate-pulse">
                  🎁 {claimableCount} ready to claim!
                </span>
              )}
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-red-500 hover:text-red-400 ml-2 touch-feedback"
          >
            <X size={20} className="md:w-6 md:h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 md:mb-6">
          <div className="w-full h-3 bg-slate-800 border border-yellow-900 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-500"
              style={{ width: `${(claimedCount / ACHIEVEMENTS.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-center text-yellow-600 mt-1">
            {Math.round((claimedCount / ACHIEVEMENTS.length) * 100)}% Complete
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
          {achievementsWithStatus.map((achievement) => (
            <div
              key={achievement.id}
              className={`
                relative border p-3 md:p-4 rounded transition-all
                ${achievement.isUnlocked 
                  ? "border-green-500 bg-green-900/20" 
                  : achievement.canClaim
                  ? "border-yellow-500 bg-yellow-900/20 animate-pulse"
                  : "border-slate-700 bg-slate-900/50 opacity-60"
                }
              `}
            >
              {/* Icon */}
              <div className="text-3xl md:text-4xl mb-2 flex items-center justify-between">
                <span className="filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                  {achievement.icon}
                </span>
                {achievement.isUnlocked && (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                )}
                {!achievement.isEligible && !achievement.isUnlocked && (
                  <Lock className="w-5 h-5 text-slate-500" />
                )}
              </div>

              {/* Details */}
              <h3 className="font-mono font-bold text-sm md:text-base mb-1">
                {achievement.name}
              </h3>
              <p className="text-xs text-slate-400 mb-3">
                {achievement.description}
              </p>

              {/* Reward & Action */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-yellow-400 font-bold">
                  {achievement.reward} CR
                </span>
                
                {achievement.canClaim ? (
                  <button
                    onClick={() => onClaim(achievement.id, achievement.reward)}
                    className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold px-3 py-1 rounded text-xs transition-all active:scale-95 touch-feedback"
                  >
                    CLAIM
                  </button>
                ) : achievement.isUnlocked ? (
                  <span className="text-green-400 text-xs font-bold">
                    CLAIMED
                  </span>
                ) : (
                  <span className="text-slate-600 text-xs">
                    LOCKED
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-yellow-900 text-xs text-yellow-600 text-center">
          <p>💡 Complete challenges to unlock achievements and earn bonus credits</p>
        </div>
      </div>
    </div>
  );
}