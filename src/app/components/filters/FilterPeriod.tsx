// components/filters/FilterPeriod.tsx - CORRIGIDO
import { Input } from "@/components/ui/input";

type FilterPeriodProps = {
  value: { month: number; year: number };
  onChange: (month: number, year: number) => void;
};

export default function FilterPeriod({ value, onChange }: FilterPeriodProps) {
  const inputValue = `${value.year}-${String(value.month).padStart(2, "0")}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value; // "YYYY-MM"
    if (!dateValue) return;

    const [yearStr, monthStr] = dateValue.split("-");
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);

    if (!isNaN(year) && !isNaN(month) && month >= 1 && month <= 12) {
      onChange(month, year);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <label className="text-sm font-medium mb-1">Período</label>
      <Input
        type="month"
        value={inputValue}
        onChange={handleChange}
        className="w-full"
      />
    </div>
  );
}
