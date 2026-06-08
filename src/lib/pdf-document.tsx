import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import {
  calcularPlanos,
  formatPlano,
  formatSindico,
  aplicarDescontoCombo,
} from "./calculations";

// Using default Helvetica font (built-in to react-pdf) for maximum reliability.
// External font registration via Google Fonts CDN can fail and silently break PDF generation.

// Brand colors
const NAVY = "#1B2A4A";
const NAVY_DARK = "#0F1B33";
const GOLD = "#C8A961";
const GOLD_LIGHT = "#E5D4A1";
const WHITE = "#FFFFFF";
const GRAY_50 = "#F7F8FA";
const GRAY_100 = "#EFF1F5";
const GRAY_300 = "#CBD0DA";
const GRAY_500 = "#6B7280";
const GRAY_700 = "#374151";
const TEXT = "#111827";

const s = StyleSheet.create({
  page: { fontFamily: "Montserrat", fontSize: 10, color: TEXT, paddingTop: 50, paddingBottom: 60, paddingHorizontal: 50, backgroundColor: WHITE },
  pageNavy: { fontFamily: "Montserrat", fontSize: 10, color: WHITE, backgroundColor: NAVY, padding: 0 },

  // Header / titles
  badge: { fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 },
  badgeNavy: { fontSize: 8, color: NAVY, letterSpacing: 2, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 },
  h1: { fontSize: 26, fontWeight: 800, color: NAVY, marginBottom: 14, letterSpacing: -0.5 },
  h1White: { fontSize: 30, fontWeight: 800, color: WHITE, marginBottom: 12, letterSpacing: -0.5, lineHeight: 1.15 },
  h2: { fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 6 },
  subtitle: { fontSize: 11, color: GRAY_500, marginBottom: 24, lineHeight: 1.5 },
  paragraph: { fontSize: 10.5, color: GRAY_700, lineHeight: 1.65, marginBottom: 10 },

  divider: { height: 3, width: 48, backgroundColor: GOLD, marginBottom: 18 },

  // Footer
  footer: { position: "absolute", bottom: 24, left: 50, right: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTopWidth: 0.5, borderTopColor: GRAY_300 },
  footerText: { fontSize: 8, color: GRAY_500 },
  footerBrand: { fontSize: 8, color: NAVY, fontWeight: 700, letterSpacing: 1 },

  // Cards
  cardGrid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -6 },
  card: { width: "50%", padding: 6 },
  cardInner: { backgroundColor: WHITE, borderWidth: 1, borderColor: GRAY_100, borderRadius: 8, padding: 16, height: 130 },
  cardIcon: { fontSize: 22, marginBottom: 8, color: GOLD },
  cardTitle: { fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 4 },
  cardDesc: { fontSize: 9, color: GRAY_500, lineHeight: 1.5 },

  // Pills
  pillRow: { flexDirection: "row", marginTop: 20 },
  pill: { backgroundColor: NAVY, color: WHITE, paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, fontSize: 9, fontWeight: 600, marginRight: 8 },

  // Plan page
  planHero: { backgroundColor: NAVY, padding: 24, borderRadius: 10, marginBottom: 20 },
  planHeroBadge: { fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: 700, marginBottom: 6 },
  planHeroTitle: { fontSize: 26, color: WHITE, fontWeight: 800, marginBottom: 4 },
  planHeroSub: { fontSize: 10, color: GOLD_LIGHT, fontWeight: 500 },
  highlightBadge: { position: "absolute", top: 18, right: 18, backgroundColor: GOLD, color: NAVY, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 14, fontSize: 8, fontWeight: 700, letterSpacing: 1 },

  idealBox: { backgroundColor: GRAY_50, padding: 14, borderRadius: 6, borderLeftWidth: 3, borderLeftColor: GOLD, marginBottom: 18 },
  idealLabel: { fontSize: 9, color: NAVY, fontWeight: 700, marginBottom: 4, letterSpacing: 1 },
  idealText: { fontSize: 10, color: GRAY_700, fontStyle: "italic", lineHeight: 1.5 },

  serviceRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10, paddingBottom: 10, borderBottomWidth: 0.5, borderBottomColor: GRAY_100 },
  checkIcon: { fontSize: 12, color: GOLD, fontWeight: 700, marginRight: 10, marginTop: 1 },
  serviceText: { fontSize: 10.5, color: GRAY_700, flex: 1, lineHeight: 1.5 },

  invBox: { marginTop: 18, backgroundColor: NAVY, padding: 22, borderRadius: 10, alignItems: "center" },
  invLabel: { fontSize: 9, color: GOLD, letterSpacing: 2, fontWeight: 700, marginBottom: 6 },
  invValue: { fontSize: 28, color: WHITE, fontWeight: 800 },
  invNote: { fontSize: 8, color: GOLD_LIGHT, marginTop: 6 },

  // Comparison table
  table: { borderWidth: 1, borderColor: GRAY_100, borderRadius: 6, overflow: "hidden", marginBottom: 14 },
  thRow: { flexDirection: "row", backgroundColor: NAVY },
  th: { color: WHITE, fontSize: 9.5, fontWeight: 700, padding: 10, textAlign: "center" },
  thFirst: { color: WHITE, fontSize: 9.5, fontWeight: 700, padding: 10, textAlign: "left" },
  thHighlight: { color: NAVY, fontSize: 9.5, fontWeight: 700, padding: 10, textAlign: "center", backgroundColor: GOLD },
  tr: { flexDirection: "row", borderTopWidth: 0.5, borderTopColor: GRAY_100 },
  trAlt: { flexDirection: "row", borderTopWidth: 0.5, borderTopColor: GRAY_100, backgroundColor: GRAY_50 },
  td: { padding: 8, fontSize: 9, color: GRAY_700, textAlign: "center" },
  tdFirst: { padding: 8, fontSize: 9, color: TEXT, fontWeight: 600 },
  catRow: { backgroundColor: NAVY_DARK, padding: 6, paddingLeft: 10 },
  catText: { color: GOLD, fontSize: 8.5, fontWeight: 700, letterSpacing: 1 },

  // Conditions grid
  condGrid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -7 },
  condCell: { width: "50%", padding: 7 },
  condBox: { borderWidth: 1, borderColor: GRAY_100, borderRadius: 8, padding: 16, backgroundColor: GRAY_50, minHeight: 100 },
  condIcon: { fontSize: 18, color: GOLD, marginBottom: 6 },
  condTitle: { fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 4 },
  condText: { fontSize: 9.5, color: GRAY_700, lineHeight: 1.5 },

  // Next steps
  stepRow: { flexDirection: "row", marginBottom: 18, alignItems: "flex-start" },
  stepNumWrap: { width: 50, height: 50, borderRadius: 25, backgroundColor: NAVY, alignItems: "center", justifyContent: "center", marginRight: 16 },
  stepNum: { color: GOLD, fontSize: 20, fontWeight: 800 },
  stepBody: { flex: 1, paddingTop: 4 },
  stepTitle: { fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 4 },
  stepDesc: { fontSize: 10, color: GRAY_700, lineHeight: 1.5 },

  // Cover
  coverWrap: { flex: 1, flexDirection: "row", backgroundColor: NAVY },
  coverLeft: { width: "60%", padding: 50, paddingTop: 60, justifyContent: "space-between" },
  coverRight: { width: "40%", backgroundColor: NAVY_DARK, padding: 0, position: "relative" },
  coverLogoBox: { width: 70, height: 70, borderRadius: 8, backgroundColor: GOLD, alignItems: "center", justifyContent: "center", marginBottom: 0 },
  coverLogoMark: { color: NAVY, fontSize: 28, fontWeight: 800, letterSpacing: -1 },
  coverPreparedLabel: { fontSize: 8, color: GOLD, letterSpacing: 3, fontWeight: 700, marginBottom: 8 },
  coverPreparedName: { fontSize: 16, color: WHITE, fontWeight: 700, marginBottom: 2 },
  coverPreparedSub: { fontSize: 11, color: GOLD_LIGHT, fontWeight: 500 },
  coverDate: { fontSize: 10, color: GRAY_300, marginTop: 4 },
  coverContactCard: { position: "absolute", bottom: 40, right: 40, left: 40, backgroundColor: WHITE, borderRadius: 8, padding: 16 },
  coverContactRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  coverContactText: { fontSize: 9, color: NAVY, fontWeight: 600 },
  coverGoldBar: { position: "absolute", top: 0, left: 0, width: 6, height: "100%", backgroundColor: GOLD },
  coverNumberBadge: { position: "absolute", top: 50, right: 50, fontSize: 9, color: GOLD, letterSpacing: 2, fontWeight: 700 },
  coverDecor1: { position: "absolute", top: 80, right: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(200,169,97,0.08)" },
  coverDecor2: { position: "absolute", bottom: 220, right: 60, width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(200,169,97,0.05)" },
});

export interface PropostaDocProps {
  numero: string;
  data: Date;
  cidade?: string;
  condominio: { nome: string; endereco: string; unidades: number; tipo: string };
  contato: { nome: string; telefone: string; email: string };
  incluiAdmin: boolean;
  incluiSindico: boolean;
  empresa?: { nome: string; telefone: string; email: string };
  quemSomos?: string[];
}

const DEFAULT_EMPRESA = {
  nome: "Alpha Condomínios",
  telefone: "(31) 99778-7316",
  email: "comercial@alphacondominios.com.br",
};

const DEFAULT_QUEM_SOMOS = [
  "A Alpha Condomínios nasceu para transformar a administração de condomínios em Belo Horizonte e região metropolitana, oferecendo uma gestão profissional, transparente e humana. Atuamos com tecnologia de ponta e equipe altamente qualificada para garantir tranquilidade ao síndico e valorização do patrimônio dos condôminos.",
  "Combinamos rigor técnico-contábil, agilidade no atendimento e proximidade com cada cliente. Acreditamos que cada condomínio é único — por isso, nossa proposta de valor é construída sob medida, sempre orientada por ética, eficiência e foco em resultados duradouros.",
];

const DIFERENCIAIS = [
  { icon: "★", title: "Atendimento Personalizado", desc: "Gestor dedicado e canais ágeis (WhatsApp, e-mail, telefone) com SLA definido." },
  { icon: "◉", title: "Transparência Total", desc: "Portal do condômino com balancetes, documentos e movimentações em tempo real." },
  { icon: "✦", title: "Tecnologia e Inovação", desc: "Plataforma digital integrada, pagamentos online e relatórios automatizados." },
  { icon: "⚖", title: "Suporte Jurídico/Contábil", desc: "Assessoria especializada para cobranças, atas e obrigações fiscais." },
  { icon: "♛", title: "Equipe Especializada", desc: "Profissionais com formação técnica e experiência prática em condomínios." },
  { icon: "❖", title: "Gestão Digital Completa", desc: "Boletos, comunicados, atas e prestação de contas 100% digital." },
];

const SERVICOS_GRID = [
  { icon: "$", title: "Gestão Financeira", desc: "Emissão de boletos, cobrança, conciliação bancária e balancetes." },
  { icon: "⚙", title: "Gestão de Manutenção", desc: "Acompanhamento de fornecedores, orçamentos e ordens de serviço." },
  { icon: "▤", title: "Gestão Administrativa", desc: "Atas, convocações, comunicados e arquivo documental." },
  { icon: "✚", title: "Gestão de RH", desc: "Folha, encargos, férias e obrigações trabalhistas dos funcionários." },
  { icon: "§", title: "Assessoria Jurídica", desc: "Cobranças, ações de inadimplência e orientações sobre a Lei 4.591/64." },
  { icon: "◈", title: "Tecnologia", desc: "Portal do condômino, app, integração bancária e relatórios online." },
];

const PLANO_ESSENCIAL_ITENS = [
  "Emissão e envio de boletos para os condôminos",
  "Cobrança ativa de inadimplentes",
  "Rateio mensal de despesas",
  "Balancete digital mensal",
  "Portal do condômino com acesso ao financeiro",
  "Suporte via WhatsApp e e-mail",
];

const PLANO_COMPLETO_ITENS = [
  "Planejamento orçamentário anual",
  "Gestão de contas a pagar e a receber",
  "Comunicados, atas e avisos digitais",
  "Integração com Internet Banking",
  "Conciliação bancária automatizada",
  "Relatórios gerenciais mensais",
];

const PLANO_PREMIUM_ITENS = [
  "Elaboração e revisão do regimento interno",
  "Cadastros completos de condôminos e prestadores",
  "Acompanhamento de normas e legislação vigente",
  "Obrigações acessórias (RAIS, DIRF, eSocial)",
  "Assessoria jurídica condominial preventiva",
  "Atendimento prioritário com SLA de 12 horas",
];

const COMPARATIVO = [
  { categoria: "Financeiro", itens: [
    { nome: "Emissão de boletos", e: true, c: true, p: true },
    { nome: "Cobrança de inadimplentes", e: true, c: true, p: true },
    { nome: "Balancete digital mensal", e: true, c: true, p: true },
    { nome: "Planejamento orçamentário anual", e: false, c: true, p: true },
    { nome: "Conciliação bancária automatizada", e: false, c: true, p: true },
  ]},
  { categoria: "Administrativo", itens: [
    { nome: "Portal do condômino", e: true, c: true, p: true },
    { nome: "Atas, convocações e comunicados", e: false, c: true, p: true },
    { nome: "Cadastros completos e regimento", e: false, c: false, p: true },
    { nome: "Gestão de RH e prestadores", e: false, c: true, p: true },
  ]},
  { categoria: "Assessoria Legal", itens: [
    { nome: "Suporte jurídico básico", e: true, c: true, p: true },
    { nome: "Obrigações acessórias (RAIS/DIRF)", e: false, c: false, p: true },
    { nome: "Assessoria jurídica preventiva", e: false, c: false, p: true },
    { nome: "Atendimento prioritário SLA 12h", e: false, c: false, p: true },
  ]},
];

const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

function formatDateExt(d: Date, cidade: string): string {
  return `${cidade}, ${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
}

function extrairCidade(endereco: string): string {
  // try to find "cidade/UF" pattern
  const m = endereco.match(/([A-Za-zÀ-ÿ\s]+)\s*[/-]\s*[A-Z]{2}/);
  if (m) return m[1].trim();
  const parts = endereco.split(",").map((p) => p.trim()).filter(Boolean);
  return parts[parts.length - 1] || "Belo Horizonte";
}

function FooterBar({ pagina }: { pagina: string }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerBrand}>ALPHA CONDOMÍNIOS</Text>
      <Text style={s.footerText}>{pagina}</Text>
    </View>
  );
}

function SectionHeader({ badge, title }: { badge: string; title: string }) {
  return (
    <View style={{ marginBottom: 22 }}>
      <Text style={s.badge}>{badge}</Text>
      <Text style={s.h1}>{title}</Text>
      <View style={s.divider} />
    </View>
  );
}

export function PropostaDocument(props: PropostaDocProps) {
  const { numero, data, condominio, contato, incluiAdmin, incluiSindico } = props;
  const empresa = props.empresa ?? DEFAULT_EMPRESA;
  const quemSomos = props.quemSomos ?? DEFAULT_QUEM_SOMOS;
  const cidade = props.cidade ?? extrairCidade(condominio.endereco);
  const calc = calcularPlanos(condominio.unidades);
  const dataExt = formatDateExt(data, cidade);

  return (
    <Document title={`Proposta ${numero} — ${condominio.nome}`} author={empresa.nome}>
      {/* ============ PAGE 1: COVER ============ */}
      <Page size="A4" style={s.pageNavy}>
        <View style={s.coverWrap}>
          <View style={s.coverLeft}>
            <View>
              <View style={s.coverLogoBox}>
                <Text style={s.coverLogoMark}>A</Text>
              </View>
              <Text style={{ color: GOLD, fontSize: 9, letterSpacing: 4, fontWeight: 700, marginTop: 8 }}>ALPHA CONDOMÍNIOS</Text>
            </View>

            <View>
              <Text style={{ ...s.badge, color: GOLD, marginBottom: 14 }}>PROPOSTA COMERCIAL Nº {numero}</Text>
              <Text style={s.h1White}>Gestão Eficiente{"\n"}& Humana</Text>
              <Text style={{ fontSize: 12, color: GOLD_LIGHT, lineHeight: 1.6, marginTop: 8, maxWidth: 320 }}>
                Administração profissional de condomínios com transparência, tecnologia e inovação.
              </Text>
            </View>

            <View>
              <Text style={s.coverPreparedLabel}>PREPARADO PARA</Text>
              <Text style={s.coverPreparedName}>{condominio.nome}</Text>
              <Text style={s.coverPreparedSub}>A/C: {contato.nome}</Text>
              <Text style={s.coverDate}>{dataExt}</Text>
            </View>
          </View>

          <View style={s.coverRight}>
            <View style={s.coverGoldBar} />
            <View style={s.coverDecor1} />
            <View style={s.coverDecor2} />
            <View style={{ position: "absolute", top: 80, left: 30, right: 30 }}>
              <Text style={{ fontSize: 90, color: "rgba(200,169,97,0.15)", fontWeight: 800, letterSpacing: -4 }}>A</Text>
              <Text style={{ fontSize: 9, color: GOLD, letterSpacing: 3, fontWeight: 700, marginTop: -10 }}>EXCELÊNCIA EM{"\n"}GESTÃO CONDOMINIAL</Text>
            </View>

            <View style={s.coverContactCard}>
              <View style={s.coverLogoBox && { width: 30, height: 30, borderRadius: 4, backgroundColor: NAVY, alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                <Text style={{ color: GOLD, fontSize: 13, fontWeight: 800 }}>A</Text>
              </View>
              <View style={s.coverContactRow}>
                <Text style={{ color: GOLD, fontSize: 10, marginRight: 6 }}>✆</Text>
                <Text style={s.coverContactText}>{empresa.telefone}</Text>
              </View>
              <View style={s.coverContactRow}>
                <Text style={{ color: GOLD, fontSize: 10, marginRight: 6 }}>✉</Text>
                <Text style={s.coverContactText}>{empresa.email}</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>

      {/* ============ PAGE 2: QUEM SOMOS ============ */}
      <Page size="A4" style={s.page}>
        <SectionHeader badge="ALPHA CONDOMÍNIOS" title="Quem Somos" />
        {quemSomos.map((p, i) => <Text key={i} style={s.paragraph}>{p}</Text>)}

        <View style={s.pillRow}>
          <Text style={s.pill}>Ética</Text>
          <Text style={s.pill}>Agilidade</Text>
          <Text style={s.pill}>Foco no Cliente</Text>
        </View>

        <View style={{ marginTop: 36, backgroundColor: GRAY_50, padding: 22, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: GOLD }}>
          <Text style={{ fontSize: 9, color: NAVY, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>POR QUE ESCOLHER A ALPHA?</Text>
          <Text style={{ fontSize: 11, color: GRAY_700, lineHeight: 1.6 }}>
            Porque entregamos mais do que administração: entregamos tranquilidade. Cada decisão é tomada com base em dados, ética e respeito ao patrimônio do condomínio.
          </Text>
        </View>

        <FooterBar pagina="02 / 10  ·  Quem Somos" />
      </Page>

      {/* ============ PAGE 3: DIFERENCIAIS ============ */}
      <Page size="A4" style={s.page}>
        <SectionHeader badge="ALPHA · POR QUE NOS ESCOLHER" title="Nossos Diferenciais" />
        <View style={s.cardGrid}>
          {DIFERENCIAIS.map((c, i) => (
            <View key={i} style={s.card}>
              <View style={s.cardInner}>
                <Text style={s.cardIcon}>{c.icon}</Text>
                <Text style={s.cardTitle}>{c.title}</Text>
                <Text style={s.cardDesc}>{c.desc}</Text>
              </View>
            </View>
          ))}
        </View>
        <FooterBar pagina="03 / 10  ·  Diferenciais" />
      </Page>

      {/* ============ PAGE 4: SERVIÇOS ============ */}
      <Page size="A4" style={s.page}>
        <SectionHeader badge="O QUE OFERECEMOS · ALPHA" title="Nossos Serviços" />
        <View style={s.cardGrid}>
          {SERVICOS_GRID.map((c, i) => (
            <View key={i} style={s.card}>
              <View style={s.cardInner}>
                <Text style={s.cardIcon}>{c.icon}</Text>
                <Text style={s.cardTitle}>{c.title}</Text>
                <Text style={s.cardDesc}>{c.desc}</Text>
              </View>
            </View>
          ))}
        </View>
        <FooterBar pagina="04 / 10  ·  Serviços" />
      </Page>

      {/* ============ PAGE 5: ESSENCIAL ============ */}
      <Page size="A4" style={s.page}>
        <Text style={s.badge}>PLANOS DE SERVIÇO</Text>
        <View style={s.planHero}>
          <Text style={s.planHeroBadge}>NÍVEL 1</Text>
          <Text style={s.planHeroTitle}>Plano Essencial</Text>
          <Text style={s.planHeroSub}>Gestão financeira e cobrança eficiente</Text>
        </View>

        <View style={s.idealBox}>
          <Text style={s.idealLabel}>IDEAL PARA</Text>
          <Text style={s.idealText}>Condomínios que buscam organização financeira sólida, transparência nas cobranças e relatórios mensais claros.</Text>
        </View>

        <Text style={{ fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 12, letterSpacing: 1 }}>SERVIÇOS INCLUSOS</Text>
        {PLANO_ESSENCIAL_ITENS.map((it, i) => (
          <View key={i} style={s.serviceRow}>
            <Text style={s.checkIcon}>✓</Text>
            <Text style={s.serviceText}>{it}</Text>
          </View>
        ))}

        {incluiAdmin && (
          <View style={s.invBox}>
            <Text style={s.invLabel}>INVESTIMENTO MENSAL</Text>
            <Text style={s.invValue}>{formatPlano(calc.essencial)}</Text>
            <Text style={s.invNote}>Para {condominio.unidades} unidades · reajuste anual pelo IPCA/IGP-M</Text>
          </View>
        )}

        <FooterBar pagina="05 / 10  ·  Plano Essencial" />
      </Page>

      {/* ============ PAGE 6: COMPLETO ============ */}
      <Page size="A4" style={s.page}>
        <Text style={s.badge}>PLANOS DE SERVIÇO</Text>
        <View style={s.planHero}>
          <Text style={s.highlightBadge}>★ MAIS CONTRATADO</Text>
          <Text style={s.planHeroBadge}>NÍVEL 2</Text>
          <Text style={s.planHeroTitle}>Plano Completo</Text>
          <Text style={s.planHeroSub}>Gestão financeira + administrativa total</Text>
        </View>

        <View style={s.idealBox}>
          <Text style={s.idealLabel}>IDEAL PARA</Text>
          <Text style={s.idealText}>Condomínios que precisam de gestão integrada — financeira, administrativa e operacional — com o equilíbrio ideal entre custo e benefício.</Text>
        </View>

        <Text style={{ fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 12, letterSpacing: 1 }}>TODO O PACOTE ESSENCIAL +</Text>
        {PLANO_COMPLETO_ITENS.map((it, i) => (
          <View key={i} style={s.serviceRow}>
            <Text style={s.checkIcon}>✓</Text>
            <Text style={s.serviceText}>{it}</Text>
          </View>
        ))}

        {incluiAdmin && (
          <View style={s.invBox}>
            <Text style={s.invLabel}>INVESTIMENTO MENSAL</Text>
            <Text style={s.invValue}>{formatPlano(calc.completo)}</Text>
            <Text style={s.invNote}>Para {condominio.unidades} unidades · plano mais contratado</Text>
          </View>
        )}

        <FooterBar pagina="06 / 10  ·  Plano Completo" />
      </Page>

      {/* ============ PAGE 7: PREMIUM ============ */}
      <Page size="A4" style={s.page}>
        <Text style={s.badge}>PLANOS DE SERVIÇO</Text>
        <View style={s.planHero}>
          <Text style={s.highlightBadge}>EXCELÊNCIA TOTAL</Text>
          <Text style={s.planHeroBadge}>NÍVEL 3</Text>
          <Text style={s.planHeroTitle}>Plano Premium</Text>
          <Text style={s.planHeroSub}>Assessoria completa e conformidade total</Text>
        </View>

        <View style={s.idealBox}>
          <Text style={s.idealLabel}>IDEAL PARA</Text>
          <Text style={s.idealText}>Condomínios que exigem assessoria jurídica, contábil e administrativa de alto padrão, com SLA prioritário e conformidade legal absoluta.</Text>
        </View>

        <Text style={{ fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 12, letterSpacing: 1 }}>INCLUI TODO O PLANO COMPLETO +</Text>
        {PLANO_PREMIUM_ITENS.map((it, i) => (
          <View key={i} style={s.serviceRow}>
            <Text style={s.checkIcon}>✓</Text>
            <Text style={s.serviceText}>{it}</Text>
          </View>
        ))}

        {incluiAdmin && (
          <View style={s.invBox}>
            <Text style={s.invLabel}>INVESTIMENTO MENSAL</Text>
            <Text style={s.invValue}>{formatPlano(calc.premium)}</Text>
            <Text style={s.invNote}>Para {condominio.unidades} unidades · atendimento prioritário</Text>
          </View>
        )}

        <FooterBar pagina="07 / 10  ·  Plano Premium" />
      </Page>

      {/* ============ PAGE 8: COMPARATIVO ============ */}
      <Page size="A4" style={s.page}>
        <SectionHeader badge="ANÁLISE DETALHADA" title="Comparativo de Planos" />

        <View style={s.table}>
          <View style={s.thRow}>
            <Text style={[s.thFirst, { width: "40%" }]}>Serviço</Text>
            <Text style={[s.th, { width: "20%" }]}>Essencial</Text>
            <Text style={[s.thHighlight, { width: "20%" }]}>Completo ★</Text>
            <Text style={[s.th, { width: "20%" }]}>Premium</Text>
          </View>

          {COMPARATIVO.map((cat, ci) => (
            <View key={ci}>
              <View style={s.catRow}><Text style={s.catText}>{cat.categoria.toUpperCase()}</Text></View>
              {cat.itens.map((it, i) => {
                const row = i % 2 === 0 ? s.tr : s.trAlt;
                return (
                  <View key={i} style={row}>
                    <Text style={[s.tdFirst, { width: "40%" }]}>{it.nome}</Text>
                    <Text style={[s.td, { width: "20%", color: it.e ? GOLD : GRAY_300, fontSize: 12 }]}>{it.e ? "✓" : "—"}</Text>
                    <Text style={[s.td, { width: "20%", color: it.c ? GOLD : GRAY_300, fontSize: 12, backgroundColor: "#FBF5E6" }]}>{it.c ? "✓" : "—"}</Text>
                    <Text style={[s.td, { width: "20%", color: it.p ? GOLD : GRAY_300, fontSize: 12 }]}>{it.p ? "✓" : "—"}</Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        <View style={{ marginTop: 14, flexDirection: "row", justifyContent: "space-around", padding: 12, backgroundColor: GRAY_50, borderRadius: 6 }}>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 8, color: GRAY_500, letterSpacing: 1 }}>ESSENCIAL</Text>
            <Text style={{ fontSize: 13, color: NAVY, fontWeight: 700, marginTop: 2 }}>{formatPlano(calc.essencial)}</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 1, fontWeight: 700 }}>COMPLETO ★</Text>
            <Text style={{ fontSize: 13, color: NAVY, fontWeight: 800, marginTop: 2 }}>{formatPlano(calc.completo)}</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 8, color: GRAY_500, letterSpacing: 1 }}>PREMIUM</Text>
            <Text style={{ fontSize: 13, color: NAVY, fontWeight: 700, marginTop: 2 }}>{formatPlano(calc.premium)}</Text>
          </View>
        </View>

        {incluiSindico && (
          <View style={{ marginTop: 14, padding: 14, backgroundColor: NAVY, borderRadius: 6 }}>
            <Text style={{ fontSize: 9, color: GOLD, letterSpacing: 2, fontWeight: 700, marginBottom: 4 }}>SÍNDICO PROFISSIONAL</Text>
            <Text style={{ fontSize: 14, color: WHITE, fontWeight: 700 }}>{formatSindico(calc.sindico)}</Text>
            {incluiAdmin && (
              <Text style={{ fontSize: 9, color: GOLD_LIGHT, marginTop: 6 }}>
                Combo Completo + Síndico (10% OFF): {aplicarDescontoCombo(calc.completo, calc.sindico)}
              </Text>
            )}
          </View>
        )}

        <FooterBar pagina="08 / 10  ·  Comparativo" />
      </Page>

      {/* ============ PAGE 9: CONDIÇÕES ============ */}
      <Page size="A4" style={s.page}>
        <SectionHeader badge="ALPHA · FORMALIZAÇÃO" title="Condições Comerciais" />
        <Text style={s.subtitle}>Transparência e flexibilidade para formalizar nossa parceria.</Text>

        <View style={s.condGrid}>
          {[
            { icon: "▣", t: "Vigência Contratual", d: "12 meses, com renovação automática salvo manifestação em contrário com 60 dias de antecedência." },
            { icon: "⇡", t: "Reajuste Anual", d: "Aplicação do IPCA ou IGP-M (o menor índice acumulado nos últimos 12 meses)." },
            { icon: "▶", t: "Início da Gestão", d: "Imediato após assinatura do contrato e transição com a administração anterior." },
            { icon: "₿", t: "Forma de Pagamento", d: "Boleto bancário ou transferência (PIX/TED), com vencimento no dia 05 ou 10 de cada mês." },
          ].map((c, i) => (
            <View key={i} style={s.condCell}>
              <View style={s.condBox}>
                <Text style={s.condIcon}>{c.icon}</Text>
                <Text style={s.condTitle}>{c.t}</Text>
                <Text style={s.condText}>{c.d}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 18, padding: 12, borderTopWidth: 1, borderTopColor: GOLD }}>
          <Text style={{ fontSize: 9, color: GRAY_500, fontStyle: "italic" }}>
            * Esta proposta é válida por 15 dias a contar da data de emissão ({dataExt}).
          </Text>
        </View>

        <FooterBar pagina="09 / 10  ·  Condições Comerciais" />
      </Page>

      {/* ============ PAGE 10: PRÓXIMOS PASSOS ============ */}
      <Page size="A4" style={s.page}>
        <SectionHeader badge="VAMOS COMEÇAR?" title="Próximos Passos" />

        {[
          { n: "1", t: "Agendamento", d: "Marcamos uma reunião ou visita técnica para conhecer o condomínio, equipe e particularidades da gestão atual." },
          { n: "2", t: "Validação", d: "Você analisa a proposta com o conselho/assembleia e nos retorna com o plano aprovado e ajustes finais." },
          { n: "3", t: "Início Imediato", d: "Assinatura do contrato, onboarding técnico, migração dos dados e início efetivo da gestão Alpha." },
        ].map((step) => (
          <View key={step.n} style={s.stepRow}>
            <View style={s.stepNumWrap}><Text style={s.stepNum}>{step.n}</Text></View>
            <View style={s.stepBody}>
              <Text style={s.stepTitle}>{step.t}</Text>
              <Text style={s.stepDesc}>{step.d}</Text>
            </View>
          </View>
        ))}

        <View style={{ marginTop: 30, height: 1, backgroundColor: GOLD }} />

        <View style={{ marginTop: 30, alignItems: "center" }}>
          <Text style={{ fontSize: 10, color: GOLD, letterSpacing: 4, fontWeight: 700, marginBottom: 6 }}>ALPHA CONDOMÍNIOS</Text>
          <Text style={{ fontSize: 16, color: NAVY, fontWeight: 700, textAlign: "center", maxWidth: 380, lineHeight: 1.4 }}>
            Estamos prontos para cuidar do seu condomínio com a excelência que ele merece.
          </Text>
        </View>

        <View style={{ marginTop: 30, alignItems: "center" }}>
          <View style={{ flexDirection: "row", marginBottom: 6 }}>
            <Text style={{ color: GOLD, fontSize: 11, marginRight: 6 }}>✆</Text>
            <Text style={{ fontSize: 11, color: NAVY, fontWeight: 600 }}>{empresa.telefone}</Text>
            <Text style={{ color: GRAY_300, marginHorizontal: 10 }}>·</Text>
            <Text style={{ color: GOLD, fontSize: 11, marginRight: 6 }}>✉</Text>
            <Text style={{ fontSize: 11, color: NAVY, fontWeight: 600 }}>{empresa.email}</Text>
          </View>
          <Text style={{ fontSize: 8, color: GRAY_500, marginTop: 16 }}>
            © {data.getFullYear()} {empresa.nome}. Todos os direitos reservados.
          </Text>
        </View>

        <FooterBar pagina="10 / 10  ·  Próximos Passos" />
      </Page>
    </Document>
  );
}
