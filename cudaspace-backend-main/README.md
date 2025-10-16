# API Documentation

### API Documentation With Example(Postman) : 

## Table of Contents
- [Auth Routes](#auth-routes)


## Auth Routes
- **POST /auth/login**: Login a user
- **POST /auth/logout**: Logout a user
- **GET /auth/get-me**: Retrieve the profile of the logged-in user
- **PUT /auth/change-password**: Change the password of the logged-in user
- **POST /auth/forgot-password**: Initiate password reset process
- **POST /auth/reset-password**: Complete password reset process

## Deployment Notes

- Do not commit `.env` files. This repo ignores `.env` and `.env.*` by default.
- Use the template to create your env:

```bash
cp .env.production.example .env
# fill values (DB url, JWT secrets, Stripe keys, SMTP, etc.)
```

- Build and run:

```bash
npm run build
npm run start
```

- Nginx should proxy `api.cudaspace.com` to `localhost:5002` with SSL and websocket headers.
