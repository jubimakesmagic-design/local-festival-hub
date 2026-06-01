# Contributing

Thanks for your interest in improving Local Festival Hub.

This project is an MVP for making small local festival and market information easier to discover, verify, and maintain. Contributions are welcome from developers, designers, documentation writers, civic-tech contributors, and people who understand local event data.

## Good First Contributions

- Improve accessibility and keyboard navigation
- Add tests for search, submission, or admin review flows
- Improve mobile layout and empty states
- Add or refine data-source collector prototypes
- Improve trust-score rules and explanations
- Improve documentation for setup, deployment, or data maintenance
- Report outdated sample data or confusing UX

## Development Setup

```bash
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Open `http://localhost:3000` after the dev server starts.

## Before Opening a Pull Request

Please run:

```bash
npm run lint
npm run build
```

If a command fails, include the failure details in the pull request so maintainers can reproduce it.

## Pull Request Guidelines

- Keep changes focused and easy to review.
- Include screenshots for visible UI changes.
- Add or update documentation when behavior changes.
- Explain the user or maintainer problem being solved.
- Avoid committing secrets, private data, local database dumps, or credentials.

## Issue Guidelines

When opening an issue, please include:

- What you expected to happen
- What actually happened
- Steps to reproduce
- Browser/device details for UI problems
- Screenshots or short screen recordings when useful

For security-sensitive reports, follow `SECURITY.md` instead of opening a public issue.
