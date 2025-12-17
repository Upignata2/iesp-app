import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
 import { Input } from "@/components/ui/input";
 import { listGalleryFiles } from "@/_core/supabase";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type GalleryItem = {
  id: number;
  title: string;
  description?: string | null;
  mediaUrl: string;
  mediaType: "image" | "video";
  eventId?: number | null;
};

type GroupedGallery = {
  title: string;
  items: GalleryItem[];
  thumbnail?: GalleryItem;
  description?: string | null;
};

export default function Gallery() {
  const { user, initialized, isAuthenticated } = useAuth();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<GroupedGallery | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventId, setEventId] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const fileRef = useRef<HTMLInputElement | null>(null);

  const canAdmin = useMemo(() => isAuthenticated && user?.role === "admin", [isAuthenticated, user]);

  // Agrupar itens por título (evento)
  const groupedItems = useMemo(() => {
    const byKey: Record<string, GalleryItem[]> = {};
    items.forEach((item) => {
      const key = item.eventId ? `event:${item.eventId}` : (item.title || "Sem título");
      if (!byKey[key]) byKey[key] = [];
      byKey[key].push(item);
    });
    return Object.entries(byKey).map(([key, groupItems]) => {
      const any = groupItems[0];
      const title = any.eventId ? (any.title || `Evento ${any.eventId}`) : (any.title || "Sem título");
      return {
        title,
        items: groupItems,
        thumbnail: groupItems.find((it) => it.mediaType === "image") || groupItems[0],
        description: any.description || null,
      } as GroupedGallery;
    });
  }, [items]);

  

  async function refreshList() {
    setLoading(true);
    try {
      let list: any[] = [];
      try {
        const res = await fetch(`/api/gallery?limit=100`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          list = Array.isArray(data?.result) ? data.result : data?.result ? [data.result] : [];
        }
      } catch {}
      if (!list.length) {
        const files = await listGalleryFiles('gallery');
        if (files.length) {
          list = files.map((f, idx) => ({
            id: idx + 1,
            title: f.name.replace(/\.[^.]+$/, ''),
            description: null,
            mediaUrl: f.publicUrl,
            mediaType: f.mediaType,
            eventId: null,
          }));
        }
      }
      if (!list.length) {
        try {
          const res2 = await fetch(`/api/admin/content?type=gallery&limit=100`, { credentials: "include" });
          if (res2.ok) {
            const data2 = await res2.json();
            list = Array.isArray(data2?.result) ? data2.result : data2?.result ? [data2.result] : [];
          }
        } catch {}
      }
      setItems((list || []) as GalleryItem[]);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialized) {
      refreshList();
    }
  }, [initialized]);

  function validate(): string | null {
    if (!title.trim()) return "Título é obrigatório";
    if (!mediaUrl.trim()) return "Selecione uma mídia";
    return null;
  }

  async function publish() {
    setMsg("");
    const error = validate();
    if (error) {
      setMsg(error);
      return;
    }
    setLoading(true);
    try {
      const payload = {
        title,
        description: description || null,
        mediaUrl,
        mediaType,
        eventId: eventId ? Number(eventId) : null,
      };
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ type: "gallery", data: payload }),
      });
      const data = await res.json();
      setMsg(data?.success ? "Mídia publicada." : "Erro: " + (data?.error || "falha"));
      if (data?.success) {
        setTitle("");
        setDescription("");
        setEventId("");
        setMediaUrl("");
        setMediaType("image");
        refreshList();
      }
    } catch {
      setMsg("Erro ao publicar");
    } finally {
      setLoading(false);
    }
  }

  async function deleteItem(id: number) {
    setMsg("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ type: "gallery", id }),
      });
      const data = await res.json();
      setMsg(data?.success ? "Item excluído." : "Erro: " + (data?.error || "falha"));
      if (data?.success) {
        refreshList();
        setSelectedGroup(null);
      }
    } catch {
      setMsg("Erro ao excluir");
    } finally {
      setLoading(false);
    }
  }

  const currentMedia = selectedGroup?.items[currentIndex];

  return (
    <div className="min-h-screen pb-24 bg-white text-black">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 text-black text-center">Galeria</h1>



        {/* Galeria Pública - Cards por Evento */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 text-black">Eventos</h2>
          {loading && <div className="text-sm opacity-70">Carregando...</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {groupedItems.map((group, idx) => (
              <Card
                key={idx}
                className="bg-white border border-neutral-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedGroup(group);
                  setCurrentIndex(0);
                }}
              >
                <div className="relative h-36 bg-neutral-100">
                  {group.thumbnail ? (
                    group.thumbnail.mediaType === "image" ? (
                      <img
                        src={group.thumbnail.mediaUrl}
                        alt={group.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-neutral-200">
                        <div className="text-center">
                          <div className="text-3xl mb-2">🎥</div>
                          <div className="text-xs text-neutral-600">Vídeo</div>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-200">
                      <div className="text-neutral-400">Sem mídia</div>
                    </div>
                  )}
                  <div className="absolute top-1 right-1 bg-black bg-opacity-70 text-white px-2 py-0.5 rounded text-[10px]">
                    {group.items.length} {group.items.length === 1 ? "item" : "itens"}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-black text-sm mb-1 line-clamp-1">{group.title}</h3>
                  {group.description ? (
                    <p className="text-xs text-neutral-600 line-clamp-2">{group.description}</p>
                  ) : (
                    <p className="text-[11px] text-neutral-500">Clique para visualizar</p>
                  )}
                </div>
              </Card>
            ))}
            {groupedItems.length === 0 && !loading && (
              <div className="col-span-full text-center text-sm opacity-70 py-8">
                Nenhum evento encontrado.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Lightbox */}
      {selectedGroup && currentMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            {/* Fechar */}
            <button
              onClick={() => setSelectedGroup(null)}
              className="absolute -top-10 right-0 text-white hover:text-neutral-300 transition"
            >
              <X size={32} />
            </button>

            {/* Título */}
            <div className="text-white text-center mb-4">
              <h2 className="text-2xl font-bold">{selectedGroup.title}</h2>
              <p className="text-sm text-neutral-400">
                {currentIndex + 1} de {selectedGroup.items.length}
              </p>
            </div>

            {/* Mídia */}
            <div className="relative bg-black rounded-lg overflow-hidden mb-4">
              {currentMedia.mediaType === "image" ? (
                <img
                  src={currentMedia.mediaUrl}
                  alt={currentMedia.title}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              ) : (
                <video
                  src={currentMedia.mediaUrl}
                  controls
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              )}
            </div>

            {/* Descrição */}
            {currentMedia.description && (
              <div className="text-white text-center mb-4 text-sm">
                {currentMedia.description}
              </div>
            )}

            {/* Navegação */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="text-white hover:text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={40} />
              </button>

              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto px-4 flex-1 justify-center">
                {selectedGroup.items.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded border-2 transition ${
                      idx === currentIndex ? "border-white" : "border-neutral-600"
                    }`}
                  >
                    {item.mediaType === "image" ? (
                      <img
                        src={item.mediaUrl}
                        alt={item.title}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-neutral-700 rounded">
                        <div className="text-white text-xs">🎥</div>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentIndex(Math.min(selectedGroup.items.length - 1, currentIndex + 1))
                }
                disabled={currentIndex === selectedGroup.items.length - 1}
                className="text-white hover:text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={40} />
              </button>
            </div>

            {/* Botão Excluir (Admin) */}
            {canAdmin && (
              <div className="mt-4 flex justify-center">
                <Button
                  variant="outline"
                  className="bg-red-600 hover:bg-red-700 text-white border-red-700 rounded-xl"
                  onClick={() => deleteItem(currentMedia.id)}
                >
                  Excluir Mídia
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
