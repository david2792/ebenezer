export type MuscleGroup = 
  | 'Todos'
  | 'Pecho'
  | 'Espalda'
  | 'Piernas'
  | 'Hombros'
  | 'Brazos'
  | 'Funcional';

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
  { id: 'Funcional', name: 'Funcional & Racks', icon: 'Box', description: 'Jaulas de potencia, bancos libres y accesorios' }
];
