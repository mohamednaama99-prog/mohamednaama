# CLAUDE.md — Coach Mohamed Naama Online Coaching Website

## 1. Project Overview

Build a premium, high-converting portfolio and online-coaching website for **Coach Mohamed Naama**, a NASM-certified personal trainer and professional soccer player.

The initial release is a primarily static marketing website. It introduces the coach, explains the online coaching programs, builds trust, answers key questions, and guides visitors to submit an inquiry or continue the enrollment conversation through WhatsApp.

The website must feel like a polished, premium fitness/coaching brand—not a generic gym template.

### Primary goals

1. Create an outstanding visual experience on both mobile and desktop.
2. Clearly communicate the coach's experience, coaching approach, packages, and terms.
3. Convert visitors into leads through a well-designed CTA form.
4. Send form submissions securely to a Google Sheet.
5. Let visitors choose a package and continue to WhatsApp to discuss enrollment and payment.
6. Establish a maintainable foundation that can later evolve into a reusable product for other coaches.

### Reference

The client liked the visual direction, colors, and overall feel of:

- https://www.upliftyou.com/

Use it as visual inspiration only. Do not copy its layout, text, assets, or branding. Create an original identity for Coach Mohamed.

---

## 2. Tech Stack and Deployment

The project has already been initialized with:

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React hook form
- zod

Deployment target:

- Vercel free/Hobby plan for the initial static-focused release.
- A separately purchased custom domain.

### Technical rules

- Inspect the existing repository and `package.json` before making assumptions about versions, scripts, or project structure.
- Follow the App Router or Pages Router already configured; do not migrate routing architecture without a clear reason.
- Use the existing package manager and lockfile. Do not introduce a second package manager.
- Prefer Server Components by default. Add Client Components only when interaction or browser APIs require them.
- Keep dependencies lean. Do not install a library for a feature that can be implemented cleanly with the existing stack.
- Use strict TypeScript. Avoid `any`; define clear types for form data, packages, and reusable content.
- Reuse components and design tokens. Avoid duplicated page-specific implementations.
- Do not add a database, authentication system, CMS, or payment gateway for the initial release unless explicitly requested.
- Do not expose secrets or private integration credentials in client-side code.

---

## 3. Product Scope

### In scope for the initial release

- Premium English-only landing page.
- Responsive navigation and footer.
- Coach introduction / About section.
- Coaching benefits and expectations.
- Weekly vs. daily coaching comparison.
- Pricing/package cards.
- Strong CTA sections.
- Lead/application form page or section.
- Privacy Policy page.
- Terms & Conditions page.
- Refund & Cancellation Policy page (may be a section/page linked from the legal area).
- Secure Google Sheets form submission.
- WhatsApp continuation CTA after package selection.
- SEO metadata, sitemap, robots configuration, and social sharing metadata.
- Accessible interactions, responsive layouts, and performance optimization.

### Explicitly out of scope unless requested later

- Online checkout or payment processing.
- User accounts and client dashboards.
- Workout-plan management.
- Admin dashboard.
- Automated coaching messages.
- Persistent application database.
- Subscription billing.
- A CMS.

Do not build out-of-scope features “just in case.”

---

## 4. Brand, Design Direction, and UX

### Overall direction

Create a modern, confident, premium, athletic, and editorial visual identity.

The client likes the reference website's use of color and visual polish. Explore a distinctive palette suitable for a high-end personal coaching brand. Do not assume the final colors are approved until the client confirms them.

### Design principles

- Strong visual hierarchy and clear typography.
- Bold, confident headlines with concise supporting copy.
- Generous spacing and carefully controlled content width.
- Premium cards, subtle borders, refined shadows, and intentional contrast.
- Purposeful motion and micro-interactions—not animation for its own sake.
- Clear CTA hierarchy and repeated conversion opportunities.
- Consistent spacing, radii, typography, and color tokens.
- Use real coach photography and approved brand assets when supplied. Until then, use deliberate placeholders that are easy to replace; do not invent testimonials, credentials, client photos, or results.
- Avoid generic AI-generated fitness copy and overly familiar template layouts.

### Animation

- Use smooth, purposeful entrance transitions and subtle hover/focus states.
- Motion should support the content and never delay access to it.
- Respect `prefers-reduced-motion`.
- Avoid heavy animation libraries unless the design genuinely requires one.
- Never sacrifice mobile performance for desktop animation effects.

### Mobile-first requirement

Mobile quality is a first-class acceptance criterion, not a later responsive pass.

- Design and test narrow screens first.
- Prevent horizontal overflow.
- Ensure navigation, cards, comparison tables, forms, and CTAs work comfortably with touch.
- Stack comparison content into readable mobile layouts rather than shrinking a desktop table.
- Keep tap targets comfortably sized.
- Make pricing and the primary CTA easy to find.
- Check common viewport widths, including small phones.

---

## 5. Content and Business Information

The website is English-only for the initial release.

### Coach biography

**Meet Coach Mohamed Naama**

> I’m Mohamed Naama, a NASM-certified personal trainer and professional soccer player with a background built on years of competition, training, and performance.
>
> With over 4,000 one-on-one training sessions and experience working with more than 300 clients across different gyms in Egypt and New York City, I’ve worked with people from different backgrounds, fitness levels, and goals.
>
> Now, I’m bringing my experience to online coaching to help more people worldwide train with purpose, track their progress, build accountability, and chase their goals.

You may correct grammar and improve readability while preserving the meaning and factual claims. Do not invent additional qualifications, awards, client outcomes, or experience.

### Coaching expectations

The coaching service may include:

- Personalized workout programming.
- Exercise demonstration videos and technique guidance.
- Follow-ups and accountability.
- Program adjustments based on progress.
- Nutrition recommendations (not a full nutrition plan).
- Workout tracking and performance monitoring.
- Direct coach support for training questions.
- Flexible programming around the client's schedule and available equipment.

Clearly distinguish what is included in each package. Do not imply that every feature has the same response frequency or service level.

### Weekly vs. Daily coaching comparison

| Feature           | Weekly coaching         | Daily coaching              |
| ----------------- | ----------------------- | --------------------------- |
| Progress review   | Once per week           | Daily brief updates         |
| Workout plan      | Personalized            | Personalized                |
| Plan adjustments  | Based on weekly review  | As needed based on progress |
| Questions         | Defined response window | Priority response window    |
| Progress tracking | Weekly                  | More frequent monitoring    |

### Additional Daily Coaching / Premium features

Daily Coaching includes the following additional service elements:

1. Daily check-ins to assess performance.
2. Priority responses to questions during the day.
3. Detailed exercise-technique explanation videos when needed to help prevent mistakes.

Do not promise instant or 24/7 responses. The exact response hours and service-level expectations must be confirmed by the coach before publishing.

### Packages and pricing

Use the following package data exactly unless the client supplies updated prices:

| Package         |            Duration | Price per week |  Total |
| --------------- | ------------------: | -------------: | -----: |
| Daily Coaching  | 3 months / 12 weeks |            $75 |   $900 |
| Weekly Coaching | 3 months / 12 weeks |            $55 |   $660 |
| Daily Coaching  | 6 months / 24 weeks |            $60 | $1,440 |
| Weekly Coaching | 6 months / 24 weeks |            $40 |   $960 |

The 3-month Daily Coaching package is currently marked as **“Best starting point”** in the supplied design reference. This is a presentation label, not a claim that it is objectively best for every customer.

Pricing UI requirements:

- Make the duration, coaching frequency, weekly price, and total commitment easy to understand.
- Do not make weekly pricing look like the full package price.
- State the total clearly beside the weekly amount.
- Make the package CTA obvious.
- Avoid fake discounts, countdown timers, scarcity claims, or unapproved guarantees.

---

## 6. Conversion Flows

There are two main conversion paths.

### A. Package selection → WhatsApp

When a visitor chooses a package:

1. Open WhatsApp using the coach's confirmed business number.
2. Pre-fill a clear English message containing the selected package name, duration, weekly price, and total price.
3. Encode the message safely for a URL.
4. Open WhatsApp in a new tab/window where appropriate.
5. Do not claim that the visitor has purchased, enrolled, or paid. This is an inquiry/conversation handoff only.

The WhatsApp number has not yet been supplied. Keep it in one clearly named configuration value (for example, an environment variable or a central site configuration file). Do not invent a number.

If the number is not configured, do not generate a broken WhatsApp link. Use a safe disabled state or a clearly marked temporary placeholder during development.

### B. CTA form → Google Sheets

The form fields are not finalized. The client will provide them later.

Until then:

- Build a reusable, well-structured form component using clearly labeled placeholder fields.
- Keep the form schema and validation centralized so fields can be changed easily.
- Do not invent mandatory personal or health questions.
- Make required vs. optional fields explicit.
- Include clear loading, success, validation-error, and submission-error states.
- Prevent accidental duplicate submissions while a request is in progress.
- Show a useful confirmation message after a successful submission.
- Do not clear user input when a request fails.

#### Google Sheets integration requirements

The browser must never write directly to Google Sheets using a service-account credential or secret.

Use a secure server-side integration:

1. The client submits form data to a Next.js Route Handler/API endpoint.
2. The server validates and sanitizes the payload.
3. The server uses credentials stored only in Vercel environment variables to append a row to the designated Google Sheet.
4. The server returns a minimal success/error response.
5. Never return credentials, tokens, private spreadsheet identifiers, or internal API errors to the browser.

Additional safeguards:

- Validate input on the server even if client-side validation exists.
- Enforce reasonable field length limits and accepted formats.
- Treat all submitted data as untrusted.
- Add basic abuse protection appropriate to the deployment (for example, a honeypot and/or rate limiting). Do not claim that a client-only rate limit is secure.
- Avoid logging sensitive form contents.
- Do not collect more personal information than is necessary.
- Use environment variables for secrets and configuration.
- Document the exact Vercel environment variables required, without committing their values.
- Handle Google API failures gracefully.
- Keep the Google Sheets integration isolated behind a small service/module so it can later be replaced with a database or CRM.

The exact Google Sheet, Google Cloud project, credentials, and form fields have not been supplied yet. Do not fabricate them.

---

## 7. Legal and Trust Content

The client supplied the following policy meaning. Improve formatting and readability, but do not silently change the business terms.

### Terms & Conditions — supplied content

By purchasing and enrolling in Coach Mohamed’s online coaching program, the client acknowledges that they have read, understood, and agreed to the Terms & Conditions, including the selected package’s duration, payment terms, cancellation and refund policy, and included services.

The client understands that fitness coaching involves physical activity and inherent risks; they are responsible for providing accurate health information and following the program safely. Individual results may vary depending on consistency, effort, and other personal factors. Coaching does not replace medical advice or treatment, and no specific results are guaranteed.

### Refund and Cancellation Policy — supplied content

All payments are considered final once submitted. Cancellations and refunds are generally not permitted after purchase, except in the following circumstances:

1. A health-related concern prevents the client from safely participating in the coaching program. Appropriate supporting documentation may be required.
2. The client has not received their personalized training plan within 72 hours of signing up, completing payment, and providing the required onboarding information.

### Important legal-content rules

- These terms concern a business operating in the United States. Do not present generated legal copy as legal advice or guarantee that it complies with every applicable federal or state law.
- Preserve the client's supplied policy intent, but flag potentially jurisdiction-dependent or enforceability-sensitive language for review by a qualified US attorney.
- Do not invent the business's legal entity name, state, mailing address, governing law, contact email, or effective date.
- Use clearly marked content placeholders for missing legal/business details.
- Add a Privacy Policy page, but do not invent data practices as facts. Draft a transparent starter policy that identifies the actual data collected, Google Sheets processing, contact method, retention/deletion approach, and relevant third-party services once confirmed.
- Do not claim HIPAA compliance, medical supervision, or any other certification unless the client provides evidence and explicitly approves the claim.
- Do not add a checkbox that implies consent to unrelated marketing. Form consent and terms acknowledgement should be clear and appropriate to the actual flow.

---

## 8. SEO, Accessibility, Performance, and Security

These are release requirements.

### SEO

- Use semantic HTML and a logical heading hierarchy.
- Provide unique page titles and meta descriptions.
- Add canonical URLs when the production domain is known.
- Add Open Graph and social sharing metadata.
- Generate a sitemap and configure `robots.txt`.
- Use descriptive image alt text; decorative images should have empty alt text.
- Use descriptive internal links and meaningful CTA labels.
- Ensure the main content is rendered in crawlable HTML.
- Avoid keyword stuffing and fabricated claims.
- Add structured data only when accurate and supported by supplied business information. Do not invent ratings, reviews, addresses, or credentials.

### Performance

- Prioritize Core Web Vitals and a fast first load.
- Use `next/image` for suitable local/remote images and configure remote image domains correctly.
- Use modern image formats and appropriately sized assets.
- Avoid shipping unnecessary JavaScript.
- Lazy-load below-the-fold media where appropriate.
- Avoid layout shifts by reserving image/media dimensions.
- Keep animation lightweight.
- Test production builds, not only the development server.

### Accessibility

- Use semantic landmarks and native controls.
- Ensure keyboard navigation and visible focus states.
- Associate labels and error messages with form fields.
- Maintain sufficient color contrast.
- Do not communicate state using color alone.
- Respect reduced-motion preferences.
- Ensure menus and dialogs have appropriate keyboard and screen-reader behavior.

### Security

- Never expose secrets in source code, client bundles, Git history, or logs.
- Validate all server-side input.
- Keep dependencies updated and minimal.
- Avoid unsafe HTML injection.
- Do not trust client-side validation as a security boundary.
- Configure environment variables through Vercel/project settings.
- Do not commit `.env` files containing real secrets.
- Review any third-party script before adding it.

---

## 9. Maintainability and Future Productization

Although the first client needs one website, the implementation should be structured so it can later become a reusable product for other coaches.

- Separate content/configuration from presentation.
- Keep coach profile, social links, contact details, packages, FAQs, and legal business details in centralized typed configuration/content modules where practical.
- Build reusable sections and components with clear props.
- Avoid hardcoding Coach Mohamed's details across many components.
- Keep integrations (WhatsApp, Google Sheets) isolated from UI components.
- Make it straightforward to replace the coach's branding, images, pricing, copy, and contact details.
- Do not prematurely build a multi-tenant platform, visual editor, CMS, or admin panel.

---

## 10. Working Method for Claude

Work as a senior frontend engineer, product-minded designer, and careful reviewer.

### Before implementation

1. Inspect the repository structure and existing code.
2. Read `package.json`, configuration files, and existing components.
3. Identify the current routing setup and styling conventions.
4. Summarize the implementation approach before making broad architectural changes.
5. Identify missing client information and use explicit placeholders rather than blocking all progress.

### During implementation

- Work in small, reviewable stages.
- Build the design system and shared layout before duplicating sections.
- Keep components focused and typed.
- Explain important decisions briefly.
- Do not rewrite unrelated files.
- Do not remove working functionality without a reason.
- Do not fabricate client content, credentials, testimonials, results, contact details, or legal facts.
- If information is missing, use a clearly named placeholder and record it in a “Client inputs needed” list.
- After each meaningful stage, run the relevant lint, type-check, and build commands that exist in the repository.
- Fix errors introduced by the changes before moving on.
- Do not claim a command passed unless it was actually run and passed.

### Suggested implementation stages

1. Repository audit and project plan.
2. Brand direction, design tokens, typography, and global layout.
3. Responsive landing page structure and visual implementation.
4. Coach story, coaching benefits, and service comparison.
5. Pricing cards and WhatsApp package handoff.
6. CTA form UX, validation, and accessible states.
7. Secure Google Sheets server integration once credentials and fields are supplied.
8. Legal pages and privacy content review.
9. SEO, metadata, sitemap, and robots configuration.
10. Responsive, accessibility, security, and performance QA.
11. Production build and Vercel deployment checklist.

Do not attempt all stages in one enormous change. Keep each stage coherent and testable.

---

## 11. Definition of Done

The initial release is ready when:

- The site has a distinctive, polished visual identity.
- All key sections and pages are complete in English.
- Desktop and mobile layouts are intentionally designed and tested.
- No horizontal overflow or broken responsive layouts remain.
- Pricing and package differences are accurate and unambiguous.
- Each package CTA creates the correct WhatsApp message when the number is configured.
- The form validates correctly on both client and server.
- Successful form submissions reach the configured Google Sheet.
- Failures are handled without losing the user's input.
- No secrets are exposed to the browser or committed to the repository.
- Legal and privacy pages contain no invented business facts and have been flagged for appropriate review.
- Metadata, sitemap, robots configuration, and social sharing basics are in place.
- Keyboard navigation, focus states, form labels, and reduced-motion behavior are checked.
- Linting, type-checking (if configured), and production build pass.
- Vercel deployment and custom-domain setup steps are documented.

---

## 12. Client Inputs Still Needed

Track these items as placeholders until the client supplies or confirms them:

- Approved brand colors, logo, and typography preferences (if any).
- Coach photos, training videos, and approved visual assets.
- WhatsApp business number in international format.
- Final CTA form fields and which fields are required.
- Google Sheet destination and Google Cloud/service-account setup.
- Business contact email and business/legal name.
- Business location/state and governing-law preference for attorney review.
- Privacy policy details: data collected, retention, deletion/contact process, and any analytics or tracking tools.
- Exact response hours and meaning of “priority response.”
- Confirmation of whether package payment is weekly, upfront, or handled through another agreed arrangement.
- Confirmation of whether the displayed weekly prices and totals are final.
- Any approved testimonials, reviews, client stories, or performance claims.

When the client provides new information, update the relevant centralized content/configuration and this document if it changes project-wide requirements.
