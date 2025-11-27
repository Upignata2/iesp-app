import { Card } from "@/components/ui/card";

export default function Videos() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Vídeos</h1>
      <div className="grid gap-4">
        <Card className="p-6 text-center text-muted-foreground">Sem vídeos cadastrados</Card>
      </div>
    </div>
  );
}