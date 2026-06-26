export const ROUTES = {
  HOME: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  ABOUT: '/about',
  HISTORY: '/history',
} as const;

export const PROTECTED_ROUTES = [ROUTES.HISTORY];

export const AUTH_ROUTES = [ROUTES.SIGN_IN, ROUTES.SIGN_UP];
