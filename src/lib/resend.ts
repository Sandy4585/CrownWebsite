import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

interface EnquiryEmailData {
  type: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  product_interest?: string;
  message: string;
  source_page: string;
}

export async function sendEnquiryEmail(data: EnquiryEmailData) {
  const typeLabel =
    data.type === "quote"
      ? "Quote Request"
      : data.type === "contact"
        ? "Contact Form"
        : "General Enquiry";

  const timestamp = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; border: 1px solid #C9A84C; border-radius: 8px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #C9A84C, #A8882E); padding: 24px; text-align: center;">
        <h1 style="color: #0A0A0A; margin: 0; font-size: 20px; font-weight: 700;">New Enquiry Received</h1>
      </div>
      <div style="padding: 32px; color: #FFFFFF;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #B8B8B8; width: 140px;">Type</td>
            <td style="padding: 8px 0; color: #C9A84C; font-weight: 600;">${typeLabel}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #B8B8B8;">Submitted</td>
            <td style="padding: 8px 0; color: #FFFFFF;">${timestamp} IST</td>
          </tr>
          <tr><td colspan="2" style="border-bottom: 1px solid #333; padding: 8px 0;"></td></tr>
          <tr>
            <td style="padding: 8px 0; color: #B8B8B8;">Name</td>
            <td style="padding: 8px 0; color: #FFFFFF; font-weight: 600;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #B8B8B8;">Email</td>
            <td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #C9A84C;">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #B8B8B8;">Phone</td>
            <td style="padding: 8px 0;"><a href="tel:${data.phone}" style="color: #C9A84C;">${data.phone}</a></td>
          </tr>
          ${data.company ? `<tr><td style="padding: 8px 0; color: #B8B8B8;">Company</td><td style="padding: 8px 0; color: #FFFFFF;">${data.company}</td></tr>` : ""}
          ${data.product_interest ? `<tr><td style="padding: 8px 0; color: #B8B8B8;">Product Interest</td><td style="padding: 8px 0; color: #C9A84C; font-weight: 600;">${data.product_interest}</td></tr>` : ""}
          <tr>
            <td style="padding: 8px 0; color: #B8B8B8;">Source Page</td>
            <td style="padding: 8px 0; color: #888;">${data.source_page}</td>
          </tr>
        </table>
        <div style="margin-top: 24px; padding: 16px; background: #1A1A1A; border-left: 3px solid #C9A84C; border-radius: 4px;">
          <p style="margin: 0 0 8px; color: #B8B8B8; font-size: 13px;">Message</p>
          <p style="margin: 0; color: #FFFFFF; line-height: 1.6;">${data.message}</p>
        </div>
        <div style="margin-top: 32px; text-align: center;">
          <a href="https://crownconsultants.in/admin/enquiries" style="display: inline-block; padding: 12px 32px; background: #C9A84C; color: #0A0A0A; text-decoration: none; border-radius: 6px; font-weight: 600;">View All Enquiries</a>
        </div>
      </div>
      <div style="padding: 16px; text-align: center; border-top: 1px solid #333; color: #666; font-size: 12px;">
        Crown Consultants Website — Automated Notification
      </div>
    </div>
  `;

  return resend.emails.send({
    from: "Crown Consultants <noreply@crownconsultants.in>",
    to: [process.env.ENQUIRY_NOTIFICATION_EMAIL || "velansanthoshkumar@gmail.com"],
    subject: `New ${typeLabel} from ${data.name} — Crown Consultants Website`,
    html,
  });
}
