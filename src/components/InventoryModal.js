"use client";
import { X, Package, Sparkles } from "lucide-react";
import { useEffect } from "react";

export default function InventoryModal({ isOpen, onClose, inventory, onView }) {
  // Mark items as viewed when modal opens
  useEffect(() => {
    if (isOpen && onView) {
      onView();
    }
  }, [isOpen, onView]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-md p-4">
      <div className="bg-[#0f172a] border-2 border-purple-500 rounded-lg p-4 md:p-6 w-full max-w-lg relative shadow-[0_0_20px_rgba(168,85,247,0.5)] max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4 md:mb-6 border-b border-purple-900 pb-3 md:pb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-mono font-bold text-purple-400 flex items-center gap-2">
              <Package className="w-4 h-4 md:w-5 md:h-5" />
              INVENTORY
            </h2>
            <p className="text-[10px] md:text-xs text-purple-600 mt-1">
              {inventory.length} ITEM{inventory.length !== 1 ? 'S' : ''} COLLECTED
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-red-500 hover:text-red-400 touch-feedback"
          >
            <X size={20} className="md:w-6 md:h-6" />
          </button>
        </div>

        {/* Inventory Grid */}
        <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar flex-1">
          {inventory.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Package className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 opacity-30" />
              <p className="text-base md:text-lg">INVENTORY EMPTY</p>
              <p className="text-xs md:text-sm mt-2">Visit the Black Market to acquire items</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {inventory.map((item, index) => {
                const purchaseDate = new Date(item.purchasedAt);
                const isNew = item.viewed === false; // Show NEW badge only for unviewed items
                
                return (
                  <div 
                    key={`${item.id}-${index}`}
                    className="relative border border-purple-800 bg-slate-900/50 p-3 md:p-4 rounded flex flex-col items-center text-center group hover:border-purple-400 transition-all"
                  >
                    {/* New Badge for recently purchased items */}
                    {isNew && (
                      <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[8px] px-2 py-1 rounded-full font-bold flex items-center gap-1 animate-pulse">
                        <Sparkles className="w-2 h-2" />
                        NEW
                      </div>
                    )}
                    
                    <div className="text-3xl md:text-4xl mb-2 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                      {item.icon}
                    </div>
                    <h3 className="font-mono text-purple-100 text-xs md:text-sm font-bold mb-1">
                      {item.name}
                    </h3>
                    <p className="text-[9px] md:text-[10px] text-purple-400 mb-2 line-clamp-2">
                      {item.description}
                    </p>
                    
                    <div className="w-full pt-2 border-t border-purple-900/50 space-y-1">
                      <div className="text-[9px] text-purple-600 flex items-center justify-between">
                        <span>VALUE:</span>
                        <span className="text-purple-400 font-bold">{item.price} CR</span>
                      </div>
                      <div className="text-[9px] text-purple-600">
                        Acquired: {purchaseDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Total Value */}
        {inventory.length > 0 && (
          <div className="mt-4 pt-3 md:pt-4 border-t border-purple-900 flex justify-between items-center">
            <span className="text-xs md:text-sm text-purple-400 font-mono">TOTAL VALUE:</span>
            <span className="text-lg md:text-xl font-bold text-purple-300">
              {inventory.reduce((sum, item) => sum + item.price, 0)} CR
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
