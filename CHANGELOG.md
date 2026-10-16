# Changelog

All notable changes to WebObsidian are documented here. This project tracks its product
design and version history in [PRD.md](PRD.md); the entries below summarize user-facing
changes. The format is loosely based on [Keep a Changelog](https://keepachangelog.com).

## [Unreleased]

## [0.3.0] - 2026-10-16

### Added
- **File explorer quick actions** — hover a folder row for *New note* / *New canvas*, and hover
  any row for *Delete*. Deleting asks for confirmation in an in-app dialog (native browser
  prompts are blocked in embedded browsers) and warns how many items a folder contains. On touch
  devices the buttons appear on the selected row; the delete button is also reachable by keyboard.
- **Double-click to rename** files, folders and canvases in the file explorer.
- **Manual sorting** — a new *Manual* sort mode. Drag to reorder: the top/bottom edge of a row
  inserts before/after it (with an insertion line) and the middle of a folder row moves the item
  into it. The order is saved with your workspace and kept when items are renamed or moved.
- **Trash retention** — items in `.trash` are permanently deleted after a configurable number of
  days (default 30, `0` keeps them forever), counted from when they were moved to the trash.
  *Settings → Vault & Files → Trash retention*.
- **Local attachment folders** — pasted and dropped images are saved in an `attachments/` folder
  next to the note and linked with relative paths. A trash icon on a rendered image removes it
  from the note and permanently deletes the file when nothing else uses it. These folders are
  hidden in the file explorer by default (*Show attachment folders* setting); a folder named
  `attachments` that contains notes is never hidden.
- **Floating document outline** — a margin outline for the current note with the active section
  highlighted as you scroll; hover for the heading list, click a heading to scroll to it with a
  smooth ease-in-out animation.
- **Human-readable note titles** — notes named like `my-first-note` show as "My First Note" in
  the file explorer and the note's title (display only — filenames are unchanged). A front
  matter `title` overrides it in the note view.
- **Reveal active file in explorer** — a setting (*Settings → Vault & Files*) that expands
  parent folders, scrolls to the active file and highlights it when you switch documents.

### Fixed
- Wrapped lines in bullet, task and ordered lists now line up under the text.
- Pasting several images that share a filename (such as `image.png`) no longer overwrites earlier
  ones, and every pasted image gets its link.
- Public share pages show the right image for notes with local attachments, including file names
  with spaces.

## [0.2.0] - 2026-10-15

### Added
- **Inline media embeds** — a YouTube, Instagram or Facebook link alone on a line renders as
  a player in Live and Reading modes and on public share pages. Only whitelisted providers
  embed; the iframe URL is rebuilt from validated IDs and sandboxed.
- **Link preview cards** — a pasted URL alone on a line becomes a rich card (title,
  description, thumbnail, domain). Metadata is fetched server-side with SSRF protection
  (private/loopback addresses blocked, redirects re-validated, size and time capped); links
  that cannot be previewed stay plain. `GET /api/linkpreview`.
- **Multi-cursor editing** — Option/Alt+Click adds a cursor, Shift+Alt+Drag selects a
  column, Esc returns to a single cursor.
- **Hanging indent for lists** — wrapped lines in bullets, tasks and ordered lists align
  under the text instead of the marker (nested lists and multi-digit numbers included).
- **YAML front matter highlighting** in Source mode (new dependency `@codemirror/lang-yaml`).

### Fixed
- Alt+Click no longer collapses multi-cursor selections in Live Preview.

## [0.1.3] and earlier

### Added
- Open-source repository scaffolding: `README.md` (with logo), `LICENSE` (MIT),
  `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, GitHub issue/PR templates and a
  CI workflow (typecheck, build, Docker image).
- File tree **Copy / Cut / Paste** for files and folders (session-local clipboard;
  `POST /api/files/copy` for recursive copy). *(PRD 0.9)*

### Changed
- ⋯ **More options** menu rebuilt for parity with Obsidian Desktop: backlinks-in-document,
  open linked view, open in new window, add file property, in-note Find, export to PDF,
  reveal file in navigation, and per-file version history. *(PRD 0.8)*

## Highlights by PRD revision

- **0.9** — File tree Copy/Cut/Paste; recursive copy endpoint.
- **0.8** — ⋯ menu parity with Obsidian Desktop; per-file Git version history (FR-4).
- **0.7** — Per-note **Share dialog** (create/copy/toggle/password/delete) + globe badge.
- **0.6** — Deploy hardening for self-hosting: all deploy params via `.env`, watcher polling
  fallback on inotify limits, longer healthcheck `start_period` (FR-9).
- **0.5** — Graph node search with smooth fly-to and highlighting (FR-2).
- **0.4** — Mobile / responsive UI: drawer sidebars, edge-swipe, on-keyboard formatting
  toolbar, touch targets, safe-area insets (FR-11).
- **0.3** — Per-pane ⋯ menu (split, bookmark, rename/move, etc.) and a redesigned right
  sidebar tab strip (Backlinks incl. unlinked mentions · Outgoing links · Tags · Outline).
- **0.2** — Deep-link URLs (`/note/...`), public read-only share links with central
  management, server-side rendering for SEO (FR-10).

## Core (v1 baseline)

- Obsidian-compatible vault (works on existing `.obsidian/` vaults).
- CodeMirror 6 editor with live/source/reading views; wikilinks, embeds, tags, callouts,
  tasks, KaTeX, Mermaid; backlinks, outline, graph view.
- QMD full-text + fielded search (MiniSearch), incremental indexing, disk persistence.
- GitHub sync (pull/commit/push) with Git LFS.
- Single master password login (scrypt + JWT cookie).
- Scoped Agent API at `/api/v1` with hashed API keys and rate limiting.
- Community-plugin loader against an Obsidian-API shim (subset).
- Pure-JSON config (`data/settings.json`); one-command Docker stack.

---

> Note: WebObsidian is pre-1.0 and has not cut tagged releases yet. Once releases begin,
> each version will get its own dated section here.
