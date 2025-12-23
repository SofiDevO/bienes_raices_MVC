import { doubleCsrf } from 'csrf-csrf';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const { generateToken, doubleCsrfProtection } = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET,
    cookieName: "x-csrf-token",
    cookieOptions: {
        httpOnly: true,
        sameSite: "lax", 
        secure: process.env.NODE_ENV === 'production',
    },
    size: 64,
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
});

export { generateToken, doubleCsrfProtection };