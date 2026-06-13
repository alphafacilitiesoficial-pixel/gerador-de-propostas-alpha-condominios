import { Document, Page, Text, View, StyleSheet, Image, Svg, Rect, Line, Polygon } from "@react-pdf/renderer";
import {
  calcularPlanos,
  formatPlano,
  formatSindico,
  aplicarDescontoCombo,
  formatBRL,
  SERVICOS_PLANOS,
} from "./calculations";
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
  /* ===== PÁGINAS ===== */
  page: {
    fontSize: 10,
    color: TEXT,
    paddingTop: 50,
    paddingBottom: 60,
    paddingHorizontal: 50,
    backgroundColor: WHITE,
    justifyContent: "center", // ALTERADO — centraliza conteúdo verticalmente
  },
  pageNavy: {
    fontSize: 10,
    color: WHITE,
    backgroundColor: NAVY,
    padding: 0,
    justifyContent: "center", // ALTERADO
  },

  /* ===== TIPOGRAFIA ===== */
  badge: { fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 },
  badgeNavy: { fontSize: 8, color: NAVY, letterSpacing: 2, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 },
  h1: { fontSize: 26, fontWeight: 800, color: NAVY, marginBottom: 14, letterSpacing: -0.5 },
  h1White: { fontSize: 30, fontWeight: 800, color: WHITE, marginBottom: 12, letterSpacing: -0.5, lineHeight: 1.15 },
  h2: { fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 6 },
  subtitle: { fontSize: 11, color: GRAY_500, marginBottom: 24, lineHeight: 1.5 },
  paragraph: { fontSize: 10.5, color: GRAY_700, lineHeight: 1.65, marginBottom: 10 },

  divider: { height: 3, width: 48, backgroundColor: GOLD, marginBottom: 18 },

  /* ===== FOOTER ===== */
  footer: { position: "absolute", bottom: 24, left: 50, right: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTopWidth: 0.5, borderTopColor: GRAY_300 },
  footerText: { fontSize: 8, color: GRAY_500 },
  footerBrand: { fontSize: 8, color: NAVY, fontWeight: 700, letterSpacing: 1 },

  /* ===== CARDS ===== */
  cardGrid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -6 },
  card: { width: "50%", padding: 6 },
  cardInner: { backgroundColor: WHITE, borderWidth: 1, borderColor: GRAY_100, borderRadius: 8, padding: 16, height: 130 },
  cardIcon: { fontSize: 20, marginBottom: 8, color: GOLD },
  cardTitle: { fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 4 },
  cardDesc: { fontSize: 9, color: GRAY_500, lineHeight: 1.5 },

  pillRow: { flexDirection: "row", marginTop: 20 },
  pill: { backgroundColor: NAVY, color: WHITE, paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, fontSize: 9, fontWeight: 600, marginRight: 8 },

  /* ===== PLANO HERO ===== */
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
  invConsulte: { fontSize: 18, color: GOLD_LIGHT, fontWeight: 700, fontStyle: "italic" },

  /* ===== TABELA ===== */
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

  /* ===== CONDIÇÕES ===== */
  condGrid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -7 },
  condCell: { width: "50%", padding: 7 },
  condBox: { borderWidth: 1, borderColor: GRAY_100, borderRadius: 8, padding: 16, backgroundColor: GRAY_50, minHeight: 100 },
  condIcon: { fontSize: 18, color: GOLD, marginBottom: 6 },
  condTitle: { fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 4 },
  condText: { fontSize: 9.5, color: GRAY_700, lineHeight: 1.5 },

  /* ===== STEPS ===== */
  stepRow: { flexDirection: "row", marginBottom: 18, alignItems: "flex-start" },
  stepNumWrap: { width: 50, height: 50, borderRadius: 25, backgroundColor: NAVY, alignItems: "center", justifyContent: "center", marginRight: 16 },
  stepNum: { color: GOLD, fontSize: 20, fontWeight: 800 },
  stepBody: { flex: 1, paddingTop: 4 },
  stepTitle: { fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 4 },
  stepDesc: { fontSize: 10, color: GRAY_700, lineHeight: 1.5 },

  /* ===== CAPA — REDESIGN ===== */
  coverWrap: { flex: 1, flexDirection: "row" },
  coverLeft: {
    width: "55%",
    backgroundColor: WHITE,
    padding: 50,
    paddingTop: 60,
    justifyContent: "space-between",
  },
  coverRight: {
    width: "45%",
    backgroundColor: NAVY,
    padding: 0,
    position: "relative",
    overflow: "hidden",
  },
  coverGoldBar: { position: "absolute", top: 0, left: 0, width: 4, height: "100%", backgroundColor: GOLD },
  coverContactCard: {
    position: "absolute",
    bottom: 50,
    left: 30,
    right: 30,
    backgroundColor: WHITE,
    borderRadius: 8,
    padding: 18,
    alignItems: "center", // ALTERADO — centraliza telefone e e-mail
  },
  coverContactRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 4 },
  coverContactText: { fontSize: 9, color: NAVY, fontWeight: 600, textAlign: "center" },
  coverPreparedLabel: { fontSize: 8, color: GOLD, letterSpacing: 3, fontWeight: 700, marginBottom: 8 },
  coverPreparedName: { fontSize: 16, color: NAVY, fontWeight: 700, marginBottom: 2 },
  coverPreparedSub: { fontSize: 11, color: GRAY_500, fontWeight: 500 },
  coverDate: { fontSize: 10, color: GRAY_500, marginTop: 4 },
  coverNumberBadge: { position: "absolute", top: 50, right: 50, fontSize: 9, color: GOLD, letterSpacing: 2, fontWeight: 700 },

  /* ===== SKYLINE SILHUETA ===== */
  skylineWrap: { position: "absolute", bottom: 140, left: 0, right: 0, height: 120, opacity: 0.12 },
});

/* ===== COMPONENTE: Silhueta de Prédio (SVG simples) ===== */
function SkylineSilhouette() {
  return (
    <View style={s.skylineWrap}>
      <Svg viewBox="0 0 400 120" width="100%" height="120">
        {/* Prédio 1 — fino e alto */}
        <Rect x="20" y="20" width="30" height="100" fill={GOLD} />
        <Rect x="25" y="30" width="8" height="8" fill={NAVY} />
        <Rect x="37" y="30" width="8" height="8" fill={NAVY} />
        <Rect x="25" y="45" width="8" height="8" fill={NAVY} />
        <Rect x="37" y="45" width="8" height="8" fill={NAVY} />
        <Rect x="25" y="60" width="8" height="8" fill={NAVY} />
        <Rect x="37" y="60" width="8" height="8" fill={NAVY} />
        <Rect x="25" y="75" width="8" height="8" fill={NAVY} />
        <Rect x="37" y="75" width="8" height="8" fill={NAVY} />

        {/* Prédio 2 — médio */}
        <Rect x="65" y="40" width="45" height="80" fill={GOLD} />
        <Rect x="72" y="50" width="8" height="8" fill={NAVY} />
        <Rect x="85" y="50" width="8" height="8" fill={NAVY} />
        <Rect x="95" y="50" width="8" height="8" fill={NAVY} />
        <Rect x="72" y="65" width="8" height="8" fill={NAVY} />
        <Rect x="85" y="65" width="8" height="8" fill={NAVY} />
        <Rect x="95" y="65" width="8" height="8" fill={NAVY} />
        <Rect x="72" y="80" width="8" height="8" fill={NAVY} />
        <Rect x="85" y="80" width="8" height="8" fill={NAVY} />
        <Rect x="95" y="80" width="8" height="8" fill={NAVY} />

        {/* Prédio 3 — torre principal (mais alto) */}
        <Rect x="130" y="5" width="50" height="115" fill={GOLD} />
        {/* Antena no topo */}
        <Line x1="155" y1="0" x2="155" y2="5" style={{ stroke: GOLD, strokeWidth: 2 }} />
        <Rect x="137" y="15" width="8" height="8" fill={NAVY} />
        <Rect x="150" y="15" width="8" height="8" fill={NAVY} />
        <Rect x="165" y="15" width="8" height="8" fill={NAVY} />
        <Rect x="137" y="30" width="8" height="8" fill={NAVY} />
        <Rect x="150" y="30" width="8" height="8" fill={NAVY} />
        <Rect x="165" y="30" width="8" height="8" fill={NAVY} />
        <Rect x="137" y="45" width="8" height="8" fill={NAVY} />
        <Rect x="150" y="45" width="8" height="8" fill={NAVY} />
        <Rect x="165" y="45" width="8" height="8" fill={NAVY} />
        <Rect x="137" y="60" width="8" height="8" fill={NAVY} />
        <Rect x="150" y="60" width="8" height="8" fill={NAVY} />
        <Rect x="165" y="60" width="8" height="8" fill={NAVY} />
        <Rect x="137" y="75" width="8" height="8" fill={NAVY} />
        <Rect x="150" y="75" width="8" height="8" fill={NAVY} />
        <Rect x="165" y="75" width="8" height="8" fill={NAVY} />
        <Rect x="137" y="90" width="8" height="8" fill={NAVY} />
        <Rect x="150" y="90" width="8" height="8" fill={NAVY} />
        <Rect x="165" y="90" width="8" height="8" fill={NAVY} />

        {/* Prédio 4 — baixo e largo */}
        <Rect x="200" y="60" width="60" height="60" fill={GOLD} />
        <Rect x="207" y="70" width="8" height="8" fill={NAVY} />
        <Rect x="220" y="70" width="8" height="8" fill={NAVY} />
        <Rect x="233" y="70" width="8" height="8" fill={NAVY} />
        <Rect x="246" y="70" width="8" height="8" fill={NAVY} />
        <Rect x="207" y="85" width="8" height="8" fill={NAVY} />
        <Rect x="220" y="85" width="8" height="8" fill={NAVY} />
        <Rect x="233" y="85" width="8" height="8" fill={NAVY} />
        <Rect x="246" y="85" width="8" height="8" fill={NAVY} />

        {/* Prédio 5 — fino */}
        <Rect x="280" y="30" width="28" height="90" fill={GOLD} />
        <Rect x="285" y="40" width="7" height="7" fill={NAVY} />
        <Rect x="296" y="40" width="7" height="7" fill={NAVY} />
        <Rect x="285" y="55" width="7" height="7" fill={NAVY} />
        <Rect x="296" y="55" width="7" height="7" fill={NAVY} />
        <Rect x="285" y="70" width="7" height="7" fill={NAVY} />
        <Rect x="296" y="70" width="7" height="7" fill={NAVY} />
        <Rect x="285" y="85" width="7" height="7" fill={NAVY} />
        <Rect x="296" y="85" width="7" height="7" fill={NAVY} />

        {/* Prédio 6 — médio com topo triangular */}
        <Rect x="325" y="35" width="40" height="85" fill={GOLD} />
        <Polygon points="325,35 345,15 365,35" fill={GOLD} />
        <Rect x="332" y="45" width="7" height="7" fill={NAVY} />
        <Rect x="345" y="45" width="7" height="7" fill={NAVY} />
        <Rect x="332" y="60" width="7" height="7" fill={NAVY} />
        <Rect x="345" y="60" width="7" height="7" fill={NAVY} />
        <Rect x="332" y="75" width="7" height="7" fill={NAVY} />
        <Rect x="345" y="75" width="7" height="7" fill={NAVY} />
        <Rect x="332" y="90" width="7" height="7" fill={NAVY} />
        <Rect x="345" y="90" width="7" height="7" fill={NAVY} />

        {/* Linha do chão */}
        <Line x1="0" y1="120" x2="400" y2="120" style={{ stroke: GOLD, strokeWidth: 1 }} />
      </Svg>
    </View>
  );
}

/* ===== ÍCONES UNICODE que renderizam no @react-pdf ===== */
const ICON = {
  shield: "\u{1F6E1}",      // 🛡 — segurança/proteção
  chart: "\u{1F4CA}",       // 📊 — relatórios/dados
  clock: "\u{23F0}",        // ⏰ — agilidade/prazo
  handshake: "\u{1F91D}",   // 🤝 — parceria
  star: "\u{2B50}",         // ⭐ — destaque/premium
  check: "\u{2714}",        // ✔ — check
  building: "\u{1F3E2}",    // 🏢 — prédio
  key: "\u{1F511}",         // 🔑 — acesso/gestão
  doc: "\u{1F4C4}",         // 📄 — documento
  money: "\u{1F4B0}",       // 💰 — financeiro
  people: "\u{1F465}",      // 👥 — pessoas/equipe
  gear: "\u{2699}",         // ⚙ — configuração/serviço
  phone: "\u{1F4DE}",       // 📞 — telefone
  mail: "\u{2709}",         // ✉ — e-mail
  calendar: "\u{1F4C5}",    // 📅 — agenda/prazo
  scale: "\u{2696}",        // ⚖ — jurídico
  trophy: "\u{1F3C6}",      // 🏆 — excelência
  rocket: "\u{1F680}",      // 🚀 — inovação
  lock: "\u{1F512}",        // 🔒 — segurança
  lightbulb: "\u{1F4A1}",   // 💡 — ideia/solução
};

export interface PropostaDocProps {
  numero: string;
  data: Date;
  cidade?: string;
  condominio: { nome: string; endereco: string; unidades: number; tipo: string };
  contato: { nome: string; telefone: string; email: string };
  incluiAdmin: boolean;
  incluiSindico: boolean;
  consideracoesFinais?: string;
}

/* ===== FOOTER REUTILIZÁVEL ===== */
function Footer({ pagina, total }: { pagina: number; total: number }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>Alpha Facilities &amp; Condomínios</Text>
      <Text style={s.footerText}>
        {pagina} / {total}
      </Text>
      <Text style={s.footerBrand}>ALPHA CONDOMÍNIOS</Text>
    </View>
  );
}

/* ===== DOCUMENTO PRINCIPAL ===== */
export function PropostaDocument(props: PropostaDocProps) {
  const { numero, data, cidade, condominio, contato, incluiAdmin, incluiSindico, consideracoesFinais } = props;
  const calc = calcularPlanos(condominio.unidades);
  const dataFormatada = data.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  // Cálculo dinâmico de total de páginas
  let totalPaginas = 1; // capa
  if (incluiAdmin) totalPaginas += 6; // sobre + diferenciais + 3 planos + comparativo
  if (incluiSindico) totalPaginas += 1; // página síndico
  // ALTERADO — valor do síndico agora fica na página pós-descrição do síndico (já inclusa acima)
  totalPaginas += 2; // condições + próximos passos
  if (consideracoesFinais) totalPaginas += 1;

  let pag = 0;
  const nextPag = () => ++pag;

  return (
    <Document>
      {/* ===================================================================
          PÁGINA 1 — CAPA (REDESIGN: degradê branco → navy)
          =================================================================== */}
      <Page size="A4" style={{ fontSize: 10, padding: 0 }}>
        <View style={s.coverWrap}>
          {/* LADO ESQUERDO — fundo branco para a logo preta */}
          <View style={s.coverLeft}>
            {/* Logo */}
            <View>
              <Image src={logoAlpha} style={{ width: 160, height: 80, objectFit: "contain", marginBottom: 30 }} />
              {/* REMOVIDO: texto "ALPHA CONDOMÍNIOS" abaixo da logo */}
            </View>

            {/* Título da proposta */}
            <View>
              <Text style={s.badgeNavy}>PROPOSTA COMERCIAL</Text>
              <Text style={[s.h1, { fontSize: 28, marginBottom: 10 }]}>{condominio.nome}</Text>
              <View style={s.divider} />
              <Text style={[s.paragraph, { color: GRAY_500, marginBottom: 4 }]}>{condominio.endereco}</Text>
              <Text style={[s.paragraph, { color: GRAY_500, marginBottom: 4 }]}>
                {condominio.unidades} unidades — {condominio.tipo.charAt(0).toUpperCase() + condominio.tipo.slice(1)}
              </Text>
            </View>

            {/* Preparado para */}
            <View>
              <Text style={s.coverPreparedLabel}>PREPARADO PARA</Text>
              <Text style={s.coverPreparedName}>{contato.nome}</Text>
              <Text style={s.coverDate}>{dataFormatada}</Text>
            </View>
          </View>

          {/* LADO DIREITO — fundo navy com silhueta de prédios */}
          <View style={s.coverRight}>
            {/* Barra dourada na borda */}
            <View style={s.coverGoldBar} />

            {/* REMOVIDO: "A" marca d'água (coverDecor1, coverDecor2) */}

            {/* Número da proposta */}
            <Text style={s.coverNumberBadge}>N.º {numero}</Text>

            {/* Silhueta de prédios */}
            <SkylineSilhouette />

            {/* Card de contato — centralizado */}
            <View style={s.coverContactCard}>
              <View style={s.coverContactRow}>
                <Text style={s.coverContactText}>{ICON.phone} {contato.telefone}</Text>
              </View>
              <View style={[s.coverContactRow, { marginBottom: 0 }]}>
                <Text style={[s.coverContactText, { fontSize: 8 }]}>{ICON.mail} {contato.email}</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>

      {/* ===================================================================
          PÁGINAS DE ADMINISTRAÇÃO
          =================================================================== */}
      {incluiAdmin && (
        <>
          {/* ---- PÁGINA: SOBRE A ALPHA ---- */}
          <Page size="A4" style={s.page}>
            <Text style={s.badge}>SOBRE NÓS</Text>
            <Text style={s.h1}>Quem é a Alpha Condomínios?</Text>
            <View style={s.divider} />

            <Text style={s.paragraph}>
              A Alpha Condomínios é especializada em administração condominial e síndico profissional,
              oferecendo soluções modernas que combinam tecnologia, transparência e atendimento humanizado.
            </Text>
            <Text style={s.paragraph}>
              Nossa missão é transformar a gestão do seu condomínio, reduzindo custos, eliminando burocracias
              e proporcionando tranquilidade para síndicos e moradores.
            </Text>
            <Text style={s.paragraph}>
              Com uma equipe multidisciplinar e plataforma digital completa, entregamos relatórios em tempo real,
              cobrança automatizada e suporte dedicado via WhatsApp.
            </Text>

            <View style={s.pillRow}>
              <Text style={s.pill}>{ICON.rocket} Inovação</Text>
              <Text style={s.pill}>{ICON.shield} Segurança</Text>
              <Text style={s.pill}>{ICON.chart} Transparência</Text>
              <Text style={s.pill}>{ICON.handshake} Parceria</Text>
            </View>

            <Footer pagina={nextPag()} total={totalPaginas} />
          </Page>

          {/* ---- PÁGINA: NOSSOS DIFERENCIAIS ---- */}
          <Page size="A4" style={s.page}>
            <Text style={s.badge}>POR QUE A ALPHA?</Text>
            <Text style={s.h1}>Nossos Diferenciais</Text>
            <View style={s.divider} />

            <View style={s.cardGrid}>
              {[
                { icon: ICON.chart, title: "Transparência Total", desc: "Balancetes digitais acessíveis 24h com detalhamento completo de receitas e despesas." },
                { icon: ICON.rocket, title: "Tecnologia de Ponta", desc: "Portal do condômino, app mobile, boletos digitais e relatórios automatizados." },
                { icon: ICON.clock, title: "Agilidade no Atendimento", desc: "Suporte via WhatsApp com SLA definido. Respostas rápidas e eficientes." },
                { icon: ICON.shield, title: "Segurança Jurídica", desc: "Assessoria jurídica especializada em direito condominial e trabalhista." },
                { icon: ICON.money, title: "Redução de Custos", desc: "Negociação com fornecedores e otimização de contratos para reduzir despesas." },
                { icon: ICON.trophy, title: "Excelência Comprovada", desc: "Condomínios satisfeitos com gestão profissional e resultados mensuráveis." },
              ].map((item, i) => (
                <View key={i} style={s.card}>
                  <View style={s.cardInner}>
                    <Text style={s.cardIcon}>{item.icon}</Text>
                    <Text style={s.cardTitle}>{item.title}</Text>
                    <Text style={s.cardDesc}>{item.desc}</Text>
                  </View>
                </View>
              ))}
            </View>

            <Footer pagina={nextPag()} total={totalPaginas} />
          </Page>

          {/* ---- PÁGINA: PLANO ESSENCIAL ---- */}
          <Page size="A4" style={s.page}>
            <View style={s.planHero}>
              <Text style={s.planHeroBadge}>PLANO</Text>
              <Text style={s.planHeroTitle}>Essencial</Text>
              <Text style={s.planHeroSub}>Gestão financeira simplificada e eficiente</Text>
            </View>

            <View style={s.idealBox}>
              <Text style={s.idealLabel}>{ICON.lightbulb} IDEAL PARA</Text>
              <Text style={s.idealText}>Condomínios que buscam organização financeira com custo acessível.</Text>
            </View>

            {SERVICOS_PLANOS.essencial.map((srv, i) => (
              <View key={i} style={s.serviceRow}>
                <Text style={s.checkIcon}>{ICON.check}</Text>
                <Text style={s.serviceText}>{srv}</Text>
              </View>
            ))}

            {/* ALTERADO — só mostra valor se incluiAdmin */}
            <View style={s.invBox}>
              <Text style={s.invLabel}>INVESTIMENTO MENSAL</Text>
              {calc.essencial.tipo === "valor" ? (
                <>
                  <Text style={s.invValue}>{formatBRL(calc.essencial.mensal)}</Text>
                  <Text style={s.invNote}>{formatBRL(calc.essencial.porUnidade)} por unidade/mês</Text>
                </>
              ) : (
                <Text style={s.invConsulte}>Consulte as Vantagens</Text>
              )}
            </View>

            <Footer pagina={nextPag()} total={totalPaginas} />
          </Page>

          {/* ---- PÁGINA: PLANO COMPLETO ---- */}
          <Page size="A4" style={s.page}>
            <View style={s.planHero}>
              <Text style={s.planHeroBadge}>PLANO</Text>
              <Text style={s.planHeroTitle}>Completo</Text>
              <Text style={s.planHeroSub}>Administração completa para condomínios exigentes</Text>
              <View style={s.highlightBadge}>
                <Text style={{ color: NAVY, fontSize: 8, fontWeight: 700 }}>{ICON.star} MAIS ESCOLHIDO</Text>
              </View>
            </View>

            <View style={s.idealBox}>
              <Text style={s.idealLabel}>{ICON.lightbulb} IDEAL PARA</Text>
              <Text style={s.idealText}>Condomínios que desejam gestão completa com relatórios gerenciais e planejamento.</Text>
            </View>

            {SERVICOS_PLANOS.completo.map((srv, i) => (
              <View key={i} style={s.serviceRow}>
                <Text style={s.checkIcon}>{ICON.check}</Text>
                <Text style={s.serviceText}>{srv}</Text>
              </View>
            ))}

            <View style={s.invBox}>
              <Text style={s.invLabel}>INVESTIMENTO MENSAL</Text>
              {calc.completo.tipo === "valor" ? (
                <>
                  <Text style={s.invValue}>{formatBRL(calc.completo.mensal)}</Text>
                  <Text style={s.invNote}>{formatBRL(calc.completo.porUnidade)} por unidade/mês</Text>
                </>
              ) : (
                <Text style={s.invConsulte}>Consulte as Vantagens</Text>
              )}
            </View>

            <Footer pagina={nextPag()} total={totalPaginas} />
          </Page>

          {/* ---- PÁGINA: PLANO PREMIUM ---- */}
          <Page size="A4" style={s.page}>
            <View style={s.planHero}>
              <Text style={s.planHeroBadge}>PLANO</Text>
              <Text style={s.planHeroTitle}>Premium</Text>
              <Text style={s.planHeroSub}>O mais completo: gestão total com assessoria jurídica</Text>
            </View>

            <View style={s.idealBox}>
              <Text style={s.idealLabel}>{ICON.lightbulb} IDEAL PARA</Text>
              <Text style={s.idealText}>Condomínios de alto padrão ou com demandas jurídicas e fiscais complexas.</Text>
            </View>

            {SERVICOS_PLANOS.premium.map((srv, i) => (
              <View key={i} style={s.serviceRow}>
                <Text style={s.checkIcon}>{ICON.check}</Text>
                <Text style={s.serviceText}>{srv}</Text>
              </View>
            ))}

            <View style={s.invBox}>
              <Text style={s.invLabel}>INVESTIMENTO MENSAL</Text>
              {calc.premium.tipo === "valor" ? (
                <>
                  <Text style={s.invValue}>{formatBRL(calc.premium.mensal)}</Text>
                  <Text style={s.invNote}>{formatBRL(calc.premium.porUnidade)} por unidade/mês</Text>
                </>
              ) : (
                <Text style={s.invConsulte}>Consulte as Vantagens</Text>
              )}
            </View>

            <Footer pagina={nextPag()} total={totalPaginas} />
          </Page>

          {/* ---- PÁGINA: COMPARATIVO DE PLANOS ---- */}
          {/* ALTERADO — removido valor do síndico desta tabela */}
          <Page size="A4" style={s.page}>
            <Text style={s.badge}>COMPARATIVO</Text>
            <Text style={s.h1}>Comparativo de Planos</Text>
            <View style={s.divider} />

            <View style={s.table}>
              <View style={s.thRow}>
                <Text style={[s.thFirst, { width: "34%" }]}>Serviço</Text>
                <Text style={[s.th, { width: "22%" }]}>Essencial</Text>
                <Text style={[s.thHighlight, { width: "22%" }]}>Completo</Text>
                <Text style={[s.th, { width: "22%" }]}>Premium</Text>
              </View>

              {/* Categoria: Financeiro */}
              <View style={s.catRow}><Text style={s.catText}>{ICON.money} FINANCEIRO</Text></View>
              {[
                ["Emissão de boletos", true, true, true],
                ["Cobrança de inadimplentes", true, true, true],
                ["Balancete digital mensal", true, true, true],
                ["Gestão de contas a pagar", false, true, true],
                ["Planejamento orçamentário", false, true, true],
                ["Pagamentos online integrados", false, true, true],
              ].map(([label, ess, comp, prem], i) => (
                <View key={i} style={i % 2 ? s.trAlt : s.tr}>
                  <Text style={[s.tdFirst, { width: "34%" }]}>{label as string}</Text>
                  <Text style={[s.td, { width: "22%" }]}>{ess ? ICON.check : "—"}</Text>
                  <Text style={[s.td, { width: "22%" }]}>{comp ? ICON.check : "—"}</Text>
                  <Text style={[s.td, { width: "22%" }]}>{prem ? ICON.check : "—"}</Text>
                </View>
              ))}

              {/* Categoria: Gestão */}
              <View style={s.catRow}><Text style={s.catText}>{ICON.gear} GESTÃO</Text></View>
              {[
                ["Portal do condômino", true, true, true],
                ["Suporte via WhatsApp", true, true, true],
                ["Elaboração de atas", false, true, true],
                ["Relatórios gerenciais", false, true, true],
                ["Rateio de água e gás", false, true, true],
                ["Gestão de obras e reformas", false, false, true],
              ].map(([label, ess, comp, prem], i) => (
                <View key={i} style={i % 2 ? s.trAlt : s.tr}>
                  <Text style={[s.tdFirst, { width: "34%" }]}>{label as string}</Text>
                  <Text style={[s.td, { width: "22%" }]}>{ess ? ICON.check : "—"}</Text>
                  <Text style={[s.td, { width: "22%" }]}>{comp ? ICON.check : "—"}</Text>
                  <Text style={[s.td, { width: "22%" }]}>{prem ? ICON.check : "—"}</Text>
                </View>
              ))}

              {/* Categoria: Jurídico */}
              <View style={s.catRow}><Text style={s.catText}>{ICON.scale} JURÍDICO E FISCAL</Text></View>
              {[
                ["Assessoria jurídica condominial", false, false, true],
                ["Obrigações fiscais", false, false, true],
                ["Revisão anual da convenção", false, false, true],
                ["Atendimento prioritário SLA 12h", false, false, true],
                ["Relatório trimestral de desempenho", false, false, true],
              ].map(([label, ess, comp, prem], i) => (
                <View key={i} style={i % 2 ? s.trAlt : s.tr}>
                  <Text style={[s.tdFirst, { width: "34%" }]}>{label as string}</Text>
                  <Text style={[s.td, { width: "22%" }]}>{ess ? ICON.check : "—"}</Text>
                  <Text style={[s.td, { width: "22%" }]}>{comp ? ICON.check : "—"}</Text>
                  <Text style={[s.td, { width: "22%" }]}>{prem ? ICON.check : "—"}</Text>
                </View>
              ))}

              {/* Linha de investimento — SEM valor de síndico */}
              <View style={[s.thRow, { marginTop: 2 }]}>
                <Text style={[s.thFirst, { width: "34%" }]}>Investimento/mês</Text>
                <Text style={[s.th, { width: "22%" }]}>
                  {calc.essencial.tipo === "valor" ? formatBRL(calc.essencial.mensal) : "Consulte"}
                </Text>
                <Text style={[s.thHighlight, { width: "22%" }]}>
                  {calc.completo.tipo === "valor" ? formatBRL(calc.completo.mensal) : "Consulte"}
                </Text>
                <Text style={[s.th, { width: "22%" }]}>
                  {calc.premium.tipo === "valor" ? formatBRL(calc.premium.mensal) : "Consulte"}
                </Text>
              </View>
            </View>

            <Footer pagina={nextPag()} total={totalPaginas} />
          </Page>
        </>
      )}

      {/* ===================================================================
          PÁGINA: SÍNDICO PROFISSIONAL
          =================================================================== */}
      {incluiSindico && (
        <Page size="A4" style={s.page}>
          <Text style={s.badge}>SERVIÇO ADICIONAL</Text>
          <Text style={s.h1}>Síndico Profissional</Text>
          <View style={s.divider} />

          <Text style={s.paragraph}>
            O serviço de Síndico Profissional da Alpha Condomínios coloca à disposição do seu condomínio
            um gestor dedicado e experiente, responsável pela representação legal, gestão operacional,
            condução de assembleias e relacionamento com moradores e fornecedores.
          </Text>

          {/* Destaque: Seguro RC */}
          <View style={[s.idealBox, { marginTop: 14, marginBottom: 18 }]}>
            <Text style={s.idealLabel}>{ICON.shield} SEGURO DE RESPONSABILIDADE CIVIL (RC)</Text>
            <Text style={s.idealText}>
              Todo síndico profissional Alpha atua com cobertura de Seguro de Responsabilidade Civil,
              garantindo proteção patrimonial ao condomínio e ao gestor.
            </Text>
          </View>

          {/* Serviços inclusos */}
          <Text style={[s.badge, { marginTop: 10 }]}>SERVIÇOS INCLUSOS</Text>
          {SERVICOS_PLANOS.sindico.map((srv, i) => (
            <View key={i} style={s.serviceRow}>
              <Text style={s.checkIcon}>{ICON.check}</Text>
              <Text style={s.serviceText}>{srv}</Text>
            </View>
          ))}

          {/* ALTERADO — Valor do síndico agora aparece AQUI (após a descrição) */}
          <View style={s.invBox}>
            <Text style={s.invLabel}>INVESTIMENTO MENSAL — SÍNDICO PROFISSIONAL</Text>
            {calc.sindico.tipo === "valor" ? (
              <>
                <Text style={s.invValue}>{formatBRL(calc.sindico.mensal)}</Text>
                {calc.sindico.label && <Text style={s.invNote}>{calc.sindico.label}</Text>}
              </>
            ) : (
              <>
                <Text style={s.invConsulte}>{calc.sindico.texto}</Text>
              </>
            )}
          </View>

          {/* Combo desconto se ambos selecionados */}
          {incluiAdmin && (
            <View style={[s.idealBox, { marginTop: 16, borderLeftColor: GOLD }]}>
              <Text style={s.idealLabel}>{ICON.star} COMBO: ADMINISTRAÇÃO + SÍNDICO (10% OFF)</Text>
              <Text style={[s.idealText, { fontWeight: 700, fontStyle: "normal", color: NAVY }]}>
                Plano Completo + Síndico: {aplicarDescontoCombo(calc.completo, calc.sindico)}
              </Text>
            </View>
          )}

          <Footer pagina={nextPag()} total={totalPaginas} />
        </Page>
      )}

      {/* ===================================================================
          PÁGINA: CONDIÇÕES COMERCIAIS
          =================================================================== */}
      <Page size="A4" style={s.page}>
        <Text style={s.badge}>CONDIÇÕES</Text>
        <Text style={s.h1}>Condições Comerciais</Text>
        <View style={s.divider} />

        <View style={s.condGrid}>
          {[
            { icon: ICON.calendar, title: "Vigência", text: "Contrato de 12 meses com renovação automática." },
            { icon: ICON.doc, title: "Pagamento", text: "Faturamento mensal via boleto bancário com vencimento no dia 10." },
            { icon: ICON.clock, title: "Implantação", text: "Prazo de até 15 dias úteis após assinatura do contrato." },
            { icon: ICON.lock, title: "Rescisão", text: "Aviso prévio de 60 dias por qualquer das partes, sem multa." },
            { icon: ICON.gear, title: "Reajuste", text: "Reajuste anual pelo IGPM/FGV ou índice equivalente." },
            { icon: ICON.handshake, title: "Suporte", text: "Canal exclusivo via WhatsApp, e-mail e telefone em horário comercial." },
          ].map((item, i) => (
            <View key={i} style={s.condCell}>
              <View style={s.condBox}>
                <Text style={s.condIcon}>{item.icon}</Text>
                <Text style={s.condTitle}>{item.title}</Text>
                <Text style={s.condText}>{item.text}</Text>
              </View>
            </View>
          ))}
        </View>

        <Footer pagina={nextPag()} total={totalPaginas} />
      </Page>

      {/* ===================================================================
          PÁGINA: PRÓXIMOS PASSOS
          =================================================================== */}
      <Page size="A4" style={s.page}>
        <Text style={s.badge}>PRÓXIMOS PASSOS</Text>
        <Text style={s.h1}>Como Começar</Text>
        <View style={s.divider} />

        {[
          { num: "1", title: "Aprovação da Proposta", desc: "Apresente esta proposta em assembleia ou obtenha aprovação do conselho para dar início ao processo." },
          { num: "2", title: "Assinatura do Contrato", desc: "Formalizamos o contrato digital com todas as condições acordadas nesta proposta." },
          { num: "3", title: "Onboarding Completo", desc: "Nossa equipe realiza a transição completa: documentos, acessos, fornecedores e contas bancárias." },
          { num: "4", title: "Gestão Ativa", desc: "Em até 15 dias úteis seu condomínio estará 100% operacional com a Alpha Condomínios." },
        ].map((item, i) => (
          <View key={i} style={s.stepRow}>
            <View style={s.stepNumWrap}>
              <Text style={s.stepNum}>{item.num}</Text>
            </View>
            <View style={s.stepBody}>
              <Text style={s.stepTitle}>{item.title}</Text>
              <Text style={s.stepDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}

        <View style={[s.invBox, { marginTop: 10 }]}>
          <Text style={s.invLabel}>VALIDADE DESTA PROPOSTA</Text>
          <Text style={[s.invValue, { fontSize: 20 }]}>30 dias a partir de {dataFormatada}</Text>
        </View>

        <Footer pagina={nextPag()} total={totalPaginas} />
      </Page>

      {/* ===================================================================
          PÁGINA: CONSIDERAÇÕES FINAIS (OPCIONAL)
          =================================================================== */}
      {consideracoesFinais && (
        <Page size="A4" style={s.page}>
          <Text style={s.badge}>OBSERVAÇÕES</Text>
          <Text style={s.h1}>Considerações Finais</Text>
          <View style={s.divider} />

          <Text style={s.paragraph}>{consideracoesFinais}</Text>

          <Footer pagina={nextPag()} total={totalPaginas} />
        </Page>
      )}
    </Document>
  );
}
