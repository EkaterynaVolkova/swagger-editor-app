import 'server-only';

import type { DecodedIdToken } from 'firebase-admin/auth';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';

export type RequestHistoryEntry = {
  id: string;
  duration: number;
  statusCode: number;
  timestamp: string;
  method: string;
  requestSize: number;
  responseSize: number;
  errorDetails: string | null;
  endpoint: string;
};

export type RequestAnalytics = Omit<RequestHistoryEntry, 'id' | 'timestamp'>;

function toHistoryEntry(document: QueryDocumentSnapshot<DocumentData>): RequestHistoryEntry {
  const data = document.data();
  const timestamp = data.timestamp?.toDate?.();

  return {
    id: document.id,
    duration: data.duration,
    statusCode: data.statusCode,
    timestamp: timestamp instanceof Date ? timestamp.toISOString() : new Date(0).toISOString(),
    method: data.method,
    requestSize: data.requestSize,
    responseSize: data.responseSize,
    errorDetails: data.errorDetails ?? null,
    endpoint: data.endpoint,
  };
}

export async function recordRequestAnalytics(user: DecodedIdToken, analytics: RequestAnalytics) {
  const [{ adminDb }, { FieldValue }] = await Promise.all([
    import('@/lib/firebase/admin'),
    import('firebase-admin/firestore'),
  ]);

  await adminDb
    .collection('users')
    .doc(user.uid)
    .collection('requestHistory')
    .add({
      ...analytics,
      timestamp: FieldValue.serverTimestamp(),
    });
}

export async function getRequestHistory(userId: string): Promise<RequestHistoryEntry[]> {
  const { adminDb } = await import('@/lib/firebase/admin');
  const snapshot = await adminDb
    .collection('users')
    .doc(userId)
    .collection('requestHistory')
    .orderBy('timestamp', 'desc')
    .get();

  return snapshot.docs.map(toHistoryEntry);
}

export async function getRequestAnalytics(
  userId: string,
  requestId: string
): Promise<RequestHistoryEntry | null> {
  const { adminDb } = await import('@/lib/firebase/admin');
  const document = await adminDb
    .collection('users')
    .doc(userId)
    .collection('requestHistory')
    .doc(requestId)
    .get();

  return document.exists ? toHistoryEntry(document as QueryDocumentSnapshot<DocumentData>) : null;
}
