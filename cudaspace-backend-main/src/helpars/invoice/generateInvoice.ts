import fs from 'fs';
import path from 'path';
import prisma from '../../shared/prisma';
import config from '../../config';

export const generateInvoiceForOrder = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { name: true, email: true, number: true } },
      package: { select: { serviceName: true, packageType: true, perMonthPrice: true } },
    },
  });

  if (!order) return null;

  const amount = order.amount ?? order.package?.perMonthPrice ?? 0;
  const issuedDate = new Date(order.createdAt).toISOString().slice(0, 10);
  const invoiceNumber = order.orderId;
  const billedTo = order.user?.name ?? 'Customer';
  const itemName = order.package?.serviceName ?? 'Service';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invoice ${invoiceNumber}</title>
  <style>
    :root { --brand:#3257D9; --brand-2:#6E8BFF; --bg:#f7f8fb; --text:#111827; --muted:#6b7280; --border:#e5e7eb; }
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; background:var(--bg); margin:0; padding:24px; color:var(--text); }
    .card { max-width: 900px; margin:0 auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
    .header { background:linear-gradient(135deg, var(--brand), var(--brand-2)); color:#fff; padding:20px 24px; display:flex; justify-content:space-between; align-items:center; }
    .brand-wrap { display:flex; align-items:center; gap:12px; }
    .logo { width:40px; height:40px; border-radius:10px; display:inline-flex; align-items:center; justify-content:center; background:#fff1; position:relative; }
    .logo svg { display:block; }
    .brand-title { font-size:20px; font-weight:700; letter-spacing:.3px; }
    .header-right { text-align:right; }
    .header-right .small { font-size:12px; opacity:.9; }
    .section { padding:24px; }
    .two-col { display:grid; grid-template-columns: 1fr 1fr; gap:16px; }
    .panel { border:1px solid var(--border); border-radius:12px; padding:16px; background:#fafbff; }
    .panel .title { font-size:12px; text-transform:uppercase; color:var(--muted); letter-spacing:.1em; margin-bottom:8px; }
    .panel .value { font-size:14px; font-weight:600; }
    .divider { height:1px; background:var(--border); margin:16px 0; }
    table { width:100%; border-collapse: collapse; margin-top:8px; }
    th, td { text-align:left; padding:12px 10px; border-bottom:1px solid var(--border); font-size:14px; }
    th { color:var(--muted); text-transform:uppercase; font-weight:700; letter-spacing:.06em; background:#f9fafb; }
    .totals { max-width: 360px; margin-left:auto; margin-top:18px; }
    .totals .line { display:flex; justify-content:space-between; padding:8px 0; }
    .totals .line span:last-child { font-weight:600; }
    .total { border-top:1px solid var(--border); margin-top:8px; padding-top:8px; font-weight:800; }
    .footer { color:var(--muted); font-size:12px; margin-top:24px; border-top:1px solid var(--border); padding:16px 24px; display:flex; justify-content:space-between; align-items:center; }
    .footer .contact { display:flex; gap:16px; }
    .badge { display:inline-block; padding:4px 8px; border-radius:999px; background:#eef2ff; color:var(--brand); font-weight:600; font-size:12px; }
    @media print { body { background:#fff; padding:0; } .card { box-shadow:none; border-radius:0; } .panel { background:#fff; } }
  </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <div class="brand-wrap">
          <div class="logo" aria-label="CudaSpace">
            <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/200/svg">
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85"/>
                  <stop offset="100%" stop-color="#E5EDFF" stop-opacity="0.65"/>
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="28" height="28" rx="8" fill="url(#g)"/>
              <path d="M18.5 14c0 2.49-2.01 4.5-4.5 4.5S9.5 16.49 9.5 14 11.51 9.5 14 9.5c1.1 0 2.1.38 2.89 1" stroke="#1F3FD9" stroke-width="2.2" fill="none" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="brand-title">CudaSpace LLC</div>
        </div>
        <div class="header-right">
          <div class="small">Invoice</div>
          <div style="font-size:18px; font-weight:800;">#${invoiceNumber}</div>
          <div class="small">Issued on ${issuedDate}</div>
        </div>
      </div>

      <div class="section">
        <div class="two-col">
          <div class="panel">
            <div class="title">Bill From</div>
            <div class="value">CudaSpace LLC</div>
            <div>30 N Gould St #29780</div>
            <div>Sheridan, WY, 82801</div>
            <div class="divider"></div>
            <div class="value">Phone: +1 (225) 255-1510</div>
            <div>Email: support@cudaspace.com</div>
          </div>
          <div class="panel">
            <div class="title">Bill To</div>
            <div class="value">${billedTo}</div>
            ${order.user?.email ? `<div>${order.user.email}</div>` : ''}
            ${order.user?.number ? `<div>${order.user.number}</div>` : ''}
          </div>
        </div>

        <div class="panel" style="margin-top:16px;">
          <div class="title">Invoice Items</div>
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${itemName}</td>
                <td>1</td>
                <td>$${amount.toFixed(2)}</td>
                <td>$${amount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="totals">
          <div class="line"><span>Subtotal</span><span>$${amount.toFixed(2)}</span></div>
          <div class="line"><span>Tax</span><span>$0.00</span></div>
          <div class="line total"><span>Total</span><span>$${amount.toFixed(2)}</span></div>
        </div>

        <div class="footer">
          <div>
            <span class="badge">Thank you for your business</span>
          </div>
          <div class="contact">
            <span>support@cudaspace.com</span>
            <span>+1 (225) 255-1510</span>
          </div>
        </div>
      </div>
    </div>
  </body>
  </html>`;

  const dir = path.join(process.cwd(), 'uploads', 'invoices');
  fs.mkdirSync(dir, { recursive: true });

  const filename = `${orderId}.html`;
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, html, 'utf-8');

  const publicUrl = `${config.backend_image_url}/invoices/${filename}`;
  await prisma.order.update({ where: { id: orderId }, data: { invoiceUrl: publicUrl } });
  return publicUrl;
};