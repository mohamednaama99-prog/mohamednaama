/**
 * FAQ.
 *
 * Answers marked `needsClientAnswer` are deliberately non-committal: they state
 * only what the agreed flow already supports, because committing to a policy
 * (equipment minimums, suitability, nutrition scope) is the client's call.
 * They are accurate as written; the client can sharpen them at any time.
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
      "You send an application through this site. Mohamed reviews it and continues the conversation with you directly on WhatsApp — covering your goals, your schedule and which plan fits. From there you get a program written for you, and check-ins on the rhythm your plan sets.",
  },
  {
    id: "daily-vs-weekly",
    question: "What is the difference between Daily and Weekly Coaching?",
    answer:
      "The rhythm of contact. Weekly Coaching reviews your training once a week. Daily Coaching keeps contact on every training day, so adjustments happen session by session rather than at the end of the week. Both include a program built for you, nutrition recommendations and technique review.",
  },
  {
    id: "term-length",
    question: "Why are the plans three or six months?",
    answer:
      "Both plans run a full term because meaningful change in training is measured in months, not weeks. Three months is the shortest plan offered; six months gives room for a full progression and a deload cycle inside the same program.",
  },
  {
    id: "after-applying",
    question: "What happens after I submit the form?",
    answer:
      "Your application is recorded and Mohamed follows up on WhatsApp to confirm the details and arrange enrollment. There is no checkout on this site — enrollment and payment are arranged directly with Mohamed.",
  },
  {
    id: "payment",
    question: "How do I pay?",
    answer:
      "Payment is arranged directly with Mohamed once you have agreed which plan suits you. This site does not take payments.",
  },
  {
    id: "refunds",
    question: "Can I cancel or get a refund?",
    answer:
      "Yes. If you are not satisfied, you can request a full refund of your first payment within 7 days of making it. After that, you can cancel at any time by messaging Mohamed before your next payment is due — you will not be charged again, and coaching continues until the end of the period you have already paid for. The Refunds & Cancellation page has the full policy.",
  },
  {
    id: "equipment",
    question: "Do I need a gym membership?",
    answer:
      "Tell Mohamed what you have access to in your application — a full gym, a home setup, or minimal equipment — and the program is written around it.",
    needsClientAnswer: true,
  },
  {
    id: "beginners",
    question: "Is this suitable if I am new to training?",
    answer:
      "Experience level is one of the first things the application asks about, and the program is written from there. If you are unsure whether coaching is right for you yet, say so in the form and Mohamed will tell you honestly.",
    needsClientAnswer: true,
  },
  {
    id: "nutrition",
    question: "Is nutrition included?",
    answer:
      "Both plans include practical nutrition recommendations to support your training — this is not a full meal plan. You get guidance on how to eat around your sessions and your goal, not a prescribed day-by-day menu.",
    needsClientAnswer: true,
  },
];
