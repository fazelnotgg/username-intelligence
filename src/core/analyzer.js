import { normalizeUsername } from "../utils/normalize.js";
import { calculateEntropy, analyzeComplexity } from "../utils/math.js";
import { analyzeCharacters } from "./character.js";
import { detectScript } from "./script.js";
import { detectPatterns } from "./pattern.js";
import { classifyUsername } from "./classifier.js";
import { detectSecurity } from "./security.js";
import { analyzeStructure } from "./structure.js";
import { analyzeLinguistic } from "./linguistic.js";
import { analyzeVisual } from "./visual.js";

export function analyze(username) {
  const normalized = normalizeUsername(username);
  const characters = analyzeCharacters(username);
  const script = detectScript(username);
  const patterns = detectPatterns(username);
  const security = detectSecurity(username, script);
  const structure = analyzeStructure(username);
  const linguistic = analyzeLinguistic(username, script);
  const visual = analyzeVisual(username, characters);
  const entropy = calculateEntropy(username);
  const complexity = analyzeComplexity(username);

  const classification = classifyUsername({
    characters,
    patterns,
    script,
    entropy,
    security,
    structure,
    linguistic,
    visual,
    complexity
  });

  return {
    input: username,
    meta: {
      length: username.length,
      normalized,
      byte_length: new Blob([username]).size,
      grapheme_length: [...new Intl.Segmenter().segment(username)].length
    },
    stats: {
      entropy: classification.scores.entropy,
      ...characters
    },
    script,
    patterns,
    security,
    structure,
    linguistic,
    visual,
    complexity,
    classification
  };
}