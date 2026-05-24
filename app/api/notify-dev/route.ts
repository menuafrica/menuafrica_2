import { NextRequest, NextResponse } from "next/server";

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export async function POST(req: NextRequest) {
  try {
    const { error, context, metadata } = await req.json();
    const timestamp = new Date().toISOString();
    const errorMessage = error?.message || String(error).substring(0, 500);
    const results = { discord: 'skipped', email: 'skipped' };

    if (DISCORD_WEBHOOK_URL) {
      try {
        const embed = {
          title: "🚨 CRITICAL APP ERROR",
          description: `Contexte : **${context || 'Inconnu'}**`,
          color: 15548997,
          fields: [
            { name: "Message", value: errorMessage },
            { name: "Metadata", value: JSON.stringify(metadata || {}, null, 2).substring(0, 1000) },
            { name: "Time", value: timestamp }
          ],
          footer: { text: "MenuAfrica Sentinel" }
        };

        await fetch(DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: "MenuAfrica Sentinel", embeds: [embed] })
        });
        results.discord = 'sent';
      } catch (e) {
        results.discord = 'failed';
      }
    }

    if (RESEND_API_KEY && ADMIN_EMAIL) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: 'MenuAfrica Alert <alert@menuafrica.com>',
            to: ADMIN_EMAIL,
            subject: `🚨 ALERTE: ${errorMessage.substring(0, 50)}...`,
            html: `<h1>Erreur Critique Détectée</h1><p><strong>Contexte:</strong> ${context}</p><p><strong>Message:</strong> ${errorMessage}</p><pre>${JSON.stringify(metadata, null, 2)}</pre>`
          })
        });
        results.email = 'sent';
      } catch (e) {
        results.email = 'failed';
      }
    }

    return NextResponse.json({ status: 'processed', results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
