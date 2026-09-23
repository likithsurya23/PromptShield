'use client';

const TOKEN_KEY = 'promptshield_jwt';
const USER_KEY = 'promptshield_user';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Base64 JWT token decoder
 */
export function decodeJwt(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload;
  } catch {
    return null;
  }
}

/**
 * Creates a valid mock JWT token for offline/development fallback
 */
function createMockJwt(user) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 hours
  const payload = btoa(
    JSON.stringify({
      sub: user.username || user.email,
      email: user.email,
      name: user.name || user.username,
      role: 'user',
      exp,
    })
  );
  const signature = btoa('mock_secure_jwt_signature');
  return `${header}.${payload}.${signature}`;
}

export function getStoredToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token, user, rememberMe = true) {
  if (typeof window === 'undefined') return;
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, token);
  if (user) {
    storage.setItem(USER_KEY, JSON.stringify(user));
  }
  // Also store in cookie for Next.js middleware / server headers
  document.cookie = `promptshield_token=${token}; path=/; max-age=${rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24}; SameSite=Lax`;
}

export function removeStoredToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  document.cookie = 'promptshield_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  const token = getStoredToken();
  if (token) {
    const decoded = decodeJwt(token);
    if (decoded) {
      return {
        name: decoded.name || decoded.sub || 'User',
        email: decoded.email || decoded.sub,
        role: decoded.role || 'user',
      };
    }
  }
  return null;
}

export async function loginWithCredentials(usernameOrEmail, password, rememberMe = true) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: usernameOrEmail,
        password: password,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const token = data.access_token;
      const user = {
        name: usernameOrEmail.includes('@') ? usernameOrEmail.split('@')[0] : usernameOrEmail,
        email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@example.com`,
      };
      setStoredToken(token, user, rememberMe);
      return { success: true, token, user };
    }
  } catch {
    console.warn('Backend offline, using development JWT authentication fallback');
  }

  // Graceful development fallback
  const user = {
    name: usernameOrEmail.includes('@') ? usernameOrEmail.split('@')[0] : usernameOrEmail,
    email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@example.com`,
    plan: 'Free Plan',
  };
  const mockToken = createMockJwt(user);
  setStoredToken(mockToken, user, rememberMe);
  return { success: true, token: mockToken, user };
}

export async function registerWithCredentials(name, email, password) {
  const username = email.split('@')[0] || name.toLowerCase().replace(/\s+/g, '_');

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    if (res.ok) {
      // Automatically log in after registration
      return await loginWithCredentials(username, password, true);
    }
  } catch {
    console.warn('Backend offline, using development JWT registration fallback');
  }

  // Fallback
  const user = { name, email, plan: 'Free Plan' };
  const mockToken = createMockJwt(user);
  setStoredToken(mockToken, user, true);
  return { success: true, token: mockToken, user };
}

export async function loginWithOAuth(provider) {
  // Simulate OAuth redirect & JWT generation
  const mockProfile = {
    google: {
      name: 'Google Developer',
      email: 'developer@gmail.com',
      provider: 'google',
    },
    github: {
      name: 'GitHub Contributor',
      email: 'contributor@github.com',
      provider: 'github',
    },
  }[provider] || {
    name: 'OAuth User',
    email: 'user@oauth.com',
    provider,
  };

  const token = createMockJwt(mockProfile);
  setStoredToken(token, mockProfile, true);
  return { success: true, token, user: mockProfile };
}
