import { NextResponse } from "next/server";

/**
 * Contact-form handler (pitch: Route Handler + Resend). Talks to Resend's
 * REST API directly so no SDK dependency is needed. Without RESEND_API_KEY
 * it answers `not_configured`, which the form turns into a mailto fallback
 * — the key (and a verified sender domain) is a deploy-time decision.
 */
export async function POST(request: Request) {
  let body: {
    name?: string;
    email?: string;
    institution?: string;
    message?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();
  const institution = body.institution?.trim();

  if (!name || !email || !message || !email.includes("@")) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY not set — message not delivered", {
      name,
      email,
      institution,
    });
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const to = process.env.CONTACT_TO_EMAIL ?? "nicolysantos51@gmail.com";
  const from =
    process.env.CONTACT_FROM_EMAIL ?? "A serviço do museu <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `[A serviço do museu] Contato de ${name}`,
      text: [
        `Nome: ${name}`,
        `Email: ${email}`,
        institution ? `Instituição: ${institution}` : null,
        "",
        message,
      ]
        .filter((line) => line !== null)
        .join("\n"),
    }),
  });

  if (!response.ok) {
    console.error("[contact] Resend error", response.status, await response.text());
    return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
