import { Resend } from "resend";
import { env } from "@/lib/env";
import { formatCurrency, formatDate } from "@/lib/format";

export type BookingConfirmationInput = {
  to: string;
  customerName: string;
  bookingId: string;
  adventureTitle: string;
  location: string;
  date: string;
  participants: number;
  totalPrice: number;
  paymentReference: string;
};

// Demo MVP: email is optional. With no RESEND_API_KEY the sender is a no-op so
// booking never depends on email being configured. Sender:onboarding@resend.dev
// works out-of-the-box on Resend's test domain; set EMAIL_FROM to your verified
// domain for production.
const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
const FROM = env.EMAIL_FROM ?? "Adventa <onboarding@resend.dev>";

function renderHtml(input: BookingConfirmationInput) {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:8px 0;color:#6a6a6a;font-size:14px;">${label}</td>
      <td style="padding:8px 0;color:#1a1a1a;font-size:14px;font-weight:600;text-align:right;">${value}</td>
    </tr>`;

  return `
  <div style="background:#f4efe7;padding:32px 0;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e7e0d5;border-radius:16px;overflow:hidden;">
      <div style="background:#1a1a1a;padding:24px 32px;">
        <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.02em;">Adventa</p>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.6);font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">Booking confirmed</p>
      </div>
      <div style="padding:32px;">
        <h1 style="margin:0 0 8px;color:#1a1a1a;font-size:22px;font-weight:700;letter-spacing:-0.02em;">You're all set, ${input.customerName}!</h1>
        <p style="margin:0 0 24px;color:#6a6a6a;font-size:14px;line-height:1.6;">Your weekend escape is booked. Here are the details — keep this email for your records.</p>

        <div style="background:#f4efe7;border:1px solid #e7e0d5;border-radius:12px;padding:20px 24px;">
          <p style="margin:0 0 4px;color:#6a6a6a;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">Adventure</p>
          <p style="margin:0 0 16px;color:#1a1a1a;font-size:18px;font-weight:700;">${input.adventureTitle}</p>
          <table style="width:100%;border-collapse:collapse;">
            ${row("Location", input.location)}
            ${row("Date", formatDate(input.date))}
            ${row("Guests", String(input.participants))}
            ${row("Total paid", formatCurrency(input.totalPrice))}
          </table>
        </div>

        <div style="margin-top:20px;display:flex;justify-content:space-between;">
          <table style="width:100%;border-collapse:collapse;">
            ${row("Booking reference", input.bookingId)}
            ${row("Payment reference", input.paymentReference)}
          </table>
        </div>

        <p style="margin:24px 0 0;color:#9a9a9a;font-size:12px;line-height:1.6;">
          Payment shown is a demo (no card was charged). The operator will reach out before your departure with the meeting point and final checklist.
        </p>
      </div>
      <div style="background:#f4efe7;border-top:1px solid #e7e0d5;padding:16px 32px;">
        <p style="margin:0;color:#9a9a9a;font-size:12px;">© 2026 Adventa · Weekend escapes in the Western Ghats</p>
      </div>
    </div>
  </div>`;
}

export async function sendBookingConfirmationEmail(
  input: BookingConfirmationInput
): Promise<{ sent: boolean; reason?: string }> {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping confirmation email (demo mode).");
    return { sent: false, reason: "not_configured" };
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: input.to,
      subject: `Booking confirmed — ${input.adventureTitle}`,
      html: renderHtml(input)
    });

    if (error) {
      console.error("[email] Resend returned an error:", error);
      return { sent: false, reason: "send_failed" };
    }
    return { sent: true };
  } catch (error) {
    // Never let an email failure break a successful booking.
    console.error("[email] failed to send confirmation:", error);
    return { sent: false, reason: "send_failed" };
  }
}
