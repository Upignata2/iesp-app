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
      }
    } catch {
      setMsg("Erro ao publicar");
    } finally {
      setLoading(false);
    }
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
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Painel do Administrador</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 bg-neutral-950 border-neutral-800 text-white">
          <h2 className="font-bold mb-4">Criar Conteúdo</h2>
          <div className="space-y-3">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ContentType)}
              className="w-full bg-neutral-900 border-neutral-700 rounded-xl p-2"
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
                <Input placeholder="Título" value={article.title} onChange={(e) => setArticle({ ...article, title: e.target.value })} className="bg-neutral-900 border-neutral-700 text-white rounded-xl" />
                <Input placeholder="Descrição (opcional)" value={article.description} onChange={(e) => setArticle({ ...article, description: e.target.value })} className="bg-neutral-900 border-neutral-700 text-white rounded-xl" />
                <textarea placeholder="Conteúdo" value={article.content} onChange={(e) => setArticle({ ...article, content: e.target.value })} className="w-full bg-neutral-900 border-neutral-700 text-white rounded-xl p-2 h-28" />
                <Input placeholder="Imagem URL (opcional)" value={article.imageUrl} onChange={(e) => setArticle({ ...article, imageUrl: e.target.value })} className="bg-neutral-900 border-neutral-700 text-white rounded-xl" />
              </div>
            )}

            {type === "news" && (
              <div className="space-y-3">
                <Input placeholder="Título" value={news.title} onChange={(e) => setNews({ ...news, title: e.target.value })} className="bg-neutral-900 border-neutral-700 text-white rounded-xl" />
                <Input placeholder="Descrição (opcional)" value={news.description} onChange={(e) => setNews({ ...news, description: e.target.value })} className="bg-neutral-900 border-neutral-700 text-white rounded-xl" />
                <textarea placeholder="Conteúdo" value={news.content} onChange={(e) => setNews({ ...news, content: e.target.value })} className="w-full bg-neutral-900 border-neutral-700 text-white rounded-xl p-2 h-28" />
                <Input placeholder="Imagem URL (opcional)" value={news.imageUrl} onChange={(e) => setNews({ ...news, imageUrl: e.target.value })} className="bg-neutral-900 border-neutral-700 text-white rounded-xl" />
              </div>
            )}

            {type === "event" && (
              <div className="space-y-3">
                <Input placeholder="Título" value={eventData.title} onChange={(e) => setEventData({ ...eventData, title: e.target.value })} className="bg-neutral-900 border-neutral-700 text-white rounded-xl" />
                <Input placeholder="Descrição (opcional)" value={eventData.description} onChange={(e) => setEventData({ ...eventData, description: e.target.value })} className="bg-neutral-900 border-neutral-700 text-white rounded-xl" />
                <Input placeholder="Local" value={eventData.location} onChange={(e) => setEventData({ ...eventData, location: e.target.value })} className="bg-neutral-900 border-neutral-700 text-white rounded-xl" />
                <Input placeholder="Data inicial (YYYY-MM-DD)" value={eventData.startDate} onChange={(e) => setEventData({ ...eventData, startDate: e.target.value })} className="bg-neutral-900 border-neutral-700 text-white rounded-xl" />
                <Input placeholder="Data final (YYYY-MM-DD) (opcional)" value={eventData.endDate} onChange={(e) => setEventData({ ...eventData, endDate: e.target.value })} className="bg-neutral-900 border-neutral-700 text-white rounded-xl" />
                <Input placeholder="Imagem URL (opcional)" value={eventData.imageUrl} onChange={(e) => setEventData({ ...eventData, imageUrl: e.target.value })} className="bg-neutral-900 border-neutral-700 text-white rounded-xl" />
              </div>
            )}

            {type === "dailyWord" && (
              <div className="space-y-3">
                <Input placeholder="Data (YYYY-MM-DD)" value={dailyWord.date} onChange={(e) => setDailyWord({ ...dailyWord, date: e.target.value })} className="bg-neutral-900 border-neutral-700 text-white rounded-xl" />
                <Input placeholder="Título" value={dailyWord.title} onChange={(e) => setDailyWord({ ...dailyWord, title: e.target.value })} className="bg-neutral-900 border-neutral-700 text-white rounded-xl" />
                <textarea placeholder="Conteúdo" value={dailyWord.content} onChange={(e) => setDailyWord({ ...dailyWord, content: e.target.value })} className="w-full bg-neutral-900 border-neutral-700 text-white rounded-xl p-2 h-28" />
                <Input placeholder="Referência (opcional)" value={dailyWord.reference} onChange={(e) => setDailyWord({ ...dailyWord, reference: e.target.value })} className="bg-neutral-900 border-neutral-700 text-white rounded-xl" />
              </div>
            )}

            {type === "prayerReason" && (
              <div className="space-y-3">
                <Input placeholder="Título" value={prayerReason.title} onChange={(e) => setPrayerReason({ ...prayerReason, title: e.target.value })} className="bg-neutral-900 border-neutral-700 text-white rounded-xl" />
                <textarea placeholder="Descrição" value={prayerReason.description} onChange={(e) => setPrayerReason({ ...prayerReason, description: e.target.value })} className="w-full bg-neutral-900 border-neutral-700 text-white rounded-xl p-2 h-28" />
                <select value={prayerReason.priority} onChange={(e) => setPrayerReason({ ...prayerReason, priority: e.target.value })} className="w-full bg-neutral-900 border-neutral-700 rounded-xl p-2">
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
              </div>
            )}

            {type === "gallery" && (
              <div className="space-y-3">
                <Input placeholder="Título" value={gallery.title} onChange={(e) => setGallery({ ...gallery, title: e.target.value })} className="bg-neutral-900 border-neutral-700 text-white rounded-xl" />
                <Input placeholder="Descrição (opcional)" value={gallery.description} onChange={(e) => setGallery({ ...gallery, description: e.target.value })} className="bg-neutral-900 border-neutral-700 text-white rounded-xl" />
                <Input placeholder="URL da mídia" value={gallery.mediaUrl} onChange={(e) => setGallery({ ...gallery, mediaUrl: e.target.value })} className="bg-neutral-900 border-neutral-700 text-white rounded-xl" />
                <select value={gallery.mediaType} onChange={(e) => setGallery({ ...gallery, mediaType: e.target.value })} className="w-full bg-neutral-900 border-neutral-700 rounded-xl p-2">
                  <option value="image">Imagem</option>
                  <option value="video">Vídeo</option>
                </select>
                <Input placeholder="ID do Evento (opcional)" value={gallery.eventId} onChange={(e) => setGallery({ ...gallery, eventId: e.target.value })} className="bg-neutral-900 border-neutral-700 text-white rounded-xl" />
              </div>
            )}

            <Button disabled={loading} className="w-full bg-white text-black rounded-xl" onClick={submitContent}>
              {loading ? "Publicando..." : "Publicar"}
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-neutral-950 border-neutral-800 text-white">
          <h2 className="font-bold mb-4">Gerenciar Permissões</h2>
          <div className="space-y-3">
            <Input placeholder="E-mail do usuário" value={roleEmail} onChange={(e) => setRoleEmail(e.target.value)} className="bg-neutral-900 border-neutral-700 text-white rounded-xl" />
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-neutral-900 border-neutral-700 rounded-xl p-2">
              <option value="admin">Admin</option>
              <option value="user">Usuário</option>
            </select>
            <Button disabled={loading} className="w-full bg-white text-black rounded-xl" onClick={submitRole}>
              {loading ? "Atualizando..." : "Atualizar Permissão"}
            </Button>
          </div>
        </Card>
      </div>
      {msg && <div className="mt-4 text-sm text-white">{msg}</div>}
    </div>
  );
}
