import React, { useState } from 'react';
import { Workout, Exercise } from '../types';

interface HistoryProps {
  workouts: Workout[];
  exercises: Exercise[];
  onDelete: (id: string) => void;
}

const History: React.FC<HistoryProps> = ({ workouts, exercises, onDelete }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getExerciseName = (id: string) => exercises.find(e => e.id === id)?.name || 'Desconhecido';

  const sortedWorkouts = [...workouts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const confirmDelete = (id: string) => {
    // Feedback tátil visual: se já estiver em modo de "confirmação", deleta.
    // Isso evita o uso de window.confirm que pode ser bloqueado em webviews mobile.
    if (deletingId === id) {
      onDelete(id);
      setDeletingId(null);
    } else {
      setDeletingId(id);
      // Cancela o modo de confirmação após 3 segundos se não tocar de novo
      setTimeout(() => setDeletingId(null), 3000);
    }
  };

  if (workouts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 px-6">
        <div className="p-8 bg-slate-100 rounded-full text-slate-300">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
        </div>
        <h3 className="text-lg font-bold text-slate-400">Sem histórico ainda</h3>
        <p className="text-slate-400 text-sm">Seus treinos finalizados aparecerão aqui para você acompanhar sua evolução.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Histórico</h2>
        <span className="text-[10px] font-black bg-slate-200 text-slate-500 px-3 py-1 rounded-full uppercase">{workouts.length} Treinos</span>
      </div>

      {sortedWorkouts.map((workout) => (
        <div key={workout.id} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden transition-all active:scale-[0.99]">
          <div className="p-6 flex justify-between items-center bg-slate-50/50">
            <div>
              <p className="font-black text-slate-800 text-xl leading-none">
                {new Date(workout.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')}
              </p>
              <p className="text-[10px] text-blue-600 uppercase font-black tracking-widest mt-1.5 opacity-80">
                {new Date(workout.date).toLocaleDateString('pt-BR', { weekday: 'long' })}
              </p>
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                confirmDelete(workout.id);
              }}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-black text-[10px] uppercase transition-all duration-300 ${
                deletingId === workout.id 
                  ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-200 scale-105' 
                  : 'bg-red-50 text-red-500'
              }`}
            >
              {deletingId === workout.id ? 'Tocar p/ Apagar' : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>

          <div className="p-6 pt-2 space-y-5">
            {workout.exercises.map((ex) => (
              <div key={ex.id} className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-1 before:bg-blue-100 before:rounded-full">
                <p className="text-[13px] font-black text-slate-700 mb-2.5 flex justify-between">
                  <span>{getExerciseName(ex.exerciseId)}</span>
                  <span className="text-[10px] text-slate-400">{ex.sets.length} séries</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {ex.sets.map((set, i) => (
                    <div key={set.id} className="text-[10px] font-black bg-slate-50 text-slate-600 border border-slate-100 px-3 py-2 rounded-xl flex items-center gap-1.5">
                      <span className="text-slate-300">{i+1}º</span>
                      <span>{set.weight}kg</span>
                      <span className="text-slate-300">×</span>
                      <span>{set.reps}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default History;