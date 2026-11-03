/**
 * The single application / contact form, now on its own page at /apply.
 *
 * One form serves both audiences. A pricing card links to
 * `/apply?package=daily-3`, which preselects that plan; a general CTA links to
 * `/apply` with nothing preselected.
 *
 * The plan itself is chosen with two segmented controls (term, then contact
 * frequency) rather than a dropdown, matching the pricing section — so the
 * visitor is never asked the same question in two different shapes.
 *
 * PROVISIONAL — a proposed first version for review. Fields, wording and
 * validation are defined here and in src/lib/validation.ts, which derives from
 * this file, so the two cannot drift apart.
 */

export const formIsProvisional = true;

export type FieldOption = { value: string; label: string };

export type FormField = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "select" | "textarea" | "checkbox";
  required: boolean;
  placeholder?: string;
  hint?: string;
  options?: FieldOption[];
  autoComplete?: string;
  maxLength?: number;
  /** Full width on wide screens rather than sharing a row. */
  wide?: boolean;
};

/** Chosen when the visitor wants to talk rather than pick a plan. */
export const GENERAL_ENQUIRY = "general-enquiry";

export const cadenceSegments = [
  { value: "weekly", label: "Weekly" },
  { value: "daily", label: "Daily" },
  { value: GENERAL_ENQUIRY, label: "Not sure" },
] as const;

export const formFields: FormField[] = [
  {
    name: "fullName",
    label: "Full name",
    type: "text",
    required: true,
    placeholder: "Your name",
    autoComplete: "name",
    maxLength: 80,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    placeholder: "you@example.com",
    autoComplete: "email",
    maxLength: 120,
  },
  {
    name: "phone",
    label: "Mobile number",
    type: "tel",
    required: true,
    placeholder: "(212) 555-0147",
    hint: "US numbers only. Mohamed replies on WhatsApp.",
    autoComplete: "tel-national",
    maxLength: 14,
  },
  {
    name: "goal",
    label: "Your main goal",
    type: "select",
    required: true,
    options: [
      { value: "build-muscle", label: "Build muscle" },
      { value: "lose-fat", label: "Lose fat" },
      { value: "performance", label: "Improve athletic performance" },
      { value: "strength", label: "Get stronger" },
      { value: "general-health", label: "General health and consistency" },
      { value: "other", label: "Something else" },
    ],
  },
  {
    name: "experience",
    label: "Training experience",
    type: "select",
    required: true,
    options: [
      { value: "new", label: "New to training" },
      { value: "under-1", label: "Less than a year" },
      { value: "1-3", label: "1–3 years" },
      { value: "3-plus", label: "3+ years" },
    ],
  },
  {
    name: "trainingAccess",
    label: "Where will you train?",
    type: "select",
    required: true,
    options: [
      { value: "gym", label: "Full gym" },
      { value: "home", label: "At home" },
      { value: "both", label: "Both" },
      { value: "minimal", label: "Minimal equipment" },
    ],
  },
  {
    name: "daysPerWeek",
    label: "Days per week you can train",
    type: "select",
    required: true,
    options: [
      { value: "2", label: "2 days" },
      { value: "3", label: "3 days" },
      { value: "4", label: "4 days" },
      { value: "5", label: "5 days" },
      { value: "6+", label: "6 or more" },
    ],
  },
  {
    name: "message",
    label: "Anything Mohamed should know?",
    type: "textarea",
    required: false,
    placeholder:
      "Injuries, deadlines, previous programmes, or the question you wanted to ask.",
    maxLength: 1200,
    wide: true,
  },
  {
    name: "consent",
    label:
      "I agree to be contacted on WhatsApp and by email about my application.",
    type: "checkbox",
    required: true,
    wide: true,
  },
];

export const formCopy = {
  eyebrow: "Apply",
  heading: "Tell Mohamed about your training.",
  lede: "One short form, whether you want a specific plan or just have a question. Mohamed picks the conversation up on WhatsApp from there.",
  planHeading: "Your plan",
  contactHeading: "How close do you want the contact?",
  contactHelp:
    "Weekly means a check-in once a week. Daily means a check-in every training day, priority replies to questions during the day, and more frequent performance follow-ups.",
  submitLabel: "Send application",
  submittingLabel: "Sending…",
  success: {
    title: "Application received.",
    body: "Mohamed has your details. The quickest way to carry on is WhatsApp — open the chat and he will pick it up from there.",
    whatsappLabel: "Continue on WhatsApp",
    whatsappMessage:
      "Hi Mohamed, I just submitted an application on your website.",
  },
  error: {
    invalid: "Check the highlighted fields and try again.",
    /* Shown when the submission could not be stored. It never claims the
       application was received, because it was not. */
    notStored:
      "We could not record your application just now, so it has not reached Mohamed. Please message him on WhatsApp and he will pick it up directly.",
    whatsappLabel: "Message Mohamed on WhatsApp",
    whatsappMessage:
      "Hi Mohamed, I tried to submit an application on your website but it did not go through.",
  },
} as const;
