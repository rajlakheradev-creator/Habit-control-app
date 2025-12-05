// src/app/page.js - COMPLETE VERSION WITH ALL FEATURES

"use client";
import { useState } from "react";
import { useHabitTracker } from "../hooks/useHabitTracker";
import ShopModal from "../components/ShopModal";
import InventoryModal from "../components/InventoryModal";
import AchievementsModal from "../components/AchievementsModal";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import { Plus, Check, Trash2, Trophy, Cpu, Zap, Package, TrendingUp, Sparkles } from "lucide-react";

export default function Home() {
  const {
    habits,
    user,
    shop,
    stats,
    isLoaded,
    isGeneratingShop,
    addHabit,
    deleteHabit,
    completeHabit,
    buyItem,
    claimAchievement,
    refreshShop
  } = useHabitTracker();

  const [input, setInput] = useState("");
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-cyan-500 font-mono text-xl">
        <div className="flex flex-col items-center gap-4">
          <Cpu className="w-16 h-16 animate-spin" />
          <p className="animate-pulse">INITIALIZING SYSTEM...</p>
        </div>
      </div>
    );
  }

  const handleAdd = (e) => {
    e.preventDefault();
    if (input.trim()) {
      addHabit(input);
      setInput("");
      showNotification("DIRECTIVE REGISTERED", "success");
    }
  };

  const handleComplete = (id) => {
    completeHabit(id);
    showNotification("+50 CR EARNED", "success");
  };

  const handleBuy = (item) => {
    const success = buyItem(item);
    if (success) {
      showNotification(`ACQUIRED: ${item.name}`, "success");
      setTimeout(() => {
        setIsShopOpen(false);
        setIsInventoryOpen(true);
      }, 1500);
    } else {
      showNotification("INSUFFICIENT CREDITS", "error");
    }
  };

  const handleClaimAchievement = (achievementId, reward) => {
    const success = claimAchievement(achievementId, reward);
    if (success) {
      showNotification(`ACHIEVEMENT UNLOCKED! +${reward} CR`, "success");
    }
  };

  const handleRefreshShop = async () => {
    showNotification("REFRESHING MARKET...", "info");
    const success = await refreshShop();
    if (success) {
      showNotification("MARKET UPDATED", "success");
    } else {
      showNotification("REFRESH FAILED", "error");
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const completedCount = habits.filter((h) => h.completed).length;
  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
  const unlockedCount = user.unlockedAchievements?.length || 0;

  return (
    <main className="min-h-screen p-3 md:p-8 flex flex-col items-center max-w-4xl mx-auto font-mono">
      
      {/* Notification Toast - Mobile Friendly */}
      {notification && (
        <div
          className={`fixed z-50 px-4 py-3 md:px-6 rounded-none border-2 font-bold animate-slideIn
            top-4 right-4 md:right-4 md:top-4
            max-w-[90vw] md:max-w-none
            ${
              notification.type === "success"
                ? "bg-green-900 border-green-500 text-green-100"
                : notification.type === "error"
                ? "bg-red-900 border-red-500 text-red-100"
                : "bg-blue-900 border-blue-500 text-blue-100"
            }`}
        >
          <p className="text-xs md:text-sm">{notification.message}</p>
        </div>
      )}

      {/* HEADER - Mobile Responsive */}
      <header className="w-full flex flex-col gap-3 md:gap-4 bg-[#1e293b]/90 text-white p-4 md:p-6 rounded-none border border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] mb-6 md:mb-8 backdrop-blur-sm">
        
        {/* Title */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
            HABIT_CTRL
          </h1>
          <p className="text-[10px] md:text-xs text-cyan-600 mt-1 tracking-wider">
            NEURAL ENHANCEMENT PROTOCOL v2.0
          </p>
        </div>

        {/* Stats Grid - Mobile Optimized */}
        <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-3 items-center justify-center md:justify-start">
          
          {/* Completion Stats */}
          <div className="flex items-center gap-2 px-2 md:px-3 py-2 border border-slate-600 bg-slate-900/50 text-slate-300 text-xs md:text-sm">
            <Check className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
            <span>{completedCount}/{habits.length}</span>
          </div>

          {/* Streak Stats */}
          <div className="flex items-center gap-2 px-2 md:px-3 py-2 border border-slate-600 bg-slate-900/50 text-slate-300 text-xs md:text-sm">
            <Zap className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
            <span>{totalStreak}</span>
          </div>

          {/* Achievements Button */}
          <button
            onClick={() => setIsAchievementsOpen(true)}
            className="relative flex items-center gap-2 px-2 md:px-3 py-2 border border-yellow-600 bg-yellow-900/50 hover:bg-yellow-800 text-yellow-300 hover:text-yellow-100 text-xs md:text-sm transition-all touch-feedback"
          >
            <Trophy className="w-3 h-3 md:w-4 md:h-4" />
            <span>{unlockedCount}/10</span>
            {unlockedCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-[8px] w-3 h-3 md:w-4 md:h-4 rounded-full flex items-center justify-center font-bold">
                {unlockedCount}
              </span>
            )}
          </button>

          {/* Analytics Button */}
          <button
            onClick={() => setIsAnalyticsOpen(true)}
            className="flex items-center gap-2 px-2 md:px-3 py-2 border border-cyan-600 bg-cyan-900/50 hover:bg-cyan-800 text-cyan-300 hover:text-cyan-100 text-xs md:text-sm transition-all touch-feedback"
          >
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden md:inline">STATS</span>
          </button>

          {/* Inventory Button */}
          <button
            onClick={() => setIsInventoryOpen(true)}
            className="relative flex items-center gap-2 px-2 md:px-3 py-2 border border-purple-600 bg-purple-900/50 hover:bg-purple-800 text-purple-300 hover:text-purple-100 text-xs md:text-sm transition-all touch-feedback"
          >
            <Package className="w-3 h-3 md:w-4 md:h-4" />
            <span>{user.inventory.length}</span>
            {user.inventory.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-[8px] w-3 h-3 md:w-4 md:h-4 rounded-full flex items-center justify-center font-bold">
                {user.inventory.length}
              </span>
            )}
          </button>

          {/* Credits Display - Full Width on Mobile */}
          <div className="col-span-2 md:col-span-1 flex items-center justify-center gap-2 bg-black text-cyan-400 px-4 md:px-5 py-2 border border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            <Cpu className="w-4 h-4 md:w-5 md:h-5 animate-spin-slow" />
            <span className="text-lg md:text-xl font-bold tracking-widest">{user.points} CR</span>
          </div>

          {/* Shop Button - Full Width on Mobile */}
          <button
            onClick={() => setIsShopOpen(true)}
            disabled={isGeneratingShop}
            className="col-span-2 md:col-span-1 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-black disabled:text-slate-500 font-bold px-4 md:px-6 py-2 transition-all hover:shadow-[0_0_15px_cyan] active:scale-95 touch-feedback flex items-center justify-center gap-2"
          >
            {isGeneratingShop ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                AI GENERATING...
              </>
            ) : (
              "MARKET"
            )}
          </button>
        </div>
      </header>

      {/* ADD TASK INPUT - Mobile Friendly */}
      <form
        onSubmit={handleAdd}
        className="w-full flex gap-0 mb-6 md:mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)]"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="INPUT_DIRECTIVE..."
          className="flex-1 p-3 md:p-4 bg-slate-800 text-white border-2 border-slate-600 focus:border-cyan-400 focus:outline-none placeholder-slate-500 text-sm md:text-base"
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-500 text-white px-6 md:px-8 font-bold border-2 border-purple-400 flex items-center justify-center transition-colors active:scale-95 touch-feedback"
        >
          <Plus strokeWidth={3} className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </form>

      {/* HABIT LIST - Mobile Optimized */}
      <div className="w-full grid gap-3 md:gap-4">
        {habits.length === 0 && (
          <div className="text-center p-8 md:p-12 border border-dashed border-slate-600 text-slate-500">
            <Cpu className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg md:text-xl">NO ACTIVE DIRECTIVES.</p>
            <p className="text-xs md:text-sm mt-2">Initialize new habit protocols above.</p>
          </div>
        )}

        {habits.map((habit) => (
          <div
            key={habit.id}
            className={`
              relative flex items-center justify-between p-3 md:p-4 border-l-4 transition-all bg-slate-800/80 backdrop-blur-md
              ${
                habit.completed
                  ? "border-green-500 opacity-60"
                  : "border-cyan-500 hover:bg-slate-700 md:hover:translate-x-2"
              }
            `}
          >
            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
              <button
                onClick={() => handleComplete(habit.id)}
                disabled={habit.completed}
                className={`
                  w-7 h-7 md:w-8 md:h-8 flex items-center justify-center border transition-all flex-shrink-0 touch-feedback
                  ${
                    habit.completed
                      ? "bg-green-900 border-green-500 text-green-500 cursor-not-allowed"
                      : "border-slate-500 hover:border-cyan-400 hover:bg-cyan-900/30 active:scale-90"
                  }
                `}
              >
                {habit.completed && <Check size={14} strokeWidth={4} className="md:w-4 md:h-4" />}
              </button>

              <div className="flex-1 min-w-0">
                <h3
                  className={`text-sm md:text-lg font-bold tracking-wide truncate ${
                    habit.completed ? "line-through text-slate-500" : "text-white"
                  }`}
                >
                  {habit.name}
                </h3>
                <p className="text-[9px] md:text-[10px] text-cyan-600 uppercase tracking-widest">
                  STREAK: {habit.streak} | {habit.completed ? "COMPLETE" : "ACTIVE"}
                </p>
              </div>
            </div>

            <button
              onClick={() => deleteHabit(habit.id)}
              className="text-slate-600 hover:text-red-500 transition-colors active:scale-90 flex-shrink-0 ml-2 touch-feedback"
            >
              <Trash2 size={16} className="md:w-5 md:h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Modals */}
      <ShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        userPoints={user.points}
        shopItems={shop.items}
        lastRefresh={shop.lastRefresh}
        onBuy={handleBuy}
        onRefresh={handleRefreshShop}
        isGenerating={isGeneratingShop}
      />

      <InventoryModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        inventory={user.inventory}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        stats={stats}
        unlockedAchievements={user.unlockedAchievements || []}
        onClaim={handleClaimAchievement}
      />

      <AnalyticsDashboard
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        habits={habits}
      />
    </main>
  );
}
