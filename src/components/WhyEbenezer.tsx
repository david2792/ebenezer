'use client';

import React from 'react';
import { ShieldCheck, Award, Zap, Wrench, CheckCircle, Palette } from 'lucide-react';

export default function WhyEbenezer() {
  const pillars = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#00FF66]" />,
      title: 'Acero Estructural Calibre Pesado',
      description: 'Chasis construidos con perfiles de alta resistencia diseñados para soportar el uso comercial más exigente las 24 horas del día.',
    },
    {
      icon: <Award className="w-8 h-8 text-[#00FF66]" />,
      title: 'Biomecánica de Alta Precisión',
      description: 'Ejes convergentes y divergentes que emulan la cinemática articular natural, optimizando la hipertrofia y reduciendo lesiones.',
    },
    {
      icon: <Zap className="w-8 h-8 text-[#00FF66]" />,
      title: 'Pintura Electrostática al Horno',
      description: 'Recubrimiento en polvo curado térmicamente, resistente a rayones, impactos y a la corrosión provocada por la transpiración.',
    },
    {
      icon: <Palette className="w-8 h-8 text-[#00FF66]" />,
      title: 'Personalización de Colores',
      description: 'Personaliza la estructura y la tapicería de alto impacto con los colores corporativos y la identidad de tu gimnasio.',
    },
    {
      icon: <Wrench className="w-8 h-8 text-[#00FF66]" />,
      title: 'Garantía y Repuestos Nacionales',
      description: 'Disponibilidad permanente de rodamientos lineales, poleas de aluminio, cables aeronáuticos y espumas de alta densidad.',
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-[#00FF66]" />,
      title: 'Equipamiento Integral de Gimnasios',
      description: 'Asesoramiento técnico para distribución espacial y diseño de salas de musculación profesionales desde cero.',
    },
  ];

  return (
    <section id="calidad" className="w-full bg-[#080A0E] py-20 border-t border-b border-[#1A202C] relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#00FF66]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/20 mb-3">
            Garantía de Fábrica Ebenezer
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Construidas para el <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF66] to-[#10B981]">Alto Rendimiento</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Cada máquina Ebenezer es fabricada combinando robustez industrial, ergonomía deportiva y acabados de vanguardia.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-gradient-to-b from-[#11151F] to-[#0D1017] border border-[#1F2736] hover:border-[#00FF66]/40 transition-all duration-300 group hover:shadow-xl hover:shadow-[#00FF66]/10"
            >
              <div className="p-3 w-fit rounded-xl bg-[#171D2A] border border-[#263145] mb-5 group-hover:scale-110 group-hover:border-[#00FF66]/50 transition-all">
                {pillar.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00FF66] transition-colors">
                {pillar.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
