import nodemailer from "nodemailer";
import type { OrderRecord } from "@/lib/orders";
import { formatPrice, product } from "@/lib/product";

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function brandName() {
  return process.env.BRAND_NAME || product.brandName;
}

function baseEmailShell(content: string) {
  return `
    <div style="margin:0;padding:0;background:#f3fbf3;font-family:Arial,Helvetica,sans-serif;color:#1d3f1d;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3fbf3;padding:24px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #dcefd8;box-shadow:0 16px 45px rgba(49,120,42,0.12);">
              <tr>
                <td style="background:#285f25;color:#ffffff;padding:28px 30px;text-align:center;">
                  <div style="font-size:28px;font-weight:700;letter-spacing:0.5px;">${brandName()}</div>
                  <div style="font-size:13px;margin-top:6px;opacity:0.9;">Natural handmade care</div>
                </td>
              </tr>
              <tr>
                <td style="padding:30px;">
                  ${content}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
}

function row(label: string, value: string | number) {
  return `
    <tr>
      <td style="padding:10px 0;color:#5b7258;font-size:14px;">${label}</td>
      <td align="right" style="padding:10px 0;color:#1d3f1d;font-size:14px;font-weight:700;">${value}</td>
    </tr>
  `;
}

function businessEmailHtml(order: OrderRecord) {
  return baseEmailShell(`
    <h1 style="margin:0 0 10px;font-size:26px;line-height:1.2;color:#1d3f1d;">New product order received</h1>
    <p style="margin:0 0 22px;color:#5b7258;font-size:15px;line-height:1.6;">A customer has placed a Cash On Delivery order. Please call the customer soon to confirm this order.</p>
    <div style="display:inline-block;background:#e1f5df;color:#285f25;border-radius:999px;padding:8px 14px;font-size:13px;font-weight:700;margin-bottom:20px;">New Order</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
      ${row("Order ID", order.orderId)}
      ${row("Date & Time", order.dateTime)}
    </table>
    <h2 style="margin:24px 0 8px;font-size:18px;color:#285f25;">Customer details</h2>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #e4efe2;border-collapse:collapse;">
      ${row("Customer Name", order.fullName)}
      ${row("Phone Number", order.phone)}
      ${row("Email Address", order.email)}
      ${row("Exact Location", order.location)}
    </table>
    <h2 style="margin:24px 0 8px;font-size:18px;color:#285f25;">Product details</h2>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #e4efe2;border-collapse:collapse;">
      ${row("Product Name", order.productName)}
      ${row("Quantity", order.quantity)}
      ${row("Price Per Piece", formatPrice(order.pricePerPiece))}
      ${row("Total Price", formatPrice(order.totalPrice))}
    </table>
    <h2 style="margin:24px 0 8px;font-size:18px;color:#285f25;">Payment details</h2>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #e4efe2;border-collapse:collapse;">
      ${row("Payment Method", order.paymentMethod)}
      ${row("Order Status", order.orderStatus)}
    </table>
    <div style="margin-top:24px;background:#fffaf0;border-left:5px solid #68b75e;border-radius:16px;padding:18px;color:#285f25;font-weight:700;">
      Please call the customer soon to confirm this order.
    </div>
  `);
}

function customerEmailHtml(order: OrderRecord) {
  const replyEmail = process.env.EMAIL_FROM || process.env.BUSINESS_EMAIL || "";

  return baseEmailShell(`
    <h1 style="margin:0 0 10px;font-size:26px;line-height:1.2;color:#1d3f1d;">Thank you for your order!</h1>
    <p style="margin:0 0 18px;color:#5b7258;font-size:15px;line-height:1.7;">Hi ${order.fullName},</p>
    <p style="margin:0 0 22px;color:#5b7258;font-size:15px;line-height:1.7;">We have received your order successfully. Our sales representative will call you soon to confirm your order.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fcf6;border:1px solid #dcefd8;border-radius:18px;padding:14px;border-collapse:separate;">
      ${row("Order ID", order.orderId)}
      ${row("Product", order.productName)}
      ${row("Quantity", order.quantity)}
      ${row("Total Price", formatPrice(order.totalPrice))}
      ${row("Payment Method", order.paymentMethod)}
    </table>
    <p style="margin:24px 0 0;color:#5b7258;font-size:15px;line-height:1.7;">If you have questions, reply to this email: <strong style="color:#285f25;">${replyEmail}</strong></p>
    <p style="margin:22px 0 0;color:#1d3f1d;font-size:15px;font-weight:700;">Thank you,<br />${brandName()}</p>
  `);
}

export async function sendOrderEmails(order: OrderRecord) {
  const host = requiredEnv("SMTP_HOST");
  const port = Number(requiredEnv("SMTP_PORT"));
  const user = requiredEnv("SMTP_USER");
  const pass = requiredEnv("SMTP_PASS");
  const businessEmail = requiredEnv("BUSINESS_EMAIL");
  const emailFrom = requiredEnv("EMAIL_FROM");

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });

  await transporter.sendMail({
    from: `${brandName()} <${emailFrom}>`,
    to: businessEmail,
    replyTo: order.email,
    subject: `New Product Order Received - ${order.orderId}`,
    html: businessEmailHtml(order)
  });

  await transporter.sendMail({
    from: `${brandName()} <${emailFrom}>`,
    to: order.email,
    replyTo: emailFrom,
    subject: `Your Order Has Been Received - ${brandName()}`,
    html: customerEmailHtml(order)
  });
}
