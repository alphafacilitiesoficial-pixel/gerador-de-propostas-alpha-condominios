import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ClipboardList,
  UserCog,
  Sparkles,
  Check,
  ArrowLeft,
  ArrowRight,
  Building2,
  Phone,
  FileText,
  Loader2,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import {
  calcularPlanos,
  formatPlano,
  formatSindico,
} from "@/lib/calculations";
import { gerarPDFProposta } from "@/lib/pdf";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/nova")({
  component: NovaProposta,
});

const STEPS = ["Serviços", "Condomínio", "Contato", "Revisão"];

const schema = z.object({
  nome_condominio: z
    .string()
    .trim()
    .min(2, "Informe o nome do condomínio")
    .max(200),
  endereco: z
    .string()
    .trim()
    .min(5, "Informe o endereço completo")
    .max(300),
  unidades: z.number().int().min(1, "Mínimo 1 unidade").max(10000),
  tipo: z.enum(["residencial", "comercial", "misto"], {
    message: "Selecione o tipo",
  }),
  nome_contato: z
    .string()
    .trim()
    .min(2, "Informe o nome do responsável")
    .max(200),
  telefone: z
    .string()
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido. Use (31) 99999-9999"),
  email: z.string().email("E-mail inválido").max(255),
});

function maskTelefone(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/* ================================================================
   Monta texto do WhatsApp — SOMENTE RESUMO (sem anexar PDF)
   ================================================================ */
function montarTextoWhatsApp(params: {
  numero: string;
  nomeCondominio: string;
  endereco: string;
  unidades: number;
  tipo: string;
  nomeContato: string;
  telefone: string;
  email: string;
  incluiAdmin: boolean;
  incluiSindico: boolean;
}): string {
  const tipoLabel: Record<string, string> = {
    residencial: "Residencial",
    comercial: "Comercial",
    misto: "Misto",
  };

  const servicos: string[] = [];
  if (params.incluiAdmin) servicos.push("✅ Administração Condominial");
  if (params.incluiSindico) servicos.push("✅ Síndico Profissional");
  if (params.incluiAdmin && params.incluiSindico)
    servicos.push("🎯 Combo com 10% de desconto");

  const lines = [
    "━━━━━━━━━━━━━━━━━━━━",
    "📋 *PROPOSTA COMERCIAL*",
    `*Alpha Facilities* | Nº ${params.numero}`,
    "━━━━━━━━━━━━━━━━━━━━",
    "",
    `🏢 *${params.nomeCondominio}*`,
    `📍 ${params.endereco}`,
    `📊 ${params.unidades} unidades · ${tipoLabel[params.tipo] ?? params.tipo}`,
    "",
    `👤 *Responsável:* ${params.nomeContato}`,
    `📞 ${params.telefone}`,
    `✉️ ${params.email}`,
    "",
    "🔹 *Serviços inclusos na proposta:*",
    ...servicos,
    "",
    "💬 Ficamos à disposição para esclarecer qualquer dúvida sobre os serviços contemplados na Proposta!",
    "",
    "━━━━━━━━━━━━━━━━━━━━",
    "*Alpha Facilities*",
    "📞 (31) 99778-7316",
    "✉️ comercial@alphafacilities.com.br",
    "🌐 www.alphafacilities.com.br",
  ];
  return lines.join("\n");
}

function NovaProposta() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [incluiAdmin, setIncluiAdmin] = useState(true);
  const [incluiSindico, setIncluiSindico] = useState(false);
  const [consideracoesFinais, setConsideracoesFinais] = useState("");
  const [propostaGerada, setPropostaGerada] = useState<{
    numero: string;
  } | null>(null);

  const [form, setForm] = useState({
    nome_condominio: "",
    endereco: "",
    unidades: "" as string | number,
    tipo: "" as "" | "residencial" | "comercial" | "misto",
    nome_contato: "",
    telefone: "",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const unidadesNum = Number(form.unidades) || 0;
  const calc = useMemo(
    () => (unidadesNum > 0 ? calcularPlanos(unidadesNum) : null),
    [unidadesNum]
  );

  function setCombo() {
    setIncluiAdmin(true);
    setIncluiSindico(true);
  }

  function avancar() {
    setErrors({});
    if (step === 0) {
      if (!incluiAdmin && !incluiSindico)
        return toast.error("Selecione pelo menos um serviço");
      setStep(1);
      return;
    }
    if (step === 1) {
      const partial = schema
        .pick({
          nome_condominio: true,
          endereco: true,
          unidades: true,
          tipo: true,
        })
        .safeParse({
          nome_condominio: form.nome_condominio,
          endereco: form.endereco,
          unidades: Number(form.unidades),
          tipo: form.tipo as any,
        });
      if (!partial.success) {
        const errs: Record<string, string> = {};
        partial.error.issues.forEach((i) => {
          errs[String(i.path[0])] = i.message;
        });
        setErrors(errs);
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      const partial = schema
        .pick({ nome_contato: true, telefone: true, email: true })
        .safeParse({
          nome_contato: form.nome_contato,
          telefone: form.telefone,
          email: form.email,
        });
      if (!partial.success) {
        const errs: Record<string, string> = {};
        partial.error.issues.forEach((i) => {
          errs[String(i.path[0])] = i.message;
        });
        setErrors(errs);
        return;
      }
      setStep(3);
      return;
    }
  }

  async function gerarESalvar() {
    setSaving(true);
    try {
      const { data: numData, error: numErr } = await supabase.rpc(
        "generate_proposta_numero"
      );
      if (numErr || !numData)
        throw new Error("Não foi possível gerar o número da proposta");
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sessão expirada");

      const numero = numData as string;
      const now = new Date();

      const valor_essencial =
        calc?.essencial.tipo === "valor" ? calc.essencial.mensal : null;
      const valor_completo =
        calc?.completo.tipo === "valor" ? calc.completo.mensal : null;
      const valor_premium = calc ? formatPlano(calc.premium) : null;
      const valor_sindico = calc ? formatSindico(calc.sindico) : null;

      const { error } = await supabase.from("propostas").insert({
        numero_proposta: numero,
        nome_condominio: form.nome_condominio,
        endereco: form.endereco,
        unidades: unidadesNum,
        tipo: form.tipo as string,
        nome_contato: form.nome_contato,
        telefone: form.telefone,
        email: form.email,
        incluiu_administracao: incluiAdmin,
        incluiu_sindico: incluiSindico,
        valor_essencial,
        valor_completo,
        valor_premium,
        valor_sindico,
        status: "enviada",
        user_id: user.id,
      });
      if (error) throw error;

      const doc = gerarPDFProposta({
        numero,
        data: now,
        condominio: {
          nome: form.nome_condominio,
          endereco: form.endereco,
          unidades: unidadesNum,
          tipo: form.tipo as string,
        },
        contato: {
          nome: form.nome_contato,
          telefone: form.telefone,
          email: form.email,
        },
        incluiAdmin,
        incluiSindico,
        consideracoesFinais,
      });

      const dataStr = now.toISOString().slice(0, 10);
      const filename = `Proposta_${form.nome_condominio.replace(/\s+/g, "_")}_${dataStr}.pdf`;
      doc.save(filename);

      setPropostaGerada({ numero });
      toast.success("Proposta gerada e salva com sucesso!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro ao gerar proposta");
    } finally {
      setSaving(false);
    }
  }

  function compartilharWhatsApp() {
    if (!propostaGerada) return;
    const texto = montarTextoWhatsApp({
      numero: propostaGerada.numero,
      nomeCondominio: form.nome_condominio,
      endereco: form.endereco,
      unidades: unidadesNum,
      tipo: form.tipo as string,
      nomeContato: form.nome_contato,
      telefone: form.telefone,
      email: form.email,
      incluiAdmin,
      incluiSindico,
    });
    const encoded = encodeURIComponent(texto);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  }

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nova Proposta</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Crie propostas comerciais personalizadas em poucos cliques
        </p>
      </div>

      <Card className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((label, i) => (
              <div key={i} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    i <= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      i < step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <Progress value={((step + 1) / STEPS.length) * 100} className="h-2" />
        </div>

        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                Serviços Inclusos
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Selecione os serviços que farão parte da proposta
              </p>
            </div>

            <div className="space-y-4">
              <Card
                className={`p-6 cursor-pointer transition-all ${
                  incluiAdmin
                    ? "border-primary bg-primary/5 shadow-elegant"
                    : "border-muted hover:border-primary/50"
                }`}
                onClick={() => setIncluiAdmin(!incluiAdmin)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      incluiAdmin
                        ? "bg-primary border-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {incluiAdmin && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-2">Administração Condominial</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Planos Essencial, Completo e Premium com gestão financeira,
                      operacional e conformidade legal.
                    </p>
                  </div>
                </div>
              </Card>

              <Card
                className={`p-6 cursor-pointer transition-all ${
                  incluiSindico
                    ? "border-primary bg-primary/5 shadow-elegant"
                    : "border-muted hover:border-primary/50"
                }`}
                onClick={() => setIncluiSindico(!incluiSindico)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      incluiSindico
                        ? "bg-primary border-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {incluiSindico && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-2">
                      Síndico Profissional
                      <Badge variant="outline" className="ml-2 text-xs">
                        Inclui Seguro RC
                      </Badge>
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Profissional dedicado com representação legal do condomínio e
                      cobertura de Seguro de Responsabilidade Civil (RC).
                    </p>
                  </div>
                </div>
              </Card>

              {incluiAdmin && incluiSindico && (
                <Card className="p-4 bg-amber-50 border-amber-200">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-900 mb-1">
                        Combo com 10% de desconto
                      </p>
                      <p className="text-sm text-amber-700">
                        Ao contratar administração + síndico profissional, você
                        ganha 10% de desconto no valor total.
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {!incluiAdmin && !incluiSindico && (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={setCombo}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Contratar Combo (10% OFF)
                </Button>
              )}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Dados do Condomínio
              </h2>
            </div>

            <div className="grid gap-4">
              <div>
                <Label>Nome do Condomínio *</Label>
                <Input
                  value={form.nome_condominio}
                  onChange={(e) =>
                    setForm({ ...form, nome_condominio: e.target.value })
                  }
                  placeholder="Ex: Edifício Solar das Flores"
                />
                {errors.nome_condominio && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.nome_condominio}
                  </p>
                )}
              </div>

              <div>
                <Label>Endereço Completo *</Label>
                <Input
                  value={form.endereco}
                  onChange={(e) => setForm({ ...form, endereco: e.target.value })}
                  placeholder="Rua, número, bairro, cidade"
                />
                {errors.endereco && (
                  <p className="text-sm text-destructive mt-1">{errors.endereco}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Número de Unidades *</Label>
                  <Input
                    type="number"
                    value={form.unidades}
                    onChange={(e) =>
                      setForm({ ...form, unidades: Number(e.target.value) || "" })
                    }
                    placeholder="Ex: 40"
                    min={1}
                  />
                  {errors.unidades && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.unidades}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Tipo *</Label>
                  <Select
                    value={form.tipo}
                    onValueChange={(v: any) => setForm({ ...form, tipo: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residencial">Residencial</SelectItem>
                      <SelectItem value="comercial">Comercial</SelectItem>
                      <SelectItem value="misto">Misto</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tipo && (
                    <p className="text-sm text-destructive mt-1">{errors.tipo}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Dados de Contato
              </h2>
            </div>

            <div className="grid gap-4">
              <div>
                <Label>Nome do Responsável *</Label>
                <Input
                  value={form.nome_contato}
                  onChange={(e) =>
                    setForm({ ...form, nome_contato: e.target.value })
                  }
                  placeholder="Ex: João Silva"
                />
                {errors.nome_contato && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.nome_contato}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Telefone *</Label>
                  <Input
                    value={form.telefone}
                    onChange={(e) =>
                      setForm({ ...form, telefone: maskTelefone(e.target.value) })
                    }
                    placeholder="(31) 99999-9999"
                  />
                  {errors.telefone && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.telefone}
                    </p>
                  )}
                </div>

                <div>
                  <Label>E-mail *</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="contato@exemplo.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Revisão e Finalização
              </h2>
            </div>

            <Card className="p-4 bg-muted/50">
              <h3 className="font-bold mb-3">Condomínio</h3>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <dt className="text-muted-foreground">Nome:</dt>
                <dd className="font-medium">{form.nome_condominio}</dd>
                <dt className="text-muted-foreground">Endereço:</dt>
                <dd className="font-medium">{form.endereco}</dd>
                <dt className="text-muted-foreground">Unidades:</dt>
                <dd className="font-medium">{form.unidades}</dd>
                <dt className="text-muted-foreground">Tipo:</dt>
                <dd className="font-medium capitalize">{form.tipo}</dd>
              </dl>
            </Card>

            <Card className="p-4 bg-muted/50">
              <h3 className="font-bold mb-3">Contato</h3>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <dt className="text-muted-foreground">Responsável:</dt>
                <dd className="font-medium">{form.nome_contato}</dd>
                <dt className="text-muted-foreground">Telefone:</dt>
                <dd className="font-medium">{form.telefone}</dd>
                <dt className="text-muted-foreground">E-mail:</dt>
                <dd className="font-medium">{form.email}</dd>
              </dl>
            </Card>

            <Card className="p-4 bg-muted/50">
              <h3 className="font-bold mb-3">Serviços</h3>
              <div className="space-y-2 text-sm">
                {incluiAdmin && (
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Administração Condominial</span>
                  </div>
                )}
                {incluiSindico && (
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Síndico Profissional</span>
                  </div>
                )}
                {incluiAdmin && incluiSindico && (
                  <Badge variant="secondary" className="mt-2">
                    Combo com 10% OFF
                  </Badge>
                )}
              </div>
            </Card>

            <div>
              <Label>Considerações Finais (Opcional)</Label>
              <Textarea
                value={consideracoesFinais}
                onChange={(e) => setConsideracoesFinais(e.target.value)}
                placeholder="Adicione observações personalizadas que aparecerão na proposta..."
                rows={4}
              />
            </div>

            {propostaGerada && (
              <Card className="p-6 bg-emerald-50 border-emerald-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Check className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-emerald-900 mb-2">
                      Proposta #{propostaGerada.numero} gerada com sucesso!
                    </h3>
                    <p className="text-sm text-emerald-700 mb-4">
                      O PDF foi baixado automaticamente. Agora você pode compartilhar
                      o resumo pelo WhatsApp.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={compartilharWhatsApp}
                      className="border-emerald-600 text-emerald-700 hover:bg-emerald-100"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Compartilhar Resumo no WhatsApp
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          )}
          {step < 3 && (
            <Button onClick={avancar} className="ml-auto">
              Avançar
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          {step === 3 && !propostaGerada && (
            <Button
              onClick={gerarESalvar}
              disabled={saving}
              size="lg"
              className="ml-auto"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Gerar Proposta
                </>
              )}
            </Button>
          )}
          {step === 3 && propostaGerada && (
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/dashboard" })}
              className="ml-auto"
            >
              Voltar ao Dashboard
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
