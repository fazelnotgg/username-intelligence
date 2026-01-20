import { 
  hasInvisibleChars, 
  detectZeroWidth, 
  detectHomoglyphs, 
  detectConfusables,
  isLikelyPhishing,
  normalizeHomoglyphs
} from "../utils/text.js";

const DANGEROUS_UNICODE_RANGES = [
  { start: 0x200B, end: 0x200F, name: "Zero-width" },
  { start: 0x202A, end: 0x202E, name: "Bidi control" },
  { start: 0x2060, end: 0x2069, name: "Formatting" },
  { start: 0xFEFF, end: 0xFEFF, name: "Zero-width no-break" },
  { start: 0xFFF9, end: 0xFFFB, name: "Interlinear" },
  { start: 0x180E, end: 0x180E, name: "Mongolian vowel" },
  { start: 0x034F, end: 0x034F, name: "Combining grapheme joiner" },
  { start: 0x115F, end: 0x1160, name: "Hangul filler" },
  { start: 0x17B4, end: 0x17B5, name: "Khmer vowel inherent" },
  { start: 0x3164, end: 0x3164, name: "Hangul filler" }
];

const IDN_HOMOGLYPHS = {
  'a': ['а', 'ạ', 'ả', 'ā', 'ă'],
  'c': ['с', 'ϲ', 'ⅽ'],
  'e': ['е', 'ė', 'ē', 'ĕ'],
  'i': ['і', 'ï', 'ī', 'ı'],
  'o': ['о', 'ο', 'ọ', 'ỏ', 'ō'],
  'p': ['р', 'ρ', 'ṗ'],
  's': ['ѕ', 'ṡ'],
  'x': ['х', 'ⅹ'],
  'y': ['у', 'ỳ', 'ý']
};

export function detectSecurity(username, scriptInfo) {
  const chars = [...username];
  const threats = [];
  const warnings = [];
  const vulnerabilities = [];

  const invisibleCheck = hasInvisibleChars(username);
  const zeroWidthChars = detectZeroWidth(username);
  
  if (invisibleCheck || zeroWidthChars.length > 0) {
    threats.push("invisible-characters");
    warnings.push("Contains hidden or zero-width characters");
    vulnerabilities.push({
      type: "invisible-chars",
      severity: "high",
      count: zeroWidthChars.length,
      details: zeroWidthChars
    });
  }

  for (const range of DANGEROUS_UNICODE_RANGES) {
    const found = chars.filter(char => {
      const code = char.codePointAt(0);
      return code >= range.start && code <= range.end;
    });
    
    if (found.length > 0) {
      threats.push(`dangerous-unicode-${range.name.toLowerCase().replace(/\s+/g, "-")}`);
      warnings.push(`Contains ${range.name} characters`);
      vulnerabilities.push({
        type: range.name.toLowerCase().replace(/\s+/g, "-"),
        severity: "critical",
        count: found.length,
        characters: found
      });
    }
  }

  const homoglyphResult = detectHomoglyphs(username);
  const confusableResult = detectConfusables(username);

  if (homoglyphResult.risk > 0) {
    threats.push("homoglyph-risk");
    warnings.push("Contains characters that look similar to other scripts");
    vulnerabilities.push({
      type: "homoglyph",
      severity: homoglyphResult.risk > 60 ? "critical" : "high",
      count: homoglyphResult.count,
      details: homoglyphResult.found
    });
  }

  if (confusableResult.count > 0) {
    threats.push("confusable-characters");
    warnings.push(`Contains ${confusableResult.count} potentially confusable characters`);
    vulnerabilities.push({
      type: "confusable",
      severity: confusableResult.count > 5 ? "high" : "medium",
      count: confusableResult.count,
      details: confusableResult.found
    });
  }

  const rtlMarks = username.match(/[\u200E\u200F\u202A-\u202E]/g);
  if (rtlMarks && rtlMarks.length > 0) {
    threats.push("rtl-override");
    warnings.push("Contains right-to-left override characters");
    vulnerabilities.push({
      type: "rtl-override",
      severity: "critical",
      count: rtlMarks.length
    });
  }

  const normalizedA = username.normalize("NFC");
  const normalizedB = username.normalize("NFD");
  if (normalizedA !== normalizedB && normalizedA.length !== normalizedB.length) {
    warnings.push("Multiple normalization forms possible");
    vulnerabilities.push({
      type: "normalization-confusion",
      severity: "low"
    });
  }

  if (scriptInfo.is_dangerous_mix) {
    threats.push("dangerous-script-mix");
    warnings.push("Dangerous combination of writing systems detected");
    vulnerabilities.push({
      type: "script-mixing",
      severity: "high",
      scripts: scriptInfo.active_scripts
    });
  }

  if (/\p{M}{5,}/gu.test(username)) {
    threats.push("combining-character-abuse");
    warnings.push("Excessive combining characters (possible zalgo text)");
    vulnerabilities.push({
      type: "zalgo-abuse",
      severity: "medium"
    });
  }

  const suspiciousSpaces = username.match(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g);
  if (suspiciousSpaces) {
    threats.push("non-standard-spaces");
    warnings.push("Contains non-standard space characters");
    vulnerabilities.push({
      type: "suspicious-spaces",
      severity: "medium",
      count: suspiciousSpaces.length
    });
  }

  const controlChars = chars.filter(c => {
    const code = c.codePointAt(0);
    return (code >= 0x00 && code <= 0x1F) || (code >= 0x7F && code <= 0x9F);
  });
  
  if (controlChars.length > 0) {
    threats.push("control-characters");
    warnings.push(`Contains ${controlChars.length} control characters`);
    vulnerabilities.push({
      type: "control-chars",
      severity: "high",
      count: controlChars.length
    });
  }

  const phishingCheck = isLikelyPhishing(username);
  if (phishingCheck) {
    threats.push("potential-phishing");
    warnings.push("Username resembles known brand names");
    vulnerabilities.push({
      type: "phishing-attempt",
      severity: "critical"
    });
  }

  const idnSpoofing = detectIDNSpoofing(username);
  if (idnSpoofing.detected) {
    threats.push("idn-spoofing");
    warnings.push("Potential IDN homograph attack detected");
    vulnerabilities.push({
      type: "idn-spoofing",
      severity: "critical",
      details: idnSpoofing.matches
    });
  }

  const overlapAnalysis = analyzeCharacterOverlap(chars);
  if (overlapAnalysis.suspicious) {
    threats.push("character-overlap");
    warnings.push("Suspicious character overlap detected");
    vulnerabilities.push({
      type: "char-overlap",
      severity: "medium",
      score: overlapAnalysis.score
    });
  }

  const structuralAnomaly = detectStructuralAnomalies(username);
  if (structuralAnomaly.detected) {
    threats.push("structural-anomaly");
    warnings.push(structuralAnomaly.message);
    vulnerabilities.push({
      type: "structural",
      severity: "low",
      anomalies: structuralAnomaly.anomalies
    });
  }

  const severityCount = {
    critical: vulnerabilities.filter(v => v.severity === "critical").length,
    high: vulnerabilities.filter(v => v.severity === "high").length,
    medium: vulnerabilities.filter(v => v.severity === "medium").length,
    low: vulnerabilities.filter(v => v.severity === "low").length
  };

  return {
    has_invisible_chars: invisibleCheck || zeroWidthChars.length > 0,
    has_homoglyph_risk: homoglyphResult.risk > 0,
    has_confusables: confusableResult.count > 0,
    confusable_count: confusableResult.count,
    homoglyph_risk_level: homoglyphResult.risk,
    zero_width_chars: zeroWidthChars,
    threats,
    warnings,
    vulnerabilities,
    threat_count: threats.length,
    vulnerability_count: vulnerabilities.length,
    severity_distribution: severityCount,
    is_suspicious: threats.length > 0,
    is_highly_suspicious: severityCount.critical > 0 || severityCount.high > 2
  };
}

function detectIDNSpoofing(username) {
  const lower = username.toLowerCase();
  const matches = [];
  
  for (const [latin, homoglyphs] of Object.entries(IDN_HOMOGLYPHS)) {
    for (const homoglyph of homoglyphs) {
      if (lower.includes(homoglyph)) {
        matches.push({
          original: latin,
          homoglyph: homoglyph,
          positions: findAllPositions(lower, homoglyph)
        });
      }
    }
  }
  
  return {
    detected: matches.length > 0,
    matches
  };
}

function findAllPositions(str, char) {
  const positions = [];
  let pos = str.indexOf(char);
  while (pos !== -1) {
    positions.push(pos);
    pos = str.indexOf(char, pos + 1);
  }
  return positions;
}

function analyzeCharacterOverlap(chars) {
  const positions = {};
  
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const code = char.codePointAt(0);
    
    if (code >= 0x0300 && code <= 0x036F) {
      if (!positions.combining) positions.combining = [];
      positions.combining.push(i);
    }
  }
  
  let score = 0;
  if (positions.combining && positions.combining.length > chars.length * 0.3) {
    score += 0.5;
  }
  
  const suspicious = score > 0.3;
  
  return { suspicious, score };
}

function detectStructuralAnomalies(username) {
  const anomalies = [];
  
  if (username.startsWith(" ") || username.endsWith(" ")) {
    anomalies.push("leading-trailing-spaces");
  }
  
  if (/\s{2,}/.test(username)) {
    anomalies.push("multiple-consecutive-spaces");
  }
  
  if (/[\r\n\t]/.test(username)) {
    anomalies.push("line-breaks-or-tabs");
  }
  
  const uniqueChars = new Set([...username]).size;
  if (username.length > 10 && uniqueChars < 3) {
    anomalies.push("very-low-character-diversity");
  }
  
  return {
    detected: anomalies.length > 0,
    message: anomalies.length > 0 ? `Found ${anomalies.length} structural anomalies` : "",
    anomalies
  };
}