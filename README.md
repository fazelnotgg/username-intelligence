# username-intelligence

[![npm version](https://img.shields.io/npm/v/username-intelligence.svg?style=flat)](https://www.npmjs.com/package/username-intelligence)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Global Username Analysis & Security Scoring Library**

`username-intelligence` is an advanced, lightweight library designed to analyze usernames for modern applications. Beyond simple regex validation, it evaluates **security context**, **bot patterns**, **spoofing risks**, and supports **hundreds of global language scripts** (Unicode).

Perfect for:
- 🛡️ Detecting spam/bot accounts during registration.
- 🎭 Preventing **Impersonation Attacks** (e.g., Homoglyph attacks like Cyrillic 'a' vs Latin 'a').
- 🎮 Gamifying user onboarding by scoring username quality.
- 🏢 Enforcing professional or safe naming conventions.

## Features

- 🌍 **Global Unicode Support**: Detects scripts from 100+ languages (Japanese, Arabic, Cyrillic, Hangul, etc.).
- 🛡️ **Security Risk Assessment**: Identifies **Mixed Script Attacks** (Spoofing) and invisible characters.
- 🤖 **Bot & Spam Detection**: Uses **Shannon Entropy** to detect random keystrokes (e.g., `xcv892nm`).
- 🧠 **Smart Classification**: Categorizes styles (Corporate, Gamer, Personal, Bot, etc.).
- 📊 **Quality Scoring**: Provides a 0-100 score for `readability` and `security_risk`.
- 🔍 **Normalization**: Handles "Leet Speak" (e.g., `h4ck3r` → `hacker`) and mathematical fonts.

## Installation

```bash
npm install username-intelligence
```

## Usage

### 1. Basic Analysis
**The easiest way to use the library. Simply pass a username to get a full analysis.**
```
import { analyzeUsername } from 'username-intelligence';

// Example: Analyzing a username with leet speak
const result = analyzeUsername('h4ck3r_man');

if (result.isValid) {
  console.log("Username is valid!");
} else {
  console.log("Username rejected:", result.reason);
}
```
### 2. Example Output
**This is the JSON data structure returned by the analyzeUsername function.**
```
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
### 3. Advanced Options
**You can customize the validation rules to fit your application needs.**
```
const options = {
  strict: true,             // If true, enables stricter validation
  blockProfanity: true,     // Automatically blocks profane words
  reservedWords: ['admin', 'support', 'mod'], // Custom list of forbidden words
  checkVisual: true         // Checks for visual similarity (e.g., adm1n == admin)
};

const result = analyzeUsername('admin_support', options);
```
### Contributing
**Contributions are welcome! Please feel free to submit a Pull Request.**
1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

### License
**Distributed under the MIT License. See LICENSE for more information.**