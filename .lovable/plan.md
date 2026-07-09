## Goal

Redesign the author (submitter) experience with a serious, refined sidebar shell inspired by the admin panel but muted (monochrome, no colorful tone tiles). Add a proper reading page for individual articles. Profile lives at the bottom-left of the sidebar.

## Scope (author-side only)

Admin panel and shared components stay untouched.

## 1. New `AuthorShell` sidebar layout

Create `src/components/author-shell.tsx` — replaces `EditorialShell` for the four author routes below. Design DNA copied from `AdminLayout` (rounded card sidebar, floating content panel, generous spacing, Apple-style press animations), but:

- **Monochrome**: no colored icon tiles. Icons sit inline in muted foreground; active state uses a soft neutral surface + subtle inner shadow.
- **Serious typography**: serif headings, tight tracking, no gradient avatar.
- **Sections** (single group, no colored labels):
  - Bosh sahifa → `/dashboard`
  - Yangi maqola → `/submissions/new` (primary action, styled as a subtle pill button at top of nav)
  - Mening maqolalarim → `/submissions`
  - Arxivni ko'rish → `/arxiv` (explore published)
  - Menga tayinlangan → `/editor/queue` (only if `submissions.view_assigned`)
- **Bottom-left profile block**: avatar (initial monogram, neutral), name, role, click opens `/settings/profile`. Sign-out as a small icon button beside it.

## 2. Author dashboard rebuild (`/dashboard`)

Replace the current tiny grid with:
- Large greeting header ("Xush kelibsiz, {name}").
- Two prominent action cards side-by-side: **Yangi maqola topshirish** (primary), **Mening maqolalarim** (secondary) — big rounded tiles like admin dashboard but monochrome.
- Recent submissions list (top 5 from `listMySubmissions`) with workflow badge and updated_at.
- "So'nggi nashrlar" strip: 3 latest published articles pulled from existing arxiv data — click opens the article read page.

## 3. Author article read page

The existing `/arxiv/$jild/$son` route is the issue browser. Confirm whether an article-level read page already exists; if not, plan is limited to linking from dashboard to the current arxiv page and NOT creating a new maqola-level route (avoid scope creep on data layer). If a per-article page is required, it needs schema/loader work — call that out and defer to a follow-up unless the user confirms.

**Assumption**: for this pass, "explore and read" links go to the existing arxiv browser (`/arxiv`) and issue detail (`/arxiv/$jild/$son`). A dedicated per-article scroll page can be a follow-up once we confirm the data shape.

## 4. Swap `EditorialShell` → `AuthorShell` on author routes

- `src/routes/_authenticated/dashboard.tsx`
- `src/routes/_authenticated/submissions.index.tsx`
- `src/routes/_authenticated/settings.profile.tsx`
- `src/routes/_authenticated/submissions.$id.index.tsx`
- `src/routes/_authenticated/submissions.$id.edit.tsx`
- `src/routes/_authenticated/editor.queue.tsx` (author-facing "assigned to me" view)

`EditorialShell` stays for backwards compat but is no longer imported.

## 5. Landing "Make a submission" flow

Already wired (`/` → CTA → `/auth` → `/dashboard`). No changes unless the CTA is missing; verify only.

## Technical details

- Reuse `Tailwind` tokens from `styles.css` — `bg-page`, `bg-card`, `border-rule`, `text-ink*`. No new color additions.
- Sidebar width 260px, sticky, `rounded-3xl` card matching admin.
- Icons via `lucide-react`, single stroke, `text-muted-foreground` → `text-foreground` on active.
- No new server functions; all queries use existing `getSessionContext`, `listMySubmissions`, and arxiv loaders.

## Question for you

Do you want a **dedicated per-article reading page** (a scrollable page for each published maqola with full text/PDF viewer)? That requires confirming the article/PDF data shape and is a bigger change — I'd do it as a separate turn. For this pass I'll link "explore" to the existing arxiv browser.
