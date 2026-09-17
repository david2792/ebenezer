import React from 'react';
import Navbar from '@/components/Navbar';
import HeroCarousel from '@/components/HeroCarousel';
import MachineCatalog from '@/components/MachineCatalog';
import WhyEbenezer from '@/components/WhyEbenezer';
import Footer from '@/components/Footer';
import { getMachines } from '@/lib/machines';
import { getWhatsAppUrl, CONTACT_INFO } from '@/lib/constants';
import { Dumbbell, Shield, Zap, Award, ArrowRight, MessageCircle, MapPin } from 'lucide-react';

// Revalidate data periodically so changes from admin reflect quickly
export const revalidate = 0;

export default async function HomePage() {
  const machines = await getMachines();
  const whatsappUrl = getWhatsAppUrl();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Hero Top Presentation */}
        <section id="inicio" className="relative pt-32 pb-12 sm:pt-40 sm:pb-16 overflow-hidden">
          {/* Ambient Lighting Gradients */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[350px] bg-[#00FF66]/10 rounded-full blur-2xl sm:blur-[140px] pointer-events-none" />
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#10B981]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase bg-[#141A24] border border-[#00FF66]/30 text-[#00FF66] shadow-[0_0_20px_rgba(0,255,102,0.15)] mb-6 animate-pulse">
              <Zap className="w-4 h-4 fill-current" />
              <span>Fabricación Pesada de Alto Rendimiento • {CONTACT_INFO.city}, Paraguay</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-5xl mx-auto mb-6">
              MÁQUINAS DE GIMNASIO QUE{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF66] via-[#22C55E] to-[#10B981] drop-shadow-[0_0_35px_rgba(0,255,102,0.4)]">
                FORJAN CAMPEONES
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-300 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
              Equipamiento profesional en acero estructural de alta resistencia, biomecánica exacta y estética implacable. Diseñadas para resistir las cargas más exigentes en salas de musculación y centros de alto rendimiento.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <a
                href="#catalogo"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wider text-black bg-[#00FF66] hover:bg-[#10B981] shadow-xl shadow-[#00FF66]/30 hover:shadow-[#00FF66]/50 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Dumbbell className="w-5 h-5" />
                <span>Explorar Catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-bold text-sm text-gray-200 bg-[#141823] hover:bg-[#1E2435] border border-gray-700 hover:border-gray-500 shadow-lg transition-all"
              >
                <MessageCircle className="w-5 h-5 text-[#00FF66] fill-current" />
                <span>Cotizar por WhatsApp</span>
              </a>
            </div>

            {/* Stats / Proof Highlights Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-10 border-t border-[#1C2230] max-w-4xl mx-auto">
              <div className="p-3">
                <div className="text-2xl sm:text-3xl font-black text-white font-mono text-glow-green">CALIBRE 11</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Acero Estructural Pesado</div>
              </div>
              <div className="p-3">
                <div className="text-2xl sm:text-3xl font-black text-white font-mono text-glow-green">100%</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Biomecánica Asistida</div>
              </div>
              <div className="p-3">
                <div className="text-2xl sm:text-3xl font-black text-white font-mono text-glow-green">+500</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Equipos en Gimnasios</div>
              </div>
              <div className="p-3">
                <div className="text-2xl sm:text-3xl font-black text-white font-mono text-glow-green">OFICIAL</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Garantía Directa de Fábrica</div>
              </div>
            </div>
          </div>
        </section>

        {/* Hero Interactive Carousel Section */}
        <HeroCarousel machines={machines} />

        {/* Complete Machine Catalog by Muscle Group */}
        <MachineCatalog initialMachines={machines} />

        {/* Why Choose Ebenezer / Factory & Biomechanics */}
        <WhyEbenezer />
      </main>

      <Footer />
    </div>
  );
}
