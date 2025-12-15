import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import DonationWidget from "@/DonationWidget";

export default function Campaigns() {
  const [, navigate] = useLocation();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data: campaigns, isLoading } = trpc.campaigns.list.useQuery({ limit: 50 });
  const { data: campaign } = trpc.campaigns.getById.useQuery(
    { id: selectedId! },
    { enabled: selectedId !== null }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  if (selectedId && campaign) {
    const progress = campaign.goal ? (campaign.collected / campaign.goal) * 100 : 0;
    
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
          {campaign.imageUrl && (
            <img
              src={campaign.imageUrl}
              alt={campaign.title}
              className="w-full h-96 object-cover rounded-lg mb-6"
            />
          )}
          <h1 className="text-3xl font-bold mb-2">{campaign.title}</h1>
          {campaign.description && (
            <p className="text-lg text-muted-foreground mb-4">{campaign.description}</p>
          )}
          
          {campaign.goal && (
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Arrecadado</span>
                <span className="text-primary font-bold">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-primary h-4 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>R$ {campaign.collected}</span>
                <span>R$ {campaign.goal}</span>
              </div>
            </div>
          )}

          {campaign.content && (
            <div className="prose max-w-none mb-6">
              {campaign.content}
            </div>
          )}

          <DonationWidget campaignId={campaign.id} campaignTitle={campaign.title} />
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Campanhas</h1>
      <div className="grid gap-4">
        {campaigns?.map((campaign) => {
          const progress = campaign.goal ? (campaign.collected / campaign.goal) * 100 : 0;
          return (
            <Card
              key={campaign.id}
              className="p-4 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setSelectedId(campaign.id)}
            >
              <div className="flex gap-4">
                {campaign.imageUrl && (
                  <img
                    src={campaign.imageUrl}
                    alt={campaign.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{campaign.title}</h3>
                  {campaign.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {campaign.description}
                    </p>
                  )}
                  {campaign.goal && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.round(progress)}% arrecadado
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
