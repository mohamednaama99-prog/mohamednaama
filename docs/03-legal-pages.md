# Legal pages — internal note

**Not for visitors.** Nothing in this file is rendered on the site.

The copy lives in `src/content/legal.ts` and is served by `/privacy`,
`/terms` and `/refunds`.

## Status

**These documents have not been reviewed by a lawyer.** They were written from
what the site verifiably does — the exact fields the application form collects,
where submissions go, and how enrolment works — so they are accurate rather
than boilerplate. They are not a substitute for legal review before launch.

No business address, legal entity, company number, tax detail, governing law or
jurisdiction is stated anywhere, because none was supplied. None was invented.

## What the client still has to supply

| Needed | Where it goes | Why it matters |
| --- | --- | --- |
| **Legal entity and address** | `terms`, `privacy` | Who the visitor is contracting with, and who controls their data |
| **Governing law / jurisdiction** | `terms` | Which country's law applies to a dispute |
| **Whether a data-protection regime applies** | `privacy` | The audience is stated as US-only. If clients in the EU/UK are accepted, the policy needs GDPR rights, a lawful basis and a retention period stated explicitly |
| **Retention period** | `privacy` | Currently "while relevant", which is honest but vague. Matters more now that health information is collected |
| **Health-data review** | `privacy`, `form.ts` | The form now collects health information (medical conditions, surgery, injuries, joint pain, heart or breathing conditions) under a separate explicit consent. Several US states regulate consumer health data (for example Washington's My Health My Data Act), so this is worth a lawyer's look before launch |
| **Minimum age** | `terms`, `form.ts` | Terms now say 18 or older, matching the form's age check (`limits.minAge`). Confirm, or change both together |

## Supplied by the client

- **Refund and cancellation terms** — the 7-day guarantee, cancel-any-time,
  pausing for injury or illness, and the refund timing are in `refunds` in
  `src/content/legal.ts`, and summarized in `terms` and the FAQ. The payment
  cadence is still not known, so the policy says only "your first payment"
  and "your next payment"; if a cadence is ever confirmed, state it in
  `packages.ts` first and the policy can follow.
- **Contact email** — `site.email` in `src/content/site.ts`. The refund
  policy reads it, and the WhatsApp number, from there.

## What the policies currently assert

Only these, all verifiable from the code:

- The form collects the client's New Client Application questionnaire:
  contact details, age, gender, height, weight, goals, five health questions
  with details, training history and availability, and the plan
  (`src/content/form.ts`). The privacy policy lists them by group; if a
  question is added or removed there, update "What this site collects".
- Health information is used only to review the application and build the
  program, is never sold or shared, and needs its own consent checkbox.
- Submissions are written to a private Google Sheet (`src/lib/sheets.ts`) and
  the follow-up happens on WhatsApp. Access, correction and deletion requests
  go to `site.email`.
- Answers in progress are kept in the browser's sessionStorage (cleared on
  submit and when the tab closes), and the server counts submissions per IP in
  memory for rate limiting. Neither is stored with the application.
- There is no analytics, no advertising and no cookies set by the site — true
  today, and **this claim has to be revisited the moment GA4 is added**.
- There is no checkout; enrollment and payment are arranged directly.
- The client's refund and cancellation terms, as supplied.
- Plans are Weekly or Daily over three or six months, at the prices in
  `src/content/packages.ts`.
- A health disclaimer, which is not optional for coaching.

## When GA4 is added

The privacy policy says the site sets no cookies and runs no analytics. Update
the "What this site collects" and "Third-party services" sections in
`src/content/legal.ts` in the same change that adds the tag, or the policy
becomes false.
