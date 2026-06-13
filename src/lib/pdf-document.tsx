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
   ÍCONES SVG INLINE (react-pdf compatíveis)
   ================================================================ */

/* Ícone: Gráfico de barras — Transparência / Financeiro */
function IconChart({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x="3" y="14" width="4" height="7" rx="1" fill={color} opacity={0.6} />
      <Rect x="10" y="8" width="4" height="13" rx="1" fill={color} opacity={0.8} />
      <Rect x="17" y="3" width="4" height="18" rx="1" fill={color} />
    </Svg>
  );
}

/* Ícone: Monitor/tela — Tecnologia */
function IconMonitor({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x="2" y="3" width="20" height="14" rx="2" fill="none" stroke={color} strokeWidth={1.8} />
      <Line x1="8" y1="21" x2="16" y2="21" stroke={color} strokeWidth={1.8} />
      <Line x1="12" y1="17" x2="12" y2="21" stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

/* Ícone: Pessoas — Atendimento / Assembleia */
function IconPeople({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="9" cy="7" r="3" fill="none" stroke={color} strokeWidth={1.8} />
      <Path d="M2 21 C2 16 5 14 9 14 C13 14 16 16 16 21" fill="none" stroke={color} strokeWidth={1.8} />
      <Circle cx="17" cy="8" r="2.5" fill="none" stroke={color} strokeWidth={1.5} opacity={0.7} />
      <Path d="M19 14 C21 15 22 17 22 21" fill="none" stroke={color} strokeWidth={1.5} opacity={0.7} />
    </Svg>
  );
}

/* Ícone: Escudo com check — Conformidade / Seguro */
function IconShield({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 2 L3 6 L3 12 C3 17 7 21 12 22 C17 21 21 17 21 12 L21 6 Z" fill="none" stroke={color} strokeWidth={1.8} />
      <Path d="M8 12 L11 15 L16 9" fill="none" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

/* Ícone: Documento/página — Gestão Financeira / Contrato */
function IconDocument({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M6 2 L14 2 L20 8 L20 22 L6 22 Z" fill="none" stroke={color} strokeWidth={1.8} />
      <Path d="M14 2 L14 8 L20 8" fill="none" stroke={color} strokeWidth={1.8} />
      <Line x1="9" y1="13" x2="17" y2="13" stroke={color} strokeWidth={1.3} />
      <Line x1="9" y1="16" x2="15" y2="16" stroke={color} strokeWidth={1.3} />
    </Svg>
  );
}

/* Ícone: Calendário — Planejamento / Vigência */
function IconCalendar({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke={color} strokeWidth={1.8} />
      <Line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth={1.8} />
      <Line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth={1.8} />
      <Line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

/* Ícone: Chave inglesa — Operacional / Manutenção */
function IconWrench({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M14.7 6.3 C13.5 3.5 10.5 2 7.5 2.8 C4.5 3.6 2.5 6.5 3 9.5 C3.3 11.5 4.7 13.2 6.5 14 L14 21.5 C14.8 22.3 16.2 22.3 17 21.5 L17.5 21 C18.3 20.2 18.3 18.8 17.5 18 L10 10.5 C10.8 8.7 10.5 6.5 9 5" fill="none" stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

/* Ícone: Megafone — Comunicação */
function IconMegaphone({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M18 3 L6 8 L6 16 L18 21 Z" fill="none" stroke={color} strokeWidth={1.8} />
      <Rect x="2" y="9" width="4" height="6" rx="1" fill="none" stroke={color} strokeWidth={1.8} />
      <Line x1="18" y1="8" x2="22" y2="6" stroke={color} strokeWidth={1.5} />
      <Line x1="18" y1="12" x2="22" y2="12" stroke={color} strokeWidth={1.5} />
      <Line x1="18" y1="16" x2="22" y2="18" stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

/* Ícone: Cifrão em círculo — Pagamento */
function IconMoney({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth={1.8} />
      <Line x1="12" y1="6" x2="12" y2="18" stroke={color} strokeWidth={1.5} />
      <Path d="M8 10 C8 8 10 7.5 12 7.5 C14 7.5 16 8.5 16 10 C16 12 8 12 8 14 C8 15.5 10 16.5 12 16.5 C14 16.5 16 16 16 14" fill="none" stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

/* Ícone: Lápis / Editar — Reajuste */
function IconEdit({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M16 3 L21 8 L8 21 L3 21 L3 16 Z" fill="none" stroke={color} strokeWidth={1.8} />
      <Line x1="14" y1="5" x2="19" y2="10" stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

/* Ícone: Relógio — Implantação / Prazo */
function IconClock({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth={1.8} />
      <Line x1="12" y1="6" x2="12" y2="12" stroke={color} strokeWidth={2} />
      <Line x1="12" y1="12" x2="16" y2="14" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

/* Ícone: X em círculo — Rescisão */
function IconCancel({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth={1.8} />
      <Line x1="8" y1="8" x2="16" y2="16" stroke={color} strokeWidth={2} />
      <Line x1="16" y1="8" x2="8" y2="16" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

/* Ícone: Check em círculo — Validade / Aceite */
function IconCheckCircle({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth={1.8} />
      <Path d="M7 12 L10 15 L17 8" fill="none" stroke={color} strokeWidth={2} />
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
  coverContactBox: {
    backgroundColor: WHITE,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: 280,
    alignItems: "center",
  },
  coverContactText: {
    fontSize: 10,
    color: NAVY,
    fontWeight: 600,
    textAlign: "center",
    marginBottom: 3,
  },
  coverContactEmail: {
    fontSize: 8.5,
    color: NAVY,
    fontWeight: 600,
    textAlign: "center",
    width: "100%",
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
      <Line x1="85" y1="40" x2="85" y2="22" stroke={GOLD} strokeWidth={1.5} opacity={0.3} />
      <Line x1="80" y1="28" x2="90" y2="28" stroke={GOLD} strokeWidth={1} opacity={0.3} />

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

      <Line x1="0" y1="220" x2="200" y2="220" stroke={GOLD} strokeWidth={1} opacity={0.3} />
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

  let pageCount = 2;
  if (incluiAdmin) pageCount += 6;
  if (incluiSindico) pageCount += 1;
  pageCount += 2;

  let currentPage = 0;
  const pg = () => ++currentPage;

  return (
    <Document title={`Proposta ${numero} — Alpha Condominios`} author="Alpha Condominios">
      {/* ================================================================
          PAGINA 1 — CAPA
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
            <View style={[s.coverContactBox, { marginTop: 24 }]}>
              <Text style={s.coverContactText}>(31) 99778-7316</Text>
              <Text style={s.coverContactEmail}>comercial@alphafacilities.com.br</Text>
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

        <View style={s.idealBox}>
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
                ].map((d, i) => (
                  <View key={i} style={s.card}>
                    <View style={s.cardInner}>
                      <View style={s.cardIconWrap}>
                        <d.IconComp color={GOLD} size={26} />
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

          {/* ------ NOSSOS SERVICOS ------ */}
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
                  title: "Gestao Financeira",
                  desc: "Emissao de boletos, cobrancas, balancetes e controle de inadimplencia.",
                },
                {
                  IconComp: IconCalendar,
                  title: "Planejamento",
                  desc: "Orcamento anual, previsao de despesas e fundo de reserva.",
                },
                {
                  IconComp: IconWrench,
                  title: "Gestao Operacional",
                  desc: "Manutencoes preventivas, gestao de contratos e fornecedores.",
                },
                {
                  IconComp: IconMegaphone,
                  title: "Comunicacao",
                  desc: "Portal do condomino, assembleias online e comunicados digitais.",
                },
              ].map((serv, i) => (
                <View key={i} style={s.card}>
                  <View style={s.cardInner}>
                    <View style={s.cardIconWrap}>
                      <serv.IconComp color={GOLD} size={26} />
                    </View>
                    <Text style={s.cardTitle}>{serv.title}</Text>
                    <Text style={s.cardDesc}>{serv.desc}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Seguro RC do Sindico */}
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
              <View style={{ marginRight: 12 }}>
                <IconShield color={NAVY} size={28} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 2 }}>
                  Seguro de Responsabilidade Civil (RC) do Sindico
                </Text>
                <Text style={{ fontSize: 9.5, color: NAVY_DARK, lineHeight: 1.4 }}>
                  Todos os nossos planos incluem seguro RC, protegendo o sindico contra riscos
                  inerentes a funcao.
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
              <Text style={s.planHeroSub}>Gestao financeira objetiva e eficiente</Text>
            </View>

            <View style={s.idealBox}>
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

            <View style={s.invBox}>
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
            <View style={s.planHero}>
              <Text style={s.planHeroBadge}>PLANO</Text>
              <Text style={s.planHeroTitle}>Completo</Text>
              <Text style={s.planHeroSub}>Administracao completa com gestao integrada</Text>
              <Text style={s.highlightBadge}>MAIS ESCOLHIDO</Text>
            </View>

            <View style={s.idealBox}>
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

            <View style={s.invBox}>
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
            <View style={s.planHero}>
              <Text style={s.planHeroBadge}>PLANO</Text>
              <Text style={s.planHeroTitle}>Premium</Text>
              <Text style={s.planHeroSub}>Gestao completa com assessoria juridica e atendimento prioritario</Text>
            </View>

            <View style={s.idealBox}>
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

            <View style={s.invBox}>
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

          {/* ------ COMPARATIVO DE PLANOS (SEM valor de sindico) ------ */}
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

            <Text style={[s.paragraph, { fontSize: 9, textAlign: "center", marginTop: 8 }]}>
              * Valores calculados para {condominio.unidades} unidades. Sujeitos a ajuste conforme
              avaliacao tecnica.
            </Text>

            <Footer page={pg()} total={pageCount} />
          </Page>
        </>
      )}

      {/* ================================================================
          PAGINA — SINDICO PROFISSIONAL (condicional)
          ================================================================ */}
      {incluiSindico && (
        <Page size="A4" style={s.page}>
          <View style={s.planHero}>
            <Text style={s.planHeroBadge}>SERVICO</Text>
            <Text style={s.planHeroTitle}>Sindico Profissional</Text>
            <Text style={s.planHeroSub}>
              Gestao presencial com representacao legal do condominio
            </Text>
          </View>

          <View style={s.idealBox}>
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

          <View style={s.invBox}>
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
                COMBO ADMINISTRACAO + SINDICO
              </Text>
              <Text style={{ fontSize: 10, color: NAVY_DARK, textAlign: "center", lineHeight: 1.4 }}>
                Ao contratar administracao + sindico profissional, ganhe 10% de desconto no valor
                total. Exemplo com Plano Completo:{" "}
                {aplicarDescontoCombo(calc.completo, calc.sindico)}
              </Text>
            </View>
          )}

          <Footer page={pg()} total={pageCount} />
        </Page>
      )}

      {/* ================================================================
          PAGINA — CONDICOES COMERCIAIS
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
                  <cond.IconComp color={GOLD} size={24} />
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
