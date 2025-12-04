// src/utils/aiGenerator.js

const PREFIXES = ["Quantum", "Neon", "Glitch", "Plasma", "Cyber", "Void", "Neural", "Holo", "Radioactive", "Cursed"];
const ITEMS = ["Chip", "Katana", "Battery", "Visor", "Data-Drive", "Serum", "Key", "Drone", "Relic", "Skull"];
const BUFFS = ["+10 Focus", "Time Warp", "Double XP", "Firewall", "Night Vision", "Luck Boost"];

// Simple "AI" that stitches concepts together
export function generateShopItems(count = 6) {
  const newItems = [];
  
  for (let i = 0; i < count; i++) {
    const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
    const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    const buff = BUFFS[Math.floor(Math.random() * BUFFS.length)];
    
    // Price logic based on "rarity" (length of name just for randomness)
    const price = Math.floor(Math.random() * 400) + 100; 

    newItems.push({
      id: Date.now() + i, // Unique ID
      name: `${prefix} ${item}`,
      description: `Grants ${buff}`,
      price: price,
      icon: getIconForType(item) // Helper function
    });
  }
  return newItems;
}

function getIconForType(itemType) {
  const icons = {
    "Chip": "💾", "Katana": "🗡️", "Battery": "🔋", 
    "Visor": "🥽", "Data-Drive": "📼", "Serum": "🧪", 
    "Key": "🔑", "Drone": "🛸", "Relic": "🧿", "Skull": "💀"
  };
  return icons[itemType] || "📦";
}