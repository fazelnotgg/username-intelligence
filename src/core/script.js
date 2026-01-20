import { UNICODE_SCRIPTS } from "../data/scripts.js";

const SAFE_MIX_PAIRS = [
  ["Latin", "Han"],
  ["Latin", "Hiragana"],
  ["Latin", "Katakana"],
  ["Latin", "Hangul"],
  ["Latin", "Cyrillic"],
  ["Latin", "Greek"],
  ["Latin", "Arabic"],
  ["Latin", "Hebrew"],
  ["Latin", "Thai"],
  ["Latin", "Devanagari"],
  ["Han", "Hiragana"],
  ["Han", "Katakana"],
  ["Hiragana", "Katakana"],
  ["Han", "Hiragana", "Katakana"],
  ["Han", "Hangul"],
  ["Han", "Bopomofo"],
  ["Arabic", "Persian"],
  ["Devanagari", "Bengali"],
  ["Cyrillic", "Latin"]
];

const IGNORED_SCRIPTS = ["Common", "Inherited"];

const RTL_SCRIPTS = ["Arabic", "Hebrew", "Syriac", "Thaana", "Nko"];

const CONFUSABLE_PAIRS = [
  { original: /[а-яА-Я]/g, script: "Cyrillic" },
  { original: /[α-ωΑ-Ω]/g, script: "Greek" }
];

export function detectScript(username) {
  const detected = {};
  let totalDetected = 0;
  const len = username.length;

  for (const script of UNICODE_SCRIPTS) {
    try {
      const regex = new RegExp(`\\p{Script=${script}}`, 'gu');
      const match = username.match(regex);
      
      if (match) {
        detected[script] = match.length;
        totalDetected += match.length;
      }
    } catch (e) {
      continue;
    }
  }

  const emojiRegex = /\p{Emoji_Presentation}/gu;
  const emojiMatch = username.match(emojiRegex);
  const emojiCount = emojiMatch ? emojiMatch.length : 0;
  
  if (emojiCount > 0) {
    detected["Emoji"] = emojiCount;
    totalDetected += emojiCount;
  }

  const unknownCount = len - totalDetected;
  if (unknownCount > 0) {
    detected["Unknown"] = unknownCount;
  }

  const activeScripts = Object.keys(detected).filter(s => 
    !IGNORED_SCRIPTS.includes(s) && s !== "Unknown" && s !== "Emoji"
  );

  let primary = "Unknown";
  let secondary = null;
  let max = 0;
  let secondMax = 0;

  for (const [script, count] of Object.entries(detected)) {
    if (!IGNORED_SCRIPTS.includes(script)) {
      if (count > max) {
        secondMax = max;
        secondary = primary !== "Unknown" ? primary : null;
        max = count;
        primary = script;
      } else if (count > secondMax && script !== primary) {
        secondMax = count;
        secondary = script;
      }
    }
  }

  if (primary === "Unknown" && activeScripts.length === 0) {
    const commonCount = detected["Common"] || 0;
    const inheritedCount = detected["Inherited"] || 0;
    if (commonCount + inheritedCount > 0) {
      primary = "Common";
    }
  }

  const isMixed = activeScripts.length > 1;
  const isRTL = RTL_SCRIPTS.includes(primary);
  const hasRTL = activeScripts.some(s => RTL_SCRIPTS.includes(s));
  const hasBidiMix = hasRTL && activeScripts.some(s => !RTL_SCRIPTS.includes(s) && s !== "Common");

  let isDangerousMix = false;

  if (isMixed) {
    activeScripts.sort();
    const currentMix = activeScripts.join(",");
    
    let isSafe = false;
    for (const pair of SAFE_MIX_PAIRS) {
      const safePair = [...pair].sort().join(",");
      if (currentMix === safePair) {
        isSafe = true;
        break;
      }
    }
    
    if (!isSafe) {
      const cjk = ["Han", "Hiragana", "Katakana", "Hangul", "Bopomofo"];
      const cyrillic = ["Cyrillic"];
      const latin = ["Latin"];
      
      const isAllCJK = activeScripts.every(s => cjk.includes(s));
      const hasCyrillicLatin = activeScripts.some(s => cyrillic.includes(s)) && 
                               activeScripts.some(s => latin.includes(s));
      
      if (!isAllCJK) {
        if (hasCyrillicLatin) {
          isDangerousMix = true;
        } else if (activeScripts.length > 3) {
          isDangerousMix = true;
        } else {
          const hasLatin = activeScripts.includes("Latin");
          const otherScripts = activeScripts.filter(s => s !== "Latin");
          if (hasLatin && otherScripts.length > 2) {
            isDangerousMix = true;
          }
        }
      }
    }

    if (hasBidiMix) {
      isDangerousMix = true;
    }
  }

  const scriptDiversity = activeScripts.length / Math.max(1, len);

  return {
    primary,
    secondary,
    detected: Object.keys(detected),
    counts: detected,
    is_mixed: isMixed,
    is_dangerous_mix: isDangerousMix,
    is_rtl: isRTL,
    has_rtl: hasRTL,
    has_bidi_mix: hasBidiMix,
    has_emoji: emojiCount > 0,
    script_diversity: Number(scriptDiversity.toFixed(3)),
    active_scripts: activeScripts
  };
}