import { COMMON_WORDS, INTERNET_WORDS, GAMING_WORDS, TECH_WORDS, ACTION_WORDS, QUALITY_WORDS, COMMON_NAMES } from "../data/dictionary.js";

export { COMMON_WORDS, INTERNET_WORDS, GAMING_WORDS, TECH_WORDS, ACTION_WORDS, QUALITY_WORDS, COMMON_NAMES };

export const DICTIONARY_WORDS = [
  ...COMMON_WORDS,
  ...INTERNET_WORDS,
  ...GAMING_WORDS,
  ...TECH_WORDS,
  ...ACTION_WORDS,
  ...QUALITY_WORDS
];

export const NAME_PATTERNS = [
  /^[A-Z][a-z]{2,}$/,
  /^[A-Z][a-z]+[A-Z][a-z]+$/,
  /^[A-Z]\.[A-Z]\.?$/,
  /^[A-Z][a-z]+ [A-Z][a-z]+$/,
  /^dr[._]?[a-z]+/i,
  /^mr[._]?[a-z]+/i,
  /^ms[._]?[a-z]+/i,
  /^mrs[._]?[a-z]+/i,
  /^miss[._]?[a-z]+/i,
  /^prof[._]?[a-z]+/i,
  /^sir[._]?[a-z]+/i,
  /^lady[._]?[a-z]+/i,
  /^lord[._]?[a-z]+/i
];

export const LANGUAGE_PATTERNS = {
  english: /^[a-z]+$/i,
  numeric: /^[0-9]+$/,
  alphanumeric: /^[a-z0-9]+$/i,
  chinese: /[\u4E00-\u9FFF]/,
  japanese_hiragana: /[\u3040-\u309F]/,
  japanese_katakana: /[\u30A0-\u30FF]/,
  korean: /[\uAC00-\uD7AF]/,
  arabic: /[\u0600-\u06FF]/,
  hebrew: /[\u0590-\u05FF]/,
  cyrillic: /[\u0400-\u04FF]/,
  greek: /[\u0370-\u03FF]/,
  thai: /[\u0E00-\u0E7F]/,
  devanagari: /[\u0900-\u097F]/,
  bengali: /[\u0980-\u09FF]/,
  tamil: /[\u0B80-\u0BFF]/,
  telugu: /[\u0C00-\u0C7F]/,
  kannada: /[\u0C80-\u0CFF]/,
  malayalam: /[\u0D00-\u0D7F]/,
  sinhala: /[\u0D80-\u0DFF]/,
  burmese: /[\u1000-\u109F]/,
  khmer: /[\u1780-\u17FF]/,
  lao: /[\u0E80-\u0EFF]/,
  tibetan: /[\u0F00-\u0FFF]/,
  georgian: /[\u10A0-\u10FF]/,
  armenian: /[\u0530-\u058F]/,
  ethiopic: /[\u1200-\u137F]/
};

export const SYLLABLE_PATTERNS = {
  cv: /[bcdfghjklmnpqrstvwxyz][aeiou]/gi,
  cvc: /[bcdfghjklmnpqrstvwxyz][aeiou][bcdfghjklmnpqrstvwxyz]/gi,
  vcv: /[aeiou][bcdfghjklmnpqrstvwxyz][aeiou]/gi,
  ccv: /[bcdfghjklmnpqrstvwxyz]{2}[aeiou]/gi,
  cvcc: /[bcdfghjklmnpqrstvwxyz][aeiou][bcdfghjklmnpqrstvwxyz]{2}/gi,
  v: /[aeiou]/gi,
  vc: /[aeiou][bcdfghjklmnpqrstvwxyz]/gi
};

export const PHONETIC_SIMILARITY = {
  "b": ["p", "v", "f"],
  "p": ["b", "f", "v"],
  "d": ["t", "th"],
  "t": ["d", "th"],
  "g": ["k", "c", "q"],
  "k": ["c", "g", "q"],
  "c": ["k", "s", "q"],
  "s": ["c", "z", "x"],
  "z": ["s", "x"],
  "f": ["v", "ph", "p"],
  "v": ["f", "b", "w"],
  "m": ["n"],
  "n": ["m"],
  "l": ["r"],
  "r": ["l"],
  "w": ["v", "u"],
  "y": ["i", "j"],
  "j": ["y", "g"],
  "ch": ["sh", "tch"],
  "sh": ["ch", "s"],
  "th": ["t", "d", "f"]
};

export const VOWEL_SOUNDS = {
  short: ['a', 'e', 'i', 'o', 'u'],
  long: ['aa', 'ee', 'ii', 'oo', 'uu', 'ay', 'ey', 'iy', 'oy', 'uy'],
  diphthongs: ['ai', 'au', 'ei', 'eu', 'oi', 'ou', 'ui']
};

export const CONSONANT_CLUSTERS = {
  initial: ['bl', 'br', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr', 'pl', 'pr', 'sc', 'sk', 'sl', 'sm', 'sn', 'sp', 'st', 'sw', 'tr', 'tw', 'scr', 'spl', 'spr', 'str', 'thr'],
  final: ['ct', 'ft', 'ld', 'lf', 'lk', 'lm', 'lp', 'lt', 'mp', 'nd', 'ng', 'nk', 'nt', 'pt', 'sk', 'sp', 'st']
};