"use client";

import Link from "next/link";
import type { ChangeEvent } from "react";
import { countryLabel } from "@/lib/labels";

const serviceOptions = [
  { value: "ocean_fcl", label: "Морской FCL" },
  { value: "reefer", label: "Рефгруз" },
  { value: "origin_handling", label: "Обработка в порту отправления" }
];

type AgentFiltersProps = {
  countries: string[];
  country: string;
  service: string;
};

export function AgentFilters({ countries, country, service }: AgentFiltersProps) {
  function submitOnChange(event: ChangeEvent<HTMLSelectElement>) {
    event.currentTarget.form?.requestSubmit();
  }

  return (
    <form className="flex flex-wrap gap-2" method="get">
      <select
        name="country"
        defaultValue={country}
        onChange={submitOnChange}
        className="h-10 rounded-md border border-border-hairline bg-white px-3 text-sm outline-none"
      >
        <option value="">Все страны</option>
        {countries.map((item) => (
          <option key={item} value={item}>
            {countryLabel(item)}
          </option>
        ))}
      </select>
      <select
        name="service"
        defaultValue={service}
        onChange={submitOnChange}
        className="h-10 rounded-md border border-border-hairline bg-white px-3 text-sm outline-none"
      >
        <option value="">Все сервисы</option>
        {serviceOptions.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <Link
        href="/workspace/agents"
        className="inline-flex h-10 items-center justify-center rounded-md border border-border-hairline bg-white px-4 text-sm font-semibold text-on-surface transition hover:bg-surface-container-low"
      >
        Сбросить
      </Link>
    </form>
  );
}
