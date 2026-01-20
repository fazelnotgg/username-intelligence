import { deLeet } from "../utils/text.js";
import { PROFANITY_WORDS, PROFANITY_PATTERNS, TOXIC_PHRASES, HATE_SPEECH, SEXUAL_CONTENT, DRUG_CONTENT, VIOLENCE_CONTENT } from "../data/profanity.js";
import { PRIVILEGED_KEYWORDS, GOVERNMENT_KEYWORDS } from "../data/brands.js";

export function detectPatterns(username) {
  const patterns = [];
  const lower = username.toLowerCase();
  const normalized = deLeet(lower);
  const chars = [...username];

  if (/^(?:19|20)\d{2}$/.test(username) || /(?:19|20)\d{2}$/.test(username)) {
    patterns.push("year-indicator");
  }
  
  if (/^[a-z]+[._-]?\d{4,}$/i.test(username)) {
    patterns.push("generated-style");
  }

  if (username.includes("@") && /\.(com|net|org|edu|gov|mil|co|io|ai|me|tv|biz|info|xyz|app|dev|tech|online|site|store|shop|cloud|digital|web|pro|mobi|name|tel|asia|eu|us|uk|ca|au|de|fr|jp|cn|ru|br|in|kr|mx|it|es|nl|se|no|dk|fi|pl|be|ch|at|cz|gr|pt|ro|hu|ie|za|nz|sg|hk|tw|th|my|ph|vn|id|ae|sa|eg|pk|bd|ng|ke|gh|tz|ug|zm|zw|bw|mw|sz|ls|na|ao|mz|cd|cg|ga|cm|ci|sn|ml|bf|ne|td|cf|gn|sl|lr|gm|gw|mr|st|cv|km|sc|mu|mg|re|yt|tf|sh|pm|wf|pf|nc|vu|fj|ki|sb|to|ws|sm|as|gu|mp|pw|fm|mh|nr|tv|tk|nu|ck|pn)$/i.test(username)) {
    patterns.push("email-format");
  }

  if (/^[a-z0-9]+[._][a-z0-9]+$/i.test(username) && !username.includes("@")) {
    patterns.push("separator-style");
  }

  if (/(.)\1{2,}/.test(username)) {
    patterns.push("repeated-character");
  }

  if (/(.{2,})\1{2,}/.test(username)) {
    patterns.push("repeated-pattern");
  }

  if (
    (username.startsWith("xX") && username.endsWith("Xx")) ||
    (username.startsWith("XX") && username.endsWith("XX")) ||
    (username.startsWith("zz") && username.endsWith("zz")) ||
    (username.startsWith("its") || username.startsWith("im")) ||
    /^(the|pro|mr|ms|dr|sir|lord|lady|king|queen)[_-]?/i.test(username)
  ) {
    patterns.push("gamer-style");
  }
  
  for (const keyword of PRIVILEGED_KEYWORDS) {
    if (normalized.includes(keyword)) {
      patterns.push("privileged-keyword");
      break;
    }
  }

  for (const keyword of GOVERNMENT_KEYWORDS) {
    if (normalized.includes(keyword)) {
      patterns.push("government-keyword");
      break;
    }
  }

  if (/https?:\/\/|www\.|ftp:\/\//i.test(username)) {
    patterns.push("url-pattern");
  }

  if (/\.(exe|bat|cmd|sh|ps1|vbs|jar|app|dmg|apk|deb|rpm|msi|pkg|bin|run|dll|so|dylib)/i.test(username)) {
    patterns.push("executable-extension");
  }

  if (/qwerty|asdfgh|zxcvbn|123456|password|qazwsx|12345678|abc123|iloveyou|welcome|monkey|dragon|master|sunshine|princess|login|admin123|letmein|football|baseball|trustno1/i.test(normalized)) {
    patterns.push("keyboard-walk");
  }

  if (/\+?\d{10,15}/.test(username)) {
    patterns.push("phone-number");
  }

  if (/\d{13,19}/.test(username)) {
    patterns.push("potential-card-number");
  }

  if (/\d{3}-\d{2}-\d{4}/.test(username)) {
    patterns.push("ssn-pattern");
  }

  if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(username)) {
    patterns.push("full-email");
  }

  const markCount = chars.filter(c => /\p{M}/u.test(c)).length;
  if (markCount > 10 || (username.length > 0 && markCount / username.length > 0.3)) {
    patterns.push("excessive-marks");
    patterns.push("zalgo-text");
  }

  if (/[\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]{5,}/.test(username)) {
    patterns.push("zalgo-text");
  }

  if (/bot|crawler|spider|scraper|automation|script|fake|dummy|test|temp|trash|spam|junk/i.test(normalized)) {
    patterns.push("bot-indicator");
  }

  for (const word of PROFANITY_WORDS) {
    if (normalized.includes(word)) {
      patterns.push("profanity");
      break;
    }
  }

  for (const pattern of PROFANITY_PATTERNS) {
    if (pattern.test(username)) {
      patterns.push("profanity");
      break;
    }
  }

  for (const phrase of TOXIC_PHRASES) {
    if (normalized.includes(phrase.toLowerCase())) {
      patterns.push("toxic-phrase");
      break;
    }
  }

  for (const word of HATE_SPEECH) {
    if (normalized.includes(word)) {
      patterns.push("hate-speech");
      break;
    }
  }

  for (const word of SEXUAL_CONTENT) {
    if (normalized.includes(word)) {
      patterns.push("sexual-content");
      break;
    }
  }

  for (const word of DRUG_CONTENT) {
    if (normalized.includes(word)) {
      patterns.push("drug-reference");
      break;
    }
  }

  for (const word of VIOLENCE_CONTENT) {
    if (normalized.includes(word)) {
      patterns.push("violence-reference");
      break;
    }
  }

  const leetScore = (username.match(/[4@8(316!05$7+2]/g) || []).length;
  if (leetScore > 2 && /[a-z]/i.test(username)) {
    patterns.push("leet-speak");
  }

  if (username.length > 30) {
    patterns.push("very-long");
  }

  if (username.length < 3) {
    patterns.push("very-short");
  }

  const upperCount = (username.match(/[A-Z]/g) || []).length;
  const lowerCount = (username.match(/[a-z]/g) || []).length;
  if (upperCount > 0 && lowerCount > 0) {
    if (upperCount > lowerCount * 2) {
      patterns.push("excessive-uppercase");
    }
  }

  if (/^[A-Z][a-z]+[A-Z][a-z]+/.test(username)) {
    patterns.push("camel-case");
  }

  if (/^[a-z]+_[a-z]+(_[a-z]+)*$/.test(username)) {
    patterns.push("snake-case");
  }

  if (/^[a-z]+-[a-z]+(-[a-z]+)*$/.test(username)) {
    patterns.push("kebab-case");
  }

  if (/[^\x00-\x7F]/.test(username) && /[a-zA-Z]/.test(username)) {
    const ascii = username.match(/[a-zA-Z]/g)?.length || 0;
    const nonAscii = username.match(/[^\x00-\x7F]/g)?.length || 0;
    if (ascii > 0 && nonAscii > 0 && ascii < username.length * 0.3) {
      patterns.push("mixed-script-suspicious");
    }
  }

  if (/\.(png|jpg|jpeg|gif|bmp|svg|webp|ico|tiff|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|zip|rar|7z|tar|gz)$/i.test(username)) {
    patterns.push("file-extension");
  }

  if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(username)) {
    patterns.push("ip-address");
  }

  if (/[0-9a-f]{32}|[0-9a-f]{40}|[0-9a-f]{64}/i.test(username)) {
    patterns.push("hash-like");
  }

  if (/^[A-Z0-9]{8,}$/i.test(username) && !/[aeiou]/i.test(username)) {
    patterns.push("random-string");
  }

  if (/\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}/.test(username)) {
    patterns.push("credit-card-pattern");
  }

  if (/[A-Z]{2}\d{2}[A-Z0-9]{1,30}/i.test(username) && username.length >= 15) {
    patterns.push("iban-like");
  }

  if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(username)) {
    patterns.push("uuid-format");
  }

  return patterns;
}