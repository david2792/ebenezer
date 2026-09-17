'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, MessageCircle, Eye, Sparkles, Dumbbell, ShoppingBag, Check } from 'lucide-react';
import { Machine } from '@/lib/types';
import { getMachineQuoteWhatsAppUrl } from '@/lib/constants';
import { useCart } from '@/context/CartContext';

interface HeroCarouselProps {
  machines: Machine[];
  onSelectMachine?: (machine: Machine) => void;
}

export default function HeroCarousel({ machines, onSelectMachine }: HeroCarouselProps) {
  const { addToCart, isInCart, getItemQuantity } = useCart();

  // Filter featured machines or fallback to first 6 machines
  const carouselItems = machines.filter(m => m.featured).length > 0 
    ? machines.filter(m => m.featured) 
    : machines.slice(0, 6);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
  }, [carouselItems.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  }, [carouselItems.length]);

  // Autoplay interval
  useEffect(() => {
    if (isPaused || carouselItems.length === 0) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, carouselItems.length]);

  if (carouselItems.length === 0) return null;

  const current = carouselItems[currentIndex];
  const whatsappUrl = getMachineQuoteWhatsAppUrl(current.name, current.muscleGroup);

  return (
    <div
      id="carrusel"
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Container with sports brutalism border & glow */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#121620] via-[#0E1118] to-[#080A0E] border border-[#252E3E] shadow-2xl shadow-black/80">
        {/* Decorative corner highlights */}
        <div className="absolute top-0 left-0 w-24 h-1 bg-[#00FF66] shadow-[0_0_15px_#00FF66] z-20" />
        <div className="absolute top-0 left-0 w-1 h-24 bg-[#00FF66] shadow-[0_0_15px_#00FF66] z-20" />
        <div className="absolute bottom-0 right-0 w-24 h-1 bg-[#00FF66] shadow-[0_0_15px_#00FF66] z-20" />
        <div className="absolute bottom-0 right-0 w-1 h-24 bg-[#00FF66] shadow-[0_0_15px_#00FF66] z-20" />

        {/* Slide Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px] lg:min-h-[580px]">
          {/* Left Column: Details & CTA */}
          <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-between z-10 relative bg-gradient-to-r from-[#0E1118] via-[#0E1118]/90 to-transparent">
            <div>
              {/* Badge header */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  Línea Élite Ebenezer
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#1C2331] text-gray-300 border border-gray-700">
                  <Dumbbell className="w-3 h-3 text-[#00FF66]" />
                  {current.muscleGroup}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
                {current.name}
              </h2>

              {/* Description */}
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 line-clamp-3">
                {current.description}
              </p>

              {/* Specs pills */}
              {current.specs && current.specs.length > 0 && (
                <div className="space-y-2 mb-8">
                  {current.specs.slice(0, 3).map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-300">
                      <div className="w-2 h-2 rounded-full bg-[#00FF66] shadow-[0_0_8px_#00FF66] flex-shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-800/80">
              {/* Add to Cart */}
              <button
                onClick={() => addToCart(current)}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  isInCart(current.id)
                    ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/60 hover:bg-[#00FF66]/30 shadow-[0_0_15px_rgba(0,255,102,0.2)]'
                    : 'bg-[#18202D] text-white hover:bg-[#202B3D] border border-gray-700'
                }`}
              >
                {isInCart(current.id) ? (
                  <>
                    <Check className="w-4 h-4 text-[#00FF66]" />
                    <span>En Cotización ({getItemQuantity(current.id)}) • +1</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#00FF66]" />
                    <span>Agregar a Cotización</span>
                  </>
                )}
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-black bg-[#00FF66] hover:bg-[#10B981] shadow-lg shadow-[#00FF66]/25 hover:shadow-[#00FF66]/40 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Cotizar Sola</span>
              </a>

              {onSelectMachine && (
                <button
                  onClick={() => onSelectMachine(current)}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-gray-200 bg-[#161B26] hover:bg-[#202736] border border-gray-700 hover:border-gray-500 transition-all"
                >
                  <Eye className="w-4 h-4 text-[#00FF66]" />
                  <span>Ficha Técnica</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Large Photo with Glow */}
          <div className="lg:col-span-6 relative min-h-[340px] sm:min-h-[420px] lg:min-h-full flex items-center justify-center p-4 sm:p-8 bg-[#090B0F]/60">
            {/* Background spotlight radial gradient */}
            <div className="absolute inset-0 bg-radial from-[#00FF66]/10 via-transparent to-transparent opacity-60" />
            
            <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[480px] rounded-2xl overflow-hidden group shadow-2xl">
              <Image
                src={current.imageUrl}
                alt={current.name}
                fill
                className="object-contain p-2 sm:p-4 transition-all duration-700 ease-out transform group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Carousel Navigation Bar */}
        <div className="bg-[#0A0D13] border-t border-[#1C2331] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Thumbnails / Indicators */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {carouselItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className={`relative h-12 w-16 sm:h-14 sm:w-20 rounded-lg overflow-hidden border transition-all duration-300 flex-shrink-0 ${
                  currentIndex === idx
                    ? 'border-[#00FF66] shadow-[0_0_12px_rgba(0,255,102,0.5)] scale-105 ring-1 ring-[#00FF66]'
                    : 'border-gray-800 opacity-50 hover:opacity-100'
                }`}
                title={item.name}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Controls: Prev, Play/Pause Indicator, Next */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-mono">
              <span className="text-[#00FF66] font-bold">{currentIndex + 1}</span> / {carouselItems.length}
            </span>
            <div className="flex items-center gap-1 bg-[#141923] p-1 rounded-xl border border-gray-800">
              <button
                onClick={prevSlide}
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
