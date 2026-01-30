
export interface SetLog {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
}

export interface ExerciseSession {
  id: string;
  exerciseId: string;
  sets: SetLog[];
}

export interface Workout {
  id: string;
  date: string; // ISO string
  exercises: ExerciseSession[];
  notes?: string;
}

export type ViewType = 'dashboard' | 'workout' | 'history' | 'library';
