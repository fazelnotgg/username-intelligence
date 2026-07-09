# Contributing to @fazelstudio/username-intelligence

We welcome contributions! Here's how to get started.

## Getting Started

1. Fork the repo
2. Clone: `git clone https://github.com/your-username/username-intelligence.git`
3. Install: `npm install`
4. Create a branch: `git checkout -b feat/your-feature`

## Development

```bash
npm run build
node test-optimization.js
```

## Adding New Detection Rules

- **Script detection**: Add entries to `src/data/scripts.js`
- **Homoglyph mappings**: Update `src/data/homoglyphs.js`
- **Leet speak**: Add to `src/data/leet.js`
- **Profanity filters**: Update `src/data/profanity.js`

## Commit Guidelines

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add Persian script detection
fix: handle edge case in entropy calculation
docs: update API reference
```

## Pull Request Process

1. Test your changes: `node test-optimization.js`
2. Update README if the public API changed
3. Open a PR with a clear description

## Questions?

Open a [Discussion](https://github.com/fazelllyyy/username-intelligence/discussions) or email zulfazlilsm@gmail.com.