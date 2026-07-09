# @fazelstudio/username-intelligence

[![npm version](https://img.shields.io/npm/v/@fazelstudio/username-intelligence.svg)](https://www.npmjs.com/package/@fazelstudio/username-intelligence) [![CI](https://github.com/fazelllyyy/username-intelligence/actions/workflows/ci.yml/badge.svg)](https://github.com/fazelllyyy/username-intelligence/actions/workflows/ci.yml) [![License](https://img.shields.io/npm/l/@fazelstudio/username-intelligence.svg)](https://opensource.org/licenses/MIT)

Advanced username analysis library with security scoring, Unicode script detection, homoglyph spoofing prevention, and bot detection — zero regex magic.

## Features

- 🌍 **Unicode Script Detection** — identifies scripts from 100+ languages (Latin, Cyrillic, Arabic, Hangul, Devanagari, etc.)
- 🛡️ **Spoofing Prevention** — detects homoglyph attacks (Cyrillic `а` vs Latin `a`) and invisible characters
- 🤖 **Bot & Spam Detection** — Shannon entropy analysis catches random keystrokes (`xcv892nm`)
- 🧠 **Smart Classification** — categorizes as Personal, Gamer, Corporate, Bot, Leet, and more
- 📊 **Quality Scoring** — 0–100 scores for readability and security risk
- 🔍 **Leet Speak Normalization** — `h4ck3r` → `hacker`, mathematical font stripping
- ⚡ **Batch Analysis** — analyze hundreds of usernames with built-in LRU cache
- 🪶 **Zero Dependencies** — lightweight, tree-shakeable ESM + CJS builds

## Installation

```bash
npm install @fazelstudio/username-intelligence
```

## Usage

### Basic Analysis

```javascript
import { analyzeUsername } from '@fazelstudio/username-intelligence';

const result = analyzeUsername('h4ck3r_man');

console.log(result.isValid);      // true
console.log(result.classification); // "Gamer"
console.log(result.security.risk_level); // "LOW"
```

### Example Output

```json
{
  "username": "h4ck3r_man",
  "score": 85,
  "classification": "Gamer",
  "isValid": true,
  "flags": ["leet_speak"],
  "security": {
    "risk_level": "LOW",
    "is_spoofing": false,
    "has_hidden_chars": false
  },
  "metadata": {
    "script": "Latin",
    "entropy": 2.5
  }
}
```

### Advanced Options

```javascript
const result = analyzeUsername('admin_support', {
  strict: true,
  blockProfanity: true,
  reservedWords: ['admin', 'support', 'mod'],
  checkVisual: true,
});
```

### Batch Analysis

```javascript
import { batchAnalyze } from '@fazelstudio/username-intelligence';

const results = batchAnalyze(['john_doe', 'xX_gamer_Xx', 'admin']);

results.forEach(r => {
  console.log(`${r.username}: ${r.analysis.classification.style} (score: ${r.analysis.classification.scores.quality})`);
});
```

## API Reference

| Function | Description |
|----------|-------------|
| `analyzeUsername(username, options?)` | Analyze a single username |
| `batchAnalyze(usernames, options?)` | Analyze multiple usernames |
| `clearCache()` | Clear the LRU analysis cache |
| `getCacheStats()` | Get cache hit/miss statistics |

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `strict` | `boolean` | `false` | Enable stricter validation rules |
| `blockProfanity` | `boolean` | `false` | Reject usernames containing profanity |
| `reservedWords` | `string[]` | `[]` | Custom blocked words |
| `checkVisual` | `boolean` | `true` | Check for visual spoofing |
| `enableCache` | `boolean` | `true` | Enable LRU result caching |
| `enableSecurity` | `boolean` | `true` | Enable security analysis |
| `enableLinguistic` | `boolean` | `true` | Enable linguistic analysis |
| `enableVisual` | `boolean` | `true` | Enable visual analysis |

## Use Cases

- **Registration Security** — block spoofed usernames during sign-up
- **Spam Prevention** — detect bot-generated random usernames
- **Brand Protection** — catch impersonation attempts (e.g. `раураl` with Cyrillic chars)
- **UX Gamification** — score username quality during onboarding
- **Moderation** — filter profanity and reserved words

## Development

```bash
npm install
npm run build
node test-optimization.js
npm run format
```

## License

MIT &mdash; &copy; 2026 [Fazel](https://github.com/fazelllyyy)

---

**username-intelligence** — Know who's behind the name.
