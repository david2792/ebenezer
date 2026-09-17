'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, MessageCircle, ShieldCheck, Dumbbell, MapPin, ShoppingBag } from 'lucide-react';
import { getWhatsAppUrl, CONTACT_INFO } from '@/lib/constants';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalCount, openCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappUrl = getWhatsAppUrl();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0A0C10]/95 backdrop-blur-md border-b border-[#1F2533] shadow-lg shadow-black/50 py-2'
          : 'bg-gradient-to-b from-[#0A0C10]/90 via-[#0A0C10]/60 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-12 w-48 sm:h-14 sm:w-56 overflow-hidden flex items-center">
            <Image
              src="/images/logo-ebenezer-transparent.png"
              alt="EBENEZER - Máquinas para Gimnasio"
              fill
              className="object-contain filter drop-shadow-[0_0_12px_rgba(0,255,102,0.35)] group-hover:brightness-110 transition-all duration-300"
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <a
            href="#inicio"
            className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-[#00FF66] transition-colors rounded-lg hover:bg-white/5"
          >
            Inicio
          </a>
          <a
            href="#carrusel"
            className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-[#00FF66] transition-colors rounded-lg hover:bg-white/5"
          >
            Destacados
          </a>
          <a
            href="#catalogo"
            className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-[#00FF66] transition-colors rounded-lg hover:bg-white/5 flex items-center gap-1.5"
          >
            <Dumbbell className="w-4 h-4 text-[#00FF66]" />
            Catálogo por Músculo
          </a>
          <a
            href="#calidad"
            className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-[#00FF66] transition-colors rounded-lg hover:bg-white/5"
          >
            Calidad Ebenezer
          </a>
          <a
            href="#contacto"
            className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-[#00FF66] transition-colors rounded-lg hover:bg-white/5"
          >
            Contacto
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-gray-400 mr-1">
            <MapPin className="w-3.5 h-3.5 text-[#00FF66]" />
            <span>{CONTACT_INFO.city}</span>
          </div>

          {/* Cart Trigger Button */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#141822] hover:bg-[#1A2130] border border-[#232D3F] hover:border-[#00FF66]/50 transition-all shadow-md group"
            title="Ver lista de cotización"
          >
            <ShoppingBag className="w-4 h-4 text-[#00FF66] group-hover:scale-110 transition-transform" />
            <span>Cotización</span>
            {totalCount > 0 ? (
              <span className="px-1.5 py-0.5 rounded-full bg-[#00FF66] text-black font-extrabold text-[10px] min-w-[18px] text-center shadow-sm">
                {totalCount}
              </span>
            ) : (
              <span className="text-[11px] text-gray-400 font-normal">(0)</span>
            )}
          </button>

          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-gray-400 hover:text-white bg-[#141821] hover:bg-[#1C2230] border border-gray-800 transition-all"
            title="Panel de Administración"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#00FF66]" />
            <span>Admin</span>
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-black bg-[#00FF66] hover:bg-[#10B981] shadow-lg shadow-[#00FF66]/20 hover:shadow-[#00FF66]/40 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Cotizar WhatsApp</span>
          </a>
        </div>

        {/* Mobile Hamburger & Cart Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          {/* Mobile Cart Button */}
          <button
            onClick={openCart}
            className="relative p-2 rounded-lg text-white bg-[#141821] border border-gray-800 flex items-center justify-center"
            title="Ver cotización"
            aria-label="Abrir carrito de cotización"
          >
            <ShoppingBag className="w-4 h-4 text-[#00FF66]" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00FF66] text-black font-black text-[9px] flex items-center justify-center shadow-md">
                {totalCount}
              </span>
            )}
          </button>

          <Link
            href="/admin"
            className="p-2 rounded-lg text-xs font-semibold text-gray-400 bg-[#141821] border border-gray-800"
          >
            <ShieldCheck className="w-4 h-4 text-[#00FF66]" />
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 focus:outline-none"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#0D1017] border-b border-[#1F2533] px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <a
            href="#inicio"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-[#00FF66] hover:bg-white/5"
          >
            Inicio
          </a>
          <a
            href="#carrusel"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-[#00FF66] hover:bg-white/5"
          >
            Destacados
          </a>
          <a
            href="#catalogo"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-[#00FF66] hover:bg-white/5 flex items-center gap-2"
          >
            <Dumbbell className="w-4 h-4" />
            Catálogo por Grupo Muscular
          </a>
          <a
            href="#calidad"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-[#00FF66] hover:bg-white/5"
          >
            Calidad Ebenezer
          </a>
          <a
            href="#contacto"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-[#00FF66] hover:bg-white/5"
          >
            Contacto ({CONTACT_INFO.city})
          </a>
          <div className="pt-2 border-t border-gray-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openCart();
              }}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-bold text-white bg-[#151B27] border border-[#00FF66]/50 hover:bg-[#1C2435]"
            >
              <ShoppingBag className="w-4 h-4 text-[#00FF66]" />
              <span>Ver mi Lista de Cotización ({totalCount})</span>
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-bold text-black bg-[#00FF66] hover:bg-[#10B981] shadow-md shadow-[#00FF66]/20"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Cotizar por WhatsApp ({CONTACT_INFO.phoneDisplay})</span>
            </a>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold text-gray-300 bg-[#141821] border border-gray-800"
            >
              <ShieldCheck className="w-4 h-4 text-[#00FF66]" />
              <span>Acceso Panel de Administración</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
