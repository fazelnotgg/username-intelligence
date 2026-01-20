# username-intelligence

**Global Username Analysis & Security Scoring Library**

`username-intelligence` is an advanced, lightweight library designed to analyze usernames for modern applications. Beyond simple regex validation, it evaluates **security context**, **bot patterns**, **spoofing risks**, and supports **hundreds of global language scripts** (Unicode).

Perfect for:
- Detecting spam/bot accounts during registration.
- Preventing **Impersonation Attacks** (e.g., Homoglyph attacks like Cyrillic 'a' vs Latin 'a').
- Gamifying user onboarding by scoring username quality.
- enforcing professional or safe naming conventions.

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