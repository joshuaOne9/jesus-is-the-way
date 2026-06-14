# Video Feature Plan — The Spiritual Realm / Christian Website

**Goal:** Add a Videos page that can show both embedded links (YouTube, Vimeo) and self-hosted video files. Start admin-only, grow toward user accounts and user uploads.

**Stack:** React + Vite (existing) on Vercel + **Supabase** (Postgres database, file storage, authentication).

---

## Why Supabase

Your frontend stays on Vercel. Supabase adds the three things a static site can't do on its own:

- **Postgres database** — stores video metadata now, user profiles later (real SQL, a transferable career skill)
- **File storage** — holds the actual video files, with access rules
- **Auth** — built-in user accounts for the user-account phase (never build login from scratch)

It connects to React directly through a JavaScript SDK. No separate backend server to run or pay for.

---

## The data model (designed once, for the whole journey)

A single `videos` table, shaped now so it never needs a rebuild:

| Field | Purpose |
|-------|---------|
| `id` | Primary key (uuid) |
| `title` | Video title |
| `description` | Video description |
| `category` | e.g. deliverance, teaching, testimony |
| `source_type` | `'link'` or `'file'` — lets one table hold both embeds and uploads |
| `source_url` | The YouTube/Vimeo URL, or the storage path to an uploaded file |
| `thumbnail_url` | Optional preview image |
| `uploaded_by` | Who added it (you/empty now; a real user later) |
| `status` | `'approved'` / `'pending'` / `'rejected'` |
| `created_at` | Timestamp for sorting |

**The forward-compatibility trick:** today every row is yours and `'approved'`. The day a user uploads, their row lands as `uploaded_by = them, status = 'pending'` — same table, no migration. The moderation gate is built in from day one.

---

## Phased roadmap

### Phase 1 — You curate (1–2 sessions)
Set up Supabase, create the `videos` table, connect it to React. The Videos page *reads* from Supabase and renders both link-embeds and uploaded files. Manage content through the Supabase dashboard at first (drag a file into storage / add a row / paste a YouTube link). No custom upload UI needed yet.

### Phase 1.5 — Admin upload form (optional, 1 session)
A simple page where you (logged in) paste a link or pick a file and fill in details, instead of using the dashboard.

### Phase 2 — User accounts (2–3 sessions)
Turn on Supabase Auth. Build signup/login, user profiles, and logged-in-vs-not states. Resume-worthy: every real app has authentication.

### Phase 3 — Users upload (2–3 sessions)
Logged-in users submit videos that land as `'pending'`. Build an admin review queue to approve/reject. Row-Level Security enforces who can do what (users see their own pending + all approved; only admins approve). Schema's already ready, so this is mostly UI + rules.

---

## The honest caveat: video is expensive

Bandwidth (every view streams the file out) is the real cost driver, not storage. The free tier is plenty for building and a handful of portfolio videos, but it is not a streaming service.

If this grows into real traffic, move only the **file** layer to a purpose-built video host (Mux, Cloudflare Stream, Bunny) while keeping Supabase for the database and accounts. Because `source_url` is isolated, that swap is a small change, not a rewrite.

---

## Supabase free tier (as of mid-2026 — verify at supabase.com/pricing)

- **500 MB** Postgres database storage
- **1 GB** file storage *(the binding limit for video — a handful of compressed videos)*
- **~5 GB** outbound bandwidth / month *(CDN-served assets don't count against this)*
- **50,000** monthly active users (auth)
- **2** projects max
- **Gotcha:** free projects pause after 7 days of no database activity — log in to unpause

---

## Current status

- [ ] Phase 1: Supabase account + project created
- [ ] Phase 1: `videos` table designed
- [ ] Phase 1: React connected to Supabase
- [ ] Phase 1: Videos page renders links + files
- [ ] Phase 1.5: Admin upload form
- [ ] Phase 2: User accounts
- [ ] Phase 3: User uploads + moderation

*Suggested repo location: `docs/video-feature-plan.md`*
