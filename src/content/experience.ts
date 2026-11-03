/**
 * The Coaching Experience — four benefit groups.
 *
 * Absorbs the "Method" content from the v1 proposal. Deliberately terse: the
 * detail lives in the plan comparison and the FAQ, so this section only has to
 * be scannable. Summaries are one line; the bullets are fragments, not
 * sentences.
 *
 * PROVISIONAL: these describe how online coaching of this shape normally runs.
 * A sensible default for review, not statements the client has confirmed.
 * Nothing here claims a result.
 */

export const experienceIsProvisional = true;

export const experience = {
  eyebrow: "The coaching experience",
  heading: "What working together looks like.",
  lede: "A programme written for you, reviewed on a set rhythm, and changed when your week changes.",

  groups: [
    {
      id: "personalized-training",
      index: "01",
      title: "Personalized training",
      summary: "Built around the days you can genuinely train and the equipment you have.",
      points: ["Your real schedule", "Your equipment", "Rewritten when life gets in the way"],
    },
    {
      id: "expert-guidance",
      index: "02",
      title: "Expert guidance",
      summary: "A NASM certified coach and professional soccer player reviewing what you actually do.",
      points: ["Technique reviewed from video", "Specific corrections", "Nutrition targets alongside training"],
    },
    {
      id: "progress-tracking",
      index: "03",
      title: "Progress tracking",
      summary: "Sessions logged and reviewed, so changes come from the record rather than a feeling.",
      points: ["Training logged", "Reviewed on a rhythm", "Loads adjusted from the data"],
    },
    {
      id: "ongoing-accountability",
      index: "04",
      title: "Ongoing accountability",
      summary: "Check-ins daily or weekly — and a coach who notices when you go quiet.",
      points: ["Direct WhatsApp access", "Honest follow-up", "Someone expecting an answer"],
    },
  ],

  /** Honest framing beats hype — this is what is asked of the client. */
  expectations: {
    title: "What is expected of you",
    items: [
      "Train the sessions you committed to, and log them.",
      "Reply at check-in, including the weeks that went badly.",
      "Send video when technique is in question.",
      "Give it the full term.",
    ],
  },
} as const;
