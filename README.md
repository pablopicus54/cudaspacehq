# cudaspacehq

Production deployment on a VPS can be performed with a single script that installs dependencies, pulls this repo, builds both apps, starts them via PM2, and configures Nginx.

Quick start (assumes Ubuntu/Debian VPS and proper DNS):

```
sudo bash scripts/deploy_vps.sh \
  --api-domain api.cudaspace.com \
  --web-domain cudaspace.com \
  --www-domain www.cudaspace.com
```

What it does:
- Installs Node.js 20.x, PM2, Nginx
- Clones/pulls this repo into `/var/www/cudaspacehq`
- Copies `.env.production.example` to `.env` for both apps (edit with real secrets)
- Builds backend and frontend, starts them with PM2
- Writes Nginx server blocks for API (`api.cudaspace.com`) and web (`cudaspace.com`, `www.cudaspace.com`)

Post‑install steps:
- Edit `cudaspace-backend-main/.env` with real values (DB URL, JWT secrets, Stripe keys, SMTP, etc.)
- Edit `cudaspace-frontend-main/.env` (API base, socket URL, Stripe publishable key, NextAuth secret)
- Restart services: `pm2 restart cudaspace-api cudaspace-web && pm2 save`
- Point DNS A records for your domains to the VPS IP and run Certbot: `sudo certbot --nginx -d api.cudaspace.com -d cudaspace.com -d www.cudaspace.com`
- In Stripe Dashboard, set webhook endpoint to `https://api.cudaspace.com/api/v1/package/webhooks/stripe` and use your `STRIPE_WEBHOOK_SECRET`

Nginx templates are available in `scripts/nginx/` for manual configuration if needed.