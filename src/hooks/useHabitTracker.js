// src/hooks/useHabitTracker.js - FIXED VERSION

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
      highestStreak: 0
    }
  });
  const [shop, setShop] = useState({ items: [], lastRefresh: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isGeneratingShop, setIsGeneratingShop] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const savedHabits = JSON.parse(localStorage.getItem("habits") || "[]");
      const savedUser = JSON.parse(
        localStorage.getItem("user") || 
        '{"points": 200, "inventory": [], "unlockedAchievements": [], "totalPointsEarned": 0, "totalCompleted": 0, "lastResetDate": null, "lifetimeStats": {"totalHabitsCreated": 0, "totalCompletions": 0, "highestStreak": 0}}'
      );
      const savedShop = JSON.parse(localStorage.getItem("shop") || '{"items": [], "lastRefresh": 0}');

      setHabits(savedHabits);
      setUser(savedUser);
      setShop(savedShop);
      setIsLoaded(true);
    } catch (error) {
      console.error("Error loading data:", error);
      setIsLoaded(true);
    }
  }, []);

  // Daily Reset Logic - Reset completed status at midnight
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return;

    const today = new Date().toDateString();
    
    if (user.lastResetDate !== today) {
      console.log("🔄 New day detected - resetting habits");
      
      // Reset all completed flags but preserve streaks
      setHabits((prev) => 
        prev.map((h) => ({
          ...h,
          completed: false
        }))
      );

      // Update last reset date
      setUser((prev) => ({
        ...prev,
        lastResetDate: today
      }));
    }
  }, [isLoaded, user.lastResetDate]);

  // AI Shop Refresh Logic with REAL AI
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined' || isGeneratingShop) return;

    const REFRESH_INTERVAL = 5 * 60 * 60 * 1000; // 5 hours
    const now = Date.now();

    // If shop is empty OR 5 hours have passed
    if (shop.items.length === 0 || now - shop.lastRefresh > REFRESH_INTERVAL) {
      console.log("🤖 AI Generative Shop: Refreshing Inventory...");
      setIsGeneratingShop(true);
      
      // Use REAL AI to generate items based on user's habits
      generateShopItems(6, habits)
        .then(newItems => {
          const newShopState = { items: newItems, lastRefresh: now };
          setShop(newShopState);
          localStorage.setItem("shop", JSON.stringify(newShopState));
        })
        .catch(error => {
          console.error("Shop generation failed:", error);
        })
        .finally(() => {
          setIsGeneratingShop(false);
        });
    }
  }, [isLoaded, shop.lastRefresh, shop.items.length, habits, isGeneratingShop]);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem("habits", JSON.stringify(habits));
        localStorage.setItem("user", JSON.stringify(user));
      } catch (error) {
        console.error("Error saving data:", error);
      }
    }
  }, [habits, user, isLoaded]);

  // Calculate stats for achievements
  const getStats = () => {
    const completedToday = habits.filter(h => h.completed).length;
    const maxStreak = Math.max(...habits.map(h => h.streak), 0);
    
    return {
      totalHabits: habits.length,
      completedToday,
      maxStreak,
      itemsPurchased: user.inventory.length,
      inventorySize: user.inventory.length,
      totalPointsEarned: user.totalPointsEarned || 0,
      totalCompleted: user.totalCompleted || 0
    };
  };

  const addHabit = (name) => {
    const newHabit = { 
      id: Date.now(), 
      name, 
      completed: false, 
      streak: 0,
      lastCompleted: null,
      createdAt: Date.now()
    };
    setHabits((prev) => [...prev, newHabit]);
    
    // Update lifetime stats
    setUser((prev) => ({
      ...prev,
      lifetimeStats: {
        ...prev.lifetimeStats,
        totalHabitsCreated: (prev.lifetimeStats?.totalHabitsCreated || 0) + 1
      }
    }));
  };

  const deleteHabit = (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const completeHabit = (id) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id && !h.completed) {
          // Get today's date at midnight for comparison
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todayTime = today.getTime();
          
          // Get yesterday's date at midnight
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayTime = yesterday.getTime();
          
          // Get the date of last completion at midnight
          let lastCompletedTime = null;
          if (h.lastCompleted) {
            const lastDate = new Date(h.lastCompleted);
            lastDate.setHours(0, 0, 0, 0);
            lastCompletedTime = lastDate.getTime();
          }
          
          let newStreak = 1; // Default to 1 for first completion or broken streak
          
          if (lastCompletedTime) {
            if (lastCompletedTime === yesterdayTime) {
              // Completed yesterday - increment streak
              newStreak = h.streak + 1;
            } else if (lastCompletedTime === todayTime) {
              // Already completed today (shouldn't happen but just in case)
              newStreak = h.streak;
            }
            // If lastCompletedTime is older than yesterday, streak resets to 1
          }
          
          console.log(`Habit "${h.name}" completed:`, {
            previousStreak: h.streak,
            newStreak,
            lastCompleted: lastCompletedTime ? new Date(lastCompletedTime).toDateString() : 'never',
            yesterday: new Date(yesterdayTime).toDateString()
          });
          
          // Award points and increment total completed counter
          setUser((u) => ({ 
            ...u, 
            points: u.points + 50,
            totalPointsEarned: (u.totalPointsEarned || 0) + 50,
            totalCompleted: (u.totalCompleted || 0) + 1,
            lifetimeStats: {
              ...u.lifetimeStats,
              totalCompletions: (u.lifetimeStats?.totalCompletions || 0) + 1,
              highestStreak: Math.max(u.lifetimeStats?.highestStreak || 0, newStreak)
            }
          }));
          
          return { 
            ...h, 
            completed: true, 
            streak: newStreak,
            lastCompleted: Date.now()
          };
        }
        return h;
      })
    );
  };

  const buyItem = (item) => {
    if (user.points >= item.price) {
      setUser((prev) => ({
        ...prev,
        points: prev.points - item.price,
        inventory: [...prev.inventory, { ...item, purchasedAt: Date.now(), viewed: false }]
      }));
      return true;
    }
    return false;
  };

  const resetHabit = (id) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: false } : h))
    );
  };

  const claimAchievement = (achievementId, reward) => {
    if (!user.unlockedAchievements.includes(achievementId)) {
      setUser((prev) => ({
        ...prev,
        points: prev.points + reward,
        totalPointsEarned: (prev.totalPointsEarned || 0) + reward,
        unlockedAchievements: [...prev.unlockedAchievements, achievementId]
      }));
      return true;
    }
    return false;
  };

  const refreshShop = async () => {
    setIsGeneratingShop(true);
    try {
      const newItems = await generateShopItems(6, habits);
      const newShopState = { items: newItems, lastRefresh: Date.now() };
      setShop(newShopState);
      localStorage.setItem("shop", JSON.stringify(newShopState));
      return true;
    } catch (error) {
      console.error("Manual shop refresh failed:", error);
      return false;
    } finally {
      setIsGeneratingShop(false);
    }
  };

  const markInventoryAsViewed = () => {
    setUser((prev) => ({
      ...prev,
      inventory: prev.inventory.map(item => ({ ...item, viewed: true }))
    }));
  };

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
    resetHabit,
    claimAchievement,
    refreshShop,
    markInventoryAsViewed
  };
}
