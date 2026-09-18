'use client';

import React from 'react';
import Image from 'next/image';
import { MessageCircle, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { getWhatsAppUrl, CONTACT_INFO } from '@/lib/constants';

export default function Footer() {
  const whatsappUrl = getWhatsAppUrl();

  return (
    <footer id="contacto" className="bg-[#07090D] border-t border-[#191F2B] pt-16 pb-12 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#1A212E]">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <div className="relative h-14 w-56">
              <Image
                src="/images/logo-ebenezer-transparent.png"
                alt="EBENEZER Máquinas para Gimnasio"
                fill
                className="object-contain filter drop-shadow-[0_0_12px_rgba(0,255,102,0.3)]"
              />
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Fabricación de maquinaria pesada para gimnasios comerciales y boxes de entrenamiento. Biomecánica exacta, durabilidad de por vida y máxima satisfacción de tus atletas.
            </p>
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-black bg-[#00FF66] hover:bg-[#10B981] shadow-lg shadow-[#00FF66]/20 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Hablar con un Asesor Técnico</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#inicio" className="hover:text-[#00FF66] transition-colors">Inicio</a>
              </li>
              <li>
                <a href="#carrusel" className="hover:text-[#00FF66] transition-colors">Equipos Destacados</a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-[#00FF66] transition-colors">Catálogo por Músculo</a>
              </li>
              <li>
                <a href="#calidad" className="hover:text-[#00FF66] transition-colors">Calidad y Fabricación</a>
              </li>
            </ul>
          </div>

          {/* Muscle Groups links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Líneas</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#catalogo" className="hover:text-[#00FF66] transition-colors">Línea Pecho</a></li>
              <li><a href="#catalogo" className="hover:text-[#00FF66] transition-colors">Línea Piernas</a></li>
              <li><a href="#catalogo" className="hover:text-[#00FF66] transition-colors">Línea Espalda</a></li>
              <li><a href="#catalogo" className="hover:text-[#00FF66] transition-colors">Línea Hombros</a></li>
              <li><a href="#catalogo" className="hover:text-[#00FF66] transition-colors">Jaulas & Racks</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Atención y Ventas</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#00FF66] flex-shrink-0 mt-1" />
                <span>Fábrica y Salón de Ventas: {CONTACT_INFO.city}, Paraguay. Envíos e instalaciones a todo el país.</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#00FF66] flex-shrink-0" />
                <span>Ventas / WhatsApp: <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#00FF66] font-semibold">{CONTACT_INFO.phoneDisplay}</a></span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#00FF66] flex-shrink-0" />
                <span>{CONTACT_INFO.schedule}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#00FF66] flex-shrink-0" />
                <span>{CONTACT_INFO.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} EBENEZER - Máquinas para Gimnasio ({CONTACT_INFO.city}, Paraguay). Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <span>Fabricación Pesada</span>
            <span>•</span>
            <span>Biomecánica Pro</span>
            <span>•</span>
            <span>Garantía Oficial</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
