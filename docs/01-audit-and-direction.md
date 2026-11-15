# Coach Mohamed Naama — Direction & Architecture (v2, approved)

**Status:** approved 2026-11-03 with adjustments. Implementation underway.
**Supersedes:** v1 ("Carbon & Ember"), rejected on color direction only.

---

## 0. Note on `CLAUDE.md`

`CLAUDE.md` exists in the main checkout but is untracked, so it never reached this worktree — which is why v1 reported it missing. Its full contents are one line:

```
@AGENTS.md
```

It imports `AGENTS.md` and documents no client content. **The four coaching packages are not documented anywhere in the repository.** Package names and cadence are taken from the approval message; prices and inclusions are provisional and flagged in code until supplied. See §8.

---

## 1. Audit of the existing setup

| Area | State |
| --- | --- |
| Next.js | **16.4.4**, App Router, `src/app` |
| React | **19.3.0** |
| TypeScript | 5.x, `strict: true`, `@/*` → `./src/*` |
| Tailwind | **v4**, CSS-first, via `@tailwindcss/turbopack` loader rule — **not** PostCSS |
| Rendering | `cacheComponents: true` + `partialPrefetching: true` |
| Lint | `eslint-config-next` core-web-vitals + typescript, flat config |
| App code | Default template only |

**Fixed during implementation:** the template's `body { font-family: Arial }` override in `globals.css` (it defeated the font variables set in `layout.tsx`); `"Create Next App"` metadata; absent `sitemap.ts` / `robots.ts` / `manifest.ts` / `opengraph-image`; stock SVGs in `public/`.

---

## 2. Reference analysis — upliftyou.com

Computed styles pulled from the live site, not guessed:

- Plus Jakarta Sans; navy `#0E2344` / `#1B202C` ink; off-white `#F0F4F7` page; white cards; a single warm tan `#B1967D` accent.
- Radii of 10 / 15 / 20 / 25 / 40 / 50px — soft pill buttons and cards throughout.
- Hero: full-bleed photograph, white text bottom-left, pill CTA, three-stat row.

**What we take:** the color atmosphere (now the client's explicit instruction), the calm airy spacing, the stat row under the hero, pain-points before pricing, soft pill CTAs.

**What we leave:** its seventeen sections and three competing offers; its centered Webflow layout grammar; its lorem ipsum, `xx : xx : xx` countdown placeholders, and three contradictory annual prices still live on the page.

The palette is shared. The layout, type, motion and identity are ours.

---

## 3. Visual direction — "Harbour"

> **The idea in one line:** the calm, expensive quiet of the reference, given an athletic spine — deep navy, cool off-white, and a muted tan that warms the page without ever raising its voice.

Premium here comes from air, alignment and restraint. The page is light and open; navy carries weight where weight is needed; tan appears rarely enough to feel considered.

### 3.1 Color palette (revised — supersedes Carbon & Ember)

**Navy — primary ink and weighted surfaces**

| Token | Hex | Use |
| --- | --- | --- |
| `navy-900` | `#091729` | Deepest bands — footer, final CTA |
| `navy-800` | `#0E2344` | **Client navy.** Primary ink, primary button, dark sections |
| `navy-700` | `#16305A` | Hover on navy surfaces, elevated navy |
| `navy-600` | `#27416E` | Borders and dividers *on* navy |
| `navy-400` | `#5B7097` | Decorative only — fails as text on navy (3.6:1) |
| `navy-300` | `#7C8FAF` | Muted text on navy bands (5.5:1) |

**Neutrals — cool, biased toward the navy (chosen, not inherited)**

| Token | Hex | Use |
| --- | --- | --- |
| `mist-50` | `#F7F9FB` | Cards and raised surfaces on the page background |
| `mist-100` | `#F0F4F7` | **Client off-white.** Page background |
| `mist-200` | `#E2E8EF` | Hairlines, dividers, input borders |
| `mist-300` | `#C9D4E0` | Stronger rules, disabled states |
| `slate-500` | `#5C6B80` | Secondary text on light |

**Tan — the subtle accent**

| Token | Hex | Use |
| --- | --- | --- |
| `tan-100` | `#F4EDE5` | Softest fills, alternating band backgrounds |
| `tan-200` | `#E8DDD2` | Fills, quiet badges |
| `tan-500` | `#B1967D` | **The accent.** Rules, underlines, secondary button fill, text *on navy* |
| `tan-700` | `#6F5A45` | Accent **text on light** — the only tan that is readable there |

**Functional:** `sage-600` `#3F7D63` for success states. Muted on purpose; nothing in this palette shouts.

### Measured contrast — and the rules that follow from it

| Pair | Ratio | Verdict |
| --- | --- | --- |
| `navy-800` on `mist-100` | **14.1 : 1** | AAA — body and headings |
| `slate-500` on `mist-100` | **4.9 : 1** | AA — secondary text |
| `mist-100` on `navy-900` | **16.3 : 1** | AAA — text on dark bands |
| `navy-300` on `navy-900` | **5.5 : 1** | AA — muted text on dark bands |
| `navy-400` on `navy-900` | **3.6 : 1** | **Fails** — caught in implementation; muted ink on dark is `navy-300` |
| `tan-500` on `navy-800` | **5.6 : 1** | AA — tan text is safe **on navy** |
| `navy-800` on `tan-500` | **5.6 : 1** | AA — navy label on a tan button |
| `tan-500` on `mist-100` | **2.5 : 1** | **Fails** — never tan text on the light page |
| `tan-700` on `mist-100` | **5.9 : 1** | AA — the readable tan for light surfaces |

**Three rules this produces:**

1. **Tan on the light page is decoration, never text** — rules, underlines, fills, icon strokes. Accent *words* on light use `tan-700`.
2. **Primary button:** `navy-800` fill, `mist-100` label (14.1:1).
3. **Secondary button:** `tan-500` fill, `navy-800` label (5.6:1). Warm, quiet, and accessible.

### 3.2 Typography — approved, unchanged

| Role | Face | Setting |
| --- | --- | --- |
| Display | **Archivo** (variable `wght 100–900`, `wdth 62–125`) at **wdth 108–115, wght 600–720** | Width dialled back from v1 — the calmer palette wants a less shouty headline. Tracking `-0.02em`, line-height `0.95–1.05` |
| Body / UI | **Geist Sans** | `400/500/600`, line-height `1.6–1.7` |
| Data | **Geist Mono**, tabular figures | Stats, prices, durations, eyebrows |

All three via `next/font/google` — self-hosted, preloaded, no third-party request, no layout shift.

### 3.3 Design system — approved, radii revised

- **Semantic tokens over raw.** Components reference `surface` / `surface-raised` / `ink` / `ink-muted` / `accent` / `line`, never a hex.
- **Radii: soft and elegant** (revised from v1's 2px). `sm 8px` inputs and small controls · `md 12px` quiet blocks · `lg 16px` cards · `xl 24px` feature panels and media · `pill 999px` buttons, badges and tags. This matches the reference's visual language and suits the calmer palette.
- **Elevation.** A `mist-200` hairline plus a very soft, wide, low-opacity navy shadow (`0 1px 2px` + `0 12px 32px` at 4–6% navy) — the airy, expensive kind, not the generic grey blur. Navy sections use lightened surfaces rather than shadow.
- **Grid.** 12 columns, `1200px` content container, `1440px` full-bleed media. Gutters `20px` → `32px` → `48px`. Section padding `80 / 112 / 144px`.
- **shadcn/ui** supplies behaviour (Accordion, Dialog, Sheet, Tabs, Form, Input, Label, Select, Badge), restyled to these tokens on install.
- **Single light theme.** This is a brand site, not an app: one deliberate light look with navy bands as design, not an OS-driven dark mode. `color-scheme: light` is set explicitly.

### 3.4 Layout direction

Calm and airy like the reference, but asymmetric and editorial where the reference is centered. Generous white space, a left-weighted content axis, full-bleed media alternating with tightly-set text, and alternating `mist-100` / `mist-50` / `tan-100` / `navy-900` bands to give the scroll a rhythm.

### 3.5 Motion — expanded per approval

> **"Weight and control."** Confident, smooth, decelerating. Noticeable, never busy.

Approved scope, all implemented:

| Moment | Treatment |
| --- | --- |
| Hero headline | Line-by-line mask reveal, 90ms stagger |
| Hero media | Scale `1.06 → 1` with a fade, 1.2s |
| Section reveals | Fade + 16px rise, 80ms stagger across children, fires once |
| Background | Very slow drifting navy/tan radial washes behind hero and CTA band — 20s+, barely perceptible |
| Pricing cards | Lift, shadow bloom, tan rule draw-in on hover; the recommended card stays raised |
| Buttons | Press-scale `0.98`, tan sheen sweep on hover, arrow nudge |
| Section transitions | Soft gradient seams; `<ViewTransition>` on route changes |

**Rules:** easing `cubic-bezier(0.16, 1, 0.3, 1)` for entrances, `cubic-bezier(0.4, 0, 0.2, 1)` for state; durations 200 / 400 / 700 / 1200ms; transform and opacity only; reveals fire once and never replay; **`prefers-reduced-motion: reduce` disables everything**, rendering content in its final state.

**Still no Framer Motion.** Every item above is CSS plus a ~1KB `IntersectionObserver` hook. The library's 40–50KB on the critical path would buy nothing this list needs.

### 3.6 Mobile — approved, carousels narrowed

Mobile-first, intentionally designed. **Sticky bottom CTA** after the hero, in the thumb zone, clearing the home indicator. Art-directed hero asset rather than a cropped desktop image. 48px targets, 16px minimum input text.

**Horizontal scrolling only where it genuinely helps** (revised from v1): the four pricing packages get a snap rail on mobile — four tall cards stacked is a wall of scrolling. Everything else stacks vertically.

---

## 4. Site structure — simplified per approval

Ten sections, one offer, pricing early.

| # | Section | Job |
| --- | --- | --- |
| 1 | **Header** | Transparent over hero → solid on scroll. Logo, 4 links, CTA |
| 2 | **Hero** | The promise, in three seconds. **Split composition** — headline and CTAs left, athletic portrait anchored to the right edge. The photograph is tinted into the navy and its left and bottom edges dissolve into the section, so it reads as part of the composition rather than an image in a card. On phones the content stays on top and the portrait follows it full-bleed. One `<Image>` element positioned two ways, so it downloads once |
| 3 | **Trust & Experience** | 4,000+ sessions · 300+ clients · NASM certified · professional soccer player |
| 4 | **Meet Coach Mohamed** | Editorial split — portrait, story, credentials |
| 5 | **The Coaching Experience** | Benefits, approach and expectations. Absorbs the Method content from v1 |
| 6 | **Coaching Plans & Pricing** | Two-step selection: a segmented control picks the term, then exactly two cards (Weekly and Daily) show for it. Never more than two cards on screen, which is what lets the section stack cleanly on a phone with no horizontal rail |
| 7 | **Weekly vs. Daily** | Side-by-side comparison table |
| 8 | **FAQ** | Accordion |
| 9 | **Final CTA** | Sends visitors to /apply. The form itself is no longer embedded at the bottom of the page |
| 10 | **Footer** | Nav, socials, WhatsApp, legal |

**Removed:** the standalone Method section (folded into §5), testimonials and before/after results (hidden until real approved material exists), all app screenshots and references — **there is no coaching app**.

---

## 5. Conversion flow

There is **no checkout, no payment gateway, no booking system, no calendar, no scheduling.** One reusable application form.

```
Package card ──→ /apply?package=daily-6 ──┐
                                          ├─→ /apply (form) ─→ submit
General CTA ──→ /apply ───────────────────┘                      │
                                                                 ↓
                              client zod validation → server action → zod again
                                                                 │
                                       ┌─────────────────────────┴────────────┐
                                  stored in Sheets                   not stored
                                       │                                      │
                                 success state                   error state, never
                              + WhatsApp CTA                  "received" + WhatsApp CTA
```

- Package CTAs link to `/apply?package=<id>`, which preselects that plan. An unknown or malformed value falls back to no preselection. The form page is partially prerendered: the shell is static and only the param-dependent form streams in.
- Submission goes through a **server action** to a Google Sheets Service Account. Credentials stay server-side in env vars and never reach the client.
- **A success state is shown only when the submission was actually stored.** With Google Sheets unconfigured, a production build returns an error that says plainly the application did not reach Mohamed and points at WhatsApp. A development build accepts it so the flow can be reviewed and labels it `DEV MOCK — nothing was stored`.
- **WhatsApp continues the conversation** — it is not payment and not booking.
- Form fields are **provisional** and defined in one config object (`src/content/form.ts`), so the client's final field list is a single-file change. Validation in `src/lib/validation.ts` is derived from that same config, so the two cannot drift apart.
- Proposed first version: name, email, WhatsApp number, plan (with "Not sure yet — I have a question" for general enquiries), main goal, training experience, where they train, days per week, free-text message, and a consent tick.
- Selects are **native** `<select>` elements rather than a custom listbox: they submit without JavaScript, are keyboard and screen-reader correct by default, and give phones their own picker — which matters on the device most applications will arrive from.
- A honeypot field catches bots; those submissions are accepted and discarded silently. Rate limiting is not implemented and is worth adding before launch.

---

## 6. Component architecture

```
src/
  app/
    layout.tsx                 # fonts, metadata, JSON-LD
    page.tsx                   # composes the 10 sections
    globals.css                # tailwind + token layers
    sitemap.ts  robots.ts  manifest.ts  opengraph-image.tsx  not-found.tsx
    actions/submit-application.ts
  components/
    ui/            # shadcn primitives, restyled
    primitives/    # Section, Container, Eyebrow, Heading, Reveal, Stat, Button extras
    sections/      # Hero, TrustBar, AboutCoach, Experience, Pricing,
                   #   Comparison, Faq, ApplyCta
    layout/        # SiteHeader, MobileNav, StickyCta, SiteFooter
  content/         # site.ts packages.ts experience.ts faq.ts form.ts
  lib/             # cn.ts, seo.ts, jsonld.ts, sheets.ts, validation.ts
  hooks/           # useInView, useScrolled, useReducedMotion
```

**Rules:** server components by default, `'use client'` only on interactive leaves (nav, accordion, form, reveal, counters). All copy lives in `src/content/*` as typed data — no string is hard-coded in a component. Sections never import each other.

**Analytics:** none installed, per instruction. The layout is kept clean so GA4 can be added later in `app/layout.tsx` without restructuring anything.

**SEO & performance:** per-route metadata, canonical, generated OG image, JSON-LD (`Person`, `Organization`, `Service` per package, `FAQPage`), `next/image` with explicit `sizes` and `priority` on the hero only, self-hosted fonts, no third-party scripts. Budget: LCP < 2.0s on 4G, CLS < 0.05, INP < 200ms, first-load JS < 90KB gzipped.

---

## 7. Confirmed client content

Used verbatim; nothing beyond this is invented.

- Coach Mohamed Naama
- **4,000+ coaching sessions**
- **300+ clients**
- **NASM certified**
- **Professional soccer player**
- Four packages: **Daily Coaching** and **Weekly Coaching**, each in **3-month** and **6-month** terms
- WhatsApp as the post-application channel: **+1 347 653 7295** (`https://wa.me/13476537295`), configured in `src/content/site.ts` and reached only through `whatsappLink()`

---

## 8. Outstanding client inputs

Implementation does not block on any of these. Each is isolated to one config file and clearly marked in code.

| Input | Where it lives | Placeholder behaviour |
| --- | --- | --- |
| ~~Package prices~~ | — | **Supplied.** $55/$75 weekly on 3 months, $40/$60 on 6 months, with totals of $660/$900/$960/$1,440 |
| **Package inclusions** | `src/content/packages.ts` | Provisional feature lists marked `PROVISIONAL` in comments |
| **Daily vs Weekly differences** | `src/content/packages.ts` | Comparison rows marked provisional |
| **Coach biography** | `src/content/coach.ts` | **Still outstanding.** `CLAUDE.md` was named as the source twice; it contains one line (`@AGENTS.md`) and no bio. The placeholder restates only the four confirmed facts and invents no career history. `bioIsPlaceholder: true` |
| **Photography** | `src/content/media.ts` | Temporary Unsplash stock in place, credited in `public/images/README.md`, badged in development, swapped by editing one file |
| **Google Sheets credentials** | `.env` | Deferred to a final stage by agreement. The integration is built and inert; in production an unconfigured submission is reported as failed, never as received |
| **Domain** | `src/content/site.ts` | Affects canonical URLs and OG |
| **Legal pages + health disclaimer** | — | A health disclaimer is not optional for coaching |
| **Final form fields** | `src/content/form.ts` | Provisional field set, flagged in the UI copy |

---

## 9. Implementation stages

1. ~~**Foundations** — deps, shadcn, tokens, theme, fonts, content layer, primitives.~~ **Done**
2. ~~**Chrome** — header, mobile nav, footer, sticky CTA.~~ **Done**
3. ~~**Hero** + page shell and responsive foundations.~~ **Done** (rebuilt as a split composition)
4. ~~Trust & Experience · Meet Coach Mohamed · The Coaching Experience.~~ **Done**
5. ~~Pricing · Weekly vs Daily comparison.~~ **Done**
6. ~~FAQ · Application form · Google Sheets server action.~~ **Done** — integration built and inert until credentials arrive; see `docs/google-sheets-setup.md`
7. **Next:** SEO scaffolding (`sitemap.ts`, `robots.ts`, `manifest.ts`, `opengraph-image`), JSON-LD (`Person`, `Service`, `FAQPage`), then an accessibility and performance pass.

Analytics remain deliberately uninstalled, per instruction. `src/app/layout.tsx`
is kept clean so GA4 can be added there later without restructuring anything.

Lint, typecheck and build run at the end of every stage.
