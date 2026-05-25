import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { prompt, imageBase64, mode = 'menu' } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API Key manquante");

    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    const parts: any[] = [];
    if (imageBase64) {
        const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
        parts.push({
            inlineData: {
                data: base64Data,
                mimeType: "image/jpeg"
            }
        });
    }

    parts.push({ text: `Input utilisateur: ${prompt || ""}` });

    let systemInstruction = "";
    let responseMimeType = "application/json";

    switch (mode) {
        case 'description':
            systemInstruction = "Tu es un expert en marketing culinaire africain. Rédige une description appétissante, courte (max 25 mots) et vendeuse pour ce plat. Utilise des adjectifs sensoriels (croustillant, fondant, épicé). Réponds uniquement avec le texte brut.";
            responseMimeType = "text/plain";
            break;
        case 'analysis':
            systemInstruction = "Tu es Lova Sentinel, l'IA de monitoring de MenuAfrica. Analyse les logs techniques et les métriques business. Donne un diagnostic précis et des recommandations. Format Markdown concis.";
            responseMimeType = "text/plain";
            break;
        case 'menu':
        default:
            systemInstruction = "Tu es un chef consultant expert. Génère une structure de menu JSON. Format JSON strict attendu: { \"theme\": { \"primaryColor\": \"hex\", \"font\": \"serif/sans\" }, \"categories\": [ { \"name\": \"Nom catégorie\", \"items\": [ { \"name\": \"Nom plat\", \"description\": \"Description courte\", \"price\": 1000 } ] } ] }";
            break;
    }

    const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: { role: 'user', parts: parts },
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: responseMimeType
        }
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
