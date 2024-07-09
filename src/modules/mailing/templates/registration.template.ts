import mjml2html = require('mjml');

export const generateEmailTemplate = (
  username: string,
  verificationLink: string,
) => {
  const template = mjml2html(`
    <mjml>
      <mj-head>
        <mj-title>Verify Your Email</mj-title>
        <mj-preview>Click the button below to verify your email address.</mj-preview>
        <mj-attributes>
          <mj-all font-family="Arial, sans-serif" />
          <mj-text font-size="16px" color="#333" />
          <mj-button background-color="#4CAF50" color="white" border-radius="5px" padding="20px" />
        </mj-attributes>
      </mj-head>
      <mj-body>
        <mj-section background-color="#f4f4f4" padding="20px 0">
          <mj-column width="600px">
            <mj-image width="100px" src="https://yourlogo.com/logo.png" alt="Logo" />
            <mj-text font-size="20px" font-weight="bold" align="center">Verify Your Email Address</mj-text>
            <mj-text>
              Hi ${username},
            </mj-text>
            <mj-text>
              Thanks for registering with us! Please verify your email address by clicking the button below.
            </mj-text>
            <mj-button href="${verificationLink}">Verify Email</mj-button>
            <mj-text>
              If you did not create an account, please ignore this email.
            </mj-text>
            <mj-text>
              Best regards,<br/>
              Your Company
            </mj-text>
          </mj-column>
        </mj-section>
        <mj-section background-color="#f4f4f4" padding="10px 0">
          <mj-column width="600px">
            <mj-text font-size="12px" color="#999" align="center">
              &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `);

  return template.html;
};
