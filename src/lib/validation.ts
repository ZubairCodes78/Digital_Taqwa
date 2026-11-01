import { z } from "zod";

export const surveyStep1Schema = z.object({
  challenges: z
    .array(z.string())
    .min(1, "Please select at least one area where your attention feels divided."),
  other_challenge: z.string().trim().optional(),
});

export const surveyStep2Schema = z.object({
  usage_priorities: z
    .array(z.string())
    .min(1, "Please select how you currently try to protect your spiritual time."),
  other_approach: z.string().trim().optional(),
});

export const surveyStep3Schema = z.object({
  desired_solutions: z
    .array(z.string())
    .min(1, "Please select what usually causes you to stop using other apps."),
  other_frustration: z.string().trim().optional(),
});

export const surveyStep4Schema = z.object({
  preferred_product_type: z
    .string()
    .min(1, "Please select the digital experience that would bring the most peace to your Deen."),
  user_suggestions: z.string().trim().optional(),
});

export const surveyStep5Schema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address."),
  name: z.string().trim().optional(),
  whatsapp_number: z.string().trim().optional(),
  country: z.string().trim().default("Global"),
  beta_interest: z.string().default("Yes, I would love to test early concepts and provide feedback"),
  marketing_consent: z.boolean().default(false),
});

// Complete submission schema (supports full research dataset + backward compatibility)
export const completeWaitlistSchema = z.object({
  // Contact & Identity
  email: z.string().trim().toLowerCase().email("Valid email is required"),
  country: z.string().trim().default("Global"),
  name: z.string().trim().optional(),
  whatsapp_number: z.string().trim().optional(),
  marketing_consent: z.boolean().default(false),

  // Research Question 1: Attention Struggles / Friction
  challenges: z.array(z.string()).default([]),
  other_challenge: z.string().trim().optional(),

  // Research Question 2: Current Workarounds & Approaches
  usage_priorities: z.array(z.string()).default([]),
  other_approach: z.string().trim().optional(),

  // Research Question 3: Why Existing Solutions Fail (Churn Drivers)
  desired_solutions: z.array(z.string()).default([]),
  other_frustration: z.string().trim().optional(),

  // Research Question 4: Ideal Experience Direction
  preferred_product_type: z.string().optional(),
  user_suggestions: z.string().trim().optional(),

  // Step 5: Beta testing participation
  beta_interest: z.string().default("Yes, I would love to test early concepts and provide feedback"),

  // Backward compatibility fields
  expected_usage_frequency: z.string().optional(),
  features: z.array(z.string()).optional(),
  primary_feature: z.string().optional(),
  honeypot: z.string().optional(),

  // Marketing Attribution
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional(),
  referrer: z.string().optional(),
  landing_page: z.string().optional(),
  referral_code: z.string().optional(),
  referred_by: z.string().optional(),
});

export type CompleteWaitlistInput = z.infer<typeof completeWaitlistSchema>;

// Aliases for legacy imports
export const waitlistStep1Schema = surveyStep1Schema;
export const waitlistStep2Schema = surveyStep2Schema;
export const waitlistStep3Schema = surveyStep5Schema;
