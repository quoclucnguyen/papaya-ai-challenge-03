# Evaluation Checklist — AI Challenge 03 (v3 — React + Vite, CSR)

This self-assessment checklist is based on the **Requirements + Evaluation Criteria** in
`AI_Challenge_03.md` and updated for the React + Vite version. Items marked *(verified)*
were re-tested on the **Vite implementation** through real interactions with the dev
server (clicking every event, editing data, and opening the dialog) plus a production
`npm run build`. The v1 checklist is in `../challenge-03-static-v1/`, and the v2
(Next.js) checklist is in `../challenge-03-nextjs-v2/`.

## 1. Six email templates (challenge requirements)

- [x] All **6 templates** are present, with one component per event in `src/components/emails/` *(verified through the UI: 6/6 events render)*
- [x] **Claim Submitted** — claim_number, member_name, claim_type, submitted_date; summary card + 3 "what happens next" steps
- [x] **Documents Received** — claim_number, member_name, document_count, documents_list (one bullet per document)
- [x] **Under Review** — claim_number, member_name, assessor_name, estimated_days; prominent estimate block
- [x] **Approved** — claim_number, member_name, approved_amount, original_amount, payment_method
- [x] **Rejected** — claim_number, member_name, rejection_reason, appeal_deadline
- [x] **Payment Sent** — claim_number, member_name, payment_amount, payment_date, reference_number; receipt card
- [x] Subjects for all 6 emails match the challenge wording exactly after rendering *(verified by checking each event's subject bar)*
- [x] Raw HTML templates with `{{...}}` placeholders can be exported from the "Raw Template" tab in the Generate Email dialog; placeholders exactly match the Key Data column *(verified: the Payment Sent template tab returns the correct 5 placeholders and no actual values)*

## 2. Structural requirements for each email

- [x] **No hardcoded values** — every dynamic value is a prop (prop names match the challenge variables); editing an input updates the email immediately *(verified: changing payment_amount updates the iframe)*
- [x] **Header with logo** — white "Papaya Insurance" text on the primary blue background, shared through `EmailLayout` so all 6 are identical
- [x] **Event-specific body** — each event has its own badge, heading, and card
- [x] **Footer with support contact** — email, phone number, and business hours from `EmailLayout`/`theme.ts` *(verified 6/6)*
- [x] **Rejected email**: "Why this decision was made" block with a red border + 3 "What you can do next" steps + deadline banner
- [x] **Approved email**: approved_amount appears in a `HighlightBox` at 38px, using green `#10B981` with a light background and green border
- [x] **Single column, max-width 600px** — the container in `EmailLayout` applies to all 6 emails
- [x] Email-client-compatible markup: `<table role="presentation">`, inline styles (JSX style objects → inline CSS), fallback `bgcolor` attributes *(verified: rendered HTML contains 3 bgcolor attributes)*, hidden preheader, and no flex/grid

## 3. Brand guidelines

- [x] Primary `#2563EB`, secondary `#10B981`, and warning `#EF4444` are declared **once** in `src/components/emails/theme.ts`; every component reads them from there *(verified: brand blue is present in 6/6 emails)*
- [x] Green is used only for positive outcomes (accent bar + amount block in Approved/Payment Sent); red is used sparingly in Rejected
- [x] Font: system sans-serif stack (`FONT` constant in the theme)
- [x] Text logo placeholder: "Papaya Insurance"
- [x] Warm, professional, reassuring tone — copy is preserved from v1 (reviewed): addresses the member by name, explains the next step clearly, avoids jargon, and does not include the word "rejected" in the Rejected subject

## 4. Preview page — Studio (Requirements + Evaluation)

- [x] Select an **event type** from the sidebar *(verified: clicked all 6 events; subject and body update correctly)*
- [x] Render the template with **sample data** in an iframe *(verified: correct data and no remaining placeholders)*
- [x] Show the **rendered subject line** in the top bar *(verified)*
- [x] **Edit sample data live** — no debounce or fetch required; React renders directly *(verified)*
- [x] **Warn about empty variables** — a red banner lists empty `{{key}}` values *(verified: clearing member_name shows the banner; reset removes it)*
- [x] Toggle **Desktop 600px / Mobile 375px** *(verified in v1 with the same CSS; class logic is unchanged)*
- [x] Sample-data state is **isolated per event** — editing one event does not affect another
- [x] **Reset sample data** to defaults *(verified)*

## 5. New v2 feature — ✉ Generate an email using existing values

- [x] The **Generate Email** button opens the export dialog *(verified)*
- [x] **"Complete Email"** tab: HTML includes `<!DOCTYPE html>`, uses the current values correctly, and contains no remaining placeholders *(verified)*
- [x] **Copy HTML** and **Copy subject** to the clipboard
- [x] **Download** `<event>_<claim_number>.html` (the filename is generated from actual values)
- [x] **Open in a new tab** to view the full-size email using a blob URL
- [x] The dialog warns when variables are empty to prevent incomplete emails from being sent
- [x] **"Raw Template `{{...}}`"** tab: the same component renders with placeholders and exports a Mustache/Handlebars-compatible file *(verified: correct placeholder set and no actual values)*
- [x] Close the dialog using the ✕ button, backdrop click, or Escape key

## 6. Component reuse (the primary v2 objective)

- [x] `theme.ts` — a single source of truth for brand tokens (colors, font, support contact)
- [x] `EmailLayout` — header, footer, container, and media query defined once for all 6 emails
- [x] Shared blocks in `shared.tsx`: Section, Badge, Heading/SubHeading, Paragraph, ClaimRef, DataCard, Steps, HighlightBox, ExplanationBox, DeadlineBanner, DocumentList
- [x] Each template is approximately 40–60 lines of JSX and contains only event-specific content
- [x] One rendering engine (`src/lib/render.tsx`) powers preview, email generation, and template export
- [x] Adding an event requires one entry in `src/lib/events.ts` plus one template component
- [x] **v3 demonstrates reuse**: during the Next.js → Vite migration, all `components/` and `lib/` logic remained unchanged; only the application shell changed

## 7. Responsive behavior (Evaluation Criteria)

- [x] Email: a 620px media query in `EmailLayout` makes the container fluid, reduces padding, and decreases amount text size; it applies automatically to all 6 emails
- [x] The email remains readable when an email client strips `<style>` because the base layout uses inline styles and a width attribute
- [x] The Studio is responsive (3 columns collapse into a vertical layout below 1100px/720px)

## 8. Verification process (evidence — fully rerun on the Vite implementation)

- Real UI interaction on the Vite dev server: reviewed 6/6 events → subjects match the challenge exactly, no remaining placeholders, and brand blue, the support footer, and fallback `bgcolor` are present in all 6
- Generate Email dialog: final tab (DOCTYPE ✓, actual values ✓, no remaining placeholders ✓) and template tab (correct 5/5 placeholders, no actual values)
- Live editing: changed `payment_amount` → iframe updated; cleared `member_name` → warning appeared; Reset → defaults restored
- `npm run build` (`tsc --noEmit && vite build`): **PASS**, producing a static `dist/` build (~125KB gzipped JS)
- Browser console: 0 errors (only Vite HMR debug logs)
- Real bug found in v2 (still relevant): legacy `bgcolor` is not included in JSX types → fixed with a spread helper and verified that rendered HTML still contains all `bgcolor` attributes

## 9. Submission

- [x] All source files are in `answers/challenge-03/` (Vite app + documentation + original challenge); v1 is stored in `answers/challenge-03-static-v1/`, and v2 in `answers/challenge-03-nextjs-v2/`
- [ ] Push to a GitHub repository — *waiting for the user to provide the repository*
- [ ] Deploy a live URL (`npm run build` → `dist/`, or `npx vercel deploy`) — *waiting for the user to choose a platform*
