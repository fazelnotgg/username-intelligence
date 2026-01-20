import { ADVANCED_LEET_MAP, LEET_PATTERNS } from "../data/leet.js";
import { HOMOGLYPH_MAP, CONFUSABLE_SETS } from "../data/homoglyphs.js";
import { ALL_BRANDS } from "../data/brands.js";

export function deLeet(str) {
  let result = str.toLowerCase();
  
  for (const [pattern, replacement] of Object.entries(LEET_PATTERNS)) {
    const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    result = result.replace(regex, replacement);
  }
  
  for (const [char, leets] of Object.entries(ADVANCED_LEET_MAP)) {
    for (const leet of leets) {
      const regex = new RegExp(leet.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      result = result.replace(regex, char);
    }
  }
  
  return result;
}

export function hasInvisibleChars(str) {
  return /[\u200B-\u200D\uFEFF\u180E\u2060-\u2069\u202A-\u202E\uFFF9-\uFFFB\u034F\u115F-\u1160\u17B4-\u17B5\u3164]/.test(str);
}

export function detectZeroWidth(str) {
  const zeroWidthChars = [];
  const chars = [...str];
  
  chars.forEach((char, index) => {
    const code = char.codePointAt(0);
    const ranges = [
      { start: 0x200B, end: 0x200F, name: "Zero Width Space" },
      { start: 0xFEFF, end: 0xFEFF, name: "Zero Width No-Break Space" },
      { start: 0x180E, end: 0x180E, name: "Mongolian Vowel Separator" },
      { start: 0x2060, end: 0x2069, name: "Word Joiner" },
      { start: 0xFFF9, end: 0xFFFB, name: "Interlinear Annotation" },
      { start: 0x034F, end: 0x034F, name: "Combining Grapheme Joiner" }
    ];
    
    for (const range of ranges) {
      if (code >= range.start && code <= range.end) {
        zeroWidthChars.push({
          char,
          code: code.toString(16).toUpperCase().padStart(4, '0'),
          position: index,
          name: range.name
        });
        break;
      }
    }
  });
  
  return zeroWidthChars;
}

export function detectHomoglyphs(str) {
  const chars = [...str];
  let homoglyphCount = 0;
  const found = [];
  
  chars.forEach((char, index) => {
    for (const [latin, homoglyphs] of Object.entries(HOMOGLYPH_MAP)) {
      if (homoglyphs.includes(char)) {
        homoglyphCount++;
        found.push({
          char,
          lookalike: latin,
          position: index,
          script: getCharScript(char)
        });
        break;
      }
    }
  });
  
  const risk = homoglyphCount > 0 ? Math.min(homoglyphCount * 20, 100) : 0;
  
  return {
    count: homoglyphCount,
    risk,
    found
  };
}

export function detectConfusables(str) {
  const chars = [...str];
  let confusableCount = 0;
  const found = [];
  
  chars.forEach((char, index) => {
    for (const confusableSet of CONFUSABLE_SETS) {
      if (confusableSet.includes(char)) {
        confusableCount++;
        found.push({
          char,
          confusable_with: confusableSet[0],
          position: index,
          alternatives: confusableSet.filter(c => c !== char)
        });
        break;
      }
    }
  });
  
  return {
    count: confusableCount,
    found
  };
}

export function normalizeHomoglyphs(str) {
  let result = str;
  
  for (const [latin, homoglyphs] of Object.entries(HOMOGLYPH_MAP)) {
    for (const homoglyph of homoglyphs) {
      result = result.replace(new RegExp(homoglyph, 'g'), latin);
    }
  }
  
  return result;
}

export function isLikelyPhishing(str) {
  const normalized = normalizeHomoglyphs(str.toLowerCase());
  
  return ALL_BRANDS.some(brand => {
    if (normalized.includes(brand)) return true;
    
    const similarity = calculateSimilarity(normalized, brand);
    return similarity > 0.75;
  });
}

function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

function getCharScript(char) {
  const code = char.codePointAt(0);
  
  if (code >= 0x0400 && code <= 0x04FF) return "Cyrillic";
  if (code >= 0x0370 && code <= 0x03FF) return "Greek";
  if (code >= 0x0600 && code <= 0x06FF) return "Arabic";
  if (code >= 0x0590 && code <= 0x05FF) return "Hebrew";
  if (code >= 0x4E00 && code <= 0x9FFF) return "Han";
  if (code >= 0x0041 && code <= 0x005A) return "Latin";
  if (code >= 0x0061 && code <= 0x007A) return "Latin";
  
  return "Unknown";
}

export function detectMixedScriptSpoofing(str) {
  const chars = [...str];
  const scripts = new Set();
  
  chars.forEach(char => {
    const script = getCharScript(char);
    if (script !== "Unknown") {
      scripts.add(script);
    }
  });
  
  const homoglyphsPresent = chars.some(c => {
    for (const homoglyphs of Object.values(HOMOGLYPH_MAP)) {
      if (homoglyphs.includes(c)) return true;
    }
    return false;
  });
  
  return {
    has_mixed_scripts: scripts.size > 1,
    scripts: Array.from(scripts),
    has_homoglyphs: homoglyphsPresent,
    spoofing_risk: scripts.size > 1 && homoglyphsPresent ? "high" : scripts.size > 1 ? "medium" : "low"
  };
}

export function analyzeScriptConsistency(str) {
  const chars = [...str];
  const scriptCounts = {};
  
  chars.forEach(char => {
    const script = getCharScript(char);
    scriptCounts[script] = (scriptCounts[script] || 0) + 1;
  });
  
  const totalChars = chars.length;
  const dominantScript = Object.entries(scriptCounts)
    .sort((a, b) => b[1] - a[1])[0];
  
  const consistency = dominantScript ? dominantScript[1] / totalChars : 0;
  
  return {
    consistency: Number(consistency.toFixed(3)),
    dominant_script: dominantScript ? dominantScript[0] : "Unknown",
    script_distribution: scriptCounts,
    is_consistent: consistency > 0.8
  };
}