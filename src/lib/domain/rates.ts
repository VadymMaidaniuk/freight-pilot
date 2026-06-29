import type { RateOption } from "@/lib/types";

export function calculateKnownTotal(input: Pick<RateOption, "oceanFreight" | "originCharges" | "documentationFee" | "destinationCharges">) {
  return input.oceanFreight + input.originCharges + input.documentationFee + input.destinationCharges;
}

export function canCreateQuote(rate: RateOption | undefined) {
  const blockers: string[] = [];

  if (!rate) blockers.push("Selected rate");
  if (rate && !rate.currency) blockers.push("Currency");
  if (rate && rate.reviewRequired) blockers.push("Known or explicitly excluded major charges");
  if (rate && rate.validityDate === "Missing") blockers.push("Validity");
  if (rate && rate.knownTotal <= 0) blockers.push("Known total");

  return {
    allowed: blockers.length === 0,
    blockers
  };
}

export function rankRateOptions(rateOptions: RateOption[]): RateOption[] {
  return [...rateOptions].sort((a, b) => {
    const aComparable = a.reviewRequired ? 1 : 0;
    const bComparable = b.reviewRequired ? 1 : 0;
    if (aComparable !== bComparable) return aComparable - bComparable;

    const completenessDelta = b.completenessScore - a.completenessScore;
    if (Math.abs(completenessDelta) >= 10) return completenessDelta;

    const totalDelta = a.knownTotal - b.knownTotal;
    if (Math.abs(totalDelta) >= 50) return totalDelta;

    return a.transitDays - b.transitDays;
  });
}

export function explainRecommendation(rate: RateOption, allRates: RateOption[]) {
  const comparableRates = allRates.filter((option) => !option.reviewRequired);
  const lowestComparable = comparableRates.reduce<RateOption | null>((lowest, option) => {
    if (!lowest) return option;
    return option.knownTotal < lowest.knownTotal ? option : lowest;
  }, null);

  const reasons = [
    lowestComparable?.id === rate.id ? "Lowest comparable known total" : "Competitive known total",
    "Major charges disclosed",
    `Validity covers ${rate.validityDate}`,
    `${rate.freeDays} free days included`,
    `${rate.transitDays} day transit time`
  ];

  if (rate.completenessScore >= 90) reasons.push("High completeness score");
  if (rate.status === "Late response") reasons.push("Received after Quote v1, requires manager-controlled versioning");

  return reasons;
}
