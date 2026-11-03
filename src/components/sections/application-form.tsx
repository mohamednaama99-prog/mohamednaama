"use client";

import { useActionState, useMemo, useState, type FormEvent } from "react";
import { ArrowRight, Check, TriangleAlert } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons/whatsapp";

import {
  submitApplication,
  type ApplicationState,
} from "@/app/actions/submit-application";
import { SegmentedControl } from "@/components/primitives/segmented-control";
import { Button } from "@/components/ui/button";
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
  const set = (name: string, value: string) =>
    setValues((previous) => ({ ...previous, [name]: value }));

  /* Validate before the request goes out, so mistakes surface immediately.
     The server runs the same schema again — this is a convenience, not a
     guarantee. */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const raw = {
      packageId,
      ...Object.fromEntries(
        formFields.map((field) => [field.name, formData.get(field.name) ?? ""]),
      ),
    };

    const parsed = applicationSchema.safeParse(raw);
    if (!parsed.success) {
      event.preventDefault();
      setClientErrors(fieldErrorsFrom(parsed.error));
      const firstError = Object.keys(fieldErrorsFrom(parsed.error))[0];
      document.getElementById(`field-${firstError}`)?.focus();
      return;
    }

    setClientErrors({});
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

  /* The submission could not be stored, so it is not reported as received. */
  if (state.status === "error" && state.message === "not-stored") {
    const whatsapp = whatsappLink(formCopy.error.whatsappMessage);
    return (
      <ResultPanel
        tone="error"
        icon={<TriangleAlert aria-hidden className="size-5" />}
        title="That did not go through."
        body={formCopy.error.notStored}
        action={
          whatsapp
            ? { href: whatsapp, label: formCopy.error.whatsappLabel }
            : undefined
        }
      />
    );
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
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
      <fieldset className="flex flex-col gap-5 rounded-xl border border-line bg-surface-sunken p-5 sm:p-6">
        <legend className="px-1 text-sm font-medium text-ink">
          {formCopy.planHeading}
        </legend>

        <input type="hidden" name="packageId" value={packageId} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <span className="t-eyebrow text-ink-muted">Term</span>
            <SegmentedControl
              label="Coaching term"
              value={String(months)}
              onValueChange={(value) => setMonths(Number(value) as Months)}
              segments={termOptions}
              size="sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="t-eyebrow text-ink-muted">Contact</span>
            <SegmentedControl
              label="Coaching frequency"
              value={cadence}
              onValueChange={setCadence}
              segments={cadenceSegments}
              size="sm"
            />
          </div>
        </div>

        {/* Says back exactly what the two controls add up to, so the choice is
            never left to be inferred from two separate toggles. */}
        <div
          aria-live="polite"
          className="rounded-lg border border-line bg-surface-raised px-4 py-3.5"
        >
          {chosen ? (
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="font-display text-base text-ink">
                {chosen.name} — {chosen.termLabel}
              </p>
              <p data-numeric className="text-sm text-ink-muted">
                <span className="font-medium text-ink">
                  {formatUsd(chosen.price.weekly)}
                </span>{" "}
                per week ·{" "}
                <span className="font-medium text-ink">
                  {formatUsd(chosen.price.total)}
                </span>{" "}
                total
              </p>
            </div>
          ) : (
            <p className="text-sm text-ink-muted">
              No plan selected — Mohamed will recommend one.
            </p>
          )}
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
              <div className="flex items-start gap-3">
                <input
                  id={id}
                  name={field.name}
                  type="checkbox"
                  aria-invalid={Boolean(error)}
                  className="mt-0.5 size-5 shrink-0 cursor-pointer rounded-sm border border-line-strong accent-navy-800"
                />
                <Label htmlFor={id} className="text-sm leading-relaxed text-ink-muted">
                  {field.label}
                </Label>
              </div>
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
