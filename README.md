# Cookie & Storage Editor

Chrome extension (MV3) for viewing, creating, editing, and deleting cookies, localStorage, and sessionStorage for the active tab.

See [PLAN.md](./PLAN.md) for the full implementation plan.

## Development

```bash
bun install
bun run build
```

Then load the `dist/` directory as an unpacked extension via `chrome://extensions` (Developer Mode).
