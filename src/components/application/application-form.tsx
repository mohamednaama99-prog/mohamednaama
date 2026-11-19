"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  LoaderCircle,
  TriangleAlert,
} from "lucide-react";

import {
  submitApplication,
  type SubmitResult,
} from "@/app/actions/submit-application";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { Button } from "@/components/ui/button";
import {
  allFields,
  formCopy,
  formSteps,
  GENERAL_ENQUIRY,
  type FormField,
} from "@/content/form";
import { getPackage } from "@/content/packages";
import { whatsappLink } from "@/content/site";
import { cn } from "@/lib/utils";
import {
  detailsKey,
  fieldErrorsFrom,
  fieldOfErrorKey,
  HONEYPOT_FIELD,
  initialValues,
  isValueShape,
  stepOfField,
  stepSchemas,
  type FieldValue,
  type FormValues,
} from "@/lib/validation";

import { Field, focusTargetFor } from "./fields";

const TOTAL = formSteps.length;

/*
 * Answers are kept in sessionStorage — never localStorage — so a refresh or a
 * trip back from another page does not lose them, and they disappear when the
 * tab closes. They are cleared the moment an application is accepted.
 */
const STORAGE_KEY = "naama.apply.v1";
const DAY_MS = 86_400_000;

type Stored = { values: FormValues; step: number; startedAt: number };

function readStored(): Partial<Stored> | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<Stored>) : null;
  } catch {
    return null;
  }
}

function writeStored(stored: Stored) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    /* Storage full or blocked: the form still works, it just won't survive a refresh. */
  }
}

function clearStored() {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* Nothing to clear. */
  }
}

const isVisible = (field: FormField, values: FormValues) =>
  !field.showIf || values[field.showIf.field] === field.showIf.equals;

/** Errors for one step, ignoring questions that are currently hidden. */
function errorsForStep(index: number, values: FormValues): Record<string, string> {
  const step = formSteps[index];
  const input = Object.fromEntries(step.fields.map((f) => [f.name, values[f.name]]));
  const parsed = stepSchemas[index].safeParse(input);
  if (parsed.success) return {};

  return Object.fromEntries(
    Object.entries(fieldErrorsFrom(parsed.error)).filter(([key]) => {
      const field = step.fields.find((f) => f.name === fieldOfErrorKey(key));
      return field ? isVisible(field, values) : false;
    }),
  );
}

/** Error keys in the order the questions appear, answer before details. */
function inFormOrder(keys: string[]): string[] {
  const rank = (key: string) =>
    allFields.findIndex((f) => f.name === fieldOfErrorKey(key)) * 2 +
    (key.endsWith(".details") ? 1 : 0);
  return [...keys].sort((a, b) => rank(a) - rank(b));
}

const firstNameOf = (fullName: FieldValue) =>
  String(fullName ?? "").trim().split(/\s+/)[0] ?? "";

function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

type Outcome = "failed" | "rate-limited" | null;

export function ApplicationForm({
  initialPackageId,
}: {
  initialPackageId?: string | null;
}) {
  const preselected =
    initialPackageId && getPackage(initialPackageId) ? initialPackageId : null;

  const [values, setValues] = useState<FormValues>(() => ({
    ...initialValues(),
    packageId: preselected ?? GENERAL_ENQUIRY,
  }));
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState("");
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [acceptedName, setAcceptedName] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);
  const [pending, startTransition] = useTransition();

  const inFlight = useRef(false);
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  /* Focus is moved after React has rendered the step it belongs to. */
  const [focusRequest, setFocusRequest] = useState<{ target: string } | null>(null);
  const requestFocus = (target: string) => setFocusRequest({ target });

  /* Restore answers kept from earlier in this tab. */
  useEffect(() => {
    const stored = readStored();
    const now = Date.now();
    startedAt.current =
      typeof stored?.startedAt === "number" &&
      stored.startedAt <= now &&
      stored.startedAt > now - DAY_MS
        ? stored.startedAt
        : now;

    if (stored?.values && typeof stored.values === "object") {
      const kept = stored.values as Record<string, unknown>;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage only exists in the browser, after hydration; reading it during render would mismatch the server HTML.
      setValues((current) => {
        const next = { ...current };
        for (const field of allFields) {
          if (isValueShape(field, kept[field.name])) next[field.name] = kept[field.name] as FieldValue;
        }
        /* A plan picked on the pricing section wins over one kept from before. */
        if (preselected) next.packageId = preselected;
        if (next.packageId !== GENERAL_ENQUIRY && !getPackage(String(next.packageId))) {
          next.packageId = GENERAL_ENQUIRY;
        }
        return next;
      });
    }
    if (typeof stored?.step === "number" && stored.step >= 0 && stored.step < TOTAL) {
      setStep(Math.floor(stored.step));
    }
    setRestored(true);
  }, [preselected]);

  useEffect(() => {
    if (restored && acceptedName === null) {
      writeStored({ values, step, startedAt: startedAt.current });
    }
  }, [values, step, restored, acceptedName]);

  useEffect(() => {
    if (!focusRequest) return;
    const { target } = focusRequest;
    const behavior = scrollBehavior();

    if (target === "heading") {
      formRef.current?.scrollIntoView({ block: "start", behavior });
      headingRef.current?.focus({ preventScroll: true });
    } else if (target === "banner") {
      bannerRef.current?.focus({ preventScroll: true });
      bannerRef.current?.scrollIntoView({ block: "center", behavior });
    } else {
      const element = document.getElementById(target);
      element?.focus({ preventScroll: true });
      element?.scrollIntoView({ block: "center", behavior });
    }
  }, [focusRequest]);

  function setField(name: string, value: FieldValue) {
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => {
      if (!(name in previous) && !(detailsKey(name) in previous)) return previous;
      const next = { ...previous };
      delete next[name];
      delete next[detailsKey(name)];
      return next;
    });
  }

  function showErrors(found: Record<string, string>, onStep: number) {
    setErrors(found);
    const key = inFormOrder(Object.keys(found))[0];
    const field = allFields.find((f) => f.name === fieldOfErrorKey(key));
    if (onStep !== step) setStep(onStep);
    if (field) requestFocus(focusTargetFor(field, key, values[field.name]));
  }

  function goTo(index: number) {
    setErrors({});
    setOutcome(null);
    setStep(index);
    requestFocus("heading");
  }

  function send() {
    if (inFlight.current) return;

    /* Every step again, in case anything changed since it was checked. */
    for (let i = 0; i < TOTAL; i++) {
      const found = errorsForStep(i, values);
      if (Object.keys(found).length) return showErrors(found, i);
    }

    inFlight.current = true;
    setOutcome(null);
    const payload = {
      ...values,
      [HONEYPOT_FIELD]: honeypot,
      elapsedMs: Date.now() - startedAt.current,
    };

    /* Called from onSubmit inside a transition rather than through the form's
       `action`: React would otherwise reset the form when the action settles,
       and a failed send must leave every answer in place. A thrown call — the
       network dropped — lands in the same failure banner. */
    startTransition(async () => {
      let result: SubmitResult;
      try {
        result = await submitApplication(payload);
      } catch {
        result = { status: "failed" };
      }
      inFlight.current = false;

      if (result.status === "success") {
        clearStored();
        setAcceptedName(firstNameOf(values.fullName));
        return;
      }

      if (result.status === "invalid") {
        const first = inFormOrder(Object.keys(result.fieldErrors))[0];
        const onStep = Math.max(0, stepOfField(fieldOfErrorKey(first)));
        showErrors(result.fieldErrors, onStep);
        return;
      }

      setOutcome(result.status === "rate-limited" ? "rate-limited" : "failed");
      requestFocus("banner");
    });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    if (step < TOTAL - 1) {
      const found = errorsForStep(step, values);
      if (Object.keys(found).length) return showErrors(found, step);
      return goTo(step + 1);
    }

    send();
  }

  if (acceptedName !== null) {
    return <Accepted firstName={acceptedName} />;
  }

  const current = formSteps[step];
  const last = step === TOTAL - 1;
  const whatsappFallback = outcome ? whatsappLink(formCopy.failure.whatsappMessage) : null;

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      aria-busy={pending}
      className="relative flex scroll-mt-28 flex-col gap-8"
    >
      {/* Progress: the text is in the heading, so focusing it announces both. */}
      <div className="flex flex-col gap-4">
        <div aria-hidden className="flex gap-1.5">
          {formSteps.map((s, i) => (
            <span
              key={s.id}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-500",
                i <= step ? "bg-navy-800" : "bg-mist-200",
              )}
            />
          ))}
        </div>
        <h2 ref={headingRef} tabIndex={-1} className="flex flex-col gap-1.5 outline-none">
          <span className="t-eyebrow text-ink-muted">{formCopy.progress(step + 1, TOTAL)}</span>
          <span className="t-h3 text-ink">{current.title}</span>
        </h2>
        {current.intro ? (
          <p className="max-w-[60ch] text-[0.9375rem] text-ink-muted">{current.intro}</p>
        ) : null}
        <p className="text-sm text-ink-muted">{formCopy.requiredNote}</p>
      </div>

      {/* Honeypot: off-screen, never announced, never reachable by Tab. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={HONEYPOT_FIELD}>Leave this empty</label>
        <input
          id={HONEYPOT_FIELD}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <div
        key={current.id}
        className="flex flex-col gap-8 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300"
      >
        {current.fields
          .filter((field) => isVisible(field, values))
          .map((field) => (
            <Field
              key={field.name}
              field={field}
              value={values[field.name]}
              onChange={(value) => setField(field.name, value)}
              errors={errors}
            />
          ))}
      </div>

      {outcome ? (
        <div
          ref={bannerRef}
          tabIndex={-1}
          role="alert"
          className={cn(
            "flex flex-col items-start gap-4 rounded-xl border bg-surface-raised p-5 outline-none",
            outcome === "failed" ? "border-destructive/30" : "border-tan-500/50",
          )}
        >
          {outcome === "failed" ? (
            <>
              <span className="flex items-center gap-2.5 font-display text-base text-ink">
                <TriangleAlert aria-hidden className="size-5 shrink-0 text-destructive" />
                {formCopy.failure.title}
              </span>
              <p className="max-w-[56ch] text-[0.9375rem] text-ink-muted">
                {formCopy.failure.body}
              </p>
            </>
          ) : (
            <span className="flex items-start gap-2.5 text-[0.9375rem] text-ink">
              <Clock aria-hidden className="mt-0.5 size-5 shrink-0 text-accent-text" />
              {formCopy.rateLimited.body}
            </span>
          )}
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            {outcome === "failed" ? (
              <Button
                type="button"
                size="pill"
                variant="brand"
                onClick={send}
                disabled={pending}
              >
                {formCopy.failure.retry}
              </Button>
            ) : null}
            {whatsappFallback ? (
              <Button asChild size="pill" variant="quiet">
                <a href={whatsappFallback} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon />
                  {formCopy.failure.whatsappLabel}
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 border-t border-line pt-6">
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 ? (
            <Button
              type="button"
              size="xl"
              variant="quiet"
              onClick={() => goTo(step - 1)}
              disabled={pending}
              className="w-full sm:w-auto"
            >
              <ArrowLeft />
              {formCopy.back}
            </Button>
          ) : (
            <span aria-hidden className="hidden sm:block" />
          )}

          <Button
            type="submit"
            size="xl"
            variant="brand"
            disabled={pending}
            className="w-full sm:w-auto"
          >
            {last ? (
              pending ? (
                <>
                  <LoaderCircle aria-hidden className="animate-spin motion-reduce:animate-none" />
                  {formCopy.submitting}
                </>
              ) : (
                <>
                  {formCopy.submit}
                  <ArrowRight />
                </>
              )
            ) : (
              <>
                {formCopy.next}
                <ArrowRight />
              </>
            )}
          </Button>
        </div>

        {last ? <p className="text-sm text-ink-muted">{formCopy.noPayment}</p> : null}
      </div>
    </form>
  );
}

/** Replaces the form once the application is stored. */
function Accepted({ firstName }: { firstName: string }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const whatsapp = whatsappLink(formCopy.success.whatsappMessage);

  useEffect(() => {
    const heading = headingRef.current;
    heading?.focus({ preventScroll: true });
    heading?.closest("section, div")?.scrollIntoView({ block: "center", behavior: scrollBehavior() });
  }, []);

  return (
    <div className="flex flex-col items-start gap-6">
      <span className="flex size-11 items-center justify-center rounded-full bg-sage-600/12 text-sage-600">
        <Check aria-hidden className="size-5" />
      </span>

      <div className="flex flex-col gap-3">
        <h2 ref={headingRef} tabIndex={-1} className="t-h3 outline-none">
          {formCopy.success.title}
        </h2>
        <p className="max-w-[46ch] text-[0.9375rem] text-ink-muted">
          {formCopy.success.body(firstName)}
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
        {whatsapp ? (
          <Button asChild size="xl" variant="brand">
            <a href={whatsapp} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              {formCopy.success.whatsappLabel}
            </a>
          </Button>
        ) : null}
        <Button asChild size="xl" variant="quiet">
          <Link href="/">{formCopy.success.homeLabel}</Link>
        </Button>
      </div>
    </div>
  );
}
