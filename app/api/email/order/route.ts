import { NextResponse } from "next/server";
import { loadElgonLogoAttachment, renderBaseEmail, sendEmail } from "@/lib/email";

export const runtime = "nodejs";

type OrderItem = {
  name: string;
  quantity: number;
  price: number; // unit price
};

function formatUGX(amount: number) {
  try {
    return new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX", maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `UGX ${Math.round(amount).toLocaleString()}`;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      orderId,
      toEmail,
      name,
      items,
      totalAmount,
      shipping,
    } = body as {
      orderId?: string;
      toEmail?: string;
      name?: string;
      items?: OrderItem[];
      totalAmount?: number;
      shipping?: { address?: string; city?: string; state?: string; country?: string; phone?: string; };
    };

    if (!toEmail || !items || typeof totalAmount !== "number") {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    const attachments = await loadElgonLogoAttachment();

    const rows = (items || [])
      .map(
        (it) => `<tr><td>${it.name}</td><td>${it.quantity}</td><td>${formatUGX(it.price)}</td><td>${formatUGX(it.price * it.quantity)}</td></tr>`
      )
      .join("");

    const userHtml = renderBaseEmail({
      title: "Order Confirmation",
      bodyHtml: `
        <p>Hi ${name || "there"},</p>
        <p>Thank you for your order${orderId ? ` <strong>#${orderId}</strong>` : ""}. We are reviewing it and will follow up with shipping details.</p>
        <h3>Order Summary</h3>
        <table>
          <thead>
            <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
          </thead>
          <tbody>
            ${rows}
            <tr><td colspan="3" style="text-align:right"><strong>Order Total</strong></td><td><strong>${formatUGX(totalAmount)}</strong></td></tr>
          </tbody>
        </table>
        ${shipping ? `
        <h3>Shipping</h3>
        <p>
          ${shipping.address || ""}<br/>
          ${shipping.city || ""}${shipping.state ? ", " + shipping.state : ""}<br/>
          ${shipping.country || ""}<br/>
          ${shipping.phone ? "Phone: " + shipping.phone : ""}
        </p>` : ""}
        <p>We appreciate your support for women-led specialty coffee.</p>
      `,
    });

    const adminHtml = renderBaseEmail({
      title: `New Order${orderId ? ` #${orderId}` : ""}`,
      bodyHtml: `
        <p>A new order has been placed.</p>
        <h3>Customer</h3>
        <p>
          ${name || "(no name)"}<br/>
          ${toEmail || "(no email)"}
        </p>
        ${shipping ? `
        <h3>Shipping</h3>
        <p>
          ${shipping.address || ""}<br/>
          ${shipping.city || ""}${shipping.state ? ", " + shipping.state : ""}<br/>
          ${shipping.country || ""}<br/>
          ${shipping.phone ? "Phone: " + shipping.phone : ""}
        </p>` : ""}

        <h3>Order Summary</h3>
        <table>
          <thead>
            <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
          </thead>
          <tbody>
            ${rows}
            <tr><td colspan="3" style="text-align:right"><strong>Order Total</strong></td><td><strong>${formatUGX(totalAmount!)}</strong></td></tr>
          </tbody>
        </table>
      `,
    });

    await sendEmail({
      to: toEmail,
      subject: `Your order${orderId ? ` #${orderId}` : ""} is received` ,
      html: userHtml,
      text: `Thank you for your order${orderId ? ` #${orderId}` : ""}. Total: ${formatUGX(totalAmount)}.`,
      attachments,
    });

    const adminTo = process.env.SUPPORT_TO_EMAIL || process.env.EMAIL_USER || process.env.EMAIL;
    if (adminTo) {
      await sendEmail({
        to: adminTo,
        subject: `New order${orderId ? ` #${orderId}` : ""} — ${name || "Customer"} <${toEmail || "no-email"}>`,
        html: adminHtml,
        text: `New order${orderId ? ` #${orderId}` : ""} from ${name || "Customer"} <${toEmail || "no-email"}>. Total: ${formatUGX(totalAmount!)}.`,
        attachments,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("/api/email/order error", error);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}


