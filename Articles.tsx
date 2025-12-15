import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import FavoriteButton from "@/components/FavoriteButton";

export default function Articles() {
  const [, navigate] = useLocation();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data: articles, isLoading } = trpc.articles.list.useQuery({ limit: 50 });
  const { data: article } = trpc.articles.getById.useQuery(
    { id: selectedId! },
    { enabled: selectedId !== null }
  );
  const { data: favorites } = trpc.favorites.list.useQuery();

  const isFavorited = favorites?.some(
    (fav) => fav.contentType === "article" && fav.contentId === selectedId
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  if (selectedId && article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => setSelectedId(null)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <article className="bg-[#D2D7DB] rounded-lg shadow-lg p-6">
          {article.imageUrl && (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-96 object-cover rounded-lg mb-6"
            />
          )}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
              {article.description && (
                <p className="text-lg text-muted-foreground mb-4">{article.description}</p>
              )}
            </div>
            <FavoriteButton
              contentType="article"
              contentId={article.id}
              isFavorited={isFavorited}
            />
          </div>
          <div className="prose max-w-none">
            {article.content}
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Artigos</h1>
      <div className="grid gap-4">
        {articles?.map((article) => {
          const isFav = favorites?.some(
            (fav) => fav.contentType === "article" && fav.contentId === article.id
          );
          return (
            <Card
              key={article.id}
              className="p-4 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setSelectedId(article.id)}
            >
              <div className="flex gap-4">
                {article.imageUrl && (
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{article.title}</h3>
                      {article.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {article.description}
                        </p>
                      )}
                    </div>
                    <FavoriteButton
                      contentType="article"
                      contentId={article.id}
                      isFavorited={isFav}
                    />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
