# Cookie & Local Storage Editor — Chrome Extension Plan

## Context

Open source Chrome extension for developers to view, create, edit, and delete cookies, localStorage, and sessionStorage for any active tab. Feels like a polished DevTools panel: clean, dark-themed, information-dense but not cluttered. Starting from a completely empty directory.

---

## Stack

| Concern | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite + `@crxjs/vite-plugin` |
| Styling | Tailwind CSS v3 |
| Icons | `lucide-react` |
| State | React Context + `useReducer` |
| Manifest | Chrome MV3 |

---

## Permissions (manifest.json)

```json
{
  "manifest_version": 3,
  "name": "Cookie & Storage Editor",
  "version": "1.0.0",
  "permissions": ["cookies", "storage", "tabs", "scripting", "activeTab"],
  "host_permissions": ["<all_urls>"],
  "action": {
    "default_popup": "src/popup/popup.html",
    "default_icon": { "16": "public/icons/icon16.png", "48": "public/icons/icon48.png", "128": "public/icons/icon128.png" }
  },
  "background": { "service_worker": "src/background/service-worker.ts", "type": "module" },
  "icons": { "16": "public/icons/icon16.png", "48": "public/icons/icon48.png", "128": "public/icons/icon128.png" }
}
```

**Why these permissions:**
- `cookies` → `chrome.cookies.*` API (read/write/delete cookies)
- `scripting` + `activeTab` → `chrome.scripting.executeScript` for localStorage/sessionStorage (page-context only, unreachable from extension directly)
- `tabs` → resolve active tab URL and domain
- `<all_urls>` → required for cookie access across all domains

---

## Features (Phased)

### Phase 1 — Core (must ship)
- Cookie viewer: all fields (name, value, domain, path, expires, secure, httpOnly, sameSite)
- Cookie CRUD: inline expanded-row edit form, inline delete confirmation (no full-screen modal)
- localStorage + sessionStorage viewer + CRUD via `executeScript` injection
- Search bar: debounced 200ms, filters by key/name or value, highlights matches in yellow
- Copy any value to clipboard: transient "Copied!" cell feedback for 1.5s
- Domain display in header derived from active tab

### Phase 2 — Polish
- Export all data (cookies + storage) as structured JSON download
- Import JSON with preview modal before applying
- Change highlight: yellow flash animation on rows just added/edited, persists as left-border accent for 30s
- IndexedDB viewer (read-only: databases + object stores via `executeScript`)
- Badge text in service worker showing cookie count for active domain

---

## UI Layout (600×520px popup — fixed, Chrome constraint)

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER (56px)                                                │
│  [🍪] DevStorage                    [export] [import] [⚙]   │
│  domain: accounts.google.com                                 │
├──────────────────────────────────────────────────────────────┤
│ TAB BAR (40px)                                               │
│  [Cookies (12)]  [Local Storage (5)]  [Session (2)]  [IDB]   │
├──────────────────────────────────────────────────────────────┤
│ TOOLBAR (40px)                                               │
│  [🔍 Search…]                          [+ Add]  [Clear All]  │
├──────────────────────────────────────────────────────────────┤
│ TABLE HEADER (32px)                                          │
│  Name            Value         Expires    Flags    Actions   │
├──────────────────────────────────────────────────────────────┤
│ TABLE BODY (scrollable, ~330px)                              │
│  session_id      abc123def…    Session    S H      [✏][🗑]   │
│ ▼ EXPANDED EDIT ROW (blue left border)                       │
│  ┌ Name[_______] Value[___________________] Domain[___]  ┐  │
│  │ Path[/] Expires[date picker]                           │  │
│  │ [x] Secure  [x] HttpOnly  SameSite: [Strict ▼]        │  │
│  │                                   [Cancel]  [Save]    │  │
│  └────────────────────────────────────────────────────── ┘  │
│  __gads         eyJhbG…        2026-06-07  S      [✏][🗑]   │
├──────────────────────────────────────────────────────────────┤
│ STATUS BAR (24px)                                            │
│  12 cookies  ·  3 matching filter  ·  refreshed: just now   │
└──────────────────────────────────────────────────────────────┘
```

### Interaction Flows
- **Edit**: click ✏ → row expands in-place. `Esc` cancels, `Enter` on last field saves.
- **Add**: click `+ Add` → empty edit row appears at top of table. Same form fields.
- **Delete**: click 🗑 → inline `[Cancel] [Delete]` replaces action buttons. No modal.
- **Clear All**: two-step — first click turns button to `[Confirm Clear]` (red, 3s timeout).
- **Copy**: click any value cell → clipboard → cell shows "Copied!" for 1.5s.
- **Search**: live filter as user types. Matching substring highlighted in yellow.

### Table Columns

**Cookies tab:**
| Column | Width | Notes |
|---|---|---|
| Name | 160px | Monospace, truncated with tooltip |
| Value | flex-1 | Monospace, truncated, click to copy |
| Expires | 90px | "Session" or relative date |
| Flags | 60px | Badge icons: S=Secure, H=HttpOnly, SS=SameSite |
| Actions | 64px | Edit + Delete icon buttons |

**Storage tabs (localStorage / sessionStorage):**
| Column | Width | Notes |
|---|---|---|
| Key | 200px | Monospace, truncated |
| Value | flex-1 | Monospace, truncated, click to copy |
| Size | 56px | Byte count |
| Actions | 64px | Edit + Delete |

---

## Project Structure

```
cookie-and-local-storage-editor-extension/
├── public/
│   └── icons/
│       ├── icon16.png
│       ├── icon48.png
│       └── icon128.png
├── src/
│   ├── popup/
│   │   ├── main.tsx                    # ReactDOM.createRoot entry point
│   │   ├── App.tsx                     # Root component, switches DataPanel by active tab
│   │   ├── popup.html                  # HTML shell for the popup
│   │   │
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx          # App title + domain + action buttons
│   │   │   │   ├── DomainBadge.tsx     # Styled domain chip
│   │   │   │   ├── TabBar.tsx          # Tab switcher with counts
│   │   │   │   ├── TabButton.tsx       # Individual tab with active indicator
│   │   │   │   ├── Toolbar.tsx         # SearchBar + Add + ClearAll
│   │   │   │   └── StatusBar.tsx       # Count + filter count + refresh time
│   │   │   │
│   │   │   ├── cookies/
│   │   │   │   ├── CookiePanel.tsx     # Wraps CookieTable, passes filtered data
│   │   │   │   ├── CookieTable.tsx     # Full table with header + rows
│   │   │   │   ├── CookieRow.tsx       # Single row + expand toggle
│   │   │   │   ├── EditCookieForm.tsx  # Inline expanded form (create or edit)
│   │   │   │   └── CookieFlags.tsx     # Renders S/H/SameSite badge pills
│   │   │   │
│   │   │   ├── storage/
│   │   │   │   ├── StoragePanel.tsx    # Shared for localStorage + sessionStorage
│   │   │   │   ├── StorageTable.tsx
│   │   │   │   ├── StorageRow.tsx
│   │   │   │   └── EditStorageForm.tsx # Key + Value fields only
│   │   │   │
│   │   │   ├── indexeddb/
│   │   │   │   ├── IndexedDBPanel.tsx  # Read-only IDB viewer
│   │   │   │   ├── DatabaseList.tsx
│   │   │   │   └── ObjectStoreViewer.tsx
│   │   │   │
│   │   │   └── shared/
│   │   │       ├── SearchBar.tsx       # Debounced input with magnifier icon
│   │   │       ├── EmptyState.tsx      # Contextual empty messages
│   │   │       ├── ConfirmInline.tsx   # Inline [Cancel][Delete] replace pattern
│   │   │       ├── Toast.tsx           # Single toast component
│   │   │       ├── ToastContainer.tsx  # Portal-rendered toast queue
│   │   │       ├── ImportModal.tsx     # File picker + JSON preview before apply
│   │   │       ├── ValueCell.tsx       # Truncated value + copy-to-clipboard
│   │   │       ├── Badge.tsx           # Pill badge (Secure, HttpOnly, etc.)
│   │   │       └── Tooltip.tsx         # Hover tooltip for truncated text
│   │   │
│   │   ├── context/
│   │   │   ├── AppContext.tsx          # Main state + dispatch (useReducer)
│   │   │   └── ToastContext.tsx        # Toast queue management
│   │   │
│   │   ├── hooks/
│   │   │   ├── useCookies.ts           # CRUD ops + auto-refresh via chrome.cookies.*
│   │   │   ├── useStorage.ts           # localStorage + sessionStorage via executeScript
│   │   │   ├── useIndexedDB.ts         # Read-only IDB introspection via executeScript
│   │   │   ├── useActiveTab.ts         # Resolves tabId, url, domain from chrome.tabs
│   │   │   ├── useSearch.ts            # Filter + highlight substring logic
│   │   │   ├── useKeyboard.ts          # Global keyboard shortcuts
│   │   │   └── useClipboard.ts         # Copy with transient "Copied!" feedback
│   │   │
│   │   ├── types/
│   │   │   ├── cookie.types.ts         # ChromeCookie, ChromeCookieInput
│   │   │   ├── storage.types.ts        # StorageEntry { key, value }
│   │   │   ├── indexeddb.types.ts      # IDBDatabaseInfo, IDBStoreInfo
│   │   │   └── app.types.ts            # AppState, Action union, Tab enum
│   │   │
│   │   └── utils/
│   │       ├── cookie.utils.ts         # Parse expires, format flags, build url from tab
│   │       ├── storage.utils.ts        # Byte size calculation
│   │       ├── export.utils.ts         # JSON serialization for export/import
│   │       ├── highlight.utils.ts      # Substring highlight for search results
│   │       └── date.utils.ts           # Relative date formatting ("in 3 days", "Session")
│   │
│   ├── background/
│   │   └── service-worker.ts           # chrome.cookies.onChanged listener, badge text
│   │
│   └── content/
│       └── storage-bridge.ts           # (minimal) if scripting injection needs helper
│
├── manifest.json
├── vite.config.ts                      # @crxjs/vite-plugin setup
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── postcss.config.js
├── .gitignore
├── package.json
└── README.md
```

---

## Critical Implementation Details

### localStorage / sessionStorage Access

These live in page context, unreachable from extension directly. Must use script injection:

```ts
// Read all localStorage entries
chrome.scripting.executeScript({
  target: { tabId },
  func: () => Object.entries(localStorage),
  // returns [[key, value], ...]
});

// Write
chrome.scripting.executeScript({
  target: { tabId },
  func: (key, value) => { localStorage.setItem(key, value); },
  args: [key, value],
});

// Delete
chrome.scripting.executeScript({
  target: { tabId },
  func: (key) => { localStorage.removeItem(key); },
  args: [key],
});
```

Same pattern for sessionStorage, swap `localStorage` → `sessionStorage`.

### Cookie CRUD

```ts
// The `url` must come from the tab's full URL, not just domain string
chrome.cookies.getAll({ domain })
chrome.cookies.set({ url, name, value, domain, path, secure, httpOnly, sameSite, expirationDate })
chrome.cookies.remove({ url, name })
```

### AppState Shape

```ts
interface AppState {
  activeTab: 'cookies' | 'localStorage' | 'sessionStorage' | 'indexedDB';
  domain: string;
  tabId: number | null;
  tabUrl: string | null;
  cookies: ChromeCookie[];
  localStorage: StorageEntry[];
  sessionStorage: StorageEntry[];
  indexedDBDatabases: IDBDatabaseInfo[];
  searchQuery: string;
  expandedRowId: string | null;   // cookie name or storage key
  addingNew: boolean;
  loading: Record<'cookies' | 'localStorage' | 'sessionStorage' | 'indexedDB', boolean>;
  error: string | null;
  recentlyChanged: Set<string>;   // row IDs cleared after 30s
}
```

### MV3 Service Worker Gotchas
- All event listeners must be registered at top level (not inside callbacks)
- No `window`/`document` access — use `chrome.storage` not `localStorage`
- No `setTimeout`/`setInterval` — use `chrome.alarms` for recurring tasks
- All code must be bundled — no remote code execution, no `eval()`
- Service worker path in manifest must resolve via Vite build output

---

## Design System (Tailwind, dark-first)

| Token | Tailwind | Hex |
|---|---|---|
| App background | `gray-950` | `#0a0a0a` |
| Surface | `gray-900` | `#111827` |
| Surface raised | `gray-800` | `#1f2937` |
| Row hover | custom gray-750 | `#1a2236` |
| Border | `gray-700` | `#374151` |
| Text primary | `gray-50` | `#f9fafb` |
| Text secondary | `gray-400` | `#9ca3af` |
| Accent | `blue-500` | `#3b82f6` |
| Accent hover | `blue-400` | `#60a5fa` |
| Danger | `red-500` | `#ef4444` |
| Success | `green-500` | `#22c55e` |
| Change highlight | `yellow-400/20` | keyframe fade-out 3s |

**Typography:**
- Values + keys: `font-mono text-xs`
- Table headers: `text-xs font-semibold uppercase tracking-wide text-gray-400`
- Row height: 36px
- Badge text: `text-[10px] font-bold uppercase`

**Buttons:**
- Primary: `bg-blue-600 hover:bg-blue-500 text-white rounded-md px-3 py-1.5 text-sm`
- Danger: `bg-red-600 hover:bg-red-500 text-white`
- Ghost: `border border-gray-600 hover:border-gray-400 text-gray-300`
- Icon: `p-1.5 rounded text-gray-400 hover:text-gray-100 hover:bg-gray-800`

**Expanded edit row:** `bg-gray-800 border-l-2 border-l-blue-500`
**New/changed row:** `animate-[flashNew_3s_ease-out_forwards] border-l-2 border-l-yellow-500`

**Tailwind keyframe to add in config:**
```ts
keyframes: {
  flashNew: {
    '0%':   { backgroundColor: 'rgb(234 179 8 / 0.25)' },
    '100%': { backgroundColor: 'transparent' },
  }
}
```

---

## Keyboard Shortcuts (useKeyboard.ts)

| Key | Action |
|---|---|
| `Cmd/Ctrl+F` | Focus search bar |
| `Cmd/Ctrl+N` | Open add-new form |
| `Esc` | Cancel edit / close modal / clear search |
| `1` / `2` / `3` / `4` | Switch to Cookies / LocalStorage / SessionStorage / IndexedDB |
| `Cmd/Ctrl+E` | Export current tab data |
| `Enter` | Save current form |
| `Tab` / `Shift+Tab` | Navigate form fields |

---

## Export/Import JSON Format

```json
{
  "version": 1,
  "exportedAt": "2026-06-07T06:00:00Z",
  "domain": "accounts.google.com",
  "cookies": [
    {
      "name": "session_id", "value": "abc123",
      "domain": ".google.com", "path": "/",
      "expirationDate": 1780000000,
      "secure": true, "httpOnly": true, "sameSite": "Strict"
    }
  ],
  "localStorage": [{ "key": "theme", "value": "dark" }],
  "sessionStorage": [{ "key": "lastRoute", "value": "/dashboard" }]
}
```

---

## Implementation Sequence

1. **Scaffold** — `npm create vite` (React + TypeScript), install deps, write `manifest.json` + `vite.config.ts`, confirm popup loads in Chrome
2. **Data layer** — `useActiveTab` → `useCookies` → `useStorage` → wire all into `AppContext`
3. **Core UI** — Header, TabBar, StatusBar; then CookieTable + StorageTable (read-only display first)
4. **Write ops** — EditCookieForm, EditStorageForm, ConfirmInline delete, ClearAll two-step
5. **Polish** — Toast system, ValueCell copy, useKeyboard shortcuts, EmptyState, change-highlight animation
6. **Phase 2** — Export/Import JSON, IndexedDB panel, service worker badge

---

## Dependencies

```bash
# Runtime
react react-dom
lucide-react

# Dev
vite @vitejs/plugin-react @crxjs/vite-plugin
typescript @types/react @types/react-dom @types/chrome
tailwindcss autoprefixer postcss
```

---

## Verification Steps

1. Build: `npm run build` — no TypeScript errors
2. Load unpacked extension from `dist/` in `chrome://extensions` (Developer Mode)
3. Navigate to any site, open popup — cookies table populates with domain's cookies
4. Edit a cookie value → verify change in DevTools → Application → Cookies
5. Create and delete a localStorage entry → verify in DevTools → Application → Local Storage
6. Search filters correctly; copy to clipboard works (paste to verify)
7. Export JSON → open file → verify structure matches format above
8. Import same JSON → verify entries are restored
