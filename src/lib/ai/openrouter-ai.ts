import { LMStudioAIService, type ProviderRoutingPreferences, type ResponseFormatMode } from "./lmstudio-ai";

const defaultProviderSlug = "google-ai-studio";
const defaultModel = "google/gemma-4-26b-a4b-it:free";

function readList(value: string | undefined) {
  return value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function readBoolean(value: string | undefined, fallback: boolean) {
  if (value === undefined || value.trim() === "") return fallback;
  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

function readNumber(value: string | undefined, fallback: number) {
  if (value === undefined || value.trim() === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readResponseFormat(value: string | undefined): ResponseFormatMode {
  const normalized = value?.trim().toLowerCase();
  if (normalized === "none" || normalized === "false" || normalized === "off") return "none";
  if (normalized === "json_schema" || normalized === "schema" || normalized === "true") return "json_schema";
  return "json_object";
}

function readProviderSort(value: string | undefined): ProviderRoutingPreferences["sort"] {
  if (value === "price" || value === "throughput" || value === "latency") return value;
  return undefined;
}

function readDataCollection(value: string | undefined): ProviderRoutingPreferences["data_collection"] {
  if (value === "allow" || value === "deny") return value;
  return undefined;
}

function buildProviderPreferences(responseFormatMode: ResponseFormatMode): ProviderRoutingPreferences {
  const providerSlug = process.env.OPENROUTER_PROVIDER_SLUG?.trim() || defaultProviderSlug;
  const order = readList(process.env.OPENROUTER_PROVIDER_ORDER ?? providerSlug);
  const only = readList(process.env.OPENROUTER_PROVIDER_ONLY ?? providerSlug);
  const ignore = readList(process.env.OPENROUTER_PROVIDER_IGNORE);
  const sort = readProviderSort(process.env.OPENROUTER_PROVIDER_SORT);
  const dataCollection = readDataCollection(process.env.OPENROUTER_DATA_COLLECTION);

  const preferences: ProviderRoutingPreferences = {
    allow_fallbacks: readBoolean(process.env.OPENROUTER_ALLOW_FALLBACKS, false),
    require_parameters: readBoolean(process.env.OPENROUTER_REQUIRE_PARAMETERS, responseFormatMode !== "none")
  };

  if (order?.length) preferences.order = order;
  if (only?.length) preferences.only = only;
  if (ignore?.length) preferences.ignore = ignore;
  if (sort) preferences.sort = sort;
  if (dataCollection) preferences.data_collection = dataCollection;

  return preferences;
}

function buildAttributionHeaders() {
  const headers: Record<string, string> = {};
  const referer = process.env.OPENROUTER_HTTP_REFERER?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const title = process.env.OPENROUTER_APP_TITLE?.trim() || "FreightPilot";

  if (referer) headers["HTTP-Referer"] = referer;
  if (title) headers["X-Title"] = title;

  return headers;
}

export class OpenRouterAIService extends LMStudioAIService {
  constructor(
    baseUrl = process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1",
    model = process.env.OPENROUTER_MODEL ?? defaultModel,
    timeoutMs = readNumber(process.env.OPENROUTER_TIMEOUT_MS, 70000),
    maxTokens = readNumber(process.env.OPENROUTER_MAX_TOKENS, 1800),
    temperature = readNumber(process.env.OPENROUTER_TEMPERATURE, 0),
    topP = readNumber(process.env.OPENROUTER_TOP_P, 0.1),
    responseFormatMode = readResponseFormat(process.env.OPENROUTER_RESPONSE_FORMAT)
  ) {
    super(
      baseUrl,
      model,
      timeoutMs,
      maxTokens,
      temperature,
      topP,
      responseFormatMode !== "none",
      process.env.OPENROUTER_REASONING_EFFORT,
      responseFormatMode,
      "OpenRouter",
      process.env.OPENROUTER_API_KEY?.trim(),
      buildAttributionHeaders(),
      buildProviderPreferences(responseFormatMode)
    );
  }
}
