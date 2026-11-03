import React from "react";
import { SOCIAL_PROFILES } from "@/lib/constants";

export function JsonLd() {
  const canonicalUrl = "https://digitaltaqwa.site";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${canonicalUrl}/#organization`,
    name: "Digital Taqwa",
    alternateName: "Digital Taqwa Sanctuary",
    url: canonicalUrl,
    logo: {
      "@type": "ImageObject",
      url: `${canonicalUrl}/logo.png`,
      caption: "Digital Taqwa — Make Space for What Truly Matters",
    },
    image: `${canonicalUrl}/logo.png`,
    description:
      "An early-stage initiative exploring how digital experiences can support Islamic habits, intentional living and a more mindful relationship with technology.",
    parentOrganization: {
      "@type": "Organization",
      name: "Barakah Habits Daily",
      url: SOCIAL_PROFILES.youtube.url,
      logo: `${canonicalUrl}/barakah-habits-logo.jpg`,
      sameAs: [
        SOCIAL_PROFILES.instagram.url,
        SOCIAL_PROFILES.youtube.url,
        SOCIAL_PROFILES.tiktok.url,
      ],
    },
    sameAs: [
      SOCIAL_PROFILES.instagram.url,
      SOCIAL_PROFILES.youtube.url,
      SOCIAL_PROFILES.tiktok.url,
    ],
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${canonicalUrl}/#website`,
    url: canonicalUrl,
    name: "Digital Taqwa",
    alternateName: "Digital Taqwa Sanctuary",
    publisher: {
      "@id": `${canonicalUrl}/#organization`,
    },
    description:
      "Make space for what truly matters. An intentional Islamic digital sanctuary exploring better habits and consistency in Deen.",
    inLanguage: "en-US",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${canonicalUrl}/#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Digital Taqwa and who is behind it?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Digital Taqwa is a mindful Islamic digital companion being developed by Barakah Habits Daily — a global Islamic media channel dedicated to Sunnah habits, mindful mornings, and spiritual presence. It is designed to help Muslims disconnect from worldly noise and build intentional spiritual routines.",
        },
      },
      {
        "@type": "Question",
        name: "Why are you conducting market research instead of releasing an app right away?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most technology applications fail because developers build on assumptions rather than understanding actual human struggles. We refuse to build features that clutter your life or force unnecessary complexity. By surveying Muslims worldwide first, we ensure that every single feature serves a genuine spiritual need.",
        },
      },
      {
        "@type": "Question",
        name: "When will the application be available for testing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Once our initial research phase concludes, our product roadmap will be finalized directly based on your survey answers. Everyone who completes the research survey and joins the waitlist will receive priority beta testing invitations before public release.",
        },
      },
      {
        "@type": "Question",
        name: "Will Digital Taqwa contain advertisements?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Spiritual technology should foster tranquility and devotion, not commercial distraction. We are committed to a quiet, dignified experience free of intrusive pop-ups, flashing banner ads, or data monetization.",
        },
      },
      {
        "@type": "Question",
        name: "How will my survey responses and email be protected?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Your survey answers are strictly confidential and used solely for aggregated product research. We will never sell, rent, or share your contact details. You will only receive meaningful project updates and your early beta testing link.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

