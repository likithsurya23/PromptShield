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
  // Cookie for Next.js routing / server-side verification
  document.cookie = `promptshield_token=${token}; path=/; max-age=${rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24}; SameSite=Lax`;
}

export function removeStoredToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('promptshield_profile_settings');
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  document.cookie = 'promptshield_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  window.dispatchEvent(new CustomEvent('promptshield:profile_updated', { detail: null }));
}

/**
 * Permanently delete the user account and associated information from database
 */
export async function deleteAccount() {
  const token = getStoredToken();
  let serverMessage = '';

  if (token) {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        serverMessage = data.message;
      }
    } catch (e) {
      console.warn('Backend delete account error:', e);
    }
  }

  // Purge all user tokens, cookies, and local profile data
  removeStoredToken();
  if (typeof window !== 'undefined') {
    localStorage.removeItem('promptshield_profile_settings');
    localStorage.removeItem('promptshield_api_settings');
    localStorage.removeItem('promptshield_risk_settings');
    localStorage.removeItem('promptshield_notifications_settings');
    localStorage.removeItem('promptshield_active_apikeys');
    sessionStorage.clear();
    window.dispatchEvent(new CustomEvent('promptshield:profile_updated', { detail: null }));
  }

  return {
    success: true,
    message: serverMessage || 'Account and all associated records have been permanently deleted from database.',
  };
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
        username: decoded.username || decoded.sub || decoded.name || '',
        name: decoded.name || decoded.username || decoded.sub || '',
        email: decoded.email || (decoded.sub?.includes('@') ? decoded.sub : ''),
        role: decoded.role || '',
      };
    }
  }
  return null;
}

/**
 * Authenticate with username or email and password against backend database
 */
export async function loginWithCredentials(usernameOrEmail, password, rememberMe = true) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: usernameOrEmail.trim(),
        password: password,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const token = data.access_token;
      let user = {
        username: usernameOrEmail,
        name: usernameOrEmail,
        email: usernameOrEmail.includes('@') ? usernameOrEmail : '',
        role: 'user',
      };

      // Fetch authentic user profile from backend /auth/me
      try {
        const meRes = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (meRes.ok) {
          const meData = await meRes.json();
          user = {
            username: meData.username || usernameOrEmail,
            name: meData.name || meData.username || usernameOrEmail,
            email: meData.email || (usernameOrEmail.includes('@') ? usernameOrEmail : ''),
            role: meData.role || 'user',
          };
        }
      } catch (meErr) {
        console.warn('Could not reach /auth/me', meErr);
      }

      setStoredToken(token, user, rememberMe);

      // Save real user profile to local cache
      if (typeof window !== 'undefined') {
        const initials = user.username
          ? user.username
              .split(' ')
              .filter(Boolean)
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
          : '';

        const profile = {
          username: user.username,
          name: user.name || user.username,
          email: user.email,
          initials,
          role: user.role || 'user',
        };
        localStorage.setItem('promptshield_profile_settings', JSON.stringify(profile));
        window.dispatchEvent(new CustomEvent('promptshield:profile_updated', { detail: profile }));
      }

      return { success: true, token, user };
    } else {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.detail || 'Incorrect username or password.' };
    }
  } catch (err) {
    console.error('Login error:', err);
    return { success: false, error: 'Unable to reach backend authentication server. Ensure backend is running.' };
  }
}

/**
 * Register a new user in backend database
 */
export async function registerWithCredentials(username, email, password) {
  const cleanUsername = (username || '').trim();
  const cleanEmail = (email || '').trim();

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: cleanUsername || undefined,
        name: cleanUsername || cleanEmail.split('@')[0],
        email: cleanEmail,
        password,
      }),
    });

    if (res.ok) {
      // Auto-login upon successful registration to establish session
      return await loginWithCredentials(cleanEmail || cleanUsername, password);
    } else {
      const errData = await res.json().catch(() => ({}));
      return { success: false, error: errData.detail || 'Registration failed.' };
    }
  } catch (err) {
    console.error('Registration error:', err);
    return { success: false, error: 'Could not connect to authentication server.' };
  }
}

/**
 * Updates user profile (username, name, email) in MongoDB database
 */
export async function updateUserProfile({ username, name, email }) {
  const token = getStoredToken();
  if (!token) {
    throw new Error('Authentication required to update profile.');
  }

  const res = await fetch(`${API_BASE}/auth/me/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      username: username?.trim() || undefined,
      name: name?.trim() || undefined,
      email: email?.trim() || undefined,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to update profile.');
  }

  const data = await res.json();
  const newToken = data.access_token || token;
  const updatedUser = data.user;

  // Update storage & cookies
  setStoredToken(newToken, updatedUser, true);

  if (typeof window !== 'undefined') {
    const initials = updatedUser.username
      ? updatedUser.username
          .split(' ')
          .filter(Boolean)
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : '';
    const profile = {
      username: updatedUser.username,
      name: updatedUser.name || updatedUser.username,
      email: updatedUser.email,
      initials,
      role: updatedUser.role || 'user',
    };
    localStorage.setItem('promptshield_profile_settings', JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent('promptshield:profile_updated', { detail: profile }));
  }

  return { success: true, user: updatedUser, message: data.message };
}

/**
 * Updates user password in MongoDB database
 */
export async function updateUserPassword(currentPassword, newPassword) {
  const token = getStoredToken();
  if (!token) {
    throw new Error('Authentication required to change password.');
  }

  const res = await fetch(`${API_BASE}/auth/me/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to update password.');
  }

  const data = await res.json();
  return { success: true, message: data.message || 'Password updated successfully in database.' };
}
