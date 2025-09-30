import nodemailer, { Transporter, SendMailOptions } from "nodemailer";
import path from "path";
import fs from "fs/promises";

type EmailTransportConfig = {
  service?: string;
  host?: string;
  port?: number;
  secure?: boolean;
  user: string;
  pass: string;
};

let cachedTransporter: Transporter | null = null;

function getEmailConfigFromEnv(): EmailTransportConfig {
  const {
    EMAIL_SERVICE,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_SECURE,
    EMAIL_USER,
    EMAIL,
    EMAIL_PASS,
  } = process.env;

  const userFromEnv = EMAIL_USER || EMAIL; // accept EMAIL as alias
  if (!userFromEnv || !EMAIL_PASS) {
    throw new Error("EMAIL_USER (or EMAIL) and EMAIL_PASS must be set in environment");
  }

  const config: EmailTransportConfig = {
    service: EMAIL_SERVICE,
    host: EMAIL_HOST,
    port: EMAIL_PORT ? Number(EMAIL_PORT) : undefined,
    secure: EMAIL_SECURE ? EMAIL_SECURE === "true" : undefined,
    user: userFromEnv,
    pass: EMAIL_PASS,
  };

  return config;
}

export function getTransporter(): Transporter {
  if (cachedTransporter) return cachedTransporter;

  const config = getEmailConfigFromEnv();

  if (config.service) {
    cachedTransporter = nodemailer.createTransport({
      service: config.service,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
  } else {
    cachedTransporter = nodemailer.createTransport({
      host: config.host,
      port: config.port ?? 587,
      secure: config.secure ?? false,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
  }

  return cachedTransporter;
}

export async function loadElgonLogoAttachment() {
  const logoPath = process.env.EMAIL_LOGO_PATH || "public/Main Logo.png";
  const absolutePath = path.join(process.cwd(), logoPath);

  // 1) Prefer explicit public URL if provided
  const logoUrl = process.env.EMAIL_LOGO_URL;
  if (logoUrl) {
    try {
      const res = await fetch(logoUrl);
      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        const content = Buffer.from(arrayBuf);
        const filenameFromUrl = path.basename(new URL(logoUrl).pathname) || "logo.png";
        return [
          { filename: filenameFromUrl, content, cid: "elgonlogo" },
        ];
      }
    } catch {}
  }

  // 2) Try reading from filesystem (works locally, may not work on serverless)
  try {
    const content = await fs.readFile(absolutePath);
    return [
      {
        filename: path.basename(logoPath),
        content,
        cid: "elgonlogo",
      },
    ];
  } catch {}

  // 3) Fallback: construct a public URL from site URL and fetch
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);
    if (baseUrl) {
      const relative = (logoPath.startsWith("public/")) ? logoPath.slice("public/".length) : logoPath;
      const encoded = relative.split("/").map(encodeURIComponent).join("/");
      const finalUrl = `${baseUrl}/${encoded}`;
      const res = await fetch(finalUrl);
      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        const content = Buffer.from(arrayBuf);
        return [
          { filename: path.basename(relative) || "logo.png", content, cid: "elgonlogo" },
        ];
      }
    }
  } catch {}

  // 4) As last resort, return no attachment (image may not render)
  return [] as SendMailOptions["attachments"];
}

export function renderBaseEmail(params: { title: string; bodyHtml: string }) {
  const { title, bodyHtml } = params;
  return `
  <!doctype html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>${title}</title>
      <style>
        body { margin:0; padding:0; background:#f6f6f6; font-family: Arial, Helvetica, sans-serif; }
        .container { max-width: 640px; margin: 0 auto; padding: 16px; }
        .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .header { padding: 20px; text-align:center; background: #fff7eb; }
        .brand { display:inline-flex; align-items:center; gap:10px; justify-content:center; }
        .brand h1 { margin:0; font-size: 18px; color:#92400e; }
        .content { padding: 24px; color:#374151; line-height:1.6; }
        .footer { padding: 16px; text-align:center; color:#6b7280; font-size:12px; }
        .btn { display:inline-block; padding:10px 16px; background:#d97706; color:#ffffff !important; text-decoration:none; border-radius:8px; }
        table { width:100%; border-collapse: collapse; }
        th, td { padding: 8px 6px; text-align:left; }
        th { background:#fff7eb; color:#92400e; }
        tr + tr td { border-top: 1px solid #f3f4f6; }
        @media (max-width: 480px) { .content { padding: 16px; } }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">
            <div class="brand">
              <img src="cid:elgonlogo" alt="Elgon" height="40" style="display:block" />
              <h1>Mt. Elgon Women in Specialty Coffee</h1>
            </div>
          </div>
          <div class="content">
            ${bodyHtml}
          </div>
          <div class="footer">&copy; ${new Date().getFullYear()} Mt. Elgon Women in Specialty Coffee</div>
        </div>
      </div>
    </body>
  </html>`;
}

export async function sendEmail(options: Omit<SendMailOptions, "from"> & { fromName?: string }) {
  const transporter = getTransporter();
  const fromEmail = process.env.EMAIL_USER || process.env.EMAIL || "no-reply@example.com";
  const fromName = options.fromName || process.env.EMAIL_FROM_NAME || "Mt. Elgon Coffee";
  const mailOptions: SendMailOptions = {
    ...options,
    from: `${fromName} <${fromEmail}>`,
  };
  return transporter.sendMail(mailOptions);
}


