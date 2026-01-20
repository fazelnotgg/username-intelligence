import { COMMON_WORDS, NAME_PATTERNS, DICTIONARY_WORDS } from "../data/linguistic.js";

export function analyzeLinguistic(username, scriptInfo) {
  const lower = username.toLowerCase();
  const chars = [...username];
  
  const wordLikeness = calculateWordLikeness(lower);
  const nameLikeness = calculateNameLikeness(username);
  const pronounceability = calculatePronounceability(chars, scriptInfo);
  const linguisticPattern = detectLinguisticPattern(lower);
  const readingDirection = determineReadingDirection(scriptInfo);
  const syllableStructure = analyzeSyllables(lower);
  
  const hasRealWords = DICTIONARY_WORDS.some(word => lower.includes(word));
  const hasCommonWords = COMMON_WORDS.some(word => lower.includes(word));
  
  const language = detectLanguage(username, scriptInfo);
  const wordCount = countWords(username);
  const tokenization = tokenizeUsername(username, scriptInfo);
  
  return {
    word_likeness: wordLikeness,
    name_likeness: nameLikeness,
    pronounceability: pronounceability,
    linguistic_pattern: linguisticPattern,
    reading_direction: readingDirection,
    syllable_count: syllableStructure.count,
    syllable_complexity: syllableStructure.complexity,
    has_real_words: hasRealWords,
    has_common_words: hasCommonWords,
    detected_language: language,
    word_count: wordCount,
    tokens: tokenization.tokens,
    token_types: tokenization.types,
    is_natural: wordLikeness > 0.6 || nameLikeness > 0.7,
    is_memorable: calculateMemorability(username, wordLikeness, syllableStructure)
  };
}

function calculateWordLikeness(str) {
  if (str.length < 3) return 0;
  
  const vowels = str.match(/[aeiouàáâãäåèéêëìíîïòóôõöùúûüýÿ]/g) || [];
  const consonants = str.match(/[bcdfghjklmnpqrstvwxyz]/g) || [];
  
  if (vowels.length === 0 || consonants.length === 0) return 0;
  
  const vowelRatio = vowels.length / str.length;
  if (vowelRatio < 0.2 || vowelRatio > 0.6) return 0.3;
  
  let alternationScore = 0;
  let prevIsVowel = null;
  
  for (const char of str) {
    const isVowel = /[aeiou]/.test(char);
    if (prevIsVowel !== null && prevIsVowel !== isVowel) {
      alternationScore++;
    }
    prevIsVowel = isVowel;
  }
  
  const alternationRatio = alternationScore / Math.max(1, str.length - 1);
  
  const hasVowelClusters = /[aeiou]{3,}/.test(str);
  const hasConsonantClusters = /[bcdfghjklmnpqrstvwxyz]{4,}/.test(str);
  
  let score = alternationRatio * 0.6 + (vowelRatio * 2) * 0.4;
  
  if (hasVowelClusters) score *= 0.7;
  if (hasConsonantClusters) score *= 0.6;
  
  return Number(Math.min(score, 1).toFixed(3));
}

function calculateNameLikeness(str) {
  if (str.length < 2) return 0;
  
  const startsWithCapital = /^[A-Z\p{Lu}]/u.test(str);
  const hasProperCase = /^[A-Z\p{Lu}][a-z\p{Ll}]+/u.test(str);
  
  let score = 0;
  
  if (startsWithCapital) score += 0.3;
  if (hasProperCase) score += 0.3;
  
  for (const pattern of NAME_PATTERNS) {
    if (pattern.test(str)) {
      score += 0.4;
      break;
    }
  }
  
  const lower = str.toLowerCase();
  const wordLike = calculateWordLikeness(lower);
  score += wordLike * 0.3;
  
  return Number(Math.min(score, 1).toFixed(3));
}

function calculatePronounceability(chars, scriptInfo) {
  if (chars.length === 0) return 0;
  
  const primary = scriptInfo.primary;
  
  if (primary === "Han" || primary === "Hiragana" || primary === "Katakana") {
    return 0.9;
  }
  
  if (primary === "Arabic" || primary === "Hebrew" || primary === "Devanagari") {
    return 0.85;
  }
  
  if (primary === "Emoji" || primary === "Unknown") {
    return 0.1;
  }
  
  const str = chars.join('').toLowerCase();
  
  const vowels = (str.match(/[aeiouàáâãäåèéêëìíîïòóôõöùúûüýÿаэиоуыеёюя]/g) || []).length;
  const consonants = (str.match(/[bcdfghjklmnpqrstvwxyzбвгджзклмнпрстфхцчшщ]/g) || []).length;
  
  if (vowels === 0) return 0.2;
  if (consonants === 0) return 0.3;
  
  const ratio = Math.min(vowels, consonants) / Math.max(vowels, consonants);
  
  const hasImpossibleClusters = /([bcdfghjklmnpqrstvwxyz]{5,})/i.test(str);
  
  let score = ratio * 0.8;
  if (hasImpossibleClusters) score *= 0.5;
  
  return Number(Math.min(score, 1).toFixed(3));
}

function detectLinguisticPattern(str) {
  if (/^[a-z]+[0-9]+$/.test(str)) return "word-number";
  if (/^[a-z]+_[a-z]+$/.test(str)) return "word-separator-word";
  if (/^[a-z]{2,}[A-Z][a-z]+$/.test(str)) return "compound-camel";
  if (/^[A-Z][a-z]+[A-Z][a-z]+$/.test(str)) return "proper-camel";
  if (/^[a-z]+$/.test(str) && str.length > 3) return "single-word";
  if (/^[A-Z][a-z]+$/.test(str)) return "proper-name";
  if (/^[a-z]+[._-][a-z]+[._-][a-z]+$/.test(str)) return "triple-segment";
  
  return "mixed";
}

function determineReadingDirection(scriptInfo) {
  if (scriptInfo.is_rtl) return "rtl";
  if (scriptInfo.has_bidi_mix) return "bidi";
  return "ltr";
}

function analyzeSyllables(str) {
  const vowelGroups = str.match(/[aeiouàáâãäåèéêëìíîïòóôõöùúûüýÿ]+/gi) || [];
  const count = vowelGroups.length;
  
  let complexity = "simple";
  if (count === 0) complexity = "none";
  else if (count === 1) complexity = "monosyllabic";
  else if (count === 2) complexity = "disyllabic";
  else if (count <= 4) complexity = "moderate";
  else complexity = "complex";
  
  return { count, complexity };
}

function detectLanguage(username, scriptInfo) {
  const primary = scriptInfo.primary;
  
  const languageMap = {
    "Latin": "latin-based",
    "Cyrillic": "cyrillic-based",
    "Han": "chinese",
    "Hiragana": "japanese",
    "Katakana": "japanese",
    "Hangul": "korean",
    "Arabic": "arabic",
    "Hebrew": "hebrew",
    "Devanagari": "hindi",
    "Thai": "thai",
    "Greek": "greek",
    "Armenian": "armenian",
    "Georgian": "georgian"
  };
  
  return languageMap[primary] || "unknown";
}

function countWords(username) {
  const segments = username.split(/[^a-zA-Z\u0400-\u04FF\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]+/);
  return segments.filter(s => s.length > 0).length;
}

function tokenizeUsername(username, scriptInfo) {
  const tokens = [];
  const types = new Set();
  
  const segments = username.split(/([a-zA-Z]+|[0-9]+|[^a-zA-Z0-9]+)/g).filter(s => s);
  
  for (const segment of segments) {
    if (/^[a-zA-Z]+$/.test(segment)) {
      tokens.push({ value: segment, type: "word" });
      types.add("word");
    } else if (/^[0-9]+$/.test(segment)) {
      tokens.push({ value: segment, type: "number" });
      types.add("number");
    } else {
      tokens.push({ value: segment, type: "symbol" });
      types.add("symbol");
    }
  }
  
  return {
    tokens,
    types: Array.from(types)
  };
}

function calculateMemorability(username, wordLikeness, syllableStructure) {
  const length = username.length;
  
  let score = 0;
  
  if (length >= 4 && length <= 12) score += 0.3;
  else if (length >= 13 && length <= 16) score += 0.15;
  
  score += wordLikeness * 0.3;
  
  if (syllableStructure.count >= 2 && syllableStructure.count <= 4) {
    score += 0.2;
  }
  
  const hasPattern = /(.)\1|[aeiou]/.test(username.toLowerCase());
  if (hasPattern) score += 0.2;
  
  return Number(Math.min(score, 1).toFixed(3));
}