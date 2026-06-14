import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
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
  aplicarDescontoCombo,
} from "@/lib/calculations";
import { gerarPDFProposta, type PDFHandle } from "@/lib/pdf";
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
   Monta texto do WhatsApp (com emojis — aqui estamos no navegador,
   emojis funcionam normalmente em URLs)
   ================================================================ */
function montarTextoWhatsApp(params: {
  numero: string;
  nomeCondominio: string;
  unidades: number;
  tipo: string;
  nomeContato: string;
  incluiAdmin: boolean;
  incluiSindico: boolean;
}): string {
  const tipoLabel: Record<string, string> = {
    residencial: "Residencial",
    comercial: "Comercial",
    misto: "Misto",
  };
  const servicos: string[] = [];
  if (params.incluiAdmin) servicos.push("Administração Condominial");
  if (params.incluiSindico) servicos.push("Síndico Profissional");
  if (params.incluiAdmin && params.incluiSindico) servicos.push("Combo 10% OFF");

  const lines = [
    `📋 *PROPOSTA ALPHA FACILITIES*`,
    `Nº ${params.numero}`,
    ``,
    `🏢 *Condomínio:* ${params.nomeCondominio}`,
    `📊 ${params.unidades} unidades · ${tipoLabel[params.tipo] ?? params.tipo}`,
    `👤 *Contato:* ${params.nomeContato}`,
    ``,
    `✅ *Serviços:* ${servicos.join(" + ")}`,
    ``,
    `📎 Segue a proposta em PDF em anexo.`,
    `Ficamos à disposição para quaisquer dúvidas!`,
    ``,
    `*Alpha Facilities*`,
    `(31) 99778-7316 · comercial@alphafacilities.com.br`,
  ];
  return lines.join("\n");
}

function NovaProposta() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [incluiAdmin, setIncluiAdmin] = useState(true);
  const [incluiSindico, setIncluiSindico] = useState(false);
  const [consideracoesFinais, setConsideracoesFinais] = useState("");
  const [propostaGerada, setPropostaGerada] = useState<{
    numero: string;
    filename: string;
    handle: PDFHandle;
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
        consideracoesFinais: consideracoesFinais.trim() || undefined,
      });

      const dataStr = now.toISOString().slice(0, 10);
      const filename = `Proposta_${form.nome_condominio.replace(/\s+/g, "_")}_${dataStr}.pdf`;

      await doc.save(filename);

      // Salva referência para usar no botão WhatsApp
      setPropostaGerada({ numero, filename, handle: doc });

      toast.success(`Proposta ${numero} criada com sucesso!`);
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao salvar proposta");
    } finally {
      setSaving(false);
    }
  }

  async function enviarWhatsApp() {
    if (!propostaGerada) return;
    setSharing(true);
    try {
      const texto = montarTextoWhatsApp({
        numero: propostaGerada.numero,
        nomeCondominio: form.nome_condominio,
        unidades: unidadesNum,
        tipo: form.tipo as string,
        nomeContato: form.nome_contato,
        incluiAdmin,
        incluiSindico,
      });

      // Tenta Web Share API com arquivo (mobile)
      const isMobileShare =
        typeof navigator !== "undefined" &&
        navigator.share &&
        typeof File !== "undefined";

      if (isMobileShare) {
        try {
          const blob = await propostaGerada.handle.toBlob();
          const file = new File([blob], propostaGerada.filename, {
            type: "application/pdf",
          });
          if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({
              text: texto,
              files: [file],
            });
            setSharing(false);
            return;
          }
        } catch {
          // fallback para link wa.me
        }
      }

      // Fallback: abre WhatsApp Web/App com texto (sem arquivo)
      const telefoneContato = form.telefone.replace(/\D/g, "");
      const telComCodigo = telefoneContato.startsWith("55")
        ? telefoneContato
        : `55${telefoneContato}`;
      const url = `https://wa.me/${telComCodigo}?text=${encodeURIComponent(texto)}`;
      window.open(url, "_blank");
    } catch (e: any) {
      toast.error("Erro ao compartilhar: " + (e.message ?? ""));
    } finally {
      setSharing(false);
    }
  }

  function voltarAoDashboard() {
    navigate({ to: "/dashboard" });
  }

  const progress = ((step + 1) / STEPS.length) * 100;
  const tipoLabel = {
    residencial: "Residencial",
    comercial: "Comercial",
    misto: "Misto",
  } as const;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nova Proposta</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Preencha as etapas para gerar uma proposta personalizada
        </p>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <div className="flex justify-between text-xs font-medium mb-2">
            {STEPS.map((s, i) => (
              <span
                key={s}
                className={
                  i <= step ? "text-primary" : "text-muted-foreground"
                }
              >
                {i + 1}. {s}
              </span>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* ===== STEP 0 — Serviços ===== */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">
              Quais serviços incluir?
            </h2>
            <div className="grid md:grid-cols-3 gap-3">
              <ServiceCard
                icon={<ClipboardList className="w-6 h-6" />}
                title="Administração"
                desc="Gestão completa do condomínio"
                checked={incluiAdmin}
                onClick={() => setIncluiAdmin(!incluiAdmin)}
              />
              <ServiceCard
                icon={<UserCog className="w-6 h-6" />}
                title="Síndico Profissional"
                desc="Representação e gestão executiva"
                checked={incluiSindico}
                onClick={() => setIncluiSindico(!incluiSindico)}
              />
              <ServiceCard
                icon={<Sparkles className="w-6 h-6" />}
                title="Combo (10% OFF)"
                desc="Administração + Síndico com desconto"
                checked={incluiAdmin && incluiSindico}
                onClick={setCombo}
              />
            </div>
          </div>
        )}

        {/* ===== STEP 1 — Condomínio ===== */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Dados do Condomínio</h2>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="nome_condominio">Nome do Condomínio</Label>
                <Input
                  id="nome_condominio"
                  value={form.nome_condominio}
                  onChange={(e) =>
                    setForm({ ...form, nome_condominio: e.target.value })
                  }
                  placeholder="Ex: Residencial Bela Vista"
                />
                {errors.nome_condominio && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.nome_condominio}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="endereco">Endereço Completo</Label>
                <Input
                  id="endereco"
                  value={form.endereco}
                  onChange={(e) =>
                    setForm({ ...form, endereco: e.target.value })
                  }
                  placeholder="Rua, número, bairro, cidade – UF"
                />
                {errors.endereco && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.endereco}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unidades">Nº de Unidades</Label>
                  <Input
                    id="unidades"
                    type="number"
                    min={1}
                    value={form.unidades}
                    onChange={(e) =>
                      setForm({ ...form, unidades: e.target.value })
                    }
                    placeholder="Ex: 60"
                  />
                  {errors.unidades && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.unidades}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Tipo</Label>
                  <Select
                    value={form.tipo}
                    onValueChange={(v) =>
                      setForm({ ...form, tipo: v as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residencial">Residencial</SelectItem>
                      <SelectItem value="comercial">Comercial</SelectItem>
                      <SelectItem value="misto">Misto</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tipo && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.tipo}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== STEP 2 — Contato ===== */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">
              Contato do Responsável
            </h2>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="nome_contato">Nome</Label>
                <Input
                  id="nome_contato"
                  value={form.nome_contato}
                  onChange={(e) =>
                    setForm({ ...form, nome_contato: e.target.value })
                  }
                  placeholder="Nome completo"
                />
                {errors.nome_contato && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.nome_contato}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={form.telefone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      telefone: maskTelefone(e.target.value),
                    })
                  }
                  placeholder="(31) 99999-9999"
                />
                {errors.telefone && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.telefone}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  placeholder="contato@condominio.com"
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== STEP 3 — Revisão ===== */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Revisão da Proposta</h2>

            <div className="grid gap-3 text-sm">
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">{form.nome_condominio}</p>
                  <p className="text-muted-foreground">{form.endereco}</p>
                  <p className="text-muted-foreground">
                    {unidadesNum} unidades ·{" "}
                    {tipoLabel[form.tipo as keyof typeof tipoLabel]}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">{form.nome_contato}</p>
                  <p className="text-muted-foreground">
                    {form.telefone} · {form.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Serviços selecionados</p>
                  <div className="flex gap-2 mt-1">
                    {incluiAdmin && (
                      <Badge variant="secondary">Administração</Badge>
                    )}
                    {incluiSindico && (
                      <Badge variant="secondary">
                        Síndico Profissional
                      </Badge>
                    )}
                    {incluiAdmin && incluiSindico && (
                      <Badge variant="outline" className="text-xs">
                        10% OFF Combo
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {calc && incluiAdmin && (
                <div className="mt-2 rounded-lg border p-3 bg-muted/30 text-xs space-y-1">
                  <p>
                    <strong>Essencial:</strong> {formatPlano(calc.essencial)}
                  </p>
                  <p>
                    <strong>Completo:</strong> {formatPlano(calc.completo)}
                  </p>
                  <p>
                    <strong>Premium:</strong> {formatPlano(calc.premium)}
                  </p>
                  {incluiSindico && calc.sindico && (
                    <>
                      <p>
                        <strong>Síndico:</strong>{" "}
                        {formatSindico(calc.sindico)}
                      </p>
                      <p>
                        <strong>
                          Combo Completo + Síndico (10% OFF):
                        </strong>{" "}
                        {aplicarDescontoCombo(calc.completo, calc.sindico)}
                      </p>
                    </>
                  )}
                </div>
              )}

              {calc && !incluiAdmin && incluiSindico && (
                <div className="mt-2 rounded-lg border p-3 bg-muted/30 text-xs space-y-1">
                  <p>
                    <strong>Síndico Profissional:</strong>{" "}
                    {formatSindico(calc.sindico)}
                  </p>
                </div>
              )}
            </div>

            {/* Campo Considerações Finais */}
            <div className="space-y-2 pt-2">
              <Label htmlFor="consideracoes">
                Considerações Finais (opcional)
              </Label>
              <Textarea
                id="consideracoes"
                placeholder="Observações, condições especiais, informações extras que devem aparecer na proposta…"
                value={consideracoesFinais}
                onChange={(e) => setConsideracoesFinais(e.target.value)}
                rows={4}
                className="resize-y"
              />
              <p className="text-xs text-muted-foreground">
                Se preenchido, será incluído como página dedicada no PDF.
              </p>
            </div>
          </div>
        )}

        {/* ===== Navegação ===== */}
        <div className="flex justify-between mt-8">
          {step > 0 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/dashboard" })}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Cancelar
            </Button>
          )}

          {step < 3 ? (
            <Button onClick={avancar}>
              Avançar <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <div className="flex gap-2">
              {/* Botão principal: Gerar Proposta */}
              <Button onClick={gerarESalvar} disabled={saving || sharing}>
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4 mr-2" />
                )}
                {saving ? "Gerando…" : "Gerar Proposta"}
              </Button>

              {/* Botão WhatsApp — aparece após gerar */}
              {propostaGerada && (
                <Button
                  variant="outline"
                  className="border-green-500 text-green-600 hover:bg-green-50"
                  onClick={enviarWhatsApp}
                  disabled={sharing}
                >
                  {sharing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Share2 className="w-4 h-4 mr-2" />
                  )}
                  {sharing ? "Enviando…" : "Enviar WhatsApp"}
                </Button>
              )}

              {/* Botão ir ao Dashboard — aparece após gerar */}
              {propostaGerada && (
                <Button variant="ghost" onClick={voltarAoDashboard}>
                  Ir ao Dashboard
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function ServiceCard({
  icon,
  title,
  desc,
  checked,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-xl border-2 p-4 text-left transition-all hover:shadow-md ${
        checked
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-muted bg-card hover:border-muted-foreground/30"
      }`}
    >
      {checked && (
        <span className="absolute top-2 right-2 rounded-full bg-primary p-0.5 text-white">
          <Check className="w-3 h-3" />
        </span>
      )}
      <div className="mb-2 text-primary">{icon}</div>
      <p className="font-semibold text-sm">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
    </button>
  );
}
