import { site, whatsappDisplayNumber } from "@/content/site";

/**
 * Legal and policy copy.
 *
 * Written from what the site verifiably does — the fields the form collects,
 * where they go, and how enrollment works — plus the refund terms the client
 * supplied. No business address, legal entity, tax detail, state or governing
 * law is stated, because none of those were supplied and none may be
 * invented.
 *
 * INTERNAL: these documents have NOT been reviewed by a lawyer. The gaps the
 * client still has to fill are listed in docs/03-legal-pages.md. That note is
 * never rendered to visitors.
 */

export type LegalSection = { heading: string; body: string[] };

export type LegalDocument = {
  slug: string;
  title: string;
  /** Plain string: Cache Components rejects `new Date()` during prerender. */
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};

export const privacy: LegalDocument = {
  slug: "privacy",
  title: "Privacy Policy",
  lastUpdated: "November 16, 2026",
  intro:
    "This policy explains what this website collects, why, and what happens to it. It covers the website only — anything you later share directly with Mohamed over WhatsApp is part of your coaching relationship with him.",
  sections: [
    {
      heading: "What this site collects",
      body: [
        "The application form is the only place this website asks for personal information. It collects your name, email address, mobile number, the coaching plan you are interested in, your main training goal, your training experience, where you train, how many days a week you can train, and anything you choose to write in the free-text field.",
        "Nothing else on the site collects personal information. There is no analytics, no advertising, no tracking pixels and no cookies set by this website.",
      ],
    },
    {
      heading: "Why it is collected",
      body: [
        "To respond to your application and to work out whether coaching is a fit for you, and which plan suits. The training questions exist so that the first conversation is useful rather than a questionnaire.",
        "Submitting the form is a request to be contacted. You confirm that explicitly with the consent checkbox before the form can be sent.",
      ],
    },
    {
      heading: "Where it goes",
      body: [
        "Submissions are recorded in a private Google Sheet that only Mohamed can access, and the follow-up conversation happens on WhatsApp using the number you provide.",
        "Your details are not sold, rented, or shared with anyone for marketing. They are not passed to third parties beyond the services needed to run the site and store the submission.",
      ],
    },
    {
      heading: "How long it is kept",
      body: [
        "Applications are kept while they are relevant to an ongoing or prospective coaching relationship. If you ask for your details to be deleted, they will be removed from the sheet.",
      ],
    },
    {
      heading: "Your choices",
      body: [
        "You can ask what is held about you, ask for it to be corrected, or ask for it to be deleted. Email Mohamed or message him on WhatsApp — both are on the contact page — and say what you would like done.",
      ],
    },
    {
      heading: "Third-party services",
      body: [
        "This site is hosted on a web hosting provider, which keeps standard server logs. Form submissions are stored using Google Sheets, and WhatsApp is used for the conversation afterwards. Each of those services handles data under its own terms.",
      ],
    },
    {
      heading: "Changes",
      body: [
        "If this policy changes, the date at the top of this page changes with it.",
      ],
    },
  ],
};

export const terms: LegalDocument = {
  slug: "terms",
  title: "Terms & Conditions",
  lastUpdated: "November 16, 2026",
  intro:
    "These terms cover the use of this website and the online coaching offered through it. The plan, price and payment arrangement for your coaching are confirmed directly with Mohamed before you start; cancellation and refunds follow the Refunds & Cancellation policy.",
  sections: [
    {
      heading: "What this website is",
      body: [
        "This site presents the online coaching Mohamed Naama offers and lets you apply for it. There is no checkout, no payment processing and no booking system here.",
        "Submitting the application form is a request, not a purchase and not a confirmed place. Nothing on this site forms a coaching agreement on its own.",
      ],
    },
    {
      heading: "How enrollment works",
      body: [
        "After you apply, Mohamed follows up on WhatsApp. The plan, the term, the price and the payment arrangement are agreed directly with him at that point, and coaching begins once both of you have agreed them.",
      ],
    },
    {
      heading: "The coaching plans",
      body: [
        "Coaching is offered as Weekly Coaching or Daily Coaching, each over a three-month or six-month term. The difference between them is how often you and Mohamed are in contact; the program, nutrition recommendations and technique review are part of both.",
        "Prices shown on this site are the current rates for those plans and are stated per week alongside the total for the full term.",
      ],
    },
    {
      heading: "Cancellation and refunds",
      body: [
        "Your first payment is covered by a 7-day guarantee: if you are not satisfied, you can request a full refund within 7 days of making it. After that, payments for a coaching period that has already started are non-refundable.",
        "You can cancel at any time by messaging Mohamed before your next payment is due, and your coaching continues until the end of the period you have already paid for. The full terms, including pausing for injury or illness, are set out in the Refunds & Cancellation policy.",
      ],
    },
    {
      heading: "What is expected of you",
      body: [
        "Coaching depends on the information you give. You are responsible for describing your training history, your injuries and your health honestly, and for telling Mohamed if any of that changes during the term.",
        "You are responsible for carrying out the program as written, for logging your sessions, and for replying at check-ins.",
      ],
    },
    {
      heading: "Health and safety",
      body: [
        "Coaching is not medical advice, diagnosis or treatment, and Mohamed is not your doctor. Nutrition support is limited to general recommendations that support your training; it is not a prescribed meal plan and it is not dietetic advice. Consult a qualified medical professional before beginning any new training or nutrition program, particularly if you have an existing condition, an injury, or are pregnant.",
        "Training carries a risk of injury. You take part at your own risk and should stop and seek medical attention if something hurts in a way that is not ordinary training discomfort.",
      ],
    },
    {
      heading: "Results",
      body: [
        "No particular result is promised. What you get out of coaching depends on your consistency, your starting point, your sleep, your nutrition and factors outside anyone's control.",
      ],
    },
    {
      heading: "Coaching materials",
      body: [
        "Programs, written plans and materials provided during coaching are for your own use. Please do not resell or redistribute them.",
      ],
    },
    {
      heading: "Contacting us about these terms",
      body: [
        "Questions about these terms go to Mohamed through any of the methods on the contact page.",
      ],
    },
  ],
};

/**
 * How to reach Mohamed with a refund or cancellation request, built from the
 * values in `site` so the policy can never show a stale address or number.
 */
function requestChannels() {
  const number = whatsappDisplayNumber();
  const channels = [
    site.email ? `email Mohamed at ${site.email}` : null,
    number ? `send him a WhatsApp message at ${number}` : null,
  ].filter(Boolean);
  const how = channels.length
    ? channels.join(" or ")
    : "contact Mohamed through the contact page";
  return `To request a refund or to cancel, ${how}. Include your name and the plan you are on.`;
}

/**
 * CONFIRMED by client: the terms below. Billing is described only as "your
 * first payment" and "your next payment" — the payment arrangement itself is
 * agreed with Mohamed (see `terms`), so no cadence is stated here.
 */
export const refunds: LegalDocument = {
  slug: "refunds",
  title: "Refunds & Cancellation",
  lastUpdated: "November 16, 2026",
  intro:
    "How refunds and cancellation work for online coaching with Mohamed. There is no checkout on this site: payment is arranged directly with Mohamed once you have agreed on a plan, and this policy applies from your first payment.",
  sections: [
    {
      heading: "7-day guarantee",
      body: [
        "If you are not satisfied with your coaching, you can request a full refund of your first payment within 7 days of making it.",
      ],
    },
    {
      heading: "After the first 7 days",
      body: [
        "Once those 7 days have passed, payments for a coaching period that has already started are non-refundable. Your program is built for you individually, and Mohamed's time for that period is already committed to you.",
      ],
    },
    {
      heading: "Cancel any time",
      body: [
        "You can cancel at any time by messaging Mohamed before your next payment is due. You will not be charged again, and your coaching continues until the end of the period you have already paid for.",
      ],
    },
    {
      heading: "What is not refunded",
      body: [
        "Refunds are not given for missed check-ins, unused coaching time, or not following the program.",
      ],
    },
    {
      heading: "Injury, illness or an emergency",
      body: [
        "If an injury, an illness or an emergency stops you from training, your coaching can be paused by arrangement with Mohamed, so you do not lose the time you have paid for.",
      ],
    },
    {
      heading: "If Mohamed ends the coaching",
      body: [
        "If Mohamed ends the coaching relationship, any time you have paid for but not yet used is refunded.",
      ],
    },
    {
      heading: "How refunds are paid",
      body: [
        "Approved refunds go back to your original payment method within 5–10 business days.",
      ],
    },
    {
      heading: "How to make a request",
      body: [requestChannels()],
    },
  ],
};

export const legalDocuments = [privacy, terms, refunds];

export function getLegalDocument(slug: string) {
  return legalDocuments.find((doc) => doc.slug === slug);
}
