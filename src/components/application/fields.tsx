"use client";

import type { ChangeEvent, ReactNode } from "react";
import { Check } from "lucide-react";

import {
  formCopy,
  heightUnits,
  limits,
  weightUnits,
  yesNoOptions,
  type ChoiceField,
  type FormField,
  type MultiChoiceField,
  type Option,
} from "@/content/form";
import { formatUsPhone, normalizeUsPhone, US_DIAL_CODE } from "@/lib/phone";
import { cn } from "@/lib/utils";
import {
  detailsKey,
  type FieldValue,
  type HealthValue,
  type HeightValue,
  type WeightValue,
} from "@/lib/validation";

import { PlanField } from "./plan-field";

/*
 * One renderer per field kind. Every control is a native input — text, radio
 * or checkbox — so keyboard support, form semantics and screen-reader states
 * come from the browser rather than being rebuilt. Radios and checkboxes are
 * visually replaced, never removed: they stay focusable, and the focus ring is
 * drawn on the visible option around them.
 *
 * Sizes: inputs are 48px tall with 16px text (anything smaller makes iOS zoom
 * on focus), and every option is at least 44px tall.
 */

export const fieldId = (name: string) => `q-${name}`;

/** The id to focus for an error key, so the first invalid field gets focus. */
export function focusTargetFor(field: FormField, key: string, value: FieldValue): string {
  const id = fieldId(field.name);
  if (key === detailsKey(field.name)) return `${id}-details`;

  switch (field.kind) {
    case "choice":
    case "multiChoice":
      return `${id}-0`;
    case "health":
      return `${id}-yes`;
    case "height":
      return (value as HeightValue).unit === "cm" ? `${id}-cm` : `${id}-feet`;
    case "weight":
      return `${id}-value`;
    default:
      return id;
  }
}

const inputClass =
  "h-12 w-full min-w-0 rounded-lg border border-line-strong bg-surface-raised px-3.5 text-base text-ink transition-colors outline-none placeholder:text-ink-muted/70 hover:border-navy-400 focus-visible:border-navy-600 focus-visible:ring-3 focus-visible:ring-tan-500/40 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/15";

const labelClass = "text-[0.9375rem] leading-snug font-medium text-ink";

const describedBy = (...ids: (string | false | undefined)[]) =>
  ids.filter(Boolean).join(" ") || undefined;

function RequiredMark() {
  return (
    <span aria-hidden className="ml-0.5 text-accent-text">
      *
    </span>
  );
}

function Hint({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="text-sm text-ink-muted">
      {children}
    </p>
  );
}

function ErrorText({ id, children }: { id: string; children?: string }) {
  if (!children) return null;
  return (
    <p id={id} className="text-sm font-medium text-destructive">
      {children}
    </p>
  );
}

/** A single labelled control. */
function Single({
  field,
  error,
  children,
}: {
  field: FormField;
  error?: string;
  children: ReactNode;
}) {
  const id = fieldId(field.name);
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label htmlFor={id} className={labelClass}>
        {field.label}
        {field.required ? <RequiredMark /> : null}
      </label>
      {children}
      {field.hint ? <Hint id={`${id}-hint`}>{field.hint}</Hint> : null}
      <ErrorText id={`${id}-error`}>{error}</ErrorText>
    </div>
  );
}

/** A group of controls under one question: fieldset and legend. */
function Group({
  field,
  error,
  children,
}: {
  field: FormField;
  error?: string;
  children: ReactNode;
}) {
  const id = fieldId(field.name);
  return (
    <fieldset id={`${id}-group`} className="min-w-0">
      <legend id={`${id}-legend`} className={cn(labelClass, "mb-3")}>
        {field.label}
        {field.required ? <RequiredMark /> : null}
      </legend>
      <div className="flex flex-col gap-2">
        {children}
        {field.hint ? <Hint id={`${id}-hint`}>{field.hint}</Hint> : null}
        <ErrorText id={`${id}-error`}>{error}</ErrorText>
      </div>
    </fieldset>
  );
}

/* ------------------------------------------------------------------------ */
/* Options                                                                   */
/* ------------------------------------------------------------------------ */

function OptionControl({
  type,
  name,
  id,
  option,
  checked,
  onToggle,
  layout,
  invalid,
  describedById,
  required,
}: {
  type: "radio" | "checkbox";
  name: string;
  id: string;
  option: Option;
  checked: boolean;
  onToggle: () => void;
  layout: "cards" | "chips";
  invalid: boolean;
  describedById?: string;
  required?: boolean;
}) {
  const card = layout === "cards";
  return (
    <label
      htmlFor={id}
      className={cn(
        "relative flex cursor-pointer items-center text-[0.9375rem] transition-colors select-none",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-tan-500",
        card
          ? "min-h-12 gap-3 rounded-lg border px-4 py-3 text-left leading-snug"
          : "min-h-11 min-w-11 justify-center gap-1.5 rounded-full border px-4 py-2",
        checked
          ? card
            ? "border-navy-800 bg-mist-50 text-ink ring-1 ring-navy-800"
            : "border-navy-800 bg-navy-800 font-medium text-mist-100"
          : cn(
              "bg-surface-raised text-ink hover:border-navy-400",
              invalid ? "border-destructive/70" : "border-line-strong",
            ),
      )}
    >
      <input
        id={id}
        type={type}
        name={name}
        value={option.value}
        checked={checked}
        onChange={onToggle}
        required={required}
        aria-invalid={invalid || undefined}
        aria-describedby={describedById}
        className="sr-only"
      />
      {card ? (
        <span
          aria-hidden
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            checked ? "border-navy-800" : "border-line-strong",
          )}
        >
          <span
            className={cn(
              "size-2.5 rounded-full bg-navy-800 transition-transform",
              checked ? "scale-100" : "scale-0",
            )}
          />
        </span>
      ) : null}
      {type === "checkbox" && checked ? (
        <Check aria-hidden className="size-4 shrink-0" />
      ) : null}
      <span>{option.label}</span>
    </label>
  );
}

function ChoiceGroup({
  field,
  value,
  onChange,
  error,
}: {
  field: ChoiceField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const id = fieldId(field.name);
  return (
    <Group field={field} error={error}>
      <div
        className={cn(
          field.layout === "cards"
            ? "grid gap-2 sm:grid-cols-2"
            : "flex flex-wrap gap-2",
        )}
      >
        {field.options.map((option, i) => (
          <OptionControl
            key={option.value}
            type="radio"
            name={field.name}
            id={`${id}-${i}`}
            option={option}
            checked={value === option.value}
            onToggle={() => onChange(option.value)}
            layout={field.layout}
            invalid={Boolean(error)}
            required={field.required}
            describedById={describedBy(field.hint && `${id}-hint`, error && `${id}-error`)}
          />
        ))}
      </div>
    </Group>
  );
}

function MultiChoiceGroup({
  field,
  value,
  onChange,
  error,
}: {
  field: MultiChoiceField;
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}) {
  const id = fieldId(field.name);
  return (
    <Group field={field} error={error}>
      <div className="flex flex-wrap gap-2">
        {field.options.map((option, i) => {
          const checked = value.includes(option.value);
          return (
            <OptionControl
              key={option.value}
              type="checkbox"
              name={field.name}
              id={`${id}-${i}`}
              option={option}
              checked={checked}
              onToggle={() =>
                onChange(
                  checked
                    ? value.filter((v) => v !== option.value)
                    : [...value, option.value],
                )
              }
              layout="chips"
              invalid={Boolean(error)}
              describedById={describedBy(field.hint && `${id}-hint`, error && `${id}-error`)}
            />
          );
        })}
      </div>
    </Group>
  );
}

/** A small two-option unit switch: ft/in or cm, lbs or kg. */
function UnitToggle({
  name,
  label,
  options,
  value,
  onChange,
}: {
  name: string;
  label: string;
  options: readonly Option[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex shrink-0 rounded-full border border-line bg-surface-sunken p-1"
    >
      {options.map((option) => {
        const checked = option.value === value;
        return (
          <label
            key={option.value}
            className={cn(
              "flex min-h-10 min-w-14 cursor-pointer items-center justify-center rounded-full px-3 text-sm font-medium transition-colors select-none",
              "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-tan-500",
              checked ? "bg-navy-800 text-mist-100" : "text-ink-muted hover:text-ink",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        );
      })}
    </div>
  );
}

/** A numeric input with a unit suffix inside its border. */
function UnitInput({
  id,
  value,
  onChange,
  suffix,
  srSuffix,
  legendId,
  maxLength,
  decimal,
  invalid,
  describedById,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  suffix: string;
  srSuffix: string;
  legendId: string;
  maxLength: number;
  decimal?: boolean;
  invalid: boolean;
  describedById?: string;
  placeholder?: string;
}) {
  const suffixId = `${id}-unit`;
  return (
    <div className="relative min-w-0 flex-1">
      <input
        id={id}
        type="text"
        inputMode={decimal ? "decimal" : "numeric"}
        pattern={decimal ? "[0-9]*[.]?[0-9]*" : "[0-9]*"}
        autoComplete="off"
        maxLength={maxLength}
        value={value}
        placeholder={placeholder}
        onChange={(event) => {
          const raw = event.target.value;
          onChange(
            decimal
              ? raw.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1")
              : raw.replace(/\D/g, ""),
          );
        }}
        aria-labelledby={`${legendId} ${suffixId}`}
        aria-invalid={invalid || undefined}
        aria-describedby={describedById}
        className={cn(inputClass, "pr-12")}
      />
      <span
        id={suffixId}
        className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm text-ink-muted"
      >
        <span aria-hidden>{suffix}</span>
        <span className="sr-only">{srSuffix}</span>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* The renderer                                                              */
/* ------------------------------------------------------------------------ */

export function Field({
  field,
  value,
  onChange,
  errors,
}: {
  field: FormField;
  value: FieldValue;
  onChange: (value: FieldValue) => void;
  errors: Record<string, string>;
}) {
  const id = fieldId(field.name);
  const error = errors[field.name];
  const describe = describedBy(field.hint && `${id}-hint`, error && `${id}-error`);
  const text = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange(event.target.value);

  switch (field.kind) {
    case "text":
      return (
        <Single field={field} error={error}>
          <input
            id={id}
            name={field.name}
            type="text"
            autoComplete={field.autoComplete ?? "off"}
            autoCapitalize={field.name === "fullName" ? "words" : "sentences"}
            maxLength={limits.shortText}
            placeholder={field.placeholder}
            value={value as string}
            onChange={text}
            required={field.required}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={describe}
            className={inputClass}
          />
        </Single>
      );

    case "email":
      return (
        <Single field={field} error={error}>
          <input
            id={id}
            name={field.name}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={limits.shortText}
            placeholder={field.placeholder}
            value={value as string}
            onChange={text}
            required
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={describe}
            className={inputClass}
          />
        </Single>
      );

    case "phone":
      return (
        <Single field={field} error={error}>
          <div className="flex items-stretch">
            {/* Fixed country code: US only for now, so no selector. */}
            <span
              aria-hidden
              className="flex items-center rounded-l-lg border border-r-0 border-line-strong bg-surface-sunken px-3.5 text-base text-ink-muted"
            >
              {US_DIAL_CODE}
            </span>
            <input
              id={id}
              name={field.name}
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder={field.placeholder}
              value={formatUsPhone(value as string)}
              onChange={(event) => onChange(normalizeUsPhone(event.target.value))}
              required
              aria-invalid={Boolean(error) || undefined}
              aria-describedby={describe}
              className={cn(inputClass, "rounded-l-none")}
            />
          </div>
        </Single>
      );

    case "age":
      return (
        <Single field={field} error={error}>
          <input
            id={id}
            name={field.name}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            maxLength={3}
            placeholder={field.placeholder}
            value={value as string}
            onChange={(event) => onChange(event.target.value.replace(/\D/g, ""))}
            required
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={describe}
            className={cn(inputClass, "max-w-40")}
          />
        </Single>
      );

    case "longText":
      return (
        <Single field={field} error={error}>
          <textarea
            id={id}
            name={field.name}
            rows={field.rows ?? 3}
            maxLength={limits.longText}
            placeholder={field.placeholder}
            value={value as string}
            onChange={text}
            required={field.required}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={describe}
            className={cn(inputClass, "h-auto min-h-20 resize-y py-3 leading-relaxed")}
          />
        </Single>
      );

    case "choice":
      return (
        <ChoiceGroup
          field={field}
          value={value as string}
          onChange={onChange}
          error={error}
        />
      );

    case "multiChoice":
      return (
        <MultiChoiceGroup
          field={field}
          value={value as string[]}
          onChange={onChange}
          error={error}
        />
      );

    case "health": {
      const health = value as HealthValue;
      const detailsError = errors[detailsKey(field.name)];
      const detailsId = `${id}-details`;
      return (
        <Group field={field} error={error}>
          <div className="flex flex-wrap gap-2">
            {yesNoOptions.map((option) => (
              <OptionControl
                key={option.value}
                type="radio"
                name={field.name}
                id={`${id}-${option.value}`}
                option={option}
                checked={health.answer === option.value}
                onToggle={() => onChange({ ...health, answer: option.value })}
                layout="chips"
                invalid={Boolean(error)}
                required
                describedById={error ? `${id}-error` : undefined}
              />
            ))}
          </div>
          {health.answer === "yes" ? (
            <div className="mt-2 flex flex-col gap-2 border-l-2 border-tan-500 pl-4">
              <label htmlFor={detailsId} className={labelClass}>
                {formCopy.healthDetailsLabel}
                <RequiredMark />
              </label>
              <textarea
                id={detailsId}
                name={`${field.name}Details`}
                rows={3}
                maxLength={limits.longText}
                placeholder={formCopy.healthDetailsPlaceholder}
                value={health.details}
                onChange={(event) => onChange({ ...health, details: event.target.value })}
                required
                aria-invalid={Boolean(detailsError) || undefined}
                aria-describedby={detailsError ? `${detailsId}-error` : undefined}
                className={cn(inputClass, "h-auto min-h-20 resize-y py-3 leading-relaxed")}
              />
              <ErrorText id={`${detailsId}-error`}>{detailsError}</ErrorText>
            </div>
          ) : null}
        </Group>
      );
    }

    case "height": {
      const height = value as HeightValue;
      const legendId = `${id}-legend`;
      return (
        <Group field={field} error={error}>
          <div className="flex flex-wrap items-center gap-3">
            {height.unit === "cm" ? (
              <div className="flex w-full max-w-40 min-w-0">
                <UnitInput
                  id={`${id}-cm`}
                  value={height.cm}
                  onChange={(cm) => onChange({ ...height, cm })}
                  suffix={formCopy.height.cmSuffix}
                  srSuffix={formCopy.height.cm}
                  legendId={legendId}
                  maxLength={3}
                  invalid={Boolean(error)}
                  describedById={error ? `${id}-error` : undefined}
                />
              </div>
            ) : (
              <div className="flex w-full max-w-64 min-w-0 gap-2">
                <UnitInput
                  id={`${id}-feet`}
                  value={height.feet}
                  onChange={(feet) => onChange({ ...height, feet })}
                  suffix={formCopy.height.feetSuffix}
                  srSuffix={formCopy.height.feet}
                  legendId={legendId}
                  maxLength={1}
                  invalid={Boolean(error)}
                  describedById={error ? `${id}-error` : undefined}
                />
                <UnitInput
                  id={`${id}-inches`}
                  value={height.inches}
                  onChange={(inches) => onChange({ ...height, inches })}
                  suffix={formCopy.height.inchesSuffix}
                  srSuffix={formCopy.height.inches}
                  legendId={legendId}
                  maxLength={2}
                  invalid={Boolean(error)}
                  describedById={error ? `${id}-error` : undefined}
                />
              </div>
            )}
            <UnitToggle
              name={`${field.name}Unit`}
              label={formCopy.height.unitGroupLabel}
              options={heightUnits}
              value={height.unit}
              onChange={(unit) => onChange({ ...height, unit: unit as HeightValue["unit"] })}
            />
          </div>
        </Group>
      );
    }

    case "weight": {
      const weight = value as WeightValue;
      const legendId = `${id}-legend`;
      return (
        <Group field={field} error={error}>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex w-full max-w-40 min-w-0">
              <UnitInput
                id={`${id}-value`}
                value={weight.value}
                onChange={(amount) => onChange({ ...weight, value: amount })}
                suffix={weight.unit}
                srSuffix={weight.unit === "kg" ? "kilograms" : "pounds"}
                legendId={legendId}
                maxLength={5}
                decimal
                invalid={Boolean(error)}
                describedById={error ? `${id}-error` : undefined}
              />
            </div>
            <UnitToggle
              name={`${field.name}Unit`}
              label={formCopy.weight.unitGroupLabel}
              options={weightUnits}
              value={weight.unit}
              onChange={(unit) => onChange({ ...weight, unit: unit as WeightValue["unit"] })}
            />
          </div>
        </Group>
      );
    }

    case "plan":
      return (
        <PlanField
          label={field.label}
          value={value as string}
          onChange={onChange}
          error={error}
        />
      );

    case "consent":
      return (
        <div className="flex flex-col gap-2">
          {/* The whole row is the target: 44px tall around a 20px box. */}
          <label
            htmlFor={id}
            className={cn(
              "flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
              "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-tan-500",
              error ? "border-destructive/70" : "border-transparent hover:bg-surface-sunken",
            )}
          >
            <input
              id={id}
              name={field.name}
              type="checkbox"
              checked={value === true}
              onChange={(event) => onChange(event.target.checked)}
              required
              aria-invalid={Boolean(error) || undefined}
              aria-describedby={error ? `${id}-error` : undefined}
              className="peer sr-only"
            />
            <span
              aria-hidden
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[5px] border-2 transition-colors",
                value === true
                  ? "border-navy-800 bg-navy-800 text-mist-100"
                  : "border-line-strong bg-surface-raised",
              )}
            >
              {value === true ? <Check className="size-3.5" strokeWidth={3} /> : null}
            </span>
            <span className="text-[0.9375rem] leading-relaxed text-ink">
              {field.label}
              <RequiredMark />
            </span>
          </label>
          <ErrorText id={`${id}-error`}>{error}</ErrorText>
        </div>
      );
  }
}
