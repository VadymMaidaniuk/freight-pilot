import type { RFQExtraction } from "@/lib/ai";

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
  if (lower.includes("coffee")) return "Green coffee beans";
  if (lower.includes("electronics")) return "Electronics";
  if (lower.includes("automotive")) return "Automotive spare parts";
  if (lower.includes("temperature") || lower.includes("reefer")) return "Temperature-controlled products";

  const cargoMatch = rawText.match(/cargo(?: is|:)?\s*([^.。\n]+)/i) ?? rawText.match(/for\s+([a-z][a-z\s-]{4,50})(?:\.|,|\n|$)/i);
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
    lower.includes("dangerous") || lower.includes(" dg ") ? "dangerous_goods" : null,
    lower.includes("temperature") ? "temperature_controlled" : null,
    lower.includes("reefer") ? "reefer" : null,
    lower.includes("out of gauge") ? "out_of_gauge" : null,
    lower.includes("special handling") ? "special_handling" : null
  ].filter(Boolean) as RFQExtraction["fields"]["cargoFlags"];

  const assertions: RFQExtraction["assertions"] = [
    {
      fieldName: "origin_port",
      value: origin?.port ?? null,
      verificationStatus: origin ? "Confirmed" : "Missing",
      confidence: origin ? "High" : "Low",
      evidence: origin ? `Detected ${origin.city} in ${sourceType} input.` : "No supported origin port detected."
    },
    {
      fieldName: "destination_port",
      value: destination?.port ?? null,
      verificationStatus: destination ? "Confirmed" : "Missing",
      confidence: destination ? "High" : "Low",
      evidence: destination ? `Detected ${destination.city} in ${sourceType} input.` : "No supported destination port detected."
    },
    {
      fieldName: "container_quantity",
      value: containers.quantity ? String(containers.quantity) : null,
      verificationStatus: containers.quantity ? "Confirmed" : "Missing",
      confidence: containers.quantity ? "High" : "Low",
      evidence: containers.quantity ? `${containers.quantity} x ${containers.type}` : "No container quantity detected."
    },
    {
      fieldName: "container_type",
      value: containers.type,
      verificationStatus: containers.type ? "Confirmed" : "Missing",
      confidence: containers.type ? "High" : "Low",
      evidence: containers.type ? `${containers.quantity} x ${containers.type}` : "No container type detected."
    },
    {
      fieldName: "cargo_description",
      value: cargoDescription,
      verificationStatus: cargoDescription ? "Confirmed" : "Missing",
      confidence: cargoDescription ? "Medium" : "Low",
      evidence: cargoDescription ? `Detected cargo: ${cargoDescription}.` : "No cargo description detected."
    },
    {
      fieldName: "incoterms",
      value: incoterms,
      verificationStatus: incoterms ? "Confirmed" : "Missing",
      confidence: incoterms ? "High" : "Low",
      evidence: incoterms ? `Detected Incoterm ${incoterms}.` : "No Incoterm detected."
    }
  ];

  const missingFields = assertions.filter((assertion) => assertion.verificationStatus === "Missing").map((assertion) => assertion.fieldName);
  if (!lower.includes("ready") && !lower.includes("next month") && !lower.includes("next week")) {
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
      cargoReadyDate: lower.includes("next week") ? "Next week" : lower.includes("next month") ? "Next month" : null,
      quotationDeadline: lower.includes("tomorrow") ? "Tomorrow" : lower.includes("friday") ? "Friday" : null,
      specialRequirements: cargoFlags.length > 0 ? cargoFlags.map((flag) => flag.replaceAll("_", " ")).join(", ") : null,
      cargoFlags
    },
    assertions,
    missingFields,
    riskFlags: missingFields.map((field) => `${field}_missing`),
    clarificationDraft: `Please confirm ${missingFields.length > 0 ? missingFields.join(", ") : "any optional preferences"} before final customer quote preparation.`
  };
}
