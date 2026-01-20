export function normalizeUsername(username) {
  if (typeof username !== "string") return "";

  let normalized = username.normalize("NFKC");
  
  normalized = normalized.trim();
  
  normalized = normalized.replace(/[\u200B-\u200D\uFEFF]/g, '');
  
  normalized = normalized.toLowerCase();
  
  return normalized;
}

export function normalizeAggressively(username) {
  if (typeof username !== "string") return "";

  let normalized = username.normalize("NFKD");
  
  normalized = normalized.replace(/\p{M}/gu, '');
  
  normalized = normalized.replace(/[\u200B-\u200D\uFEFF\u180E\u2060-\u2069\u202A-\u202E\uFFF9-\uFFFB]/g, '');
  
  normalized = normalized.replace(/\s+/g, ' ');
  
  normalized = normalized.trim();
  
  normalized = normalized.toLowerCase();
  
  return normalized;
}

export function stripAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function toASCII(str) {
  return str.replace(/[^\x00-\x7F]/g, '');
}

export function removeSpecialChars(str) {
  return str.replace(/[^a-zA-Z0-9]/g, '');
}

export function normalizeWhitespace(str) {
  return str
    .replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}