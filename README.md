# AI Challenge 03 — Claim Notification Email Templates

Solution for `AI_Challenge_03.md` (a copy of the original challenge is included in this
directory), **v3 — React + Vite, client-side rendering only**: 6 email templates built
with **reusable React components**, a preview page ("Email Template Studio"), and a
**Generate Email** feature that exports complete HTML using the entered values.

📄 Supporting documentation:

- [`UNDERSTANDING.md`](UNDERSTANDING.md) — interpretation of the requirements and architectural decision history (v1 → v2 → v3)
- [`CHECKLIST.md`](CHECKLIST.md) — self-assessment checklist based on the Requirements and Evaluation Criteria (verified)

## Run locally

```bash
npm install
npm run dev      # http://localhost:5103
```

Create a production build (a fully static site in `dist/`):

```bash
npm run build    # tsc --noEmit && vite build
npm run preview  # preview the production build
```

## Architecture

```text
challenge-03/
├── index.html                  # Vite entry point (fonts, #root)
├── vite.config.ts              # React plugin, @ → src alias, port 5103
├── src/
│   ├── main.tsx                # createRoot + StrictMode
│   ├── App.tsx                 # Studio page
│   ├── index.css               # Studio styles
│   ├── components/
│   │   ├── emails/             # ❤️ Email design system
│   │   │   ├── theme.ts        # Brand tokens (colors, font, support contact) — single source of truth
│   │   │   ├── EmailLayout.tsx # Shared frame: logo header + 600px container + footer
│   │   │   ├── shared.tsx      # Section, Badge, DataCard, Steps, HighlightBox,
│   │   │   │                   #   ExplanationBox, DeadlineBanner, DocumentList...
│   │   │   └── (6 template components, each about 40–60 lines)
│   │   └── studio/
│   │       ├── Sidebar.tsx     # Select an event in the claim lifecycle
│   │       ├── FieldEditor.tsx # Edit sample data live
│   │       └── GenerateDialog.tsx  # ✉ "Generate Email" feature
│   └── lib/
│       ├── events.ts           # Configuration for 6 events: subject, field definitions, sample data
│       └── render.tsx          # renderEmail() / renderTemplate() — single rendering engine
└── AI_Challenge_03.md          # Original challenge
```

**Key architectural decisions:**

- **Reusable components**: the header, footer, badges, cards, steps, and other building
  blocks are defined once in `src/components/emails/`. The 6 templates only compose
  those blocks with event-specific copy. Updating the footer in one place updates all
  6 emails.
- **A single rendering engine** (`src/lib/render.tsx`) runs in the browser using
  `renderToStaticMarkup`:
  - `renderEmail(eventId, values)` → complete HTML with actual values (preview and Generate Email).
  - `renderTemplate(eventId)` → HTML that preserves `{{...}}` placeholders
    (Mustache/Handlebars-compatible). These are the "6 HTML email templates" required
    by the challenge, generated from the same components.
- **No hardcoded values**: all dynamic values are passed as **props**, and React escapes
  HTML automatically.
- **Client-side rendering only**: no server and no API. The `dist/` output is a static
  site that can be deployed anywhere.

## Using the Studio

1. **Select an event** from the sidebar (6 events in claim lifecycle order).
2. Review the **rendered subject** and the email inside an iframe, which isolates its CSS
   like an email client.
3. **Edit sample data** in the right panel. The email re-renders immediately, and empty
   variables trigger a warning banner.
4. Toggle between **Desktop 600px / Mobile 375px**.
5. Click **✉ Generate Email**:
   - **"Complete Email"** tab — HTML populated with the current values: 📋 copy HTML,
     ⬇ download `<event>_<claim_number>.html`, or ↗ open it in a new tab. The dialog also
     includes the subject and warnings for empty variables.
   - **"Raw Template {{...}}"** tab — export a template that preserves placeholders for
     the email delivery system.

## Technical email notes

- Email-client-compatible layout: `<table role="presentation">`, inline styles on each
  element (JSX style objects become inline CSS when rendered), a single-column
  `max-width: 600px` layout, and fallback `bgcolor` attributes.
- Mobile support uses a `max-width: 620px` media query as progressive enhancement.
- Brand usage is consistent: primary blue `#2563EB` for headers, green `#10B981` only
  for positive outcomes, and restrained use of red `#EF4444` in Rejected. Tokens are
  centralized in `src/components/emails/theme.ts`.
- For `documents_list`, each line in the editor becomes an `<li>`. The raw template
  preserves `<li>{{documents_list}}</li>` for server-side iteration.

## Deployment

`npm run build` produces a static site in `dist/`. It can be uploaded to Netlify Drop,
deployed with `npx vercel deploy` (Vercel detects Vite automatically), or hosted on
GitHub Pages.

## Timeline

| Step | Time |
|------|------|
| v1 — Plain HTML/CSS/JS implementation (6 templates + preview) | ~3 hours |
| v2 — Migrated to Next.js: extracted the email design system and Studio components, added Generate Email | ~2 hours |
| v3 — Migrated to React + Vite (CSR): removed Next.js machinery while preserving all components | ~30 minutes |
