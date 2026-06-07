// Cálculo automático dos planos Alpha Condomínios
// Nova tabela de preços (administração por faixa + síndico por unidades)

const SALARIO_MINIMO = Number(import.meta.env.VITE_SALARIO_MINIMO || "") || 0;

export type PlanoEssencial =
  | { tipo: "valor"; mensal: number; porUnidade: number }
  | { tipo: "consulta"; texto: string };

export type PlanoSindico =
  | { tipo: "valor"; mensal: number; label?: string }
  | { tipo: "consulta"; texto: string };

export interface Calculo {
  essencial: PlanoEssencial;
  completo: PlanoEssencial;
  premium: PlanoEssencial;
  sindico: PlanoSindico;
}

// ===== ADMINISTRAÇÃO =====
function calcAdminEssencial(unidades: number): PlanoEssencial {
  if (unidades <= 28) return { tipo: "valor", mensal: 450, porUnidade: 450 / Math.max(unidades, 1) };
  if (unidades <= 50) return { tipo: "valor", mensal: unidades * 15.5, porUnidade: 15.5 };
  if (unidades <= 80) return { tipo: "valor", mensal: unidades * 14.5, porUnidade: 14.5 };
  return { tipo: "valor", mensal: unidades * 12.5, porUnidade: 12.5 };
}

function calcAdminCompleto(unidades: number): PlanoEssencial {
  if (unidades <= 28) return { tipo: "valor", mensal: 550, porUnidade: 550 / Math.max(unidades, 1) };
  if (unidades <= 50) return { tipo: "valor", mensal: unidades * 17.5, porUnidade: 17.5 };
  if (unidades <= 80) return { tipo: "valor", mensal: unidades * 18.5, porUnidade: 18.5 };
  return { tipo: "valor", mensal: unidades * 15.5, porUnidade: 15.5 };
}

function calcAdminPremium(unidades: number): PlanoEssencial {
  if (unidades <= 28) return { tipo: "valor", mensal: 650, porUnidade: 650 / Math.max(unidades, 1) };
  if (unidades <= 50) return { tipo: "valor", mensal: unidades * 18.5, porUnidade: 18.5 };
  if (unidades <= 80) return { tipo: "valor", mensal: unidades * 17.5, porUnidade: 17.5 };
  return { tipo: "valor", mensal: unidades * 16.5, porUnidade: 16.5 };
}

// ===== SÍNDICO =====
function calcSindico(unidades: number): PlanoSindico {
  if (unidades <= 16) return { tipo: "valor", mensal: 1000, label: "R$ 1.000,00/mês" };
  if (unidades <= 40) {
    if (SALARIO_MINIMO) return { tipo: "valor", mensal: SALARIO_MINIMO, label: `1 salário-mínimo/mês (${formatBRL(SALARIO_MINIMO)})` };
    return { tipo: "consulta", texto: "1 salário-mínimo/mês" };
  }
  if (unidades <= 80) {
    if (SALARIO_MINIMO) {
      const v = SALARIO_MINIMO * 1.5;
      return { tipo: "valor", mensal: v, label: `1,5 salário-mínimo/mês (${formatBRL(v)})` };
    }
    return { tipo: "consulta", texto: "1,5 salário-mínimo/mês" };
  }
  return { tipo: "consulta", texto: "Necessário visita ao condomínio para avaliar estrutura e demanda" };
}

export function calcularPlanos(unidades: number): Calculo {
  return {
    essencial: calcAdminEssencial(unidades),
    completo: calcAdminCompleto(unidades),
    premium: calcAdminPremium(unidades),
    sindico: calcSindico(unidades),
  };
}

export function formatBRL(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatPlano(p: PlanoEssencial): string {
  return p.tipo === "valor" ? formatBRL(p.mensal) + "/mês" : p.texto;
}

export function formatSindico(s: PlanoSindico): string {
  if (s.tipo === "valor") return s.label ?? formatBRL(s.mensal) + "/mês";
  return s.texto;
}

export function aplicarDescontoCombo(plano: PlanoEssencial, sindico: PlanoSindico): string {
  if (plano.tipo !== "valor" || sindico.tipo !== "valor") return "Sob consulta";
  const total = (plano.mensal + sindico.mensal) * 0.9;
  return formatBRL(total) + "/mês";
}

export const SERVICOS_PLANOS = {
  essencial: [
    "Emissão de boletos",
    "Cobrança de inadimplentes",
    "Balancete digital mensal",
    "Portal do condômino",
    "Suporte via WhatsApp",
  ],
  completo: [
    "Tudo do Plano Essencial",
    "Rateio de água e gás",
    "Planejamento orçamentário anual",
    "Gestão de contas a pagar",
    "Elaboração de atas e convocações",
    "Pagamentos online integrados",
    "Relatórios gerenciais",
  ],
  premium: [
    "Tudo do Plano Completo",
    "Assessoria jurídica condominial",
    "Cumprimento de obrigações fiscais",
    "Gestão de obras e reformas",
    "Revisão anual da convenção",
    "Atendimento prioritário SLA 12h",
    "Relatório trimestral de desempenho",
  ],
  sindico: [
    "Representação legal do condomínio",
    "Gestão de funcionários e fornecedores",
    "Convocação e condução de assembleias",
    "Cumprimento de obrigações trabalhistas",
    "Fiscalização de contratos e obras",
    "Atendimento aos condôminos",
    "Aplicação do regimento interno",
  ],
};
