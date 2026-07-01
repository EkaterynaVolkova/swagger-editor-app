'use client';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { setSessionCookie } from '@/lib/auth/set-session-cookie';

export default function TestAuthPage() {
  const handleTestLogin = async () => {
    try {
      // 1. Authenticate using the test user created in Firebase Console
      const userCredential = await signInWithEmailAndPassword(auth, 'test@test.com', '123456');
      const token = await userCredential.user.getIdToken();

      // 2. Send the token to the API route to set the httpOnly cookie
      await setSessionCookie(token);

      alert('Success! The authentication cookie has been set. Now try navigating to /history');
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert('Login failed: ' + error.message);
      } else {
        alert('An unknown error occurred during login.');
      }
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>Firebase Authentication Test Page</h2>
      <p style={{ color: '#6B7280', fontSize: '14px' }}>
        Use this button to mock a successful login session using the test credentials.
      </p>
      <button
        onClick={handleTestLogin}
        style={{
          padding: '10px 20px',
          background: '#4F46E5',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px',
          fontWeight: '600',
        }}
      >
        Log In with Test Account
      </button>
    </div>
  );
}
