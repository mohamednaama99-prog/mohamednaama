"use client";

import {
  startTransition,
  useActionState,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { ArrowRight, Check, TriangleAlert } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons/whatsapp";

import {
  submitApplication,
  type ApplicationState,
} from "@/app/actions/submit-application";
import { SegmentedControl } from "@/components/primitives/segmented-control";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  cadenceSegments,
  formCopy,
  formFields,
  GENERAL_ENQUIRY,
  type FormField,
} from "@/content/form";
import {
  findPackage,
  formatUsd,
  getPackage,
  termOptions,
  type Cadence,
  type Months,
} from "@/content/packages";
import { whatsappLink } from "@/content/site";
import { formatUsPhone, normalizeUsPhone } from "@/lib/phone";
import { cn } from "@/lib/utils";
import {
  applicationSchema,
  fieldErrorsFrom,
  HONEYPOT_FIELD,
} from "@/lib/validation";

const initialState: ApplicationState = { status: "idle" };

type Values = Record<string, string>;

function FieldShell({
  field,
  error,
  children,
}: {
  field: FormField;
  error?: string;
  children: React.ReactNode;
}) {
  const id = `field-${field.name}`;

  return (
    <div className={cn("flex flex-col gap-2", field.wide && "sm:col-span-2")}>
      <Label htmlFor={id} className="text-sm text-ink">
        {field.label}
        {field.required ? (
          <span aria-hidden className="text-accent-text">
            *
          </span>
        ) : null}
      </Label>

      {children}

      {field.hint ? (
        <p id={`${id}-hint`} className="text-xs text-ink-muted">
          {field.hint}
        </p>
      ) : null}

      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ResultPanel({
  tone,
  icon,
  title,
  body,
  action,
  note,
}: {
  tone: "success" | "error";
  icon: React.ReactNode;
  title: string;
  body: string;
  action?: { href: string; label: string };
  note?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-6 rounded-xl border p-8 lg:p-10",
        tone === "success"
          ? "border-tan-500/40 bg-surface-raised"
          : "border-destructive/30 bg-surface-raised",
      )}
    >
      <span
        className={cn(
          "flex size-11 items-center justify-center rounded-full",
          tone === "success"
            ? "bg-sage-600/12 text-sage-600"
            : "bg-destructive/10 text-destructive",
        )}
      >
        {icon}
      </span>

      <div className="flex flex-col gap-3">
        <h3 className="t-h3">{title}</h3>
        <p className="max-w-[46ch] text-sm text-ink-muted">{body}</p>
      </div>

      {action ? (
        <Button asChild size="xl" variant="brand">
          <a href={action.href} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon />
            {action.label}
          </a>
        </Button>
      ) : null}

      {note ? (
        <p className="rounded-md border border-tan-500/50 bg-tan-100 px-3 py-2 font-mono text-[0.6875rem] text-accent-text">
          {note}
        </p>
      ) : null}
    </div>
  );
}

export function ApplicationForm({
  initialPackageId,
}: {
  initialPackageId?: string | null;
}) {
  const preselected = initialPackageId ? getPackage(initialPackageId) : undefined;

  const [state, formAction, pending] = useActionState(
    submitApplication,
    initialState,
  );
  const [months, setMonths] = useState<Months>(preselected?.months ?? 3);
  const [cadence, setCadence] = useState<string>(
    preselected?.cadence ?? GENERAL_ENQUIRY,
  );
  const [values, setValues] = useState<Values>({});
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  const packageId = useMemo(() => {
    if (cadence === GENERAL_ENQUIRY) return GENERAL_ENQUIRY;
    return findPackage(cadence as Cadence, months)?.id ?? GENERAL_ENQUIRY;
  }, [cadence, months]);

  const chosen = packageId === GENERAL_ENQUIRY ? null : getPackage(packageId);

  const errors = { ...state.fieldErrors, ...clientErrors };
  const notStored = state.status === "error" && state.message === "not-stored";
  const storageWhatsapp = notStored
    ? whatsappLink(formCopy.error.whatsappMessage)
    : null;
  const set = (name: string, value: string) =>
    setValues((previous) => ({ ...previous, [name]: value }));

  /*
   * Submitted programmatically rather than through the form's `action` prop.
   *
   * React 19 resets the form once an action settles, and Radix's Select and
   * Checkbox listen for that native reset event — so on a failed write they
   * would clear themselves while the plain inputs kept their values, leaving
   * the visitor with a half-empty form. Calling the action ourselves skips
   * the reset entirely, so nothing is lost when a submission fails.
   *
   * Validation runs here first so mistakes surface without a round trip. The
   * server runs the same schema again; this is a convenience, not a
   * guarantee.
   */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const raw = {
      packageId,
      ...Object.fromEntries(
        formFields.map((field) => [field.name, formData.get(field.name) ?? ""]),
      ),
    };

    const parsed = applicationSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors = fieldErrorsFrom(parsed.error);
      setClientErrors(fieldErrors);
      document.getElementById(`field-${Object.keys(fieldErrors)[0]}`)?.focus();
      return;
    }

    setClientErrors({});
    /* Dispatching the action ourselves means wrapping it in a transition —
       without one `pending` never flips and the button keeps saying "Send". */
    startTransition(() => formAction(formData));
  }

  if (state.status === "success") {
    const whatsapp = whatsappLink(formCopy.success.whatsappMessage);
    return (
      <ResultPanel
        tone="success"
        icon={<Check aria-hidden className="size-5" />}
        title={formCopy.success.title}
        body={formCopy.success.body}
        action={
          whatsapp
            ? { href: whatsapp, label: formCopy.success.whatsappLabel }
            : undefined
        }
        note={
          state.devMock
            ? "DEV MOCK — nothing was stored. Google Sheets is not configured; in production this submission would have been reported as failed."
            : undefined
        }
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
      {/* A failed write keeps the form mounted and filled: every field is
          controlled, so nothing the visitor typed is lost and they can retry
          or fall back to WhatsApp without starting again. */}
      {notStored ? (
        <div
          role="alert"
          className="flex flex-col items-start gap-4 rounded-xl border border-destructive/30 bg-surface-raised p-5"
        >
          <span className="flex items-center gap-2.5 font-display text-base text-ink">
            <TriangleAlert aria-hidden className="size-5 text-destructive" />
            That did not go through.
          </span>
          <p className="max-w-[52ch] text-sm text-ink-muted">
            {formCopy.error.notStored} Your answers are still here — you can
            try again.
          </p>
          {storageWhatsapp ? (
            <Button asChild size="pill" variant="quiet">
              <a href={storageWhatsapp} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon />
                {formCopy.error.whatsappLabel}
              </a>
            </Button>
          ) : null}
        </div>
      ) : null}

      {/* Honeypot — off-screen, never announced, never tab-reachable. */}
      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={HONEYPOT_FIELD}>Company</label>
        <input
          id={HONEYPOT_FIELD}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Plan — the same two choices as the pricing section, in the same
          shape, so nothing is asked twice in two different ways. */}
      {/* Plan. Stacked rather than side by side: two segmented controls in a
          two-column grid never line up once their labels differ in length, and
          the contact question matters enough to stand on its own row. */}
      <fieldset className="flex flex-col gap-6 rounded-xl border border-line bg-surface-sunken p-5 sm:p-6">
        <legend className="px-1 text-sm font-medium text-ink">
          {formCopy.planHeading}
        </legend>

        <input type="hidden" name="packageId" value={packageId} />

        <div className="flex flex-col gap-2.5">
          <span className="t-eyebrow text-ink-muted">Term</span>
          <SegmentedControl
            label="Coaching term"
            value={String(months)}
            onValueChange={(value) => setMonths(Number(value) as Months)}
            segments={termOptions}
            size="sm"
          />
        </div>

        <div className="flex flex-col gap-2.5 border-t border-line pt-5">
          <h3 className="font-display text-base text-ink">
            {formCopy.contactHeading}
          </h3>
          <p className="max-w-[58ch] text-xs text-ink-muted">
            {formCopy.contactHelp}
          </p>
          <SegmentedControl
            label="How close do you want the contact?"
            value={cadence}
            onValueChange={setCadence}
            segments={cadenceSegments}
            size="sm"
            className="mt-1"
          />
        </div>

        {/* Says back exactly what the two choices add up to, so the plan is
            never left to be inferred from two separate toggles. */}
        <div
          aria-live="polite"
          className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 rounded-lg border border-line bg-surface-raised px-4 py-4"
        >
          <div className="flex min-w-0 flex-col gap-1">
            <span className="t-eyebrow text-ink-muted">Selected plan</span>
            {chosen ? (
              <>
                <span
                  className="font-display text-lg leading-tight text-ink"
                  style={{ fontVariationSettings: '"wdth" 110, "wght" 680' }}
                >
                  {chosen.name}
                </span>
                <span data-numeric className="text-sm text-ink-muted">
                  {chosen.termLabel} · {chosen.weeks} weeks
                </span>
              </>
            ) : (
              <>
                <span
                  className="font-display text-lg leading-tight text-ink"
                  style={{ fontVariationSettings: '"wdth" 110, "wght" 680' }}
                >
                  General enquiry
                </span>
                <span className="text-sm text-ink-muted">
                  Mohamed will recommend a plan.
                </span>
              </>
            )}
          </div>

          {chosen ? (
            <div className="flex flex-col items-start gap-0.5 sm:items-end">
              <span
                data-numeric
                className="font-display text-2xl leading-none text-ink"
                style={{ fontVariationSettings: '"wdth" 110, "wght" 700' }}
              >
                {formatUsd(chosen.price.weekly)}
              </span>
              <span className="text-xs text-ink-muted">per week</span>
              <span data-numeric className="text-sm text-ink-muted">
                {formatUsd(chosen.price.total)} total
              </span>
            </div>
          ) : null}
        </div>

        {errors.packageId ? (
          <p role="alert" className="text-xs text-destructive">
            {errors.packageId}
          </p>
        ) : null}
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        {formFields
          .filter((field) => field.type !== "checkbox")
          .map((field) => {
            const id = `field-${field.name}`;
            const error = errors[field.name];
            const describedBy =
              [field.hint ? `${id}-hint` : null, error ? `${id}-error` : null]
                .filter(Boolean)
                .join(" ") || undefined;

            if (field.type === "select") {
              return (
                <FieldShell key={field.name} field={field} error={error}>
                  <Select
                    value={values[field.name] ?? ""}
                    onValueChange={(value) => set(field.name, value)}
                  >
                    <SelectTrigger
                      id={id}
                      aria-invalid={Boolean(error)}
                      aria-describedby={describedBy}
                      className="border-line-strong bg-surface-raised"
                    >
                      <SelectValue placeholder="Choose one" />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <input
                    type="hidden"
                    name={field.name}
                    value={values[field.name] ?? ""}
                  />
                </FieldShell>
              );
            }

            if (field.type === "textarea") {
              return (
                <FieldShell key={field.name} field={field} error={error}>
                  <Textarea
                    id={id}
                    name={field.name}
                    rows={3}
                    value={values[field.name] ?? ""}
                    onChange={(event) => set(field.name, event.target.value)}
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    aria-invalid={Boolean(error)}
                    aria-describedby={describedBy}
                    className="h-24 min-h-24 border-line-strong bg-surface-raised text-base md:text-sm"
                  />
                </FieldShell>
              );
            }

            if (field.type === "tel") {
              return (
                <FieldShell key={field.name} field={field} error={error}>
                  <div className="flex items-stretch">
                    {/* Fixed country code — US only for now, so no selector. */}
                    <span className="flex items-center rounded-l-md border border-r-0 border-line-strong bg-surface-sunken px-3 text-sm text-ink-muted">
                      +1
                    </span>
                    <Input
                      id={id}
                      type="tel"
                      inputMode="numeric"
                      placeholder={field.placeholder}
                      autoComplete={field.autoComplete}
                      value={formatUsPhone(values[field.name] ?? "")}
                      onChange={(event) =>
                        set(field.name, normalizeUsPhone(event.target.value))
                      }
                      aria-invalid={Boolean(error)}
                      aria-describedby={describedBy}
                      className="h-11 rounded-l-none border-line-strong bg-surface-raised text-base md:text-sm"
                    />
                  </div>
                  <input
                    type="hidden"
                    name={field.name}
                    value={values[field.name] ?? ""}
                  />
                </FieldShell>
              );
            }

            return (
              <FieldShell key={field.name} field={field} error={error}>
                <Input
                  id={id}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  maxLength={field.maxLength}
                  value={values[field.name] ?? ""}
                  onChange={(event) => set(field.name, event.target.value)}
                  aria-invalid={Boolean(error)}
                  aria-describedby={describedBy}
                  /* 16px minimum on phones — smaller makes iOS zoom on focus. */
                  className="h-11 border-line-strong bg-surface-raised text-base md:text-sm"
                />
              </FieldShell>
            );
          })}
      </div>

      {formFields
        .filter((field) => field.type === "checkbox")
        .map((field) => {
          const id = `field-${field.name}`;
          const error = errors[field.name];

          return (
            <div key={field.name} className="flex flex-col gap-2">
              {/* A 44px tap area around a 20px control: the label is part of
                  the target, so the box itself does not have to be large. */}
              <label
                htmlFor={id}
                className="-m-2 flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors hover:bg-surface-sunken"
              >
                <Checkbox
                  id={id}
                  name={field.name}
                  checked={values[field.name] === "on"}
                  onCheckedChange={(checked) =>
                    set(field.name, checked === true ? "on" : "")
                  }
                  aria-invalid={Boolean(error)}
                  className="mt-0.5 size-5 shrink-0 cursor-pointer border-line-strong data-[state=checked]:border-navy-800 data-[state=checked]:bg-navy-800 data-[state=checked]:text-mist-100"
                />
                <span className="text-sm leading-relaxed text-ink-muted">
                  {field.label}
                </span>
              </label>
              {error ? (
                <p role="alert" className="text-xs text-destructive">
                  {error}
                </p>
              ) : null}
            </div>
          );
        })}

      {state.status === "error" && state.message && state.message !== "not-stored" ? (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button
          type="submit"
          size="xl"
          variant="brand"
          disabled={pending}
          className="w-full sm:w-auto"
        >
          {pending ? formCopy.submittingLabel : formCopy.submitLabel}
          {pending ? null : <ArrowRight />}
        </Button>

        <p className="text-xs text-ink-muted">
          No payment is taken here. Mohamed replies on WhatsApp.
        </p>
      </div>
    </form>
  );
}
