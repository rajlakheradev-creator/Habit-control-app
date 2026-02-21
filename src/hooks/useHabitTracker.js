// src/hooks/useHabitTracker.js

"use client";
import { useState, useEffect } from "react";
import { generateShopItems } from "../utils/aiGenerator";

export function useHabitTracker() {
  const [habits, setHabits] = useState([]);
  const [user, setUser] = useState({
    points: 0,
    inventory: [],
    unlockedAchievements: [],
    totalPointsEarned: 0,
    totalCompleted: 0,
    lastResetDate: null,
    lifetimeStats: {
      totalHabitsCreated: 0,
      totalCompletions: 0,
      highestStreak: 0,
    },
  });
  const [shop, setShop]               = useState({ items: [], lastRefresh: 0 });
  const [isLoaded, setIsLoaded]       = useState(false);
  const [isGeneratingShop, setIsGeneratingShop] = useState(false);

  // ── Load from localStorage ─────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedHabits = JSON.parse(localStorage.getItem("habits") || "[]");
      const savedUser   = JSON.parse(
        localStorage.getItem("user") ||
        JSON.stringify({
          points: 200,
          inventory: [],
          unlockedAchievements: [],
          totalPointsEarned: 0,
          totalCompleted: 0,
          lastResetDate: null,
          lifetimeStats: { totalHabitsCreated: 0, totalCompletions: 0, highestStreak: 0 },
        })
      );
      const savedShop = JSON.parse(localStorage.getItem("shop") || '{"items":[],"lastRefresh":0}');
      setHabits(savedHabits);
      setUser(savedUser);
      setShop(savedShop);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // ── Daily reset ───────────────────────────────────────────────────
  // Guard: only run after load AND only in browser (avoids SSR hydration mismatch)
  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;

    const today = new Date().toDateString();
    if (user.lastResetDate === today) return; // already reset today

    setHabits((prev) => prev.map((h) => ({ ...h, completed: false })));
    setUser((prev) => ({ ...prev, lastResetDate: today }));
  }, [isLoaded]); // deliberately NOT including user.lastResetDate to avoid re-triggering

  // ── AI shop refresh ───────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded || typeof window === "undefined" || isGeneratingShop) return;

    const REFRESH_INTERVAL = 5 * 60 * 60 * 1000;
    const needsRefresh = shop.items.length === 0 || Date.now() - shop.lastRefresh > REFRESH_INTERVAL;
    if (!needsRefresh) return;

    setIsGeneratingShop(true);
    generateShopItems(6, habits)
      .then((newItems) => {
        const newShopState = { items: newItems, lastRefresh: Date.now() };
        setShop(newShopState);
        localStorage.setItem("shop", JSON.stringify(newShopState));
      })
      .catch((err) => console.error("Shop generation failed:", err))
      .finally(() => setIsGeneratingShop(false));
  }, [isLoaded, shop.lastRefresh, shop.items.length]); // removed habits/isGeneratingShop to prevent loop

  // ── Persist to localStorage ───────────────────────────────────────
  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;
    try {
      localStorage.setItem("habits", JSON.stringify(habits));
      localStorage.setItem("user",   JSON.stringify(user));
    } catch (err) {
      console.error("Error saving data:", err);
    }
  }, [habits, user, isLoaded]);

  // ── Derived stats ─────────────────────────────────────────────────
  const getStats = () => ({
    totalHabits:        habits.length,
    completedToday:     habits.filter((h) => h.completed).length,
    maxStreak:          Math.max(...habits.map((h) => h.streak), 0),
    itemsPurchased:     user.inventory.length,
    inventorySize:      user.inventory.length,
    totalPointsEarned:  user.totalPointsEarned  || 0,
    totalCompleted:     user.totalCompleted      || 0,
  });

  // ── Actions ───────────────────────────────────────────────────────
  const addHabit = (name) => {
    setHabits((prev) => [
      ...prev,
      { id: Date.now(), name, completed: false, streak: 0, lastCompleted: null, createdAt: Date.now() },
    ]);
    setUser((prev) => ({
      ...prev,
      lifetimeStats: {
        ...prev.lifetimeStats,
        totalHabitsCreated: (prev.lifetimeStats?.totalHabitsCreated || 0) + 1,
      },
    }));
  };

  const deleteHabit = (id) => setHabits((prev) => prev.filter((h) => h.id !== id));

  const completeHabit = (id) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id || h.completed) return h;

        const todayMidnight = (() => { const d = new Date(); d.setHours(0,0,0,0); return d.getTime(); })();
        const yesterdayMidnight = todayMidnight - 86_400_000;

        let lastMidnight = null;
        if (h.lastCompleted) {
          const d = new Date(h.lastCompleted);
          d.setHours(0, 0, 0, 0);
          lastMidnight = d.getTime();
        }

        const newStreak =
          lastMidnight === yesterdayMidnight ? h.streak + 1
          : lastMidnight === todayMidnight   ? h.streak      // already done today
          :                                    1;             // broken or first time

        setUser((u) => ({
          ...u,
          points:            u.points + 50,
          totalPointsEarned: (u.totalPointsEarned || 0) + 50,
          totalCompleted:    (u.totalCompleted    || 0) + 1,
          lifetimeStats: {
            ...u.lifetimeStats,
            totalCompletions: (u.lifetimeStats?.totalCompletions || 0) + 1,
            highestStreak:    Math.max(u.lifetimeStats?.highestStreak || 0, newStreak),
          },
        }));

        return { ...h, completed: true, streak: newStreak, lastCompleted: Date.now() };
      })
    );
  };

  const buyItem = (item) => {
    if (user.points < item.price) return false;
    setUser((prev) => ({
      ...prev,
      points:    prev.points - item.price,
      inventory: [...prev.inventory, { ...item, purchasedAt: Date.now(), viewed: false }],
    }));
    return true;
  };

  const claimAchievement = (achievementId, reward) => {
    if (user.unlockedAchievements.includes(achievementId)) return false;
    setUser((prev) => ({
      ...prev,
      points:               prev.points + reward,
      totalPointsEarned:    (prev.totalPointsEarned || 0) + reward,
      unlockedAchievements: [...prev.unlockedAchievements, achievementId],
    }));
    return true;
  };

  const refreshShop = async () => {
    setIsGeneratingShop(true);
    try {
      const newItems     = await generateShopItems(6, habits);
      const newShopState = { items: newItems, lastRefresh: Date.now() };
      setShop(newShopState);
      localStorage.setItem("shop", JSON.stringify(newShopState));
      return true;
    } catch (err) {
      console.error("Manual shop refresh failed:", err);
      return false;
    } finally {
      setIsGeneratingShop(false);
    }
  };

  const markInventoryAsViewed = () =>
    setUser((prev) => ({
      ...prev,
      inventory: prev.inventory.map((item) => ({ ...item, viewed: true })),
    }));

  return {
    habits,
    user,
    shop,
    isLoaded,
    isGeneratingShop,
    stats: getStats(),
    addHabit,
    deleteHabit,
    completeHabit,
    buyItem,
    claimAchievement,
    refreshShop,
    markInventoryAsViewed,
  };
}
