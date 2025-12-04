"use client";
import { X, ShoppingBag, Clock } from "lucide-react";
import { useState, useEffect } from "react";

export default function ShopModal({ isOpen, onClose, userPoints, shopItems, lastRefresh, onBuy }) {
  const [timeLeft, setTimeLeft] = useState("");

  // Countdown Timer Logic
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      const REFRESH_INTERVAL = 5 * 60 * 60 * 1000;
      const nextRefresh = lastRefresh + REFRESH_INTERVAL;
      const now = Date.now();
      const diff = nextRefresh - now;

      if (diff <= 0) {
        setTimeLeft("Refreshing...");
      } else {
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, lastRefresh]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-md">
      <div className="bg-[#0f172a] border-2 border-cyan-500 rounded-lg p-6 w-full max-w-lg relative shadow-[0_0_20px_rgba(6,182,212,0.5)]">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-cyan-900 pb-4">
          <div>
            <h2 className="text-2xl font-mono font-bold text-cyan-400 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              BLACK_MARKET
            </h2>
            <div className="flex items-center gap-2 text-xs text-cyan-600 mt-1">
              <Clock className="w-3 h-3" />
              <span>REFRESH IN: {timeLeft}</span>
            </div>
            {/* Debug Info - Remove this later */}
            <div className="text-xs text-yellow-400 mt-1">
              YOUR CREDITS: {userPoints} CR | ITEMS: {shopItems.length}
            </div>
          </div>
          <button onClick={onClose} className="text-red-500 hover:text-red-400">
            <X size={24} />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {shopItems.map((item) => {
            const canAfford = userPoints >= item.price;
            console.log(`Item: ${item.name}, Price: ${item.price}, User Points: ${userPoints}, Can Afford: ${canAfford}`);
            
            return (
              <div 
                key={item.id} 
                className={`
                  relative border border-cyan-800 bg-slate-900/50 p-4 rounded flex flex-col items-center text-center transition-all group
                  ${canAfford ? "hover:border-cyan-400 hover:scale-105" : "opacity-60"}
                `}
              >
                <div className="text-4xl mb-2 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                  {item.icon}
                </div>
                <h3 className="font-mono text-cyan-100 text-sm mb-1">{item.name}</h3>
                <p className="text-[10px] text-cyan-600 mb-2">{item.description}</p>
                
                <button
                  onClick={() => canAfford && onBuy(item)}
                  disabled={!canAfford}
                  className={`
                    w-full py-2 rounded text-xs font-bold uppercase tracking-wider transition-all
                    ${canAfford 
                      ? "bg-cyan-700 text-white hover:bg-cyan-500 hover:shadow-[0_0_10px_cyan] cursor-pointer active:scale-95" 
                      : "bg-slate-800 text-slate-500 cursor-not-allowed"}
                  `}
                >
                  {item.price} CR
                </button>
                
                {!canAfford && (
                  <div className="absolute top-2 right-2 bg-red-900 text-red-200 text-[8px] px-2 py-1 rounded">
                    LOCKED
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
