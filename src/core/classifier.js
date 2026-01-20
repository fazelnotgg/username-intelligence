export function classifyUsername({ 
  characters, 
  patterns, 
  script, 
  entropy, 
  security, 
  structure,
  linguistic,
  visual,
  complexity 
}) {
  let style = "unknown";
  let riskScore = 0;
  let qualityScore = 100;
  let suspicionScore = 0;
  let authenticityScore = 100;
  let professionalismScore = 50;

  const hasLinguistic = linguistic && typeof linguistic === 'object';
  const hasVisual = visual && typeof visual === 'object';
  const hasComplexity = complexity && typeof complexity === 'object';

  if (patterns.includes("privileged-keyword")) style = "impersonation";
  else if (patterns.includes("email-format")) style = "leaked-info";
  else if (patterns.includes("generated-style")) style = "bot-generated";
  else if (patterns.includes("gamer-style")) style = "gamer";
  else if (patterns.includes("separator-style")) style = "professional";
  else if (patterns.includes("year-indicator")) style = "personal";
  else if (patterns.includes("zalgo-text")) style = "decorated";
  else if (characters.emoji > 0) style = "expressive";
  else if (script.is_rtl) style = "rtl-script";
  else if (hasLinguistic && linguistic.name_likeness > 0.7) style = "name-like";
  else if (hasLinguistic && linguistic.word_likeness > 0.6) style = "word-like";
  else if (patterns.includes("camel-case")) style = "developer";
  else if (patterns.includes("snake-case")) style = "technical";

  if (script.is_dangerous_mix) riskScore += 70;
  if (security.has_homoglyph_risk) riskScore += 50;
  if (security.has_invisible_chars) riskScore += 60;
  if (patterns.includes("email-format")) riskScore += 30;
  if (patterns.includes("privileged-keyword")) riskScore += 80;
  if (patterns.includes("government-keyword")) riskScore += 70;
  if (patterns.includes("suspicious-tld")) riskScore += 40;
  if (patterns.includes("url-pattern")) riskScore += 35;
  if (patterns.includes("executable-extension")) riskScore += 70;
  if (patterns.includes("potential-card-number")) riskScore += 90;
  if (patterns.includes("credit-card-pattern")) riskScore += 95;
  if (patterns.includes("phone-number")) riskScore += 40;
  if (patterns.includes("ssn-pattern")) riskScore += 95;
  if (entropy > 5.5) riskScore += 25;
  if (security.confusable_count > 5) riskScore += 40;
  if (characters.controls > 0) riskScore += 70;
  if (patterns.includes("excessive-marks")) riskScore += 30;
  if (security.threat_count > 3) riskScore += 50;
  if (hasVisual && visual.distinctiveness < 40) riskScore += 20;
  if (patterns.includes("hate-speech")) riskScore += 85;
  if (patterns.includes("violence-reference")) riskScore += 60;

  riskScore = Math.min(riskScore, 100);

  qualityScore -= (characters.symbols || 0) * 4;
  qualityScore -= (characters.punctuation || 0) * 3;
  qualityScore -= (characters.whitespaces || 0) * 10;
  qualityScore -= (characters.controls || 0) * 20;
  
  if (hasVisual && typeof visual.readability_score === 'number') {
    qualityScore -= (100 - visual.readability_score) * 0.3;
  }

  if (characters.length > 0) {
    qualityScore -= ((characters.numbers || 0) / characters.length) * 35;
  }
  
  if (typeof characters.unique_ratio === 'number' && characters.unique_ratio < 0.5) {
    qualityScore -= 20;
  }
  
  if (patterns.includes("repeated-character")) qualityScore -= 15;
  if (patterns.includes("generated-style")) qualityScore -= 25;
  if (patterns.includes("keyboard-walk")) qualityScore -= 30;
  if (script.primary === "Unknown" || script.primary === "Common") qualityScore -= 20;
  if ((characters.combining_chars || 0) > 10) qualityScore -= 25;
  if (entropy < 2.0) qualityScore -= 30;
  
  if (hasLinguistic && typeof linguistic.pronounceability === 'number' && linguistic.pronounceability < 0.3) {
    qualityScore -= 20;
  }
  
  if (patterns.includes("profanity")) qualityScore -= 40;
  if (patterns.includes("random-string")) qualityScore -= 30;
  
  if (structure && structure.has_balanced_structure) qualityScore += 10;
  if (typeof characters.letter_ratio === 'number' && characters.letter_ratio > 0.7) qualityScore += 5;
  
  if (hasLinguistic && linguistic.is_memorable) qualityScore += 10;
  if (hasLinguistic && linguistic.is_natural) qualityScore += 15;
  if (hasVisual && typeof visual.aesthetic_score === 'number' && visual.aesthetic_score > 70) qualityScore += 10;

  qualityScore = Math.max(0, Math.min(100, qualityScore));

  if (security.has_invisible_chars) suspicionScore += 40;
  if (security.has_homoglyph_risk) suspicionScore += 35;
  if (script.is_dangerous_mix) suspicionScore += 30;
  if ((security.confusable_count || 0) > 3) suspicionScore += 25;
  if (patterns.includes("privileged-keyword")) suspicionScore += 45;
  if (patterns.includes("government-keyword")) suspicionScore += 40;
  if ((characters.controls || 0) > 0) suspicionScore += 50;
  if (patterns.includes("bot-indicator")) suspicionScore += 30;
  if (patterns.includes("mixed-script-suspicious")) suspicionScore += 35;
  if (entropy > 6.0) suspicionScore += 20;
  
  if (hasComplexity && typeof complexity.efficiency === 'number' && complexity.efficiency < 0.3) {
    suspicionScore += 15;
  }
  
  if (patterns.includes("hash-like")) suspicionScore += 25;

  suspicionScore = Math.min(suspicionScore, 100);

  if (hasLinguistic) {
    if (linguistic.is_natural) {
      authenticityScore += 0;
    } else {
      authenticityScore -= 20;
    }
    
    if (typeof linguistic.name_likeness === 'number') {
      if (linguistic.name_likeness > 0.7) {
        authenticityScore += 0;
      } else if (linguistic.name_likeness < 0.3) {
        authenticityScore -= 15;
      }
    }
  }
  
  if (security.has_homoglyph_risk) authenticityScore -= 30;
  if (security.has_invisible_chars) authenticityScore -= 40;
  if (patterns.includes("generated-style")) authenticityScore -= 25;
  if (patterns.includes("keyboard-walk")) authenticityScore -= 30;
  if (script.is_dangerous_mix) authenticityScore -= 35;
  if (patterns.includes("random-string")) authenticityScore -= 40;

  authenticityScore = Math.max(0, Math.min(100, authenticityScore));

  if (patterns.includes("separator-style")) professionalismScore += 20;
  if (patterns.includes("camel-case") || patterns.includes("snake-case")) professionalismScore += 15;
  
  if (structure && structure.complexity_level === "moderate") {
    professionalismScore += 10;
  }
  
  if ((characters.emoji || 0) > 0) professionalismScore -= 20;
  if (patterns.includes("gamer-style")) professionalismScore -= 25;
  if (patterns.includes("excessive-uppercase")) professionalismScore -= 20;
  if (patterns.includes("leet-speak")) professionalismScore -= 30;
  if (patterns.includes("profanity")) professionalismScore -= 50;
  if (patterns.includes("toxic-phrase")) professionalismScore -= 45;
  if (patterns.includes("sexual-content")) professionalismScore -= 50;
  if (patterns.includes("drug-reference")) professionalismScore -= 40;
  
  if (hasVisual && visual.aesthetic_features && visual.aesthetic_features.includes("decorative")) {
    professionalismScore -= 15;
  }
  
  if (characters.length > 3 && characters.length < 16) professionalismScore += 5;

  professionalismScore = Math.max(0, Math.min(100, professionalismScore));

  let riskLevel = "low";
  if (riskScore >= 70) riskLevel = "critical";
  else if (riskScore >= 50) riskLevel = "high";
  else if (riskScore >= 30) riskLevel = "medium";

  let trustLevel = "trusted";
  if (suspicionScore >= 60) trustLevel = "untrusted";
  else if (suspicionScore >= 40) trustLevel = "suspicious";
  else if (suspicionScore >= 20) trustLevel = "questionable";

  let qualityLevel = "excellent";
  if (qualityScore < 40) qualityLevel = "poor";
  else if (qualityScore < 60) qualityLevel = "fair";
  else if (qualityScore < 80) qualityLevel = "good";

  let authenticityLevel = "authentic";
  if (authenticityScore < 40) authenticityLevel = "likely-fake";
  else if (authenticityScore < 60) authenticityLevel = "questionable";
  else if (authenticityScore < 80) authenticityLevel = "probably-authentic";

  let professionalismLevel = "professional";
  if (professionalismScore < 30) professionalismLevel = "unprofessional";
  else if (professionalismScore < 50) professionalismLevel = "casual";
  else if (professionalismScore < 70) professionalismLevel = "semi-professional";

  const overallScore = Math.round(
    (qualityScore * 0.3) + 
    ((100 - riskScore) * 0.25) + 
    ((100 - suspicionScore) * 0.2) +
    (authenticityScore * 0.15) +
    (professionalismScore * 0.1)
  );

  let recommendation = "acceptable";
  if (overallScore >= 80) recommendation = "highly-recommended";
  else if (overallScore >= 60) recommendation = "recommended";
  else if (overallScore >= 40) recommendation = "use-with-caution";
  else if (overallScore >= 20) recommendation = "not-recommended";
  else recommendation = "strongly-discouraged";

  return {
    style,
    scores: {
      overall: overallScore,
      quality: Math.round(qualityScore),
      security_risk: Math.round(riskScore),
      suspicion: Math.round(suspicionScore),
      authenticity: Math.round(authenticityScore),
      professionalism: Math.round(professionalismScore),
      entropy: Number(entropy.toFixed(2))
    },
    levels: {
      risk: riskLevel,
      trust: trustLevel,
      quality: qualityLevel,
      authenticity: authenticityLevel,
      professionalism: professionalismLevel
    },
    recommendation
  };
}