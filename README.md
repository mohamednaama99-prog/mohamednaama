# Mohamed Naama — Online Fitness Coaching

The website for Mohamed Naama's online coaching: a homepage with his story,
plans and FAQ, About and Contact pages, the legal pages, and a five-step
**New Client Application** at `/apply`. Each application is validated, then
saved as one row in a Google Sheet, and the applicant continues on WhatsApp.
No payment is taken on the site.

Launching or handing over? Follow **[docs/launch-handoff.md](docs/launch-handoff.md)**.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, server actions) with React 19
  and TypeScript
- Tailwind CSS 4, Radix UI primitives, lucide icons; Archivo and Geist via
  `next/font`
- zod for one schema checked in the browser and on the server;
  libphonenumber-js for WhatsApp numbers
- Google Sheets as the applications inbox, called over REST with a service
  account (no Google SDK)
- Hosted on Vercel

## Local setup

Needs Node.js 20 or newer.

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. The site runs without any environment
variables; only sending the application needs the Google ones.

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serves the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no output |
| `npm run sheets:setup` | Builds or repairs the Google Sheet (below) |

## Environment variables

Every variable is listed in **[.env.example](.env.example)** with a one-line
explanation. Copy it to `.env.local` for local work and set the same names on
Vercel. `.env.local` is gitignored; never commit it or a service-account key.

- `GOOGLE_SHEETS_SPREADSHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`,
  `GOOGLE_PRIVATE_KEY`: required to store applications.
- `NEXT_PUBLIC_SITE_URL`: the public address. Optional on Vercel, which falls
  back to the project's production address.
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: optional override of the number in
  `src/content/site.ts`.
- `APPLY_DEV_SIMULATE`: development only; rehearses form outcomes without
  Google. Ignored in production.

## The Google Sheet

```powershell
npm run sheets:setup
npm run sheets:setup -- --test
```

The first command reads the three `GOOGLE_` values from `.env.local`, checks
access, and builds the **Applications** tab (one column per answer, a Status
dropdown, Coach notes) and an **Overview** tab. Running it again is safe: it
never deletes a row. `--test` also appends one marked test row and checks that
every answer lands under the right header; delete that row afterwards.
Creating the credentials is covered step by step in the handoff guide.

## Where things live

- `src/content/`: all copy, prices, form questions and image paths. Text
  changes happen here, not in components.
- `src/app/`: routes, metadata, sitemap, robots, and the server action that
  receives applications.
- `src/components/`: page sections, layout and the application form.
- `src/lib/`: validation, phone numbers, Google Sheets, rate limiting.
- `scripts/sheets-setup.ts`: the sheet setup script.
- `public/images/`: photographs; see its README before replacing one.
- `docs/`: the launch handoff and earlier project notes.
