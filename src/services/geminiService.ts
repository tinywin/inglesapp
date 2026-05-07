import { GoogleGenAI } from "@google/genai";
import { Message, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

const SYSTEM_INSTRUCTION = `Você é o "Guia Elo", um assistente de ensino de inglês especializado em ajudar pessoas que buscam um aprendizado simples, acolhedor e motivador.
Seu tom é extremamente paciente, encorajador, caloroso e respeitoso.
Sempre responda em Português quando estiver explicando gramática ou tirando dúvidas, mas use frases simples em Inglês para exemplos.
Mantenha suas respostas CURTAS e OBJETIVAS. Evite parágrafos longos.
Relacione o aprendizado com a vida e os interesses do aluno (ex: se gosta de Cultura Asiática, cite animes ou costumes; se gosta de Jogos Online, use termos desse universo).
Adapte sua linguagem à IDADE do aluno:
- Para idosos: Use referências clássicas e tom mais tradicional.
- Para jovens: Seja dinâmico, cite cultura pop, jogos online e desenhos.
Ofereça feedback positivo constante e breve.
Evite termos técnicos complexos. Explique conceitos de forma simples e rápida.`;

export async function chatWithGuide(messages: Message[], profile: UserProfile) {
  const model = "gemini-3-flash-preview";
  
  const formattedMessages = messages.map(m => ({
    role: m.role,
    parts: [{ text: m.content }]
  }));

  const response = await ai.models.generateContent({
    model,
    contents: formattedMessages,
    config: {
      systemInstruction: `${SYSTEM_INSTRUCTION}\n\nO aluno se chama ${profile.name}, tem interesses em: ${profile.interests.join(", ")} e sua experiência de vida é: ${profile.lifeExperience}.\nLembre-se: Seja breve nas respostas.`
    }
  });

  return response.text || "Desculpe, tive um probleminha. Pode repetir?";
}

function extractJSON(text: string) {
  try {
    // Attempt direct parse first
    return JSON.parse(text);
  } catch (e) {
    // If it fails, try to find the first '{' and last '}'
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(text.substring(start, end + 1));
      } catch (innerError) {
        throw new Error("Could not parse JSON from AI response");
      }
    }
    throw e;
  }
}

export async function generateCustomLesson(profile: UserProfile, scenario?: string) {
  const model = "gemini-3-flash-preview";
  const prompt = scenario 
    ? `Crie uma lição curta de inglês para ${profile.name} (idade: ${profile.age}) baseada nesta situação: "${scenario}".`
    : `Crie uma lição curta de inglês para ${profile.name} (idade: ${profile.age}) baseada nos interesses dele: ${profile.interests.join(", ")}.`;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      systemInstruction: `Crie uma lição curta e lúdica estruturada em JSON com o seguinte formato:
      {
        "title": "Título Curto",
        "intro": "Uma introdução breve e motivadora em Português (máximo 2 frases)",
        "story": "Uma frase ou diálogo curto em Inglês",
        "translation": "Tradução para Português",
        "vocabulary": [
          {"word": "Palavra/Frase", "meaning": "Tradução"}
        ],
        "encouragement": "Uma frase curta de encorajamento",
        "funFact": "Uma curiosidade interessante relacionada ao tema ou cultura inglesa em Português",
        "quiz": {
          "question": "Pergunta simples sobre a lição em Português",
          "options": ["Opção A", "Opção B", "Opção C"],
          "answer": "Opção correta"
        },
        "scramble": {
          "sentence": "Uma frase curta em inglês da lição para montar",
          "translation": "Tradução da frase"
        },
        "recommendations": [
          {"type": "music", "title": "Nome de uma música ou artista"},
          {"type": "movie", "title": "Nome de um filme ou série"}
        ],
        "songLyric": {
          "english": "Um pequeno trecho (1-2 versos) de uma música famosa que use o vocabulário da lição",
          "portuguese": "Tradução do trecho",
          "songTitle": "Título da Música",
          "artist": "Artista"
        },
        "imagePrompt": "Uma descrição visual curta (em inglês) para gerar uma imagem que ilustre a 'story' da lição"
      }
      Gere pelo menos 2 recomendações de tipos diferentes (music, movie, video, podcast).
      No campo 'songLyric', escolha uma música real que o aluno possa reconhecer e que se conecte com sua idade (${profile.age} anos).
      Considere a idade do aluno (${profile.age} anos) para escolher vocabulário adequado e sugestões lúdicas que remetam ao passado ou interesses atuais adequados à sua idade.`,
      responseMimeType: "application/json"
    }
  });

  return extractJSON(response.text || "{}");
}
