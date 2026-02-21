// src/components/ShopModal.js

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
  isGenerating,
}) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      const REFRESH_INTERVAL = 5 * 60 * 60 * 1000;
      const diff = lastRefresh + REFRESH_INTERVAL - Date.now();
      if (diff <= 0) {
        setTimeLeft("Ready to refresh");
      } else {
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${h}h ${m}m ${s}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, lastRefresh]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-end sm:items-center justify-center z-50 backdrop-blur-md p-0 sm:p-4">
      {/*
        On mobile: sheet slides up from bottom (items-end, rounded-t-2xl, no bottom border-radius).
        On desktop: centered modal with rounded corners.
      */}
      <div className="bg-[#0f172a] border-2 border-cyan-500 rounded-t-2xl sm:rounded-lg p-4 sm:p-6 w-full sm:max-w-lg relative shadow-[0_0_20px_rgba(6,182,212,0.5)] max-h-[92vh] sm:max-h-[85vh] flex flex-col">

        {/* Drag handle (mobile only) */}
        <div className="sm:hidden w-10 h-1 bg-slate-600 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex justify-between items-start mb-4 border-b border-cyan-900 pb-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-mono font-bold text-cyan-400 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              BLACK_MARKET
            </h2>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] sm:text-xs text-cyan-600 mt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeLeft}
              </span>
              <span className="flex items-center gap-1 text-purple-400">
                <Sparkles className="w-3 h-3" />
                AI-GENERATED
              </span>
            </div>
            <p className="text-[10px] text-yellow-400 mt-1">YOUR CREDITS: {userPoints} CR</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close shop"
            className="text-red-500 hover:text-red-400 ml-2 p-1 touch-feedback"
          >
            <X size={20} />
          </button>
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={isGenerating}
          className="w-full mb-4 bg-purple-700 hover:bg-purple-600 disabled:bg-slate-700 text-white font-bold py-3 flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed touch-feedback text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
          {isGenerating ? "AI GENERATING..." : "FORCE REFRESH (AI)"}
        </button>

        {/* Item grid */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 overflow-y-auto custom-scrollbar flex-1 pb-1">
          {isGenerating ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="border border-slate-800 bg-slate-900/50 p-3 sm:p-4 rounded animate-pulse">
                <div className="w-10 h-10 bg-slate-800 rounded mx-auto mb-2" />
                <div className="h-3 bg-slate-800 rounded mb-2" />
                <div className="h-3 bg-slate-800 rounded mb-3 w-3/4 mx-auto" />
                <div className="h-8 bg-slate-800 rounded" />
              </div>
            ))
          ) : shopItems.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-slate-500">
              <ShoppingBag className="w-14 h-14 mx-auto mb-4 opacity-30" />
              <p className="text-base">MARKET OFFLINE</p>
              <p className="text-xs mt-2">Click Force Refresh to generate items</p>
            </div>
          ) : (
            shopItems.map((item) => {
              const canAfford = userPoints >= item.price;
              return (
                <div
                  key={item.id}
                  className={`
                    relative border bg-slate-900/50 p-3 sm:p-4 rounded flex flex-col items-center text-center transition-colors
                    ${canAfford
                      ? "border-cyan-800 hover:border-cyan-400"
                      : "border-slate-800 opacity-60"}
                  `}
                  /* No hover:scale — gets stuck on mobile tap */
                >
                  <div className="text-3xl sm:text-4xl mb-2">
                    {item.icon}
                  </div>
                  {/* line-clamp-1 on name prevents card height divergence */}
                  <h3 className="font-mono text-cyan-100 text-xs sm:text-sm mb-1 line-clamp-1 w-full">
                    {item.name}
                  </h3>
                  <p className="text-[9px] sm:text-[10px] text-cyan-600 mb-3 line-clamp-2 w-full">
                    {item.description}
                  </p>

                  <button
                    onClick={() => canAfford && onBuy(item)}
                    disabled={!canAfford}
                    className={`
                      w-full py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all touch-feedback
                      ${canAfford
                        ? "bg-cyan-700 text-white hover:bg-cyan-500 active:scale-95 cursor-pointer"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed"}
                    `}
                  >
                    {item.price} CR
                  </button>

                  {!canAfford && (
                    <div className="absolute top-1.5 right-1.5 bg-red-900 text-red-200 text-[7px] px-1.5 py-0.5">
                      LOCKED
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <p className="mt-4 pt-3 border-t border-cyan-900 text-[10px] text-cyan-600 text-center">
          💡 Items are personalised using Claude AI based on your habits
        </p>
      </div>
    </div>
  );
}
