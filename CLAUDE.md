# Personal CRM

A local-first personal CRM for managing relationships with sphere-based contact frequency reminders.

## Stack
- **Frontend:** React 19 + Vite + TypeScript + Tailwind CSS v4
- **Backend:** Hono on Node.js (localhost:3001)
- **Database:** SQLite via @libsql/client + Drizzle ORM
- **State:** TanStack Query v5 (no Redux/Zustand)
- **Design:** Minimal, Linear/Notion-inspired. Inter font, indigo accent (#6366f1)

## Project Structure
- `server/` - Hono API server with routes for contacts, interactions, reminders, search, tags, settings
- `client/` - React SPA with pages for dashboard, contacts, contact detail, contact form, activity, settings
- `packages/shared/` - Shared types and constants
- `data/crm.db` - SQLite database (gitignored)

## Key Commands
```
pnpm install          # Install dependencies
pnpm db:setup         # Run migrations (create tables, FTS5, indexes, sphere defaults)
pnpm db:seed          # Import contacts from CSV
pnpm dev              # Start server (:3001) + client (:5173) concurrently
```

## Sphere System
Contacts are assigned to spheres that dictate reminder frequency:
- **Love Them** - 30 days (family, close friends)
- **Like Them** - 90 days default, configurable 3-6 months
- **Know Them** - 180 days (acquaintances)

Defaults are stored in the `sphere_settings` table and editable from the Settings page. Individual contacts can override their sphere default via `frequency_override_days`.

## Reminder Engine
Computed at query time via SQL, no background jobs:
- `urgencyScore = (daysSinceContact - effectiveFrequency) / effectiveFrequency`
- Contacts with active snooze (`snoozed_until > now`) are filtered out
- Dashboard shows overdue contacts ordered by urgency

## Data
- 97 contacts imported from Relatable CSV
- CSV file and database are gitignored (personal data)
- Seed script reads from `Relatable_Contacts_Graeme_Crawford - Contacts.csv` at project root

## Architecture Decisions
- **@libsql/client** instead of better-sqlite3 (no Visual Studio Build Tools on this machine)
- **Manual migration script** instead of drizzle-kit push (drizzle-kit depends on better-sqlite3 transitively)
- **SQLite FTS5** for full-text search across contacts (name, company, notes, interests, job title)
- **Hono** over Express for end-to-end type safety potential via RPC
- **No component library** - hand-built primitives (Button, Input, Modal, Badge) for full design control

## Repo
https://github.com/crawfordmcmillan/PersonalCRM
