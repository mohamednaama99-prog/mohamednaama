/**
 * Legal and policy copy.
 *
 * Written from what the site verifiably does — the fields the form collects,
 * where they go, and how enrolment works. No business address, legal entity,
 * tax detail, jurisdiction, refund window or percentage is stated, because
 * none of those were supplied and none may be invented.
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

const LAST_UPDATED = "3 November 2026";

export const privacy: LegalDocument = {
  slug: "privacy",
  title: "Privacy Policy",
  lastUpdated: LAST_UPDATED,
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
        "You can ask what is held about you, ask for it to be corrected, or ask for it to be deleted. Message Mohamed on WhatsApp using the number on the contact page and say what you would like done.",
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
  lastUpdated: LAST_UPDATED,
  intro:
    "These terms cover the use of this website and the online coaching offered through it. The specific terms of your own coaching agreement are confirmed directly with Mohamed before you start.",
  sections: [
    {
      heading: "What this website is",
      body: [
        "This site presents the online coaching Mohamed Naama offers and lets you apply for it. There is no checkout, no payment processing and no booking system here.",
        "Submitting the application form is a request, not a purchase and not a confirmed place. Nothing on this site forms a coaching agreement on its own.",
      ],
    },
    {
      heading: "How enrolment works",
      body: [
        "After you apply, Mohamed follows up on WhatsApp. The plan, the term, the price and the payment arrangement are agreed directly with him at that point, and coaching begins once both of you have agreed them.",
      ],
    },
    {
      heading: "The coaching plans",
      body: [
        "Coaching is offered as Weekly Coaching or Daily Coaching, each over a three-month or six-month term. The difference between them is how often you and Mohamed are in contact; the programme, nutrition guidance and technique review are part of both.",
        "Prices shown on this site are the current rates for those plans and are stated per week alongside the total for the full term.",
      ],
    },
    {
      heading: "What is expected of you",
      body: [
        "Coaching depends on the information you give. You are responsible for describing your training history, your injuries and your health honestly, and for telling Mohamed if any of that changes during the term.",
        "You are responsible for carrying out the programme as written, for logging your sessions, and for replying at check-ins.",
      ],
    },
    {
      heading: "Health and safety",
      body: [
        "Coaching is not medical advice, diagnosis or treatment, and Mohamed is not your doctor. Consult a qualified medical professional before beginning any new training or nutrition programme, particularly if you have an existing condition, an injury, or are pregnant.",
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
      heading: "Your account of the service",
      body: [
        "Programmes, written plans and materials provided during coaching are for your own use. Please do not resell or redistribute them.",
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

export const refunds: LegalDocument = {
  slug: "refunds",
  title: "Refunds & Cancellation",
  lastUpdated: LAST_UPDATED,
  intro:
    "How cancellation and refunds are handled for online coaching. Because there is no checkout on this site, these arrangements are confirmed with Mohamed directly before coaching begins.",
  sections: [
    {
      heading: "Before coaching starts",
      body: [
        "Submitting the application form does not commit you to anything and costs nothing. If you decide not to go ahead after speaking with Mohamed, simply say so — there is nothing to cancel.",
      ],
    },
    {
      heading: "Coaching terms run for a fixed period",
      body: [
        "Both plans are sold as a full term — three months or six months. The term, its price and the payment arrangement are agreed with Mohamed before coaching begins, and that agreement is what governs cancellation and any refund.",
      ],
    },
    {
      heading: "Asking to cancel",
      body: [
        "If you need to stop coaching partway through a term, contact Mohamed as early as you can and explain the circumstances. Requests are handled individually, and the outcome depends on what the two of you agreed at enrolment.",
      ],
    },
    {
      heading: "Pausing instead of cancelling",
      body: [
        "Injury, illness and travel are a normal part of a long training block, and they are usually better handled by adjusting or pausing the programme than by ending it. Raise it at your next check-in.",
      ],
    },
    {
      heading: "How to make a request",
      body: [
        "Send your cancellation or refund request to Mohamed through any of the methods on the contact page, with your name and the plan you are on.",
      ],
    },
  ],
};

export const legalDocuments = [privacy, terms, refunds];

export function getLegalDocument(slug: string) {
  return legalDocuments.find((doc) => doc.slug === slug);
}
