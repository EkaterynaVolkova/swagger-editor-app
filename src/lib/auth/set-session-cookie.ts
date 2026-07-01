export async function setSessionCookie(token: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken: token }),
  });

  if (!response.ok) {
    throw new Error('Failed to set session cookie');
  }
}
