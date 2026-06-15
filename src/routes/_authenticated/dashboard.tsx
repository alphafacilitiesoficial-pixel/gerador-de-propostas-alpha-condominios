import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, FileText, TrendingUp, CheckCircle2, XCircle, Clock, MoreVertical, Eye, Copy, Trash2, FileDown, Share2 } from "lucide-react";
import { toast } from "sonner";
import { formatBRL } from "@/lib/calculations";
import { gerarPDFProposta } from "@/lib/pdf";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

type Proposta = {
  id: string;
  numero_proposta: string;
  created_at: string;
  nome_condominio: string;
  unidades: number;
  tipo: string;
  endereco: string;
  nome_contato: string;
  telefone: string;
  email: string;
  incluiu_administracao: boolean;
  incluiu_sindico: boolean;
  valor_essencial: number | null;
  valor_completo: number | null;
  valor_premium: string | null;
  valor_sindico: string | null;
  status: string;
};

const STATUS_LABEL: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; cls: string }> = {
  enviada: { label: "Enviada", variant: "secondary", cls: "bg-blue-100 text-blue-800 border-blue-200" },
  negociacao: { label: "Em negociação", variant: "outline", cls: "bg-amber-100 text-amber-800 border-amber-200" },
  fechada: { label: "Fechada", variant: "default", cls: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  perdida: { label: "Perdida", variant: "destructive", cls: "bg-rose-100 text-rose-800 border-rose-200" },
};

function Dashboard() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [search, setSearch] = useState("");

  const { data: propostas = [], isLoading } = useQuery({
    queryKey: ["propostas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("propostas")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Proposta[];
    },
  });

  const stats = useMemo(() => ({
    total: propostas.length,
    fechadas: propostas.filter((p) => p.status === "fechada").length,
    negociacao: propostas.filter((p) => p.status === "negociacao").length,
    perdidas: propostas.filter((p) => p.status === "perdida").length,
  }), [propostas]);

  const filtered = useMemo(() => propostas.filter((p) => {
    if (statusFilter !== "todos" && p.status !== statusFilter) return false;
    if (search && !p.nome_condominio.toLowerCase().includes(search.toLowerCase()) && !p.numero_proposta.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [propostas, statusFilter, search]);

  async function atualizarStatus(id: string, status: string) {
    const { error } = await supabase.from("propostas").update({ status }).eq("id", id);
    if (error) return toast.error("Erro ao atualizar status");
    toast.success("Status atualizado");
    qc.invalidateQueries({ queryKey: ["propostas"] });
  }

  async function excluir(id: string) {
    if (!confirm("Excluir esta proposta?")) return;
    const { error } = await supabase.from("propostas").delete().eq("id", id);
    if (error) return toast.error("Erro ao excluir");
    toast.success("Proposta excluída");
    qc.invalidateQueries({ queryKey: ["propostas"] });
  }

  async function duplicar(p: Proposta) {
    const { data: numData, error: numErr } = await supabase.rpc("generate_proposta_numero");
    if (numErr || !numData) return toast.error("Erro ao gerar número");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("propostas").insert({
      ...p,
      id: undefined as any,
      created_at: undefined as any,
      numero_proposta: numData,
      status: "enviada",
      user_id: user.id,
    });
    if (error) return toast.error("Erro ao duplicar");
    toast.success("Proposta duplicada");
    qc.invalidateQueries({ queryKey: ["propostas"] });
  }

  function resumoWhatsApp(p: Proposta) {
    const tipoLabel: Record<string, string> = { residencial: "Residencial", comercial: "Comercial", misto: "Misto" };
    const servicos: string[] = [];
    if (p.incluiu_administracao) servicos.push("✅ Administração Condominial");
    if (p.incluiu_sindico) servicos.push("✅ Síndico Profissional");
    if (p.incluiu_administracao && p.incluiu_sindico) servicos.push("🎯 Combo com 10% de desconto");
    const texto = [
      "━━━━━━━━━━━━━━━━━━━━",
      "📋 *PROPOSTA COMERCIAL*",
      `*Alpha Facilities* | Nº ${p.numero_proposta}`,
      "━━━━━━━━━━━━━━━━━━━━",
      "",
      `🏢 *${p.nome_condominio}*`,
      `📍 ${p.endereco}`,
      `📊 ${p.unidades} unidades · ${tipoLabel[p.tipo] ?? p.tipo}`,
      "",
      `👤 *Responsável:* ${p.nome_contato}`,
      `📞 ${p.telefone}`,
      `✉️ ${p.email}`,
      "",
      "🔹 *Serviços inclusos na proposta:*",
      ...servicos,
      "",
      "💬 Ficamos à disposição para esclarecer qualquer dúvida e enviar a proposta completa em PDF!",
      "",
      "━━━━━━━━━━━━━━━━━━━━",
      "*Alpha Facilities*",
      "📞 (31) 99778-7316",
      "✉️ comercial@alphafacilities.com.br",
      "🌐 www.alphafacilities.com.br",
    ].join("\n");
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank");
  }
  function baixarPDF(p: Proposta) {
    const doc = gerarPDFProposta({
      numero: p.numero_proposta,
      data: new Date(p.created_at),
      condominio: { nome: p.nome_condominio, endereco: p.endereco, unidades: p.unidades, tipo: p.tipo },
      contato: { nome: p.nome_contato, telefone: p.telefone, email: p.email },
      incluiAdmin: p.incluiu_administracao,
      incluiSindico: p.incluiu_sindico,
    });
    const dataStr = new Date(p.created_at).toISOString().slice(0, 10);
    doc.save(`Proposta_${p.nome_condominio.replace(/\s+/g, "_")}_${dataStr}.pdf`);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Propostas</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie suas propostas comerciais</p>
        </div>
        <Button asChild size="lg" className="shadow-elegant">
          <Link to="/nova"><Plus className="w-4 h-4 mr-2" />Nova Proposta</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<FileText className="w-5 h-5" />} label="Total" value={stats.total} accent="text-primary" bg="bg-primary/10" />
        <StatCard icon={<CheckCircle2 className="w-5 h-5" />} label="Fechadas" value={stats.fechadas} accent="text-emerald-600" bg="bg-emerald-100" />
        <StatCard icon={<Clock className="w-5 h-5" />} label="Em negociação" value={stats.negociacao} accent="text-amber-600" bg="bg-amber-100" />
        <StatCard icon={<XCircle className="w-5 h-5" />} label="Perdidas" value={stats.perdidas} accent="text-rose-600" bg="bg-rose-100" />
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b flex flex-wrap gap-3 items-center">
          <Input placeholder="Buscar por condomínio ou nº..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="enviada">Enviada</SelectItem>
              <SelectItem value="negociacao">Em negociação</SelectItem>
              <SelectItem value="fechada">Fechada</SelectItem>
              <SelectItem value="perdida">Perdida</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº</TableHead>
                <TableHead>Condomínio</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Serviços</TableHead>
                <TableHead>Valor base</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">Carregando...</TableCell></TableRow>}
              {!isLoading && filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  {propostas.length === 0 ? "Nenhuma proposta criada ainda. Clique em \"Nova Proposta\" para começar." : "Nenhuma proposta encontrada com os filtros aplicados."}
                </TableCell></TableRow>
              )}
              {filtered.map((p) => {
                const s = STATUS_LABEL[p.status] ?? STATUS_LABEL.enviada;
                const servicos = [p.incluiu_administracao && "Admin.", p.incluiu_sindico && "Síndico"].filter(Boolean).join(" + ");
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs font-medium">{p.numero_proposta}</TableCell>
                    <TableCell>
                      <div className="font-medium">{p.nome_condominio}</div>
                      <div className="text-xs text-muted-foreground">{p.unidades} unid. • {p.tipo}</div>
                    </TableCell>
                    <TableCell className="text-sm">{new Date(p.created_at).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell className="text-sm">{servicos || "—"}</TableCell>
                    <TableCell className="text-sm font-medium">
                      {p.valor_completo != null ? formatBRL(Number(p.valor_completo)) : (p.valor_sindico ?? "—")}
                    </TableCell>
                    <TableCell><Badge variant="outline" className={s.cls}>{s.label}</Badge></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => baixarPDF(p)}><FileDown className="w-4 h-4 mr-2" />Baixar PDF</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => duplicar(p)}><Copy className="w-4 h-4 mr-2" />Duplicar</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => atualizarStatus(p.id, "negociacao")}><Clock className="w-4 h-4 mr-2" />Marcar Em negociação</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => atualizarStatus(p.id, "fechada")}><CheckCircle2 className="w-4 h-4 mr-2" />Marcar Fechada</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => atualizarStatus(p.id, "perdida")}><XCircle className="w-4 h-4 mr-2" />Marcar Perdida</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => excluir(p.id)} className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

function StatCard({ icon, label, value, accent, bg }: { icon: React.ReactNode; label: string; value: number; accent: string; bg: string }) {
  return (
    <Card className="p-5 hover:shadow-elegant transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-3xl font-bold mt-1 tracking-tight">{value}</div>
        </div>
        <div className={`w-11 h-11 rounded-xl ${bg} ${accent} flex items-center justify-center`}>{icon}</div>
      </div>
    </Card>
  );
}
