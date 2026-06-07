import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, UserCog, Sparkles, Check, ArrowLeft, ArrowRight, Building2, Phone, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { calcularPlanos, formatPlano, formatSindico, aplicarDescontoCombo } from "@/lib/calculations";
import { gerarPDFProposta } from "@/lib/pdf";

export const Route = createFileRoute("/_authenticated/nova")({
  component: NovaProposta,
});

const STEPS = ["Serviços", "Condomínio", "Contato", "Revisão"];

const schema = z.object({
  nome_condominio: z.string().trim().min(2, "Informe o nome do condomínio").max(200),
  endereco: z.string().trim().min(5, "Informe o endereço completo").max(300),
  unidades: z.number().int().min(1, "Mínimo 1 unidade").max(10000),
  tipo: z.enum(["residencial", "comercial", "misto"], { message: "Selecione o tipo" }),
  nome_contato: z.string().trim().min(2, "Informe o nome do responsável").max(200),
  telefone: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido. Use (31) 99999-9999"),
  email: z.string().email("E-mail inválido").max(255),
});

function maskTelefone(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function NovaProposta() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [incluiAdmin, setIncluiAdmin] = useState(true);
  const [incluiSindico, setIncluiSindico] = useState(false);
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
  const calc = useMemo(() => unidadesNum > 0 ? calcularPlanos(unidadesNum) : null, [unidadesNum]);

  function setCombo() {
    setIncluiAdmin(true);
    setIncluiSindico(true);
  }

  function avancar() {
    setErrors({});
    if (step === 0) {
      if (!incluiAdmin && !incluiSindico) return toast.error("Selecione pelo menos um serviço");
      setStep(1); return;
    }
    if (step === 1) {
      const partial = schema.pick({ nome_condominio: true, endereco: true, unidades: true, tipo: true }).safeParse({
        nome_condominio: form.nome_condominio,
        endereco: form.endereco,
        unidades: Number(form.unidades),
        tipo: form.tipo as any,
      });
      if (!partial.success) {
        const errs: Record<string, string> = {};
        partial.error.issues.forEach((i) => { errs[String(i.path[0])] = i.message; });
        setErrors(errs);
        return;
      }
      setStep(2); return;
    }
    if (step === 2) {
      const partial = schema.pick({ nome_contato: true, telefone: true, email: true }).safeParse({
        nome_contato: form.nome_contato, telefone: form.telefone, email: form.email,
      });
      if (!partial.success) {
        const errs: Record<string, string> = {};
        partial.error.issues.forEach((i) => { errs[String(i.path[0])] = i.message; });
        setErrors(errs);
        return;
      }
      setStep(3); return;
    }
  }

  async function gerarESalvar() {
    setSaving(true);
    try {
      const { data: numData, error: numErr } = await supabase.rpc("generate_proposta_numero");
      if (numErr || !numData) throw new Error("Não foi possível gerar o número da proposta");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sessão expirada");

      const numero = numData as string;
      const now = new Date();

      const valor_essencial = calc?.essencial.tipo === "valor" ? calc.essencial.mensal : null;
      const valor_completo = calc?.completo.tipo === "valor" ? calc.completo.mensal : null;
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
        numero, data: now,
        condominio: { nome: form.nome_condominio, endereco: form.endereco, unidades: unidadesNum, tipo: form.tipo as string },
        contato: { nome: form.nome_contato, telefone: form.telefone, email: form.email },
        incluiAdmin, incluiSindico,
      });
      const dataStr = now.toISOString().slice(0, 10);
      doc.save(`Proposta_${form.nome_condominio.replace(/\s+/g, "_")}_${dataStr}.pdf`);
      toast.success(`Proposta ${numero} criada com sucesso!`);
      navigate({ to: "/dashboard" });
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao salvar proposta");
    } finally {
      setSaving(false);
    }
  }

  const progress = ((step + 1) / STEPS.length) * 100;
  const tipoLabel = { residencial: "Residencial", comercial: "Comercial", misto: "Misto" } as const;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nova Proposta</h1>
        <p className="text-muted-foreground text-sm mt-1">Preencha as etapas para gerar uma proposta personalizada</p>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <div className="flex justify-between text-xs font-medium mb-2">
            {STEPS.map((s, i) => (
              <span key={s} className={i <= step ? "text-primary" : "text-muted-foreground"}>
                {i + 1}. {s}
              </span>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {step === 0 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Quais serviços incluir?</h2>
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
                title="Combo Completo"
                desc="Ambos com 10% de desconto"
                checked={incluiAdmin && incluiSindico}
                onClick={setCombo}
                highlight
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg flex items-center gap-2"><Building2 className="w-5 h-5 text-primary" />Dados do Condomínio</h2>
            <div className="space-y-2">
              <Label>Nome do condomínio *</Label>
              <Input value={form.nome_condominio} onChange={(e) => setForm({ ...form, nome_condominio: e.target.value })} />
              {errors.nome_condominio && <p className="text-xs text-destructive">{errors.nome_condominio}</p>}
            </div>
            <div className="space-y-2">
              <Label>Endereço completo *</Label>
              <Input value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} placeholder="Rua, número, bairro, cidade/UF" />
              {errors.endereco && <p className="text-xs text-destructive">{errors.endereco}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quantidade de unidades *</Label>
                <Input type="number" min={1} value={form.unidades} onChange={(e) => setForm({ ...form, unidades: e.target.value })} />
                {errors.unidades && <p className="text-xs text-destructive">{errors.unidades}</p>}
              </div>
              <div className="space-y-2">
                <Label>Tipo *</Label>
                <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v as any })}>
                  <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residencial">Residencial</SelectItem>
                    <SelectItem value="comercial">Comercial</SelectItem>
                    <SelectItem value="misto">Misto</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tipo && <p className="text-xs text-destructive">{errors.tipo}</p>}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg flex items-center gap-2"><Phone className="w-5 h-5 text-primary" />Dados do Contato</h2>
            <div className="space-y-2">
              <Label>Nome do síndico/responsável *</Label>
              <Input value={form.nome_contato} onChange={(e) => setForm({ ...form, nome_contato: e.target.value })} />
              {errors.nome_contato && <p className="text-xs text-destructive">{errors.nome_contato}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Telefone / WhatsApp *</Label>
                <Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: maskTelefone(e.target.value) })} placeholder="(31) 99999-9999" />
                {errors.telefone && <p className="text-xs text-destructive">{errors.telefone}</p>}
              </div>
              <div className="space-y-2">
                <Label>E-mail *</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
            </div>
          </div>
        )}

        {step === 3 && calc && (
          <div className="space-y-5">
            <h2 className="font-semibold text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-primary" />Revisão e Geração</h2>

            <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
                <Info label="Condomínio" value={form.nome_condominio} />
                <Info label="Tipo" value={tipoLabel[form.tipo as keyof typeof tipoLabel]} />
                <Info label="Endereço" value={form.endereco} />
                <Info label="Unidades" value={String(unidadesNum)} />
                <Info label="Responsável" value={form.nome_contato} />
                <Info label="Telefone" value={form.telefone} />
                <Info label="E-mail" value={form.email} />
                <Info label="Serviços" value={[incluiAdmin && "Administração", incluiSindico && "Síndico"].filter(Boolean).join(" + ")} />
              </div>
            </div>

            {incluiAdmin && (
              <div>
                <div className="text-sm font-medium mb-2">Planos de Administração</div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <PlanCard name="Essencial" value={formatPlano(calc.essencial)} />
                  <PlanCard name="Completo" value={formatPlano(calc.completo)} highlight />
                  <PlanCard name="Premium" value={formatPlano(calc.premium)} />
                </div>
              </div>
            )}

            {incluiSindico && (
              <div>
                <div className="text-sm font-medium mb-2">Síndico Profissional</div>
                <div className="rounded-lg border p-4 bg-card">
                  <div className="text-xl font-bold text-primary">{formatSindico(calc.sindico)}</div>
                </div>
              </div>
            )}

            {incluiAdmin && incluiSindico && (
              <div>
                <div className="text-sm font-medium mb-2">Combo (10% de desconto)</div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <PlanCard name="Essencial + Síndico" value={aplicarDescontoCombo(calc.essencial, calc.sindico)} />
                  <PlanCard name="Completo + Síndico" value={aplicarDescontoCombo(calc.completo, calc.sindico)} highlight />
                  <PlanCard name="Premium + Síndico" value={aplicarDescontoCombo(calc.premium, calc.sindico)} />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button variant="outline" onClick={() => step === 0 ? navigate({ to: "/dashboard" }) : setStep(step - 1)} disabled={saving}>
            <ArrowLeft className="w-4 h-4 mr-2" />{step === 0 ? "Cancelar" : "Voltar"}
          </Button>
          {step < 3 ? (
            <Button onClick={avancar}>Próximo<ArrowRight className="w-4 h-4 ml-2" /></Button>
          ) : (
            <Button onClick={gerarESalvar} disabled={saving} className="shadow-elegant">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
              Gerar Proposta em PDF
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function ServiceCard({ icon, title, desc, checked, onClick, highlight }: { icon: React.ReactNode; title: string; desc: string; checked: boolean; onClick: () => void; highlight?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative text-left rounded-xl border-2 p-4 transition-all ${
        checked
          ? "border-primary bg-primary/5 shadow-elegant"
          : "border-border hover:border-primary/40"
      } ${highlight ? "ring-1 ring-primary/30" : ""}`}
    >
      {highlight && (
        <Badge className="absolute -top-2 right-3 bg-gradient-primary text-primary-foreground border-0">Recomendado</Badge>
      )}
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${checked ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
        {icon}
      </div>
      <div className="font-semibold">{title}</div>
      <div className="text-xs text-muted-foreground mt-1">{desc}</div>
      {checked && <Check className="absolute top-3 right-3 w-5 h-5 text-primary" />}
    </button>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-medium">{value || "—"}</div>
    </div>
  );
}

function PlanCard({ name, value, highlight }: { name: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg border p-4 ${highlight ? "border-primary bg-primary/5" : "bg-card"}`}>
      <div className="text-xs text-muted-foreground">{name}</div>
      <div className={`text-lg font-bold mt-1 ${highlight ? "text-primary" : ""}`}>{value}</div>
    </div>
  );
}
