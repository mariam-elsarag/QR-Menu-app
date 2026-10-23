import "server-only";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const from = process.env.EMAIL_FROM;

  if (!from) {
    throw new Error("EMAIL_FROM is not configured");
  }

  const { error } = await resend.emails.send({
    from,
    to: email,
    subject: "Reset your password",
    text: [
      "We received a request to reset your password.",
      `Reset your password using this link: ${resetUrl}`,
      "This link expires in 15 minutes.",
      "If you didn't request this, you can ignore this email.",
    ].join("\n\n"),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto;">
        <h1>Reset your password</h1>
        <p>We received a request to reset your password.</p>
        <p>
          <a href="${resetUrl}"
             style="display:inline-block;padding:12px 20px;background:#A44732;color:#fff;text-decoration:none;border-radius:6px;">
            Reset password
          </a>
        </p>
        <p>This link expires in 15 minutes.</p>
        <p>If you didn't request this, you can ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    throw new Error("Failed to send password reset email");
  }
}
