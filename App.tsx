
import React, { useState, useEffect } from 'react';
import { ViewType, Workout, Exercise, ExerciseSession } from './types';
import { storageService, generateId } from './services/storageService';
import Dashboard from './components/Dashboard';
import WorkoutSession from './components/WorkoutSession';
import History from './components/History';
import ExerciseLibrary from './components/ExerciseLibrary';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('dashboard');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    const w = storageService.getWorkouts();
    const e = storageService.getExercises();
    setWorkouts([...w]);
    setExercises([...e]);
  };

  const startNewWorkout = (templateExerciseIds?: string[]) => {
    const prefilledExercises: ExerciseSession[] = templateExerciseIds ? templateExerciseIds.map(id => ({
      id: generateId(),
      exerciseId: id,
      sets: [{ id: generateId(), weight: 0, reps: 0, completed: false }]
    })) : [];

    const newWorkout: Workout = {
      id: generateId(),
      date: new Date().toISOString(),
      exercises: prefilledExercises
    };
    setActiveWorkout(newWorkout);
    setView('workout');
  };

  const saveWorkout = (workout: Workout) => {
    storageService.saveWorkout(workout);
    setActiveWorkout(null);
    refreshData();
    setView('dashboard');
  };

  const deleteWorkout = (id: string) => {
    storageService.deleteWorkout(id);
    refreshData();
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 max-w-md mx-auto relative border-x border-slate-200 shadow-xl">
      <header className="bg-blue-600 text-white p-4 sticky top-0 z-20 shadow-md">
        <h1 className="text-xl font-bold tracking-tight text-center">FitClick AI</h1>
      </header>

      <main className="flex-1 pb-24 p-4 overflow-y-auto no-scrollbar">
        {view === 'dashboard' && (
          <Dashboard 
            workouts={workouts} 
            exercises={exercises} 
            onStartWorkout={startNewWorkout} 
          />
        )}
        {view === 'workout' && activeWorkout && (
          <WorkoutSession 
            workout={activeWorkout} 
            exercises={exercises}
            onSave={saveWorkout}
            onCancel={() => setView('dashboard')}
          />
        )}
        {view === 'history' && (
          <History 
            workouts={workouts} 
            exercises={exercises} 
            onDelete={deleteWorkout}
          />
        )}
        {view === 'library' && (
          <ExerciseLibrary 
            exercises={exercises} 
            onAdd={(ex) => { storageService.saveExercise(ex); refreshData(); }}
            onDelete={(id) => { storageService.deleteExercise(id); refreshData(); }}
          />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 flex justify-around p-3 z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setView('dashboard')}
          className={`flex flex-col items-center gap-1 ${view === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="text-[10px] font-medium uppercase">Dashboard</span>
        </button>
        <button 
          onClick={() => setView('workout')}
          className={`flex flex-col items-center gap-1 ${view === 'workout' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-[10px] font-medium uppercase">Treinar</span>
        </button>
        <button 
          onClick={() => setView('history')}
          className={`flex flex-col items-center gap-1 ${view === 'history' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-[10px] font-medium uppercase">Histórico</span>
        </button>
        <button 
          onClick={() => setView('library')}
          className={`flex flex-col items-center gap-1 ${view === 'library' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
          <span className="text-[10px] font-medium uppercase">Lista</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
