import type { RFQExtraction } from "@/lib/ai";
import { fieldLabel } from "@/lib/labels";

const knownPorts = [
  { city: "Ningbo", port: "Ningbo", country: "China" },
  { city: "Shanghai", port: "Shanghai", country: "China" },
  { city: "Shenzhen", port: "Shenzhen", country: "China" },
  { city: "Valparaiso", port: "Valparaiso", country: "Chile" },
  { city: "Valparaíso", port: "Valparaiso", country: "Chile" },
  { city: "San Antonio", port: "San Antonio", country: "Chile" },
  { city: "Durban", port: "Durban", country: "South Africa" },
  { city: "Cape Town", port: "Cape Town", country: "South Africa" },
  { city: "Gdansk", port: "Gdansk", country: "Poland" },
  { city: "Gdańsk", port: "Gdansk", country: "Poland" },
  { city: "Hamburg", port: "Hamburg", country: "Germany" },
  { city: "Constanta", port: "Constanta", country: "Romania" },
  { city: "Constanța", port: "Constanta", country: "Romania" }
];

function findPorts(rawText: string) {
  const normalized = rawText.toLowerCase();
  return knownPorts.filter((port) => normalized.includes(port.city.toLowerCase()) || normalized.includes(port.port.toLowerCase()));
}

function findContainers(rawText: string) {
  const match = rawText.match(/(\d+)\s*x\s*(20DC|40HC|40DC|20GP|40GP|20'|40')/i);
  if (!match) return { quantity: null, type: null };

  const type = match[2].replace("'", "").toUpperCase();
  return {
    quantity: Number(match[1]),
    type: type === "20" ? "20DC" : type === "40" ? "40HC" : type
  };
}

function findCargo(rawText: string) {
  const lower = rawText.toLowerCase();
  if (lower.includes("coffee") || lower.includes("кофе")) return "Зеленые кофейные зерна";
  if (lower.includes("electronics") || lower.includes("электрон")) return "Электроника";
  if (lower.includes("automotive") || lower.includes("авто")) return "Автозапчасти";
  if (lower.includes("temperature") || lower.includes("температур") || lower.includes("reefer") || lower.includes("реф")) return "Температурный груз";

  const cargoMatch =
    rawText.match(/cargo(?: is|:)?\s*([^.。\n]+)/i) ??
    rawText.match(/груз(?:\s*[-:]|\s+это)?\s*([^.。\n]+)/i) ??
    rawText.match(/for\s+([a-z][a-z\s-]{4,50})(?:\.|,|\n|$)/i);
  return cargoMatch?.[1]?.trim() ?? null;
}

function findIncoterms(rawText: string) {
  const match = rawText.match(/\b(EXW|FCA|FOB|CFR|CIF|DAP|DPU|DDP)\b/i);
  return match?.[1]?.toUpperCase() ?? null;
}

export function heuristicExtractRFQ(sourceType: "email" | "conversation" | "call_notes", rawText: string): RFQExtraction {
  const ports = findPorts(rawText);
  const origin = ports[0];
  const destination = ports[1];
  const containers = findContainers(rawText);
  const incoterms = findIncoterms(rawText);
  const cargoDescription = findCargo(rawText);
  const lower = rawText.toLowerCase();
  const cargoFlags = [
    lower.includes("dangerous") || lower.includes("опасн") || lower.includes(" dg ") ? "dangerous_goods" : null,
    lower.includes("temperature") || lower.includes("температур") ? "temperature_controlled" : null,
    lower.includes("reefer") || lower.includes("реф") ? "reefer" : null,
    lower.includes("out of gauge") ? "out_of_gauge" : null,
    lower.includes("special handling") || lower.includes("спецобработ") ? "special_handling" : null
  ].filter(Boolean) as RFQExtraction["fields"]["cargoFlags"];

  const hasNextWeek = lower.includes("next week") || lower.includes("следующей недел") || lower.includes("следующую недел");
  const hasNextMonth = lower.includes("next month") || lower.includes("следующем месяц") || lower.includes("следующий месяц");
  const hasTomorrow = lower.includes("tomorrow") || lower.includes("завтра");
  const hasFriday = lower.includes("friday") || lower.includes("пятниц");

  const assertions: RFQExtraction["assertions"] = [
    {
      fieldName: "origin_port",
      value: origin?.port ?? null,
      verificationStatus: origin ? "Confirmed" : "Missing",
      confidence: origin ? "High" : "Low",
      evidence: origin ? `Найден ${origin.city} во входном тексте (${sourceType}).` : "Поддерживаемый порт отправления не найден."
    },
    {
      fieldName: "destination_port",
      value: destination?.port ?? null,
      verificationStatus: destination ? "Confirmed" : "Missing",
      confidence: destination ? "High" : "Low",
      evidence: destination ? `Найден ${destination.city} во входном тексте (${sourceType}).` : "Поддерживаемый порт назначения не найден."
    },
    {
      fieldName: "container_quantity",
      value: containers.quantity ? String(containers.quantity) : null,
      verificationStatus: containers.quantity ? "Confirmed" : "Missing",
      confidence: containers.quantity ? "High" : "Low",
      evidence: containers.quantity ? `${containers.quantity} x ${containers.type}` : "Количество контейнеров не найдено."
    },
    {
      fieldName: "container_type",
      value: containers.type,
      verificationStatus: containers.type ? "Confirmed" : "Missing",
      confidence: containers.type ? "High" : "Low",
      evidence: containers.type ? `${containers.quantity} x ${containers.type}` : "Тип контейнера не найден."
    },
    {
      fieldName: "cargo_description",
      value: cargoDescription,
      verificationStatus: cargoDescription ? "Confirmed" : "Missing",
      confidence: cargoDescription ? "Medium" : "Low",
      evidence: cargoDescription ? `Найден груз: ${cargoDescription}.` : "Описание груза не найдено."
    },
    {
      fieldName: "incoterms",
      value: incoterms,
      verificationStatus: incoterms ? "Confirmed" : "Missing",
      confidence: incoterms ? "High" : "Low",
      evidence: incoterms ? `Найден Incoterm ${incoterms}.` : "Incoterm не найден."
    }
  ];

  const missingFields = assertions.filter((assertion) => assertion.verificationStatus === "Missing").map((assertion) => assertion.fieldName);
  if (!lower.includes("ready") && !lower.includes("готов") && !hasNextMonth && !hasNextWeek) {
    missingFields.push("cargo_ready_date");
  }

  return {
    fields: {
      incoterms,
      originCountry: origin?.country ?? null,
      originCity: origin?.city.replace("Valparaíso", "Valparaiso").replace("Gdańsk", "Gdansk").replace("Constanța", "Constanta") ?? null,
      originPort: origin?.port ?? null,
      destinationCountry: destination?.country ?? null,
      destinationCity: destination?.city.replace("Valparaíso", "Valparaiso").replace("Gdańsk", "Gdansk").replace("Constanța", "Constanta") ?? null,
      destinationPort: destination?.port ?? null,
      containerType: containers.type,
      containerQuantity: containers.quantity,
      cargoDescription,
      packaging: null,
      grossWeight: null,
      volume: null,
      cargoReadyDate: hasNextWeek ? "На следующей неделе" : hasNextMonth ? "В следующем месяце" : null,
      quotationDeadline: hasTomorrow ? "Завтра" : hasFriday ? "Пятница" : null,
      specialRequirements: cargoFlags.length > 0 ? cargoFlags.map(fieldLabel).join(", ") : null,
      cargoFlags
    },
    assertions,
    missingFields,
    riskFlags: missingFields.map((field) => `${field}_missing`),
    clarificationDraft: `Пожалуйста, подтвердите ${missingFields.length > 0 ? missingFields.map(fieldLabel).join(", ") : "дополнительные пожелания"} до подготовки финальной котировки для клиента.`
  };
}
