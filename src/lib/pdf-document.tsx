import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import {
  calcularPlanos,
  formatPlano,
  formatSindico,
  aplicarDescontoCombo,
} from "./calculations";

// Logo
import logoAlpha from "../assets/logo-alpha.png";

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
  page: { fontSize: 10, color: TEXT, paddingTop: 50, paddingBottom: 80, paddingHorizontal: 50, backgroundColor: WHITE },
  pageNavy: { fontSize: 10, color: WHITE, backgroundColor: NAVY, padding: 0 },

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
  footer: {
    position: "absolute",
    bottom: 20,
    left: 50,
    right: 50,
    borderTopWidth: 0.5,
    borderTopColor: GRAY_300,
    paddingTop: 10,
  },
  footerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  footerBottom: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  footerText: { fontSize: 7.5, color: GRAY_500 },
  footerSep: { fontSize: 7.5, color: GRAY_300 },
  footerBrand: { fontSize: 8, color: NAVY, fontWeight: 700, letterSpacing: 1 },
  footerLogo: { width: 18, height: 18, marginRight: 6 },

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
  coverLogo: { width: 80, height: 80, marginBottom: 10 },
  coverPreparedLabel: { fontSize: 8, color: GOLD, letterSpacing: 3, fontWeight: 700, marginBottom: 8 },
  coverPreparedName: { fontSize: 16, color: WHITE, fontWeight: 700, marginBottom: 2 },
  coverPreparedSub: { fontSize: 11, color: GOLD_LIGHT, fontWeight: 500 },
  coverDate: { fontSize: 10, color: GRAY_300, marginTop: 4 },
  coverContactCard: { position: "absolute", bottom: 40, right: 40, left: 40, backgroundColor: WHITE, borderRadius: 8, padding: 16 },
  coverContactRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  coverContactIcon: { width: 22, height: 22, marginRight: 8 },
  coverContactText: { fontSize: 9, color: NAVY, fontWeight: 600 },
  coverGoldBar: { position: "absolute", top: 0, left: 0, width: 6, height: "100%", backgroundColor: GOLD },
  coverNumberBadge: { position: "absolute", top: 50, right: 50, fontSize: 9, color: GOLD, letterSpacing: 2, fontWeight: 700 },
  coverDecor1: { position: "absolute", top: 80, right: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(200,169,97,0.08)" },
  coverDecor2: { position: "absolute", bottom: 220, right: 60, width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(200,169,97,0.05)" },
});

/* ── Footer component ── */
const FooterBar = ({ numero }: { numero: string }) => (
  <View style={s.footer} fixed>
    <View style={s.footerTop}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image src={logoAlpha} style={s.footerLogo} />
        <Text style={s.footerBrand}>ALPHA CONDOMÍNIOS</Text>
      </View>
      <Text style={s.footerText}>Proposta {numero}</Text>
    </View>
    <View style={s.footerBottom}>
      <Text style={s.footerText}>(11) 4382-2756</Text>
      <Text style={s.footerSep}>|</Text>
      <Text style={s.footerText}>contato@alphacondominios.com.br</Text>
      <Text style={s.footerSep}>|</Text>
      <Text style={s.footerText}>www.alphacondominios.com.br</Text>
    </View>
  </View>
);

export interface PropostaDocProps {
  numero: string;
  data: Date;
  cidade?: string;
  condominio: { nome: string; endereco: string; unidades: number; tipo: string };
  servicos: { administrativo: boolean; financeiro: boolean; assembleia: boolean; app: boolean; juridicoBasico: boolean; manutencao: boolean; sindicoResidente: boolean; sindicoProfissional: boolean };
  incluiAdmin: boolean;
  incluiSindico: "residente" | "profissional" | "nenhum";
}

export default function PropostaDoc(props: PropostaDocProps) {
  const { numero, data, cidade, condominio, servicos, incluiAdmin, incluiSindico } = props;
  const planos = calcularPlanos(condominio.unidades, condominio.tipo as any, servicos);
  const dataStr = data.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  const planosFormatados = {
    essencial: formatPlano(planos.essencial, "Essencial"),
    plus: formatPlano(planos.plus, "Plus"),
    premium: formatPlano(planos.premium, "Premium"),
  };

  const sindicoInfo = incluiSindico !== "nenhum" ? formatSindico(planos, incluiSindico) : null;

  const comboEssencial = incluiAdmin && incluiSindico !== "nenhum" ? aplicarDescontoCombo(planos.essencial, planos, incluiSindico) : null;
  const comboPlus = incluiAdmin && incluiSindico !== "nenhum" ? aplicarDescontoCombo(planos.plus, planos, incluiSindico) : null;
  const comboPremium = incluiAdmin && incluiSindico !== "nenhum" ? aplicarDescontoCombo(planos.premium, planos, incluiSindico) : null;

  /* ── Serviços por plano ── */
  const servicosEssencial = [
    "Gestão administrativa e operacional completa",
    "Assembleias ordinárias (1/ano)",
    "Atendimento ao condômino em horário comercial",
    "Emissão e controle de boletos",
    "Prestação de contas mensal",
    "Portal do condômino online",
  ];
  const servicosPlus = [
    ...servicosEssencial,
    "Assembleias extras incluídas (até 2/ano)",
    "Assessoria jurídica básica (consultas)",
    "Aplicativo exclusivo do condomínio",
    "Gestão de manutenção preventiva",
    "Relatórios financeiros detalhados",
  ];
  const servicosPremium = [
    ...servicosPlus,
    "Assembleias ilimitadas",
    "Assessoria jurídica completa",
    "Gestão de obras e reformas",
    "Concierge digital 24h",
    "Programa de redução de custos",
    "Auditoria financeira semestral",
  ];

  /* ── Comparison rows ── */
  const compRows: { cat?: string; label?: string; ess?: string; plus?: string; prem?: string }[] = [
    { cat: "ADMINISTRAÇÃO" },
    { label: "Gestão administrativa", ess: "✓", plus: "✓", prem: "✓" },
    { label: "Emissão de boletos", ess: "✓", plus: "✓", prem: "✓" },
    { label: "Prestação de contas", ess: "Mensal", plus: "Mensal", prem: "Mensal" },
    { label: "Portal do condômino", ess: "✓", plus: "✓", prem: "✓" },
    { cat: "ASSEMBLEIAS" },
    { label: "Ordinárias (anual)", ess: "1", plus: "1", prem: "Ilimitadas" },
    { label: "Extras", ess: "—", plus: "Até 2", prem: "Ilimitadas" },
    { cat: "JURÍDICO & MANUTENÇÃO" },
    { label: "Assessoria jurídica", ess: "—", plus: "Básica", prem: "Completa" },
    { label: "Manutenção preventiva", ess: "—", plus: "✓", prem: "✓" },
    { label: "Gestão de obras", ess: "—", plus: "—", prem: "✓" },
    { cat: "TECNOLOGIA & EXTRAS" },
    { label: "Aplicativo exclusivo", ess: "—", plus: "✓", prem: "✓" },
    { label: "Concierge digital 24h", ess: "—", plus: "—", prem: "✓" },
    { label: "Auditoria semestral", ess: "—", plus: "—", prem: "✓" },
    { label: "Programa redução custos", ess: "—", plus: "—", prem: "✓" },
  ];

  const colW = { first: "34%", col: "22%" };

  return (
    <Document>
      {/* ═══════ PAGE 1 — CAPA ═══════ */}
      <Page size="A4" style={s.pageNavy}>
        <View style={s.coverWrap}>
          {/* Left */}
          <View style={s.coverLeft}>
            <View>
              <Image src={logoAlpha} style={s.coverLogo} />
              <View style={s.divider} />
              <Text style={{ fontSize: 11, color: GOLD, letterSpacing: 3, fontWeight: 700, marginBottom: 14 }}>
                PROPOSTA COMERCIAL
              </Text>
              <Text style={s.h1White}>Gestão Condominial{"\n"}de Excelência</Text>
              <Text style={{ fontSize: 12, color: GOLD_LIGHT, lineHeight: 1.6, marginTop: 8 }}>
                Soluções completas em administração,{"\n"}tecnologia e gestão para o seu condomínio.
              </Text>
              <View style={s.pillRow}>
                <Text style={s.pill}>Administração</Text>
                <Text style={s.pill}>Tecnologia</Text>
                <Text style={s.pill}>Gestão</Text>
              </View>
            </View>
            <View style={{ marginTop: 40 }}>
              <Text style={s.coverPreparedLabel}>PREPARADO PARA</Text>
              <Text style={s.coverPreparedName}>{condominio.nome}</Text>
              <Text style={s.coverPreparedSub}>{condominio.endereco}</Text>
              {cidade && <Text style={s.coverDate}>{cidade}</Text>}
              <Text style={s.coverDate}>{dataStr}</Text>
            </View>
          </View>

          {/* Right */}
          <View style={s.coverRight}>
            <View style={s.coverGoldBar} />
            <Text style={s.coverNumberBadge}>Nº {numero}</Text>
            <View style={s.coverDecor1} />
            <View style={s.coverDecor2} />
            <View style={s.coverContactCard}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                <Image src={logoAlpha} style={{ width: 28, height: 28, marginRight: 8 }} />
                <Text style={{ fontSize: 11, color: NAVY, fontWeight: 700 }}>Alpha Condomínios</Text>
              </View>
              <View style={s.coverContactRow}>
                <Text style={{ fontSize: 10, marginRight: 6 }}>📞</Text>
                <Text style={s.coverContactText}>(11) 4382-2756</Text>
              </View>
              <View style={s.coverContactRow}>
                <Text style={{ fontSize: 10, marginRight: 6 }}>✉</Text>
                <Text style={s.coverContactText}>contato@alphacondominios.com.br</Text>
              </View>
              <View style={s.coverContactRow}>
                <Text style={{ fontSize: 10, marginRight: 6 }}>🌐</Text>
                <Text style={s.coverContactText}>www.alphacondominios.com.br</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>

      {/* ═══════ PAGE 2 — QUEM SOMOS ═══════ */}
      <Page size="A4" style={s.page}>
        <Text style={s.badge}>SOBRE NÓS</Text>
        <Text style={s.h1}>Quem Somos</Text>
        <View style={s.divider} />
        <Text style={s.paragraph}>
          A Alpha Condomínios é referência em gestão condominial, combinando experiência sólida com tecnologia de ponta para entregar resultados reais aos nossos clientes.
        </Text>
        <Text style={s.paragraph}>
          Nossa missão é transformar a administração do seu condomínio em uma experiência transparente, eficiente e livre de preocupações. Cuidamos de cada detalhe para que você aproveite o melhor da vida em comunidade.
        </Text>
        <View style={s.cardGrid}>
          {[
            { icon: "🏢", title: "Experiência Comprovada", desc: "Anos de atuação com dezenas de condomínios administrados em toda a região." },
            { icon: "💡", title: "Tecnologia Integrada", desc: "Portal, aplicativo e ferramentas digitais para gestão em tempo real." },
            { icon: "📊", title: "Transparência Total", desc: "Prestação de contas detalhada e acesso irrestrito a documentos e relatórios." },
            { icon: "🤝", title: "Atendimento Humanizado", desc: "Equipe dedicada e disponível para síndicos e condôminos." },
          ].map((c, i) => (
            <View style={s.card} key={i}>
              <View style={s.cardInner}>
                <Text style={s.cardIcon}>{c.icon}</Text>
                <Text style={s.cardTitle}>{c.title}</Text>
                <Text style={s.cardDesc}>{c.desc}</Text>
              </View>
            </View>
          ))}
        </View>
        <FooterBar numero={numero} />
      </Page>

      {/* ═══════ PAGE 3 — DIFERENCIAIS ═══════ */}
      <Page size="A4" style={s.page}>
        <Text style={s.badge}>POR QUE NOS ESCOLHER</Text>
        <Text style={s.h1}>Nossos Diferenciais</Text>
        <View style={s.divider} />
        <View style={s.cardGrid}>
          {[
            { icon: "⚡", title: "Agilidade", desc: "Respostas rápidas e processos otimizados para resolver demandas sem burocracia." },
            { icon: "🔒", title: "Segurança Jurídica", desc: "Conformidade legal em todas as obrigações do condomínio." },
            { icon: "📱", title: "App Exclusivo", desc: "Comunicação, reservas, 2ª via de boletos e muito mais na palma da mão." },
            { icon: "💰", title: "Redução de Custos", desc: "Negociação com fornecedores e estratégias comprovadas de economia." },
            { icon: "🎯", title: "Gestão Personalizada", desc: "Cada condomínio é único. Nossos planos se adaptam à sua realidade." },
            { icon: "📈", title: "Valorização Patrimonial", desc: "Boa gestão valoriza o imóvel e melhora a qualidade de vida." },
          ].map((c, i) => (
            <View style={s.card} key={i}>
              <View style={s.cardInner}>
                <Text style={s.cardIcon}>{c.icon}</Text>
                <Text style={s.cardTitle}>{c.title}</Text>
                <Text style={s.cardDesc}>{c.desc}</Text>
              </View>
            </View>
          ))}
        </View>
        <FooterBar numero={numero} />
      </Page>

      {/* ═══════ PAGE 4 — SERVIÇOS ═══════ */}
      <Page size="A4" style={s.page}>
        <Text style={s.badge}>ESCOPO DE SERVIÇOS</Text>
        <Text style={s.h1}>O Que Fazemos</Text>
        <View style={s.divider} />
        <Text style={s.paragraph}>
          Oferecemos uma gama completa de serviços de gestão condominial, organizados em três planos para atender condomínios de diferentes portes e necessidades.
        </Text>
        <View style={s.cardGrid}>
          {[
            { icon: "📋", title: "Gestão Administrativa", desc: "Controle de documentos, atas, contratos, seguros e obrigações legais." },
            { icon: "💳", title: "Gestão Financeira", desc: "Emissão de boletos, cobranças, conciliação bancária e prestação de contas." },
            { icon: "🏗️", title: "Manutenção", desc: "Planejamento e acompanhamento de manutenções preventivas e corretivas." },
            { icon: "⚖️", title: "Assessoria Jurídica", desc: "Suporte legal para questões condominiais, inadimplência e regulamentos." },
            { icon: "📱", title: "Tecnologia", desc: "Portal web, aplicativo, comunicados digitais e gestão online." },
            { icon: "👥", title: "Assembleias", desc: "Organização, condução e registro de assembleias ordinárias e extraordinárias." },
          ].map((c, i) => (
            <View style={s.card} key={i}>
              <View style={s.cardInner}>
                <Text style={s.cardIcon}>{c.icon}</Text>
                <Text style={s.cardTitle}>{c.title}</Text>
                <Text style={s.cardDesc}>{c.desc}</Text>
              </View>
            </View>
          ))}
        </View>
        <FooterBar numero={numero} />
      </Page>

      {/* ═══════ PAGES 5–7 — PLANOS ═══════ */}
      {incluiAdmin && (
        <>
          {/* Essencial */}
          <Page size="A4" style={s.page}>
            <View style={s.planHero}>
              <Text style={s.planHeroBadge}>PLANO</Text>
              <Text style={s.planHeroTitle}>Essencial</Text>
              <Text style={s.planHeroSub}>Gestão sólida e eficiente para o seu condomínio</Text>
            </View>
            <View style={s.idealBox}>
              <Text style={s.idealLabel}>IDEAL PARA</Text>
              <Text style={s.idealText}>Condomínios que buscam uma administração profissional, organizada e com custos acessíveis.</Text>
            </View>
            {servicosEssencial.map((srv, i) => (
              <View style={s.serviceRow} key={i}>
                <Text style={s.checkIcon}>✓</Text>
                <Text style={s.serviceText}>{srv}</Text>
              </View>
            ))}
            <View style={s.invBox}>
              <Text style={s.invLabel}>INVESTIMENTO MENSAL</Text>
              <Text style={s.invValue}>{planosFormatados.essencial.valorFormatado}</Text>
              <Text style={s.invNote}>{condominio.unidades} unidades · {condominio.tipo}</Text>
            </View>
            <FooterBar numero={numero} />
          </Page>

          {/* Plus */}
          <Page size="A4" style={s.page}>
            <View style={s.planHero}>
              <Text style={s.planHeroBadge}>PLANO</Text>
              <Text style={s.planHeroTitle}>Plus</Text>
              <Text style={s.planHeroSub}>Mais recursos e tecnologia para condomínios exigentes</Text>
              <View style={s.highlightBadge}>
                <Text style={{ fontSize: 8, fontWeight: 700, color: NAVY }}>MAIS POPULAR</Text>
              </View>
            </View>
            <View style={s.idealBox}>
              <Text style={s.idealLabel}>IDEAL PARA</Text>
              <Text style={s.idealText}>Condomínios que desejam ir além do básico, com tecnologia, manutenção preventiva e suporte jurídico.</Text>
            </View>
            {servicosPlus.map((srv, i) => (
              <View style={s.serviceRow} key={i}>
                <Text style={s.checkIcon}>✓</Text>
                <Text style={s.serviceText}>{srv}</Text>
              </View>
            ))}
            <View style={s.invBox}>
              <Text style={s.invLabel}>INVESTIMENTO MENSAL</Text>
              <Text style={s.invValue}>{planosFormatados.plus.valorFormatado}</Text>
              <Text style={s.invNote}>{condominio.unidades} unidades · {condominio.tipo}</Text>
            </View>
            <FooterBar numero={numero} />
          </Page>

          {/* Premium */}
          <Page size="A4" style={s.page}>
            <View style={s.planHero}>
              <Text style={s.planHeroBadge}>PLANO</Text>
              <Text style={s.planHeroTitle}>Premium</Text>
              <Text style={s.planHeroSub}>A experiência mais completa em gestão condominial</Text>
            </View>
            <View style={s.idealBox}>
              <Text style={s.idealLabel}>IDEAL PARA</Text>
              <Text style={s.idealText}>Condomínios de alto padrão ou que buscam o máximo em tecnologia, assessoria e redução de custos.</Text>
            </View>
            {servicosPremium.map((srv, i) => (
              <View style={s.serviceRow} key={i}>
                <Text style={s.checkIcon}>✓</Text>
                <Text style={s.serviceText}>{srv}</Text>
              </View>
            ))}
            <View style={s.invBox}>
              <Text style={s.invLabel}>INVESTIMENTO MENSAL</Text>
              <Text style={s.invValue}>{planosFormatados.premium.valorFormatado}</Text>
              <Text style={s.invNote}>{condominio.unidades} unidades · {condominio.tipo}</Text>
            </View>
            <FooterBar numero={numero} />
          </Page>
        </>
      )}

      {/* ═══════ SÍNDICO PROFISSIONAL / RESIDENTE ═══════ */}
      {incluiSindico !== "nenhum" && sindicoInfo && (
        <Page size="A4" style={s.page}>
          <Text style={s.badge}>SERVIÇO ADICIONAL</Text>
          <Text style={s.h1}>{sindicoInfo.titulo}</Text>
          <View style={s.divider} />
          <Text style={s.paragraph}>{sindicoInfo.descricao}</Text>
          <View style={s.invBox}>
            <Text style={s.invLabel}>INVESTIMENTO MENSAL</Text>
            <Text style={s.invValue}>{sindicoInfo.valorFormatado}</Text>
            <Text style={s.invNote}>{condominio.unidades} unidades</Text>
          </View>
          {incluiAdmin && comboEssencial && comboPlus && comboPremium && (
            <View style={{ marginTop: 20 }}>
              <Text style={s.badge}>COMBOS COM DESCONTO</Text>
              <View style={s.cardGrid}>
                {[
                  { nome: "Essencial + Síndico", ...comboEssencial },
                  { nome: "Plus + Síndico", ...comboPlus },
                  { nome: "Premium + Síndico", ...comboPremium },
                ].map((combo, i) => (
                  <View style={{ width: "33.33%", padding: 6 }} key={i}>
                    <View style={[s.cardInner, { alignItems: "center", justifyContent: "center", height: 110 }]}>
                      <Text style={s.cardTitle}>{combo.nome}</Text>
                      <Text style={{ fontSize: 18, fontWeight: 800, color: NAVY, marginTop: 6 }}>{combo.totalFormatado}</Text>
                      <Text style={{ fontSize: 8, color: GOLD, marginTop: 4 }}>Economia de {combo.descontoFormatado}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
          <FooterBar numero={numero} />
        </Page>
      )}

      {/* ═══════ PAGE 8 — COMPARATIVO ═══════ */}
      {incluiAdmin && (
        <Page size="A4" style={s.page}>
          <Text style={s.badge}>COMPARATIVO</Text>
          <Text style={s.h1}>Planos lado a lado</Text>
          <View style={s.divider} />
          <View style={s.table}>
            <View style={s.thRow}>
              <Text style={[s.thFirst, { width: colW.first }]}>Serviço</Text>
              <Text style={[s.th, { width: colW.col }]}>Essencial</Text>
              <Text style={[s.thHighlight, { width: colW.col }]}>Plus</Text>
              <Text style={[s.th, { width: colW.col }]}>Premium</Text>
            </View>
            {compRows.map((r, i) =>
              r.cat ? (
                <View style={s.catRow} key={i}>
                  <Text style={s.catText}>{r.cat}</Text>
                </View>
              ) : (
                <View style={i % 2 === 0 ? s.tr : s.trAlt} key={i}>
                  <Text style={[s.tdFirst, { width: colW.first }]}>{r.label}</Text>
                  <Text style={[s.td, { width: colW.col }]}>{r.ess}</Text>
                  <Text style={[s.td, { width: colW.col, fontWeight: 700, color: NAVY }]}>{r.plus}</Text>
                  <Text style={[s.td, { width: colW.col }]}>{r.prem}</Text>
                </View>
              )
            )}
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
            {[
              { plano: "Essencial", valor: planosFormatados.essencial.valorFormatado },
              { plano: "Plus", valor: planosFormatados.plus.valorFormatado },
              { plano: "Premium", valor: planosFormatados.premium.valorFormatado },
            ].map((p, i) => (
              <View key={i} style={{ alignItems: "center", width: "33%" }}>
                <Text style={{ fontSize: 9, color: GRAY_500, marginBottom: 2 }}>{p.plano}</Text>
                <Text style={{ fontSize: 16, fontWeight: 800, color: NAVY }}>{p.valor}</Text>
                <Text style={{ fontSize: 8, color: GRAY_500 }}>/mês</Text>
              </View>
            ))}
          </View>
          <FooterBar numero={numero} />
        </Page>
      )}

      {/* ═══════ PAGE 9 — CONDIÇÕES ═══════ */}
      <Page size="A4" style={s.page}>
        <Text style={s.badge}>TERMOS & CONDIÇÕES</Text>
        <Text style={s.h1}>Condições Gerais</Text>
        <View style={s.divider} />
        <View style={s.condGrid}>
          {[
            { icon: "📄", title: "Vigência", text: "Contrato de 12 meses com renovação automática. Rescisão com aviso prévio de 60 dias." },
            { icon: "💳", title: "Pagamento", text: "Faturamento mensal via boleto bancário, com vencimento todo dia 10." },
            { icon: "📅", title: "Reajuste", text: "Reajuste anual pelo IGPM/FGV ou índice equivalente, aplicado na data de aniversário." },
            { icon: "🚀", title: "Implantação", text: "Prazo de implantação de até 30 dias após assinatura, sem custo adicional." },
            { icon: "📋", title: "Validade", text: "Esta proposta é válida por 30 dias a partir da data de emissão." },
            { icon: "🔄", title: "Transição", text: "Acompanhamento completo na transição da administradora anterior, se aplicável." },
          ].map((c, i) => (
            <View style={s.condCell} key={i}>
              <View style={s.condBox}>
                <Text style={s.condIcon}>{c.icon}</Text>
                <Text style={s.condTitle}>{c.title}</Text>
                <Text style={s.condText}>{c.text}</Text>
              </View>
            </View>
          ))}
        </View>
        <FooterBar numero={numero} />
      </Page>

      {/* ═══════ PAGE 10 — PRÓXIMOS PASSOS ═══════ */}
      <Page size="A4" style={s.page}>
        <Text style={s.badge}>PRÓXIMOS PASSOS</Text>
        <Text style={s.h1}>Como Começar</Text>
        <View style={s.divider} />
        {[
          { num: "1", title: "Escolha o Plano", desc: "Avalie as opções apresentadas e escolha o plano que melhor atende às necessidades do seu condomínio." },
          { num: "2", title: "Entre em Contato", desc: "Ligue para (11) 4382-2756 ou envie um e-mail para contato@alphacondominios.com.br para agendar uma reunião." },
          { num: "3", title: "Reunião de Alinhamento", desc: "Apresentamos os detalhes do plano escolhido, tiramos todas as dúvidas e personalizamos o escopo se necessário." },
          { num: "4", title: "Assinatura e Implantação", desc: "Após a aprovação em assembleia, assinamos o contrato e iniciamos a implantação em até 30 dias." },
        ].map((step, i) => (
          <View style={s.stepRow} key={i}>
            <View style={s.stepNumWrap}>
              <Text style={s.stepNum}>{step.num}</Text>
            </View>
            <View style={s.stepBody}>
              <Text style={s.stepTitle}>{step.title}</Text>
              <Text style={s.stepDesc}>{step.desc}</Text>
            </View>
          </View>
        ))}
        <View style={{ marginTop: 10, backgroundColor: NAVY, borderRadius: 10, padding: 28, alignItems: "center" }}>
          <Image src={logoAlpha} style={{ width: 40, height: 40, marginBottom: 10 }} />
          <Text style={{ fontSize: 14, color: WHITE, fontWeight: 700, marginBottom: 4 }}>Pronto para transformar a gestão do seu condomínio?</Text>
          <Text style={{ fontSize: 10, color: GOLD_LIGHT, marginBottom: 10 }}>Estamos à disposição para atendê-lo.</Text>
          <Text style={{ fontSize: 11, color: GOLD, fontWeight: 700 }}>(11) 4382-2756 · contato@alphacondominios.com.br</Text>
          <Text style={{ fontSize: 10, color: GRAY_300, marginTop: 4 }}>www.alphacondominios.com.br</Text>
        </View>
        <FooterBar numero={numero} />
      </Page>
    </Document>
  );
}
