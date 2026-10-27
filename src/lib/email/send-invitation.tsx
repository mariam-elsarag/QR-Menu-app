import "server-only";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendInvitationEmailParams = {
  email: string;
  invitationUrl: string;
  expiresAt: Date;
};

export async function sendInvitationEmail({
  email,
  invitationUrl,
  expiresAt,
}: SendInvitationEmailParams) {
  const from = process.env.EMAIL_FROM;

  if (!from) {
    throw new Error("EMAIL_FROM is not configured");
  }
  const isTestMode = process.env.RESEND_TEST_MODE === "true";
  const testEmail = process.env.RESEND_TEST_EMAIL;
  if (isTestMode && !testEmail) {
    throw new Error("RESEND_TEST_EMAIL is not configured");
  }

  const recipient = isTestMode ? testEmail! : email;

  const { error } = await resend.emails.send({
    from,
    to: recipient,
    subject: "You're invited to join the team",
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Team Invitation</title>
        </head>
        <body style="margin:0;padding:0;background-color:#FAF7F1;font-family:Arial,Helvetica,sans-serif;color:#292721;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:40px 16px;background-color:#FAF7F1;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background-color:#FFFDFA;border:1px solid #DED7CB;">
                  <tr>
                    <td style="padding:40px 32px;">
                      <p style="margin:0 0 12px;color:#A44732;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">
                        Team Invitation
                      </p>

                      <h1 style="margin:0 0 16px;font-size:28px;line-height:1.3;font-weight:600;">
                        You're invited!
                      </h1>

                      <p style="margin:0 0 24px;font-size:15px;line-height:1.8;color:#777166;">
                        You've been invited to join a restaurant team.
                        Set up your password to activate your account and get started.
                      </p>

                      <table role="presentation" cellspacing="0" cellpadding="0">
                        <tr>
                          <td align="center" bgcolor="#A44732" style="background-color:#A44732;">
                            <a
                              href="${escapeHtml(invitationUrl)}"
                              style="display:inline-block;padding:15px 28px;color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:bold;"
                            >
                              Accept Invitation
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="margin:24px 0 8px;font-size:13px;line-height:1.7;color:#777166;">
                        This invitation expires on ${expiresAt.toUTCString()}.
                      </p>

                      <p style="margin:0;font-size:13px;line-height:1.7;color:#777166;">
                        If you weren't expecting this invitation, you can safely ignore this email.
                      </p>

                      <hr style="margin:28px 0;border:0;border-top:1px solid #DED7CB;" />

                      <p style="margin:0;font-size:12px;line-height:1.7;color:#777166;">
                        If the button doesn't work, copy and paste this link into your browser:
                      </p>

                      <p style="margin:8px 0 0;font-size:12px;line-height:1.7;overflow-wrap:anywhere;">
                        <a href="${escapeHtml(invitationUrl)}" style="color:#A44732;">
                          ${escapeHtml(invitationUrl)}
                        </a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error("Failed to send invitation email:", error.message);
    throw new Error("Failed to send invitation email");
  }
}

function escapeHtml(value: string): string {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return value.replace(/[&<>"']/g, (char) => entities[char]);
}
