// src/hooks/useHabitTracker.js - ENHANCED WITH ACHIEVEMENTS

"use client";
import { useState, useEffect } from "react";
import { generateShopItems } from "../utils/aiGenerator";

export function useHabitTracker() {
  const [habits, setHabits] = useState([]);
  const [user, setUser] = useState({ 
    points: 0, 
    inventory: [],
    unlockedAchievements: [],
    totalPointsEarned: 0 
  });
  const [shop, setShop] = useState({ items: [], lastRefresh: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isGeneratingShop, setIsGeneratingShop] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const savedHabits = JSON.parse(localStorage.getItem("habits") || "[]");
      const savedUser = JSON.parse(localStorage.getItem("user") || '{"points": 200, "inventory": [], "unlockedAchievements": [], "totalPointsEarned": 0}');
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
      totalPointsEarned: user.totalPointsEarned || 0
    };
  };

  const addHabit = (name) => {
    const newHabit = { 
      id: Date.now(), 
      name, 
      completed: false, 
      streak: 0,
      lastCompleted: null 
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const deleteHabit = (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const completeHabit = (id) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id && !h.completed) {
          // Award points
          setUser((u) => ({ 
            ...u, 
            points: u.points + 50,
            totalPointsEarned: (u.totalPointsEarned || 0) + 50
          }));
          
          return { 
            ...h, 
            completed: true, 
            streak: h.streak + 1,
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
        inventory: [...prev.inventory, { ...item, purchasedAt: Date.now() }]
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
    refreshShop
  };
}
