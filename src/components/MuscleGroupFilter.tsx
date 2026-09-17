'use client';

import React from 'react';
import { MUSCLE_GROUPS } from '@/lib/types';
import { Dumbbell, Shield, Flame, Zap, Crosshair, Activity, Box } from 'lucide-react';

interface MuscleGroupFilterProps {
  selectedGroup: string;
  onSelectGroup: (group: string) => void;
  counts: Record<string, number>;
}

export default function MuscleGroupFilter({
  selectedGroup,
  onSelectGroup,
  counts,
}: MuscleGroupFilterProps) {
  const getIcon = (id: string) => {
    switch (id) {
      case 'Pecho':
        return <Shield className="w-4 h-4" />;
      case 'Espalda':
        return <Flame className="w-4 h-4" />;
      case 'Piernas':
        return <Zap className="w-4 h-4" />;
      case 'Hombros':
        return <Crosshair className="w-4 h-4" />;
      case 'Brazos':
        return <Activity className="w-4 h-4" />;
      case 'Funcional':
        return <Box className="w-4 h-4" />;
      default:
        return <Dumbbell className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full">
      {/* Scrollable on small screens, flex-wrap on desktop */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar">
        {MUSCLE_GROUPS.map((group) => {
          const isSelected = selectedGroup === group.id;
          const count = counts[group.id] || 0;

          return (
            <button
              key={group.id}
              onClick={() => onSelectGroup(group.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex-shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-[#00FF66] text-black font-bold shadow-lg shadow-[#00FF66]/30 scale-105'
                  : 'bg-[#12151D] text-gray-300 hover:text-white hover:bg-[#1C2230] border border-gray-800/80 hover:border-gray-700'
              }`}
            >
              <span className={isSelected ? 'text-black' : 'text-[#00FF66]'}>
                {getIcon(group.id)}
              </span>
              <span>{group.name}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-mono font-semibold ${
                  isSelected
                    ? 'bg-black/20 text-black'
                    : 'bg-[#1D2330] text-gray-400 border border-gray-700/60'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
