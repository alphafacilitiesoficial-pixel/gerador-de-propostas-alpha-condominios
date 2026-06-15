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
  Circle,
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
   ÍCONES SVG — SOMENTE <Path fill> e <Rect fill>
   (compatíveis com @react-pdf/renderer — sem stroke, sem Line,
    sem opacity em filhos)
   ================================================================ */

/* Gráfico de barras — Transparência / Financeiro */
function IconChart({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M3 14h4v7H3zM10 8h4v13h-4zM17 3h4v18h-4z" fill={color} />
    </Svg>
  );
}

/* Monitor — Tecnologia */
function IconMonitor({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M2 3h20v14H2V3zm2 2v10h16V5H4zm5 14h6v2H9v-2z" fill={color} />
    </Svg>
  );
}

/* Pessoas — Atendimento */
function IconPeople({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M9 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM2 20c0-4 3.5-6 7-6s7 2 7 6H2zM17 6a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM19 14c2 1 3 3 3 6h-4c0-2.5-1-4.5-3-5.5a6 6 0 0 1 4-.5z" fill={color} />
    </Svg>
  );
}

/* Escudo com check — Conformidade / Seguro */
function IconShield({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 15l-4-4 1.41-1.41L11 13.17l5.59-5.59L18 9l-7 7z" fill={color} />
    </Svg>
  );
}

/* Documento — Gestão Financeira */
function IconDocument({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M6 2h8l6 6v14H6V2zm8 1.5V8h4.5L14 3.5zM9 13h8v1.5H9V13zm0 3h6v1.5H9V16z" fill={color} />
    </Svg>
  );
}

/* Calendário — Planejamento / Vigência */
function IconCalendar({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7zM5 10h14v10H5V10z" fill={color} />
    </Svg>
  );
}

/* Chave inglesa — Operacional / Manutenção */
function IconWrench({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" fill={color} />
    </Svg>
  );
}

/* Megafone — Comunicação */
function IconMegaphone({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M18 3v18l-12-5V8l12-5zM2 9h4v6H2V9zm7 8.5l3 1.25V17l-3-1.25v1.75z" fill={color} />
    </Svg>
  );
}

/* Cifrão — Pagamento */
function IconMoney({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-1c-1.5-.2-2.8-1-3.2-2.2l1.5-.6c.3.9 1.1 1.3 2.2 1.3 1.2 0 2-.5 2-1.3 0-.8-.5-1.2-2-1.6-1.8-.5-3.2-1-3.2-2.8 0-1.3 1-2.3 2.7-2.6V7h2v1c1.3.2 2.2.9 2.6 2l-1.5.6c-.3-.7-.9-1.1-1.8-1.1-1 0-1.7.5-1.7 1.2 0 .7.6 1 2 1.4 1.9.5 3.2 1.1 3.2 3 0 1.4-1.1 2.4-2.8 2.7V17z" fill={color} />
    </Svg>
  );
}

/* Lápis — Reajuste */
function IconEdit({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill={color} />
    </Svg>
  );
}

/* Relógio — Implantação */
function IconClock({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 11h-2V7h2v4h3v2h-3z" fill={color} />
    </Svg>
  );
}

/* X em círculo — Rescisão */
function IconCancel({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" fill={color} />
    </Svg>
  );
}

/* Check em círculo — Validade / Aceite */
function IconCheckCircle({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-2 15l-5-5 1.41-1.41L9 14.17l7.59-7.59L18 8l-8 9z" fill={color} />
    </Svg>
  );
}

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
  },
  pageNavy: {
    fontSize: 10,
    color: WHITE,
    backgroundColor: NAVY,
    padding: 0,
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
    padding: 14,
    minHeight: 110,
  },
  cardIconWrap: { marginBottom: 8 },
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
  condIconWrap: { marginBottom: 6 },
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
  /* CORREÇÃO 1 — box de contato com borda dourada e fundo branco garantido */
  coverContactBox: {
    backgroundColor: WHITE,
    borderRadius: 8,
    paddingVertical: 18,
    paddingHorizontal: 24,
    width: 280,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: GOLD,
  },
  coverContactLabel: {
    fontSize: 8,
    color: GOLD,
    letterSpacing: 2,
    fontWeight: 700,
    marginBottom: 8,
  },
  coverContactText: {
    fontSize: 11,
    color: NAVY,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 4,
  },
  coverContactEmail: {
    fontSize: 9,
    color: NAVY,
    fontWeight: 600,
    textAlign: "center",
    marginBottom: 3,
  },
  coverContactSite: {
    fontSize: 8.5,
    color: GRAY_500,
    textAlign: "center",
    marginTop: 2,
  },
});

/* ================================================================
   HELPERS
   ================================================================ */

function BuildingSilhouette() {
  return (
    <Svg width={200} height={220} viewBox="0 0 200 220">
      <Rect x="10" y="100" width="40" height="120" fill={GOLD_LIGHT} opacity={0.25} />
      <Rect x="18" y="110" width="8" height="10" fill={WHITE} opacity={0.15} />
      <Rect x="32" y="110" width="8" height="10" fill={WHITE} opacity={0.15} />
      <Rect x="18" y="130" width="8" height="10" fill={WHITE} opacity={0.15} />
      <Rect x="32" y="130" width="8" height="10" fill={WHITE} opacity={0.15} />
      <Rect x="18" y="150" width="8" height="10" fill={WHITE} opacity={0.15} />
      <Rect x="32" y="150" width="8" height="10" fill={WHITE} opacity={0.15} />
      <Rect x="18" y="170" width="8" height="10" fill={WHITE} opacity={0.15} />
      <Rect x="32" y="170" width="8" height="10" fill={WHITE} opacity={0.15} />

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

      <Rect x="172" y="130" width="28" height="90" fill={GOLD} opacity={0.15} />
      <Rect x="178" y="140" width="6" height="8" fill={WHITE} opacity={0.1} />
      <Rect x="188" y="140" width="6" height="8" fill={WHITE} opacity={0.1} />
      <Rect x="178" y="158" width="6" height="8" fill={WHITE} opacity={0.1} />
      <Rect x="188" y="158" width="6" height="8" fill={WHITE} opacity={0.1} />
      <Rect x="178" y="176" width="6" height="8" fill={WHITE} opacity={0.1} />
      <Rect x="188" y="176" width="6" height="8" fill={WHITE} opacity={0.1} />
    </Svg>
  );
}

function Footer({ page, total }: { page: number; total: number }) {
  return (
    <View style={s.footer}>
      <Text style={s.footerText}>
        Pagina {page} de {total}
      </Text>
      <Text style={s.footerBrand}>ALPHA CONDOMINIOS</Text>
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
export function PropostaDocument({
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

  let pageCount = 2;
  if (incluiAdmin) pageCount += 6;
  if (incluiSindico) pageCount += 1;
  pageCount += 2;

  let currentPage = 0;
  const pg = () => ++currentPage;

  return (
    <Document title={`Proposta ${numero} — Alpha Condominios`} author="Alpha Condominios">
      {/* ================================================================
          PAGINA 1 — CAPA (CORREÇÃO 1: telefone + e-mail + site visíveis)
          ================================================================ */}
      <Page size="A4" style={{ padding: 0 }}>
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
          <View style={s.coverLeft}>
            <Image src={logoAlpha} style={s.coverLogo} />
            <Text style={s.coverPropostaLabel}>PROPOSTA COMERCIAL</Text>
            <Text style={s.coverPropostaNum}>N {numero}</Text>
            <Text style={s.coverDate}>{dataStr}</Text>
          </View>

          <View style={s.coverRight}>
            <BuildingSilhouette />
            {/* ---- Box de contato corrigido ---- */}
            <View style={[s.coverContactBox, { marginTop: 24 }]}>
              <Text style={s.coverContactLabel}>ENTRE EM CONTATO</Text>
              <Text style={s.coverContactText}>(31) 99778-7316</Text>
              <Text style={s.coverContactEmail}>comercial@alphafacilities.com.br</Text>
              <Text style={s.coverContactSite}>www.alphafacilities.com.br</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* ================================================================
          PAGINA 2 — QUEM SOMOS
          ================================================================ */}
      <Page size="A4" style={s.page}>
        <SectionTitle
          badge="SOBRE NOS"
          title="Quem Somos"
          subtitle="Conheca a Alpha Condominios e nossa missao de transformar a gestao condominial."
        />
        <Text style={s.paragraph}>
          A Alpha Condominios nasceu com o proposito de profissionalizar e modernizar a
          administracao de condominios, combinando tecnologia, transparencia e atendimento
          humanizado. Atuamos em Belo Horizonte e regiao metropolitana, atendendo condominios
          residenciais, comerciais e mistos.
        </Text>
        <Text style={s.paragraph}>
          Nossa equipe e formada por especialistas em gestao condominial, contabilidade,
          direito imobiliario e tecnologia. Utilizamos sistemas de ponta para garantir controle
          financeiro rigoroso, comunicacao eficiente e total conformidade legal.
        </Text>
        <Text style={s.paragraph}>
          Acreditamos que cada condominio e unico. Por isso, oferecemos planos flexiveis que se
          adaptam a realidade de cada empreendimento — do essencial ao premium, sempre com a
          mesma excelencia.
        </Text>

        <View style={s.idealBox} wrap={false}>
          <Text style={s.idealLabel}>NOSSA MISSAO</Text>
          <Text style={s.idealText}>
            Entregar gestao condominial de excelencia, com transparencia, tecnologia e
            compromisso com o bem-estar dos moradores.
          </Text>
        </View>

        <Footer page={pg()} total={pageCount} />
      </Page>

      {/* ================================================================
          PAGINAS DE ADMINISTRACAO (condicional)
          ================================================================ */}
      {incluiAdmin && (
        <>
          {/* ------ NOSSOS DIFERENCIAIS (CORREÇÃO 3: ícones fill-only) ------ */}
          <Page size="A4" style={s.pageNavy}>
            <View style={{ paddingTop: 50, paddingBottom: 60, paddingHorizontal: 50 }}>
              <SectionTitle
                badge="POR QUE NOS ESCOLHER"
                title="Nossos Diferenciais"
                white
              />
              <View style={s.cardGrid}>
                {[
                  {
                    IconComp: IconChart,
                    title: "Transparencia Total",
                    desc: "Balancetes digitais mensais e acesso em tempo real as financas do condominio.",
                  },
                  {
                    IconComp: IconMonitor,
                    title: "Tecnologia de Ponta",
                    desc: "Portal do condomino, boletos digitais e aplicativo para gestao completa.",
                  },
                  {
                    IconComp: IconPeople,
                    title: "Atendimento Humanizado",
                    desc: "Equipe dedicada com suporte agil via WhatsApp, telefone e e-mail.",
                  },
                  {
                    IconComp: IconShield,
                    title: "Conformidade Legal",
                    desc: "Cumprimento rigoroso das obrigacoes fiscais, trabalhistas e condominiais.",
                  },
                  {
                    IconComp: IconChart,
                    title: "Reducao de Custos",
                    desc: "Gestao estrategica e negociacao qualificada com fornecedores, gerando economia real e sustentavel para o condominio.",
                  },
                  {
                    IconComp: IconShield,
                    title: "Excelencia Comprovada",
                    desc: "Mais de 25 anos de experiencia em administracao condominial, com historico consistente de resultados e satisfacao dos clientes.",
                  },
                ].map((d, i) => (
                  <View key={i} style={s.card}>
                    <View style={s.cardInner}>
                      <View style={s.cardIconWrap}>
                        <d.IconComp color={GOLD} size={28} />
                      </View>
                      <Text style={s.cardTitle}>{d.title}</Text>
                      <Text style={s.cardDesc}>{d.desc}</Text>
                    </View>
                  </View>
                ))}
              </View>
              <Footer page={pg()} total={pageCount} />
            </View>
          </Page>

          {/* ------ NOSSOS SERVICOS (CORREÇÃO 3: ícones fill-only) ------ */}
          <Page size="A4" style={s.page}>
            <SectionTitle
              badge="SERVICOS"
              title="Nossos Servicos"
              subtitle="Solucoes completas para a administracao do seu condominio."
            />
            <View style={s.cardGrid}>
              {[
                {
                  IconComp: IconDocument,
                  title: "Administracao de Condominios",
                  desc: "Gestao completa de todas as atividades administrativas, financeiras e operacionais do condominio, com foco em eficiencia e transparencia.",
                },
                {
                  IconComp: IconPeople,
                  title: "Sindico Profissional",
                  desc: "Profissional qualificado e dedicado exclusivamente a gestao do condominio, garantindo cumprimento de todas as obrigacoes legais. Inclui Seguro de Responsabilidade Civil (RC) de Sindico, protegendo o profissional e o condominio.",
                },
                {
                  IconComp: IconShield,
                  title: "Certificado Digital",
                  desc: "Emissao e gestao de certificados digitais para assinatura eletronica de documentos, atas e contratos, garantindo validade juridica e agilidade.",
                },
                {
                  IconComp: IconShield,
                  title: "Seguro Condominial",
                  desc: "Contratacao e gestao de apolices de seguro patrimonial, incendio, responsabilidade civil e outros, com analise criteriosa de coberturas e custos.",
                },
                {
                  IconComp: IconDocument,
                  title: "AVCB",
                  desc: "Assessoria completa para obtencao e renovacao do Auto de Vistoria do Corpo de Bombeiros, garantindo conformidade legal e seguranca dos moradores.",
                },
                {
                  IconComp: IconDocument,
                  title: "Assessoria Juridica",
                  desc: "Suporte juridico especializado em direito condominial, com orientacao em assembleias, elaboracao de documentos e resolucao de conflitos.",
                },
                {
                  IconComp: IconMoney,
                  title: "Garantidora de Credito",
                  desc: "Intermediacao com empresas garantidoras para locacao de unidades, facilitando a entrada de inquilinos e reduzindo inadimplencia.",
                },
                {
                  IconComp: IconWrench,
                  title: "Dentre Outros",
                  desc: "Solucoes personalizadas conforme necessidades especificas de cada condominio: manutencao predial, comunicacao visual, automacao, sustentabilidade e muito mais.",
                },
              ].map((serv, i) => (
                <View key={i} style={s.card}>
                  <View style={s.cardInner}>
                    <View style={s.cardIconWrap}>
                      <serv.IconComp color={GOLD} size={28} />
                    </View>
                    <Text style={s.cardTitle}>{serv.title}</Text>
                    <Text style={s.cardDesc}>{serv.desc}</Text>
                  </View>
                </View>
              ))}
            </View>



            <Footer page={pg()} total={pageCount} />
          </Page>

          {/* ------ PLANO ESSENCIAL ------ */}
          <Page size="A4" style={s.page}>
            <View style={s.planHero} wrap={false}>
              <Text style={s.planHeroBadge}>PLANO</Text>
              <Text style={s.planHeroTitle}>Essencial</Text>
              <Text style={s.planHeroSub}>Gestao financeira objetiva e eficiente</Text>
            </View>

            <View style={s.idealBox} wrap={false}>
              <Text style={s.idealLabel}>IDEAL PARA</Text>
              <Text style={s.idealText}>
                Condominios que buscam organizacao financeira com custo acessivel.
              </Text>
            </View>

            {SERVICOS_PLANOS.essencial.map((srv, i) => (
              <View key={i} style={s.serviceRow}>
                <Text style={s.checkIcon}>&#10003;</Text>
                <Text style={s.serviceText}>{srv}</Text>
              </View>
            ))}

            <View style={s.invBox} wrap={false}>
              <Text style={s.invLabel}>INVESTIMENTO MENSAL</Text>
              {calc.essencial.tipo === "valor" ? (
                <>
                  <Text style={s.invValue}>{formatBRL(calc.essencial.mensal)}</Text>
                  <Text style={s.invNote}>
                    {formatBRL(calc.essencial.porUnidade)} por unidade/mes
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
            <View style={s.planHero} wrap={false}>
              <Text style={s.planHeroBadge}>PLANO</Text>
              <Text style={s.planHeroTitle}>Completo</Text>
              <Text style={s.planHeroSub}>Administracao completa com gestao integrada</Text>
              <Text style={s.highlightBadge}>MAIS ESCOLHIDO</Text>
            </View>

            <View style={s.idealBox} wrap={false}>
              <Text style={s.idealLabel}>IDEAL PARA</Text>
              <Text style={s.idealText}>
                Condominios que precisam de gestao financeira, operacional e de comunicacao integradas.
              </Text>
            </View>

            {SERVICOS_PLANOS.completo.map((srv, i) => (
              <View key={i} style={s.serviceRow}>
                <Text style={s.checkIcon}>&#10003;</Text>
                <Text style={s.serviceText}>{srv}</Text>
              </View>
            ))}

            <View style={s.invBox} wrap={false}>
              <Text style={s.invLabel}>INVESTIMENTO MENSAL</Text>
              {calc.completo.tipo === "valor" ? (
                <>
                  <Text style={s.invValue}>{formatBRL(calc.completo.mensal)}</Text>
                  <Text style={s.invNote}>
                    {formatBRL(calc.completo.porUnidade)} por unidade/mes
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
            <View style={s.planHero} wrap={false}>
              <Text style={s.planHeroBadge}>PLANO</Text>
              <Text style={s.planHeroTitle}>Premium</Text>
              <Text style={s.planHeroSub}>Gestao completa com assessoria juridica e atendimento prioritario</Text>
            </View>

            <View style={s.idealBox} wrap={false}>
              <Text style={s.idealLabel}>IDEAL PARA</Text>
              <Text style={s.idealText}>
                Condominios que desejam o mais alto nivel de gestao, com suporte juridico e SLA
                de atendimento.
              </Text>
            </View>

            {SERVICOS_PLANOS.premium.map((srv, i) => (
              <View key={i} style={s.serviceRow}>
                <Text style={s.checkIcon}>&#10003;</Text>
                <Text style={s.serviceText}>{srv}</Text>
              </View>
            ))}

            <View style={s.invBox} wrap={false}>
              <Text style={s.invLabel}>INVESTIMENTO MENSAL</Text>
              {calc.premium.tipo === "valor" ? (
                <>
                  <Text style={s.invValue}>{formatBRL(calc.premium.mensal)}</Text>
                  <Text style={s.invNote}>
                    {formatBRL(calc.premium.porUnidade)} por unidade/mes
                  </Text>
                </>
              ) : (
                <Text style={s.invConsulte}>Sob consulta</Text>
              )}
            </View>

            <Footer page={pg()} total={pageCount} />
          </Page>

          {/* ------ COMPARATIVO DE PLANOS ------ */}
          <Page size="A4" style={s.page}>
            <SectionTitle
              badge="COMPARATIVO"
              title="Comparativo de Planos"
              subtitle="Veja lado a lado o que cada plano oferece."
            />

            <View style={s.table}>
              <View style={s.thRow}>
                <Text style={[s.thFirst, { width: "34%" }]}>Servico</Text>
                <Text style={[s.th, { width: "22%" }]}>Essencial</Text>
                <Text style={[s.thHighlight, { width: "22%" }]}>Completo</Text>
                <Text style={[s.th, { width: "22%" }]}>Premium</Text>
              </View>

              <View style={s.catRow}>
                <Text style={s.catText}>FINANCEIRO</Text>
              </View>
              {[
                ["Emissao de boletos", true, true, true],
                ["Cobranca de inadimplentes", true, true, true],
                ["Balancete digital mensal", true, true, true],
                ["Gestao de contas a pagar", false, true, true],
                ["Pagamentos online integrados", false, true, true],
                ["Planejamento orcamentario anual", false, true, true],
              ].map(([label, ess, comp, prem], i) => (
                <View key={`fin-${i}`} style={i % 2 === 0 ? s.tr : s.trAlt}>
                  <Text style={[s.tdFirst, { width: "34%" }]}>{label as string}</Text>
                  <Text style={[s.td, { width: "22%" }]}>{ess ? "+" : "—"}</Text>
                  <Text style={[s.td, { width: "22%" }]}>{comp ? "+" : "—"}</Text>
                  <Text style={[s.td, { width: "22%" }]}>{prem ? "+" : "—"}</Text>
                </View>
              ))}

              <View style={s.catRow}>
                <Text style={s.catText}>OPERACIONAL</Text>
              </View>
              {[
                ["Portal do condomino", true, true, true],
                ["Suporte via WhatsApp", true, true, true],
                ["Rateio de agua e gas", false, true, true],
                ["Elaboracao de atas e convocacoes", false, true, true],
                ["Relatorios gerenciais", false, true, true],
              ].map(([label, ess, comp, prem], i) => (
                <View key={`op-${i}`} style={i % 2 === 0 ? s.tr : s.trAlt}>
                  <Text style={[s.tdFirst, { width: "34%" }]}>{label as string}</Text>
                  <Text style={[s.td, { width: "22%" }]}>{ess ? "+" : "—"}</Text>
                  <Text style={[s.td, { width: "22%" }]}>{comp ? "+" : "—"}</Text>
                  <Text style={[s.td, { width: "22%" }]}>{prem ? "+" : "—"}</Text>
                </View>
              ))}

              <View style={s.catRow}>
                <Text style={s.catText}>PREMIUM</Text>
              </View>
              {[
                ["Assessoria juridica condominial", false, false, true],
                ["Cumprimento de obrigacoes fiscais", false, false, true],
                ["Gestao de obras e reformas", false, false, true],
                ["Revisao anual da convencao", false, false, true],
                ["Atendimento prioritario SLA 12h", false, false, true],
                ["Relatorio trimestral de desempenho", false, false, true],
              ].map(([label, ess, comp, prem], i) => (
                <View key={`pm-${i}`} style={i % 2 === 0 ? s.tr : s.trAlt}>
                  <Text style={[s.tdFirst, { width: "34%" }]}>{label as string}</Text>
                  <Text style={[s.td, { width: "22%" }]}>{ess ? "+" : "—"}</Text>
                  <Text style={[s.td, { width: "22%" }]}>{comp ? "+" : "—"}</Text>
                  <Text style={[s.td, { width: "22%" }]}>{prem ? "+" : "—"}</Text>
                </View>
              ))}

              <View style={[s.tr, { backgroundColor: NAVY }]}>
                <Text style={[s.thFirst, { width: "34%" }]}>Investimento mensal</Text>
                <Text style={[s.th, { width: "22%" }]}>{formatPlano(calc.essencial)}</Text>
                <Text style={[s.thHighlight, { width: "22%" }]}>{formatPlano(calc.completo)}</Text>
                <Text style={[s.th, { width: "22%" }]}>{formatPlano(calc.premium)}</Text>
              </View>
            </View>


            <Footer page={pg()} total={pageCount} />
          </Page>
        </>
      )}

      {/* ================================================================
          PAGINA — SINDICO PROFISSIONAL (condicional)
          ================================================================ */}
      {incluiSindico && (
        <Page size="A4" style={s.page}>
          <View style={s.planHero} wrap={false}>
            <Text style={s.planHeroBadge}>SERVICO</Text>
            <Text style={s.planHeroTitle}>Sindico Profissional</Text>
            <Text style={s.planHeroSub}>
              Gestao presencial com representacao legal do condominio
            </Text>
          </View>

          <View style={s.idealBox} wrap={false}>
            <Text style={s.idealLabel}>IDEAL PARA</Text>
            <Text style={s.idealText}>
              Condominios que desejam um sindico dedicado, com experiencia em gestao condominial
              e representacao legal.
            </Text>
          </View>

          {SERVICOS_PLANOS.sindico.map((srv, i) => (
            <View key={i} style={s.serviceRow}>
              <Text style={s.checkIcon}>&#10003;</Text>
              <Text style={s.serviceText}>{srv}</Text>
            </View>
          ))}

          <View style={s.invBox} wrap={false}>
            <Text style={s.invLabel}>INVESTIMENTO MENSAL — SINDICO</Text>
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

          <View
            style={{
              marginTop: 14,
              backgroundColor: GOLD,
              borderRadius: 8,
              padding: 14,
            }}
          >
            <Text style={{ fontSize: 10.5, color: NAVY_DARK, lineHeight: 1.5, textAlign: "center" }}>
              A Alpha Condominios tem como diferencial no mercado o{" "}
              <Text style={{ fontWeight: 700 }}>
                Seguro de Responsabilidade Civil (RC) do Sindico INCLUSO
              </Text>
              . Protegemos o sindico contra riscos inerentes a funcao, sem custo adicional.
            </Text>
          </View>


          <View style={{ marginTop: 16, backgroundColor: GRAY_50, padding: 12, borderRadius: 6 }}>
            <Text style={{ fontSize: 9, color: GRAY_500, fontStyle: "italic", textAlign: "center" }}>
              Valores calculados para {condominio.unidades} unidades. Sujeitos a ajuste conforme avaliacao tecnica.
            </Text>
          </View>

          <Footer page={pg()} total={pageCount} />
        </Page>
      )}

      {/* ================================================================
          PAGINA — CONDICOES COMERCIAIS (CORREÇÃO 3: ícones fill-only)
          ================================================================ */}
      <Page size="A4" style={s.page}>
        <SectionTitle
          badge="CONDICOES"
          title="Condicoes Comerciais"
          subtitle="Transparencia em todos os termos da nossa proposta."
        />

        <View style={s.condGrid}>
          {[
            {
              IconComp: IconCalendar,
              title: "Vigencia",
              text: "Contrato de 12 meses, renovavel automaticamente por igual periodo.",
            },
            {
              IconComp: IconMoney,
              title: "Pagamento",
              text: "Faturamento mensal via boleto bancario, com vencimento todo dia 10.",
            },
            {
              IconComp: IconEdit,
              title: "Reajuste",
              text: "Reajuste anual pelo IGPM/FGV ou indice equivalente.",
            },
            {
              IconComp: IconClock,
              title: "Implantacao",
              text: "Prazo de implantacao de ate 30 dias apos assinatura do contrato.",
            },
            {
              IconComp: IconCancel,
              title: "Rescisao",
              text: "Rescisao sem multa apos periodo minimo de 12 meses, com aviso previo de 60 dias.",
            },
            {
              IconComp: IconCheckCircle,
              title: "Validade",
              text: "Esta proposta tem validade de 30 dias a partir da data de emissao.",
            },
          ].map((cond, i) => (
            <View key={i} style={s.condCell}>
              <View style={s.condBox}>
                <View style={s.condIconWrap}>
                  <cond.IconComp color={GOLD} size={26} />
                </View>
                <Text style={s.condTitle}>{cond.title}</Text>
                <Text style={s.condText}>{cond.text}</Text>
              </View>
            </View>
          ))}
        </View>

        <Footer page={pg()} total={pageCount} />
      </Page>

      {/* ================================================================
          PAGINA — PROXIMOS PASSOS
          ================================================================ */}
      <Page size="A4" style={s.page}>
        <SectionTitle
          badge="PROXIMOS PASSOS"
          title="Como Contratar"
          subtitle="Simples, rapido e sem burocracia."
        />

        {[
          {
            num: "1",
            title: "Aprovacao da Proposta",
            desc: "Analise esta proposta e, se aprovada, nos comunique para seguirmos com a formalizacao.",
          },
          {
            num: "2",
            title: "Assinatura do Contrato",
            desc: "Enviaremos o contrato digital para assinatura eletronica. Rapido e seguro.",
          },
          {
            num: "3",
            title: "Implantacao",
            desc: "Nossa equipe inicia o processo de implantacao em ate 30 dias, com acompanhamento dedicado.",
          },
          {
            num: "4",
            title: "Gestao Ativa",
            desc: "Seu condominio passa a contar com toda a estrutura Alpha Condominios para uma gestao de excelencia.",
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

        {consideracoesFinais && (
          <View style={[s.idealBox, { marginTop: 20 }]}>
            <Text style={s.idealLabel}>CONSIDERACOES FINAIS</Text>
            <Text style={s.idealText}>{consideracoesFinais}</Text>
          </View>
        )}

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
            Pronto para transformar a gestao do seu condominio?
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
