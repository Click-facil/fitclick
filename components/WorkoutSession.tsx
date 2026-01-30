
import React, { useState, useEffect, useRef } from 'react';
import { Workout, Exercise, ExerciseSession, SetLog } from '../types';
import { storageService, generateId } from '../services/storageService';

interface WorkoutSessionProps {
  workout: Workout;
  exercises: Exercise[];
  onSave: (workout: Workout) => void;
  onCancel: () => void;
}

const WorkoutSession: React.FC<WorkoutSessionProps> = ({ workout, exercises, onSave, onCancel }) => {
  const [currentWorkout, setCurrentWorkout] = useState<Workout>({ ...workout });
  const [showExPicker, setShowExPicker] = useState(false);
  const [replacingSessionId, setReplacingSessionId] = useState<string | null>(null);
  
  // Estados do Timer
  const [timer, setTimer] = useState<number | null>(null);
  const [defaultDuration, setDefaultDuration] = useState(60);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer !== null && timer > 0) {
      timerRef.current = setTimeout(() => setTimer(timer - 1), 1000);
    } else if (timer === 0) {
      if (navigator.vibrate) navigator.vibrate([300, 100, 300]);
      setTimer(null);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [timer]);

  const toggleTimer = () => {
    if (timer === null) {
      setTimer(defaultDuration);
    } else {
      setTimer(null);
    }
  };

  const handleExerciseSelect = (exerciseId: string) => {
    if (replacingSessionId) {
      setCurrentWorkout(prev => ({
        ...prev,
        exercises: prev.exercises.map(ex => 
          ex.id === replacingSessionId ? { ...ex, exerciseId: exerciseId } : ex
        )
      }));
      setReplacingSessionId(null);
    } else {
      const lastSets = storageService.getLastPerformance(exerciseId);
      const newSession: ExerciseSession = {
        id: generateId(),
        exerciseId: exerciseId,
        sets: lastSets ? lastSets.map(s => ({ ...s, id: generateId(), completed: false })) : 
              [{ id: generateId(), weight: 0, reps: 0, completed: false }]
      };
      setCurrentWorkout(prev => ({
        ...prev,
        exercises: [...prev.exercises, newSession]
      }));
    }
    setShowExPicker(false);
  };

  const removeExercise = (sessionId: string) => {
    setCurrentWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== sessionId)
    }));
  };

  const addSet = (sessionId: string) => {
    setCurrentWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => {
        if (ex.id === sessionId) {
          const lastSet = ex.sets[ex.sets.length - 1];
          return {
            ...ex,
            sets: [...ex.sets, { 
              id: generateId(), 
              weight: lastSet?.weight || 0, 
              reps: lastSet?.reps || 0, 
              completed: false 
            }]
          };
        }
        return ex;
      })
    }));
  };

  const updateSet = (sessionId: string, setId: string, updates: Partial<SetLog>) => {
    setCurrentWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => {
        if (ex.id === sessionId) {
          return { ...ex, sets: ex.sets.map(s => s.id === setId ? { ...s, ...updates } : s) };
        }
        return ex;
      })
    }));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getExerciseName = (id: string) => exercises.find(e => e.id === id)?.name || 'Desconhecido';

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-36">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Treino em Foco</h2>
        <button onClick={onCancel} className="text-slate-400 font-medium text-sm">Sair</button>
      </div>

      <div className="bg-slate-900 text-white rounded-3xl p-4 shadow-xl border border-slate-800 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Tempo de Descanso</span>
          <div className="flex gap-2 mt-2">
            {[30, 45, 60, 90, 120].map(val => (
              <button 
                key={val}
                onClick={() => setDefaultDuration(val)}
                className={`text-[10px] px-3 py-1.5 rounded-xl font-black transition-all ${defaultDuration === val ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-500'}`}
              >
                {val === 120 ? '2m' : `${val}s`}
              </button>
            ))}
          </div>
        </div>
        
        {timer !== null && (
          <div className="bg-blue-600 px-5 py-2.5 rounded-2xl flex flex-col items-center min-w-[90px] animate-pulse">
            <span className="text-[9px] font-black opacity-80 uppercase">Descanso</span>
            <span className="text-2xl font-black tabular-nums leading-none tracking-tight">{formatTime(timer)}</span>
          </div>
        )}
      </div>

      <div className="space-y-5">
        {currentWorkout.exercises.map((exSession) => {
          const lastPerformance = storageService.getLastPerformance(exSession.exerciseId);
          return (
            <div key={exSession.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-slate-50/50 p-5 border-b border-slate-100">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-slate-800 text-lg leading-tight">{getExerciseName(exSession.exerciseId)}</h3>
                      <button 
                        onClick={() => { setReplacingSessionId(exSession.id); setShowExPicker(true); }}
                        className="text-[10px] font-bold text-blue-500 bg-blue-100 px-2 py-0.5 rounded-lg border border-blue-200 uppercase tracking-tighter active:scale-95"
                      >
                        Alterar
                      </button>
                    </div>
                    {lastPerformance && (
                      <p className="text-[10px] text-slate-500 font-medium italic mt-1">
                        Anterior: {lastPerformance.map(s => `${s.weight}kg x ${s.reps}`).join(' | ')}
                      </p>
                    )}
                  </div>
                  <button onClick={() => removeExercise(exSession.id)} className="text-slate-300 ml-2 p-2 active:text-red-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-5">
                {exSession.sets.map((set, idx) => (
                  <div key={set.id} className="flex items-end gap-3">
                    <div className="flex flex-col items-center pb-3 min-w-[30px]">
                      <span className="text-[10px] font-black text-slate-300 leading-none">{idx + 1}ª</span>
                      <span className="text-[8px] font-bold text-slate-300 uppercase mt-1">Série</span>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Carga (kg)</label>
                        <div className="bg-slate-50 rounded-2xl p-1 flex items-center justify-between border border-slate-100">
                          <button onClick={() => updateSet(exSession.id, set.id, { weight: Math.max(0, set.weight - 2) })} className="w-8 h-8 flex items-center justify-center text-slate-400 font-bold active:bg-slate-200 rounded-lg">-</button>
                          <input type="number" value={set.weight} onChange={(e) => updateSet(exSession.id, set.id, { weight: Number(e.target.value) })} className="w-10 text-center font-black text-slate-700 bg-transparent outline-none text-sm" />
                          <button onClick={() => updateSet(exSession.id, set.id, { weight: set.weight + 2 })} className="w-8 h-8 flex items-center justify-center text-slate-400 font-bold active:bg-slate-200 rounded-lg">+</button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Reps</label>
                        <div className="bg-slate-50 rounded-2xl p-1 flex items-center justify-between border border-slate-100">
                          <button onClick={() => updateSet(exSession.id, set.id, { reps: Math.max(0, set.reps - 1) })} className="w-8 h-8 flex items-center justify-center text-slate-400 font-bold active:bg-slate-200 rounded-lg">-</button>
                          <input type="number" value={set.reps} onChange={(e) => updateSet(exSession.id, set.id, { reps: Number(e.target.value) })} className="w-10 text-center font-black text-slate-700 bg-transparent outline-none text-sm" />
                          <button onClick={() => updateSet(exSession.id, set.id, { reps: set.reps + 1 })} className="w-8 h-8 flex items-center justify-center text-slate-400 font-bold active:bg-slate-200 rounded-lg">+</button>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => updateSet(exSession.id, set.id, { completed: !set.completed })}
                      className={`w-12 h-10 rounded-2xl flex items-center justify-center transition-all ${set.completed ? 'bg-green-500 text-white shadow-lg' : 'bg-white border-2 border-slate-100 text-slate-200'}`}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                    </button>
                  </div>
                ))}
                
                <div className="flex gap-2 pt-2">
                  <button onClick={() => addSet(exSession.id)} className="flex-1 py-3 bg-slate-50 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest active:bg-slate-100">
                    + Série
                  </button>
                  <button 
                    onClick={toggleTimer}
                    className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 ${timer !== null ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}
                  >
                    {timer !== null ? `Parar ${formatTime(timer)}` : 'Descanso'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-slate-50/90 backdrop-blur-md z-40 border-t border-slate-200">
        <div className="flex gap-3">
          <button onClick={() => { setReplacingSessionId(null); setShowExPicker(true); }} className="flex-1 bg-white border-2 border-blue-600 text-blue-600 py-4 rounded-3xl font-black shadow-lg active:scale-95 transition-transform">ADICIONAR</button>
          <button onClick={() => onSave(currentWorkout)} className="flex-[2] bg-blue-600 text-white py-4 rounded-3xl font-black text-lg shadow-xl shadow-blue-200 active:scale-95 transition-transform">CONCLUIR TREINO</button>
        </div>
      </div>

      {showExPicker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-t-[40px] p-8 space-y-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">
                {replacingSessionId ? 'Substituir Exercício' : 'Adicionar Exercício'}
              </h3>
              <button onClick={() => { setShowExPicker(false); setReplacingSessionId(null); }} className="p-3 bg-slate-100 rounded-full text-slate-500 active:scale-90">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto space-y-3 no-scrollbar pb-10">
              {exercises.map(ex => (
                <button key={ex.id} onClick={() => handleExerciseSelect(ex.id)} className="w-full text-left p-5 rounded-3xl bg-slate-50 border border-transparent flex justify-between items-center active:bg-blue-50 transition-all">
                  <div><p className="font-bold text-slate-800">{ex.name}</p><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{ex.category}</p></div>
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutSession;
