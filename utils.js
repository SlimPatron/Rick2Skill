// Utility Functions für Sicherheit und Validierung

/**
 * Sanitize HTML input to prevent XSS
 */
export function sanitizeHTML(str) {
  if (typeof str !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate and sanitize user input
 */
export function sanitizeInput(input, maxLength = 1000) {
  if (typeof input !== 'string') return '';
  // Remove potentially dangerous characters
  let sanitized = input.trim()
    .replace(/[<>]/g, '') // Remove < and >
    .substring(0, maxLength);
  return sanitized;
}

/**
 * Hash password client-side (for admin panel)
 * ⚠️ NOTE: This is NOT secure for production!
 * Use proper authentication (Firebase Auth) instead!
 */
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Verify password hash
 */
export async function verifyPassword(password, hash) {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Store CSRF token in session storage
 */
export function setCSRFToken() {
  const token = generateCSRFToken();
  sessionStorage.setItem('csrf_token', token);
  return token;
}

/**
 * Get CSRF token from session storage
 */
export function getCSRFToken() {
  return sessionStorage.getItem('csrf_token');
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token) {
  const storedToken = getCSRFToken();
  return storedToken && storedToken === token;
}

