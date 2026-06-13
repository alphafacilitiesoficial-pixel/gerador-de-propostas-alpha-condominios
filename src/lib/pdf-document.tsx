import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Svg,
  Rect,
  Line,
  Polygon,
  Defs,
  LinearGradient,
  Stop,
  Path,
  G,
} from "@react-pdf/renderer";
import {
  calcularPlanos,
  formatPlano,
  formatSindico,
  aplicarDescontoCombo,
  formatBRL,
  SERVICOS_PLANOS,
} from "./calculations";
import logoAlpha from "../assets/logo-alpha.png";

/* ================================================================
   CORES (Brand)
   ================================================================ */
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
const TEXT_COLOR = "#111827";

/* ================================================================
   ESTILOS
   ================================================================ */
const s = StyleSheet.create({
  /* ----- Páginas ----- */
  page: {
    fontSize: 10,
    color: TEXT_COLOR,
    paddingTop: 50,
    paddingBottom: 60,
    paddingHorizontal: 50,
    backgroundColor: WHITE,
    justifyContent: "center",
  },
  pageNavy: {
    fontSize: 10,
    color: WHITE,
    backgroundColor: NAVY,
    padding: 0,
    justifyContent: "center",
  },

  /* ----- Tipografia ----- */
  badge: {
    fontSize: 8,
    color: GOLD,
    letterSpacing: 2,
    fontWeight: 700,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  badgeNavy: {
    fontSize: 8,
    color: NAVY,
    letterSpacing: 2,
    fontWeight: 700,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  h1: {
    fontSize: 26,
    fontWeight: 800,
    color: NAVY,
    marginBottom: 14,
    letterSpacing: -0.5,
  },
  h1White: {
    fontSize: 30,
    fontWeight: 800,
    color: WHITE,
    marginBottom: 12,
    letterSpacing: -0.5,
    lineHeight: 1.15,
  },
  h2: {
    fontSize: 16,
    fontWeight: 700,
    color: NAVY,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 11,
    color: GRAY_500,
    marginBottom: 24,
    lineHeight: 1.5,
  },
  paragraph: {
    fontSize: 10.5,
    color: GRAY_700,
    lineHeight: 1.65,
    marginBottom: 10,
  },
  divider: {
    height: 3,
    width: 48,
    backgroundColor: GOLD,
    marginBottom: 18,
  },

  /* ----- Footer ----- */
  footer: {
    position: "absolute",
    bottom: 24,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: GRAY_300,
  },
  footerText: { fontSize: 8, color: GRAY_500 },
  footerBrand: { fontSize: 8, color: NAVY, fontWeight: 700, letterSpacing: 1 },

  /* ----- Cards ----- */
  cardGrid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -6 },
  card: { width: "50%", padding: 6 },
  cardInner: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: GRAY_100,
    borderRadius: 8,
    padding: 16,
    height: 130,
  },
  cardIcon: { fontSize: 20, marginBottom: 8, color: GOLD },
  cardTitle: { fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 4 },
  cardDesc: { fontSize: 9, color: GRAY_500, lineHeight: 1.5 },

  pillRow: { flexDirection: "row", marginTop: 20 },
  pill: {
    backgroundColor: NAVY,
    color: WHITE,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    fontSize: 9,
    fontWeight: 600,
    marginRight: 8,
  },

  /* ----- Plano Hero ----- */
  planHero: {
    backgroundColor: NAVY,
    padding: 24,
    borderRadius: 10,
    marginBottom: 20,
  },
  planHeroBadge: {
    fontSize: 8,
    color: GOLD,
    letterSpacing: 2,
    fontWeight: 700,
    marginBottom: 6,
  },
  planHeroTitle: {
    fontSize: 26,
    color: WHITE,
    fontWeight: 800,
    marginBottom: 4,
  },
  planHeroSub: { fontSize: 10, color: GOLD_LIGHT, fontWeight: 500 },
  highlightBadge: {
    position: "absolute",
    top: 18,
    right: 18,
    backgroundColor: GOLD,
    color: NAVY,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: 1,
  },

  idealBox: {
    backgroundColor: GRAY_50,
    padding: 14,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: GOLD,
    marginBottom: 18,
  },
  idealLabel: {
    fontSize: 9,
    color: NAVY,
    fontWeight: 700,
    marginBottom: 4,
    letterSpacing: 1,
  },
  idealText: {
    fontSize: 10,
    color: GRAY_700,
    fontStyle: "italic",
    lineHeight: 1.5,
  },

  serviceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: GRAY_100,
  },
  checkIcon: {
    fontSize: 12,
    color: GOLD,
    fontWeight: 700,
    marginRight: 10,
    marginTop: 1,
  },
  serviceText: { fontSize: 10.5, color: GRAY_700, flex: 1, lineHeight: 1.5 },

  invBox: {
    marginTop: 18,
    backgroundColor: NAVY,
    padding: 22,
    borderRadius: 10,
    alignItems: "center",
  },
  invLabel: {
    fontSize: 9,
    color: GOLD,
    letterSpacing: 2,
    fontWeight: 700,
    marginBottom: 6,
  },
  invValue: { fontSize: 28, color: WHITE, fontWeight: 800 },
  invNote: { fontSize: 8, color: GOLD_LIGHT, marginTop: 6 },
  invConsulte: {
    fontSize: 18,
    color: GOLD_LIGHT,
    fontWeight: 700,
    fontStyle: "italic",
  },

  /* ----- Tabela ----- */
  table: {
    borderWidth: 1,
    borderColor: GRAY_100,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 14,
  },
  thRow: { flexDirection: "row", backgroundColor: NAVY },
  th: {
    color: WHITE,
    fontSize: 9.5,
    fontWeight: 700,
    padding: 10,
    textAlign: "center",
  },
  thFirst: {
    color: WHITE,
    fontSize: 9.5,
    fontWeight: 700,
    padding: 10,
    textAlign: "left",
  },
  thHighlight: {
    color: NAVY,
    fontSize: 9.5,
    fontWeight: 700,
    padding: 10,
    textAlign: "center",
    backgroundColor: GOLD,
  },
  tr: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: GRAY_100,
  },
  trAlt: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: GRAY_100,
    backgroundColor: GRAY_50,
  },
  td: { padding: 8, fontSize: 9, color: GRAY_700, textAlign: "center" },
  tdFirst: { padding: 8, fontSize: 9, color: TEXT_COLOR, fontWeight: 600 },
  catRow: { backgroundColor: NAVY_DARK, padding: 6, paddingLeft: 10 },
  catText: {
    color: GOLD,
    fontSize: 8.5,
    fontWeight: 700,
    letterSpacing: 1,
  },

  /* ----- Condições ----- */
  condGrid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -7 },
  condCell: { width: "50%", padding: 7 },
  condBox: {
    borderWidth: 1,
    borderColor: GRAY_100,
    borderRadius: 8,
    padding: 16,
    backgroundColor: GRAY_50,
    minHeight: 100,
  },
  condIcon: { fontSize: 18, color: GOLD, marginBottom: 6 },
  condTitle: { fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 4 },
  condText: { fontSize: 9.5, color: GRAY_700, lineHeight: 1.5 },

  /* ----- Steps ----- */
  stepRow: {
    flexDirection: "row",
    marginBottom: 18,
    alignItems: "flex-start",
  },
  stepNumWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: NAVY,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  stepNum: { color: GOLD, fontSize: 20, fontWeight: 800 },
  stepBody: { flex: 1, paddingTop: 4 },
  stepTitle: { fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 4 },
  stepDesc: { fontSize: 10, color: GRAY_700, lineHeight: 1.5 },

  /* ===== CAPA ===== */
  coverWrap: {
    flex: 1,
    flexDirection: "row",
  },
  coverLeft: {
    width: "55%",
    backgroundColor: WHITE,
    paddingHorizontal: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  coverRight: {
    width: "45%",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 40,
    position: "relative",
  },
  coverLogo: {
    width: 180,
    height: 180,
    objectFit: "contain",
    marginBottom: 20,
  },
  coverPropostaLabel: {
    fontSize: 10,
    color: NAVY,
    letterSpacing: 3,
    fontWeight: 700,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  coverPropostaNum: {
    fontSize: 20,
    color: NAVY,
    fontWeight: 800,
    marginBottom: 8,
  },
  coverDate: {
    fontSize: 9,
    color: GRAY_500,
  },
  coverContactBox: {
    backgroundColor: WHITE,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: 260,
    alignItems: "center",
  },
  coverContactText: {
    fontSize: 10,
    color: NAVY,
    fontWeight: 600,
    textAlign: "center",
    marginBottom: 2,
  },
  coverContactEmail: {
    fontSize: 9,
    color: NAVY,
    fontWeight: 600,
    textAlign: "center",
    width: "100%",
  },
});

/* ================================================================
   HELPERS
   ================================================================ */

/* Silhueta de prédios (SVG inline) */
function BuildingSilhouette() {
  return (
    <Svg width={200} height={220} viewBox="0 0 200 220">
      {/* Prédio 1 — esquerdo, mais baixo */}
      <Rect x="10" y="100" width="40" height="120" fill={GOLD_LIGHT} opacity={0.25} />
      <Rect x="18" y="110" width="8" height="10" fill={WHITE} opacity={0.15} />
      <Rect x="32" y="110" width="8" height="10" fill={WHITE} opacity={0.15} />
      <Rect x="18" y="130" width="8" height="10" fill={WHITE} opacity={0.15} />
      <Rect x="32" y="130" width="8" height="10" fill={WHITE} opacity={0.15} />
      <Rect x="18" y="150" width="8" height="10" fill={WHITE} opacity={0.15} />
      <Rect x="32" y="150" width="8" height="10" fill={WHITE} opacity={0.15} />
      <Rect x="18" y="170" width="8" height="10" fill={WHITE} opacity={0.15} />
      <Rect x="32" y="170" width="8" height="10" fill={WHITE} opacity={0.15} />

      {/* Prédio 2 — centro, mais alto */}
      <Rect x="60" y="40" width="50" height="180" fill={GOLD} opacity={0.2} />
      <Rect x="70" y="55" width="10" height="12" fill={WHITE} opacity={0.15} />
      <Rect x="88" y="55" width="10" height="12" fill={WHITE} opacity={0.15} />
      <Rect x="70" y="78" width="10" height="12" fill={WHITE} opacity={0.15} />
      <Rect x="88" y="78" width="10" height="12" fill={WHITE} opacity={0.15} />
      <Rect x="70" y="101" width="10" height="12" fill={WHITE} opacity={0.15} />
      <Rect x="88" y="101" width="10" height="12" fill={WHITE} opacity={0.15} />
      <Rect x="70" y="124" width="10" height="12" fill={WHITE} opacity={0.15} />
      <Rect x="88" y="124" width="10" height="12" fill={WHITE} opacity={0.15} />
      <Rect x="70" y="147" width="10" height="12" fill={WHITE} opacity={0.15} />
      <Rect x="88" y="147" width="10" height="12" fill={WHITE} opacity={0.15} />
      <Rect x="70" y="170" width="10" height="12" fill={WHITE} opacity={0.15} />
      <Rect x="88" y="170" width="10" height="12" fill={WHITE} opacity={0.15} />
      {/* Antena */}
      <Line x1="85" y1="40" x2="85" y2="22" stroke={GOLD} strokeWidth={1.5} opacity={0.3} />
      <Line x1="80" y1="28" x2="90" y2="28" stroke={GOLD} strokeWidth={1} opacity={0.3} />

      {/* Prédio 3 — direito, médio */}
      <Rect x="120" y="70" width="45" height="150" fill={GOLD_LIGHT} opacity={0.18} />
      <Rect x="130" y="82" width="8" height="10" fill={WHITE} opacity={0.12} />
      <Rect x="146" y="82" width="8" height="10" fill={WHITE} opacity={0.12} />
      <Rect x="130" y="102" width="8" height="10" fill={WHITE} opacity={0.12} />
      <Rect x="146" y="102" width="8" height="10" fill={WHITE} opacity={0.12} />
      <Rect x="130" y="122" width="8" height="10" fill={WHITE} opacity={0.12} />
      <Rect x="146" y="122" width="8" height="10" fill={WHITE} opacity={0.12} />
      <Rect x="130" y="142" width="8" height="10" fill={WHITE} opacity={0.12} />
      <Rect x="146" y="142" width="8" height="10" fill={WHITE} opacity={0.12} />
      <Rect x="130" y="162" width="8" height="10" fill={WHITE} opacity={0.12} />
      <Rect x="146" y="162" width="8" height="10" fill={WHITE} opacity={0.12} />

      {/* Prédio 4 — extrema direita, baixo */}
      <Rect x="172" y="130" width="28" height="90" fill={GOLD} opacity={0.15} />
      <Rect x="178" y="140" width="6" height="8" fill={WHITE} opacity={0.1} />
      <Rect x="188" y="140" width="6" height="8" fill={WHITE} opacity={0.1} />
      <Rect x="178" y="158" width="6" height="8" fill={WHITE} opacity={0.1} />
      <Rect x="188" y="158" width="6" height="8" fill={WHITE} opacity={0.1} />
      <Rect x="178" y="176" width="6" height="8" fill={WHITE} opacity={0.1} />
      <Rect x="188" y="176" width="6" height="8" fill={WHITE} opacity={0.1} />

      {/* Linha do chão */}
      <Line x1="0" y1="220" x2="200" y2="220" stroke={GOLD} strokeWidth={1} opacity={0.3} />
    </Svg>
  );
}

function Footer({ page, total }: { page: number; total: number }) {
  return (
    <View style={s.footer}>
      <Text style={s.footerText}>
        Página {page} de {total}
      </Text>
      <Text style={s.footerBrand}>ALPHA CONDOMÍNIOS</Text>
    </View>
  );
}

function SectionTitle({
  badge,
  title,
  subtitle,
  white,
}: {
  badge: string;
  title: string;
  subtitle?: string;
  white?: boolean;
}) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={white ? s.badge : s.badgeNavy}>{badge}</Text>
      <Text style={white ? s.h1White : s.h1}>{title}</Text>
      <View style={s.divider} />
      {subtitle && <Text style={s.subtitle}>{subtitle}</Text>}
    </View>
  );
}

/* ================================================================
   PROPS
   ================================================================ */
export interface PDFPropostaProps {
  numero: string;
  data: Date;
  condominio: {
    nome: string;
    endereco: string;
    unidades: number;
    tipo: string;
  };
  contato: {
    nome: string;
    telefone: string;
    email: string;
  };
  incluiAdmin: boolean;
  incluiSindico: boolean;
  consideracoesFinais?: string;
}

/* ================================================================
   DOCUMENTO
   ================================================================ */
export function PropostaPDF({
  numero,
  data,
  condominio,
  contato,
  incluiAdmin,
  incluiSindico,
  consideracoesFinais,
}: PDFPropostaProps) {
  const calc = calcularPlanos(condominio.unidades);
  const dataStr = data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  let pageCount = 2; // capa + quem somos
  if (incluiAdmin) pageCount += 6; // diferenciais + serviços + essencial + completo + premium + comparativo
  if (incluiSindico) pageCount += 1; // síndico
  pageCount += 2; // condições + próximos passos

  let currentPage = 0;
  const pg = () => ++currentPage;

  return (
    <Document title={`Proposta ${numero} — Alpha Condomínios`} author="Alpha Condomínios">
      {/* ================================================================
          PÁGINA 1 — CAPA (degradê branco → navy)
          ================================================================ */}
      <Page size="A4" style={{ padding: 0 }}>
        {/* Fundo degradê via SVG */}
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
          <Svg width="595" height="842" viewBox="0 0 595 842">
            <Defs>
              <LinearGradient id="coverGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor={WHITE} />
                <Stop offset="50%" stopColor={WHITE} />
                <Stop offset="70%" stopColor="#D6DFED" />
                <Stop offset="100%" stopColor={NAVY} />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="595" height="842" fill="url(#coverGrad)" />
          </Svg>
        </View>

        <View style={s.coverWrap}>
          {/* LADO ESQUERDO — fundo branco, logo preta fica visível */}
          <View style={s.coverLeft}>
            <Image src={logoAlpha} style={s.coverLogo} />
            {/* REMOVIDO: texto "ALPHA CONDOMÍNIOS" abaixo da logo */}
            <Text style={s.coverPropostaLabel}>PROPOSTA COMERCIAL</Text>
            <Text style={s.coverPropostaNum}>Nº {numero}</Text>
            <Text style={s.coverDate}>{dataStr}</Text>
          </View>

          {/* LADO DIREITO — silhueta de prédios + contato Alpha */}
          {/* REMOVIDO: "A" marca d'água (coverDecor1, coverDecor2) */}
          <View style={s.coverRight}>
            <BuildingSilhouette />
            <View style={[s.coverContactBox, { marginTop: 24 }]}>
              <Text style={s.coverContactText}>(31) 99778-7316</Text>
              <Text style={s.coverContactEmail}>comercial@alphafacilities.com.br</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* ================================================================
          PÁGINA 2 — QUEM SOMOS
          ================================================================ */}
      <Page size="A4" style={s.page}>
        <SectionTitle
          badge="SOBRE NÓS"
          title="Quem Somos"
          subtitle="Conheça a Alpha Condomínios e nossa missão de transformar a gestão condominial."
        />
        <Text style={s.paragraph}>
          A Alpha Condomínios nasceu com o propósito de profissionalizar e modernizar a
          administração de condomínios, combinando tecnologia, transparência e atendimento
          humanizado. Atuamos em Belo Horizonte e região metropolitana, atendendo condomínios
          residenciais, comerciais e mistos.
        </Text>
        <Text style={s.paragraph}>
          Nossa equipe é formada por especialistas em gestão condominial, contabilidade,
          direito imobiliário e tecnologia. Utilizamos sistemas de ponta para garantir controle
          financeiro rigoroso, comunicação eficiente e total conformidade legal.
        </Text>
        <Text style={s.paragraph}>
          Acreditamos que cada condomínio é único. Por isso, oferecemos planos flexíveis que se
          adaptam à realidade de cada empreendimento — do essencial ao premium, sempre com a
          mesma excelência.
        </Text>

        <View style={s.idealBox}>
          <Text style={s.idealLabel}>NOSSA MISSÃO</Text>
          <Text style={s.idealText}>
            Entregar gestão condominial de excelência, com transparência, tecnologia e
            compromisso com o bem-estar dos moradores.
          </Text>
        </View>

        <Footer page={pg()} total={pageCount} />
      </Page>

      {/* ================================================================
          PÁGINAS DE ADMINISTRAÇÃO (condicional)
          ================================================================ */}
      {incluiAdmin && (
        <>
          {/* ------ NOSSOS DIFERENCIAIS ------ */}
          <Page size="A4" style={s.pageNavy}>
            <View style={{ padding: 50, flex: 1, justifyContent: "center" }}>
              <SectionTitle
                badge="POR QUE NOS ESCOLHER"
                title="Nossos Diferenciais"
                white
              />
              <View style={s.cardGrid}>
                {[
                  {
                    icon: "\u{1F4CA}",
                    title: "Transparência Total",
                    desc: "Balancetes digitais mensais e acesso em tempo real às finanças do condomínio.",
                  },
                  {
                    icon: "\u{1F4BB}",
                    title: "Tecnologia de Ponta",
                    desc: "Portal do condômino, boletos digitais e aplicativo para gestão completa.",
                  },
                  {
                    icon: "\u{1F91D}",
                    title: "Atendimento Humanizado",
                    desc: "Equipe dedicada com suporte ágil via WhatsApp, telefone e e-mail.",
                  },
                  {
                    icon: "\u{2696}",
                    title: "Conformidade Legal",
                    desc: "Cumprimento rigoroso das obrigações fiscais, trabalhistas e condominiais.",
                  },
                ].map((d, i) => (
                  <View key={i} style={s.card}>
                    <View style={s.cardInner}>
                      <Text style={s.cardIcon}>{d.icon}</Text>
                      <Text style={s.cardTitle}>{d.title}</Text>
                      <Text style={s.cardDesc}>{d.desc}</Text>
                    </View>
                  </View>
                ))}
              </View>
              <Footer page={pg()} total={pageCount} />
            </View>
          </Page>

          {/* ------ NOSSOS SERVIÇOS ------ */}
          <Page size="A4" style={s.page}>
            <SectionTitle
              badge="SERVIÇOS"
              title="Nossos Serviços"
              subtitle="Soluções completas para a administração do seu condomínio."
            />
            <View style={s.cardGrid}>
              {[
                {
                  icon: "\u{1F4C4}",
                  title: "Gestão Financeira",
                  desc: "Emissão de boletos, cobranças, balancetes e controle de inadimplência.",
                },
                {
                  icon: "\u{1F4C5}",
                  title: "Planejamento",
                  desc: "Orçamento anual, previsão de despesas e fundo de reserva.",
                },
                {
                  icon: "\u{1F527}",
                  title: "Gestão Operacional",
                  desc: "Manutenções preventivas, gestão de contratos e fornecedores.",
                },
                {
                  icon: "\u{1F4E2}",
                  title: "Comunicação",
                  desc: "Portal do condômino, assembleias online e comunicados digitais.",
                },
              ].map((serv, i) => (
                <View key={i} style={s.card}>
                  <View style={s.cardInner}>
                    <Text style={s.cardIcon}>{serv.icon}</Text>
                    <Text style={s.cardTitle}>{serv.title}</Text>
                    <Text style={s.cardDesc}>{serv.desc}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Seguro RC do Síndico */}
            <View
              style={{
                marginTop: 20,
                backgroundColor: GOLD,
                borderRadius: 8,
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 22, marginRight: 12 }}>{"\u{1F6E1}"}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 2 }}>
                  Seguro de Responsabilidade Civil (RC) do Síndico
                </Text>
                <Text style={{ fontSize: 9.5, color: NAVY_DARK, lineHeight: 1.4 }}>
                  Todos os nossos planos incluem seguro RC, protegendo o síndico contra riscos
                  inerentes à função.
                </Text>
              </View>
            </View>

            <Footer page={pg()} total={pageCount} />
          </Page>

          {/* ------ PLANO ESSENCIAL ------ */}
          <Page size="A4" style={s.page}>
            <View style={s.planHero}>
              <Text style={s.planHeroBadge}>PLANO</Text>
              <Text style={s.planHeroTitle}>Essencial</Text>
              <Text style={s.planHeroSub}>Gestão financeira objetiva e eficiente</Text>
            </View>

            <View style={s.idealBox}>
              <Text style={s.idealLabel}>IDEAL PARA</Text>
              <Text style={s.idealText}>
                Condomínios que buscam organização financeira com custo acessível.
              </Text>
            </View>

            {SERVICOS_PLANOS.essencial.map((srv, i) => (
              <View key={i} style={s.serviceRow}>
                <Text style={s.checkIcon}>&#10003;</Text>
                <Text style={s.serviceText}>{srv}</Text>
              </View>
            ))}

            <View style={s.invBox}>
              <Text style={s.invLabel}>INVESTIMENTO MENSAL</Text>
              {calc.essencial.tipo === "valor" ? (
                <>
                  <Text style={s.invValue}>{formatBRL(calc.essencial.mensal)}</Text>
                  <Text style={s.invNote}>
                    {formatBRL(calc.essencial.porUnidade)} por unidade/mês
                  </Text>
                </>
              ) : (
                <Text style={s.invConsulte}>Sob consulta</Text>
              )}
            </View>

            <Footer page={pg()} total={pageCount} />
          </Page>

          {/* ------ PLANO COMPLETO ------ */}
          <Page size="A4" style={s.page}>
            <View style={s.planHero}>
              <Text style={s.planHeroBadge}>PLANO</Text>
              <Text style={s.planHeroTitle}>Completo</Text>
              <Text style={s.planHeroSub}>Administração completa com gestão integrada</Text>
              <Text style={s.highlightBadge}>MAIS ESCOLHIDO</Text>
            </View>

            <View style={s.idealBox}>
              <Text style={s.idealLabel}>IDEAL PARA</Text>
              <Text style={s.idealText}>
                Condomínios que precisam de gestão financeira, operacional e de comunicação integradas.
              </Text>
            </View>

            {SERVICOS_PLANOS.completo.map((srv, i) => (
              <View key={i} style={s.serviceRow}>
                <Text style={s.checkIcon}>&#10003;</Text>
                <Text style={s.serviceText}>{srv}</Text>
              </View>
            ))}

            <View style={s.invBox}>
              <Text style={s.invLabel}>INVESTIMENTO MENSAL</Text>
              {calc.completo.tipo === "valor" ? (
                <>
                  <Text style={s.invValue}>{formatBRL(calc.completo.mensal)}</Text>
                  <Text style={s.invNote}>
                    {formatBRL(calc.completo.porUnidade)} por unidade/mês
                  </Text>
                </>
              ) : (
                <Text style={s.invConsulte}>Sob consulta</Text>
              )}
            </View>

            <Footer page={pg()} total={pageCount} />
          </Page>

          {/* ------ PLANO PREMIUM ------ */}
          <Page size="A4" style={s.page}>
            <View style={s.planHero}>
              <Text style={s.planHeroBadge}>PLANO</Text>
              <Text style={s.planHeroTitle}>Premium</Text>
              <Text style={s.planHeroSub}>Gestão completa com assessoria jurídica e atendimento prioritário</Text>
            </View>

            <View style={s.idealBox}>
              <Text style={s.idealLabel}>IDEAL PARA</Text>
              <Text style={s.idealText}>
                Condomínios que desejam o mais alto nível de gestão, com suporte jurídico e SLA
                de atendimento.
              </Text>
            </View>

            {SERVICOS_PLANOS.premium.map((srv, i) => (
              <View key={i} style={s.serviceRow}>
                <Text style={s.checkIcon}>&#10003;</Text>
                <Text style={s.serviceText}>{srv}</Text>
              </View>
            ))}

            <View style={s.invBox}>
              <Text style={s.invLabel}>INVESTIMENTO MENSAL</Text>
              {calc.premium.tipo === "valor" ? (
                <>
                  <Text style={s.invValue}>{formatBRL(calc.premium.mensal)}</Text>
                  <Text style={s.invNote}>
                    {formatBRL(calc.premium.porUnidade)} por unidade/mês
                  </Text>
                </>
              ) : (
                <Text style={s.invConsulte}>Sob consulta</Text>
              )}
            </View>

            <Footer page={pg()} total={pageCount} />
          </Page>

          {/* ------ COMPARATIVO DE PLANOS (SEM valor de síndico) ------ */}
          <Page size="A4" style={s.page}>
            <SectionTitle
              badge="COMPARATIVO"
              title="Comparativo de Planos"
              subtitle="Veja lado a lado o que cada plano oferece."
            />

            <View style={s.table}>
              {/* Cabeçalho */}
              <View style={s.thRow}>
                <Text style={[s.thFirst, { width: "34%" }]}>Serviço</Text>
                <Text style={[s.th, { width: "22%" }]}>Essencial</Text>
                <Text style={[s.thHighlight, { width: "22%" }]}>Completo</Text>
                <Text style={[s.th, { width: "22%" }]}>Premium</Text>
              </View>

              {/* Categoria: Financeiro */}
              <View style={s.catRow}>
                <Text style={s.catText}>FINANCEIRO</Text>
              </View>
              {[
                ["Emissão de boletos", true, true, true],
                ["Cobrança de inadimplentes", true, true, true],
                ["Balancete digital mensal", true, true, true],
                ["Gestão de contas a pagar", false, true, true],
                ["Pagamentos online integrados", false, true, true],
                ["Planejamento orçamentário anual", false, true, true],
              ].map(([label, ess, comp, prem], i) => (
                <View key={`fin-${i}`} style={i % 2 === 0 ? s.tr : s.trAlt}>
                  <Text style={[s.tdFirst, { width: "34%" }]}>{label as string}</Text>
                  <Text style={[s.td, { width: "22%" }]}>{ess ? "✓" : "—"}</Text>
                  <Text style={[s.td, { width: "22%" }]}>{comp ? "✓" : "—"}</Text>
                  <Text style={[s.td, { width: "22%" }]}>{prem ? "✓" : "—"}</Text>
                </View>
              ))}

              {/* Categoria: Operacional */}
              <View style={s.catRow}>
                <Text style={s.catText}>OPERACIONAL</Text>
              </View>
              {[
                ["Portal do condômino", true, true, true],
                ["Suporte via WhatsApp", true, true, true],
                ["Rateio de água e gás", false, true, true],
                ["Elaboração de atas e convocações", false, true, true],
                ["Relatórios gerenciais", false, true, true],
              ].map(([label, ess, comp, prem], i) => (
                <View key={`op-${i}`} style={i % 2 === 0 ? s.tr : s.trAlt}>
                  <Text style={[s.tdFirst, { width: "34%" }]}>{label as string}</Text>
                  <Text style={[s.td, { width: "22%" }]}>{ess ? "✓" : "—"}</Text>
                  <Text style={[s.td, { width: "22%" }]}>{comp ? "✓" : "—"}</Text>
                  <Text style={[s.td, { width: "22%" }]}>{prem ? "✓" : "—"}</Text>
                </View>
              ))}

              {/* Categoria: Premium */}
              <View style={s.catRow}>
                <Text style={s.catText}>PREMIUM</Text>
              </View>
              {[
                ["Assessoria jurídica condominial", false, false, true],
                ["Cumprimento de obrigações fiscais", false, false, true],
                ["Gestão de obras e reformas", false, false, true],
                ["Revisão anual da convenção", false, false, true],
                ["Atendimento prioritário SLA 12h", false, false, true],
                ["Relatório trimestral de desempenho", false, false, true],
              ].map(([label, ess, comp, prem], i) => (
                <View key={`pm-${i}`} style={i % 2 === 0 ? s.tr : s.trAlt}>
                  <Text style={[s.tdFirst, { width: "34%" }]}>{label as string}</Text>
                  <Text style={[s.td, { width: "22%" }]}>{ess ? "✓" : "—"}</Text>
                  <Text style={[s.td, { width: "22%" }]}>{comp ? "✓" : "—"}</Text>
                  <Text style={[s.td, { width: "22%" }]}>{prem ? "✓" : "—"}</Text>
                </View>
              ))}

              {/* Linha de INVESTIMENTO MENSAL (apenas planos de administração) */}
              <View style={[s.tr, { backgroundColor: NAVY }]}>
                <Text style={[s.thFirst, { width: "34%" }]}>Investimento mensal</Text>
                <Text style={[s.th, { width: "22%" }]}>{formatPlano(calc.essencial)}</Text>
                <Text style={[s.thHighlight, { width: "22%" }]}>{formatPlano(calc.completo)}</Text>
                <Text style={[s.th, { width: "22%" }]}>{formatPlano(calc.premium)}</Text>
              </View>
            </View>

            <Text style={[s.paragraph, { fontSize: 9, textAlign: "center", marginTop: 8 }]}>
              * Valores calculados para {condominio.unidades} unidades. Sujeitos a ajuste conforme
              avaliação técnica.
            </Text>

            <Footer page={pg()} total={pageCount} />
          </Page>
        </>
      )}

      {/* ================================================================
          PÁGINA — SÍNDICO PROFISSIONAL (condicional)
          ================================================================ */}
      {incluiSindico && (
        <Page size="A4" style={s.page}>
          <View style={s.planHero}>
            <Text style={s.planHeroBadge}>SERVIÇO</Text>
            <Text style={s.planHeroTitle}>Síndico Profissional</Text>
            <Text style={s.planHeroSub}>
              Gestão presencial com representação legal do condomínio
            </Text>
          </View>

          <View style={s.idealBox}>
            <Text style={s.idealLabel}>IDEAL PARA</Text>
            <Text style={s.idealText}>
              Condomínios que desejam um síndico dedicado, com experiência em gestão condominial
              e representação legal.
            </Text>
          </View>

          {SERVICOS_PLANOS.sindico.map((srv, i) => (
            <View key={i} style={s.serviceRow}>
              <Text style={s.checkIcon}>&#10003;</Text>
              <Text style={s.serviceText}>{srv}</Text>
            </View>
          ))}

          {/* VALOR DO SÍNDICO — agora aparece AQUI (após a descrição), não no comparativo */}
          <View style={s.invBox}>
            <Text style={s.invLabel}>INVESTIMENTO MENSAL — SÍNDICO</Text>
            {calc.sindico.tipo === "valor" ? (
              <>
                <Text style={s.invValue}>{formatBRL(calc.sindico.mensal)}</Text>
                {calc.sindico.label && (
                  <Text style={s.invNote}>{calc.sindico.label}</Text>
                )}
              </>
            ) : (
              <Text style={s.invConsulte}>{calc.sindico.texto}</Text>
            )}
          </View>

          {/* Combo desconto (se admin + síndico) */}
          {incluiAdmin && (
            <View
              style={{
                marginTop: 14,
                backgroundColor: GOLD,
                borderRadius: 8,
                padding: 14,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 9, color: NAVY, fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>
                COMBO ADMINISTRAÇÃO + SÍNDICO
              </Text>
              <Text style={{ fontSize: 10, color: NAVY_DARK, textAlign: "center", lineHeight: 1.4 }}>
                Ao contratar administração + síndico profissional, ganhe 10% de desconto no valor
                total. Exemplo com Plano Completo:{" "}
                {aplicarDescontoCombo(calc.completo, calc.sindico)}
              </Text>
            </View>
          )}

          <Footer page={pg()} total={pageCount} />
        </Page>
      )}

      {/* ================================================================
          PÁGINA — CONDIÇÕES COMERCIAIS
          ================================================================ */}
      <Page size="A4" style={s.page}>
        <SectionTitle
          badge="CONDIÇÕES"
          title="Condições Comerciais"
          subtitle="Transparência em todos os termos da nossa proposta."
        />

        <View style={s.condGrid}>
          {[
            {
              icon: "\u{1F4C6}",
              title: "Vigência",
              text: "Contrato de 12 meses, renovável automaticamente por igual período.",
            },
            {
              icon: "\u{1F4B3}",
              title: "Pagamento",
              text: "Faturamento mensal via boleto bancário, com vencimento todo dia 10.",
            },
            {
              icon: "\u{1F4DD}",
              title: "Reajuste",
              text: "Reajuste anual pelo IGPM/FGV ou índice equivalente.",
            },
            {
              icon: "\u{23F0}",
              title: "Implantação",
              text: "Prazo de implantação de até 30 dias após assinatura do contrato.",
            },
            {
              icon: "\u{1F6AB}",
              title: "Rescisão",
              text: "Rescisão sem multa após período mínimo de 12 meses, com aviso prévio de 60 dias.",
            },
            {
              icon: "\u{2705}",
              title: "Validade",
              text: "Esta proposta tem validade de 30 dias a partir da data de emissão.",
            },
          ].map((cond, i) => (
            <View key={i} style={s.condCell}>
              <View style={s.condBox}>
                <Text style={s.condIcon}>{cond.icon}</Text>
                <Text style={s.condTitle}>{cond.title}</Text>
                <Text style={s.condText}>{cond.text}</Text>
              </View>
            </View>
          ))}
        </View>

        <Footer page={pg()} total={pageCount} />
      </Page>

      {/* ================================================================
          PÁGINA — PRÓXIMOS PASSOS
          ================================================================ */}
      <Page size="A4" style={s.page}>
        <SectionTitle
          badge="PRÓXIMOS PASSOS"
          title="Como Contratar"
          subtitle="Simples, rápido e sem burocracia."
        />

        {[
          {
            num: "1",
            title: "Aprovação da Proposta",
            desc: "Analise esta proposta e, se aprovada, nos comunique para seguirmos com a formalização.",
          },
          {
            num: "2",
            title: "Assinatura do Contrato",
            desc: "Enviaremos o contrato digital para assinatura eletrônica. Rápido e seguro.",
          },
          {
            num: "3",
            title: "Implantação",
            desc: "Nossa equipe inicia o processo de implantação em até 30 dias, com acompanhamento dedicado.",
          },
          {
            num: "4",
            title: "Gestão Ativa",
            desc: "Seu condomínio passa a contar com toda a estrutura Alpha Condomínios para uma gestão de excelência.",
          },
        ].map((step, i) => (
          <View key={i} style={s.stepRow}>
            <View style={s.stepNumWrap}>
              <Text style={s.stepNum}>{step.num}</Text>
            </View>
            <View style={s.stepBody}>
              <Text style={s.stepTitle}>{step.title}</Text>
              <Text style={s.stepDesc}>{step.desc}</Text>
            </View>
          </View>
        ))}

        {/* Considerações Finais (opcional) */}
        {consideracoesFinais && (
          <View style={[s.idealBox, { marginTop: 20 }]}>
            <Text style={s.idealLabel}>CONSIDERAÇÕES FINAIS</Text>
            <Text style={s.idealText}>{consideracoesFinais}</Text>
          </View>
        )}

        {/* CTA final */}
        <View
          style={{
            marginTop: 24,
            backgroundColor: NAVY,
            borderRadius: 10,
            padding: 24,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 14, color: WHITE, fontWeight: 700, marginBottom: 8 }}>
            Pronto para transformar a gestão do seu condomínio?
          </Text>
          <Text style={{ fontSize: 10, color: GOLD_LIGHT, textAlign: "center", lineHeight: 1.5 }}>
            Entre em contato pelo telefone (31) 99778-7316 ou pelo e-mail{"\n"}
            comercial@alphafacilities.com.br
          </Text>
        </View>

        <Footer page={pg()} total={pageCount} />
      </Page>
    </Document>
  );
}
