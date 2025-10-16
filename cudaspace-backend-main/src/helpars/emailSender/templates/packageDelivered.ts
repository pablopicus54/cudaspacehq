export const buildPackageDeliveredEmail = (params: {
  userName?: string;
  orderId: string;
  packageName?: string;
  overviewUrl: string;
}) => {
  const { userName, orderId, packageName, overviewUrl } = params;
  const safeUserName = userName || "Customer";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Package Delivered</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background-color: #f6f9fc; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #FF7600, #45a049); padding: 24px 20px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 22px; font-weight: 600; }
    .content { padding: 24px 20px; color: #333; }
    .content p { margin: 0 0 12px; font-size: 15px; }
    .card { background: #f9fafb; border: 1px solid #eef2f7; border-radius: 10px; padding: 16px; margin: 16px 0; }
    .label { color: #6b7280; font-size: 13px; }
    .value { color: #111827; font-size: 15px; font-weight: 600; }
    .cta { display: inline-block; margin-top: 8px; background: #2563eb; color: #fff !important; text-decoration: none; padding: 12px 16px; border-radius: 8px; font-weight: 600; }
    .footer { padding: 16px 20px; color: #6b7280; font-size: 12px; text-align: center; border-top: 1px solid #eef2f7; }
  </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Your package has been delivered</h1>
      </div>
      <div class="content">
        <p>Hi ${safeUserName},</p>
        <p>Great news! Your package${packageName ? ` <strong>${packageName}</strong>` : ''} is now live and ready.
           You can view its overview and access all details using the button below.</p>

        <div class="card">
          <div class="label">Order ID</div>
          <div class="value">${orderId}</div>
        </div>

        <a class="cta" href="${overviewUrl}" target="_blank" rel="noopener noreferrer">Open Package Overview</a>

        <p style="margin-top:16px">If you didn’t expect this email, please contact support.</p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} Cudaspace. All rights reserved.
      </div>
    </div>
  </body>
</html>`;
};

export default buildPackageDeliveredEmail;