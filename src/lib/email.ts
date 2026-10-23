import "server-only";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
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
  const safeUrl = escapeHtml(resetUrl);
  const year = new Date().getFullYear();

  const { error } = await resend.emails.send({
    from,
    to: recipient,
    subject: "Reset your QR Menu password",

    text: [
      "QR Menu",
      "",
      "Reset your password",
      "",
      "We received a request to reset the password for your QR Menu account.",
      "",
      `Reset your password: ${resetUrl}`,
      "",
      "This link expires in 15 minutes and can only be used once.",
      "",
      "If you didn't request a password reset, you can safely ignore this email.",
      "",
      `© ${year} QR Menu`,
    ].join("\n"),

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Reset your QR Menu password</title>
</head>

<body
  style="
    margin: 0;
    padding: 0;
    width: 100%;
    background-color: #ffffff;
    font-family: Arial, Helvetica, sans-serif;
    color: #292721;
    -webkit-text-size-adjust: 100%;
  "
>
  <!-- Preheader -->
  <div
    style="
      display: none;
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      color: transparent;
      mso-hide: all;
    "
  >
    Reset your QR Menu account password. This link expires in 15 minutes.
  </div>

  <table
    role="presentation"
    width="100%"
    border="0"
    cellspacing="0"
    cellpadding="0"
    bgcolor="#ffffff"
    style="
      width: 100%;
      border-collapse: collapse;
      background-color: #ffffff;
    "
  >
    <tr>
      <td align="center" style="padding: 36px 16px 40px;">

        <table
          role="presentation"
          width="100%"
          border="0"
          cellspacing="0"
          cellpadding="0"
          style="
            width: 100%;
            max-width: 480px;
            border-collapse: collapse;
          "
        >

          <!-- Brand header -->
          <tr>
            <td style="padding: 0 0 28px 0;">
              <table
                role="presentation"
                border="0"
                cellspacing="0"
                cellpadding="0"
                style="border-collapse: collapse;"
              >
                <tr>
                  <!-- Icon -->
                  <td
                    width="40"
                    height="40"
                    align="center"
                    valign="middle"
                    bgcolor="#A44732"
                    style="
                      width: 40px;
                      height: 40px;
                      min-width: 40px;
                      background-color: #A44732;
                      border-radius: 6px;
                      color: #FFFFFF;
                      font-family: Arial, Helvetica, sans-serif;
                      font-size: 22px;
                      font-weight: bold;
                      line-height: 40px;
                      text-align: center;
                      vertical-align: middle;
                    "
                  >Q</td>

                  <!-- Brand name -->
                  <td
                    valign="middle"
                    style="
                      padding: 0 0 0 12px;
                      color: #292721;
                      font-family: Arial, Helvetica, sans-serif;
                      font-size: 21px;
                      font-weight: bold;
                      line-height: 40px;
                      white-space: nowrap;
                      mso-line-height-rule: exactly;
                    "
                  >QR Menu</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td
              height="1"
              bgcolor="#EAE6E0"
              style="
                height: 1px;
                background-color: #EAE6E0;
                font-size: 0;
                line-height: 1px;
              "
            >&nbsp;</td>
          </tr>

          <!-- Main content -->
          <tr>
            <td style="padding: 34px 0 0 0;">

              <p
                style="
                  margin: 0 0 14px 0;
                  color: #A44732;
                  font-size: 11px;
                  font-weight: bold;
                  line-height: 18px;
                  letter-spacing: 1.5px;
                "
              >
                ACCOUNT SECURITY
              </p>

              <h1
                style="
                  margin: 0 0 16px 0;
                  color: #292721;
                  font-family: Arial, Helvetica, sans-serif;
                  font-size: 30px;
                  font-weight: bold;
                  line-height: 38px;
                  letter-spacing: -0.5px;
                "
              >
                Reset your password.
              </h1>

              <p
                style="
                  margin: 0 0 28px 0;
                  color: #777166;
                  font-size: 15px;
                  line-height: 26px;
                "
              >
                We received a request to reset the password for your QR Menu
                account. Click the button below to choose a new password.
              </p>

              <!-- Reset button -->
              <table
                role="presentation"
                border="0"
                cellspacing="0"
                cellpadding="0"
                style="border-collapse: separate;"
              >
                <tr>
                  <td
                    align="center"
                    valign="middle"
                    bgcolor="#A44732"
                    style="
                      background-color: #A44732;
                      border: 1px solid #A44732;
                      border-radius: 5px;
                    "
                  >
                    <a
                      href="${safeUrl}"
                      target="_blank"
                      style="
                        display: inline-block;
                        padding: 14px 24px;
                        color: #FFFFFF;
                        font-family: Arial, Helvetica, sans-serif;
                        font-size: 14px;
                        font-weight: bold;
                        line-height: 20px;
                        text-decoration: none;
                        border-radius: 5px;
                      "
                    >Reset password &rarr;</a>
                  </td>
                </tr>
              </table>

              <!-- Expiration notice -->
              <p
                style="
                  margin: 24px 0 0 0;
                  color: #777166;
                  font-size: 13px;
                  line-height: 22px;
                "
              >
                This link expires in
                <strong style="color: #292721;">15 minutes</strong>
                and can only be used once.
              </p>

              <!-- Fallback link -->
              <p
                style="
                  margin: 28px 0 8px 0;
                  color: #777166;
                  font-size: 12px;
                  line-height: 20px;
                "
              >
                If the button doesn't work, copy and paste this link into
                your browser:
              </p>

              <p
                style="
                  margin: 0;
                  font-size: 12px;
                  line-height: 21px;
                  word-break: break-all;
                  overflow-wrap: anywhere;
                "
              >
                <a
                  href="${safeUrl}"
                  target="_blank"
                  style="
                    color: #A44732;
                    text-decoration: underline;
                    word-break: break-all;
                    overflow-wrap: anywhere;
                  "
                >${safeUrl}</a>
              </p>

            </td>
          </tr>

          <!-- Footer divider -->
          <tr>
            <td
              height="1"
              bgcolor="#EAE6E0"
              style="
                height: 1px;
                margin-top: 0;
                padding-top: 30px;
                border-bottom: 1px solid #EAE6E0;
                font-size: 0;
                line-height: 1px;
              "
            >&nbsp;</td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 0 0 0;">

              <p
                style="
                  margin: 0;
                  color: #777166;
                  font-size: 12px;
                  line-height: 21px;
                "
              >
                If you didn't request a password reset, you can safely ignore
                this email. Your password won't change unless you use the link
                above.
              </p>

              <p
                style="
                  margin: 18px 0 0 0;
                  color: #777166;
                  font-size: 11px;
                  line-height: 18px;
                "
              >
                &copy; ${year} QR Menu
              </p>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });

  if (error) {
    console.error("Resend password reset email failed:", error);
    throw new Error("Failed to send password reset email");
  }
}
