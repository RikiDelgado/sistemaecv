//frontend/app/dashboard/profesores/components/ProfesorStats.tsx
export default function ProfesorStats({
  total,
  activos,
  clases,
}: {
  total: number;
  activos: number;
  clases: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard titulo="Total Profesores" valor={total} />
      <StatCard titulo="Activos" valor={activos} />
      <StatCard titulo="Clases" valor={clases} />
    </div>
  );
}

function StatCard({ titulo, valor }: any) {
  return (
    <div className="bg-[#f1ddbf] p-4 rounded-xl shadow">
      <p className="text-sm text-gray-600">{titulo}</p>
      <p className="text-2xl font-bold">{valor}</p>
    </div>
  );
}
