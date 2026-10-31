import { z } from "zod";

export const surveyStep1Schema = z.object({
  challenges: z
    .array(z.string())
    .min(1, "Please select at least one challenge you currently face."),
  other_challenge: z.string().trim().optional(),
});

export const surveyStep2Schema = z.object({
  desired_solutions: z
    .array(z.string())
    .min(1, "Please select at least one capability you would like to see."),
  user_suggestions: z.string().trim().optional(),
});

export const surveyStep3Schema = z.object({
  preferred_product_type: z
    .string()
    .min(1, "Please select what kind of experience you prefer."),
});

export const surveyStep4Schema = z.object({
  beta_interest: z
    .string()
    .min(1, "Please select your beta testing interest preference."),
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
  marketing_consent: z.boolean().default(false),
});

// Full submission schema (with backward compatibility)
export const completeWaitlistSchema = z.object({
  // Contact & Identity
  email: z.string().trim().toLowerCase().email("Valid email is required"),
  country: z.string().trim().default("Global"),
  name: z.string().trim().optional(),
  whatsapp_number: z.string().trim().optional(),
  marketing_consent: z.boolean().default(false),

  // Step 1: Challenges
  challenges: z.array(z.string()).min(1, "At least one challenge is required"),
  other_challenge: z.string().trim().optional(),

  // Step 2: Desired Solutions
  desired_solutions: z.array(z.string()).default([]),
  user_suggestions: z.string().trim().optional(),

  // Step 3: Product Experience Preference
  preferred_product_type: z.string().optional(),

  // Step 4: Beta testing interest
  beta_interest: z.string().default("Yes, I am interested"),

  // Legacy compatibility fields
  usage_priorities: z.array(z.string()).default([]),
  expected_usage_frequency: z.string().optional(),
  features: z.array(z.string()).optional(),
  primary_feature: z.string().optional(),
  honeypot: z.string().optional(),

  // Attribution
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
export const waitlistStep2Schema = z.object({
  features: z.array(z.string()).min(1),
  primary_feature: z.string().min(1),
});
export const waitlistStep3Schema = surveyStep5Schema;
