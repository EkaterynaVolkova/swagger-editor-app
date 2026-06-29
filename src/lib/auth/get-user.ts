import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase/admin';

export async function getUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get('__session')?.value;

  if (!session) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(session, true);
    return decoded;
  } catch {
    return null;
  }
}
