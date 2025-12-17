import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";

export default function PrayerReasons() {
  const { data: items, isLoading } = trpc.prayerReasons.list.useQuery({ limit: 50 });
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4 text-black">Motivos de Oração</h1>
      {isLoading && <div className="text-sm opacity-70">Carregando...</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(items || []).map((p: any) => (
          <Card key={p.id} className="p-4 bg-white border border-neutral-300 rounded-xl">
            <div className="text-black font-semibold">{p.title}</div>
            <div className="text-xs text-neutral-600 mt-1">Prioridade: {p.priority}</div>
            <div className="text-sm text-neutral-700 mt-2">{p.description}</div>
          </Card>
        ))}
        {(!items || items.length === 0) && !isLoading && (
          <div className="col-span-full text-sm opacity-70">Nenhum motivo encontrado.</div>
        )}
      </div>
    </div>
  );
}
