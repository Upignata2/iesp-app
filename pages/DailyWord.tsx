import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";

export default function DailyWord() {
  const { data: latest, isLoading } = trpc.dailyWord.getLatest.useQuery();
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4 text-black">Palavra do Dia</h1>
      {isLoading && <div className="text-sm opacity-70">Carregando...</div>}
      {latest ? (
        <Card className="p-4 bg-white border border-neutral-300 rounded-xl">
          <div className="text-xs text-neutral-600 mb-1">{latest.date}</div>
          <div className="text-black font-semibold">{latest.title}</div>
          {latest.reference && <div className="text-xs text-neutral-600 mt-1">{latest.reference}</div>}
          <div className="text-sm text-neutral-700 mt-3 whitespace-pre-line">{latest.content}</div>
        </Card>
      ) : (
        !isLoading && <div className="text-sm opacity-70">Nenhuma palavra cadastrada.</div>
      )}
    </div>
  );
}
