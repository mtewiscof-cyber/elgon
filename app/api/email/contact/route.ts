import { NextResponse } from "next/server";
import { loadElgonLogoAttachment, renderBaseEmail, sendEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    const attachments = await loadElgonLogoAttachment();

    const adminTo = process.env.SUPPORT_TO_EMAIL || process.env.EMAIL_USER;
    if (!adminTo) {
      return NextResponse.json({ ok: false, error: "Support email is not configured" }, { status: 500 });
    }

    const adminHtml = renderBaseEmail({
      title: `New Contact Message: ${subject}`,
      bodyHtml: `
        <p>You have received a new contact message via the website.</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    const userHtml = renderBaseEmail({
      title: "We received your message",
      bodyHtml: `
        <p>Hi ${name},</p>
        <p>Thanks for reaching out to Mt. Elgon Women in Specialty Coffee. We have received your message and our team will get back to you shortly.</p>
        <p><strong>Your message:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
        <p>Warm regards,<br/>Elgon Team</p>
      `,
    });

    await sendEmail({
      to: adminTo,
      subject: `[Contact] ${subject} — ${name}`,
      html: adminHtml,
      text: `New contact message from ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
      attachments,
    });

    await sendEmail({
      to: email,
      subject: "We received your message",
      html: userHtml,
      text: `Hi ${name}, we received your message and will respond shortly.\n\nYour message:\n${message}`,
      attachments,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("/api/email/contact error", error);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}


