import { z } from "zod";

export const rfqExtractionSchema = z.object({
  fields: z.object({
    incoterms: z.string().nullable(),
    originCountry: z.string().nullable(),
    originCity: z.string().nullable(),
    originPort: z.string().nullable(),
    destinationCountry: z.string().nullable(),
    destinationCity: z.string().nullable(),
    destinationPort: z.string().nullable(),
    containerType: z.string().nullable(),
    containerQuantity: z.number().int().positive().nullable(),
    cargoDescription: z.string().nullable(),
    packaging: z.string().nullable(),
    grossWeight: z.string().nullable(),
    volume: z.string().nullable(),
    cargoReadyDate: z.string().nullable(),
    quotationDeadline: z.string().nullable(),
    specialRequirements: z.string().nullable(),
    cargoFlags: z.array(z.enum(["dangerous_goods", "temperature_controlled", "reefer", "out_of_gauge", "special_handling"]))
  }),
  assertions: z.array(
    z.object({
      fieldName: z.string(),
      value: z.string().nullable(),
      verificationStatus: z.enum(["Confirmed", "Needs confirmation", "Missing", "Conflict detected"]),
      confidence: z.enum(["High", "Medium", "Low"]),
      evidence: z.string()
    })
  ),
  missingFields: z.array(z.string()),
  riskFlags: z.array(z.string()),
  clarificationDraft: z.string()
});

export const rateExtractionSchema = z.object({
  agentName: z.string().nullable(),
  oceanFreight: z.number().nonnegative(),
  currency: z.string(),
  rateUnit: z.string(),
  originCharges: z.number().nonnegative(),
  documentationFee: z.number().nonnegative(),
  destinationCharges: z.number().nonnegative(),
  shippingLine: z.string(),
  transitDays: z.number().int().positive(),
  route: z.string(),
  validityDate: z.string(),
  freeDays: z.number().int().nonnegative(),
  inclusions: z.array(z.string()),
  exclusions: z.array(z.string()),
  conditions: z.array(z.string()),
  completenessScore: z.number().int().min(0).max(100),
  reviewRequired: z.boolean(),
  sourceEvidence: z.string()
});

export type RFQExtraction = z.infer<typeof rfqExtractionSchema>;
export type RateExtraction = z.infer<typeof rateExtractionSchema>;
