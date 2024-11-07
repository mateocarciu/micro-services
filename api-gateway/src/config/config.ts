import dotenv from 'dotenv';

dotenv.config();

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    console.error(`Environment variable ${name} is required`);
    process.exit(1);
  }
  return value;
};

export const config = {
  services: {
    user: {
      url: process.env.USER_SERVICE_URL || 'http://localhost:3001',
      apiKey: requireEnv('USER_SERVICE_API_KEY'),
    },
  },
  jwt: {
    secret: requireEnv('JWT_SECRET'),
  },
  database: {
    url: requireEnv('MONGODB_URI'),
  }
};
