import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";

export default function News() {
  const { data: items, isLoading } = trpc.news.list.useQuery({ limit: 50 });
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4 text-black">Notícias</h1>
      {isLoading && <div className="text-sm opacity-70">Carregando...</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(items || []).map((n: any) => (
          <Card key={n.id} className="p-4 bg-white border border-neutral-300 rounded-xl">
            {n.imageUrl && (
              <img src={n.imageUrl} alt={n.title} className="w-full h-40 object-cover rounded-lg mb-3" />
            )}
            <div className="text-black font-semibold">{n.title}</div>
            {n.description && <div className="text-sm text-neutral-600 mt-1">{n.description}</div>}
          </Card>
        ))}
        {(!items || items.length === 0) && !isLoading && (
          <div className="col-span-full text-sm opacity-70">Nenhuma notícia encontrada.</div>
        )}
      </div>
    </div>
  );
}
