# Launch handoff: today's checklist

The code is finished. Today's work is moving it to the client's accounts and
switching it on. Do the steps in order; each one says what "done" looks like.
Allow about an hour, plus however long DNS takes.

`<your-domain>` below means the client's domain, without `https://` or `www`.

**Today**

- [ ] 1. [Move the repository to the client's GitHub](#1-move-the-repository-to-the-clients-github)
- [ ] 2. [Import it into Vercel](#2-import-it-into-vercel)
- [ ] 3. [Environment variables (Google credentials first)](#3-environment-variables)
- [ ] 4. [Run the sheet setup locally with the client's values](#4-run-the-sheet-setup-locally)
- [ ] 5. [Connect the domain](#5-connect-the-domain)
- [ ] 6. [Redeploy](#6-redeploy)
- [ ] 7. [Live test](#7-live-test)

**After launch**

- [ ] 8. [Post-launch steps](#8-post-launch-steps): rate-limit rule, Search
  Console, cleanup, access

**Reference:** [using the sheet](#using-the-sheet-day-to-day) ·
[rotating the key](#rotating-the-key-or-switching-google-accounts) ·
[troubleshooting](#troubleshooting) · [how the form is protected](#how-the-form-is-protected)

### What you need before starting

- The client signed in to their **GitHub**, **Vercel** and **Google** accounts
  (Google: the account that should own the applications).
- Login for the **domain registrar**, to add DNS records.
- On your machine: Node.js 20 or newer and Git.

---

## 1. Move the repository to the client's GitHub

The cleanest way is a transfer: history, branches and pull requests move with it.

1. Merge or close any open pull requests first, and delete branches that are
   already merged (**Branches** → trash icon), so the client receives a tidy
   repository.
2. **Settings** → **General** → **Danger Zone** → **Transfer ownership** →
   enter the client's GitHub username or organization → confirm.
3. The client accepts the transfer from the email GitHub sends them.
4. On your machine, point the local copy at the new address:

   ```powershell
   git remote set-url origin https://github.com/<client-account>/coaching-web.git
   git fetch origin
   ```

GitHub redirects the old address for a while, but do not rely on it.

If the client prefers to create the repository themselves: they create an
**empty private** repository (no README, no license), add you as a
collaborator, and you push `main` to it:

```powershell
git remote set-url origin https://github.com/<client-account>/<repo-name>.git
git push -u origin main
```

**Done when** the repository is under the client's account and `main` there
matches your local `main`.

---

## 2. Import it into Vercel

Signed in to the **client's** Vercel account:

1. <https://vercel.com/new> → **Import Git Repository** → connect GitHub if
   asked, and allow the Vercel app access to this repository.
2. Pick the repository. Vercel detects **Next.js**; leave the root directory,
   build command and output settings as they are.
3. **Environment Variables** on the same screen: add the ones from step 3 now
   if you already have them. If not, deploy anyway and add them afterwards.
4. **Deploy.**

The build needs no variables to succeed. Without the Google ones the site
works fully, except that the form ends in "That did not go through" with the
WhatsApp fallback. Until `NEXT_PUBLIC_SITE_URL` is set, canonical links, the
sitemap and the social cards use the project's own production address
(`<project>.vercel.app`, or the custom domain once one is connected).

**Done when** the `vercel.app` address opens the site.

---

## 3. Environment variables

### 3.1 Create the Google credentials

Signed in to the client's Google account.

**Cloud project and API**

1. <https://console.cloud.google.com> → accept the terms on a first visit.
2. Project picker at the top → **New project** → name it, e.g.
   `naama-coaching` → **Create**. Make sure it is selected afterwards.
3. Menu → **APIs & Services** → **Library** → **Google Sheets API** →
   **Enable**. No other API is needed.

**Service account and key**

A service account is a robot Google account the website signs in as. It can
only touch spreadsheets shared with it.

1. Menu → **IAM & Admin** → **Service Accounts** → **Create service account**.
2. Name: `naama-applications` → **Create and continue** → skip both optional
   steps → **Done**. It needs no project roles.
3. Open it → **Keys** → **Add key** → **Create new key** → **JSON** →
   **Create**.

A `.json` file downloads. It is a password: never commit it, email it or paste
it into a chat. Copy two values out of it below, then keep it in a password
manager or delete it (a new key can always be created).

If Google says key creation is disabled by an organization policy, the account
belongs to a Workspace organization that blocks keys: use a personal Google
account for the Cloud project, or ask the Workspace admin to allow keys.

**Spreadsheet**

1. <https://sheets.new> → name it, e.g. `Naama Coaching — Applications`.
2. **File → Settings → Time zone** → Mohamed's time zone → **Save settings**.
   "Submitted at" is written in this zone.
3. **Share** → paste the JSON file's `client_email` → role **Editor** →
   untick **Notify people** → **Share**. (Google may warn the address cannot
   receive email; that is expected.) This is the step most often missed.
4. Copy the spreadsheet ID from its address:

   ```
   https://docs.google.com/spreadsheets/d/1AbCdEf...XyZ/edit#gid=0
                                          └── this part ──┘
   ```

You do not add tabs or headers; step 4 builds them.

### 3.2 Add them on Vercel

Project → **Settings** → **Environment Variables**. Add each with only
**Production** ticked:

| Key | Value | Notes |
| --- | --- | --- |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | the ID from 3.1 | required |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `client_email` from the JSON file | required |
| `GOOGLE_PRIVATE_KEY` | `private_key` from the JSON file, the whole line with its `\n` sequences | required; tick **Sensitive** |
| `NEXT_PUBLIC_SITE_URL` | `https://<your-domain>` | add in step 5, once the domain works |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | digits only, with the country code | optional; the number in `src/content/site.ts` is used otherwise |

The private key works with or without surrounding quotes, and with `\n`
sequences or real line breaks. A Sensitive variable can only be replaced,
never viewed again, which is what you want for a key.

Leaving **Preview** unticked means preview deployments cannot write to the
real sheet. To test on previews, create a second sheet and add its ID for
Preview only.

Never set `APPLY_DEV_SIMULATE` on Vercel. Production builds ignore it anyway.

**Done when** the three `GOOGLE_` variables are saved for Production.

---

## 4. Run the sheet setup locally

This builds the sheet with the **client's** values, from your machine, before
the live test.

```powershell
git clone https://github.com/<client-account>/coaching-web.git
cd coaching-web
npm ci
Copy-Item .env.example .env.local
```

Open `.env.local` and fill in the three `GOOGLE_` lines with the same values
as on Vercel. Keep `GOOGLE_PRIVATE_KEY` inside double quotes there. Leave the
other lines commented out. Then:

```powershell
npm run sheets:setup
```

It checks the credentials and access, then builds:

- an **Applications** tab: Status, Submitted at, Full name, WhatsApp, Email,
  Plan, then every answer in form order, then Coach notes. Navy frozen header,
  first three columns frozen, banding, wrapped long answers, a filter, and a
  color-coded Status dropdown;
- an **Overview** tab: totals, this month, last 30 days, a count per status
  and the conversion rate.

Then confirm a real write end to end:

```powershell
npm run sheets:setup -- --test
```

It appends one row marked `TEST ROW - safe to delete` and checks every answer
landed under the right header. **Delete that row** (right-click the row
number → Delete row), and the empty `Sheet1` tab.

Running setup again is always safe: it never deletes a row and a second run
changes nothing. If an existing Applications tab has a different layout and
already holds rows, it is renamed `Applications (old layout …)` and kept, and
a fresh tab is created.

**Done when** both commands end without a ✗. If one stops, the message says
what to fix; see [Troubleshooting](#troubleshooting).

---

## 5. Connect the domain

1. Vercel project → **Settings** → **Domains** → add `<your-domain>`. Add
   `www.<your-domain>` too and set it to redirect to the bare domain.
2. At the registrar, create exactly the DNS records Vercel shows (usually an A
   record for the bare domain and a CNAME for `www`).
3. Wait until both show **Valid Configuration**. HTTPS is issued
   automatically.
4. **Settings** → **Environment Variables** → add `NEXT_PUBLIC_SITE_URL` =
   `https://<your-domain>` (no trailing slash), Production only.

**Done when** `https://<your-domain>` opens the site with a padlock.

---

## 6. Redeploy

Variables only reach new builds, and `NEXT_PUBLIC_SITE_URL` is written into
the pages at build time.

**Deployments** → the latest Production deployment → **⋯** → **Redeploy**.

**Done when** the new deployment shows **Ready**.

---

## 7. Live test

1. On a phone, open `https://<your-domain>/apply` and send a real application
   with your own details. It ends on **Application received**.
2. In the sheet, the row appears with Status **New** and the time in
   Submitted at. Check a few answers, then delete the row.
3. On the success panel, tap **Continue on WhatsApp**: it opens a chat with
   Mohamed's number.
4. Vercel → **Logs** → search `[application]`. There should be nothing. Any
   line there names the cause without showing a value.
5. Open `https://<your-domain>/sitemap.xml` and `https://<your-domain>/robots.txt`:
   every address in them starts with `https://<your-domain>`.
6. Check the security headers:

   ```powershell
   (Invoke-WebRequest https://<your-domain> -Method Head).Headers
   ```

   The list includes `Content-Security-Policy`, `Strict-Transport-Security`
   and `X-Frame-Options`.

**Done when** all six pass. The site is live.

---

## 8. Post-launch steps

### 8.1 Rate-limit rule on the form

The code already limits each visitor to 5 submissions per 10 minutes, but that
count lives in each server instance's memory. A rule at Vercel's edge stops
floods before they reach the code. It is a dashboard setting (it cannot be
set from `vercel.json`):

1. Project → **Firewall** → **Configure** → **+ New Rule**.
2. Name: `Apply form rate limit`.
3. **If** `Request Path` · `Equals` · `/apply`
   **And** `Method` · `Equals` · `POST`
4. **Then** **Rate Limit**: Fixed Window · **600 seconds** (10 minutes) ·
   **10** requests · key **IP Address** · action **Too Many Requests (429)**.
5. **Save Rule** → **Review Changes** → **Publish**.

The form sends its one POST to the page address, `/apply`; moving between
steps sends nothing. A query string such as `/apply?package=…` does not change
the path, so the rule still matches. The limit is counted per region.
Rate-limit rules are available on the Hobby plan (one per project).

To check it: submit the form twice in a row on the live site. Both go through,
because the code limit is 5 and the edge limit is 10.

### 8.2 Google Search Console

<https://search.google.com/search-console> → **Add property** → **Domain** →
`<your-domain>` → add the TXT record it shows at the registrar → **Verify**.
Then **Sitemaps** → `sitemap.xml` → **Submit**. Optionally **URL inspection**
on the homepage → **Request indexing**.

### 8.3 Cleanup and access

- Delete any test rows left in the sheet so the Overview counts only real
  applications.
- Remove developer access the client no longer wants: GitHub collaborators
  (**Settings → Collaborators**), Vercel team members, and any shares on the
  sheet other than the service account.
- Keep the JSON key file in a password manager, or delete it.

---

## Using the sheet day to day

- **Status**: every new row arrives as **New**. Change it from the dropdown as
  the conversation moves: Contacted → In conversation → Awaiting payment →
  Active client, or Not a fit / No response. Each has its own color, and the
  Overview counts them.
- **Coach notes**: the last column is Mohamed's. The website never writes
  there, and a note does not change where the next application lands.
- **Sorting and filtering** with the header filter is fine.
- **Do not rename, reorder, insert or delete columns** from Status to Coach
  notes; the website writes answers by position. Add your own columns only to
  the right of Coach notes. If the layout gets damaged, run
  `npm run sheets:setup` again.
- **Do not rename or delete the Applications tab**, and keep its header row.
  Without them the form stops saving (the visitor sees the WhatsApp fallback)
  until `npm run sheets:setup` is run.
- **WhatsApp** is always in full international format with the country code,
  for example `+1 212 555 0147` or `+44 7911 123456`. A number typed without
  a country code is a US number.
- Health answers read `No`, or `Yes - ` followed by the applicant's details.
- A typed answer that starts with `=`, `+`, `-` or `@` is shown with a leading
  apostrophe (for example `'+ night shifts`). That is deliberate: it stops the
  text being treated as a formula if the sheet is exported. The WhatsApp
  column has no apostrophe: it is validated as a phone number.

---

## Rotating the key, or switching Google accounts

**Rotate the key** (yearly, or straight away if it may have leaked):

1. Cloud console → **IAM & Admin → Service Accounts** → the account →
   **Keys** → **Add key → Create new key → JSON**.
2. Put the new `private_key` in `.env.local` and run `npm run sheets:setup` to
   confirm it works.
3. On Vercel, replace `GOOGLE_PRIVATE_KEY` with the new value, then
   **Redeploy**.
4. Back in **Keys**, delete the old key.

If a key leaked, delete it first (step 4), then do steps 1–3. Until the new
key is deployed the form shows the WhatsApp fallback.

**Move the sheet to another Google account**

- *Keep the same sheet*: **Share** → give the new account Editor access →
  open the share settings again → **Transfer ownership**. Nothing else
  changes; the service account keeps its access.
- *Start a new sheet*: repeat the spreadsheet part of 3.1, put the new
  `GOOGLE_SHEETS_SPREADSHEET_ID` in `.env.local` and on Vercel, run
  `npm run sheets:setup`, redeploy. Copy old rows across if needed.
- *Move the Cloud project too*: repeat 3.1 in the new account, share the sheet
  with the new service account, replace all three variables, and delete the
  old key.

---

## Troubleshooting

| You see | Meaning | Fix |
| --- | --- | --- |
| `No .env.local file in …` | Step 4 was run without `.env.local` | Copy `.env.example` to `.env.local` and fill in the three `GOOGLE_` lines |
| `Missing from .env.local: …` | Those variables are empty | Fill them in |
| `GOOGLE_PRIVATE_KEY is not a valid private key` | The key was cut short or reformatted | Copy `private_key` again, whole, inside double quotes |
| `Google rejected the service account's credentials` | Email and key are from different key files, or the key was deleted | Use `client_email` and `private_key` from the same JSON file |
| `The Google Sheets API is not enabled` | The API step was skipped, or done in another project | Open the link it prints, **Enable**, wait a minute |
| `The service account cannot open this spreadsheet` | The sheet is not shared with it | Share it (3.1, Spreadsheet step 3) |
| `…can read the spreadsheet but cannot edit it` | Shared as Viewer | Change it to Editor |
| `No spreadsheet with the ID …` | Wrong ID | Copy it again from the sheet's address |
| Live form says "That did not go through" | Vercel → **Logs** → search `[application]` | The line names the cause, below |
| Log: `Google Sheets is not configured. Missing environment variable(s): …` | Those variables are not set for Production | Add them (3.2) and redeploy |
| Log: `the spreadsheet has no "Applications" tab` | The tab was renamed or deleted | Run `npm run sheets:setup` (or rename the tab back) |
| Log: `the "Applications" tab has no header row` | Row 1 was cleared or deleted | Run `npm run sheets:setup`; it restores the header and keeps the rows |
| Log: `Google Sheets no-access`, `api-disabled`, `invalid-credentials`, `not-found` | The matching row above | Fix it, then run `npm run sheets:setup` locally to confirm |

---

## How the form is protected

For reference; nothing here needs doing.

- **One schema, checked twice.** `src/lib/validation.ts` validates in the
  browser and again on the server: allowed values only, number ranges, length
  limits (120 characters for short answers, 1000 for long ones), trimmed,
  control and invisible characters removed, unknown fields rejected.
- **Bots.** A hidden honeypot field (filled → silently discarded) and a
  minimum time between opening the form and sending it.
- **Rate limits.** 5 per visitor per 10 minutes in the code, plus the edge
  rule in 8.1.
- **Spreadsheet safety.** Values are written with `valueInputOption=RAW`, so
  nothing is ever run as a formula, and typed answers starting with `=`, `+`,
  `-`, `@` or a tab get a leading apostrophe for when the sheet is exported.
  The WhatsApp number is validated for its country with libphonenumber-js and
  stored as `+`, digits and spaces, so it needs no apostrophe. The
  header row is checked before every write, so an application is never written
  into an emptied tab's header row.
- **Secrets.** The Google code imports `server-only`, uses only the
  spreadsheets scope, and logs neither answers nor keys. The visitor only ever
  sees a generic message.
- **Headers.** Content-Security-Policy, HSTS, `X-Content-Type-Options`,
  `Referrer-Policy`, `X-Frame-Options`/`frame-ancestors` and
  `Permissions-Policy`, set in `next.config.ts`.
- **Answers in progress** are kept in the browser's sessionStorage, so a
  refresh does not lose them. They are cleared on success and when the tab
  closes, and never use localStorage.
