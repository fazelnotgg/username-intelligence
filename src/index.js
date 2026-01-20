import { analyze } from "./core/analyzer.js";

export function analyzeUsername(username) {
  if (typeof username !== "string") {
    throw new Error("Username must be a string");
  }

  if (username.length === 0) {
    throw new Error("Username cannot be empty");
  }

  if (username.length > 1000) {
    throw new Error("Username exceeds maximum length of 1000 characters");
  }

  return analyze(username);
}

export function batchAnalyze(usernames, options = {}) {
  if (!Array.isArray(usernames)) {
    throw new Error("Usernames must be an array");
  }

  const results = [];
  const { stopOnError = false, includeErrors = true } = options;

  for (const username of usernames) {
    try {
      const analysis = analyzeUsername(username);
      results.push({
        username,
        analysis,
        success: true
      });
    } catch (error) {
      if (includeErrors) {
        results.push({
          username,
          error: error.message,
          success: false
        });
      }
      
      if (stopOnError) {
        throw error;
      }
    }
  }

  return results;
}

export function compareUsernames(username1, username2) {
  const analysis1 = analyzeUsername(username1);
  const analysis2 = analyzeUsername(username2);

  return {
    username1: {
      value: username1,
      analysis: analysis1
    },
    username2: {
      value: username2,
      analysis: analysis2
    },
    comparison: {
      length_difference: Math.abs(analysis1.meta.length - analysis2.meta.length),
      entropy_difference: Math.abs(
        analysis1.classification.scores.entropy - 
        analysis2.classification.scores.entropy
      ),
      quality_difference: Math.abs(
        analysis1.classification.scores.quality - 
        analysis2.classification.scores.quality
      ),
      security_risk_difference: Math.abs(
        analysis1.classification.scores.security_risk - 
        analysis2.classification.scores.security_risk
      ),
      same_script: analysis1.script.primary === analysis2.script.primary,
      same_style: analysis1.classification.style === analysis2.classification.style,
      both_suspicious: analysis1.security.is_suspicious && analysis2.security.is_suspicious,
      similarity_score: calculateSimilarityScore(analysis1, analysis2)
    }
  };
}

function calculateSimilarityScore(analysis1, analysis2) {
  let score = 0;
  let maxScore = 0;

  if (analysis1.script.primary === analysis2.script.primary) {
    score += 20;
  }
  maxScore += 20;

  if (analysis1.classification.style === analysis2.classification.style) {
    score += 15;
  }
  maxScore += 15;

  const lengthDiff = Math.abs(analysis1.meta.length - analysis2.meta.length);
  if (lengthDiff <= 2) {
    score += 10;
  } else if (lengthDiff <= 5) {
    score += 5;
  }
  maxScore += 10;

  const entropyDiff = Math.abs(
    analysis1.classification.scores.entropy - 
    analysis2.classification.scores.entropy
  );
  if (entropyDiff < 1) {
    score += 15;
  } else if (entropyDiff < 2) {
    score += 8;
  }
  maxScore += 15;

  const sharedPatterns = analysis1.patterns.filter(p => 
    analysis2.patterns.includes(p)
  ).length;
  score += Math.min(sharedPatterns * 5, 20);
  maxScore += 20;

  const qualityDiff = Math.abs(
    analysis1.classification.scores.quality - 
    analysis2.classification.scores.quality
  );
  if (qualityDiff < 10) {
    score += 10;
  } else if (qualityDiff < 20) {
    score += 5;
  }
  maxScore += 10;

  const sharedThreats = analysis1.security.threats.filter(t => 
    analysis2.security.threats.includes(t)
  ).length;
  score += Math.min(sharedThreats * 3, 10);
  maxScore += 10;

  return Number(((score / maxScore) * 100).toFixed(1));
}

export { normalizeUsername, normalizeAggressively } from "./utils/normalize.js";
export { calculateEntropy, analyzeComplexity, analyzeBigrams } from "./utils/math.js";
export { 
  detectHomoglyphs, 
  detectConfusables, 
  isLikelyPhishing,
  detectMixedScriptSpoofing,
  analyzeScriptConsistency
} from "./utils/text.js";