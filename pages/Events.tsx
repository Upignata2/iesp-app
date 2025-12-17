import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";

function formatDate(d: string | Date | null | undefined) {
  try {
    const date = typeof d === "string" ? new Date(d) : d;
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  } catch { return ""; }
}

export default function Events() {
  const { data: items, isLoading } = trpc.events.list.useQuery({ limit: 50 });
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4 text-black">Eventos</h1>
      {isLoading && <div className="text-sm opacity-70">Carregando...</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(items || []).map((e: any) => (
          <Card key={e.id} className="p-4 bg-white border border-neutral-300 rounded-xl">
            {e.imageUrl && (
              <img src={e.imageUrl} alt={e.title} className="w-full h-40 object-cover rounded-lg mb-3" />
            )}
            <div className="text-black font-semibold">{e.title}</div>
            {e.location && <div className="text-xs text-neutral-600 mt-1">Local: {e.location}</div>}
            <div className="text-xs text-neutral-600 mt-1">
              Início: {formatDate(e.startDate)} {e.endDate ? `• Fim: ${formatDate(e.endDate)}` : ""}
            </div>
            {e.description && <div className="text-sm text-neutral-600 mt-2">{e.description}</div>}
          </Card>
        ))}
        {(!items || items.length === 0) && !isLoading && (
          <div className="col-span-full text-sm opacity-70">Nenhum evento encontrado.</div>
        )}
      </div>
    </div>
  );
}
