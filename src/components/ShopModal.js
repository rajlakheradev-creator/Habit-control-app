// src/components/ShopModal.js - ENHANCED VERSION

"use client";
import { X, ShoppingBag, Clock, RefreshCw, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export default function ShopModal({ 
  isOpen, 
  onClose, 
  userPoints, 
  shopItems, 
  lastRefresh, 
  onBuy,
  onRefresh,
  isGenerating 
}) {
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
        setTimeLeft("Ready to refresh");
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
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-md p-4">
      <div className="bg-[#0f172a] border-2 border-cyan-500 rounded-lg p-4 md:p-6 w-full max-w-lg relative shadow-[0_0_20px_rgba(6,182,212,0.5)] max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4 md:mb-6 border-b border-cyan-900 pb-3 md:pb-4">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-mono font-bold text-cyan-400 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
              BLACK_MARKET
            </h2>
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 text-[10px] md:text-xs text-cyan-600 mt-1">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>AUTO REFRESH: {timeLeft}</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span className="text-purple-400">AI-GENERATED</span>
              </div>
            </div>
            <div className="text-[10px] text-yellow-400 mt-1">
              YOUR CREDITS: {userPoints} CR
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-red-500 hover:text-red-400 ml-2 touch-feedback"
          >
            <X size={20} className="md:w-6 md:h-6" />
          </button>
        </div>

        {/* Manual Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isGenerating}
          className="w-full mb-4 bg-purple-700 hover:bg-purple-600 disabled:bg-slate-700 text-white font-bold py-2 md:py-3 rounded flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed touch-feedback text-sm md:text-base"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? "AI GENERATING..." : "FORCE REFRESH (AI)"}
        </button>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
          {isGenerating ? (
            // Loading skeletons
            [...Array(6)].map((_, i) => (
              <div key={i} className="border border-slate-800 bg-slate-900/50 p-4 rounded animate-pulse">
                <div className="w-12 h-12 bg-slate-800 rounded mx-auto mb-2"></div>
                <div className="h-4 bg-slate-800 rounded mb-2"></div>
                <div className="h-3 bg-slate-800 rounded mb-3"></div>
                <div className="h-8 bg-slate-800 rounded"></div>
              </div>
            ))
          ) : shopItems.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-slate-500">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">MARKET OFFLINE</p>
              <p className="text-sm mt-2">Click Force Refresh to generate items</p>
            </div>
          ) : (
            shopItems.map((item) => {
              const canAfford = userPoints >= item.price;
              
              return (
                <div 
                  key={item.id} 
                  className={`
                    relative border border-cyan-800 bg-slate-900/50 p-3 md:p-4 rounded flex flex-col items-center text-center transition-all group
                    ${canAfford ? "hover:border-cyan-400 hover:scale-105" : "opacity-60"}
                  `}
                >
                  <div className="text-3xl md:text-4xl mb-2 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                    {item.icon}
                  </div>
                  <h3 className="font-mono text-cyan-100 text-xs md:text-sm mb-1 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-[9px] md:text-[10px] text-cyan-600 mb-2 line-clamp-2">
                    {item.description}
                  </p>
                  
                  <button
                    onClick={() => canAfford && onBuy(item)}
                    disabled={!canAfford}
                    className={`
                      w-full py-1.5 md:py-2 rounded text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all touch-feedback
                      ${canAfford 
                        ? "bg-cyan-700 text-white hover:bg-cyan-500 hover:shadow-[0_0_10px_cyan] cursor-pointer active:scale-95" 
                        : "bg-slate-800 text-slate-500 cursor-not-allowed"}
                    `}
                  >
                    {item.price} CR
                  </button>
                  
                  {!canAfford && (
                    <div className="absolute top-1 md:top-2 right-1 md:right-2 bg-red-900 text-red-200 text-[7px] md:text-[8px] px-1.5 md:px-2 py-0.5 md:py-1 rounded">
                      LOCKED
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-4 pt-3 border-t border-cyan-900 text-[10px] text-cyan-600 text-center">
          <p>💡 Items are personalized using Claude AI based on your habits</p>
        </div>
      </div>
    </div>
  );
}
