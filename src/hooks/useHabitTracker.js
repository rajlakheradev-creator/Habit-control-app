"use client";
import { useState, useEffect } from "react";
import { generateShopItems } from "../utils/aiGenerator";

export function useHabitTracker() {
  const [habits, setHabits] = useState([]);
  const [user, setUser] = useState({ points: 0, inventory: [] });
  const [shop, setShop] = useState({ items: [], lastRefresh: 0 }); // New Shop State
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedHabits = JSON.parse(localStorage.getItem("habits") || "[]");
    const savedUser = JSON.parse(localStorage.getItem("user") || '{"points": 0, "inventory": []}');
    const savedShop = JSON.parse(localStorage.getItem("shop") || '{"items": [], "lastRefresh": 0}');

    setHabits(savedHabits);
    setUser(savedUser);
    setShop(savedShop);
    setIsLoaded(true);
  }, []);

  // --- THE AI SHOP REFRESH LOGIC ---
  useEffect(() => {
    if (!isLoaded) return;

    const REFRESH_INTERVAL = 5 * 60 * 60 * 1000; // 5 Hours in Milliseconds
    const now = Date.now();

    // If shop is empty OR 5 hours have passed
    if (shop.items.length === 0 || now - shop.lastRefresh > REFRESH_INTERVAL) {
      console.log("🤖 AI Generative Shop: Refreshing Inventory...");
      const newItems = generateShopItems(6);
      
      const newShopState = { items: newItems, lastRefresh: now };
      setShop(newShopState);
      localStorage.setItem("shop", JSON.stringify(newShopState));
    }
  }, [isLoaded, shop.lastRefresh]); 
  // ----------------------------------

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("habits", JSON.stringify(habits));
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [habits, user, isLoaded]);

  const addHabit = (name) => {
    const newHabit = { id: Date.now(), name, completed: false, streak: 0 };
    setHabits((prev) => [...prev, newHabit]);
  };

  const deleteHabit = (id) => setHabits((prev) => prev.filter((h) => h.id !== id));

  const completeHabit = (id) => {
    setHabits((prev) => prev.map((h) => {
      if (h.id === id && !h.completed) {
        setUser((u) => ({ ...u, points: u.points + 50 })); // Higher points for Cyberpunk economy
        return { ...h, completed: true, streak: h.streak + 1 };
      }
      return h;
    }));
  };

  const buyItem = (item) => {
    if (user.points >= item.price) {
      setUser((prev) => ({
        points: prev.points - item.price,
        inventory: [...prev.inventory, item]
      }));
      return true;
    }
    return false;
  };

  return { habits, user, shop, isLoaded, addHabit, deleteHabit, completeHabit, buyItem };
}
// src/utils/aiGenerator.js