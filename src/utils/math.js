export function calculateEntropy(str) {
  if (!str) return 0;
  
  const len = str.length;
  const frequencies = {};

  for (const char of str) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }

  let entropy = 0;
  for (const char in frequencies) {
    const p = frequencies[char] / len;
    entropy -= p * Math.log2(p);
  }

  return entropy;
}

export function calculateNormalizedEntropy(str) {
  if (!str || str.length === 0) return 0;
  
  const entropy = calculateEntropy(str);
  const maxEntropy = Math.log2(str.length);
  
  return maxEntropy > 0 ? entropy / maxEntropy : 0;
}

export function calculateMetricEntropy(str) {
  if (!str) return 0;
  
  const uniqueChars = new Set(str).size;
  const charsetEntropy = Math.log2(uniqueChars);
  const distributionEntropy = calculateEntropy(str);
  
  return (charsetEntropy + distributionEntropy) / 2;
}

export function analyzeBigrams(str) {
  if (str.length < 2) return { count: 0, entropy: 0, repetition: 0 };
  
  const bigrams = {};
  let total = 0;
  
  for (let i = 0; i < str.length - 1; i++) {
    const bigram = str.slice(i, i + 2);
    bigrams[bigram] = (bigrams[bigram] || 0) + 1;
    total++;
  }
  
  let entropy = 0;
  let maxCount = 0;
  
  for (const count of Object.values(bigrams)) {
    const p = count / total;
    entropy -= p * Math.log2(p);
    maxCount = Math.max(maxCount, count);
  }
  
  const repetition = maxCount / total;
  
  return {
    count: Object.keys(bigrams).length,
    entropy: Number(entropy.toFixed(3)),
    repetition: Number(repetition.toFixed(3)),
    unique_ratio: Number((Object.keys(bigrams).length / total).toFixed(3))
  };
}

export function analyzeComplexity(str) {
  const hasLower = /[a-z]/.test(str);
  const hasUpper = /[A-Z]/.test(str);
  const hasDigit = /\d/.test(str);
  const hasSpecial = /[^a-zA-Z0-9]/.test(str);
  const hasUnicode = /[^\x00-\x7F]/.test(str);
  
  let charsetSize = 0;
  if (hasLower) charsetSize += 26;
  if (hasUpper) charsetSize += 26;
  if (hasDigit) charsetSize += 10;
  if (hasSpecial) charsetSize += 32;
  if (hasUnicode) charsetSize += 1000;
  
  const theoreticalEntropy = str.length * Math.log2(charsetSize);
  const actualEntropy = calculateEntropy(str) * str.length;
  
  const efficiency = theoreticalEntropy > 0 
    ? actualEntropy / theoreticalEntropy 
    : 0;
  
  return {
    charset_size: charsetSize,
    theoretical_entropy: Number(theoreticalEntropy.toFixed(2)),
    actual_entropy: Number(actualEntropy.toFixed(2)),
    efficiency: Number(efficiency.toFixed(3))
  };
}