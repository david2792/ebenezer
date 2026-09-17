'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  MessageCircle, 
  ShoppingBag, 
  Dumbbell, 
  MapPin, 
  User, 
  FileText,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getMultipleMachinesQuoteWhatsAppUrl, CONTACT_INFO } from '@/lib/constants';

export default function CartDrawer() {
  const { 
    items, 
    isOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    totalCount,
    toastMessage 
  } = useCart();

  const [clientName, setClientName] = useState('');
  const [clientCity, setClientCity] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [showDetailsForm, setShowDetailsForm] = useState(false);

  // Close with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeCart]);

  const whatsappUrl = getMultipleMachinesQuoteWhatsAppUrl(items, {
    name: clientName,
    city: clientCity,
    notes: clientNotes
  });

  return (
    <>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-none">
          <div className="bg-[#141A24] border border-[#00FF66]/50 text-white px-5 py-2.5 rounded-full shadow-2xl shadow-black/80 flex items-center gap-2.5 text-xs sm:text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-ping" />
            <span className="text-gray-200">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Drawer Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
          onClick={closeCart}
        />
      )}

      {/* Drawer Side Panel */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[480px] bg-[#0C0F16] border-l border-[#1F2636] shadow-2xl shadow-black flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Carrito de Cotización"
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-[#1A2230] flex items-center justify-between bg-[#0E121B]">
          <div className="flex items-center gap-3">
            <div className="relative p-2 rounded-xl bg-[#161C28] border border-gray-800 text-[#00FF66]">
              <ShoppingBag className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#00FF66] text-black font-black text-[10px] flex items-center justify-center shadow-md">
                  {totalCount}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                Lista de Cotización
                {items.length > 0 && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/20">
                    {items.length} {items.length === 1 ? 'modelo' : 'modelos'}
                  </span>
                )}
              </h2>
              <p className="text-xs text-gray-400">
                Selección de equipos para presupuesto oficial
              </p>
            </div>
          </div>

          <button
            onClick={closeCart}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#1A2230] border border-transparent hover:border-gray-700 transition-colors"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        {items.length === 0 ? (
          /* Empty State */
          <div className="flex-1 px-6 py-12 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-3xl bg-[#141924] border border-gray-800 flex items-center justify-center mb-5 text-gray-500">
              <Dumbbell className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Tu lista de cotización está vacía</h3>
            <p className="text-gray-400 text-xs sm:text-sm max-w-xs mb-8 leading-relaxed">
              Explora nuestro catálogo biomecánico y haz clic en <span className="text-[#00FF66] font-semibold">&ldquo;Agregar a Cotización&rdquo;</span> en las máquinas que necesitas para tu gimnasio.
            </p>
            <button
              onClick={() => {
                closeCart();
                const catalogEl = document.getElementById('catalogo');
                if (catalogEl) {
                  catalogEl.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-black bg-[#00FF66] hover:bg-[#10B981] shadow-lg shadow-[#00FF66]/20 transition-all"
            >
              <span>Explorar Catálogo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Cart Items List */
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {/* Clear all link */}
            <div className="flex items-center justify-between text-xs pb-1">
              <span className="text-gray-400">
                Total de máquinas: <strong className="text-[#00FF66]">{totalCount} unidades</strong>
              </span>
              <button
                onClick={clearCart}
                className="text-gray-500 hover:text-red-400 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Vaciar lista</span>
              </button>
            </div>

            {/* List */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.machine.id}
                  className="bg-[#121620] border border-[#1F2737] hover:border-gray-700 rounded-2xl p-3.5 flex gap-3 items-center group transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-[#080B10] rounded-xl overflow-hidden flex-shrink-0 border border-gray-800 flex items-center justify-center p-1">
                    <Image
                      src={item.machine.imageUrl}
                      alt={item.machine.name}
                      fill
                      className="object-contain p-1"
                      sizes="80px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/20">
                        {item.machine.muscleGroup}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-[#00FF66] transition-colors" title={item.machine.name}>
                      {item.machine.name}
                    </h4>

                    {/* Quantity controls & Delete */}
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-1 bg-[#171E2B] border border-gray-700/60 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.machine.id, item.quantity - 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
                          aria-label="Disminuir cantidad"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-white font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.machine.id, item.quantity + 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.machine.id)}
                        className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                        title="Eliminar de la lista"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Optional Contact / Destination Fields Accordion */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowDetailsForm(!showDetailsForm)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#141822] border border-[#202735] text-xs font-semibold text-gray-300 hover:text-white hover:border-gray-600 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#00FF66]" />
                  <span>Personalizar presupuesto (opcional)</span>
                </span>
                <span className="text-[#00FF66] font-bold">
                  {showDetailsForm ? 'Ocultar' : 'Agregar datos'}
                </span>
              </button>

              {showDetailsForm && (
                <div className="mt-3 p-4 bg-[#11151F] border border-[#1E2535] rounded-2xl space-y-3 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1 flex items-center gap-1.5">
                      <User className="w-3 h-3 text-[#00FF66]" />
                      Tu Nombre o Gimnasio
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ej. Gimnasio Olimpo / Carlos Gómez"
                      className="w-full px-3 py-2 text-xs bg-[#171D29] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF66]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#00FF66]" />
                      Ciudad / Ubicación de entrega
                    </label>
                    <input
                      type="text"
                      value={clientCity}
                      onChange={(e) => setClientCity(e.target.value)}
                      placeholder="Ej. Asunción, CDE, Encarnación, Pedro Juan..."
                      className="w-full px-3 py-2 text-xs bg-[#171D29] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF66]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1 flex items-center gap-1.5">
                      <FileText className="w-3 h-3 text-[#00FF66]" />
                      Notas o Requerimientos adicionales
                    </label>
                    <textarea
                      rows={2}
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      placeholder="Ej. Colores personalizados de tapizado o estructura..."
                      className="w-full px-3 py-2 text-xs bg-[#171D29] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF66] resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Drawer Footer Actions */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#1C2332] bg-[#0E121B] space-y-3">
            {/* Fast Stats */}
            <div className="flex items-center justify-between text-xs text-gray-400 pb-1">
              <span>Máquinas seleccionadas:</span>
              <span className="text-white font-bold font-mono text-sm">{totalCount} unidades</span>
            </div>

            {/* Main WhatsApp Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider text-black bg-[#00FF66] hover:bg-[#10B981] shadow-xl shadow-[#00FF66]/25 hover:shadow-[#00FF66]/40 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Cotizar por WhatsApp ({totalCount})</span>
            </a>

            {/* Direct advice badge */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 text-center pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00FF66]" />
              <span>Atención directa de fábrica • {CONTACT_INFO.city}, Paraguay</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
