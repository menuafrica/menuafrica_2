import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from "@google/genai";

async function getHash(text: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(req: NextRequest) {
  try {
    const { menuData, targetLang } = await req.json();
    
    const sourceString = JSON.stringify(menuData);
    const contentHash = await getHash(sourceString + targetLang);

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
    );

    const { data: cached } = await supabaseAdmin
      .from('translation_cache')
      .select('translated_content')
      .eq('content_hash', contentHash)
      .maybeSingle();

    if (cached) {
      return NextResponse.json({ data: cached.translated_content, source: 'cache' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API Key manquante");

    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    const systemInstruction = `Tu es Lova, expert traducteur gastronomique pour MenuAfrica. Ta mission : Traduire ce menu en ${targetLang}. RÈGLES STRICTES : 1. Garde EXACTEMENT la même structure JSON. 2. Ne traduis PAS les clés du JSON (ex: "price", "image_url"), seulement les valeurs textuelles visibles. 3. Pour les descriptions : Rends-les appétissantes et vendeuses dans la langue cible. 4. Pour les noms de plats : Garde les noms locaux (ex: "Thieboudienne", "Yassa") mais traduis les termes génériques (ex: "Poulet", "Riz").`;

    const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `JSON à traduire : ${sourceString}`,
        config: { systemInstruction: systemInstruction, responseMimeType: "application/json" }
    });

    const translatedJson = JSON.parse(response.text || "{}");

    await supabaseAdmin.from('translation_cache').insert([{ content_hash: contentHash, target_lang: targetLang, translated_content: translatedJson }]);

    return NextResponse.json({ data: translatedJson, source: 'ai_lova_v3' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
