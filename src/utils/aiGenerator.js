// src/utils/aiGenerator.js - REAL AI VERSION

/**
 * Generate shop items using Claude AI based on user's habits
 * This makes your "AI-powered" claim legitimate!
 */
export async function generateShopItems(count = 6, userHabits = []) {
  try {
    // Prepare habit context
    const habitContext = userHabits.length > 0 
      ? `The user is working on these habits: ${userHabits.map(h => h.name).join(", ")}`
      : "Generate general productivity and self-improvement items";

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `You are generating items for a cyberpunk habit-tracking game's black market shop.

${habitContext}

Generate exactly ${count} unique cyberpunk-themed items that would motivate this user. Each item should:
- Have a creative, edgy cyberpunk name (mix tech + mystical vibes)
- Relate to productivity, focus, or the user's habits
- Include a compelling buff/power description
- Be priced between 50-300 credits (vary the prices)
- Have an appropriate emoji icon

CRITICAL: Respond with ONLY a JSON array, no markdown formatting, no backticks, no preamble:
[
  {
    "name": "Neural Focus Chip",
    "description": "Grants +15% meditation efficiency",
    "price": 150,
    "icon": "🧠"
  }
]`
          }
        ],
      })
    });

    const data = await response.json();
    
    if (!data.content || !data.content[0]) {
      throw new Error("Invalid AI response");
    }

    const text = data.content[0].text.trim();
    
    // Remove any markdown formatting if present
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const items = JSON.parse(cleanText);
    
    // Add unique IDs and timestamps
    return items.map((item, i) => ({
      ...item,
      id: `ai-${Date.now()}-${i}`,
      generatedAt: Date.now()
    }));

  } catch (error) {
    console.error("AI Generation failed, using fallback:", error);
    // Fallback to simple random generation if AI fails
    return generateFallbackItems(count);
  }
}

/**
 * Fallback generator if AI fails (your original logic)
 */
function generateFallbackItems(count = 6) {
  const PREFIXES = ["Quantum", "Neon", "Glitch", "Plasma", "Cyber", "Void", "Neural", "Holo"];
  const ITEMS = ["Chip", "Katana", "Battery", "Visor", "Data-Drive", "Serum", "Key", "Drone"];
  const BUFFS = ["+10 Focus", "Time Warp", "Double XP", "Firewall", "Night Vision", "Luck Boost"];
  
  const items = [];
  
  for (let i = 0; i < count; i++) {
    const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
    const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    const buff = BUFFS[Math.floor(Math.random() * BUFFS.length)];
    const price = Math.floor(Math.random() * 250) + 50;

    items.push({
      id: `fallback-${Date.now()}-${i}`,
      name: `${prefix} ${item}`,
      description: `Grants ${buff}`,
      price: price,
      icon: getIconForType(item),
      generatedAt: Date.now()
    });
  }
  
  return items;
}

function getIconForType(itemType) {
  const icons = {
    "Chip": "💾", 
    "Katana": "🗡️", 
    "Battery": "🔋", 
    "Visor": "🥽", 
    "Data-Drive": "📼", 
    "Serum": "🧪", 
    "Key": "🔑", 
    "Drone": "🛸", 
    "Relic": "🧿", 
    "Skull": "💀"
  };
  return icons[itemType] || "📦";
}

/**
 * Generate AI-powered habit suggestions
 */
export async function generateHabitSuggestions(currentHabits = [], count = 3) {
  try {
    const habitList = currentHabits.length > 0
      ? currentHabits.map(h => h.name).join(", ")
      : "none yet";

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: `The user currently tracks these habits: ${habitList}

Suggest ${count} new habits that would complement their current routine. Make suggestions practical and achievable.

Respond with ONLY a JSON array (no markdown):
["Habit name 1", "Habit name 2", "Habit name 3"]`
          }
        ],
      })
    });

    const data = await response.json();
    const text = data.content[0].text.trim();
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("AI suggestion failed:", error);
    return [
      "Drink 8 glasses of water daily",
      "Practice gratitude journaling",
      "Take a 15-minute walk"
    ];
  }
}
