'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { X, MessageCircle, CheckCircle2, ShieldAlert, Sparkles, Dumbbell, ShoppingBag, Check } from 'lucide-react';
import { Machine } from '@/lib/types';
import { getMachineQuoteWhatsAppUrl } from '@/lib/constants';
import { useCart } from '@/context/CartContext';

interface MachineModalProps {
  machine: Machine | null;
  onClose: () => void;
}

export default function MachineModal({ machine, onClose }: MachineModalProps) {
  const { addToCart, isInCart, getItemQuantity, openCart } = useCart();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (machine) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [machine, onClose]);

  if (!machine) return null;

  const whatsappUrl = getMachineQuoteWhatsAppUrl(machine.name, machine.muscleGroup);
  const inCart = isInCart(machine.id);
  const qty = getItemQuantity(machine.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#0F1218] border border-[#232B3B] rounded-3xl overflow-hidden shadow-2xl shadow-black max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#181E2A]/80 text-gray-400 hover:text-white hover:bg-[#252E40] transition-colors border border-gray-700"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Machine Picture */}
            <div className="md:col-span-6 relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden bg-[#0A0C10] border border-gray-800 flex items-center justify-center group">
              <Image
                src={machine.imageUrl}
                alt={machine.name}
                fill
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00FF66] text-black shadow-md shadow-[#00FF66]/30">
                  {machine.muscleGroup}
                </span>
              </div>
            </div>

            {/* Information */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#00FF66] text-xs font-bold tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Fabricación Profesional Ebenezer</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 leading-snug">
                  {machine.name}
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-5">
                  {machine.description}
                </p>

                {/* Specs */}
                {machine.specs && machine.specs.length > 0 && (
                  <div className="space-y-2.5 bg-[#141822] p-4 rounded-2xl border border-[#232B3B]">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <Dumbbell className="w-3.5 h-3.5 text-[#00FF66]" />
                      Especificaciones de Construcción
                    </h4>
                    <ul className="space-y-2">
                      {machine.specs.map((spec, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-200">
                          <CheckCircle2 className="w-4 h-4 text-[#00FF66] flex-shrink-0 mt-0.5" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex flex-col gap-2.5">
                {/* Add to Quote Cart Button */}
                <button
                  onClick={() => addToCart(machine)}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 ${
                    inCart
                      ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/60 hover:bg-[#00FF66]/30'
                      : 'bg-[#18202F] text-white hover:bg-[#222B3F] border border-[#2D374B]'
                  }`}
                >
                  {inCart ? (
                    <>
                      <Check className="w-4 h-4 text-[#00FF66]" />
                      <span>En Cotización ({qty}) • Agregar otra unidad</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#00FF66]" />
                      <span>Agregar a Lista de Cotización</span>
                    </>
                  )}
                </button>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-black bg-[#00FF66] hover:bg-[#10B981] shadow-lg shadow-[#00FF66]/25 hover:shadow-[#00FF66]/40 transition-all duration-300"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Cotizar Sólo Esta Máquina</span>
                  </a>
                  <button
                    onClick={onClose}
                    className="px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm text-gray-400 hover:text-white bg-[#141822] hover:bg-[#1C2331] border border-gray-800 transition-colors"
                  >
                    Volver al Catálogo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
