export function analyzeCharacters(username) {
  const chars = [...username];
  const length = chars.length;
  
  const lettersMatch = username.match(/\p{L}/gu);
  const numbersMatch = username.match(/\p{N}/gu);
  const uppercaseMatch = username.match(/\p{Lu}/gu);
  const lowercaseMatch = username.match(/\p{Ll}/gu);
  const whitespacesMatch = username.match(/\p{Z}/gu);
  const punctuationMatch = username.match(/\p{P}/gu);
  const symbolsMatch = username.match(/\p{S}/gu);
  const markMatch = username.match(/\p{M}/gu);
  const controlMatch = username.match(/\p{C}/gu);

  const letters = lettersMatch ? lettersMatch.length : 0;
  const numbers = numbersMatch ? numbersMatch.length : 0;
  const uppercase = uppercaseMatch ? uppercaseMatch.length : 0;
  const lowercase = lowercaseMatch ? lowercaseMatch.length : 0;
  const whitespaces = whitespacesMatch ? whitespacesMatch.length : 0;
  const punctuation = punctuationMatch ? punctuationMatch.length : 0;
  const symbols = symbolsMatch ? symbolsMatch.length : 0;
  const marks = markMatch ? markMatch.length : 0;
  const controls = controlMatch ? controlMatch.length : 0;

  const uppercaseRatio = letters > 0 ? uppercase / letters : 0;
  const lowercaseRatio = letters > 0 ? lowercase / letters : 0;
  const digitRatio = length > 0 ? numbers / length : 0;
  const letterRatio = length > 0 ? letters / length : 0;
  
  const uniqueChars = new Set(chars).size;
  const uniqueRatio = length > 0 ? uniqueChars / length : 0;

  const combiningChars = chars.filter(char => 
    /\p{M}/u.test(char)
  ).length;

  const emojiMatch = username.match(/\p{Emoji}/gu);
  const emoji = emojiMatch ? emojiMatch.length : 0;

  return {
    length,
    unique_chars: uniqueChars,
    unique_ratio: Number(uniqueRatio.toFixed(3)),
    letters,
    numbers,
    uppercase,
    lowercase,
    whitespaces,
    punctuation,
    symbols,
    marks,
    controls,
    emoji,
    combining_chars: combiningChars,
    uppercase_ratio: Number(uppercaseRatio.toFixed(3)),
    lowercase_ratio: Number(lowercaseRatio.toFixed(3)),
    digit_ratio: Number(digitRatio.toFixed(3)),
    letter_ratio: Number(letterRatio.toFixed(3))
  };
}