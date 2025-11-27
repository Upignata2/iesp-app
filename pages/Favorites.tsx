import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

export default function Favorites() {
  const { data: favorites } = trpc.favorites.list.useQuery();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Favoritos</h1>
      <div className="grid gap-4">
        {(favorites || []).map((fav: any) => (
          <Card key={`${fav.contentType}-${fav.contentId}`} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{fav.contentType}</div>
                <div className="text-sm text-muted-foreground">ID: {fav.contentId}</div>
              </div>
              <Button variant="secondary" size="sm">Abrir</Button>
            </div>
          </Card>
        ))}
        {(!favorites || favorites.length === 0) && (
          <Card className="p-6 text-center text-muted-foreground">Nenhum favorito ainda</Card>
        )}
      </div>
    </div>
  );
}