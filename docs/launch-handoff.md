# Launch handoff

Everything in the code is done. What is left is creating the Google credentials,
putting them in two places (`.env.local` on your machine, and Vercel), and
three dashboard settings on Vercel. Allow about 30 minutes.

**Checklist**

1. [Google: project, API, service account, sheet](#1-google-project-api-service-account-sheet)
2. [`.env.local`](#2-envlocal)
3. [Run the sheet setup](#3-run-the-sheet-setup)
4. [Vercel: variables, rate limit, domain, redeploy](#4-vercel)
5. [After launch: test it for real](#5-after-launch-test-it-for-real)
6. [Using the sheet day to day](#6-using-the-sheet-day-to-day)
7. [Rotating the key, or switching Google accounts](#7-rotating-the-key-or-switching-google-accounts)
8. [Troubleshooting](#8-troubleshooting)
9. [How the form is protected](#9-how-the-form-is-protected)

---

## 1. Google: project, API, service account, sheet

Do this signed in to the Google account that should own the applications
(Mohamed's).

**1.1 Create a Google Cloud project**

1. Open <https://console.cloud.google.com>. Accept the terms if this is the
   first visit.
2. Click the project picker at the top → **New project**.
3. Name it, for example `naama-coaching`. Leave the organization as it is →
   **Create**. Make sure the new project is selected in the picker afterwards.

**1.2 Enable the Google Sheets API**

1. Menu → **APIs & Services** → **Library**.
2. Search for **Google Sheets API** → open it → **Enable**.

No other API is needed. (Not the Drive API.)

**1.3 Create the service account and its key**

A service account is a robot Google account the website signs in as. It can
only touch spreadsheets that are explicitly shared with it.

1. Menu → **IAM & Admin** → **Service Accounts** → **Create service account**.
2. Name: `naama-applications` → **Create and continue**.
3. Skip "Grant this service account access to project" and "Grant users
   access" → **Done**. It needs no project roles.
4. Click the new service account → **Keys** tab → **Add key** →
   **Create new key** → **JSON** → **Create**.

A `.json` file downloads. It is a password: never commit it, email it or paste
it into a chat. You will copy two values out of it in step 2, then store the
file in a password manager (or delete it — you can always create a new key).

If Google says key creation is disabled by an organization policy, the account
belongs to a Google Workspace organization that blocks keys. Use a personal
Google account for the Cloud project instead, or ask the Workspace admin to
allow keys for this project.

**1.4 Create the spreadsheet**

1. Open <https://sheets.new> (same Google account).
2. Name it, for example `Naama Coaching — Applications`.
3. **File → Settings → Time zone**: set Mohamed's time zone, then **Save
   settings**. "Submitted at" is written in this time zone, so set it before
   the first real application.

You do not need to add tabs or headers. The setup script in step 3 builds
everything.

**1.5 Share it with the service account as Editor**

1. Open the JSON file and copy the `client_email` value (it ends in
   `.iam.gserviceaccount.com`).
2. In the sheet: **Share** → paste that address → set the role to **Editor** →
   untick **Notify people** → **Share**. Google may warn that the address
   cannot receive email; that is expected.

This is the step most often missed. Without it every write fails with "no
access".

**1.6 Copy the spreadsheet ID**

From the sheet's address:

```
https://docs.google.com/spreadsheets/d/1AbCdEf...XyZ/edit#gid=0
                                       └── this part ──┘
```

---

## 2. `.env.local`

In the project folder, copy `.env.example` to `.env.local` and fill in these
three lines. `.env.local` is gitignored.

```dotenv
# Spreadsheet ID from step 1.6
GOOGLE_SHEETS_SPREADSHEET_ID="1AbCdEf...XyZ"

# JSON key file → "client_email"
GOOGLE_SERVICE_ACCOUNT_EMAIL="naama-applications@your-project.iam.gserviceaccount.com"

# JSON key file → "private_key", pasted exactly as it is in the file:
# one line, \n sequences kept, inside double quotes
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n"
```

| Variable | Where the value comes from |
| --- | --- |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | The sheet's address (step 1.6) |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `client_email` in the JSON key file |
| `GOOGLE_PRIVATE_KEY` | `private_key` in the JSON key file |
| `NEXT_PUBLIC_SITE_URL` | Your domain, `https://coachmohamednaama.com` (already in `.env.example`) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Optional. Digits only; defaults to the number in `src/content/site.ts` |

The private key is accepted with escaped `\n` (as in the JSON) or with real
line breaks, as long as it is inside double quotes.

Do not set `APPLY_DEV_SIMULATE` here unless you are rehearsing the form's
states locally; it is ignored in production anyway.

---

## 3. Run the sheet setup

```powershell
npm run sheets:setup
```

It checks the credentials and access, then builds the sheet:

- an **Applications** tab: Status, Submitted at, Full name, WhatsApp, Email,
  Plan, then every answer in form order, then Coach notes; navy header, frozen
  header row and first three columns, banding, column widths, wrapped long
  answers, a date-time format, a filter, and a color-coded Status dropdown;
- an **Overview** tab: total applications, this month, last 30 days, a count
  per status, and the conversion rate (Active client / total).

It is safe to run again at any time: it never deletes a row, and it only
re-applies the layout. If an existing Applications tab has a different layout
and already holds rows, it is renamed `Applications (old layout …)` and kept,
and a fresh tab is created.

Then confirm a real write end to end:

```powershell
npm run sheets:setup -- --test
```

This appends one row marked `TEST ROW - safe to delete`, reads it back and
checks every answer landed under the right header. **Delete that row
afterwards** (right-click the row number → Delete row), or it counts in the
Overview.

You can delete the empty `Sheet1` tab.

If either command stops with a ✗, the message says what to fix. The common
ones are in [Troubleshooting](#8-troubleshooting).

---

## 4. Vercel

All in the Vercel dashboard, in the project for this site.

**4.1 Environment variables**

**Settings → Environment Variables**. Add each of these with only
**Production** ticked:

| Key | Value | Sensitive |
| --- | --- | --- |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | as in `.env.local` | optional |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | as in `.env.local` | optional |
| `GOOGLE_PRIVATE_KEY` | as in `.env.local`, **without** the surrounding quotes | **Yes: turn on Sensitive** |
| `NEXT_PUBLIC_SITE_URL` | `https://coachmohamednaama.com` | no |

For `GOOGLE_PRIVATE_KEY`, paste the value from the JSON file as it is (one line
with `\n`). A sensitive variable cannot be viewed again after saving, only
replaced, which is what you want for a key.

Leaving Preview unticked means preview deployments cannot write to the real
sheet; their form shows the "could not send" message. To test on previews,
create a second sheet and add its ID for Preview only.

**4.2 Rate-limit rule (edge)**

The code already limits each IP to 5 submissions per 10 minutes, but that
counter lives in each server instance's memory. The edge rule stops floods
before they reach the code at all. It cannot be set from `vercel.json` (that
file's firewall actions are only challenge and deny), so it is a dashboard
setting:

1. Open the project's **Firewall** tab → **Configure** → **+ New Rule**.
2. Name: `Apply form rate limit`.
3. **If**: `Request Path` · `Equals` · `/apply`
   **And**: `Method` · `Equals` · `POST`
4. **Then**: **Rate Limit**
   - Strategy: **Fixed Window**
   - Time window: **10 minutes** (600 seconds)
   - Request limit: **10**
   - Key: **IP Address**
   - Action when exceeded: **Too Many Requests (429)**
5. **Save Rule** → **Review Changes** → **Publish**.

Only submitting the form sends a POST to `/apply`; moving between steps does
not. The limit is counted per Vercel region. Rate-limit rules are available
on the Hobby plan (one per project).

**4.3 Custom domain**

1. **Settings → Domains** → enter `coachmohamednaama.com` → **Add**. Add
   `www.coachmohamednaama.com` too and choose to redirect it to the bare
   domain, so it matches `NEXT_PUBLIC_SITE_URL`.
2. At the domain registrar, create exactly the DNS records Vercel shows
   (usually an A record for the bare domain and a CNAME for `www`).
3. Wait until both show **Valid Configuration**. HTTPS is issued
   automatically.

**4.4 Redeploy**

Environment variables only reach new deployments, and `NEXT_PUBLIC_SITE_URL`
is built into the pages. **Deployments** → the latest Production deployment
→ **⋯** → **Redeploy**.

---

## 5. After launch: test it for real

1. On a phone, open `https://coachmohamednaama.com/apply` and send a real
   application with your own details. It should end on "Application
   received".
2. In the sheet, the row appears with Status **New** and the time in
   Submitted at. Check a few answers, then delete the row (or set its Status
   to Not a fit so the Overview stays honest).
3. On the success panel, tap **Continue on WhatsApp** and check it
   opens a chat with the right number.
4. In Vercel → **Logs**, search for `[application]`. There should be nothing.
   Any line there names the problem (for example a missing variable name)
   without showing a value.
5. **Google Search Console** (<https://search.google.com/search-console>):
   **Add property** → **Domain** → `coachmohamednaama.com` → add the TXT
   record it shows at the registrar → **Verify**. Then **Sitemaps** → enter
   `sitemap.xml` → **Submit**. Optionally, **URL inspection** on the homepage
   → **Request indexing**.
6. Check the security headers are live:

   ```powershell
   (Invoke-WebRequest https://coachmohamednaama.com -Method Head).Headers
   ```

   The list should include `Content-Security-Policy`,
   `Strict-Transport-Security` and `X-Frame-Options`.

---

## 6. Using the sheet day to day

- **Status**: every new row arrives as **New**. Change it from the dropdown
  as the conversation moves: Contacted → In conversation → Awaiting payment
  → Active client, or Not a fit / No response. Each has its own color, and
  the Overview counts them.
- **Coach notes**: the last column is yours. The website never writes there,
  and a note in an empty row does not change where the next application lands.
- **Sorting and filtering** with the header filter is fine.
- **Do not rename, reorder, insert or delete columns** from Status to Coach
  notes. The website writes answers by position. Add your own columns only to
  the right of Coach notes. If the layout gets damaged, run
  `npm run sheets:setup` again.
- **Do not rename the Applications tab.**
- Health answers read `No`, or `Yes - ` followed by the applicant's details.

---

## 7. Rotating the key, or switching Google accounts

**Rotate the key** (yearly, or straight away if it may have leaked):

1. Cloud console → **IAM & Admin → Service Accounts** → the account →
   **Keys** → **Add key → Create new key → JSON**.
2. Put the new `private_key` in `.env.local` and run `npm run sheets:setup` to
   confirm it works.
3. In Vercel, replace `GOOGLE_PRIVATE_KEY` with the new value, then
   **Redeploy**.
4. Back in **Keys**, delete the old key.

If a key leaked, delete it first (step 4), then do steps 1–3. The form shows
the "could not send" message with the WhatsApp fallback until the new key is
deployed.

**Move the sheet to another Google account**

- *Keep the same sheet*: **Share** → give the new account Editor access →
  open the share settings again → **Transfer ownership**. Nothing else
  changes, because the service account still has access.
- *Start a new sheet in the new account*: repeat steps 1.4–1.6, put the new
  `GOOGLE_SHEETS_SPREADSHEET_ID` in `.env.local` and Vercel, run
  `npm run sheets:setup`, redeploy. Copy old rows across if you need them.
- *Move the Cloud project too*: repeat step 1 in the new account, share the
  sheet with the new service account, and replace all three variables.
  Delete the old service account's key afterwards.

---

## 8. Troubleshooting

| You see | Meaning | Fix |
| --- | --- | --- |
| `Missing from .env.local: …` | Those variables are empty or absent | Fill them in (step 2) |
| `GOOGLE_PRIVATE_KEY is not a valid private key` | The key was cut short or reformatted | Copy `private_key` again, whole, inside double quotes |
| `Google rejected the service account's credentials` | Email and key are from different key files, or the key was deleted | Use `client_email` and `private_key` from the same JSON file |
| `The Google Sheets API is not enabled` | Step 1.2 was skipped, or done in another project | Open the link it prints, **Enable**, wait a minute |
| `The service account cannot open this spreadsheet` | The sheet is not shared with it | Step 1.5 |
| `…can read the spreadsheet but cannot edit it` | Shared as Viewer | Change it to Editor |
| `No spreadsheet with the ID …` | Wrong ID | Step 1.6 |
| Live form says it could not send | Check Vercel → Logs for `[application]` | The line names the cause: a missing variable name, or a Google error code (`no-access`, `api-disabled`, …) |

---

## 9. How the form is protected

For reference; nothing here needs doing.

- **One schema, checked twice.** `src/lib/validation.ts` validates in the
  browser and again on the server: allowed values only, number ranges, length
  limits (120 characters for short answers, 1000 for long ones), trimmed,
  control and invisible characters removed, unknown fields rejected.
- **Bots.** A hidden honeypot field (filled → silently discarded) and a
  minimum time between opening the form and sending it.
- **Rate limits.** 5 per IP per 10 minutes in the code, plus the edge rule
  above.
- **Spreadsheet safety.** Values are written with `valueInputOption=RAW`, so
  nothing is ever run as a formula, and any answer starting with `=`, `+`,
  `-`, `@` or a tab is prefixed with an apostrophe for when the sheet is
  exported.
- **Secrets.** The Google code imports `server-only`, uses only the
  spreadsheets scope, and logs neither answers nor keys. The visitor only ever
  sees a generic message.
- **Headers.** Content-Security-Policy, HSTS, `X-Content-Type-Options`,
  `Referrer-Policy`, `X-Frame-Options`/`frame-ancestors` and
  `Permissions-Policy`, set in `next.config.ts`.
- **Answers in progress** are kept in the browser's sessionStorage, so a
  refresh does not lose them. They are cleared on success and when the tab
  closes, and never use localStorage.
