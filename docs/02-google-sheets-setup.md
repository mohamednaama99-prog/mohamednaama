# Google Sheets integration — setup

The application form writes one row per submission to a Google Sheet via a
service account. No credentials exist in the repository and none have been
invented; the integration is built and inert until the variables below are set.

## Current behaviour without credentials

`src/lib/sheets.ts` → `readConfig()` returns `null`, so there is nowhere to
store a submission. What the visitor sees then depends on the build, and the
rule is absolute: **a success state is never shown for a submission that was
not persisted.**

| Build | Behaviour |
| --- | --- |
| **Production** | The submission is rejected. The visitor is told plainly that it did not reach Mohamed and is given a WhatsApp link instead. Logged as an error. |
| **Development** | Accepted so the flow can be reviewed end to end, and clearly labelled in the UI: `DEV MOCK — nothing was stored`. Logged as a warning with the full payload. |

This is enforced in `src/app/actions/submit-application.ts`, which checks
`isSheetsConfigured()` before it ever returns `status: "success"`, and again on
the result of `appendRow()`.

## Why no SDK

The `googleapis` package would add megabytes for a single REST call. Instead the
service-account JWT is signed with `node:crypto`, exchanged for an access token,
and used against the Sheets REST API. Roughly 100 lines, zero dependencies.

## Setup

### 1. Create the spreadsheet

Add a tab named **`Applications`** and put this header row in row 1:

| A | B | C | D | E | F | G | H | I | J |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| submittedAt | packageId | fullName | email | phone | goal | experience | trainingAccess | daysPerWeek | message |

`phone` is stored in E.164 (`+12125550147`). `packageId` is one of
`weekly-3`, `daily-3`, `weekly-6`, `daily-6` or `general-enquiry`.

Column order is defined by `columns` in
`src/app/actions/submit-application.ts` and is derived from
`src/content/form.ts`. **If the form fields change, this header row must
change with them.**

Note `consent` is validated but not written — tick-box consent is recorded by
the submission existing at all. Add it as a column if the client wants it
stored explicitly.

### 2. Create a service account

1. In the [Google Cloud console](https://console.cloud.google.com/), create or
   choose a project.
2. Enable the **Google Sheets API** for that project.
3. Create a **service account** (IAM & Admin → Service Accounts). No project
   roles are needed — access is granted per-spreadsheet in the next step.
4. Add a key of type **JSON** and download it.

### 3. Share the sheet with the service account

Open the spreadsheet, press **Share**, and add the service account's email
address (`...@....iam.gserviceaccount.com`) as an **Editor**. This is the step
that is easiest to forget; without it the API returns 403.

### 4. Set the environment variables

Copy `.env.example` to `.env.local` and fill in:

- `GOOGLE_SHEETS_SPREADSHEET_ID` — from the sheet URL.
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` — `client_email` in the JSON key.
- `GOOGLE_PRIVATE_KEY` — `private_key` in the JSON key, on one line with its
  `\n` sequences intact, wrapped in double quotes.
- `GOOGLE_SHEETS_RANGE` — optional, defaults to `Applications!A:Z`.

In production set the same three on the host (Vercel → Project → Settings →
Environment Variables). They must **not** be prefixed `NEXT_PUBLIC_`.

### 5. Verify

Submit the form. On success a new row appears in the sheet. If nothing arrives,
check the server logs:

- `Google Sheets is not configured` → a variable is missing or empty.
- `Token exchange failed (400)` → the private key is malformed, usually because
  the `\n` sequences were converted to real newlines or stripped.
- `Sheets API responded 403` → the sheet was not shared with the service
  account.
- `Sheets API responded 404` → wrong spreadsheet ID, or the tab name in
  `GOOGLE_SHEETS_RANGE` does not exist.

## Security notes

- `src/lib/sheets.ts` is imported only by a `"use server"` action, so the
  private key never enters the client bundle.
- The service account has access to exactly the spreadsheets it is shared with
  and nothing else.
- The form carries a honeypot field; submissions that fill it are accepted and
  silently discarded.
- Rate limiting is **not** implemented. Worth adding before launch if the form
  attracts spam — the natural place is the top of the server action.
