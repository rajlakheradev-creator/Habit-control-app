// src/app/page.js - MOBILE FIXED VERSION

"use client";
import { useState } from "react";
import { useHabitTracker } from "../hooks/useHabitTracker";
import ShopModal from "../components/ShopModal";
import InventoryModal from "../components/InventoryModal";
import AchievementsModal from "../components/AchievementsModal";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import {
  Plus, Check, Trash2, Trophy, Cpu, Zap,
  Package, TrendingUp, Sparkles
} from "lucide-react";

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
    refreshShop,
    markInventoryAsViewed,
  } = useHabitTracker();

  const [input, setInput]                   = useState("");
  const [isShopOpen, setIsShopOpen]         = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [notification, setNotification]     = useState(null);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-cyan-500 font-mono text-xl">
        <div className="flex flex-col items-center gap-4">
          <Cpu className="w-16 h-16 animate-spin" />
          <p className="animate-pulse text-base">INITIALIZING SYSTEM...</p>
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
      setTimeout(() => { setIsShopOpen(false); setIsInventoryOpen(true); }, 1500);
    } else {
      showNotification("INSUFFICIENT CREDITS", "error");
    }
  };

  const handleClaimAchievement = (achievementId, reward) => {
    const success = claimAchievement(achievementId, reward);
    if (success) showNotification(`ACHIEVEMENT UNLOCKED! +${reward} CR`, "success");
  };

  const handleRefreshShop = async () => {
    showNotification("REFRESHING MARKET...", "info");
    const success = await refreshShop();
    showNotification(success ? "MARKET UPDATED" : "REFRESH FAILED", success ? "success" : "error");
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const completedCount  = habits.filter((h) => h.completed).length;
  const totalStreak     = habits.reduce((sum, h) => sum + h.streak, 0);
  const unlockedCount   = user.unlockedAchievements?.length || 0;
  const newItemsCount   = user.inventory?.filter((item) => item.viewed === false).length || 0;

  return (
    <main className="min-h-screen p-3 sm:p-5 md:p-8 flex flex-col items-center max-w-4xl mx-auto font-mono">

      {/* ── NOTIFICATION TOAST ──────────────────────────────────────── */}
      {notification && (
        <div
          className={`
            fixed z-50 px-4 py-3 font-bold animate-slideIn
            /* Desktop: top-right */
            top-4 right-4
            /* Mobile: bottom-center, full width minus margin */
            max-sm:top-auto max-sm:bottom-4 max-sm:right-4 max-sm:left-4
            max-w-[calc(100vw-2rem)] sm:max-w-xs
            ${notification.type === "success" ? "bg-green-900 border-2 border-green-500 text-green-100"
            : notification.type === "error"   ? "bg-red-900   border-2 border-red-500   text-red-100"
            :                                   "bg-blue-900  border-2 border-blue-500  text-blue-100"}
          `}
        >
          <p className="text-xs sm:text-sm text-center sm:text-left">{notification.message}</p>
        </div>
      )}

      {/* ── HEADER ──────────────────────────────────────────────────── */}
      <header className="w-full bg-[#1e293b]/90 text-white p-4 sm:p-5 md:p-6 border border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] mb-5 md:mb-8 backdrop-blur-sm">

        {/* Title row */}
        <div className="mb-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
            HABIT_CTRL
          </h1>
          <p className="text-[10px] sm:text-xs text-cyan-600 mt-1 tracking-wider">
            NEURAL ENHANCEMENT PROTOCOL v2.0
          </p>
        </div>

        {/* Stats + actions
            Mobile:  2 columns, credits + market span full width
            Desktop: single flex row
        */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 items-stretch sm:items-center">

          {/* Completed count */}
          <div className="flex items-center justify-center gap-2 px-3 py-2.5 border border-slate-600 bg-slate-900/50 text-slate-300 text-xs sm:text-sm">
            <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
            <span>{completedCount}/{habits.length}</span>
          </div>

          {/* Streak total */}
          <div
            title="Combined streak of all active habits"
            className="flex items-center justify-center gap-2 px-3 py-2.5 border border-slate-600 bg-slate-900/50 text-slate-300 text-xs sm:text-sm"
          >
            <Zap className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
            <span>{totalStreak}</span>
          </div>

          {/* Achievements */}
          <button
            onClick={() => setIsAchievementsOpen(true)}
            className="relative flex items-center justify-center gap-2 px-3 py-2.5 border border-yellow-600 bg-yellow-900/50 hover:bg-yellow-800 text-yellow-300 hover:text-yellow-100 text-xs sm:text-sm transition-all touch-feedback"
          >
            <Trophy className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{unlockedCount}/10</span>
            {unlockedCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-yellow-500 text-black text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {unlockedCount}
              </span>
            )}
          </button>

          {/* Analytics */}
          <button
            onClick={() => setIsAnalyticsOpen(true)}
            className="flex items-center justify-center gap-2 px-3 py-2.5 border border-cyan-600 bg-cyan-900/50 hover:bg-cyan-800 text-cyan-300 hover:text-cyan-100 text-xs sm:text-sm transition-all touch-feedback"
          >
            <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="sm:hidden">ANALYTICS</span>
            <span className="hidden sm:inline">STATS</span>
          </button>

          {/* Inventory */}
          <button
            onClick={() => setIsInventoryOpen(true)}
            className="relative flex items-center justify-center gap-2 px-3 py-2.5 border border-purple-600 bg-purple-900/50 hover:bg-purple-800 text-purple-300 hover:text-purple-100 text-xs sm:text-sm transition-all touch-feedback"
          >
            <Package className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{user.inventory?.length || 0} items</span>
            {newItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-purple-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
                {newItemsCount}
              </span>
            )}
          </button>

          {/* Credits — spans full width on mobile */}
          <div className="col-span-2 sm:col-auto flex items-center justify-center gap-2 bg-black text-cyan-400 px-4 py-2.5 border border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            <Cpu className="w-4 h-4 sm:w-5 sm:h-5 animate-spin-slow flex-shrink-0" />
            <span className="text-lg sm:text-xl font-bold tracking-widest">{user.points} CR</span>
          </div>

          {/* Market button — spans full width on mobile */}
          <button
            onClick={() => setIsShopOpen(true)}
            disabled={isGeneratingShop}
            className="col-span-2 sm:col-auto bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-black disabled:text-slate-500 font-bold px-4 sm:px-6 py-2.5 transition-all hover:shadow-[0_0_15px_cyan] active:scale-95 touch-feedback flex items-center justify-center gap-2 text-sm"
          >
            {isGeneratingShop ? (
              <><Sparkles className="w-4 h-4 animate-spin" /> AI GENERATING...</>
            ) : (
              "◈ MARKET"
            )}
          </button>
        </div>
      </header>

      {/* ── ADD HABIT FORM ───────────────────────────────────────────── */}
      <form
        onSubmit={handleAdd}
        className="w-full flex mb-5 md:mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="INPUT_DIRECTIVE..."
          /* font-size 16px prevents iOS zoom-on-focus */
          className="flex-1 min-w-0 p-3 sm:p-4 bg-slate-800 text-white border-2 border-slate-600 focus:border-cyan-400 focus:outline-none placeholder-slate-500 text-base"
        />
        <button
          type="submit"
          aria-label="Add habit"
          className="bg-purple-600 hover:bg-purple-500 text-white px-5 sm:px-8 font-bold border-2 border-purple-400 flex items-center justify-center transition-colors active:scale-95 touch-feedback flex-shrink-0"
        >
          <Plus strokeWidth={3} className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </form>

      {/* ── HABIT LIST ──────────────────────────────────────────────── */}
      <div className="w-full grid gap-2.5 sm:gap-4">

        {habits.length === 0 && (
          <div className="text-center p-10 sm:p-12 border border-dashed border-slate-600 text-slate-500">
            <Cpu className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg sm:text-xl">NO ACTIVE DIRECTIVES.</p>
            <p className="text-xs sm:text-sm mt-2">Initialize new habit protocols above.</p>
          </div>
        )}

        {habits.map((habit) => (
          <div
            key={habit.id}
            className={`
              relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-l-4 transition-all bg-slate-800/80 backdrop-blur-md
              ${habit.completed
                ? "border-green-500 opacity-60"
                : "border-cyan-500 hover:bg-slate-700 sm:hover:translate-x-2"}
            `}
          >
            {/* Complete button */}
            <button
              onClick={() => handleComplete(habit.id)}
              disabled={habit.completed}
              aria-label={habit.completed ? "Completed" : "Mark complete"}
              className={`
                w-8 h-8 flex items-center justify-center border flex-shrink-0 transition-all touch-feedback
                ${habit.completed
                  ? "bg-green-900 border-green-500 text-green-500 cursor-not-allowed"
                  : "border-slate-500 hover:border-cyan-400 hover:bg-cyan-900/30 active:scale-90"}
              `}
            >
              {habit.completed && <Check size={14} strokeWidth={4} />}
            </button>

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
              <h3
                className={`text-sm sm:text-lg font-bold tracking-wide truncate ${
                  habit.completed ? "line-through text-slate-500" : "text-white"
                }`}
              >
                {habit.name}
              </h3>
              <p className="text-[10px] text-cyan-600 uppercase tracking-widest mt-0.5">
                STREAK: {habit.streak} · {habit.completed ? "COMPLETE" : "ACTIVE"}
              </p>
            </div>

            {/* Delete button — delete-btn class adds invisible 10px hit-area via CSS */}
            <button
              onClick={() => deleteHabit(habit.id)}
              aria-label="Delete habit"
              className="delete-btn text-slate-600 hover:text-red-500 transition-colors active:scale-90 flex-shrink-0 touch-feedback p-1"
            >
              <Trash2 size={16} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* ── MODALS ──────────────────────────────────────────────────── */}
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
        inventory={user.inventory || []}
        onView={markInventoryAsViewed}
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
