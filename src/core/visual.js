export function analyzeVisual(username, characters) {
  const chars = [...username];
  
  const visualComplexity = calculateVisualComplexity(chars);
  const readability = calculateReadability(chars, characters);
  const aesthetics = analyzeAesthetics(chars);
  const balance = analyzeVisualBalance(chars);
  const distinctiveness = calculateDistinctiveness(chars);
  const width = estimateVisualWidth(chars);
  
  return {
    visual_complexity: visualComplexity,
    readability_score: readability,
    aesthetic_score: aesthetics.score,
    aesthetic_features: aesthetics.features,
    balance_score: balance.score,
    balance_type: balance.type,
    distinctiveness: distinctiveness,
    estimated_width: width.value,
    width_category: width.category,
    has_wide_chars: width.hasWide,
    has_narrow_chars: width.hasNarrow,
    has_fullwidth: width.hasFullwidth,
    visual_density: calculateVisualDensity(chars, characters)
  };
}

function calculateVisualComplexity(chars) {
  let complexity = 0;
  
  for (const char of chars) {
    const code = char.codePointAt(0);
    
    if (code >= 0x4E00 && code <= 0x9FFF) {
      complexity += 3;
    } else if (code >= 0x3400 && code <= 0x4DBF) {
      complexity += 3;
    } else if (/\p{M}/u.test(char)) {
      complexity += 1;
    } else if (/[A-Z]/.test(char)) {
      complexity += 1.5;
    } else if (/[a-z0-9]/.test(char)) {
      complexity += 1;
    } else if (/[!@#$%^&*()_+={}[\]:;"'<>,.?/\\|`~]/.test(char)) {
      complexity += 1.2;
    } else {
      complexity += 2;
    }
  }
  
  const avgComplexity = chars.length > 0 ? complexity / chars.length : 0;
  
  return Number(avgComplexity.toFixed(2));
}

function calculateReadability(chars, characters) {
  let score = 100;
  
  if (characters.symbols > 0) {
    score -= characters.symbols * 8;
  }
  
  if (characters.combining_chars > 5) {
    score -= characters.combining_chars * 3;
  }
  
  if (characters.uppercase_ratio > 0.7 && characters.length > 5) {
    score -= 20;
  }
  
  if (characters.unique_ratio < 0.4) {
    score -= 15;
  }
  
  const hasSpacing = /[._\-\s]/.test(chars.join(''));
  if (hasSpacing && characters.length > 8) {
    score += 10;
  }
  
  if (characters.length > 20) {
    score -= (characters.length - 20) * 2;
  }
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

function analyzeAesthetics(chars) {
  const features = [];
  let score = 50;
  
  const hasSymmetry = checkSymmetry(chars);
  if (hasSymmetry) {
    features.push("symmetric");
    score += 15;
  }
  
  const hasPattern = checkPattern(chars);
  if (hasPattern) {
    features.push("patterned");
    score += 10;
  }
  
  const hasAlternation = checkAlternation(chars);
  if (hasAlternation) {
    features.push("alternating");
    score += 10;
  }
  
  const caseVariety = checkCaseVariety(chars);
  if (caseVariety === "mixed") {
    features.push("mixed-case");
    score += 5;
  } else if (caseVariety === "title") {
    features.push("title-case");
    score += 15;
  }
  
  const hasDecorative = chars.some(c => /[✨🌟⭐★☆♥♡▪▫●○◆◇■□▲△]/.test(c));
  if (hasDecorative) {
    features.push("decorative");
    score += 8;
  }
  
  const hasEmoji = chars.some(c => /\p{Emoji}/u.test(c));
  if (hasEmoji) {
    features.push("emoji");
    score += 12;
  }
  
  if (chars.length > 25) {
    score -= 20;
  }
  
  return {
    score: Math.max(0, Math.min(100, score)),
    features
  };
}

function checkSymmetry(chars) {
  if (chars.length < 4) return false;
  
  const mid = Math.floor(chars.length / 2);
  const left = chars.slice(0, mid).join('');
  const right = chars.slice(-mid).reverse().join('');
  
  return left === right;
}

function checkPattern(chars) {
  if (chars.length < 4) return false;
  
  const pattern2 = chars.slice(0, 2).join('');
  const restWith2 = chars.slice(2).join('');
  if (restWith2.includes(pattern2)) return true;
  
  const pattern3 = chars.slice(0, 3).join('');
  const restWith3 = chars.slice(3).join('');
  if (restWith3.includes(pattern3)) return true;
  
  return false;
}

function checkAlternation(chars) {
  if (chars.length < 4) return false;
  
  let alternations = 0;
  for (let i = 1; i < chars.length; i++) {
    const prevType = getCharType(chars[i - 1]);
    const currType = getCharType(chars[i]);
    if (prevType !== currType) alternations++;
  }
  
  return alternations / (chars.length - 1) > 0.5;
}

function getCharType(char) {
  if (/[a-zA-Z]/.test(char)) return "letter";
  if (/[0-9]/.test(char)) return "digit";
  return "other";
}

function checkCaseVariety(chars) {
  const str = chars.join('');
  const hasUpper = /[A-Z]/.test(str);
  const hasLower = /[a-z]/.test(str);
  
  if (!hasUpper && !hasLower) return "no-case";
  if (!hasUpper) return "lowercase";
  if (!hasLower) return "uppercase";
  
  if (/^[A-Z][a-z]+$/.test(str)) return "title";
  if (/^[A-Z][a-z]+[A-Z][a-z]+/.test(str)) return "camel";
  
  return "mixed";
}

function analyzeVisualBalance(chars) {
  if (chars.length === 0) return { score: 0, type: "empty" };
  
  let leftWeight = 0;
  let rightWeight = 0;
  const mid = chars.length / 2;
  
  chars.forEach((char, idx) => {
    const weight = getCharWeight(char);
    if (idx < mid) {
      leftWeight += weight;
    } else {
      rightWeight += weight;
    }
  });
  
  const totalWeight = leftWeight + rightWeight;
  const balanceRatio = totalWeight > 0 
    ? Math.min(leftWeight, rightWeight) / Math.max(leftWeight, rightWeight)
    : 0;
  
  let type = "unbalanced";
  if (balanceRatio > 0.8) type = "balanced";
  else if (balanceRatio > 0.6) type = "mostly-balanced";
  else if (leftWeight > rightWeight * 1.5) type = "left-heavy";
  else if (rightWeight > leftWeight * 1.5) type = "right-heavy";
  
  return {
    score: Number((balanceRatio * 100).toFixed(1)),
    type
  };
}

function getCharWeight(char) {
  const code = char.codePointAt(0);
  
  if (code >= 0x4E00 && code <= 0x9FFF) return 3;
  if (code >= 0x3400 && code <= 0x4DBF) return 3;
  if (/[A-Z]/.test(char)) return 2;
  if (/[a-z0-9]/.test(char)) return 1;
  if (/\p{M}/u.test(char)) return 0.5;
  
  return 1.5;
}

function calculateDistinctiveness(chars) {
  const confusableSets = [
    ['l', '1', 'I', '|'],
    ['o', '0', 'O'],
    ['s', '5', 'S'],
    ['z', '2', 'Z'],
    ['b', '8', 'B'],
    ['g', '9', 'q'],
    ['vv', 'w', 'VV', 'W']
  ];
  
  let distinctScore = 100;
  
  for (const confusableSet of confusableSets) {
    const hasMultiple = confusableSet.filter(c => 
      chars.join('').includes(c)
    ).length;
    
    if (hasMultiple > 1) {
      distinctScore -= 15;
    }
  }
  
  const uniqueChars = new Set(chars).size;
  const uniqueRatio = chars.length > 0 ? uniqueChars / chars.length : 0;
  
  distinctScore += (uniqueRatio - 0.5) * 40;
  
  return Math.max(0, Math.min(100, Math.round(distinctScore)));
}

function estimateVisualWidth(chars) {
  let totalWidth = 0;
  let hasWide = false;
  let hasNarrow = false;
  let hasFullwidth = false;
  
  for (const char of chars) {
    const code = char.codePointAt(0);
    
    if ((code >= 0x4E00 && code <= 0x9FFF) || 
        (code >= 0x3400 && code <= 0x4DBF) ||
        (code >= 0xFF00 && code <= 0xFFEF)) {
      totalWidth += 2;
      hasWide = true;
      if (code >= 0xFF00 && code <= 0xFFEF) {
        hasFullwidth = true;
      }
    } else if (/[iIl1|:;',.]/.test(char)) {
      totalWidth += 0.5;
      hasNarrow = true;
    } else if (/[mMwW@]/.test(char)) {
      totalWidth += 1.5;
      hasWide = true;
    } else {
      totalWidth += 1;
    }
  }
  
  let category = "normal";
  const avgWidth = chars.length > 0 ? totalWidth / chars.length : 0;
  
  if (avgWidth > 1.5) category = "wide";
  else if (avgWidth < 0.8) category = "narrow";
  
  return {
    value: Number(totalWidth.toFixed(1)),
    category,
    hasWide,
    hasNarrow,
    hasFullwidth
  };
}

function calculateVisualDensity(chars, characters) {
  const marksRatio = characters.length > 0 
    ? characters.marks / characters.length 
    : 0;
  
  const combiningRatio = characters.length > 0
    ? characters.combining_chars / characters.length
    : 0;
  
  let density = 1.0;
  
  density += marksRatio * 2;
  density += combiningRatio * 3;
  
  const hasComplexScripts = chars.some(c => {
    const code = c.codePointAt(0);
    return (code >= 0x4E00 && code <= 0x9FFF) ||
           (code >= 0x0900 && code <= 0x097F) ||
           (code >= 0x0600 && code <= 0x06FF);
  });
  
  if (hasComplexScripts) density += 0.5;
  
  return Number(density.toFixed(2));
}