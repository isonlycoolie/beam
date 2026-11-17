"use client";

import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@beam/ui/components/combobox";

const COUNTRIES = ["Kenya", "Tanzania", "Uganda", "United States"];

export default function ComboboxDefault() {
  return (
    <Combobox items={COUNTRIES}>
      <ComboboxInput placeholder="Country" aria-label="Country" className="w-[260px]" />
      <ComboboxContent>
        <ComboboxEmpty>No country found.</ComboboxEmpty>
        <ComboboxList>
          {(country: string) => (
            <ComboboxItem key={country} value={country}>
              {country}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
