This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Email Setup (Nodemailer)

We use Nodemailer (context7) to send transactional emails (contact form and order confirmations).

Configure the following environment variables in your `.env.local`:

```
# Required
EMAIL_USER=your_smtp_username_or_address
EMAIL_PASS=your_smtp_password_or_app_password

# One of the following options:
# Option A: Simpler (Gmail/Outlook/etc.)
EMAIL_SERVICE=gmail
# Option B: Custom SMTP
# EMAIL_HOST=smtp.yourhost.com
# EMAIL_PORT=587
# EMAIL_SECURE=false

# Optional display/sender and recipients
EMAIL_FROM=notifications@yourelgon.co
EMAIL_FROM_NAME=Mt. Elgon Coffee
SUPPORT_TO_EMAIL=support@yourelgon.co

# Optional: path to logo used in emails (default: public/Main Logo.png)
EMAIL_LOGO_PATH=public/Main Logo.png
```

Gmail (recommended):
- Enable 2‑Step Verification on the Gmail account
- Create an App Password (type: Mail, device: Other/Custom)
- Use the App Password as `EMAIL_PASS`; set `EMAIL_SERVICE=gmail`

Routes:
- `POST /api/email/contact` — Body: `{ name, email, subject, message }`
- `POST /api/email/order` — Body: `{ orderId?, toEmail, name?, items: {name, quantity, price}[], totalAmount, shipping? }`

Notes:
- Emails embed the Elgon logo via CID. Ensure the logo file exists at `public/Main Logo.png` or change `EMAIL_LOGO_PATH`.
- Order confirmation emails are sent after order creation in `app/(main)/checkout/page.tsx`.
