// In production (Vercel), we use relative paths ('') so calls go to /api/.. on the same domain
// In development, we use localhost:5000
const isProduction = process.env.NODE_ENV === 'production';
export const API_URL = isProduction ? '' : 'http://localhost:5000';
