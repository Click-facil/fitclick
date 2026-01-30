
import { GoogleGenAI } from "@google/genai";
import { Workout, Exercise } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeWorkouts = async (workouts: Workout[], exercises: Exercise[]) => {
  if (workouts.length === 0) return "Comece a treinar para receber dicas da IA!";

  const summary = workouts.map(w => {
    const exCount = w.exercises.length;
    const totalVolume = w.exercises.reduce((acc, ex) => 
      acc + ex.sets.reduce((sAcc, s) => sAcc + (s.weight * s.reps), 0)
    , 0);
    return `Data: ${w.date}, Exercícios: ${exCount}, Volume: ${totalVolume}kg`;
  }).join("\n");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analise o histórico de treinos abaixo e dê uma dica curta e motivadora de 2 frases em Português para o usuário melhorar seu desempenho ou comemorar seu progresso.\n\nHistórico:\n${summary}`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Continue focado! A consistência é a chave para o progresso.";
  }
};
