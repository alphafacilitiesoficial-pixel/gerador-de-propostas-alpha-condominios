// Cálculo automático dos planos Alpha Condomínios

export type PlanoEssencial = { tipo: "valor"; mensal: number; porUnidade: number } | { tipo: "consulta"; texto: string };
export type PlanoSindico = { tipo: "valor"; mensal: number } | { tipo: "consulta"; texto: string };

export interface Calculo {
  essencial: PlanoEssencial;
  completo: PlanoEssencial;
  premium: PlanoEssencial;
  sindico: PlanoSindico;
}

function calcAdmin(unidades: number, faixas: { ate: number; valor: number }[], minimo?: number, primeiraFaixa?: number): PlanoEssencial {
  for (const f of faixas) {
    if (unidades <= f.ate) {
      let total = unidades * f.valor;
      if (minimo && unidades <= (primeiraFaixa ?? 0) && total < minimo) total = minimo;
      return { tipo: "valor", mensal: total, porUnidade: f.valor };
    }
  }
  const ultima = faixas[faixas.length - 1];
  return { tipo: "valor", mensal: unidades * ultima.valor, porUnidade: ultima.valor };
}

export function calcularPlanos(unidades: number): Calculo {
  // ESSENCIAL
  const essencial: PlanoEssencial = calcAdmin(
    unidades,
    [
      { ate: 20, valor: 22.5 },
      { ate: 40, valor: 18.5 },
      { ate: 80, valor: 16.5 },
      { ate: Infinity, valor: 14.5 },
    ],
    450,
    20,
  );

  // COMPLETO
  const completo: PlanoEssencial = calcAdmin(
    unidades,
    [
      { ate: 20, valor: 27.5 },
      { ate: 40, valor: 22.5 },
      { ate: 80, valor: 19.5 },
      { ate: Infinity, valor: 17.5 },
    ],
    550,
    20,
  );

  // PREMIUM
  let premium: PlanoEssencial;
  if (unidades >= 151) {
    premium = { tipo: "consulta", texto: "Sob consulta" };
  } else if (unidades <= 40) {
    const total = Math.max(unidades * 35, 750);
    premium = { tipo: "valor", mensal: total, porUnidade: 35 };
  } else if (unidades <= 80) {
    premium = { tipo: "valor", mensal: unidades * 27.5, porUnidade: 27.5 };
  } else {
    premium = { tipo: "valor", mensal: unidades * 22.5, porUnidade: 22.5 };
  }

  // SÍNDICO
  let sindico: PlanoSindico;
  if (unidades <= 15) sindico = { tipo: "valor", mensal: 1350 };
  else if (unidades <= 20) sindico = { tipo: "valor", mensal: 1800 };
  else if (unidades <= 40) sindico = { tipo: "valor", mensal: 2800 };
  else if (unidades <= 80) sindico = { tipo: "valor", mensal: 4200 };
  else if (unidades <= 150) sindico = { tipo: "consulta", texto: "7% da arrecadação (mínimo R$ 5.500)" };
  else sindico = { tipo: "consulta", texto: "8 a 10% da arrecadação — Consultar" };

  return { essencial, completo, premium, sindico };
}

export function formatBRL(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatPlano(p: PlanoEssencial): string {
  return p.tipo === "valor" ? formatBRL(p.mensal) + "/mês" : p.texto;
}

export function formatSindico(s: PlanoSindico): string {
  return s.tipo === "valor" ? formatBRL(s.mensal) + "/mês" : s.texto;
}

// Aplica desconto combo
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
