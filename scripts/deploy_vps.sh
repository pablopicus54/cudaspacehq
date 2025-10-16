#!/usr/bin/env bash

# CudaspaceHQ VPS deploy script
# Sets up Node, PM2, Nginx, pulls repo, builds frontend/backend, and starts services

set -euo pipefail

# Defaults (override with flags: --api-domain, --web-domain, --www-domain)
API_DOMAIN="api.cudaspace.com"
WEB_DOMAIN="cudaspace.com"
WWW_DOMAIN="www.cudaspace.com"
REPO_URL="https://github.com/pablopicus54/cudaspacehq.git"
APP_DIR="/var/www/cudaspacehq"
BACKEND_DIR="cudaspace-backend-main"
FRONTEND_DIR="cudaspace-frontend-main"

print_usage() {
  cat <<EOF
Usage: $0 [--api-domain DOMAIN] [--web-domain DOMAIN] [--www-domain DOMAIN]

Examples:
  sudo bash $0 --api-domain api.cudaspace.com --web-domain cudaspace.com --www-domain www.cudaspace.com

Notes:
  - Ensure DNS A records for the domains point to this VPS before enabling SSL.
  - The script will copy .env.production.example to .env in both apps. Edit them with your secrets.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --api-domain)
      API_DOMAIN="$2"; shift 2;;
    --web-domain)
      WEB_DOMAIN="$2"; shift 2;;
    --www-domain)
      WWW_DOMAIN="$2"; shift 2;;
    -h|--help)
      print_usage; exit 0;;
    *)
      echo "Unknown argument: $1"; print_usage; exit 1;;
  esac
done

require_root() {
  if [[ $EUID -ne 0 ]]; then
    echo "Please run as root (use sudo)."; exit 1
  fi
}

install_packages() {
  echo "Updating apt index and installing system packages..."
  apt-get update -y
  apt-get install -y git curl build-essential nginx software-properties-common ca-certificates lsb-release gnupg

  if ! command -v node >/dev/null 2>&1; then
    echo "Installing Node.js 20.x via NodeSource..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
  else
    echo "Node.js already installed: $(node -v)"
  fi

  if ! command -v pm2 >/dev/null 2>&1; then
    npm install -g pm2
  fi
}

clone_or_update_repo() {
  echo "Preparing app directory at $APP_DIR..."
  mkdir -p "$APP_DIR"
  cd "$APP_DIR"
  if [[ -d .git ]]; then
    echo "Repo exists, pulling latest..."
    git pull --rebase
  else
    echo "Cloning repo: $REPO_URL"
    git clone "$REPO_URL" .
  fi
}

prepare_envs() {
  echo "Ensuring env files from templates..."
  pushd "$APP_DIR/$BACKEND_DIR" >/dev/null
  if [[ ! -f .env ]]; then
    cp .env.production.example .env
    sed -i "s|^PORT=.*|PORT=5002|" .env
  fi
  mkdir -p uploads public
  popd >/dev/null

  pushd "$APP_DIR/$FRONTEND_DIR" >/dev/null
  if [[ ! -f .env ]]; then
    cp .env.production.example .env
  fi
  popd >/dev/null

  echo "IMPORTANT: Edit $APP_DIR/$BACKEND_DIR/.env and $APP_DIR/$FRONTEND_DIR/.env with real secrets before going live."
}

install_build_start_apps() {
  echo "Installing and building backend..."
  pushd "$APP_DIR/$BACKEND_DIR" >/dev/null
  npm install
  npm run build
  pm2 delete cudaspace-api || true
  pm2 start dist/server.js --name cudaspace-api
  popd >/dev/null

  echo "Installing and building frontend..."
  pushd "$APP_DIR/$FRONTEND_DIR" >/dev/null
  npm install
  npm run build
  pm2 delete cudaspace-web || true
  pm2 start npm --name cudaspace-web -- start -- -p 3001
  popd >/dev/null

  pm2 save
}

write_nginx_configs() {
  echo "Writing Nginx server blocks..."
  API_CONF_PATH="/etc/nginx/sites-available/${API_DOMAIN}"
  WEB_CONF_PATH="/etc/nginx/sites-available/${WEB_DOMAIN}"

  cat > "$API_CONF_PATH" <<EOF
server {
  listen 80;
  server_name ${API_DOMAIN};

  # Proxy API and websockets to backend
  location / {
    proxy_pass http://127.0.0.1:5002;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host \$host;
    proxy_cache_bypass \$http_upgrade;
  }

  location /socket.io/ {
    proxy_pass http://127.0.0.1:5002;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host \$host;
    proxy_cache_bypass \$http_upgrade;
  }
}
EOF

  cat > "$WEB_CONF_PATH" <<EOF
server {
  listen 80;
  server_name ${WEB_DOMAIN} ${WWW_DOMAIN};

  # Proxy Next.js app
  location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host \$host;
    proxy_cache_bypass \$http_upgrade;
  }
}
EOF

  ln -sf "$API_CONF_PATH" "/etc/nginx/sites-enabled/${API_DOMAIN}"
  ln -sf "$WEB_CONF_PATH" "/etc/nginx/sites-enabled/${WEB_DOMAIN}"

  nginx -t
  systemctl reload nginx || service nginx reload || true
}

enable_ssl_certbot() {
  echo "Attempting SSL via Certbot (requires DNS A records to this server)..."
  apt-get install -y certbot python3-certbot-nginx || true
  # Try to obtain/renew certs for both domains
  certbot --nginx -d "$API_DOMAIN" -d "$WEB_DOMAIN" -d "$WWW_DOMAIN" --non-interactive --agree-tos -m "admin@${WEB_DOMAIN}" || true
}

post_install_summary() {
  cat <<EOF

Deployment complete (HTTP). Next steps:

1) Edit envs:
   - Backend: $APP_DIR/$BACKEND_DIR/.env (DB URL, JWT secrets, Stripe keys, SMTP, etc.)
   - Frontend: $APP_DIR/$FRONTEND_DIR/.env (API base, socket URL, Stripe publishable key, NextAuth secret)

2) Restart services after editing:
   pm2 restart cudaspace-api cudaspace-web && pm2 save

3) Point DNS A records:
   - ${API_DOMAIN} -> VPS IP
   - ${WEB_DOMAIN} and ${WWW_DOMAIN} -> VPS IP

4) Enable SSL:
   sudo certbot --nginx -d ${API_DOMAIN} -d ${WEB_DOMAIN} -d ${WWW_DOMAIN}

5) Stripe webhook (in Stripe Dashboard):
   - Endpoint URL: https://${API_DOMAIN}/api/v1/package/webhooks/stripe
   - Secret: STRIPE_WEBHOOK_SECRET (set in backend .env)

PM2 status:
   pm2 ls

Nginx test:
   nginx -t && systemctl reload nginx

If backend fails to start, check logs:
   pm2 logs cudaspace-api --lines 100
EOF
}

main() {
  require_root
  install_packages
  clone_or_update_repo
  prepare_envs
  install_build_start_apps
  write_nginx_configs
  post_install_summary
}

main "$@"