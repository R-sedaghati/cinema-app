import dotenv from 'dotenv';

dotenv.config();

export const configs = {
    dbPort: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbUrl: process.env.DATABASE_URL,
    hostPort: process.env.PORT,
    adminJwtSecret: process.env.ADMIN_JWT_SECRET || 'hello',
    userJwtSecret: process.env.USER_JWT_SECRET || 'hello',
    jwtExpireTime: Number(process.env.JWT_EXPIRE_TIME) || 3600*24,
    kavenegarApiKey: process.env.KAVENEGAR_API_KEY,
    redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
    kavenegarTemplate: process.env.KAVENEGAR_TEMPLATE || "login_template",
    minioEndpoint: process.env.MINIO_ENDPOINT,
    minioPort: process.env.MINIO_PORT,
    minioUseSSL: process.env.MINIO_USE_SSL === "true",
    minioAccessKey: process.env.MINIO_ACCESS_KEY,
    minioSecretKey: process.env.MINIO_SECRET_KEY,
    minioBucketName: String(process.env.MINIO_BUCKET_NAME),
    melliPayamakUsername: process.env.MELLI_PAYAMAK_USERNAME,
    melliPayamakPassword: process.env.MELLI_PAYAMAK_PASSWORD,
    melliPayamakSender: process.env.MELLI_PAYAMAK_SENDER || "50004000004",
    appUrl: process.env.APP_URL || "http://localhost:3000",
    gatewayConfiguration: {
        name: "zarinpal",
        merchantId: String(process.env.ZARINPAL_MERCHANT_ID),
        sandbox: process.env.NODE_ENV !== 'production',
    },
    otpRateLimitAttempts: Number(process.env.OTP_RATE_LIMIT_ATTEMPTS) || 2,
    minioCustomDomain: process.env.MINIO_CUSTOM_DOMAIN,
    adminPhoneNumber: process.env.ADMIN_PHONE_NUMBER || '09107901726',
};