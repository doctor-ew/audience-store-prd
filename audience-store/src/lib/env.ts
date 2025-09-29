import crypto from 'crypto';

const getNextAuthSecret = () => {
  let secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'development') {
      secret = crypto.randomBytes(32).toString('hex');
      console.warn(
        '⚠️ NEXTAUTH_SECRET not set in development, using random secret. Please set a permanent secret in your .env file for production.',
      );
    } else {
      throw new Error('NEXTAUTH_SECRET is not set in production.');
    }
  }
  return secret;
};

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  NEXTAUTH_SECRET: getNextAuthSecret(),
};
