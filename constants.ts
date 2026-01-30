
import { Exercise } from './types';

export const INITIAL_EXERCISES: Exercise[] = [
  // PEITO
  { id: 'p1', name: 'Supino Reto (Barra/Halter)', category: 'Peito' },
  { id: 'p2', name: 'Supino Reto na Máquina (Vertical)', category: 'Peito' },
  { id: 'p3', name: 'Supino Inclinado (Barra/Halter)', category: 'Peito' },
  { id: 'p4', name: 'Supino Inclinado na Máquina', category: 'Peito' },
  { id: 'p5', name: 'Crucifixo (Halter/Pec Dec)', category: 'Peito' },
  
  // COSTAS
  { id: 'c1', name: 'Puxada na Máquina (Pulley)', category: 'Costas' },
  { id: 'c2', name: 'Remada na Máquina (Apoio Peito)', category: 'Costas' },
  { id: 'c3', name: 'Pullover (Halter/Cabo)', category: 'Costas' },
  { id: 'c4', name: 'Remada Unilateral (Halter)', category: 'Costas' },
  
  // PERNAS
  { id: 'l1', name: 'Agachamento Livre', category: 'Pernas' },
  { id: 'l2', name: 'Agachamento no Smith', category: 'Pernas' },
  { id: 'l3', name: 'Agachamento na Máquina (Hack)', category: 'Pernas' },
  { id: 'l4', name: 'Afundo/Avanço (Halteres)', category: 'Pernas' },
  { id: 'l5', name: 'Levantamento Terra Romeno (Stiff)', category: 'Pernas' },
  { id: 'l6', name: 'Cadeira Extensora', category: 'Pernas' },
  { id: 'l7', name: 'Cadeira/Mesa Flexora', category: 'Pernas' },
  { id: 'l8', name: 'Abdução (Máquina/Cabo)', category: 'Pernas' },
  { id: 'l9', name: 'Elevação Plantar (Gêmeos)', category: 'Pernas' },
  { id: 'l10', name: 'Leg Press 45', category: 'Pernas' },

  // OMBROS
  { id: 'o1', name: 'Desenvolvimento (Halteres/Barra)', category: 'Ombros' },
  { id: 'o2', name: 'Desenvolvimento na Máquina', category: 'Ombros' },
  { id: 'o3', name: 'Elevação Lateral', category: 'Ombros' },

  // BRAÇOS
  { id: 'b1', name: 'Rosca Direta (Barra W/Halter)', category: 'Braços' },
  { id: 'b2', name: 'Rosca Martelo', category: 'Braços' },
  { id: 'b3', name: 'Tríceps na Polia (Corda/Barra)', category: 'Braços' },
  { id: 'b4', name: 'Tríceps Testa', category: 'Braços' },
];

export const CATEGORIES = ['Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Core', 'Cardio'];

export const WORKOUT_TEMPLATES = [
  {
    name: 'Push (Peito/Ombro/Tríceps)',
    color: 'bg-orange-500',
    exercises: ['p3', 'p1', 'o1', 'o3', 'p5', 'b3', 'b4']
  },
  {
    name: 'Pull (Costas/Bíceps)',
    color: 'bg-emerald-500',
    exercises: ['c1', 'c2', 'c3', 'c4', 'b1', 'b2']
  },
  {
    name: 'Legs (Pernas/Corrida)',
    color: 'bg-purple-500',
    exercises: ['l1', 'l4', 'l5', 'l6', 'l8', 'l7', 'l9']
  }
];
