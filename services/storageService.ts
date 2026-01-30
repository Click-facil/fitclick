
import { Workout, Exercise, SetLog } from '../types';
import { INITIAL_EXERCISES } from '../constants';

const WORKOUTS_KEY = 'fittrack_workouts';
const EXERCISES_KEY = 'fittrack_exercises';

// Fallback para ambientes sem crypto.randomUUID (comum em mobile/HTTP)
export const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const storageService = {
  getWorkouts: (): Workout[] => {
    try {
      const data = localStorage.getItem(WORKOUTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Erro ao ler treinos:", e);
      return [];
    }
  },
  
  saveWorkout: (workout: Workout) => {
    const workouts = storageService.getWorkouts();
    const index = workouts.findIndex(w => w.id === workout.id);
    if (index >= 0) {
      workouts[index] = workout;
    } else {
      workouts.push(workout);
    }
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
  },

  deleteWorkout: (id: string) => {
    const workouts = storageService.getWorkouts();
    const filtered = workouts.filter(w => w.id !== id);
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(filtered));
    return true;
  },

  getExercises: (): Exercise[] => {
    const data = localStorage.getItem(EXERCISES_KEY);
    return data ? JSON.parse(data) : INITIAL_EXERCISES;
  },

  saveExercise: (exercise: Exercise) => {
    const exercises = storageService.getExercises();
    exercises.push(exercise);
    localStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
  },

  deleteExercise: (id: string) => {
    const exercises = storageService.getExercises();
    const filtered = exercises.filter(e => e.id !== id);
    localStorage.setItem(EXERCISES_KEY, JSON.stringify(filtered));
  },

  getLastPerformance: (exerciseId: string): SetLog[] | null => {
    const workouts = storageService.getWorkouts();
    const sorted = [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    for (const workout of sorted) {
      const session = workout.exercises.find(ex => ex.exerciseId === exerciseId);
      if (session && session.sets.length > 0) {
        return session.sets;
      }
    }
    return null;
  }
};
