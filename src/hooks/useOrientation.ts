'use client';

import { useSyncExternalStore } from 'react';

const subscribe = (callback: () => void) => {
  const mediaQuery = window.matchMedia('(orientation: landscape)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
};

const getSnapshot = () => window.matchMedia('(orientation: landscape)').matches;

const getServerSnapshot = () => true; // SSR fallback

export function useOrientation() {
  const isLandscape = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    isLandscape,
    isPortrait: !isLandscape,
  };
}
