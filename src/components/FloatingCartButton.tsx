'use client';

import React from 'react';
import { ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function FloatingCartButton() {
  const { totalCount, openCart, isOpen } = useCart();

  // If the drawer is already open, hide the floating button to prevent overlap
  if (isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* If there are items in the cart, show the prominent Quote Cart pill */}
      {totalCount > 0 && (
        <button
          onClick={openCart}
          className="group flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#10141D] text-white border-2 border-[#00FF66] shadow-[0_0_25px_rgba(0,255,102,0.35)] hover:shadow-[0_0_35px_rgba(0,255,102,0.6)] hover:bg-[#141A26] transition-all duration-300 transform hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-6"
          title="Ver mi lista de cotización"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-[#00FF66]" />
            <span className="absolute -top-2 -right-2.5 w-5 h-5 rounded-full bg-[#00FF66] text-black font-black text-[11px] flex items-center justify-center shadow-lg animate-pulse">
              {totalCount}
            </span>
          </div>
          <span className="font-bold text-xs sm:text-sm tracking-wide">
            Ver Cotización
          </span>
          <span className="hidden sm:inline-block text-xs bg-[#00FF66]/20 text-[#00FF66] px-2 py-0.5 rounded-full font-semibold">
            {totalCount} {totalCount === 1 ? 'máquina' : 'máquinas'}
          </span>
        </button>
      )}
    </div>
  );
}
