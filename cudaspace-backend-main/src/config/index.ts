import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.join(process.cwd(), ".env")});

export default {
    env: process.env.NODE_ENV,
    frontend_url: process.env.FRONTEND_URL,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
    stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
    stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
    port: process.env.PORT || 5001,
    verify_email: process.env.EMAIL,
    backend_image_url: process.env.BACKEND_IMAGE_URL,
    jwt: {
        jwt_secret: process.env.JWT_SECRET,
        expires_in: process.env.EXPIRES_IN,
        refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
        refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
        reset_pass_secret: process.env.RESET_PASS_TOKEN,
        reset_pass_token_expires_in: process.env.RESET_PASS_TOKEN_EXPIRES_IN,
    },
    reset_pass_link: process.env.RESET_PASS_LINK,
    emailSender: {
        email: process.env.EMAIL,
        app_pass: process.env.APP_PASS,
    },
    smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
        secure: process.env.SMTP_SECURE === 'true',
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        from_email: process.env.SMTP_FROM_EMAIL || process.env.EMAIL,
        from_name: process.env.SMTP_FROM_NAME || 'Cudaspace',
    },
    paypal: {
        client_id: process.env.PAYPEL_CLIENT_ID,
        client_secret: process.env.PAYPAL_CLIENT_SECRET,
        mode: process.env.PAYPAL_MODE,
    },
    sendGrid: {
        api_key: process.env.SENDGRID_API_KEY,
        email_from: process.env.SENDGRID_EMAIL,
    },
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
        bucketName: process.env.AWS_BUCKET_NAME,
    },
    password: {
        password_salt: process.env.PASSWORD_SALT
    },
    superadmin: {
        email: process.env.SUPERADMIN_EMAIL,
        password: process.env.SUPERADMIN_PASSWORD,
        name: process.env.SUPERADMIN_NAME,
        number: process.env.SUPERADMIN_NUMBER,
    },
};