import React, { useState } from 'react';
import { Exercise } from '../types';
import { CATEGORIES } from '../constants';
import { generateId } from '../services/storageService';

interface ExerciseLibraryProps {
  exercises: Exercise[];
  onAdd: (ex: Exercise) => void;
  onDelete: (id: string) => void;
}

const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({ exercises, onAdd, onDelete }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    // Usando o gerador de ID seguro do storageService
    onAdd({ 
      id: generateId(), 
      name: name.trim(), 
      category 
    });
    
    setName('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Meus Exercícios</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`text-xs px-5 py-2.5 rounded-2xl font-black shadow-lg transition-all active:scale-95 ${
            isAdding ? 'bg-slate-200 text-slate-600' : 'bg-blue-600 text-white shadow-blue-200'
          }`}
        >
          {isAdding ? 'CANCELAR' : '+ NOVO'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-blue-100 space-y-5 animate-in slide-in-from-top duration-300">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Nome do Exercício</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Supino Inclinado"
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 font-bold text-slate-700"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Categoria</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 font-bold text-slate-700 appearance-none"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-200 active:scale-[0.98] transition-all uppercase tracking-widest"
          >
            Salvar Exercício
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-3">
        {exercises.map((ex) => (
          <div key={ex.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center active:bg-slate-50 transition-colors">
            <div>
              <p className="font-black text-slate-800 leading-tight">{ex.name}</p>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">{ex.category}</p>
            </div>
            <button 
              onClick={() => { if(confirm('Excluir este exercício da sua lista?')) onDelete(ex.id) }}
              className="text-slate-200 hover:text-red-500 p-2 transition-colors active:text-red-500"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseLibrary;