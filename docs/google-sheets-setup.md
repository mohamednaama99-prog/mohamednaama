# Google Sheets — setup

What you need to do so the application form starts recording submissions.
Nothing here is configured yet; the integration is written and inert.

## Before you start

Until all three required variables are set, the behaviour is deliberate:

| Build | What a visitor sees |
| --- | --- |
| **Production** | The submission is **rejected**. They are told plainly it did not reach Mohamed and are offered WhatsApp. Nothing is silently dropped. |
| **Development** | Accepted so the flow can be reviewed, labelled `DEV MOCK — nothing was stored`, with the full payload logged as a warning. |

A success state is never shown for a submission that was not persisted. This
is enforced in `src/app/actions/submit-application.ts`, which checks
`isSheetsConfigured()` before it can return success and again on the result of
the write.

## Environment variables

| Variable | Required | Where the value comes from |
| --- | --- | --- |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | **Yes** | The spreadsheet URL: `docs.google.com/spreadsheets/d/`**`THIS PART`**`/edit` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | **Yes** | `client_email` in the service-account JSON key you download from Google Cloud. Looks like `name@project-id.iam.gserviceaccount.com` |
| `GOOGLE_PRIVATE_KEY` | **Yes** | `private_key` in that same JSON key. Paste it on **one line** with the `\n` sequences left exactly as they appear, wrapped in double quotes |
| `GOOGLE_SHEETS_RANGE` | No | Sheet tab and columns to append to. Defaults to `Applications!A:Z` |

All four are **server-only** — none is prefixed `NEXT_PUBLIC_`, so the private
key never reaches the browser. `src/lib/sheets.ts` is imported only by a
`"use server"` action.

Unrelated to Sheets, but needed for a correct production deploy:

| Variable | Why |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, OG tags. Without it the code falls back to `https://coachmohamednaama.com` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Optional. Defaults to the confirmed number in `src/content/site.ts` |

## Step 1 — create the spreadsheet

Create a sheet, name the tab **`Applications`**, and put these **11 headers in
row 1, in this exact order**. The code writes positionally, so the order
matters and a mismatch silently misfiles data.

| A | B | C | D | E | F | G | H | I | J | K |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| submittedAt | packageId | fullName | email | phone | goal | experience | trainingAccess | daysPerWeek | message | consent |

Notes on the values:

- `submittedAt` — ISO 8601 UTC, e.g. `2026-11-16T09:14:32.374Z`
- `packageId` — one of `weekly-3`, `daily-3`, `weekly-6`, `daily-6`, or
  `general-enquiry`
- `phone` — E.164, e.g. `+12125550147`
- `consent` — `on` when ticked (the form will not submit without it)
- `message` — may be empty; every other column is always populated

This order is defined by `columns` in `src/app/actions/submit-application.ts`,
derived from `formFields` in `src/content/form.ts`. **If the form fields
change, update the header row to match.**

## Step 2 — create a service account

1. In the [Google Cloud console](https://console.cloud.google.com/), create or
   pick a project.
2. Enable the **Google Sheets API** for it.
3. IAM & Admin → Service Accounts → create one. It needs **no project roles**;
   access is granted per-spreadsheet in the next step.
4. Add a key of type **JSON** and download it. Treat it like a password.

## Step 3 — share the sheet with the service account

Open the spreadsheet, press **Share**, and add the service account's email
address as an **Editor**.

This is the step that is easiest to miss. Without it the API returns 403 even
though everything else is correct.

## Step 4 — set the variables

**Locally:** copy `.env.example` to `.env.local` and fill it in. `.env*` is
gitignored.

**On Vercel:** Project → Settings → Environment Variables. Add the three
required variables for Production (and Preview if you want the form live
there). The private key goes in as a single line with its `\n` sequences
intact — do not let the editor convert them to real newlines. Redeploy after
saving; environment variables are read at build and run time, not injected
into an existing deployment.

## Step 5 — verify

Submit the form. A new row should appear within a second or two.

If it does not, the server log says which step failed:

| Log line | Cause |
| --- | --- |
| `Google Sheets is not configured` | One of the three required variables is missing or empty |
| `Token exchange failed (400)` | Malformed private key — usually the `\n` sequences were converted to real newlines or stripped |
| `Sheets API responded 403` | The sheet was not shared with the service account |
| `Sheets API responded 404` | Wrong spreadsheet ID, or the tab named in `GOOGLE_SHEETS_RANGE` does not exist |

## How it works, briefly

No SDK. `googleapis` would add megabytes for one REST call, so
`src/lib/sheets.ts` signs a service-account JWT with `node:crypto`, exchanges
it for an access token, and POSTs to the Sheets `values:append` endpoint.
About 100 lines, zero dependencies.

## Spam and abuse

- **Honeypot** — a `company` field, positioned off-screen and not tab
  reachable. Submissions that fill it are accepted with a success response and
  silently discarded, so a bot learns nothing. Defined as `HONEYPOT_FIELD` in
  `src/lib/validation.ts`, checked first in the server action.
- **Validation runs twice** — the same zod schema runs in the browser before
  the request and again on the server against the raw `FormData`, so the
  client-side pass is a convenience and never a trust boundary.
- **No rate limiting.** This is the remaining gap. The form is a plain server
  action with no per-IP throttle, so a determined script could flood the
  sheet. If spam appears, the place to add it is the top of
  `submitApplication`, before validation.

## If a write fails

The visitor keeps everything they typed. Every field in the form is a
controlled React input, and a failed write renders an error banner **above the
still-populated form** rather than replacing it, so they can retry or switch
to WhatsApp without filling it in again.
