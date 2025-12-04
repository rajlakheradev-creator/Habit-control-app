"use client";
import { useState, useEffect } from "react";
import { generateShopItems } from "../utils/aiGenerator";

export function useHabitTracker() {
  const [habits, setHabits] = useState([]);
  const [user, setUser] = useState({ points: 0, inventory: [] });
  const [shop, setShop] = useState({ items: [], lastRefresh: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const savedHabits = JSON.parse(localStorage.getItem("habits") || "[]");
      const savedUser = JSON.parse(localStorage.getItem("user") || '{"points": 0, "inventory": []}');
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

  // AI Shop Refresh Logic
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return;

    const REFRESH_INTERVAL = 5 * 60 * 60 * 1000; // 5 hours
    const now = Date.now();

    // If shop is empty OR 5 hours have passed
    if (shop.items.length === 0 || now - shop.lastRefresh > REFRESH_INTERVAL) {
      console.log("🤖 AI Generative Shop: Refreshing Inventory...");
      const newItems = generateShopItems(6);
      
      const newShopState = { items: newItems, lastRefresh: now };
      setShop(newShopState);
      
      try {
        localStorage.setItem("shop", JSON.stringify(newShopState));
      } catch (error) {
        console.error("Error saving shop:", error);
      }
    }
  }, [isLoaded, shop.lastRefresh, shop.items.length]);

  // Save habits and user to localStorage whenever they change
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
            points: u.points + 50 
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

  return {
    habits,
    user,
    shop,
    isLoaded,
    addHabit,
    deleteHabit,
    completeHabit,
    buyItem,
    resetHabit
  };
}
