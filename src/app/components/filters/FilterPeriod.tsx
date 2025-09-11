// components/filters/FilterPeriod.tsx - BASEADO EM monthReference / yearReference
import { Input } from "@/components/ui/input";

type FilterPeriodProps = {
  value: { monthReference: number; yearReference: number };
  onChange: (month: number, year: number) => void;
};

export default function FilterPeriod({ value, onChange }: FilterPeriodProps) {
  const inputValue = `${value.yearReference}-${String(
    value.monthReference
  ).padStart(2, "0")}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const period = e.target.value; // "YYYY-MM"
    if (!period) return;

    const [yearStr, monthStr] = period.split("-");
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);

    if (!isNaN(year) && !isNaN(month) && month >= 1 && month <= 12) {
      onChange(month, year);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <label className="text-sm font-medium mb-1">Período (Fatura)</label>
      <Input
        type="month"
        value={inputValue}
        onChange={handleChange}
        className="w-full"
      />
    </div>
  );
}
