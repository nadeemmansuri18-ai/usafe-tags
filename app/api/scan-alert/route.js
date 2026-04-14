// app/api/scan-alert/route.js
// This runs on the server when a QR is scanned.
// It sends an email alert to all guardians.

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { tagId, gps, photoUrl } = body;

    // For now we use test guardian email
    // Later this will come from Firestore profile
    const guardianEmail = "nadeemmansuri18@gmail.com";
    const personName = "आयुष";

    const locationLink = gps?.lat
      ? `https://www.google.com/maps?q=${gps.lat},${gps.lng}`
      : "Location not available";

    const time = new Date().toLocaleString("en-NP", {
      timeZone: "Asia/Kathmandu"
    });

    await resend.emails.send({
      from: "Usafe-Tags <onboarding@resend.dev>",
      to: guardianEmail,
      subject: "🚨 Usafe-Tags: QR Code Scanned!",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #c0392b;">🏷️ Usafe-Tags Alert</h2>
          <p style="font-size: 18px;">Someone scanned the QR tag for <strong>${personName}</strong>.</p>
          
          <div style="background: #fff3f3; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0 0 8px 0;">🕐 <strong>Time:</strong> ${time}</p>
            <p style="margin: 0 0 8px 0;">📍 <strong>Location:</strong> <a href="${locationLink}">${locationLink}</a></p>
            <p style="margin: 0;">🏷️ <strong>Tag ID:</strong> ${tagId}</p>
          </div>

          <p style="color: #888; font-size: 13px;">
            This alert was sent automatically by Usafe-Tags safety system.
          </p>
        </div>
      `
    });

    return Response.json({ success: true });

  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}