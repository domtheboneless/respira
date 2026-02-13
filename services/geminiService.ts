
import { GoogleGenAI } from "@google/genai";
import { Language } from '../types';

export async function getMotivationalPhrase(
  language: Language, 
  dream: string,
  timeFree: string
): Promise<string> {
  // Safely retrieve API key to avoid ReferenceError if process is undefined
  let apiKey = '';
  try {
    apiKey = (process as any).env?.API_KEY || '';
  } catch (e) {
    console.warn("Process env not available");
  }

  // Always create a fresh instance
  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = language === 'en' 
    ? `You are a supportive and clever motivational coach. 
       The user is experiencing a smoking craving. Your goal is to help them delay it for 10 minutes.
       Refer to their dream: "${dream}" and the fact they've been smoke-free for ${timeFree}.
       Keep it catchy and under 2 sentences.`
    : `Sei un coach motivazionale incoraggiante e intelligente.
       L'utente sta avendo voglia di fumare. Il tuo obiettivo è aiutarlo a rimandare di 10 minuti.
       Fai riferimento al suo sogno: "${dream}" e al fatto che non fuma da ${timeFree}.
       Rendi la frase accattivante e non superare le 2 frasi.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-latest',
      contents: [{
        parts: [{
          text: language === 'en' 
            ? "Give me a single catchy, motivational reason to not smoke right now." 
            : "Dammi un unico motivo motivazionale e accattivante per non fumare proprio ora."
        }]
      }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response");
    return text;
  } catch (error) {
    console.error("AI Service Error:", error);
    
    // Provide a high-quality fallback message if the API fails
    if (language === 'en') {
      return `Take a deep breath. Remember "${dream}"? Every cigarette you skip is a brick in that foundation. You've already conquered ${timeFree}, don't stop now!`;
    } else {
      return `Fai un respiro profondo. Ricordi "${dream}"? Ogni sigaretta che eviti è un mattone per quel sogno. Hai già superato ${timeFree}, non fermarti proprio ora!`;
    }
  }
}
