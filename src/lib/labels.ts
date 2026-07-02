import type { CaseStatus, ConfidenceLevel, RateOption, SourceType, VerificationStatus } from "@/lib/types";

export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  email: "Письмо",
  conversation: "Чат",
  call_notes: "Заметки звонка",
  manual_paste: "Ручная вставка"
};

export const CASE_STATUS_LABELS: Record<CaseStatus, string> = {
  draft: "Черновик",
  clarification_required: "Нужно уточнение",
  ready_for_routing: "Готово к маршрутизации",
  approval_pending: "Ожидает согласования",
  collecting: "Сбор ставок",
  decision_ready: "Готово к решению",
  quote_draft_created: "Черновик котировки создан",
  closed: "Закрыто",
  manual_review: "Ручная проверка"
};

export const RATE_STATUS_LABELS: Record<RateOption["status"], string> = {
  Recommended: "Рекомендовано",
  Comparable: "Сопоставимо",
  Incomplete: "Неполная ставка",
  "Needs review": "Требует проверки",
  "Late response": "Поздний ответ",
  "Not selected": "Не выбрано"
};

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  Confirmed: "Подтверждено",
  "Needs confirmation": "Нужно подтверждение",
  Missing: "Нет данных",
  "Conflict detected": "Найден конфликт"
};

export const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  High: "Высокая",
  Medium: "Средняя",
  Low: "Низкая"
};

export const FIELD_LABELS: Record<string, string> = {
  origin_port: "Порт отправления",
  destination_port: "Порт назначения",
  container_quantity: "Кол-во контейнеров",
  container_type: "Тип контейнера",
  cargo_description: "Груз",
  cargo_ready_date: "Готовность груза",
  gross_weight: "Вес брутто",
  incoterms: "Incoterms",
  temperature_range: "Температурный диапазон",
  reefer_container_type: "Тип рефконтейнера",
  ventilation_requirements: "Вентиляция"
};

export const COUNTRY_LABELS: Record<string, string> = {
  Chile: "Чили",
  China: "Китай",
  Germany: "Германия",
  Poland: "Польша",
  Romania: "Румыния",
  "South Africa": "ЮАР"
};

export const AGENT_STATUS_LABELS: Record<string, string> = {
  active: "Активен",
  inactive: "Неактивен"
};

export const SERVICE_LABELS: Record<string, string> = {
  ocean_fcl: "Морской FCL",
  origin_handling: "Обработка в порту отправления",
  customs_coordination: "Координация таможни",
  reefer: "Рефгруз",
  special_handling: "Спецобработка"
};

export const CAPABILITY_LABELS: Record<string, string> = {
  agricultural: "Сельхозгрузы",
  automotive: "Автозапчасти",
  coffee: "Кофе",
  dry_cargo: "Сухой груз",
  electronics: "Электроника",
  food_grade: "Пищевые грузы",
  general_cargo: "Генеральные грузы",
  industrial: "Промышленные грузы",
  pharma: "Фарма",
  reefer: "Рефгруз",
  special_handling: "Спецобработка",
  temperature_controlled: "Температурный режим"
};

export function sourceTypeLabel(sourceType: SourceType | string) {
  return SOURCE_TYPE_LABELS[sourceType as SourceType] ?? sourceType.replaceAll("_", " ");
}

export function caseStatusLabel(status: CaseStatus) {
  return CASE_STATUS_LABELS[status];
}

export function rateStatusLabel(status: RateOption["status"]) {
  return RATE_STATUS_LABELS[status];
}

export function verificationStatusLabel(status: VerificationStatus) {
  return VERIFICATION_STATUS_LABELS[status];
}

export function fieldLabel(fieldName: string) {
  return FIELD_LABELS[fieldName] ?? fieldName.replaceAll("_", " ");
}

export function countryLabel(country: string) {
  return COUNTRY_LABELS[country] ?? country;
}

export function agentStatusLabel(status: string) {
  return AGENT_STATUS_LABELS[status] ?? status;
}

export function serviceLabel(service: string) {
  return SERVICE_LABELS[service] ?? service.replaceAll("_", " ");
}

export function capabilityLabel(tag: string) {
  return CAPABILITY_LABELS[tag] ?? tag.replaceAll("_", " ");
}
