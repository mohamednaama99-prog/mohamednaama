/**
 * FAQ.
 *
 * Answers marked `needsClientAnswer` are deliberately non-committal: they state
 * only what the agreed flow already supports, because committing to a policy
 * (refunds, equipment minimums, suitability) is the client's call, not ours.
 * Replace those answers before launch.
 */

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  needsClientAnswer?: boolean;
};

export const faq: FaqItem[] = [
  {
    id: "how-it-works",
    question: "How does online coaching with Mohamed work?",
    answer:
      "You send an application through this site. Mohamed reviews it and continues the conversation with you directly on WhatsApp — covering your goals, your schedule and which plan fits. From there you get a programme written for you, and check-ins on the rhythm your plan sets.",
  },
  {
    id: "daily-vs-weekly",
    question: "What is the difference between Daily and Weekly Coaching?",
    answer:
      "The rhythm of contact. Weekly Coaching reviews your training once a week. Daily Coaching keeps contact on every training day, so adjustments happen session by session rather than at the end of the week. Both include a programme built for you, nutrition guidance and technique review.",
  },
  {
    id: "term-length",
    question: "Why are the plans three or six months?",
    answer:
      "Both plans run a full term because meaningful change in training is measured in months, not weeks. Three months is the shortest plan offered; six months gives room for a full progression and a deload cycle inside the same programme.",
  },
  {
    id: "after-applying",
    question: "What happens after I submit the form?",
    answer:
      "Your application is recorded and Mohamed follows up on WhatsApp to confirm the details and arrange enrolment. There is no checkout on this site — enrolment and payment are arranged directly with Mohamed.",
  },
  {
    id: "payment",
    question: "How do I pay?",
    answer:
      "Payment is arranged directly with Mohamed once you have agreed which plan suits you. This site does not take payments.",
  },
  {
    id: "equipment",
    question: "Do I need a gym membership?",
    answer:
      "Tell Mohamed what you have access to in your application — a full gym, a home setup, or minimal equipment — and the programme is written around it.",
    needsClientAnswer: true,
  },
  {
    id: "beginners",
    question: "Is this suitable if I am new to training?",
    answer:
      "Experience level is one of the first things the application asks about, and the programme is written from there. If you are unsure whether coaching is right for you yet, say so in the form and Mohamed will tell you honestly.",
    needsClientAnswer: true,
  },
  {
    id: "nutrition",
    question: "Is nutrition included?",
    answer:
      "Nutrition guidance and targets are part of both plans, set alongside your training rather than handled as a separate diet.",
    needsClientAnswer: true,
  },
];
