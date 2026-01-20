export function analyzeStructure(username) {
  const chars = [...username];
  const len = chars.length;

  const startsWithLetter = /^\p{L}/u.test(username);
  const endsWithLetter = /\p{L}$/u.test(username);
  const startsWithNumber = /^\p{N}/u.test(username);
  const endsWithNumber = /\p{N}$/u.test(username);
  const startsWithSymbol = /^[\p{P}\p{S}]/u.test(username);
  const endsWithSymbol = /[\p{P}\p{S}]$/u.test(username);

  const segments = username.split(/[._\-\s]/);
  const segmentCount = segments.length;
  const avgSegmentLength = segmentCount > 0 
    ? segments.reduce((sum, seg) => sum + seg.length, 0) / segmentCount 
    : 0;

  const hasRepeatedSegments = segments.length !== new Set(segments).size;
  const longestSegment = Math.max(...segments.map(s => s.length), 0);
  const shortestSegment = Math.min(...segments.filter(s => s.length > 0).map(s => s.length), len);

  const transitions = [];
  let lastType = null;
  
  for (const char of chars) {
    let currentType;
    if (/\p{L}/u.test(char)) currentType = "letter";
    else if (/\p{N}/u.test(char)) currentType = "digit";
    else if (/\p{P}/u.test(char)) currentType = "punct";
    else if (/\p{S}/u.test(char)) currentType = "symbol";
    else if (/\p{Z}/u.test(char)) currentType = "space";
    else if (/\p{M}/u.test(char)) currentType = "mark";
    else currentType = "other";
    
    if (lastType && lastType !== currentType) {
      transitions.push(`${lastType}->${currentType}`);
    }
    lastType = currentType;
  }

  const transitionCount = transitions.length;
  const transitionRate = len > 1 ? transitionCount / (len - 1) : 0;
  const transitionDiversity = new Set(transitions).size;

  const prefixLength = Math.floor(len / 3);
  const suffixLength = Math.floor(len / 3);
  const prefix = username.slice(0, prefixLength);
  const suffix = username.slice(-suffixLength);
  const hasSymmetry = prefix === suffix.split('').reverse().join('');
  const hasPalindrome = username === username.split('').reverse().join('');

  const vowels = username.match(/[aeiouàáâãäåèéêëìíîïòóôõöùúûüýÿаэиоуыеёюя]/gi);
  const consonants = username.match(/[bcdfghjklmnpqrstvwxyzбвгджзклмнпрстфхцчшщ]/gi);
  const vowelCount = vowels ? vowels.length : 0;
  const consonantCount = consonants ? consonants.length : 0;
  const totalLetters = vowelCount + consonantCount;
  const vowelConsonantRatio = totalLetters > 0 ? vowelCount / totalLetters : 0;

  const alphaSegments = username.split(/[^a-zA-Z\u0400-\u04FF\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]+/).filter(s => s.length > 0);
  const numericSegments = username.split(/[^0-9]+/).filter(s => s.length > 0);

  const longestAlphaRun = alphaSegments.length > 0 
    ? Math.max(...alphaSegments.map(s => s.length)) 
    : 0;
  const longestNumericRun = numericSegments.length > 0 
    ? Math.max(...numericSegments.map(s => s.length)) 
    : 0;

  const hasBalancedStructure = 
    transitionRate > 0.1 && 
    transitionRate < 0.8 &&
    !hasRepeatedSegments &&
    vowelConsonantRatio > 0.2 && 
    vowelConsonantRatio < 0.8 &&
    segmentCount <= 4;

  const isReadable = 
    startsWithLetter &&
    vowelCount > 0 &&
    consonantCount > 0 &&
    totalLetters > len * 0.5 &&
    !hasRepeatedSegments;

  const complexity = {
    simple: transitionCount < 3 && segmentCount <= 1,
    moderate: transitionCount >= 3 && transitionCount < 8 && segmentCount <= 2,
    complex: transitionCount >= 8 || segmentCount > 2
  };

  let complexityLevel = "simple";
  if (complexity.complex) complexityLevel = "complex";
  else if (complexity.moderate) complexityLevel = "moderate";

  const characterRunAnalysis = analyzeCharacterRuns(chars);
  const boundaryAnalysis = analyzeBoundaries(username);
  const densityAnalysis = analyzeDensity(chars);
  const flowAnalysis = analyzeFlow(transitions);

  return {
    starts_with_letter: startsWithLetter,
    ends_with_letter: endsWithLetter,
    starts_with_number: startsWithNumber,
    ends_with_number: endsWithNumber,
    starts_with_symbol: startsWithSymbol,
    ends_with_symbol: endsWithSymbol,
    segment_count: segmentCount,
    avg_segment_length: Number(avgSegmentLength.toFixed(2)),
    longest_segment: longestSegment,
    shortest_segment: shortestSegment,
    has_repeated_segments: hasRepeatedSegments,
    transition_count: transitionCount,
    transition_rate: Number(transitionRate.toFixed(3)),
    transition_diversity: transitionDiversity,
    has_symmetry: hasSymmetry,
    is_palindrome: hasPalindrome,
    vowel_count: vowelCount,
    consonant_count: consonantCount,
    vowel_consonant_ratio: Number(vowelConsonantRatio.toFixed(3)),
    longest_alpha_run: longestAlphaRun,
    longest_numeric_run: longestNumericRun,
    has_balanced_structure: hasBalancedStructure,
    is_readable: isReadable,
    complexity_level: complexityLevel,
    character_runs: characterRunAnalysis,
    boundaries: boundaryAnalysis,
    density: densityAnalysis,
    flow: flowAnalysis
  };
}

function analyzeCharacterRuns(chars) {
  let currentChar = null;
  let currentRun = 0;
  let maxRun = 0;
  let runCount = 0;
  const runs = {};

  for (const char of chars) {
    if (char === currentChar) {
      currentRun++;
    } else {
      if (currentRun > 1) {
        runCount++;
        runs[currentChar] = (runs[currentChar] || 0) + 1;
      }
      maxRun = Math.max(maxRun, currentRun);
      currentChar = char;
      currentRun = 1;
    }
  }

  if (currentRun > 1) {
    runCount++;
    runs[currentChar] = (runs[currentChar] || 0) + 1;
  }
  maxRun = Math.max(maxRun, currentRun);

  return {
    max_run_length: maxRun,
    total_runs: runCount,
    has_long_runs: maxRun > 3,
    run_diversity: Object.keys(runs).length
  };
}

function analyzeBoundaries(username) {
  const wordBoundaries = (username.match(/\b/g) || []).length;
  const camelCaseBoundaries = (username.match(/[a-z][A-Z]/g) || []).length;
  const separatorBoundaries = (username.match(/[._\-]/g) || []).length;
  
  const totalBoundaries = wordBoundaries + camelCaseBoundaries + separatorBoundaries;
  
  return {
    word_boundaries: wordBoundaries,
    camel_case_boundaries: camelCaseBoundaries,
    separator_boundaries: separatorBoundaries,
    total_boundaries: totalBoundaries,
    has_clear_boundaries: totalBoundaries > 0
  };
}

function analyzeDensity(chars) {
  const density = {};
  
  const letterDensity = chars.filter(c => /\p{L}/u.test(c)).length / chars.length;
  const digitDensity = chars.filter(c => /\p{N}/u.test(c)).length / chars.length;
  const symbolDensity = chars.filter(c => /[\p{P}\p{S}]/u.test(c)).length / chars.length;
  const spaceDensity = chars.filter(c => /\p{Z}/u.test(c)).length / chars.length;
  
  density.letter = Number(letterDensity.toFixed(3));
  density.digit = Number(digitDensity.toFixed(3));
  density.symbol = Number(symbolDensity.toFixed(3));
  density.space = Number(spaceDensity.toFixed(3));
  
  let dominantType = "mixed";
  const max = Math.max(letterDensity, digitDensity, symbolDensity, spaceDensity);
  
  if (max === letterDensity && letterDensity > 0.7) dominantType = "letter-heavy";
  else if (max === digitDensity && digitDensity > 0.5) dominantType = "digit-heavy";
  else if (max === symbolDensity && symbolDensity > 0.3) dominantType = "symbol-heavy";
  
  density.dominant_type = dominantType;
  
  return density;
}

function analyzeFlow(transitions) {
  const flowPatterns = {
    smooth: 0,
    jagged: 0,
    repetitive: 0
  };
  
  const transitionCounts = {};
  for (const t of transitions) {
    transitionCounts[t] = (transitionCounts[t] || 0) + 1;
  }
  
  const uniqueTransitions = Object.keys(transitionCounts).length;
  const totalTransitions = transitions.length;
  
  if (totalTransitions === 0) {
    return {
      smoothness: 0,
      pattern: "none",
      transition_variety: 0
    };
  }
  
  const transitionVariety = uniqueTransitions / totalTransitions;
  
  if (transitionVariety > 0.7) {
    flowPatterns.smooth++;
  } else if (transitionVariety < 0.3) {
    flowPatterns.repetitive++;
  } else {
    flowPatterns.jagged++;
  }
  
  let pattern = "balanced";
  if (flowPatterns.smooth > flowPatterns.jagged && flowPatterns.smooth > flowPatterns.repetitive) {
    pattern = "smooth";
  } else if (flowPatterns.jagged > flowPatterns.smooth && flowPatterns.jagged > flowPatterns.repetitive) {
    pattern = "jagged";
  } else if (flowPatterns.repetitive > flowPatterns.smooth && flowPatterns.repetitive > flowPatterns.jagged) {
    pattern = "repetitive";
  }
  
  const smoothness = Number((transitionVariety * 100).toFixed(1));
  
  return {
    smoothness,
    pattern,
    transition_variety: Number(transitionVariety.toFixed(3))
  };
}