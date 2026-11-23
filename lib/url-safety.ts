/**
 * Safe Relative Return URL Validator for VCEP
 * Enforces an internal relative-path policy to prevent open-redirect vulnerabilities.
 */
export function safeRelativeReturnPath(raw: string | null | undefined): string {
  if (!raw || typeof raw !== 'string') return '/';
  const trimmed = raw.trim();

  // Must begin with a single '/' and not '//' or '/\\' (protocol-relative URL)
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.startsWith('/\\')) {
    return '/';
  }

  // Reject strings containing a URI protocol scheme (e.g. javascript:, http:, data:)
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return '/';
  }

  // Reject backslashes anywhere in path
  if (trimmed.includes('\\')) {
    return '/';
  }

  try {
    const dummyOrigin = 'https://vcep.internal';
    const parsed = new URL(trimmed, dummyOrigin);

    // Origin must strictly match the dummy origin
    if (parsed.origin !== dummyOrigin) {
      return '/';
    }

    // Never redirect in a loop back to signin or signout
    if (parsed.pathname === '/signin' || parsed.pathname === '/signout') {
      return '/';
    }

    // Return sanitized path, query parameters, and hash
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return '/';
  }
}
