"use client";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  filters: {
    label: string;
    key: string;
    options: FilterOption[];
    value: string;
  }[];
  onChange: (key: string, value: string) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {filters.map((filter) => (
        <div key={filter.key} className="flex items-center gap-2">
          <label htmlFor={filter.key} className="text-sm font-medium text-[#8b949e]">
            {filter.label}
          </label>
          <select
            id={filter.key}
            value={filter.value}
            onChange={(e) => onChange(filter.key, e.target.value)}
            className="rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] px-3 py-1.5 text-sm text-[#f0f0f0] outline-none transition-colors focus:border-[rgba(255,107,53,0.4)] focus:ring-1 focus:ring-[rgba(255,107,53,0.2)]"
          >
            <option value="" className="bg-[#1a1a2e]">
              すべて
            </option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#1a1a2e]">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
