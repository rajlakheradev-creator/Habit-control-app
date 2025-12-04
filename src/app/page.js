"use client";
import { useState } from "react";
import { useHabitTracker } from "../hooks/useHabitTracker";
import ShopModal from "../components/ShopModal";
import { Plus, Check, Trash2, Trophy, Cpu, Zap } from "lucide-react";

export default function Home() {
  const {
    habits,
    user,
    shop,
    isLoaded,
    addHabit,
    deleteHabit,
    completeHabit,
    buyItem,
  } = useHabitTracker();

  const [input, setInput] = useState("");
  const [isShopOpen, setIsShopOpen] = useState(false);
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
    } else {
      showNotification("INSUFFICIENT CREDITS", "error");
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const completedCount = habits.filter((h) => h.completed).length;
  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);

  return (
    <main className="min-h-screen p-4 md:p-8 flex flex-col items-center max-w-4xl mx-auto font-mono">
      
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-none border-2 font-bold animate-slideIn ${
            notification.type === "success"
              ? "bg-green-900 border-green-500 text-green-100"
              : "bg-red-900 border-red-500 text-red-100"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* HEADER */}
      <header className="w-full flex flex-col md:flex-row gap-4 justify-between items-center bg-[#1e293b]/90 text-white p-6 rounded-none border border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] mb-8 backdrop-blur-sm">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
            HABIT_CTRL
          </h1>
          <p className="text-xs text-cyan-600 mt-1 tracking-wider">
            NEURAL ENHANCEMENT PROTOCOL v2.0
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center justify-center">
          {/* Stats */}
          <div className="flex items-center gap-2 px-3 py-2 border border-slate-600 bg-slate-900/50 text-slate-300 text-sm">
            <Check className="w-4 h-4 text-green-400" />
            <span>{completedCount}/{habits.length}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 border border-slate-600 bg-slate-900/50 text-slate-300 text-sm">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>{totalStreak}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 border border-slate-600 bg-slate-900/50 text-slate-300 text-sm">
            <Trophy className="w-4 h-4 text-purple-400" />
            <span>{user.inventory.length}</span>
          </div>

          {/* Credits Display */}
          <div className="flex items-center gap-2 bg-black text-cyan-400 px-5 py-2 border border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            <Cpu className="w-5 h-5 animate-spin-slow" />
            <span className="text-xl font-bold tracking-widest">{user.points} CR</span>
          </div>

          {/* Shop Button */}
          <button
            onClick={() => setIsShopOpen(true)}
            className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold px-6 py-2 transition-all hover:shadow-[0_0_15px_cyan] active:scale-95"
          >
            MARKET
          </button>
        </div>
      </header>

      {/* ADD TASK INPUT */}
      <form
        onSubmit={handleAdd}
        className="w-full flex gap-0 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)]"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="INPUT_DIRECTIVE..."
          className="flex-1 p-4 bg-slate-800 text-white border-2 border-slate-600 focus:border-cyan-400 focus:outline-none placeholder-slate-500"
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-500 text-white px-8 font-bold border-2 border-purple-400 flex items-center justify-center transition-colors active:scale-95"
        >
          <Plus strokeWidth={3} />
        </button>
      </form>

      {/* HABIT LIST */}
      <div className="w-full grid gap-4">
        {habits.length === 0 && (
          <div className="text-center p-12 border border-dashed border-slate-600 text-slate-500">
            <Cpu className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl">NO ACTIVE DIRECTIVES.</p>
            <p className="text-sm mt-2">Initialize new habit protocols above.</p>
          </div>
        )}

        {habits.map((habit) => (
          <div
            key={habit.id}
            className={`
              relative flex items-center justify-between p-4 border-l-4 transition-all bg-slate-800/80 backdrop-blur-md
              ${
                habit.completed
                  ? "border-green-500 opacity-60"
                  : "border-cyan-500 hover:bg-slate-700 hover:translate-x-2"
              }
            `}
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleComplete(habit.id)}
                disabled={habit.completed}
                className={`
                  w-8 h-8 flex items-center justify-center border transition-all
                  ${
                    habit.completed
                      ? "bg-green-900 border-green-500 text-green-500 cursor-not-allowed"
                      : "border-slate-500 hover:border-cyan-400 hover:bg-cyan-900/30 active:scale-90"
                  }
                `}
              >
                {habit.completed && <Check size={16} strokeWidth={4} />}
              </button>

              <div>
                <h3
                  className={`text-lg font-bold tracking-wide ${
                    habit.completed ? "line-through text-slate-500" : "text-white"
                  }`}
                >
                  {habit.name}
                </h3>
                <p className="text-[10px] text-cyan-600 uppercase tracking-widest">
                  STREAK: {habit.streak} | STATUS: {habit.completed ? "COMPLETE" : "ACTIVE"}
                </p>
              </div>
            </div>

            <button
              onClick={() => deleteHabit(habit.id)}
              className="text-slate-600 hover:text-red-500 transition-colors active:scale-90"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <ShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        userPoints={user.points}
        shopItems={shop.items}
        lastRefresh={shop.lastRefresh}
        onBuy={handleBuy}
      />
    </main>
  );
}
