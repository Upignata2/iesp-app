import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { uploadFile } from "@/_core/supabase";
import { useEffect, useMemo, useRef, useState } from "react";

type GalleryItem = {
  id: number;
  title: string;
  description?: string | null;
  mediaUrl: string;
  mediaType: "image" | "video";
  eventId?: number | null;
};

export default function Gallery() {
  const { user, initialized, isAuthenticated } = useAuth();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventId, setEventId] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const fileRef = useRef<HTMLInputElement | null>(null);

  const canAdmin = useMemo(() => isAuthenticated && user?.role === "admin", [isAuthenticated, user]);

  async function handleFileUpload(file: File): Promise<string> {
    try {
      const url = await uploadFile(file, 'gallery');
      return url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  async function refreshList() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/content?type=gallery&limit=50`, { credentials: "include" });
      const data = await res.json();
      const list = Array.isArray(data?.result) ? data.result : (data?.result ? [data.result] : []);
      setItems(list as GalleryItem[]);
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
    if (error) { setMsg(error); return; }
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
      if (data?.success) refreshList();
    } catch {
      setMsg("Erro ao excluir");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pb-24 bg-white text-black">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 text-black text-center">Galeria</h1>

        {canAdmin && (
          <Card className="p-6 bg-white border border-neutral-300 text-black rounded-2xl shadow-sm mb-6">
            <h2 className="font-bold mb-4">Adicionar Mídia</h2>
            <div className="space-y-3">
              <Input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-white border-neutral-300 text-black rounded-xl" />
              <Input placeholder="Descrição (opcional)" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-white border-neutral-300 text-black rounded-xl" />
              <div className="flex items-center gap-2">
                <select value={mediaType} onChange={(e) => setMediaType(e.target.value as any)} className="bg-white border-neutral-300 text-black rounded-xl p-2">
                  <option value="image">Imagem</option>
                  <option value="video">Vídeo</option>
                </select>
                <Input placeholder="ID do Evento (opcional)" value={eventId} onChange={(e) => setEventId(e.target.value)} className="bg-white border-neutral-300 text-black rounded-xl" />
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*,video/*"
                capture="environment"
                multiple
                className="hidden"
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length > 0) {
                    const f = files[0];
                    try {
                      setLoading(true);
                      const url = await handleFileUpload(f);
                      setMediaUrl(url);
                      setMediaType(f.type.startsWith("video") ? "video" : "image");
                      setMsg("Arquivo enviado com sucesso!");
                    } catch (error) {
                      setMsg("Erro ao enviar arquivo: " + String(error));
                    } finally {
                      setLoading(false);
                    }
                  }
                }}
              />
              <Button type="button" variant="outline" className="bg-white hover:bg-neutral-100 text-black border border-neutral-300 rounded-xl" onClick={() => fileRef.current?.click()}>
                Escolher arquivo
              </Button>
              <Button disabled={loading} variant="outline" className="w-full bg-white hover:bg-neutral-100 text-black border border-neutral-300 rounded-xl" onClick={publish}>
                {loading ? "Publicando..." : "Publicar"}
              </Button>
            </div>
            {msg && <div className="mt-3 text-sm">{msg}</div>}
          </Card>
        )}

        <Card className="p-6 bg-white border border-neutral-300 text-black rounded-2xl shadow-sm">
          <h2 className="font-bold mb-4">Itens</h2>
          {loading && <div className="text-sm opacity-70">Carregando...</div>}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((it) => (
              <div key={it.id} className="bg-white border border-neutral-300 rounded-xl p-3">
                <div className="text-sm font-semibold mb-2 text-black">{it.title}</div>
                {it.mediaType === "image" ? (
                  <img src={it.mediaUrl} alt={it.title} className="w-full h-40 object-cover rounded-lg" />
                ) : (
                  <video src={it.mediaUrl} controls className="w-full h-40 rounded-lg" />
                )}
                {canAdmin && (
                  <div className="mt-2">
                    <Button variant="outline" className="bg-white hover:bg-neutral-100 text-black border border-neutral-300 rounded-xl w-full" onClick={() => deleteItem(it.id)}>
                      Excluir
                    </Button>
                  </div>
                )}
              </div>
            ))}
            {items.length === 0 && !loading && <div className="text-sm opacity-70">Nenhum item encontrado.</div>}
          </div>
        </Card>
      </div>
    </div>
  );
}
