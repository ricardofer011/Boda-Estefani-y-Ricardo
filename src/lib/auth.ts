import crypto from 'crypto';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'wedding_admin_session';
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'EstefaniRicardo2026';

export function signToken(data: string): string {
  const hmac = crypto.createHmac('sha256', ADMIN_SECRET);
  hmac.update(data);
  const signature = hmac.digest('hex');
  return `${data}.${signature}`;
}

export function verifyToken(token: string): boolean {
  if (!token || !token.includes('.')) return false;
  const [data, signature] = token.split('.');
  const hmac = crypto.createHmac('sha256', ADMIN_SECRET);
  hmac.update(data);
  const expectedSig = hmac.digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig));
}

export async function isUserAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!sessionCookie || !sessionCookie.value) return false;
  return verifyToken(sessionCookie.value);
}

export { SESSION_COOKIE_NAME };
