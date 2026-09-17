export type MuscleGroup =
  | 'Todos'
  | 'Pecho'
  | 'Espalda'
  | 'Piernas'
  | 'Hombros'
  | 'Brazos'
  | 'Glúteos'
  | 'Pantorrillas'
  | 'Funcional'
  | 'Accesorios'
  | 'Mancuernas'
  | 'Barras'
  | 'Discos';

export interface Machine {
  id: string;
  name: string;
  muscleGroup: string;
  description: string;
  specs?: string[];
  imageUrl: string;
  featured?: boolean;
  price?: string;
  createdAt: string;
}

export interface CartItem {
  machine: Machine;
  quantity: number;
}

export const MUSCLE_GROUPS: { id: string; name: string; icon: string; description: string }[] = [
  { id: 'Todos', name: 'Todos los Equipos', icon: 'Dumbbell', description: 'Catálogo integral de equipamiento profesional' },
  { id: 'Pecho', name: 'Pecho / Pectorales', icon: 'Shield', description: 'Presses convergentes, declinados e inclinados' },
  { id: 'Espalda', name: 'Espalda / Dorsales', icon: 'Flame', description: 'Remos en T, jalones de alta tracción y poleas' },
  { id: 'Piernas', name: 'Piernas / Tren Inferior', icon: 'Zap', description: 'Prensas de 45°, hack squats, camillas femorales' },
  { id: 'Hombros', name: 'Hombros / Deltoides', icon: 'Crosshair', description: 'Press militar, elevaciones y abducciones' },
  { id: 'Brazos', name: 'Brazos (Bíceps/Tríceps)', icon: 'Activity', description: 'Bancos predicador, poleas y brazos mecánicos' },
  { id: 'Glúteos', name: 'Glúteos', icon: 'Flame', description: 'Hip thrust, patada de glúteo y abducción de cadera' },
  { id: 'Pantorrillas', name: 'Pantorrillas', icon: 'Footprints', description: 'Elevación de talones sentado y de pie' },
  { id: 'Funcional', name: 'Funcional & Racks', icon: 'Box', description: 'Jaulas de potencia, bancos libres y accesorios' },
  { id: 'Accesorios', name: 'Accesorios', icon: 'Package', description: 'Bancos, sogas, agarres y complementos de entrenamiento' },
  { id: 'Mancuernas', name: 'Mancuernas', icon: 'Dumbbell', description: 'Sets de mancuernas fijas y ajustables' },
  { id: 'Barras', name: 'Barras', icon: 'Layers', description: 'Barras olímpicas, rectas y curvas' },
  { id: 'Discos', name: 'Discos', icon: 'Disc', description: 'Discos olímpicos de fundición y bumper' }
];
