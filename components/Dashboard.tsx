
import React, { useState, useEffect } from 'react';
import { Workout, Exercise } from '../types';
import { WORKOUT_TEMPLATES } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { analyzeWorkouts } from '../services/geminiService';

interface DashboardProps {
  workouts: Workout[];
  exercises: Exercise[];
  onStartWorkout: (exerciseIds?: string[]) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ workouts, exercises, onStartWorkout }) => {
  const [aiTip, setAiTip] = useState<string>("Analisando seu progresso...");

  useEffect(() => {
    const fetchTip = async () => {
      const tip = await analyzeWorkouts(workouts, exercises);
      setAiTip(tip);
    };
    fetchTip();
  }, [workouts, exercises]);

  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const workout = workouts.find(w => w.date.split('T')[0] === dateStr);
    
    const volume = workout ? workout.exercises.reduce((acc, ex) => 
      acc + ex.sets.reduce((sAcc, s) => sAcc + (s.weight * s.reps), 0)
    , 0) : 0;

    return {
      name: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
      volume: volume
    };
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-5 rounded-2xl text-white shadow-lg">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
          Coach FitClick
        </h2>
        <p className="text-sm opacity-90 leading-relaxed italic">"{aiTip}"</p>
      </div>

      <div>
        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">Atalhos de Treino</h3>
        <div className="grid grid-cols-1 gap-3">
          {WORKOUT_TEMPLATES.map(template => (
            <button 
              key={template.name}
              onClick={() => onStartWorkout(template.exercises)}
              className={`${template.color} text-white p-4 rounded-2xl font-bold flex justify-between items-center shadow-lg active:scale-[0.98] transition-all`}
            >
              <span>{template.name}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-slate-800 font-bold mb-4">Volume Semanal (kg)</h2>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="volume" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <button 
        onClick={() => onStartWorkout()}
        className="w-full bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        TREINO PERSONALIZADO
      </button>
    </div>
  );
};

export default Dashboard;
