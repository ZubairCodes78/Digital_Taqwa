export interface WaitlistSubmission {
  id?: string;
  name?: string;
  email: string;
  country: string;
  whatsapp_number?: string;
  marketing_consent: boolean;
  // Step 1: Challenges
  challenges: string[];
  other_challenge?: string;
  // Step 2: Desired Solutions
  desired_solutions?: string[];
  user_suggestions?: string;
  // Step 3: Preferred Product Experience
  preferred_product_type?: string;
  // Step 4: Priority & Usage
  usage_priorities?: string[];
  expected_usage_frequency?: string;
  // Step 5: Beta testing interest
  beta_interest?: string;
  // Legacy compatibility
  features?: string[];
  primary_feature?: string;
  honeypot?: string;
  // Attribution
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  landing_page?: string;
  referral_code?: string;
  referred_by?: string;
}

export interface WaitlistUserRecord {
  id: string;
  name?: string;
  email: string;
  country: string;
  whatsapp_number?: string;
  email_verified: boolean;
  marketing_consent: boolean;
  verification_token?: string;
  verification_token_expires?: string;
  verified_at?: string;
  referral_code: string;
  referred_by?: string;
  referral_count?: number;
  created_at: string;
  updated_at: string;
  // Research Survey Data
  challenges: string[];
  other_challenge?: string;
  desired_solutions?: string[];
  user_suggestions?: string;
  preferred_product_type?: string;
  usage_priorities?: string[];
  expected_usage_frequency?: string;
  beta_interest?: string;
  device_platform?: string;
  // Backward compatibility
  features?: string[];
  primary_feature?: string;
  attribution?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
    referrer?: string;
    landing_page?: string;
  };
}

export interface AdminStats {
  totalSignups: number;
  totalSurveys: number;
  verifiedEmails: number;
  unverifiedEmails: number;
  verificationRate: number;
  organicSignups: number;
  paidSignups: number;
  countryDistribution: Record<string, number>;
  betaInterestDistribution: Record<string, number>;
  challengeCounts: Record<string, number>;
  solutionInterests: Record<string, number>;
  productTypeDistribution: Record<string, number>;
  usagePriorityCounts: Record<string, number>;
  usageFrequencyDistribution: Record<string, number>;
  recentSuggestions: {
    email: string;
    country: string;
    suggestion: string;
    date: string;
  }[];
  // Backward compatibility
  featureInterests: Record<string, number>;
  primaryFeatures: Record<string, number>;
  campaignPerformance: {
    source: string;
    campaign: string;
    count: number;
    verifiedCount: number;
  }[];
}

export interface AttributionData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  landing_page?: string;
  referral_code?: string;
}
