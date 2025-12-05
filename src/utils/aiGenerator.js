import React, { useState } from 'react';
import { Sparkles, Cpu, ShoppingBag, Zap } from 'lucide-react';

// This demonstrates how to add REAL AI to your shop system
// Replace your aiGenerator.js with this approach

export default function EnhancedAIShop() {
  const [habits, setHabits] = useState([
    "Morning Meditation",
    "Exercise 30min",
    "Read for 1 hour"
  ]);
  const [loading, setLoading] = useState(false);
  const [shopItems, setShopItems] = useState([]);
  const [error, setError] = useState(null);

  const generateAIShop = async () => {
    setLoading(true);
    setError(null);
    
    try {
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
              content: `You are a cyberpunk item generator for a habit tracking game. 
              
User's current habits: ${habits.join(", ")}

Generate 6 unique shop items that would motivate this user. Each item should:
- Have a creative cyberpunk name
- Relate to their habits or productivity
- Include a buff/power description
- Be priced between 50-300 credits
- Have an emoji icon

Respond ONLY with a JSON array (no markdown, no preamble):
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
      const text = data.content[0].text;
      
      // Parse the JSON response
      const items = JSON.parse(text.trim());
      
      // Add unique IDs
      const itemsWithIds = items.map((item, i) => ({
        ...item,
        id: `ai-${Date.now()}-${i}`
      }));
      
      setShopItems(itemsWithIds);
    } catch (err) {
      setError(err.message);
      console.error("AI Shop Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 font-mono">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-4">
            AI-POWERED SHOP
          </h1>
          <p className="text-cyan-500 text-sm">
            Real Claude AI generates items based on YOUR habits
          </p>
        </div>

        {/* User Habits */}
        <div className="bg-slate-800 border border-cyan-500 p-6 rounded-lg mb-6">
          <h2 className="text-cyan-400 text-xl mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Your Active Habits
          </h2>
          <div className="flex flex-wrap gap-2">
            {habits.map((habit, i) => (
              <span key={i} className="bg-cyan-900 text-cyan-100 px-3 py-1 rounded text-sm">
                {habit}
              </span>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateAIShop}
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-lg mb-6 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Cpu className="w-5 h-5 animate-spin" />
              AI GENERATING ITEMS...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              GENERATE AI SHOP
            </>
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="bg-red-900 border border-red-500 p-4 rounded mb-6">
            <p className="text-red-200">Error: {error}</p>
          </div>
        )}

        {/* Shop Items */}
        {shopItems.length > 0 && (
          <div className="bg-slate-800 border border-purple-500 p-6 rounded-lg">
            <h2 className="text-purple-400 text-xl mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              AI-Generated Black Market
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shopItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-slate-900 border border-cyan-700 p-4 rounded hover:border-cyan-400 transition-all group"
                >
                  <div className="text-4xl mb-2 text-center">{item.icon}</div>
                  <h3 className="font-bold text-cyan-100 text-center mb-2">
                    {item.name}
                  </h3>
                  <p className="text-xs text-cyan-600 text-center mb-3">
                    {item.description}
                  </p>
                  <div className="bg-cyan-900 text-cyan-100 py-2 rounded text-center font-bold">
                    {item.price} CR
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-cyan-500/30 p-6 rounded-lg">
          <h3 className="text-cyan-400 font-bold mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            How It Works
          </h3>
          <ul className="text-sm text-slate-300 space-y-2">
            <li>• Claude AI analyzes your active habits</li>
            <li>• Generates personalized cyberpunk items</li>
            <li>• Each item relates to YOUR productivity goals</li>
            <li>• Shop refreshes with new AI-generated content</li>
          </ul>
        </div>

        {/* Implementation Note */}
        <div className="mt-6 bg-yellow-900/20 border border-yellow-500/50 p-4 rounded">
          <p className="text-yellow-200 text-sm">
            <strong>💡 For Your Hackathon Project:</strong> Replace the random generator 
            in <code className="bg-black/50 px-2 py-1 rounded">src/utils/aiGenerator.js</code> with 
            this Claude API approach. This makes your "AI" claim legitimate and impressive!
          </p>
        </div>
      </div>
    </div>
  );
}
