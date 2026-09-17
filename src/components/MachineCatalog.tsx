'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Search, MessageCircle, Eye, Dumbbell, Sparkles, X, ShoppingBag, Check, ArrowRight } from 'lucide-react';
import { Machine } from '@/lib/types';
import { getMachineQuoteWhatsAppUrl } from '@/lib/constants';
import { useCart } from '@/context/CartContext';
import MuscleGroupFilter from './MuscleGroupFilter';
import MachineModal from './MachineModal';

interface MachineCatalogProps {
  initialMachines: Machine[];
}

export default function MachineCatalog({ initialMachines }: MachineCatalogProps) {
  const [machines] = useState<Machine[]>(initialMachines);
  const [selectedGroup, setSelectedGroup] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const { addToCart, isInCart, getItemQuantity, totalCount, openCart } = useCart();

  // Group counts calculation
  const counts = useMemo(() => {
    const acc: Record<string, number> = { Todos: machines.length };
    machines.forEach((m) => {
      const g = m.muscleGroup;
      acc[g] = (acc[g] || 0) + 1;
    });
    return acc;
  }, [machines]);

  // Filtered machines
  const filteredMachines = useMemo(() => {
    return machines.filter((m) => {
      const matchesGroup =
        selectedGroup === 'Todos' ||
        m.muscleGroup.toLowerCase() === selectedGroup.toLowerCase();

      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.muscleGroup.toLowerCase().includes(q);

      return matchesGroup && matchesSearch;
    });
  }, [machines, selectedGroup, searchTerm]);

  return (
    <section id="catalogo" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/20 mb-3">
          <Dumbbell className="w-4 h-4" />
          <span>Equipamiento Biomecánico Ebenezer</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
          Catálogo por <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF66] to-[#10B981]">Grupo Muscular</span>
        </h2>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          Explora nuestra línea de máquinas de palanca, placas y peso libre diseñadas con ángulos de movimiento natural para el máximo estímulo neuromuscular y protección articular.
        </p>
      </div>

      {/* Filter and Search Bar Control Panel */}
      <div className="bg-[#0E121A] border border-[#1E2533] p-4 sm:p-6 rounded-2xl mb-10 space-y-6 shadow-xl">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar máquina (ej. Prensa, Sentadilla Hack, Dorsalera, Pecho...)"
            className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-[#141822] border border-[#232B3B] text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:border-[#00FF66] focus:ring-1 focus:ring-[#00FF66] transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Muscle Group Filter Component */}
        <MuscleGroupFilter
          selectedGroup={selectedGroup}
          onSelectGroup={setSelectedGroup}
          counts={counts}
        />
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-800">
        <p className="text-sm text-gray-400">
          Mostrando <span className="text-white font-bold">{filteredMachines.length}</span> {filteredMachines.length === 1 ? 'máquina' : 'máquinas'} en{' '}
          <span className="text-[#00FF66] font-semibold">{selectedGroup}</span>
        </p>
        {(selectedGroup !== 'Todos' || searchTerm) && (
          <button
            onClick={() => {
              setSelectedGroup('Todos');
              setSearchTerm('');
            }}
            className="text-xs text-gray-400 hover:text-[#00FF66] underline underline-offset-4"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Active Cart Notification Banner if machines are selected */}
      {totalCount > 0 && (
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#121824] via-[#0F141F] to-[#0A0D14] border border-[#00FF66]/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-[#00FF66]/15 text-[#00FF66] border border-[#00FF66]/30">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-bold text-white">
                Tienes <span className="text-[#00FF66] font-extrabold">{totalCount} {totalCount === 1 ? 'máquina' : 'máquinas'}</span> en tu lista de cotización
              </p>
              <p className="text-xs text-gray-400">
                Puedes seguir agregando más equipos o enviar tu pedido formal directamente a WhatsApp.
              </p>
            </div>
          </div>
          <button
            onClick={openCart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider text-black bg-[#00FF66] hover:bg-[#10B981] shadow-lg shadow-[#00FF66]/25 hover:shadow-[#00FF66]/40 transition-all transform hover:-translate-y-0.5"
          >
            <span>Ver Lista & Cotizar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Machines Grid */}
      {filteredMachines.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredMachines.map((machine) => {
            const cardWhatsappUrl = getMachineQuoteWhatsAppUrl(machine.name, machine.muscleGroup);
            const inCart = isInCart(machine.id);
            const qty = getItemQuantity(machine.id);

            return (
              <div
                key={machine.id}
                className="group flex flex-col bg-[#11141D] rounded-2xl overflow-hidden border border-[#202736] hover:border-[#00FF66]/50 shadow-lg hover:shadow-2xl hover:shadow-[#00FF66]/10 transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image Container with Badges */}
                <div 
                  onClick={() => setSelectedMachine(machine)}
                  className="relative h-64 w-full bg-[#090B10] overflow-hidden cursor-pointer flex items-center justify-center p-4 border-b border-[#1A202D]"
                >
                  <Image
                    src={machine.imageUrl}
                    alt={machine.name}
                    fill
                    className="object-contain p-2 group-hover:scale-110 transition-transform duration-500 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00FF66] text-black shadow-md shadow-[#00FF66]/20">
                      {machine.muscleGroup}
                    </span>
                  </div>
                  {/* Featured Badge */}
                  {machine.featured && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/70 text-[#00FF66] border border-[#00FF66]/40 backdrop-blur-sm">
                        <Sparkles className="w-3 h-3" />
                        Destacada
                      </span>
                    </div>
                  )}
                  {/* In-cart mini indicator badge */}
                  {inCart && (
                    <div className="absolute bottom-3 left-3 z-10">
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#00FF66] text-black shadow-md">
                        <Check className="w-3 h-3" /> En lista ({qty})
                      </span>
                    </div>
                  )}
                  {/* Hover Overlay Hint */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-white bg-black/80 px-3 py-1.5 rounded-full border border-gray-700">
                      <Eye className="w-3.5 h-3.5 text-[#00FF66]" /> Ver Detalles
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 
                      onClick={() => setSelectedMachine(machine)}
                      className="text-lg font-bold text-white group-hover:text-[#00FF66] transition-colors line-clamp-1 cursor-pointer mb-2"
                      title={machine.name}
                    >
                      {machine.name}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                      {machine.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-[#1C2230] space-y-2">
                    {/* Add to Cart Button */}
                    <button
                      onClick={() => addToCart(machine)}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-300 ${
                        inCart
                          ? 'bg-[#00FF66]/15 text-[#00FF66] border border-[#00FF66]/60 hover:bg-[#00FF66]/25 shadow-[0_0_15px_rgba(0,255,102,0.15)]'
                          : 'bg-[#18202E] text-white hover:bg-[#202B3D] border border-[#2B3547] hover:border-gray-500'
                      }`}
                    >
                      {inCart ? (
                        <>
                          <Check className="w-4 h-4 text-[#00FF66]" />
                          <span>En Cotización ({qty}) • Agregar +1</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4 text-[#00FF66]" />
                          <span>Agregar a Cotización</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedMachine(machine)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-gray-300 bg-[#141822] hover:bg-[#1A212E] hover:text-white border border-gray-800 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#00FF66]" />
                        <span>Ficha Técnica</span>
                      </button>
                      <a
                        href={cardWhatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-gray-200 hover:text-white bg-[#141822] hover:bg-[#1F2736] border border-gray-800 hover:border-[#00FF66]/40 transition-all"
                        title="Cotizar directamente esta máquina sola"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-[#00FF66] fill-current" />
                        <span>Cotizar Sola</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#10131B] rounded-2xl border border-gray-800 px-4">
          <Dumbbell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">No se encontraron máquinas</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
            No encontramos equipos con los criterios especificados. Intenta buscar otro término o restablece los filtros.
          </p>
          <button
            onClick={() => {
              setSelectedGroup('Todos');
              setSearchTerm('');
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-[#00FF66] hover:bg-[#10B981] shadow-md"
          >
            Ver Todas las Máquinas
          </button>
        </div>
      )}

      {/* Machine Details Modal */}
      <MachineModal
        machine={selectedMachine}
        onClose={() => setSelectedMachine(null)}
      />
    </section>
  );
}
