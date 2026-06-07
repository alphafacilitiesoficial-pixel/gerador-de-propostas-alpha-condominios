import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  calcularPlanos,
  formatBRL,
  formatPlano,
  formatSindico,
  aplicarDescontoCombo,
  SERVICOS_PLANOS,
} from "./calculations";

export interface PropostaPDFData {
  numero: string;
  data: Date;
  condominio: { nome: string; endereco: string; unidades: number; tipo: string };
  contato: { nome: string; telefone: string; email: string };
  incluiAdmin: boolean;
  incluiSindico: boolean;
}

const BRAND = "#1E40AF";
const GRAY = "#64748B";
const LIGHT = "#F1F5F9";

export function gerarPDFProposta(d: PropostaPDFData): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 40;
  let y = margin;

  const calc = calcularPlanos(d.condominio.unidades);

  // Header bar
  doc.setFillColor(BRAND);
  doc.rect(0, 0, pageW, 90, "F");

  // Logo placeholder
  doc.setFillColor("#FFFFFF");
  doc.roundedRect(margin, 20, 150, 50, 4, 4, "F");
  doc.setTextColor(BRAND);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("ALPHA", margin + 75, 45, { align: "center" });
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("CONDOMÍNIOS", margin + 75, 58, { align: "center" });

  doc.setTextColor("#FFFFFF");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("PROPOSTA COMERCIAL", pageW - margin, 40, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(d.numero, pageW - margin, 58, { align: "right" });
  doc.text(`Emissão: ${d.data.toLocaleDateString("pt-BR")}`, pageW - margin, 72, { align: "right" });
  const validade = new Date(d.data); validade.setDate(validade.getDate() + 30);
  doc.text(`Validade: ${validade.toLocaleDateString("pt-BR")} (30 dias)`, pageW - margin, 84, { align: "right" });

  y = 120;
  doc.setTextColor("#0F172A");

  // CLIENTE
  sectionTitle(doc, "DADOS DO CLIENTE", y);
  y += 24;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const linhas = [
    [`Condomínio:`, d.condominio.nome],
    [`Endereço:`, d.condominio.endereco],
    [`Unidades:`, `${d.condominio.unidades}`],
    [`Tipo:`, d.condominio.tipo],
    [`Responsável:`, d.contato.nome],
    [`Telefone:`, d.contato.telefone],
    [`E-mail:`, d.contato.email],
  ];
  for (const [k, v] of linhas) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(GRAY);
    doc.text(k, margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor("#0F172A");
    doc.text(String(v), margin + 80, y);
    y += 14;
  }
  y += 10;

  // ADMINISTRAÇÃO - tabela comparativa
  if (d.incluiAdmin) {
    sectionTitle(doc, "PLANOS DE ADMINISTRAÇÃO", y);
    y += 14;

    autoTable(doc, {
      startY: y,
      head: [["ESSENCIAL", "COMPLETO ★", "PREMIUM"]],
      body: [[formatPlano(calc.essencial), formatPlano(calc.completo), formatPlano(calc.premium)]],
      theme: "grid",
      headStyles: { fillColor: BRAND, textColor: "#FFFFFF", halign: "center", fontStyle: "bold", fontSize: 11 },
      bodyStyles: { halign: "center", fontStyle: "bold", fontSize: 13, textColor: "#0F172A" },
      columnStyles: { 1: { fillColor: "#EFF6FF" } },
      margin: { left: margin, right: margin },
    });
    y = (doc as any).lastAutoTable.finalY + 6;

    const rows: string[][] = [];
    const max = Math.max(SERVICOS_PLANOS.essencial.length, SERVICOS_PLANOS.completo.length, SERVICOS_PLANOS.premium.length);
    for (let i = 0; i < max; i++) {
      rows.push([
        SERVICOS_PLANOS.essencial[i] ? "✓ " + SERVICOS_PLANOS.essencial[i] : "",
        SERVICOS_PLANOS.completo[i] ? "✓ " + SERVICOS_PLANOS.completo[i] : "",
        SERVICOS_PLANOS.premium[i] ? "✓ " + SERVICOS_PLANOS.premium[i] : "",
      ]);
    }
    autoTable(doc, {
      startY: y,
      body: rows,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 5, textColor: "#334155" },
      columnStyles: { 1: { fillColor: "#EFF6FF" } },
      margin: { left: margin, right: margin },
    });
    y = (doc as any).lastAutoTable.finalY + 20;
  }

  // SÍNDICO
  if (d.incluiSindico) {
    if (y > 680) { doc.addPage(); y = margin; }
    sectionTitle(doc, "SÍNDICO PROFISSIONAL", y);
    y += 24;

    doc.setFillColor(LIGHT);
    doc.roundedRect(margin, y, pageW - margin * 2, 38, 4, 4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(BRAND);
    doc.text(`Investimento: ${formatSindico(calc.sindico)}`, margin + 12, y + 24);
    y += 50;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor("#334155");
    doc.text("Responsabilidades incluídas:", margin, y);
    y += 12;
    for (const s of SERVICOS_PLANOS.sindico) {
      doc.text(`• ${s}`, margin + 8, y);
      y += 11;
    }
    y += 6;
    doc.setFont("helvetica", "italic");
    doc.setTextColor(GRAY);
    doc.setFontSize(8);
    doc.text("* Exige contratação conjunta de plano de Administração.", margin, y);
    y += 18;
  }

  // INVESTIMENTO TOTAL (combo)
  if (d.incluiAdmin && d.incluiSindico) {
    if (y > 660) { doc.addPage(); y = margin; }
    sectionTitle(doc, "INVESTIMENTO TOTAL — COMBO (10% DE DESCONTO)", y);
    y += 14;
    autoTable(doc, {
      startY: y,
      head: [["Plano", "Administração", "Síndico", "Combo c/ desconto"]],
      body: [
        ["Essencial + Síndico", formatPlano(calc.essencial), formatSindico(calc.sindico), aplicarDescontoCombo(calc.essencial, calc.sindico)],
        ["Completo + Síndico", formatPlano(calc.completo), formatSindico(calc.sindico), aplicarDescontoCombo(calc.completo, calc.sindico)],
        ["Premium + Síndico", formatPlano(calc.premium), formatSindico(calc.sindico), aplicarDescontoCombo(calc.premium, calc.sindico)],
      ],
      theme: "grid",
      headStyles: { fillColor: BRAND, textColor: "#FFFFFF", fontSize: 10 },
      bodyStyles: { fontSize: 9 },
      columnStyles: { 3: { fontStyle: "bold", textColor: BRAND, halign: "right" } },
      margin: { left: margin, right: margin },
    });
    y = (doc as any).lastAutoTable.finalY + 20;
  }

  // OBSERVAÇÕES
  if (y > 700) { doc.addPage(); y = margin; }
  sectionTitle(doc, "OBSERVAÇÕES", y);
  y += 20;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor("#334155");
  const inicio = new Date(d.data); inicio.setDate(inicio.getDate() + 15);
  const obs = [
    "• Reajuste anual com base no índice IGPM-FGV.",
    "• Esta proposta tem validade de 30 dias a contar da data de emissão.",
    `• Início previsto dos serviços: ${inicio.toLocaleDateString("pt-BR")}.`,
    "• Valores referem-se a serviços prestados mensalmente.",
  ];
  for (const o of obs) { doc.text(o, margin, y); y += 12; }

  // FOOTER em todas as páginas
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    const pageH = doc.internal.pageSize.getHeight();
    doc.setDrawColor(BRAND);
    doc.setLineWidth(0.5);
    doc.line(margin, pageH - 56, pageW - margin, pageH - 56);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(BRAND);
    doc.text("ALPHA CONDOMÍNIOS", margin, pageH - 42);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(GRAY);
    doc.text("Rua José Cleto, 200 — Sala 501, Palmares, Belo Horizonte/MG", margin, pageH - 30);
    doc.text("WhatsApp: (31) 99778-7316  |  comercial@alphafacilities.com.br", margin, pageH - 18);
    doc.text(`Página ${i}/${total}`, pageW - margin, pageH - 18, { align: "right" });
  }

  return doc;
}

function sectionTitle(doc: jsPDF, text: string, y: number) {
  const margin = 40;
  doc.setFillColor(BRAND);
  doc.rect(margin, y - 12, 4, 16, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor("#0F172A");
  doc.text(text, margin + 12, y);
}
