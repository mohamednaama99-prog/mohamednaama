/**
 * The New Client Application at /apply: every question, option, label and
 * message the form shows.
 *
 * Nothing about the form's wording lives in a component. Three things are
 * derived from this file, so they cannot drift apart:
 *
 * - the zod schema in src/lib/validation.ts, shared by the browser and the
 *   server action;
 * - the multi-step form in src/components/application/;
 * - the Google Sheet layout in src/lib/application-sheet.ts (one column per
 *   question, headed with `column`).
 *
 * A pricing card links to `/apply?package=daily-3`, which preselects that plan
 * in step 5; a general CTA links to `/apply` with nothing preselected.
 */

/* ------------------------------------------------------------------------ */
/* Limits                                                                    */
/* ------------------------------------------------------------------------ */

export const limits = {
  shortText: 120,
  longText: 1000,
  /** The Terms say nothing about age, so the brief's default of 18 stands. */
  minAge: 18,
  maxAge: 100,
  heightFeet: { min: 3, max: 8 },
  heightInches: { min: 0, max: 11 },
  heightCm: { min: 90, max: 250 },
  weightLbs: { min: 66, max: 700 },
  weightKg: { min: 30, max: 320 },
  /** Anything faster than this through five steps is a script, not a person. */
  minSecondsToSubmit: 8,
} as const;

/* ------------------------------------------------------------------------ */
/* Field model                                                               */
/* ------------------------------------------------------------------------ */

export type Option = { value: string; label: string };

type FieldBase = {
  /** Key in the submitted payload. */
  name: string;
  label: string;
  required: boolean;
  /** Header of this answer's column in the Google Sheet. */
  column: string;
  hint?: string;
  /** Shown only when another answer has a given value. */
  showIf?: { field: string; equals: string };
};

export type TextField = FieldBase & {
  kind: "text";
  autoComplete?: string;
  placeholder?: string;
};

export type LongTextField = FieldBase & {
  kind: "longText";
  placeholder?: string;
  rows?: number;
};

export type EmailField = FieldBase & { kind: "email"; placeholder?: string };
export type PhoneField = FieldBase & { kind: "phone"; placeholder?: string };
export type AgeField = FieldBase & { kind: "age"; placeholder?: string };

export type ChoiceField = FieldBase & {
  kind: "choice";
  options: readonly Option[];
  /** "cards" stacks full-width options; "chips" wraps short ones in a row. */
  layout: "cards" | "chips";
};

export type MultiChoiceField = FieldBase & {
  kind: "multiChoice";
  options: readonly Option[];
};

/** A required Yes/No; Yes reveals a required details box. */
export type HealthField = FieldBase & { kind: "health" };

export type HeightField = FieldBase & { kind: "height" };
export type WeightField = FieldBase & { kind: "weight" };
export type PlanField = FieldBase & { kind: "plan" };
export type ConsentField = FieldBase & { kind: "consent" };

export type FormField =
  | TextField
  | LongTextField
  | EmailField
  | PhoneField
  | AgeField
  | ChoiceField
  | MultiChoiceField
  | HealthField
  | HeightField
  | WeightField
  | PlanField
  | ConsentField;

export type FormStep = {
  id: string;
  title: string;
  intro?: string;
  fields: readonly FormField[];
};

/* ------------------------------------------------------------------------ */
/* Options                                                                   */
/* ------------------------------------------------------------------------ */

export const yesNoOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
] as const;

const daysPerWeekOptions = ["1", "2", "3", "4", "5", "6", "7"].map((n) => ({
  value: n,
  label: n,
}));

export const heightUnits = [
  { value: "ft-in", label: "ft / in" },
  { value: "cm", label: "cm" },
] as const;

export const weightUnits = [
  { value: "lbs", label: "lbs" },
  { value: "kg", label: "kg" },
] as const;

export const weekdayOptions = [
  { value: "mon", label: "Mon" },
  { value: "tue", label: "Tue" },
  { value: "wed", label: "Wed" },
  { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" },
  { value: "sat", label: "Sat" },
  { value: "sun", label: "Sun" },
] as const;

/* ------------------------------------------------------------------------ */
/* Plan                                                                      */
/* ------------------------------------------------------------------------ */

/** Chosen when the visitor wants Mohamed to recommend a plan. */
export const GENERAL_ENQUIRY = "general-enquiry";

export const cadenceSegments = [
  { value: "weekly", label: "Weekly" },
  { value: "daily", label: "Daily" },
  { value: GENERAL_ENQUIRY, label: "Not sure" },
] as const;

export const planCopy = {
  termLabel: "Term",
  termGroupLabel: "Coaching term",
  contactHeading: "How close do you want the contact?",
  contactHelp:
    "Weekly means a check-in once a week. Daily means a check-in every training day, priority replies to questions during the day, and more frequent performance follow-ups.",
  selectedLabel: "Selected plan",
  generalTitle: "Not sure yet",
  generalBody: "Mohamed will recommend a plan.",
  perWeek: "per week",
  total: "total",
  weeks: "weeks",
  /** How the plan reads in the Google Sheet when none was chosen. */
  generalSheetValue: "Not sure yet",
} as const;

/* ------------------------------------------------------------------------ */
/* The five steps                                                            */
/* ------------------------------------------------------------------------ */

export const formSteps: readonly FormStep[] = [
  {
    id: "about",
    title: "About you",
    fields: [
      {
        kind: "text",
        name: "fullName",
        label: "Full name",
        column: "Full name",
        required: true,
        autoComplete: "name",
        placeholder: "Your full name",
      },
      {
        kind: "email",
        name: "email",
        label: "Email",
        column: "Email",
        required: true,
        placeholder: "Your email address",
      },
      {
        kind: "phone",
        name: "phone",
        label: "WhatsApp number",
        column: "WhatsApp",
        required: true,
        placeholder: "(212) 555-0147",
        hint: "US numbers only. Mohamed replies on WhatsApp.",
      },
      {
        kind: "age",
        name: "age",
        label: "Age",
        column: "Age",
        required: true,
        placeholder: "e.g. 32",
      },
      {
        kind: "choice",
        name: "gender",
        label: "Gender",
        column: "Gender",
        required: true,
        layout: "chips",
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "prefer-not-to-say", label: "Prefer not to say" },
        ],
      },
      {
        kind: "height",
        name: "height",
        label: "Height",
        column: "Height",
        required: true,
      },
      {
        kind: "weight",
        name: "weight",
        label: "Current weight",
        column: "Current weight",
        required: true,
      },
      {
        kind: "text",
        name: "occupation",
        label: "What is your occupation?",
        column: "Occupation",
        required: false,
        autoComplete: "organization-title",
      },
      {
        kind: "longText",
        name: "workSchedule",
        label: "What is your typical working schedule?",
        column: "Working schedule",
        required: false,
        placeholder: "e.g. Monday to Friday, 9 to 5, sometimes weekends",
        rows: 2,
      },
    ],
  },
  {
    id: "goals",
    title: "Your fitness goals",
    fields: [
      {
        kind: "choice",
        name: "primaryGoal",
        label: "What is your primary fitness goal?",
        column: "Primary goal",
        required: true,
        layout: "cards",
        options: [
          { value: "lose-fat", label: "Lose body fat" },
          { value: "build-muscle", label: "Build muscle" },
          { value: "build-strength", label: "Build strength" },
          { value: "overall-fitness", label: "Improve overall fitness" },
          { value: "athletic-performance", label: "Improve athletic performance" },
          {
            value: "recomposition",
            label: "Body recomposition (lose fat and build muscle)",
          },
        ],
      },
      {
        kind: "text",
        name: "targetWeight",
        label: "What is your target weight, if you have one?",
        column: "Target weight",
        required: false,
        placeholder: "e.g. 175 lbs",
      },
      {
        kind: "longText",
        name: "focusAreas",
        label: "Which areas of your body would you particularly like to improve?",
        column: "Areas to improve",
        required: false,
      },
      {
        kind: "longText",
        name: "goalWhy",
        label: "Why is achieving this goal important to you?",
        column: "Why it matters",
        required: false,
      },
      {
        kind: "text",
        name: "deadline",
        label: "Do you have a specific deadline or event you're working toward?",
        column: "Deadline or event",
        required: false,
      },
      {
        kind: "longText",
        name: "idealPhysique",
        label: "How would you describe your ideal physique?",
        column: "Ideal physique",
        required: false,
      },
      {
        kind: "longText",
        name: "pastBarriers",
        label: "What has stopped you from achieving your goals in the past?",
        column: "Past barriers",
        required: false,
      },
    ],
  },
  {
    id: "health",
    title: "Health history",
    intro:
      "This helps Mohamed write a program that is safe for you. Answer each question; if you choose Yes, add a few details.",
    fields: [
      {
        kind: "health",
        name: "medicalConditions",
        label: "Do you have any existing medical conditions?",
        column: "Medical conditions",
        required: true,
      },
      {
        kind: "health",
        name: "surgery",
        label: "Have you ever had surgery?",
        column: "Surgery",
        required: true,
      },
      {
        kind: "health",
        name: "injuries",
        label: "Do you have any current or previous injuries?",
        column: "Injuries",
        required: true,
      },
      {
        kind: "health",
        name: "jointPain",
        label: "Do you experience joint pain or movement limitations?",
        column: "Joint pain or limitations",
        required: true,
      },
      {
        kind: "health",
        name: "heartLung",
        label: "Do you have any cardiovascular or respiratory conditions?",
        column: "Heart or breathing conditions",
        required: true,
      },
    ],
  },
  {
    id: "training",
    title: "Training history",
    fields: [
      {
        kind: "choice",
        name: "trainingHistory",
        label: "How long have you been working out?",
        column: "Training history",
        required: true,
        layout: "cards",
        options: [
          { value: "beginner", label: "Beginner (never trained consistently)" },
          { value: "under-6-months", label: "Less than 6 months" },
          { value: "6-12-months", label: "6 months – 1 year" },
          { value: "1-3-years", label: "1–3 years" },
          { value: "3-plus-years", label: "More than 3 years" },
        ],
      },
      {
        kind: "choice",
        name: "currentlyTraining",
        label: "Are you currently working out?",
        column: "Currently working out",
        required: true,
        layout: "chips",
        options: yesNoOptions,
      },
      {
        kind: "choice",
        name: "currentDays",
        label: "How many days per week do you train?",
        column: "Days per week now",
        required: false,
        layout: "chips",
        options: daysPerWeekOptions,
        showIf: { field: "currentlyTraining", equals: "yes" },
      },
      {
        kind: "choice",
        name: "trainingLocation",
        label: "Where do you usually train?",
        column: "Trains at",
        required: true,
        layout: "cards",
        options: [
          { value: "commercial-gym", label: "Commercial gym" },
          { value: "home-gym", label: "Home gym" },
          { value: "home-no-equipment", label: "Home (no equipment)" },
          { value: "outdoors", label: "Outdoors" },
        ],
      },
      {
        kind: "choice",
        name: "currentTrainingType",
        label: "What type of training do you currently do?",
        column: "Current training type",
        required: false,
        layout: "chips",
        options: [
          { value: "weights", label: "Weight training" },
          { value: "cardio", label: "Cardio" },
          { value: "hiit", label: "HIIT" },
          { value: "sports", label: "Sports" },
          { value: "combination", label: "Combination" },
        ],
        showIf: { field: "currentlyTraining", equals: "yes" },
      },
      {
        kind: "longText",
        name: "enjoyedExercises",
        label: "What exercises do you enjoy the most?",
        column: "Enjoys",
        required: false,
      },
      {
        kind: "longText",
        name: "avoidExercises",
        label: "Are there any exercises you dislike or cannot perform?",
        column: "Dislikes or cannot do",
        required: false,
      },
    ],
  },
  {
    id: "commitment",
    title: "Your availability and commitment",
    fields: [
      {
        kind: "choice",
        name: "commitDays",
        label: "How many days per week can you commit to training?",
        column: "Days per week committed",
        required: true,
        layout: "chips",
        options: daysPerWeekOptions,
      },
      {
        kind: "choice",
        name: "sessionLength",
        label: "How many minutes can you dedicate per workout?",
        column: "Minutes per workout",
        required: true,
        layout: "chips",
        options: [
          { value: "30", label: "30" },
          { value: "45", label: "45" },
          { value: "60", label: "60" },
          { value: "75", label: "75" },
          { value: "90-plus", label: "90+" },
        ],
      },
      {
        kind: "multiChoice",
        name: "availableDays",
        label: "Which days are usually available?",
        column: "Available days",
        required: false,
        options: weekdayOptions,
      },
      {
        kind: "plan",
        name: "packageId",
        label: "Your plan",
        column: "Plan",
        required: true,
      },
      {
        kind: "consent",
        name: "consent",
        label:
          "I agree to be contacted on WhatsApp and by email about my application.",
        column: "Contact consent",
        required: true,
      },
      {
        kind: "consent",
        name: "healthConsent",
        label:
          "I agree that Mohamed may collect and use the health information I have provided to review my application and build my coaching program.",
        column: "Health information consent",
        required: true,
      },
    ],
  },
];

/** Every field, in form order. */
export const allFields: readonly FormField[] = formSteps.flatMap(
  (step) => step.fields,
);

/* ------------------------------------------------------------------------ */
/* Copy                                                                      */
/* ------------------------------------------------------------------------ */

export const formCopy = {
  eyebrow: "Apply",
  title: "New Client Application",
  subtitle: "Fitness, Health & Lifestyle Assessment",
  lede: "Five short steps: about you, your goals, your health, your training and your availability. Mohamed reads every answer before he messages you on WhatsApp.",
  requiredNote: "Questions marked * are required.",
  noPayment: "No payment is taken here. Mohamed replies on WhatsApp.",

  /** "Step 2 of 5" */
  progress: (step: number, total: number) => `Step ${step} of ${total}`,

  back: "Back",
  next: "Next",
  submit: "Send application",
  submitting: "Sending…",

  height: {
    unitGroupLabel: "Height unit",
    feet: "Feet",
    inches: "Inches",
    cm: "Centimeters",
    feetSuffix: "ft",
    inchesSuffix: "in",
    cmSuffix: "cm",
  },
  weight: {
    unitGroupLabel: "Weight unit",
    value: "Weight",
  },
  healthDetailsLabel: "Please give details",
  healthDetailsPlaceholder: "What it is, when it started, and anything that makes it worse.",

  success: {
    title: "Application received",
    /** {first name} comes from the Full name answer. */
    body: (firstName: string) =>
      `Thanks, ${firstName}. Mohamed will review your answers and message you on WhatsApp.`,
    whatsappLabel: "Continue on WhatsApp",
    whatsappMessage:
      "Hi Mohamed, I just submitted an application on your website.",
    homeLabel: "Back to the homepage",
  },

  failure: {
    title: "That did not go through.",
    body: "Your application could not be sent just now, so it has not reached Mohamed. Your answers are still here. Try again, or message him on WhatsApp.",
    retry: "Try again",
    whatsappLabel: "Message Mohamed on WhatsApp",
    whatsappMessage:
      "Hi Mohamed, I tried to submit an application on your website but it did not go through.",
  },

  rateLimited: {
    body: "Too many attempts. Please wait a few minutes and try again.",
  },

  serverInvalid:
    "Some answers need another look. The first one is highlighted.",
} as const;

/** Validation messages, shared by the browser and the server. */
export const validationMessages = {
  required: "This question is required.",
  choose: "Choose one of the options.",
  fullName: "Enter your full name.",
  email: "Enter a valid email address.",
  phone: "Enter a 10-digit US number, e.g. (212) 555-0147.",
  age: `Enter your age in years. You need to be at least ${limits.minAge}.`,
  height: "Enter your height.",
  heightRange: "That height looks out of range. Check the number and the unit.",
  weight: "Enter your current weight.",
  weightRange: "That weight looks out of range. Check the number and the unit.",
  details: "Please give a few details.",
  consent: "This has to be ticked to send your application.",
  tooLong: (max: number) => `Keep this under ${max} characters.`,
} as const;
