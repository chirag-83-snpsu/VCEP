/**
 * VCEP Edge Authentication Cryptography & Session Utilities
 * Standards-based, zero-dependency, using Web Crypto API (`crypto.subtle`).
 * Compatible with Cloudflare Workers Edge Runtime and Node.js 22+.
 */

const PBKDF2_ITERATIONS = 100_000;
const KEY_LENGTH_BITS = 256;
const SESSION_COOKIE_NAME = '__vcep_session';
const SESSION_TTL_SECONDS = 7 * 24 * 3600; // 7 days

// Helper: Convert Uint8Array to Hex string
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Helper: Convert Hex string to Uint8Array
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

/**
 * Hash a password using PBKDF2-HMAC-SHA256
 */
export async function hashPassword(
  password: string,
  saltHex?: string
): Promise<{ hash: string; salt: string }> {
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password);

  let saltBytes: Uint8Array;
  if (saltHex) {
    saltBytes = hexToBytes(saltHex);
  } else {
    saltBytes = new Uint8Array(16);
    crypto.getRandomValues(saltBytes);
  }

  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordBytes,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    KEY_LENGTH_BITS
  );

  const hash = bytesToHex(new Uint8Array(derivedBits));
  const salt = bytesToHex(saltBytes);
  return { hash, salt };
}

/**
 * Verify a password against salt and expected hash in constant time
 */
export async function verifyPassword(
  password: string,
  saltHex: string,
  expectedHashHex: string
): Promise<boolean> {
  const { hash } = await hashPassword(password, saltHex);
  if (hash.length !== expectedHashHex.length) return false;

  // Constant-time comparison
  let result = 0;
  for (let i = 0; i < hash.length; i++) {
    result |= hash.charCodeAt(i) ^ expectedHashHex.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Generate a cryptographically secure random token and its SHA-256 hash
 */
export async function generateInvitationToken(prefix = 'vcep_act_'): Promise<{
  token: string;
  tokenHash: string;
}> {
  const randomBytes = new Uint8Array(24);
  crypto.getRandomValues(randomBytes);
  const rawToken = Array.from(randomBytes)
    .map((b) => b.toString(36))
    .join('')
    .slice(0, 32);
  const token = `${prefix}${rawToken}`;
  const tokenHash = await hashToken(token);
  return { token, tokenHash };
}

/**
 * Hash a token using SHA-256
 */
export async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(token));
  return bytesToHex(new Uint8Array(digest));
}

/**
 * Parse HTTP Cookie header into key-value pairs
 */
export function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};
  const cookies: Record<string, string> = {};
  for (const part of cookieHeader.split(';')) {
    const [rawKey, ...rawVal] = part.trim().split('=');
    if (rawKey) {
      cookies[rawKey.trim()] = decodeURIComponent(rawVal.join('=').trim());
    }
  }
  return cookies;
}

/**
 * Extract VCEP session token from cookie header
 */
export function getSessionTokenFromCookie(cookieHeader: string | null): string | null {
  const cookies = parseCookies(cookieHeader);
  return cookies[SESSION_COOKIE_NAME] || null;
}

/**
 * Build a Set-Cookie header for an authenticated session
 */
export function buildSessionCookie(
  sessionId: string,
  maxAge = SESSION_TTL_SECONDS,
  secure = true
): string {
  const flags = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(sessionId)}`,
    'Path=/',
    `Max-Age=${maxAge}`,
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (secure) {
    flags.push('Secure');
  }
  return flags.join('; ');
}

/**
 * Build a Set-Cookie header that invalidates the session cookie
 */
export function buildClearSessionCookie(secure = true): string {
  const flags = [
    `${SESSION_COOKIE_NAME}=`,
    'Path=/',
    'Max-Age=0',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (secure) {
    flags.push('Secure');
  }
  return flags.join('; ');
}

export { SESSION_COOKIE_NAME, SESSION_TTL_SECONDS };
