import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Svg,
  Path,
  Circle,
  Rect,
  Line,
  Polygon,
} from "@react-pdf/renderer";
import {
  calcularPlanos,
  formatSindico,
  formatBRL,
} from "./calculations";

/* ================================================================
   CORES
   ================================================================ */
const NAVY        = "#1B2A4A";
const GOLD        = "#C8A961";
const GOLD_LIGHT  = "#E5D4A1";
const WHITE       = "#FFFFFF";
const GRAY_50     = "#F7F8FA";
const GRAY_200    = "#E5E7EB";
const GRAY_500    = "#6B7280";
const GRAY_700    = "#374151";
const TEXT_COLOR  = "#111827";
const GREEN_CHECK = "#16A34A";
const NAVY_MID    = "#243555";
const NAVY_DARK   = "#111D33";

import logoAlpha from "../assets/logo-alpha.png";
const LOGO_B64 = logoAlpha;

/* ================================================================
   SILHUETA DE PRÉDIOS SVG
   ================================================================ */
function BuildingsSilhouette({ width = 260, height = 180 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 260 180">
      {/* Prédio fundo esquerdo */}
      <Rect x="10" y="60" width="40" height="120" fill={NAVY_MID} opacity="0.5" />
      <Rect x="15" y="70" width="8" height="10" fill={GOLD} opacity="0.3" />
      <Rect x="27" y="70" width="8" height="10" fill={GOLD} opacity="0.3" />
      <Rect x="15" y="85" width="8" height="10" fill={GOLD} opacity="0.2" />
      <Rect x="27" y="85" width="8" height="10" fill={GOLD} opacity="0.4" />
      <Rect x="15" y="100" width="8" height="10" fill={GOLD} opacity="0.3" />
      <Rect x="27" y="100" width="8" height="10" fill={GOLD} opacity="0.2" />

      {/* Torre central alta */}
      <Rect x="60" y="20" width="50" height="160" fill={NAVY_MID} opacity="0.65" />
      <Rect x="65" y="28" width="10" height="12" fill={GOLD} opacity="0.4" />
      <Rect x="79" y="28" width="10" height="12" fill={GOLD} opacity="0.25" />
      <Rect x="93" y="28" width="10" height="12" fill={GOLD} opacity="0.4" />
      <Rect x="65" y="46" width="10" height="12" fill={GOLD} opacity="0.3" />
      <Rect x="79" y="46" width="10" height="12" fill={GOLD} opacity="0.4" />
      <Rect x="93" y="46" width="10" height="12" fill={GOLD} opacity="0.2" />
      <Rect x="65" y="64" width="10" height="12" fill={GOLD} opacity="0.4" />
      <Rect x="79" y="64" width="10" height="12" fill={GOLD} opacity="0.3" />
      <Rect x="93" y="64" width="10" height="12" fill={GOLD} opacity="0.4" />
      <Rect x="65" y="82" width="10" height="12" fill={GOLD} opacity="0.2" />
      <Rect x="79" y="82" width="10" height="12" fill={GOLD} opacity="0.4" />
      <Rect x="93" y="82" width="10" height="12" fill={GOLD} opacity="0.3" />
      <Rect x="65" y="100" width="10" height="12" fill={GOLD} opacity="0.4" />
      <Rect x="79" y="100" width="10" height="12" fill={GOLD} opacity="0.2" />
      <Rect x="93" y="100" width="10" height="12" fill={GOLD} opacity="0.4" />

      {/* Prédio direita médio */}
      <Rect x="120" y="40" width="44" height="140" fill={NAVY_MID} opacity="0.55" />
      <Rect x="126" y="48" width="9" height="11" fill={GOLD} opacity="0.35" />
      <Rect x="139" y="48" width="9" height="11" fill={GOLD} opacity="0.2" />
      <Rect x="152" y="48" width="9" height="11" fill={GOLD} opacity="0.35" />
      <Rect x="126" y="64" width="9" height="11" fill={GOLD} opacity="0.2" />
      <Rect x="139" y="64" width="9" height="11" fill={GOLD} opacity="0.35" />
      <Rect x="152" y="64" width="9" height="11" fill={GOLD} opacity="0.2" />
      <Rect x="126" y="80" width="9" height="11" fill={GOLD} opacity="0.35" />
      <Rect x="139" y="80" width="9" height="11" fill={GOLD} opacity="0.2" />
      <Rect x="152" y="80" width="9" height="11" fill={GOLD} opacity="0.35" />
      <Rect x="126" y="96" width="9" height="11" fill={GOLD} opacity="0.2" />
      <Rect x="139" y="96" width="9" height="11" fill={GOLD} opacity="0.35" />

      {/* Prédio direita baixo */}
      <Rect x="174" y="70" width="36" height="110" fill={NAVY_MID} opacity="0.5" />
      <Rect x="179" y="78" width="8" height="10" fill={GOLD} opacity="0.3" />
      <Rect x="191" y="78" width="8" height="10" fill={GOLD} opacity="0.2" />
      <Rect x="179" y="93" width="8" height="10" fill={GOLD} opacity="0.35" />
      <Rect x="191" y="93" width="8" height="10" fill={GOLD} opacity="0.3" />
      <Rect x="179" y="108" width="8" height="10" fill={GOLD} opacity="0.2" />
      <Rect x="191" y="108" width="8" height="10" fill={GOLD} opacity="0.35" />

      {/* Torre fundo direita */}
      <Rect x="218" y="30" width="34" height="150" fill={NAVY_MID} opacity="0.4" />
      <Rect x="223" y="38" width="7" height="9" fill={GOLD} opacity="0.3" />
      <Rect x="234" y="38" width="7" height="9" fill={GOLD} opacity="0.2" />
      <Rect x="223" y="52" width="7" height="9" fill={GOLD} opacity="0.35" />
      <Rect x="234" y="52" width="7" height="9" fill={GOLD} opacity="0.3" />
      <Rect x="223" y="66" width="7" height="9" fill={GOLD} opacity="0.2" />
      <Rect x="234" y="66" width="7" height="9" fill={GOLD} opacity="0.35" />

      {/* Chão */}
      <Rect x="0" y="175" width="260" height="5" fill={NAVY_DARK} opacity="0.6" />
    </Svg>
  );
}

/* ================================================================
   HELPERS GLOBAIS
   ================================================================ */
function PageFooter({ current, total }: { current: number; total: number }) {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: NAVY,
        paddingVertical: 8,
        paddingHorizontal: 50,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 1.5, fontWeight: "bold" }}>
        ALPHA CONDOMÍNIOS
      </Text>
      <Text style={{ fontSize: 7.5, color: WHITE }}>
        Página {current} de {total}
      </Text>
    </View>
  );
}

function PageHeader({ label }: { label: string }) {
  return (
    <View
      style={{
        backgroundColor: NAVY,
        paddingVertical: 12,
        paddingHorizontal: 50,
      }}
    >
      <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 3, fontWeight: "bold" }}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

function Divider() {
  return <View style={{ height: 3, width: 44, backgroundColor: GOLD, marginBottom: 16 }} />;
}

function SectionRule() {
  return <View style={{ height: 0.5, backgroundColor: GRAY_200 }} />;
}

function FeatureRow({ text }: { text: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 8 }}>
      <View
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: GREEN_CHECK,
          marginRight: 10,
          marginTop: 1,
          flexShrink: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 9, color: WHITE, fontWeight: "bold" }}>✓</Text>
      </View>
      <Text style={{ fontSize: 9.5, color: GRAY_700, flex: 1, lineHeight: 1.5 }}>
        {text}
      </Text>
    </View>
  );
}

function ServicoRow({ titulo, descricao }: { titulo: string; descricao: string }) {
  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "flex-start", paddingVertical: 13 }}>
        <View
          style={{
            width: 5,
            height: 5,
            borderRadius: 3,
            backgroundColor: GOLD,
            marginRight: 13,
            marginTop: 4,
            flexShrink: 0,
          }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 10.5, fontWeight: "bold", color: NAVY, marginBottom: 3 }}>
            {titulo}
          </Text>
          <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.6 }}>
            {descricao}
          </Text>
        </View>
      </View>
      <SectionRule />
    </View>
  );
}

function DiferencialCard({
  icon,
  titulo,
  texto,
}: {
  icon: React.ReactNode;
  titulo: string;
  texto: string;
}) {
  return (
    <View
      style={{
        width: "47%",
        backgroundColor: GRAY_50,
        borderRadius: 6,
        padding: 14,
        marginBottom: 10,
        borderLeftWidth: 3,
        borderLeftColor: GOLD,
      }}
    >
      <View style={{ marginBottom: 6 }}>{icon}</View>
      <Text style={{ fontSize: 9.5, fontWeight: "bold", color: NAVY, marginBottom: 4 }}>
        {titulo}
      </Text>
      <Text style={{ fontSize: 8.5, color: GRAY_700, lineHeight: 1.5 }}>{texto}</Text>
    </View>
  );
}

function CondicaoBox({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <View
      style={{
        width: "47%",
        backgroundColor: GRAY_50,
        borderRadius: 6,
        padding: 14,
        marginBottom: 10,
        borderTopWidth: 3,
        borderTopColor: GOLD,
      }}
    >
      <Text style={{ fontSize: 9.5, fontWeight: "bold", color: NAVY, marginBottom: 5 }}>
        {titulo}
      </Text>
      <Text style={{ fontSize: 9, color: GRAY_700, lineHeight: 1.55 }}>{texto}</Text>
    </View>
  );
}

function StepRow({ n, titulo, texto }: { n: number; titulo: string; texto: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 22 }}>
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 17,
          backgroundColor: GOLD,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 16,
          flexShrink: 0,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "bold", color: NAVY }}>{n}</Text>
      </View>
      <View style={{ flex: 1, paddingTop: 3 }}>
        <Text style={{ fontSize: 11, fontWeight: "bold", color: NAVY, marginBottom: 4 }}>
          {titulo}
        </Text>
        <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.55 }}>{texto}</Text>
      </View>
    </View>
  );
}

/* ================================================================
   SVG ÍCONES
   ================================================================ */
const IChart = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path d="M3 14h4v7H3zM10 8h4v13h-4zM17 3h4v18h-4z" fill={GOLD} />
  </Svg>
);
const IMonitor = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path d="M2 3h20v14H2V3zm2 2v10h16V5H4zm5 14h6v2H9v-2z" fill={GOLD} />
  </Svg>
);
const IPeople = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      d="M9 4a3 3 0 1 1 0 6A3 3 0 0 1 9 4zM2 20c0-4 3.5-6 7-6s7 2 7 6H2zM17 6a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM19 14c2 1 3 3 3 6h-4c0-2.5-1-4.5-3-5.5a6 6 0 0 1 4-.5z"
      fill={GOLD}
    />
  </Svg>
);
const IShield = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 15l-4-4 1.41-1.41L11 13.17l5.59-5.59L18 9l-7 7z"
      fill={GOLD}
    />
  </Svg>
);
const IMoney = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 15h-2v-1c-1.5-.2-2.8-1-3.2-2.2l1.5-.6c.3.9 1.1 1.3 2.2 1.3 1.2 0 2-.5 2-1.3 0-.8-.5-1.2-2-1.6-1.8-.5-3.2-1-3.2-2.8 0-1.3 1-2.3 2.7-2.6V7h2v1c1.3.2 2.2.9 2.6 2l-1.5.6c-.3-.7-.9-1.1-1.8-1.1-1 0-1.7.5-1.7 1.2 0 .7.6 1 2 1.4 1.9.5 3.2 1.1 3.2 3 0 1.4-1.1 2.4-2.8 2.7V17z"
      fill={GOLD}
    />
  </Svg>
);
const IStar = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill={GOLD}
    />
  </Svg>
);

/* ================================================================
   TIPOS
   ================================================================ */
interface PropostaPDFData {
  numero: string;
  data: Date;
  cidade?: string;
  condominio: { nome: string; endereco: string; unidades: number; tipo: string };
  contato: { nome: string; telefone: string; email: string };
  incluiAdmin: boolean;
  incluiSindico: boolean;
  consideracoesFinais?: string;
}

function formatPlanoDetalhado(p: ReturnType<typeof calcularPlanos>["essencial"]) {
  if (p.tipo === "valor") {
    return {
      totalFmt: formatBRL(p.mensal) + "/mês",
      porUnidadeFmt: formatBRL(p.porUnidade),
    };
  }
  return { totalFmt: p.texto, porUnidadeFmt: "Sob consulta" };
}

/* ================================================================
   DOCUMENTO PRINCIPAL
   ================================================================ */
export function PropostaDocument(props: PropostaPDFData) {
  const {
    numero,
    data,
    cidade,
    condominio,
    contato,
    incluiAdmin,
    incluiSindico,
    consideracoesFinais,
  } = props;

  const nomeCondominio  = condominio?.nome     || "Condomínio";
  const numeroUnidades  = Number(condominio?.unidades) || 0;
  const bairro          = condominio?.endereco || "";
  const nomeContato     = contato?.nome        || "";
  const numeroContrato  = numero               || "";

  const dataHoje = (data instanceof Date ? data : new Date()).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  });

  /* contagem de páginas */
  let total = 1; // capa
  total += 1;    // quem somos
  total += 1;    // diferenciais
  if (incluiAdmin) {
    total += 1;  // serviços
    total += 3;  // planos
    total += 1;  // comparativo
  }
  if (incluiSindico) total += 1;
  total += 1;    // condições
  total += 1;    // próximos passos
  if (consideracoesFinais?.trim()) total += 1;
  total += 1;    // contracapa

  const planos   = calcularPlanos(numeroUnidades);
  const essencial = formatPlanoDetalhado(planos.essencial);
  const completo  = formatPlanoDetalhado(planos.completo);
  const premium   = formatPlanoDetalhado(planos.premium);
  const sindico   = incluiSindico ? formatSindico(numeroUnidades) : null;

  const localidade = [bairro, cidade].filter(Boolean).join(" – ");

  /* numeração sequencial */
  let pg = 0;
  const nextPg = () => ++pg;

  /* ================================================================
     PÁG 1 — CAPA
     ================================================================ */
  const capaPg = nextPg();

  /* ================================================================
     PÁG 2 — QUEM SOMOS
     ================================================================ */
  const quemSomosPg = nextPg();

  /* ================================================================
     PÁG 3 — DIFERENCIAIS
     ================================================================ */
  const diferenciaisPg = nextPg();

  /* ================================================================
     PÁG 4 — SERVIÇOS
     ================================================================ */
  const servicosPg = incluiAdmin ? nextPg() : null;

  /* ================================================================
     PLANOS
     ================================================================ */
  const planoEssencialPg = incluiAdmin ? nextPg() : null;
  const planoCompletoPg  = incluiAdmin ? nextPg() : null;
  const planoPremiumPg   = incluiAdmin ? nextPg() : null;

  /* ================================================================
     COMPARATIVO
     ================================================================ */
  const comparativoPg = incluiAdmin ? nextPg() : null;

  /* ================================================================
     SÍNDICO
     ================================================================ */
  const sindicoPg = incluiSindico ? nextPg() : null;

  /* ================================================================
     CONDIÇÕES
     ================================================================ */
  const condicoesPg = nextPg();

  /* ================================================================
     PRÓXIMOS PASSOS
     ================================================================ */
  const passosPg = nextPg();

  /* ================================================================
     CONSIDERAÇÕES FINAIS
     ================================================================ */
  const finalPg = consideracoesFinais?.trim() ? nextPg() : null;

  /* ================================================================
     CONTRACAPA
     ================================================================ */
  const contracapaPg = nextPg();

  /* ─── comparativo rows ──────────────────────────────────────── */
  const CHECK = "✓";
  const DASH  = "—";

  const compRows: Array<{
    label: string;
    e: string;
    c: string;
    p: string;
    category?: string;
  }> = [
    { label: "FINANCEIRO", e: "", c: "", p: "", category: "header" },
    { label: "Emissão de boletos",            e: CHECK, c: CHECK, p: CHECK },
    { label: "Cobrança de inadimplentes",      e: CHECK, c: CHECK, p: CHECK },
    { label: "Balancete digital mensal",       e: CHECK, c: CHECK, p: CHECK },
    { label: "Gestão de contas a pagar",       e: DASH,  c: CHECK, p: CHECK },
    { label: "Pagamentos online integrados",   e: DASH,  c: CHECK, p: CHECK },
    { label: "Planejamento orçamentário anual",e: DASH,  c: CHECK, p: CHECK },
    { label: "OPERACIONAL", e: "", c: "", p: "", category: "header" },
    { label: "Portal do condômino",            e: CHECK, c: CHECK, p: CHECK },
    { label: "Suporte via WhatsApp",           e: CHECK, c: CHECK, p: CHECK },
    { label: "Rateio de água e gás",           e: DASH,  c: CHECK, p: CHECK },
    { label: "Elaboração de atas e convocações",e: DASH, c: CHECK, p: CHECK },
    { label: "Relatórios gerenciais",          e: DASH,  c: CHECK, p: CHECK },
    { label: "PREMIUM", e: "", c: "", p: "", category: "header" },
    { label: "Assessoria jurídica condominial",e: DASH,  c: DASH,  p: CHECK },
    { label: "Cumprimento de obrigações fiscais",e: DASH, c: DASH, p: CHECK },
    { label: "Gestão de obras e reformas",     e: DASH,  c: DASH,  p: CHECK },
    { label: "Revisão anual da convenção",     e: DASH,  c: DASH,  p: CHECK },
    { label: "Atendimento prioritário SLA 12h",e: DASH,  c: DASH,  p: CHECK },
    { label: "Relatório trimestral de desempenho",e: DASH,c: DASH, p: CHECK },
  ];

  /* ================================================================
     RENDER
     ================================================================ */
  return (
    <Document>

      {/* ============================================================
          PÁG 1 — CAPA
          ============================================================ */}
      <Page size="A4" style={{ flexDirection: "row", backgroundColor: WHITE }}>

        {/* Coluna esquerda */}
        <View style={{ width: "55%", paddingHorizontal: 44, paddingVertical: 50, justifyContent: "space-between" }}>

          {/* Logo GRANDE */}
          <Image
            src={LOGO_B64}
            style={{ width: 180, height: 72, objectFit: "contain", marginBottom: 0 }}
          />

          {/* Bloco central de texto */}
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 3, fontWeight: "bold", marginBottom: 10 }}>
              PROPOSTA COMERCIAL
            </Text>
            <Text style={{ fontSize: 30, fontWeight: "bold", color: NAVY, lineHeight: 1.2, marginBottom: 20 }}>
              {nomeCondominio}
            </Text>
            <View style={{ height: 3, width: 44, backgroundColor: GOLD, marginBottom: 20 }} />

            {localidade ? (
              <Text style={{ fontSize: 10, color: GRAY_500, marginBottom: 6 }}>{localidade}</Text>
            ) : null}
            <Text style={{ fontSize: 10, color: GRAY_500, marginBottom: 6 }}>
              {numeroUnidades} unidades
            </Text>
            <Text style={{ fontSize: 10, color: GRAY_500, marginBottom: 24 }}>
              Preparado para: {nomeContato}
            </Text>

            <View style={{ backgroundColor: GRAY_50, borderRadius: 6, padding: 14, borderLeftWidth: 3, borderLeftColor: GOLD }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <Text style={{ fontSize: 8, color: GRAY_500, letterSpacing: 1 }}>N° DA PROPOSTA</Text>
                <Text style={{ fontSize: 8, color: GRAY_500, letterSpacing: 1 }}>DATA</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 9.5, fontWeight: "bold", color: NAVY }}>
                  PROP-{numeroContrato}
                </Text>
                <Text style={{ fontSize: 9.5, fontWeight: "bold", color: NAVY }}>{dataHoje}</Text>
              </View>
            </View>
          </View>

          {/* Rodapé contato */}
          <View>
            <Text style={{ fontSize: 8.5, color: GRAY_500, marginBottom: 3 }}>
              {contato?.telefone || ""}
            </Text>
            <Text style={{ fontSize: 8.5, color: GRAY_500, marginBottom: 3 }}>
              {contato?.email || ""}
            </Text>
            <Text style={{ fontSize: 8.5, color: GRAY_500 }}>www.alphafacilities.com.br</Text>
          </View>
        </View>

        {/* Coluna direita — gradiente azul + prédios */}
        <View
          style={{
            width: "45%",
            backgroundColor: NAVY,
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 0,
            overflow: "hidden",
          }}
        >
          {/* Gradiente simulado com camadas */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: NAVY_MID,
            }}
          />
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "50%",
              backgroundColor: "#1E3A5F",
              opacity: 0.6,
            }}
          />

          {/* Texto central coluna direita */}
          <View style={{ position: "absolute", top: 60, left: 0, right: 0, alignItems: "center", paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 10, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 12, textAlign: "center" }}>
              ALPHA CONDOMÍNIOS
            </Text>
            <Text style={{ fontSize: 12, color: WHITE, textAlign: "center", lineHeight: 1.6, opacity: 0.9 }}>
              Gestão Condominial{"\n"}de Excelência
            </Text>
          </View>

          {/* Silhueta de prédios na base */}
          <BuildingsSilhouette width={260} height={200} />
        </View>
      </Page>

      {/* ============================================================
          PÁG 2 — QUEM SOMOS
          ============================================================ */}
      <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
        <PageHeader label="Sobre Nós" />

        <View style={{ paddingHorizontal: 50, paddingTop: 36 }}>
          <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>
            QUEM SOMOS
          </Text>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: NAVY, marginBottom: 8 }}>
            Conheça a Alpha Condomínios
          </Text>
          <Divider />

          <Text style={{ fontSize: 10, color: GRAY_700, lineHeight: 1.7, marginBottom: 10 }}>
            A Alpha Condomínios nasceu com o propósito de profissionalizar e modernizar a administração
            de condomínios, combinando tecnologia, transparência e atendimento humanizado. Atuamos em
            Belo Horizonte e região metropolitana, atendendo condomínios residenciais, comerciais e mistos.
          </Text>
          <Text style={{ fontSize: 10, color: GRAY_700, lineHeight: 1.7, marginBottom: 10 }}>
            Nossa equipe é formada por especialistas em gestão condominial, contabilidade, direito
            imobiliário e tecnologia. Utilizamos sistemas de ponta para garantir controle financeiro
            rigoroso, comunicação eficiente e total conformidade legal.
          </Text>
          <Text style={{ fontSize: 10, color: GRAY_700, lineHeight: 1.7, marginBottom: 28 }}>
            Acreditamos que cada condomínio é único. Por isso, oferecemos planos flexíveis que se
            adaptam à realidade de cada empreendimento — do essencial ao premium, sempre com a mesma
            excelência.
          </Text>

          {/* Box missão */}
          <View
            style={{
              backgroundColor: NAVY,
              borderRadius: 8,
              padding: 20,
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <View style={{ marginRight: 14, marginTop: 2 }}>
              <IShield />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 6 }}>
                NOSSA MISSÃO
              </Text>
              <Text style={{ fontSize: 11, color: WHITE, lineHeight: 1.6 }}>
                Entregar gestão condominial de excelência, com transparência, tecnologia e
                compromisso com o bem-estar dos moradores.
              </Text>
            </View>
          </View>
        </View>

        <PageFooter current={quemSomosPg} total={total} />
      </Page>

      {/* ============================================================
          PÁG 3 — NOSSOS DIFERENCIAIS
          ============================================================ */}
      <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
        <PageHeader label="Por Que Nos Escolher" />

        <View style={{ paddingHorizontal: 50, paddingTop: 36 }}>
          <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>
            NOSSOS DIFERENCIAIS
          </Text>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: NAVY, marginBottom: 8 }}>
            Por Que Escolher a Alpha?
          </Text>
          <Divider />

          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 4 }}>
            <DiferencialCard
              icon={<IChart />}
              titulo="Transparência Total"
              texto="Balancetes digitais mensais e acesso em tempo real às finanças do condomínio."
            />
            <DiferencialCard
              icon={<IMonitor />}
              titulo="Tecnologia de Ponta"
              texto="Portal do condomínio, boletos digitais e aplicativo para gestão completa."
            />
            <DiferencialCard
              icon={<IPeople />}
              titulo="Atendimento Humanizado"
              texto="Equipe dedicada com suporte ágil via WhatsApp, telefone e e-mail."
            />
            <DiferencialCard
              icon={<IShield />}
              titulo="Conformidade Legal"
              texto="Cumprimento rigoroso das obrigações fiscais, trabalhistas e condominiais."
            />
            <DiferencialCard
              icon={<IMoney />}
              titulo="Redução de Custos"
              texto="Gestão estratégica e negociação qualificada com fornecedores, gerando economia real."
            />
            <DiferencialCard
              icon={<IStar />}
              titulo="Excelência Comprovada"
              texto="Mais de 25 anos de experiência com histórico consistente de resultados."
            />
          </View>
        </View>

        <PageFooter current={diferenciaisPg} total={total} />
      </Page>

      {/* ============================================================
          PÁG 4 — SERVIÇOS (apenas se incluiAdmin)
          ============================================================ */}
      {incluiAdmin && (
        <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
          <PageHeader label="Serviços" />

          <View style={{ paddingHorizontal: 50, paddingTop: 36 }}>
            <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>
              NOSSOS SERVIÇOS
            </Text>
            <Text style={{ fontSize: 22, fontWeight: "bold", color: NAVY, marginBottom: 8 }}>
              Soluções Completas
            </Text>
            <Divider />

            <ServicoRow
              titulo="Administração de Condomínios"
              descricao="Gestão completa de todas as atividades administrativas, financeiras e operacionais do condomínio, com foco em eficiência e transparência."
            />
            <ServicoRow
              titulo="Síndico Profissional"
              descricao="Profissional qualificado e dedicado exclusivamente à gestão do condomínio, garantindo cumprimento de todas as obrigações legais. Inclui Seguro de Responsabilidade Civil (RC) de Síndico."
            />
            <ServicoRow
              titulo="Certificado Digital"
              descricao="Emissão e gestão de certificados digitais para assinatura eletrônica de documentos, atas e contratos, garantindo validade jurídica e agilidade."
            />
            <ServicoRow
              titulo="Seguro Condominial"
              descricao="Contratação e gestão de apólices de seguro patrimonial, incêndio, responsabilidade civil e outros, com análise criteriosa de coberturas e custos."
            />
            <ServicoRow
              titulo="AVCB"
              descricao="Assessoria completa para obtenção e renovação do Auto de Vistoria do Corpo de Bombeiros, garantindo conformidade legal e segurança dos moradores."
            />
            <ServicoRow
              titulo="Assessoria Jurídica"
              descricao="Suporte jurídico especializado em direito condominial, com orientação em assembleias, elaboração de documentos e resolução de conflitos."
            />
            <ServicoRow
              titulo="Garantidora de Crédito"
              descricao="Intermediação com empresas garantidoras para locação de unidades, facilitando a entrada de inquilinos e reduzindo inadimplência."
            />
            <ServicoRow
              titulo="Dentre Outros"
              descricao="Soluções personalizadas conforme necessidades específicas de cada condomínio: manutenção predial, comunicação visual, automação, sustentabilidade e muito mais."
            />
          </View>

          <PageFooter current={servicosPg!} total={total} />
        </Page>
      )}

      {/* ============================================================
          PÁG 5 — PLANO ESSENCIAL
          ============================================================ */}
      {incluiAdmin && (
        <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
          <PageHeader label="Plano" />

          <View style={{ paddingHorizontal: 50, paddingTop: 36 }}>
            <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 4 }}>
              PLANO
            </Text>
            <Text style={{ fontSize: 30, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
              Essencial
            </Text>
            <Text style={{ fontSize: 10.5, color: GRAY_500, marginBottom: 20 }}>
              Gestão financeira objetiva e eficiente
            </Text>

            {/* Ideal para */}
            <View style={{ backgroundColor: GRAY_50, borderRadius: 6, padding: 14, marginBottom: 20 }}>
              <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 6 }}>
                IDEAL PARA
              </Text>
              <Text style={{ fontSize: 10, color: GRAY_700, lineHeight: 1.55 }}>
                Condomínios que buscam organização financeira com custo acessível.
              </Text>
            </View>

            <FeatureRow text="Emissão de boletos" />
            <FeatureRow text="Cobrança de inadimplentes" />
            <FeatureRow text="Balancete digital mensal" />
            <FeatureRow text="Portal do condômino" />
            <FeatureRow text="Suporte via WhatsApp" />

            {/* Preço */}
            <View
              style={{
                backgroundColor: NAVY,
                borderRadius: 8,
                padding: 20,
                marginTop: 24,
              }}
            >
              <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 8 }}>
                INVESTIMENTO MENSAL
              </Text>
              <Text style={{ fontSize: 32, fontWeight: "bold", color: WHITE, marginBottom: 4 }}>
                {essencial.totalFmt}
              </Text>
              <Text style={{ fontSize: 10, color: GOLD_LIGHT }}>
                {essencial.porUnidadeFmt} por unidade/mês
              </Text>
            </View>
          </View>

          <PageFooter current={planoEssencialPg!} total={total} />
        </Page>
      )}

      {/* ============================================================
          PÁG 6 — PLANO COMPLETO
          ============================================================ */}
      {incluiAdmin && (
        <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
          <PageHeader label="Plano" />

          <View style={{ paddingHorizontal: 50, paddingTop: 36 }}>
            {/* Badge MAIS ESCOLHIDO */}
            <View
              style={{
                alignSelf: "flex-start",
                backgroundColor: GOLD,
                borderRadius: 20,
                paddingHorizontal: 14,
                paddingVertical: 4,
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 8, fontWeight: "bold", color: NAVY, letterSpacing: 1.5 }}>
                ★ MAIS ESCOLHIDO
              </Text>
            </View>

            <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 4 }}>
              PLANO
            </Text>
            <Text style={{ fontSize: 30, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
              Completo
            </Text>
            <Text style={{ fontSize: 10.5, color: GRAY_500, marginBottom: 20 }}>
              Administração completa com gestão integrada
            </Text>

            <View style={{ backgroundColor: GRAY_50, borderRadius: 6, padding: 14, marginBottom: 20 }}>
              <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 6 }}>
                IDEAL PARA
              </Text>
              <Text style={{ fontSize: 10, color: GRAY_700, lineHeight: 1.55 }}>
                Condomínios que precisam de gestão financeira, operacional e de comunicação integradas.
              </Text>
            </View>

            <FeatureRow text="Tudo do Plano Essencial" />
            <FeatureRow text="Rateio de água e gás" />
            <FeatureRow text="Planejamento orçamentário anual" />
            <FeatureRow text="Gestão de contas a pagar" />
            <FeatureRow text="Elaboração de atas e convocações" />
            <FeatureRow text="Pagamentos online integrados" />
            <FeatureRow text="Relatórios gerenciais" />

            <View
              style={{
                backgroundColor: NAVY,
                borderRadius: 8,
                padding: 20,
                marginTop: 24,
              }}
            >
              <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 8 }}>
                INVESTIMENTO MENSAL
              </Text>
              <Text style={{ fontSize: 32, fontWeight: "bold", color: WHITE, marginBottom: 4 }}>
                {completo.totalFmt}
              </Text>
              <Text style={{ fontSize: 10, color: GOLD_LIGHT }}>
                {completo.porUnidadeFmt} por unidade/mês
              </Text>
            </View>
          </View>

          <PageFooter current={planoCompletoPg!} total={total} />
        </Page>
      )}

      {/* ============================================================
          PÁG 7 — PLANO PREMIUM
          ============================================================ */}
      {incluiAdmin && (
        <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
          <PageHeader label="Plano" />

          <View style={{ paddingHorizontal: 50, paddingTop: 36 }}>
            <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 4 }}>
              PLANO
            </Text>
            <Text style={{ fontSize: 30, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
              Premium
            </Text>
            <Text style={{ fontSize: 10.5, color: GRAY_500, marginBottom: 20 }}>
              Gestão completa com assessoria jurídica e atendimento prioritário
            </Text>

            <View style={{ backgroundColor: GRAY_50, borderRadius: 6, padding: 14, marginBottom: 20 }}>
              <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 6 }}>
                IDEAL PARA
              </Text>
              <Text style={{ fontSize: 10, color: GRAY_700, lineHeight: 1.55 }}>
                Condomínios que desejam o mais alto nível de gestão, com suporte jurídico e SLA de atendimento.
              </Text>
            </View>

            <FeatureRow text="Tudo do Plano Completo" />
            <FeatureRow text="Assessoria jurídica condominial" />
            <FeatureRow text="Cumprimento de obrigações fiscais" />
            <FeatureRow text="Gestão de obras e reformas" />
            <FeatureRow text="Revisão anual da convenção" />
            <FeatureRow text="Atendimento prioritário SLA 12h" />
            <FeatureRow text="Relatório trimestral de desempenho" />

            <View
              style={{
                backgroundColor: NAVY,
                borderRadius: 8,
                padding: 20,
                marginTop: 24,
              }}
            >
              <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 8 }}>
                INVESTIMENTO MENSAL
              </Text>
              <Text style={{ fontSize: 32, fontWeight: "bold", color: WHITE, marginBottom: 4 }}>
                {premium.totalFmt}
              </Text>
              <Text style={{ fontSize: 10, color: GOLD_LIGHT }}>
                {premium.porUnidadeFmt} por unidade/mês
              </Text>
            </View>
          </View>

          <PageFooter current={planoPremiumPg!} total={total} />
        </Page>
      )}

      {/* ============================================================
          PÁG 8 — COMPARATIVO
          ============================================================ */}
      {incluiAdmin && (
        <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
          <PageHeader label="Comparativo" />

          <View style={{ paddingHorizontal: 50, paddingTop: 28 }}>
            <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>
              COMPARATIVO DE PLANOS
            </Text>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: NAVY, marginBottom: 16 }}>
              Veja o que cada plano oferece
            </Text>

            {/* Header da tabela */}
            <View style={{ flexDirection: "row", backgroundColor: NAVY, borderRadius: 6, paddingVertical: 10, paddingHorizontal: 10, marginBottom: 2 }}>
              <Text style={{ flex: 2.2, fontSize: 8, color: WHITE, fontWeight: "bold" }}>SERVIÇO</Text>
              <Text style={{ flex: 1, fontSize: 8, color: GOLD, fontWeight: "bold", textAlign: "center" }}>ESSENCIAL</Text>
              <Text style={{ flex: 1, fontSize: 8, color: GOLD, fontWeight: "bold", textAlign: "center" }}>COMPLETO</Text>
              <Text style={{ flex: 1, fontSize: 8, color: GOLD, fontWeight: "bold", textAlign: "center" }}>PREMIUM</Text>
            </View>

            {compRows.map((row, i) => {
              if (row.category === "header") {
                return (
                  <View key={i} style={{ backgroundColor: NAVY_MID, paddingVertical: 6, paddingHorizontal: 10, marginTop: 4 }}>
                    <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 2, fontWeight: "bold" }}>
                      {row.label.toUpperCase()}
                    </Text>
                  </View>
                );
              }
              const isEven = i % 2 === 0;
              return (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    backgroundColor: isEven ? WHITE : GRAY_50,
                    paddingVertical: 7,
                    paddingHorizontal: 10,
                  }}
                >
                  <Text style={{ flex: 2.2, fontSize: 8.5, color: GRAY_700 }}>{row.label}</Text>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 10,
                      fontWeight: "bold",
                      textAlign: "center",
                      color: row.e === CHECK ? GREEN_CHECK : GRAY_500,
                    }}
                  >
                    {row.e}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 10,
                      fontWeight: "bold",
                      textAlign: "center",
                      color: row.c === CHECK ? GREEN_CHECK : GRAY_500,
                    }}
                  >
                    {row.c}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 10,
                      fontWeight: "bold",
                      textAlign: "center",
                      color: row.p === CHECK ? GREEN_CHECK : GRAY_500,
                    }}
                  >
                    {row.p}
                  </Text>
                </View>
              );
            })}

            {/* Linha de investimento */}
            <View
              style={{
                flexDirection: "row",
                backgroundColor: NAVY,
                paddingVertical: 10,
                paddingHorizontal: 10,
                marginTop: 4,
                borderRadius: 4,
              }}
            >
              <Text style={{ flex: 2.2, fontSize: 8.5, color: WHITE, fontWeight: "bold" }}>
                Investimento mensal
              </Text>
              <Text style={{ flex: 1, fontSize: 8, color: GOLD, fontWeight: "bold", textAlign: "center" }}>
                {essencial.totalFmt}
              </Text>
              <Text style={{ flex: 1, fontSize: 8, color: GOLD, fontWeight: "bold", textAlign: "center" }}>
                {completo.totalFmt}
              </Text>
              <Text style={{ flex: 1, fontSize: 8, color: GOLD, fontWeight: "bold", textAlign: "center" }}>
                {premium.totalFmt}
              </Text>
            </View>
          </View>

          <PageFooter current={comparativoPg!} total={total} />
        </Page>
      )}

      {/* ============================================================
          PÁG — SÍNDICO PROFISSIONAL
          ============================================================ */}
      {incluiSindico && (
        <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
          <PageHeader label="Serviço" />

          <View style={{ paddingHorizontal: 50, paddingTop: 36 }}>
            <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 4 }}>
              SERVIÇO
            </Text>
            <Text style={{ fontSize: 30, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
              Síndico Profissional
            </Text>
            <Text style={{ fontSize: 10.5, color: GRAY_500, marginBottom: 20 }}>
              Gestão presencial com representação legal do condomínio
            </Text>

            <View style={{ backgroundColor: GRAY_50, borderRadius: 6, padding: 14, marginBottom: 20 }}>
              <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 6 }}>
                IDEAL PARA
              </Text>
              <Text style={{ fontSize: 10, color: GRAY_700, lineHeight: 1.55 }}>
                Condomínios que desejam um síndico dedicado, com experiência em gestão condominial
                e representação legal.
              </Text>
            </View>

            <FeatureRow text="Representação legal do condomínio" />
            <FeatureRow text="Gestão de funcionários e fornecedores" />
            <FeatureRow text="Convocação e condução de assembleias" />
            <FeatureRow text="Cumprimento de obrigações trabalhistas" />
            <FeatureRow text="Fiscalização de contratos e obras" />
            <FeatureRow text="Atendimento aos condôminos" />
            <FeatureRow text="Aplicação do regimento interno" />

            {/* Box Seguro RC */}
            <View
              style={{
                backgroundColor: GRAY_50,
                borderRadius: 8,
                padding: 16,
                marginTop: 20,
                borderLeftWidth: 4,
                borderLeftColor: GOLD,
              }}
            >
              <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 6 }}>
                SEGURO RC DE SÍNDICO INCLUSO
              </Text>
              <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.6 }}>
                A Alpha Condomínios tem como diferencial no mercado o Seguro de Responsabilidade Civil (RC)
                do Síndico INCLUSO. Protegemos o síndico contra riscos inerentes à função, sem custo adicional.
              </Text>
            </View>

            {/* Preço */}
            <View
              style={{
                backgroundColor: NAVY,
                borderRadius: 8,
                padding: 20,
                marginTop: 20,
              }}
            >
              <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 8 }}>
                INVESTIMENTO MENSAL — SÍNDICO
              </Text>
              <Text style={{ fontSize: 28, fontWeight: "bold", color: WHITE, marginBottom: 4 }}>
                {sindico?.texto || "1 salário-mínimo/mês"}
              </Text>
              {numeroUnidades > 0 && (
                <Text style={{ fontSize: 9, color: GOLD_LIGHT, marginTop: 4 }}>
                  Valores calculados para {numeroUnidades} unidades. Sujeitos a ajuste conforme avaliação técnica.
                </Text>
              )}
            </View>
          </View>

          <PageFooter current={sindicoPg!} total={total} />
        </Page>
      )}

      {/* ============================================================
          PÁG — CONDIÇÕES COMERCIAIS
          ============================================================ */}
      <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
        <PageHeader label="Condições" />

        <View style={{ paddingHorizontal: 50, paddingTop: 36 }}>
          <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>
            CONDIÇÕES COMERCIAIS
          </Text>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: NAVY, marginBottom: 8 }}>
            Transparência em todos os termos
          </Text>
          <Divider />

          {/* Grid 2×3 */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 4 }}>
            {[
              {
                titulo: "Vigência",
                texto: "Contrato de 12 meses, renovável automaticamente por igual período.",
              },
              {
                titulo: "Pagamento",
                texto: "Faturamento mensal via boleto bancário, com vencimento todo dia 10.",
              },
              {
                titulo: "Reajuste",
                texto: "Reajuste anual pelo IGPM/FGV ou índice equivalente.",
              },
              {
                titulo: "Implantação",
                texto: "Prazo de implantação de até 30 dias após assinatura do contrato.",
              },
              {
                titulo: "Rescisão",
                texto: "Rescisão sem multa após período mínimo de 12 meses, com aviso prévio de 60 dias.",
              },
              {
                titulo: "Validade",
                texto: "Esta proposta tem validade de 30 dias a partir da data de emissão.",
              },
            ].map((item, i) => (
              <View
                key={i}
                style={{
                  width: "47%",
                  backgroundColor: GRAY_50,
                  borderRadius: 6,
                  padding: 16,
                  marginBottom: 12,
                  borderTopWidth: 3,
                  borderTopColor: GOLD,
                }}
              >
                <Text
                  style={{ fontSize: 10, fontWeight: "bold", color: NAVY, marginBottom: 6 }}
                >
                  {item.titulo}
                </Text>
                <Text style={{ fontSize: 9, color: GRAY_700, lineHeight: 1.6 }}>
                  {item.texto}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <PageFooter current={condicoesPg} total={total} />
      </Page>

      {/* ============================================================
          PÁG — PRÓXIMOS PASSOS
          ============================================================ */}
      <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
        <PageHeader label="Como Contratar" />

        <View style={{ paddingHorizontal: 50, paddingTop: 36 }}>
          <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>
            PRÓXIMOS PASSOS
          </Text>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: NAVY, marginBottom: 8 }}>
            Simples, rápido e sem burocracia
          </Text>
          <Divider />

          <View style={{ marginTop: 8 }}>
            <StepRow
              n={1}
              titulo="Aprovação da Proposta"
              texto="Analise esta proposta e, se aprovada, nos comunique para seguirmos com a formalização."
            />
            <StepRow
              n={2}
              titulo="Assinatura do Contrato"
              texto="Enviaremos o contrato digital para assinatura eletrônica. Rápido e seguro."
            />
            <StepRow
              n={3}
              titulo="Implantação"
              texto="Nossa equipe inicia o processo de implantação em até 30 dias, com acompanhamento dedicado."
            />
            <StepRow
              n={4}
              titulo="Gestão Ativa"
              texto="Seu condomínio passa a contar com toda a estrutura Alpha Condomínios para uma gestão de excelência."
            />
          </View>

          {/* CTA */}
          <View
            style={{
              backgroundColor: NAVY,
              borderRadius: 8,
              padding: 20,
              marginTop: 20,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 11, color: WHITE, fontWeight: "bold", marginBottom: 12, textAlign: "center" }}>
              Pronto para transformar a gestão do seu condomínio?
            </Text>
            <Text style={{ fontSize: 10, color: GOLD, marginBottom: 4 }}>
              {contato?.telefone || ""}
            </Text>
            <Text style={{ fontSize: 10, color: GOLD }}>
              {contato?.email || ""}
            </Text>
          </View>
        </View>

        <PageFooter current={passosPg} total={total} />
      </Page>

      {/* ============================================================
          PÁG — CONSIDERAÇÕES FINAIS (opcional)
          ============================================================ */}
      {consideracoesFinais?.trim() && (
        <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
          <PageHeader label="Considerações Finais" />

          <View style={{ paddingHorizontal: 50, paddingTop: 36 }}>
            <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>
              OBSERVAÇÕES
            </Text>
            <Text style={{ fontSize: 22, fontWeight: "bold", color: NAVY, marginBottom: 8 }}>
              Considerações Finais
            </Text>
            <Divider />
            <Text style={{ fontSize: 10, color: GRAY_700, lineHeight: 1.75 }}>
              {consideracoesFinais}
            </Text>
          </View>

          <PageFooter current={finalPg!} total={total} />
        </Page>
      )}

      {/* ============================================================
          PÁG — CONTRACAPA
          ============================================================ */}
      <Page size="A4" style={{ backgroundColor: NAVY }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 50 }}>
          <Image
            src={LOGO_B64}
            style={{ width: 180, height: 72, objectFit: "contain", marginBottom: 24 }}
          />
          <View style={{ height: 2, width: 60, backgroundColor: GOLD, marginBottom: 24 }} />
          <Text
            style={{
              fontSize: 14,
              color: WHITE,
              fontWeight: "bold",
              letterSpacing: 2,
              textAlign: "center",
              marginBottom: 32,
            }}
          >
            GESTÃO CONDOMINIAL DE EXCELÊNCIA
          </Text>
          <Text style={{ fontSize: 10, color: GOLD_LIGHT, marginBottom: 6, textAlign: "center" }}>
            {contato?.telefone || ""}
          </Text>
          <Text style={{ fontSize: 10, color: GOLD_LIGHT, marginBottom: 6, textAlign: "center" }}>
            {contato?.email || ""}
          </Text>
          <Text style={{ fontSize: 10, color: GOLD_LIGHT, textAlign: "center" }}>
            www.alphafacilities.com.br
          </Text>
        </View>
      </Page>

    </Document>
  );
}
