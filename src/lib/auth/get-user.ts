import { cookies } from 'next/headers';

export async function getUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get('__session')?.value;

  if (!session) return null;

  try {
    const { adminAuth } = await import('@/lib/firebase/admin');
    const decoded = await adminAuth.verifySessionCookie(session, true);
    return decoded;
  } catch {
    return null;
  }
}
