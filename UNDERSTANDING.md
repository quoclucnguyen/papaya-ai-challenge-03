# AI Challenge 03 — Claim Notification Email Templates: Requirements Interpretation

> This document records how I interpreted the challenge in
> `pumpkin/AI_Engineering_Challenges/AI_Challenge_03.md` (a copy is included in this
> directory) before starting implementation.
>
> **History**: sections 1–10 describe the original interpretation (v1 — plain
> HTML/CSS/JS, stored in `../challenge-03-static-v1/`). Section 11 adds the
> interpretation for **v2 — Next.js** (stored in `../challenge-03-nextjs-v2/`):
> reusable components plus the ability to generate emails using entered values.
> Section 12 covers **v3 — React + Vite (client-side rendering only)**, the current
> implementation.

## 1. Problem summary

Build **2 deliverables** for Papaya Insurance's claim notification workflow:

1. **6 HTML email templates** — one for each event in the claim lifecycle
   (Submitted → Documents Received → Under Review → Approved/Rejected → Payment Sent).
2. **1 preview page** — an internal tool for the operations team to select an event
   type and preview the template with sample data **before** it goes live.

The key point is that this is not simply "6 attractive HTML pages." These are **HTML
emails**, one of the most restrictive rendering environments on the web (Outlook,
Gmail, Apple Mail, and others), so they require email-specific conventions: table-based
layout, inline styles, one column, and a maximum width of 600px.

## 2. Six events and their email data

| # | Event | Subject (from the challenge) | Required variables |
|---|-------|------------------------------|--------------------|
| 1 | Claim Submitted | Your claim {claim_number} has been received | claim_number, member_name, claim_type, submitted_date |
| 2 | Documents Received | Documents received for claim {claim_number} | claim_number, member_name, document_count, documents_list |
| 3 | Under Review | Your claim {claim_number} is being reviewed | claim_number, member_name, assessor_name, estimated_days |
| 4 | Approved | Good news! Claim {claim_number} has been approved | claim_number, member_name, approved_amount, original_amount, payment_method |
| 5 | Rejected | Update on claim {claim_number} | claim_number, member_name, rejection_reason, appeal_deadline |
| 6 | Payment Sent | Payment for claim {claim_number} has been processed | claim_number, member_name, payment_amount, payment_date, reference_number |

Data observations:

- `documents_list` is a **list**, so the template needs to render multiple items (one
  line per document), not a flat string.
- The Rejected subject is *"Update on claim"*. The challenge **intentionally avoids**
  the word "rejected" in the subject, which clearly signals the desired tone: gentle
  and not alarming at first glance in the inbox.
- Approved includes both `approved_amount` and `original_amount`, so the email must
  support cases where the approved amount **differs** from the requested amount. The
  copy should gently explain why that can happen.

## 3. Brand guidelines → design decisions

| Guideline | Application |
|-----------|-------------|
| Primary `#2563EB` (blue) | Header for **every** email to maintain brand consistency; also used for badges, step numbers, and links |
| Secondary `#10B981` (green) | Used only for **positive outcomes**: the accent bar and amount block in Approved and Payment Sent |
| Warning `#EF4444` (red) | Used **sparingly** in Rejected: the left border of the explanation block and the appeal deadline. The entire email is not red because the tone should remain reassuring |
| System sans-serif | `-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif` — meets the requirement and is the safest stack for email clients |
| Text logo "Papaya Insurance" | Bold white text on the primary blue header |
| Warm/professional/reassuring tone | Open with the member's name, use active language ("We've got your claim"), always explain whether action is needed and what happens next, and avoid operational jargon (for example, "ask us to take another look" alongside "appeal," and "claims specialist" instead of "adjudicator") |

## 4. Technical constraints for email HTML (defined to satisfy "render correctly")

The challenge only says "render correctly in a standard email client layout." I
translated that into the following concrete technical checklist:

- Use nested `<table role="presentation">` elements for layout and **do not** use
  flex/grid because Outlook uses the Word rendering engine and does not support them.
- Apply **inline styles to every element** because many clients, especially older
  versions of Gmail, strip `<style>` tags.
- Use one column with a `width=600` and `max-width:600px` container that shrinks to
  100% on mobile.
- Include `@media (max-width: 620px)` in a `<style>` block for clients that support it
  (reduced padding and smaller amount text). This is **progressive enhancement**; the
  email remains readable if the media query is stripped.
- Include hidden preheader text (the preview text shown next to the subject in an
  inbox), a small but standard detail for transactional email.
- Set background colors using both `bgcolor` and CSS for better compatibility.

## 5. Variable interpolation — interpretation

- Requirement: templates contain placeholders such as `{{member_name}}` and **do not
  hardcode** values.
- I use a consistent `{{snake_case}}` syntax in both body and subject. The challenge
  writes subjects using a single-brace `{claim_number}` form; I normalize it to
  `{{...}}` so one engine can handle both, while the rendered result still matches the
  challenge subject exactly.
- The interpolation engine lives in the **preview page** (a regex replaces
  `{{key}}` with an HTML-escaped value). In production, the same template files can be
  used directly with Handlebars/Mustache because the syntax is compatible.
- `documents_list` is handled as a list and rendered as `<li>` elements. In the
  preview editor, each input line represents one document.
- The preview displays a **red warning** if unresolved `{{...}}` variables remain
  after rendering, helping the operations team catch missing data.

## 6. Preview page — interpretation of "functional and easy to use"

The target users are the **operations team**, not developers, so:

- The sidebar lists all 6 events in claim lifecycle order, numbered 01–06, with
  tone-based color indicators (blue = informational, green = positive, red = rejected).
- The **rendered subject line** appears above the email because the subject is also
  part of the deliverable.
- The email renders inside an **iframe**, isolating CSS and better representing an
  email-client layout.
- The **Sample data** panel allows each variable to be edited directly and re-renders
  the email immediately. This visibly demonstrates that all variables are correctly
  interpolated and not hardcoded.
- A **Desktop 600px / Mobile 375px** toggle supports responsive testing.
- A button opens the template's **Raw HTML** so operations or development staff can
  copy the original template for use elsewhere.

## 7. Evaluation criteria mapped to the implementation

| Challenge criterion | How it is addressed |
|---------------------|---------------------|
| Visually polished and on-brand | A shared design system across all 6 emails (header, badge, card, footer), with the 3 brand colors used semantically |
| Clear, warm copy without jargon | Handwritten copy for each email based on section 3; Rejected follows a "why → what next → deadline" structure |
| Variables interpolated correctly | `{{...}}` engine + live editing panel + unresolved-variable warning |
| Responsive on mobile | Fluid table + 620px media query; mobile toggle in the preview for verification |
| Functional, easy-to-use preview | Features in section 6; zero dependencies and only a static server required |

## 8. Decisions and assumptions to document in the README

1. **Tech stack**: ~~plain HTML/CSS/JS~~ → **v2: Next.js + TypeScript** (see section 11);
   it still supports static export and can be deployed as a static site.
2. **Variable syntax**: consistent `{{double_brace}}` placeholders
   (Mustache/Handlebars-compatible).
3. **Sample data**: a Vietnamese context (member names and ₫ amounts), appropriate for
   Papaya. The Approved example intentionally uses `approved_amount < original_amount`
   to demonstrate how the copy handles this case.
4. **Every email uses a primary blue header**, including Rejected, for brand
   consistency. Status is conveyed through badges and accents instead of changing the
   entire header.
5. **The preview page must run over HTTP** because it fetches templates. Open it with
   `npx serve` or `python -m http.server`; if opened using `file://`, instructions are
   shown immediately in the preview frame.

## 9. Submission deliverables

- `templates/` — 6 independent HTML email files, ready for any `{{}}`-compatible
  template engine.
- `index.html` + `js/app.js` + `js/templates-config.js` — preview page.
- `AI_Challenge_03.md` — original challenge copy, plus `UNDERSTANDING.md`,
  `CHECKLIST.md`, and `README.md`.
- GitHub push + deployed live URL (Netlify Drop / Vercel / GitHub Pages — fully static
  site).

## 10. Estimated timeline (required by the challenge)

| Step | Time |
|------|------|
| Read the challenge and define the design system + copywriting direction | ~20 minutes |
| First template (shared header/footer/media-query frame) | ~30 minutes |
| Remaining 5 templates (variations on the shared frame) | ~45 minutes |
| Preview page (selector, interpolation, editor, mobile toggle) | ~45 minutes |
| Rendering and responsive tests + minor fixes | ~20 minutes |
| README and deployment | ~20 minutes |
| **Total** | **~3 hours** (within the challenge's 2–3 hour estimate) |

## 11. v2 — Migration to Next.js: interpretation of the new requirement

The additional requirement was: *"migrate to Next.js to enable component reuse and add
a feature for generating an email using existing values."* I interpreted this as two
tasks:

### 11.1. Reusable components

The v1 implementation had a real problem: 6 HTML files duplicated the
header/footer/badge/card markup, so changing the footer required edits in 6 places.
React components directly address that problem:

- `components/emails/theme.ts` — brand tokens (the 3 challenge colors, font stack, and
  support contact) are a **single source of truth**. Changing one brand color updates
  all 6 emails.
- `components/emails/EmailLayout.tsx` — shared frame (logo header, 600px container,
  footer, media query, and preheader). Each template defines only its body.
- `components/emails/shared.tsx` — recurring blocks: `Badge`, `Heading`, `Paragraph`,
  `DataCard` (label-value pairs), `Steps` (numbered steps), `HighlightBox` (prominent
  amount), `ExplanationBox` (rejection reason), `DeadlineBanner`, and `DocumentList`.
- As a result, each template shrinks from about 170 lines of HTML to **40–60 lines of
  JSX** containing only event-specific content.

**An important migration constraint**: the final output must remain standards-compliant
email HTML (table-based, inline styles, 600px). JSX only changes how the templates are
*written*, not how they are *rendered*. Inline JSX style objects become the same inline
HTML styles used in v1. The legacy `bgcolor` fallback attribute is not part of React's
JSX types, so it must be passed through an object spread.

### 11.2. "Generate an email using existing values"

I interpreted this to mean that after entering or editing values in the preview, the
operations team needs to **obtain the complete email** populated with those values,
not merely preview it. This became the **✉ Generate Email** dialog with 2 tabs:

1. **Complete Email (entered values)** — HTML interpolated from the editor's current
   values, with actions to copy it, download `<event>_<claim_number>.html`, or open it
   in a new tab. The rendered subject is included, along with a warning if any variables
   are empty.
2. **Raw Template `{{...}}`** — the same component rendered with placeholders and
   exported as a Mustache/Handlebars-compatible file. This is the challenge's
   "6 HTML email templates" deliverable, now **generated from components** instead of
   maintained by hand, so the two forms cannot drift apart.

### 11.3. Architectural decisions

- **Client-side rendering** with `renderToStaticMarkup` (`lib/render.tsx`) requires no
  API route. The app can still use `output: 'export'`, deploy as a static site, and
  re-render immediately while the user types without the debounce/fetch cycle from v1.
- In a component architecture, **"not hardcoded"** means dynamic values are **props**
  whose names exactly match the challenge variables (`claim_number`, `member_name`,
  and so on). React automatically escapes every value.
- `lib/events.ts` preserves its v1 role as configuration for subjects, field
  definitions, and sample data. Adding an event requires one config entry plus one
  template component.
- Editor state is **isolated per event**, so editing Approved does not affect values
  entered for Rejected.

## 12. v3 — Migration to React + Vite (client-side rendering only)

The requirement was: *"migrate to ReactJS with Vite; client-side rendering is
sufficient."* Interpretation and decisions:

- **Why CSR is sufficient**: this is an internal tool with no SEO requirement and no
  server data. Email rendering already ran client-side through `renderToStaticMarkup`
  in v2. Next.js effectively served only as a bundler and static exporter, while Vite
  provides that functionality more directly (fast dev server, static `dist/` build,
  and no SSR/hydration machinery).
- **Preserve 100% of the core**: `components/emails/` (design system),
  `components/studio/`, `lib/events.ts`, and `lib/render.tsx` move into `src/` without
  logic changes. This validates the v2 separation between email components, rendering
  engine, and UI: changing frameworks affects only the application shell.
- **What changes**: `app/layout.tsx` + `app/page.tsx` (Next App Router) become
  `index.html` + `src/main.tsx` + `src/App.tsx`; the `'use client'` directive is removed
  because it only has meaning in Next.js; the `@/` alias points to `src/` through
  `vite.config.ts`; build becomes `tsc --noEmit && vite build`.
- **Accepted trade-off**: the bundle includes `react-dom/server` (about 125KB gzipped
  in total). This is acceptable for an internal tool and avoids the need for any server
  or API route.
