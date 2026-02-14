# Neon Charger: 3D Street Clash

A neon-themed two-player physical fighting game with a stronger 3D-style arena presentation and charged combat system.

## Gameplay updates

- Turn-based **Player 1 vs Player 2**.
- Physical actions: **Jab**, **Kick**, **Guard**.
- **Charge** builds energy for the special move.
- **Charged Slam** is a high-cost, high-damage finisher.
- Guard reduces incoming damage on the next hit.

## Run locally

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## How updates appear on GitHub

When gameplay/UI changes are made, the normal update flow is:

1. Edit files (`index.html`, `styles.css`, `game.js`, `README.md`).
2. Validate changes locally.
3. Commit to the branch.
4. Push branch and open/update PR.
5. Merge PR to update the default branch and GitHub Pages (if enabled).
