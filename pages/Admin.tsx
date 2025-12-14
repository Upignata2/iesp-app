import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";

type ContentType = "article" | "news" | "event" | "dailyWord" | "prayerReason" | "gallery";

export default function Admin() {
  const { user, initialized, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [type, setType] = useState<ContentType>("article");
  const [msg, setMsg] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [article, setArticle] = useState<any>({ title: "", description: "", content: "", imageUrl: "" });
  const [news, setNews] = useState<any>({ title: "", description: "", content: "", imageUrl: "" });
  const [eventData, setEventData] = useState<any>({ title: "", description: "", location: "", startDate: "", endDate: "", imageUrl: "" });
  const [dailyWord, setDailyWord] = useState<any>({ date: "", title: "", content: "", reference: "" });
  const [prayerReason, setPrayerReason] = useState<any>({ title: "", description: "", priority: "medium" });
  const [gallery, setGallery] = useState<any>({ title: "", description: "", mediaUrl: "", mediaType: "image", eventId: "" });

  const [roleEmail, setRoleEmail] = useState("");
  const [role, setRole] = useState("admin");

  useEffect(() => {
    if (initialized) {
      if (!isAuthenticated || user?.role !== "admin") navigate("/login");
    }
  }, [initialized, isAuthenticated, user, navigate]);

  const currentForm = useMemo(() => {
    if (type === "article") return article;
    if (type === "news") return news;
    if (type === "event") return eventData;
    if (type === "dailyWord") return dailyWord;
    if (type === "prayerReason") return prayerReason;
    return gallery;
  }, [type, article, news, eventData, dailyWord, prayerReason, gallery]);

  function setCurrentForm(next: any) {
    if (type === "article") setArticle(next);
    else if (type === "news") setNews(next);
    else if (type === "event") setEventData(next);
    else if (type === "dailyWord") setDailyWord(next);
    else if (type === "prayerReason") setPrayerReason(next);
    else setGallery(next);
  }

  async function refreshList() {
    try {
      const res = await fetch(`/api/admin/content?type=${type}&limit=50`, { credentials: "include" });
      const data = await res.json();
      setItems(Array.isArray(data?.result) ? data.result : (data?.result ? [data.result] : []));
    } catch {}
  }

  useEffect(() => {
    setSelectedId(null);
    refreshList();
  }, [type]);

  function loadItemToForm(item: any) {
    setSelectedId(item?.id || null);
    const base = { ...item };
    if (type === "event") {
      base.startDate = item?.startDate ? String(item.startDate).slice(0, 10) : "";
      base.endDate = item?.endDate ? String(item.endDate).slice(0, 10) : "";
    }
    setCurrentForm(base);
  }

  function validate(): string | null {
    if (type === "article" || type === "news") {
      if (!currentForm.title?.trim()) return "Título é obrigatório";
      if (!currentForm.content?.trim()) return "Conteúdo é obrigatório";
      return null;
    }
    if (type === "event") {
      if (!currentForm.title?.trim()) return "Título é obrigatório";
      if (!currentForm.location?.trim()) return "Local é obrigatório";
      if (!currentForm.startDate?.trim()) return "Data inicial é obrigatória";
      return null;
    }
    if (type === "dailyWord") {
      if (!currentForm.date?.trim()) return "Data é obrigatória (YYYY-MM-DD)";
      if (!currentForm.title?.trim()) return "Título é obrigatório";
      if (!currentForm.content?.trim()) return "Conteúdo é obrigatório";
      return null;
    }
    if (type === "prayerReason") {
      if (!currentForm.title?.trim()) return "Título é obrigatório";
      if (!currentForm.description?.trim()) return "Descrição é obrigatória";
      return null;
    }
    if (type === "gallery") {
      if (!currentForm.title?.trim()) return "Título é obrigatório";
      if (!currentForm.mediaUrl?.trim()) return "URL da mídia é obrigatório";
      if (!currentForm.mediaType) return "Tipo de mídia é obrigatório";
      return null;
    }
    return null;
  }

  async function submitContent() {
    setMsg("");
    const error = validate();
    if (error) { setMsg(error); return; }
    setLoading(true);
    try {
      let payload: any = currentForm;
      if (type === "event") {
        payload = {
          title: currentForm.title,
          description: currentForm.description,
          location: currentForm.location,
          startDate: new Date(currentForm.startDate),
          endDate: currentForm.endDate ? new Date(currentForm.endDate) : null,
          imageUrl: currentForm.imageUrl || null,
        };
      }
      if (type === "dailyWord") {
        payload = {
          date: currentForm.date,
          title: currentForm.title,
          content: currentForm.content,
          reference: currentForm.reference || null,
        };
      }
      if (type === "prayerReason") {
        payload = {
          title: currentForm.title,
          description: currentForm.description,
          priority: currentForm.priority || "medium",
        };
      }
      if (type === "gallery") {
        payload = {
          title: currentForm.title,
          description: currentForm.description || null,
          mediaUrl: currentForm.mediaUrl,
          mediaType: currentForm.mediaType,
          eventId: currentForm.eventId ? Number(currentForm.eventId) : null,
        };
      }
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ type, data: payload }),
      });
      const data = await res.json();
      setMsg(data?.success ? "Conteúdo criado." : "Erro: " + (data?.error || "falha"));
      if (data?.success) {
        if (type === "article") setArticle({ title: "", description: "", content: "", imageUrl: "" });
        if (type === "news") setNews({ title: "", description: "", content: "", imageUrl: "" });
        if (type === "event") setEventData({ title: "", description: "", location: "", startDate: "", endDate: "", imageUrl: "" });
        if (type === "dailyWord") setDailyWord({ date: "", title: "", content: "", reference: "" });
        if (type === "prayerReason") setPrayerReason({ title: "", description: "", priority: "medium" });
        if (type === "gallery") setGallery({ title: "", description: "", mediaUrl: "", mediaType: "image", eventId: "" });
        refreshList();
      }
    } catch {
      setMsg("Erro ao publicar");
    } finally {
      setLoading(false);
    }
  }

  async function updateContent() {
    if (!selectedId) { setMsg("Selecione um item para editar"); return; }
    const error = validate();
    if (error) { setMsg(error); return; }
    setLoading(true);
    try {
      let payload: any = currentForm;
      if (type === "event") {
        payload = {
          ...payload,
          startDate: payload.startDate ? new Date(payload.startDate) : null,
          endDate: payload.endDate ? new Date(payload.endDate) : null,
        };
      }
      const res = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ type, id: selectedId, data: payload }),
      });
      const data = await res.json();
      setMsg(data?.success ? "Conteúdo atualizado." : "Erro: " + (data?.error || "falha"));
      if (data?.success) {
        refreshList();
      }
    } catch {
      setMsg("Erro ao atualizar");
    } finally {
      setLoading(false);
    }
  }

  async function deleteContent(id?: number) {
    const targetId = id || selectedId;
    if (!targetId) { setMsg("Selecione um item para excluir"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ type, id: targetId }),
      });
      const data = await res.json();
      setMsg(data?.success ? "Conteúdo excluído." : "Erro: " + (data?.error || "falha"));
      if (data?.success) {
        setSelectedId(null);
        refreshList();
      }
    } catch {
      setMsg("Erro ao excluir");
    } finally {
      setLoading(false);
    }
  }

  async function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function submitRole() {
    setMsg("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: roleEmail, role }),
      });
      const data = await res.json();
      setMsg(data?.success ? "Permissão atualizada." : "Erro: " + (data?.error || "falha"));
      if (data?.success) {
        setRoleEmail("");
        setRole("admin");
      }
    } catch {
      setMsg("Erro ao atualizar permissão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 text-white text-center">Painel do Administrador</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-indigo-950 border border-indigo-900 text-white rounded-2xl shadow-lg">
            <h2 className="font-bold mb-4">Criar Conteúdo</h2>
            <div className="space-y-3">
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ContentType)}
                className="w-full bg-indigo-900 border-indigo-800 rounded-xl p-2 text-white"
              >
                <option value="article">Artigo</option>
                <option value="news">Notícia</option>
                <option value="event">Evento</option>
                <option value="dailyWord">Palavra do Dia</option>
                <option value="prayerReason">Motivo de Oração</option>
                <option value="gallery">Galeria (Imagem/Vídeo)</option>
              </select>

            {type === "article" && (
              <div className="space-y-3">
                <Input placeholder="Título" value={article.title} onChange={(e) => setArticle({ ...article, title: e.target.value })} className="bg-indigo-900 border-indigo-800 text-white rounded-xl" />
                <Input placeholder="Descrição (opcional)" value={article.description} onChange={(e) => setArticle({ ...article, description: e.target.value })} className="bg-indigo-900 border-indigo-800 text-white rounded-xl" />
                <textarea placeholder="Conteúdo" value={article.content} onChange={(e) => setArticle({ ...article, content: e.target.value })} className="w-full bg-indigo-900 border-indigo-800 text-white rounded-xl p-2 h-28" />
                <Input placeholder="Imagem URL (opcional)" value={article.imageUrl} onChange={(e) => setArticle({ ...article, imageUrl: e.target.value })} className="bg-indigo-900 border-indigo-800 text-white rounded-xl" />
                <input type="file" accept="image/*" capture="environment" onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    const url = await fileToDataUrl(f);
                    setArticle({ ...article, imageUrl: url });
                  }
                }} />
              </div>
            )}

            {type === "news" && (
              <div className="space-y-3">
                <Input placeholder="Título" value={news.title} onChange={(e) => setNews({ ...news, title: e.target.value })} className="bg-indigo-900 border-indigo-800 text-white rounded-xl" />
                <Input placeholder="Descrição (opcional)" value={news.description} onChange={(e) => setNews({ ...news, description: e.target.value })} className="bg-indigo-900 border-indigo-800 text-white rounded-xl" />
                <textarea placeholder="Conteúdo" value={news.content} onChange={(e) => setNews({ ...news, content: e.target.value })} className="w-full bg-indigo-900 border-indigo-800 text-white rounded-xl p-2 h-28" />
                <Input placeholder="Imagem URL (opcional)" value={news.imageUrl} onChange={(e) => setNews({ ...news, imageUrl: e.target.value })} className="bg-indigo-900 border-indigo-800 text-white rounded-xl" />
                <input type="file" accept="image/*" capture="environment" onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    const url = await fileToDataUrl(f);
                    setNews({ ...news, imageUrl: url });
                  }
                }} />
              </div>
            )}

            {type === "event" && (
              <div className="space-y-3">
                <Input placeholder="Título" value={eventData.title} onChange={(e) => setEventData({ ...eventData, title: e.target.value })} className="bg-indigo-900 border-indigo-800 text-white rounded-xl" />
                <Input placeholder="Descrição (opcional)" value={eventData.description} onChange={(e) => setEventData({ ...eventData, description: e.target.value })} className="bg-indigo-900 border-indigo-800 text-white rounded-xl" />
                <Input placeholder="Local" value={eventData.location} onChange={(e) => setEventData({ ...eventData, location: e.target.value })} className="bg-indigo-900 border-indigo-800 text-white rounded-xl" />
                <Input placeholder="Data inicial (YYYY-MM-DD)" value={eventData.startDate} onChange={(e) => setEventData({ ...eventData, startDate: e.target.value })} className="bg-indigo-900 border-indigo-800 text-white rounded-xl" />
                <Input placeholder="Data final (YYYY-MM-DD) (opcional)" value={eventData.endDate} onChange={(e) => setEventData({ ...eventData, endDate: e.target.value })} className="bg-indigo-900 border-indigo-800 text-white rounded-xl" />
                <Input placeholder="Imagem URL (opcional)" value={eventData.imageUrl} onChange={(e) => setEventData({ ...eventData, imageUrl: e.target.value })} className="bg-indigo-900 border-indigo-800 text-white rounded-xl" />
                <input type="file" accept="image/*" capture="environment" onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    const url = await fileToDataUrl(f);
                    setEventData({ ...eventData, imageUrl: url });
                  }
                }} />
              </div>
            )}

            {type === "dailyWord" && (
              <div className="space-y-3">
                <Input placeholder="Data (YYYY-MM-DD)" value={dailyWord.date} onChange={(e) => setDailyWord({ ...dailyWord, date: e.target.value })} className="bg-indigo-900 border-indigo-800 text-white rounded-xl" />
                <Input placeholder="Título" value={dailyWord.title} onChange={(e) => setDailyWord({ ...dailyWord, title: e.target.value })} className="bg-indigo-900 border-indigo-800 text-white rounded-xl" />
                <textarea placeholder="Conteúdo" value={dailyWord.content} onChange={(e) => setDailyWord({ ...dailyWord, content: e.target.value })} className="w-full bg-indigo-900 border-indigo-800 text-white rounded-xl p-2 h-28" />
                <Input placeholder="Referência (opcional)" value={dailyWord.reference} onChange={(e) => setDailyWord({ ...dailyWord, reference: e.target.value })} className="bg-indigo-900 border-indigo-800 text-white rounded-xl" />
              </div>
            )}

            {type === "prayerReason" && (
              <div className="space-y-3">
                <Input placeholder="Título" value={prayerReason.title} onChange={(e) => setPrayerReason({ ...prayerReason, title: e.target.value })} className="bg-indigo-900 border-indigo-800 text-white rounded-xl" />
                <textarea placeholder="Descrição" value={prayerReason.description} onChange={(e) => setPrayerReason({ ...prayerReason, description: e.target.value })} className="w-full bg-indigo-900 border-indigo-800 text-white rounded-xl p-2 h-28" />
                <select value={prayerReason.priority} onChange={(e) => setPrayerReason({ ...prayerReason, priority: e.target.value })} className="w-full bg-indigo-900 border-indigo-800 rounded-xl p-2 text-white">
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
              </div>
            )}

            {type === "gallery" && (
              <div className="space-y-3">
                <Input placeholder="Título" value={gallery.title} onChange={(e) => setGallery({ ...gallery, title: e.target.value })} className="bg-indigo-900 border-indigo-800 text-white rounded-xl" />
                <Input placeholder="Descrição (opcional)" value={gallery.description} onChange={(e) => setGallery({ ...gallery, description: e.target.value })} className="bg-indigo-900 border-indigo-800 text-white rounded-xl" />
                <Input placeholder="URL da mídia" value={gallery.mediaUrl} onChange={(e) => setGallery({ ...gallery, mediaUrl: e.target.value })} className="bg-indigo-900 border-indigo-800 text-white rounded-xl" />
                <input
                  type="file"
                  accept="image/*,video/*"
                  capture="environment"
                  multiple
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      const f = files[0];
                      const url = await fileToDataUrl(f);
                      setGallery({ ...gallery, mediaUrl: url, mediaType: f.type.startsWith("video") ? "video" : "image" });
                    }
                  }}
                />
                <select value={gallery.mediaType} onChange={(e) => setGallery({ ...gallery, mediaType: e.target.value })} className="w-full bg-indigo-900 border-indigo-800 rounded-xl p-2 text-white">
                  <option value="image">Imagem</option>
                  <option value="video">Vídeo</option>
                </select>
                <Input placeholder="ID do Evento (opcional)" value={gallery.eventId} onChange={(e) => setGallery({ ...gallery, eventId: e.target.value })} className="bg-indigo-900 border-indigo-800 text-white rounded-xl" />
              </div>
            )}

            <Button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl" onClick={submitContent}>
              {loading ? "Publicando..." : "Publicar"}
            </Button>
            <Button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl" onClick={updateContent}>
              {loading ? "Atualizando..." : "Salvar Edição"}
            </Button>
            <Button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl" onClick={() => deleteContent()}>
              {loading ? "Excluindo..." : "Excluir Selecionado"}
            </Button>
            </div>
          </Card>

          <Card className="p-6 bg-indigo-950 border border-indigo-900 text-white rounded-2xl shadow-lg">
            <h2 className="font-bold mb-4">Gerenciar Permissões</h2>
            <div className="space-y-3">
              <Input placeholder="E-mail do usuário" value={roleEmail} onChange={(e) => setRoleEmail(e.target.value)} className="bg-indigo-900 border-indigo-800 text-white rounded-xl" />
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-indigo-900 border-indigo-800 rounded-xl p-2 text-white">
                <option value="admin">Admin</option>
                <option value="user">Usuário</option>
              </select>
              <Button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl" onClick={submitRole}>
                {loading ? "Atualizando..." : "Atualizar Permissão"}
              </Button>
            </div>
          </Card>
        </div>
        <Card className="mt-6 p-6 bg-indigo-950 border border-indigo-900 text-white rounded-2xl shadow-lg">
          <h2 className="font-bold mb-4">Conteúdos ({type})</h2>
          <div className="space-y-2">
            {items.map((it) => (
              <div key={it.id} className={`flex items-center justify-between p-3 rounded-lg ${selectedId === it.id ? "bg-indigo-950" : "bg-indigo-900"}`}>
                <div>
                  <div className="text-sm font-semibold">{it.title || it.date || `#${it.id}`}</div>
                  <div className="text-xs opacity-70">ID: {it.id}</div>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl" onClick={() => loadItemToForm(it)}>Editar</Button>
                  <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl" onClick={() => deleteContent(it.id)}>Excluir</Button>
                </div>
              </div>
            ))}
            {items.length === 0 && <div className="text-sm opacity-70">Nenhum conteúdo encontrado.</div>}
          </div>
        </Card>
        {msg && <div className="mt-4 text-sm text-white">{msg}</div>}
      </div>
    </div>
  );
}
