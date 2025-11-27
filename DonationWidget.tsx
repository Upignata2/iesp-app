import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface DonationWidgetProps {
  campaignId: number;
  campaignTitle: string;
}

export default function DonationWidget({ campaignId, campaignTitle }: DonationWidgetProps) {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "mercadopago" | "credit_card">("pix");
  const [showForm, setShowForm] = useState(false);

  const donateMutation = trpc.campaigns.donate.useMutation();

  const handleDonate = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Por favor, insira um valor válido");
      return;
    }

    donateMutation.mutate({
      campaignId,
      amount: Math.round(parseFloat(amount) * 100),
      paymentMethod,
    });
    alert("Doação realizada com sucesso! Obrigado por sua contribuição.");
    setAmount("");
    setShowForm(false);
  };

  if (!showForm) {
    return (
      <Button
        onClick={() => setShowForm(true)}
        className="w-full bg-primary hover:bg-blue-700 text-white"
      >
        Fazer Doação
      </Button>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-2 border-primary">
      <h3 className="font-bold text-lg mb-4">Fazer Doação para {campaignTitle}</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Valor (R$)</label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Ex: 50,00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Método de Pagamento</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="payment"
                value="pix"
                checked={paymentMethod === "pix"}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="mr-2"
              />
              <span>PIX</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="payment"
                value="mercadopago"
                checked={paymentMethod === "mercadopago"}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="mr-2"
              />
              <span>Mercado Pago</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="payment"
                value="credit_card"
                checked={paymentMethod === "credit_card"}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="mr-2"
              />
              <span>Cartão de Crédito</span>
            </label>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
          <p className="font-semibold mb-1">Informações Importantes:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Sua doação é segura e criptografada</li>
            <li>Você receberá um comprovante por e-mail</li>
            <li>100% do valor vai para a campanha</li>
          </ul>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleDonate}
            disabled={donateMutation.isPending || !amount}
            className="flex-1 bg-primary hover:bg-blue-700 text-white"
          >
            {donateMutation.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Confirmar Doação
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowForm(false)}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </Card>
  );
}
