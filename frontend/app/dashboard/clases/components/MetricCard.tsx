//frontend/app/dashboard/clases/components/MetricCard.tsx
export default function MetricCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="bg-[#EED9C4] p-4 rounded-xl shadow">
      <p className="text-sm text-[#6B3E26]">{label}</p>
      <p className="text-2xl font-bold text-[#4B2E1E]">
        {value}
      </p>
    </div>
  );
}
