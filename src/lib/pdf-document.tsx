import {
  Document,
  Page,
  Text,
  View,
  Image,
  Svg,
  Path,
  Rect,
} from "@react-pdf/renderer";
import { calcularPlanos, formatSindico, formatBRL } from "./calculations";

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
const NAVY_MID    = "#2C3E6B";
const NAVY_DARK   = "#0F1A30";

const LOGO_URL = "/logo-alpha.png";

/* ================================================================
   SILHUETA DE PRÉDIOS
   ================================================================ */
function BuildingsSilhouette() {
  return (
    <Svg width="230" height="230" viewBox="0 0 230 230">
      <Rect x="6"   y="130" width="34" height="100" fill="#A8B8CC" opacity="0.45" />
      <Rect x="11"  y="138" width="8"  height="10"  fill="#7A8DA0" opacity="0.55" />
      <Rect x="23"  y="138" width="8"  height="10"  fill="#7A8DA0" opacity="0.40" />
      <Rect x="11"  y="153" width="8"  height="10"  fill="#7A8DA0" opacity="0.50" />
      <Rect x="23"  y="153" width="8"  height="10"  fill="#7A8DA0" opacity="0.55" />
      <Rect x="11"  y="168" width="8"  height="10"  fill="#7A8DA0" opacity="0.40" />
      <Rect x="23"  y="168" width="8"  height="10"  fill="#7A8DA0" opacity="0.50" />
      <Rect x="11"  y="183" width="8"  height="10"  fill="#7A8DA0" opacity="0.55" />
      <Rect x="23"  y="183" width="8"  height="10"  fill="#7A8DA0" opacity="0.40" />
      <Rect x="48"  y="75"  width="40" height="155" fill="#B0C0D4" opacity="0.50" />
      <Rect x="53"  y="83"  width="10" height="12"  fill="#8090A8" opacity="0.60" />
      <Rect x="67"  y="83"  width="10" height="12"  fill="#8090A8" opacity="0.45" />
      <Rect x="53"  y="100" width="10" height="12"  fill="#8090A8" opacity="0.55" />
      <Rect x="67"  y="100" width="10" height="12"  fill="#8090A8" opacity="0.60" />
      <Rect x="53"  y="117" width="10" height="12"  fill="#8090A8" opacity="0.45" />
      <Rect x="67"  y="117" width="10" height="12"  fill="#8090A8" opacity="0.55" />
      <Rect x="53"  y="134" width="10" height="12"  fill="#8090A8" opacity="0.60" />
      <Rect x="67"  y="134" width="10" height="12"  fill="#8090A8" opacity="0.45" />
      <Rect x="53"  y="151" width="10" height="12"  fill="#8090A8" opacity="0.55" />
      <Rect x="67"  y="151" width="10" height="12"  fill="#8090A8" opacity="0.60" />
      <Rect x="53"  y="168" width="10" height="12"  fill="#8090A8" opacity="0.45" />
      <Rect x="67"  y="168" width="10" height="12"  fill="#8090A8" opacity="0.55" />
      <Rect x="97"  y="45"  width="44" height="185" fill="#BBC8DA" opacity="0.50" />
      <Rect x="102" y="53"  width="11" height="13"  fill="#8A9AB0" opacity="0.60" />
      <Rect x="118" y="53"  width="11" height="13"  fill="#8A9AB0" opacity="0.45" />
      <Rect x="102" y="71"  width="11" height="13"  fill="#8A9AB0" opacity="0.55" />
      <Rect x="118" y="71"  width="11" height="13"  fill="#8A9AB0" opacity="0.60" />
      <Rect x="102" y="89"  width="11" height="13"  fill="#8A9AB0" opacity="0.45" />
      <Rect x="118" y="89"  width="11" height="13"  fill="#8A9AB0" opacity="0.55" />
      <Rect x="102" y="107" width="11" height="13"  fill="#8A9AB0" opacity="0.60" />
      <Rect x="118" y="107" width="11" height="13"  fill="#8A9AB0" opacity="0.45" />
      <Rect x="102" y="125" width="11" height="13"  fill="#8A9AB0" opacity="0.55" />
      <Rect x="118" y="125" width="11" height="13"  fill="#8A9AB0" opacity="0.60" />
      <Rect x="102" y="143" width="11" height="13"  fill="#8A9AB0" opacity="0.45" />
      <Rect x="118" y="143" width="11" height="13"  fill="#8A9AB0" opacity="0.55" />
      <Rect x="102" y="161" width="11" height="13"  fill="#8A9AB0" opacity="0.60" />
      <Rect x="118" y="161" width="11" height="13"  fill="#8A9AB0" opacity="0.45" />
      <Rect x="150" y="100" width="38" height="130" fill="#A8B8C8" opacity="0.45" />
      <Rect x="155" y="108" width="9"  height="11"  fill="#7C8EA0" opacity="0.55" />
      <Rect x="168" y="108" width="9"  height="11"  fill="#7C8EA0" opacity="0.40" />
      <Rect x="155" y="124" width="9"  height="11"  fill="#7C8EA0" opacity="0.55" />
      <Rect x="168" y="124" width="9"  height="11"  fill="#7C8EA0" opacity="0.40" />
      <Rect x="155" y="140" width="9"  height="11"  fill="#7C8EA0" opacity="0.55" />
      <Rect x="168" y="140" width="9"  height="11"  fill="#7C8EA0" opacity="0.40" />
      <Rect x="155" y="156" width="9"  height="11"  fill="#7C8EA0" opacity="0.55" />
      <Rect x="168" y="156" width="9"  height="11"  fill="#7C8EA0" opacity="0.40" />
      <Rect x="155" y="172" width="9"  height="11"  fill="#7C8EA0" opacity="0.55" />
      <Rect x="168" y="172" width="9"  height="11"  fill="#7C8EA0" opacity="0.40" />
      <Rect x="196" y="115" width="30" height="115" fill="#A0B0C4" opacity="0.40" />
      <Rect x="200" y="122" width="8"  height="10"  fill="#708090" opacity="0.50" />
      <Rect x="212" y="122" width="8"  height="10"  fill="#708090" opacity="0.40" />
      <Rect x="200" y="137" width="8"  height="10"  fill="#708090" opacity="0.50" />
      <Rect x="212" y="137" width="8"  height="10"  fill="#708090" opacity="0.40" />
      <Rect x="200" y="152" width="8"  height="10"  fill="#708090" opacity="0.50" />
      <Rect x="212" y="152" width="8"  height="10"  fill="#708090" opacity="0.40" />
      <Rect x="200" y="167" width="8"  height="10"  fill="#708090" opacity="0.50" />
      <Rect x="212" y="167" width="8"  height="10"  fill="#708090" opacity="0.40" />
      <Rect x="0" y="226" width="230" height="4" fill={NAVY_DARK} opacity="0.5" />
    </Svg>
  );
}

/* ================================================================
   HELPERS
   ================================================================ */
function PageFooter({ current, total }: { current: number; total: number }) {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
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
    <View style={{ backgroundColor: NAVY, paddingVertical: 12, paddingHorizontal: 50 }}>
      <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 3, fontWeight: "bold" }}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

function GoldDivider() {
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
          width: 16, height: 16, borderRadius: 8,
          backgroundColor: GREEN_CHECK,
          marginRight: 10, marginTop: 1,
          flexShrink: 0,
          justifyContent: "center", alignItems: "center",
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
      <View style={{ flexDirection: "row", alignItems: "flex-start", paddingVertical: 11 }}>
        <View
          style={{
            width: 4, height: 4, borderRadius: 2,
            backgroundColor: GOLD,
            marginRight: 12, marginTop: 5,
            flexShrink: 0,
          }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 10.5, fontWeight: "bold", color: NAVY, marginBottom: 3 }}>
            {titulo}
          </Text>
          <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.55 }}>
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

function StepRow({ n, titulo, texto }: { n: number; titulo: string; texto: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 22 }}>
      <View
        style={{
          width: 32, height: 32, borderRadius: 16,
          backgroundColor: GOLD,
          justifyContent: "center", alignItems: "center",
          marginRight: 16, flexShrink: 0,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "bold", color: NAVY }}>{n}</Text>
      </View>
      <View style={{ flex: 1, paddingTop: 2 }}>
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
    numero, data, cidade,
    condominio, contato,
    incluiAdmin, incluiSindico, consideracoesFinais,
  } = props;

  const nomeCondominio  = condominio?.nome      || "Condomínio";
  const numeroUnidades  = Number(condominio?.unidades) || 0;
  const bairro          = condominio?.endereco  || "";
  const nomeContato     = contato?.nome         || "";
  const numeroContrato  = numero                || "";

  const dataHoje = (data instanceof Date ? data : new Date()).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  });
  const localidade = [bairro, cidade].filter(Boolean).join(" – ");

  /* Contagem de páginas */
  let total = 1;
  total += 1;
  total += 1;
  total += 1;
  if (incluiAdmin)   total += 4;
  if (incluiSindico) total += 1;
  total += 1;
  total += 1;
  if (consideracoesFinais?.trim()) total += 1;
  total += 1;

  const planos    = calcularPlanos(numeroUnidades);
  const essencial = formatPlanoDetalhado(planos.essencial);
  const completo  = formatPlanoDetalhado(planos.completo);
  const premium   = formatPlanoDetalhado(planos.premium);

  // ── CORREÇÃO PRINCIPAL ──────────────────────────────────────────
  // formatSindico recebe PlanoSindico, não um número.
  // formatPlanoDetalhado não existe para síndico — calculamos aqui.
  const sindicoPlano      = incluiSindico ? planos.sindico : null;
  const sindicoTotalFmt   = sindicoPlano ? formatSindico(sindicoPlano) : "";
  const sindicoPorUnidade = (sindicoPlano?.tipo === "valor" && numeroUnidades > 0)
    ? formatBRL(sindicoPlano.mensal / numeroUnidades) + "/unidade"
    : "Sob consulta";
  // ───────────────────────────────────────────────────────────────

  /* Índices de página */
  let pg = 0;
  const P_CAPA         = ++pg;
  const P_QUEM         = ++pg;
  const P_DIFERENCIAIS = ++pg;
  const P_SERVICOS     = ++pg;
  let P_ESSENCIAL = 0, P_COMPLETO = 0, P_PREMIUM = 0, P_COMPARATIVO = 0;
  if (incluiAdmin) {
    P_ESSENCIAL   = ++pg;
    P_COMPLETO    = ++pg;
    P_PREMIUM     = ++pg;
    P_COMPARATIVO = ++pg;
  }
  let P_SINDICO = 0;
  if (incluiSindico) P_SINDICO = ++pg;
  const P_CONDICOES    = ++pg;
  const P_PASSOS       = ++pg;
  let P_CONSIDERACOES  = 0;
  if (consideracoesFinais?.trim()) P_CONSIDERACOES = ++pg;
  const P_CONTRA       = ++pg;

  /* ── CONTEÚDO FIXO ───────────────────────────────────────────── */
  const SERVICOS = [
    {
      titulo: "Administração de Pessoal",
      descricao: "Gestão completa de funcionários do condomínio: admissão, demissão, folha de pagamento, férias, 13º salário, FGTS e encargos trabalhistas, garantindo conformidade legal.",
    },
    {
      titulo: "Gestão Financeira",
      descricao: "Controle de receitas e despesas, emissão de boletos, prestação de contas mensal com demonstrativos detalhados, conciliação bancária e gestão do fundo de reserva.",
    },
    {
      titulo: "Assessoria Jurídica",
      descricao: "Suporte jurídico para cobranças de inadimplentes, análise de contratos, orientação em assembleias e resolução de conflitos condominiais.",
    },
    {
      titulo: "Gestão de Contratos",
      descricao: "Administração de todos os contratos de prestadores de serviços, manutenção preventiva e corretiva, garantindo qualidade e economicidade.",
    },
    {
      titulo: "Assembleias e Reuniões",
      descricao: "Organização, convocação e condução de assembleias ordinárias e extraordinárias, elaboração de atas e acompanhamento das deliberações.",
    },
    {
      titulo: "Atendimento e Comunicação",
      descricao: "Canal de atendimento dedicado a condôminos e funcionários, comunicados, circulares e suporte em plataforma digital.",
    },
    {
      titulo: "Relatórios e Transparência",
      descricao: "Relatórios mensais completos com balancete, extrato de movimentações, inadimplência e previsão orçamentária disponíveis em portal exclusivo.",
    },
    {
      titulo: "Suporte em Vistorias",
      descricao: "Acompanhamento de vistorias técnicas, levantamento de necessidades de manutenção e suporte na gestão de obras e reformas nas áreas comuns.",
    },
  ];

  const ESSENCIAL_FEATURES = [
    "Gestão financeira completa",
    "Emissão e controle de boletos",
    "Prestação de contas mensal",
    "Gestão de inadimplência",
    "Assembleias ordinárias",
    "Atendimento em horário comercial",
    "Relatórios mensais básicos",
    "Portal do condômino",
  ];

  const COMPLETO_FEATURES = [
    ...ESSENCIAL_FEATURES,
    "Administração de pessoal",
    "Gestão de contratos de terceiros",
    "Assessoria jurídica básica",
    "Assembleias extraordinárias inclusas",
    "Relatórios gerenciais avançados",
    "Atendimento estendido",
  ];

  const PREMIUM_FEATURES = [
    ...COMPLETO_FEATURES,
    "Assessoria jurídica completa",
    "Gestor de contas exclusivo",
    "Vistorias técnicas periódicas",
    "Consultoria em obras e reformas",
    "Atendimento 24h emergências",
    "Dashboard financeiro em tempo real",
    "Planejamento orçamentário anual",
  ];

  const COMPARATIVO_ROWS = [
    {
      categoria: "FINANCEIRO", itens: [
        { item: "Gestão financeira completa",  e: true,  c: true,  p: true  },
        { item: "Emissão de boletos",           e: true,  c: true,  p: true  },
        { item: "Prestação de contas mensal",   e: true,  c: true,  p: true  },
        { item: "Dashboard em tempo real",      e: false, c: false, p: true  },
      ],
    },
    {
      categoria: "OPERACIONAL", itens: [
        { item: "Administração de pessoal",     e: false, c: true,  p: true  },
        { item: "Gestão de contratos",          e: false, c: true,  p: true  },
        { item: "Assembleias extraordinárias",  e: false, c: true,  p: true  },
        { item: "Vistorias técnicas",           e: false, c: false, p: true  },
      ],
    },
    {
      categoria: "PREMIUM", itens: [
        { item: "Assessoria jurídica completa", e: false, c: false, p: true  },
        { item: "Gestor exclusivo",             e: false, c: false, p: true  },
        { item: "Atendimento 24h emergências",  e: false, c: false, p: true  },
        { item: "Consultoria em obras",         e: false, c: false, p: true  },
      ],
    },
  ];

  /* ================================================================
     CAPA — pág 1
     ================================================================ */
  const PageCapa = () => (
    <Page size="A4" style={{ flexDirection: "row", backgroundColor: WHITE }}>
      <View style={{ width: "52%", backgroundColor: WHITE, padding: 48, justifyContent: "space-between" }}>
        <View>
          <Image
            src={LOGO_URL}
            style={{ width: 160, height: 80, objectFit: "contain", marginBottom: 48 }}
          />
          <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 3, fontWeight: "bold", marginBottom: 12 }}>
            PROPOSTA COMERCIAL
          </Text>
          <View style={{ height: 3, width: 44, backgroundColor: GOLD, marginBottom: 20 }} />
          <Text style={{ fontSize: 22, fontWeight: "bold", color: NAVY, marginBottom: 8, lineHeight: 1.2 }}>
            {nomeCondominio}
          </Text>
          {localidade ? (
            <Text style={{ fontSize: 10, color: GRAY_500, marginBottom: 6 }}>{localidade}</Text>
          ) : null}
          <Text style={{ fontSize: 10, color: GRAY_500, marginBottom: 32 }}>
            {numeroUnidades} unidades
          </Text>
          <View style={{ backgroundColor: GRAY_50, borderRadius: 6, padding: 16 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
              <Text style={{ fontSize: 8.5, color: GRAY_500 }}>Proposta nº</Text>
              <Text style={{ fontSize: 8.5, fontWeight: "bold", color: NAVY }}>{numeroContrato}</Text>
            </View>
            <View style={{ height: 0.5, backgroundColor: GRAY_200, marginBottom: 8 }} />
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
              <Text style={{ fontSize: 8.5, color: GRAY_500 }}>Data</Text>
              <Text style={{ fontSize: 8.5, color: NAVY }}>{dataHoje}</Text>
            </View>
            <View style={{ height: 0.5, backgroundColor: GRAY_200, marginBottom: 8 }} />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 8.5, color: GRAY_500 }}>Responsável</Text>
              <Text style={{ fontSize: 8.5, color: NAVY }}>{nomeContato || "—"}</Text>
            </View>
          </View>
        </View>
        <View>
          <View style={{ height: 0.5, backgroundColor: GRAY_200, marginBottom: 14 }} />
          <Text style={{ fontSize: 8, color: GRAY_500, marginBottom: 4 }}>
            📞  {contato?.telefone || "(11) 99999-9999"}
          </Text>
          <Text style={{ fontSize: 8, color: GRAY_500, marginBottom: 4 }}>
            ✉   {contato?.email || "contato@alphacondominios.com.br"}
          </Text>
          <Text style={{ fontSize: 8, color: GRAY_500 }}>
            🌐  www.alphacondominios.com.br
          </Text>
        </View>
      </View>
      <View
        style={{
          width: "48%",
          backgroundColor: NAVY,
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 0,
          overflow: "hidden",
        }}
      >
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: GOLD }} />
        <View style={{ position: "absolute", top: 60, right: 24, alignItems: "flex-end" }}>
          <Text style={{ fontSize: 7, color: GOLD_LIGHT, letterSpacing: 2, opacity: 0.6 }}>
            GESTÃO · TRANSPARÊNCIA · CONFIANÇA
          </Text>
        </View>
        <BuildingsSilhouette />
      </View>
    </Page>
  );

  /* ================================================================
     QUEM SOMOS — pág 2
     ================================================================ */
  const PageQuemSomos = () => (
    <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
      <PageHeader label="Sobre Nós" />
      <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
        <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 8 }}>
          QUEM SOMOS
        </Text>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: NAVY, marginBottom: 8 }}>
          Especialistas em Gestão Condominial
        </Text>
        <GoldDivider />
        <Text style={{ fontSize: 10, color: GRAY_700, lineHeight: 1.7, marginBottom: 10 }}>
          A Alpha Condomínios é uma administradora especializada na gestão de condomínios residenciais
          e comerciais, fundada com o propósito de transformar a experiência de morar e conviver em
          ambientes coletivos.
        </Text>
        <Text style={{ fontSize: 10, color: GRAY_700, lineHeight: 1.7, marginBottom: 10 }}>
          Nossa equipe é formada por profissionais experientes nas áreas de administração, direito
          condominial, contabilidade e tecnologia, prontos para oferecer soluções completas e
          personalizadas para cada condomínio.
        </Text>
        <Text style={{ fontSize: 10, color: GRAY_700, lineHeight: 1.7, marginBottom: 24 }}>
          Trabalhamos com total transparência, entregando relatórios detalhados, comunicação ágil
          e atendimento humanizado — porque cada condomínio tem sua própria identidade e merece
          uma gestão à altura.
        </Text>
        <View style={{ backgroundColor: NAVY, borderRadius: 8, padding: 22, marginBottom: 24 }}>
          <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 8 }}>
            NOSSA MISSÃO
          </Text>
          <Text style={{ fontSize: 11, color: WHITE, lineHeight: 1.65 }}>
            Proporcionar tranquilidade, segurança e valorização patrimonial aos condôminos por meio
            de uma gestão eficiente, transparente e focada em resultados.
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {[
            { num: "10+",  label: "Anos de experiência" },
            { num: "200+", label: "Condomínios atendidos" },
            { num: "98%",  label: "Índice de satisfação" },
          ].map((item) => (
            <View
              key={item.label}
              style={{
                width: "31%",
                backgroundColor: GRAY_50,
                borderRadius: 6,
                padding: 14,
                alignItems: "center",
                borderTopWidth: 3,
                borderTopColor: GOLD,
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: "bold", color: NAVY, marginBottom: 4 }}>
                {item.num}
              </Text>
              <Text style={{ fontSize: 8.5, color: GRAY_500, textAlign: "center" }}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <PageFooter current={P_QUEM} total={total} />
    </Page>
  );

  /* ================================================================
     DIFERENCIAIS — pág 3
     ================================================================ */
  const PageDiferenciais = () => (
    <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
      <PageHeader label="Por Que Nos Escolher" />
      <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
        <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 8 }}>
          NOSSOS DIFERENCIAIS
        </Text>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: NAVY, marginBottom: 8 }}>
          O que nos torna a melhor escolha
        </Text>
        <GoldDivider />
        <Text style={{ fontSize: 10, color: GRAY_500, marginBottom: 24, lineHeight: 1.5 }}>
          Combinamos tecnologia, experiência e atendimento personalizado para oferecer
          a gestão condominial mais completa do mercado.
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
          {[
            { icon: <IChart />,   titulo: "Gestão Financeira Transparente", texto: "Prestação de contas mensais detalhadas com acesso em tempo real pelo portal do condômino." },
            { icon: <IMonitor />, titulo: "Tecnologia de Ponta",            texto: "Plataforma digital completa para comunicados, votações, reservas e acompanhamento financeiro." },
            { icon: <IPeople />,  titulo: "Equipe Especializada",           texto: "Profissionais certificados em direito condominial, contabilidade e gestão de pessoas." },
            { icon: <IShield />,  titulo: "Segurança Jurídica",             texto: "Assessoria jurídica dedicada para proteção legal do condomínio em todas as situações." },
            { icon: <IMoney />,   titulo: "Redução de Custos",              texto: "Negociação estratégica com fornecedores e controle rigoroso de despesas para economia real." },
            { icon: <IStar />,    titulo: "Atendimento Premium",            texto: "Canal de atendimento dedicado com resposta ágil e acompanhamento personalizado de cada demanda." },
          ].map((d) => (
            <DiferencialCard key={d.titulo} icon={d.icon} titulo={d.titulo} texto={d.texto} />
          ))}
        </View>
      </View>
      <PageFooter current={P_DIFERENCIAIS} total={total} />
    </Page>
  );

  /* ================================================================
     SERVIÇOS — pág 4
     ================================================================ */
  const PageServicos = () => (
    <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
      <PageHeader label="Soluções Completas" />
      <View style={{ paddingHorizontal: 50, paddingTop: 28 }}>
        <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 8 }}>
          NOSSOS SERVIÇOS
        </Text>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: NAVY, marginBottom: 8 }}>
          Tudo que seu condomínio precisa
        </Text>
        <GoldDivider />
        <Text style={{ fontSize: 10, color: GRAY_500, marginBottom: 16, lineHeight: 1.5 }}>
          Oferecemos um portfólio completo de serviços para garantir a gestão eficiente
          e tranquila do seu condomínio.
        </Text>
        <SectionRule />
        {SERVICOS.map((s) => (
          <ServicoRow key={s.titulo} titulo={s.titulo} descricao={s.descricao} />
        ))}
      </View>
      <PageFooter current={P_SERVICOS} total={total} />
    </Page>
  );

  /* ================================================================
     PLANO — helper reutilizável
     ================================================================ */
  function PagePlano({
    pg: pgNum,
    badge,
    nome,
    subtitulo,
    idealPara,
    features,
    totalFmt,
    porUnidadeFmt,
    destaque = false,
  }: {
    pg: number;
    badge: string;
    nome: string;
    subtitulo: string;
    idealPara: string;
    features: string[];
    totalFmt: string;
    porUnidadeFmt: string;
    destaque?: boolean;
  }) {
    return (
      <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
        <PageHeader label="Planos e Investimento" />
        <View style={{ paddingHorizontal: 50, paddingTop: 28 }}>
          {destaque && (
            <View
              style={{
                backgroundColor: GOLD,
                borderRadius: 20,
                paddingHorizontal: 14,
                paddingVertical: 4,
                alignSelf: "flex-start",
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 7.5, fontWeight: "bold", color: NAVY, letterSpacing: 1.5 }}>
                ★  MAIS ESCOLHIDO
              </Text>
            </View>
          )}
          <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>
            {badge}
          </Text>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
            {nome}
          </Text>
          <GoldDivider />
          <Text style={{ fontSize: 10, color: GRAY_500, marginBottom: 16, lineHeight: 1.5 }}>
            {subtitulo}
          </Text>
          <View
            style={{
              backgroundColor: GRAY_50,
              borderRadius: 6,
              paddingHorizontal: 14,
              paddingVertical: 10,
              marginBottom: 20,
              borderLeftWidth: 3,
              borderLeftColor: GOLD,
            }}
          >
            <Text style={{ fontSize: 8, color: GOLD, fontWeight: "bold", letterSpacing: 1.5, marginBottom: 4 }}>
              IDEAL PARA
            </Text>
            <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.5 }}>{idealPara}</Text>
          </View>
          <Text style={{ fontSize: 8.5, fontWeight: "bold", color: NAVY, marginBottom: 10, letterSpacing: 0.5 }}>
            O QUE ESTÁ INCLUÍDO
          </Text>
          {features.map((f) => (
            <FeatureRow key={f} text={f} />
          ))}
          <View style={{ backgroundColor: NAVY, borderRadius: 8, padding: 20, marginTop: 16 }}>
            <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, marginBottom: 8 }}>
              INVESTIMENTO MENSAL
            </Text>
            <Text style={{ fontSize: 32, fontWeight: "bold", color: WHITE, marginBottom: 4 }}>
              {totalFmt}
            </Text>
            <Text style={{ fontSize: 9.5, color: GOLD_LIGHT }}>
              {porUnidadeFmt} por unidade/mês
            </Text>
          </View>
        </View>
        <PageFooter current={pgNum} total={total} />
      </Page>
    );
  }

  /* ================================================================
     COMPARATIVO
     ================================================================ */
  const PageComparativo = () => (
    <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
      <PageHeader label="Comparativo de Planos" />
      <View style={{ paddingHorizontal: 50, paddingTop: 28 }}>
        <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 8 }}>
          COMPARATIVO
        </Text>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: NAVY, marginBottom: 8 }}>
          Escolha o plano ideal
        </Text>
        <GoldDivider />
        <View style={{ flexDirection: "row", backgroundColor: NAVY, borderRadius: 6, padding: 10, marginBottom: 0 }}>
          <Text style={{ flex: 2.5, fontSize: 8.5, fontWeight: "bold", color: WHITE }}>Recurso</Text>
          <Text style={{ flex: 1, fontSize: 8.5, fontWeight: "bold", color: GOLD, textAlign: "center" }}>Essencial</Text>
          <Text style={{ flex: 1, fontSize: 8.5, fontWeight: "bold", color: GOLD, textAlign: "center" }}>Completo</Text>
          <Text style={{ flex: 1, fontSize: 8.5, fontWeight: "bold", color: GOLD, textAlign: "center" }}>Premium</Text>
        </View>
        {COMPARATIVO_ROWS.map((cat) => (
          <View key={cat.categoria}>
            <View style={{ backgroundColor: GRAY_50, paddingHorizontal: 10, paddingVertical: 5 }}>
              <Text style={{ fontSize: 7.5, fontWeight: "bold", color: NAVY, letterSpacing: 1.5 }}>
                {cat.categoria}
              </Text>
            </View>
            {cat.itens.map((row, i) => (
              <View
                key={row.item}
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 10,
                  paddingVertical: 7,
                  backgroundColor: i % 2 === 0 ? WHITE : GRAY_50,
                  alignItems: "center",
                }}
              >
                <Text style={{ flex: 2.5, fontSize: 9, color: GRAY_700 }}>{row.item}</Text>
                <Text style={{ flex: 1, fontSize: 11, textAlign: "center", color: row.e ? GREEN_CHECK : GRAY_500, fontWeight: row.e ? "bold" : "normal" }}>
                  {row.e ? "✓" : "—"}
                </Text>
                <Text style={{ flex: 1, fontSize: 11, textAlign: "center", color: row.c ? GREEN_CHECK : GRAY_500, fontWeight: row.c ? "bold" : "normal" }}>
                  {row.c ? "✓" : "—"}
                </Text>
                <Text style={{ flex: 1, fontSize: 11, textAlign: "center", color: row.p ? GREEN_CHECK : GRAY_500, fontWeight: row.p ? "bold" : "normal" }}>
                  {row.p ? "✓" : "—"}
                </Text>
              </View>
            ))}
          </View>
        ))}
        <View style={{ backgroundColor: NAVY, borderRadius: 6, padding: 10, marginTop: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ flex: 2.5, fontSize: 9, fontWeight: "bold", color: WHITE }}>
              Investimento mensal
            </Text>
            <Text style={{ flex: 1, fontSize: 8.5, color: GOLD, textAlign: "center" }}>{essencial.totalFmt}</Text>
            <Text style={{ flex: 1, fontSize: 8.5, color: GOLD, textAlign: "center" }}>{completo.totalFmt}</Text>
            <Text style={{ flex: 1, fontSize: 8.5, color: GOLD, textAlign: "center" }}>{premium.totalFmt}</Text>
          </View>
        </View>
      </View>
      <PageFooter current={P_COMPARATIVO} total={total} />
    </Page>
  );

  /* ================================================================
     SÍNDICO PROFISSIONAL
     ================================================================ */
  const PageSindico = () => (
    <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
      <PageHeader label="Serviço Adicional" />
      <View style={{ paddingHorizontal: 50, paddingTop: 28 }}>
        <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>
          SÍNDICO PROFISSIONAL
        </Text>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
          Gestão com Responsabilidade Total
        </Text>
        <GoldDivider />
        <Text style={{ fontSize: 10, color: GRAY_500, marginBottom: 20, lineHeight: 1.5 }}>
          Assuma a tranquilidade de ter um síndico profissional dedicado ao seu condomínio,
          com experiência comprovada e total responsabilidade pela gestão.
        </Text>
        {[
          "Representação legal do condomínio",
          "Presidência de assembleias e reuniões",
          "Gestão direta de funcionários e fornecedores",
          "Atendimento presencial periódico no condomínio",
          "Resolução de conflitos entre condôminos",
          "Acompanhamento de obras e manutenções",
          "Relatórios executivos mensais ao conselho",
          "Disponibilidade para emergências",
        ].map((f) => (
          <FeatureRow key={f} text={f} />
        ))}
        <View
          style={{
            backgroundColor: GRAY_50,
            borderRadius: 8,
            padding: 16,
            marginTop: 16,
            marginBottom: 8,
            borderLeftWidth: 3,
            borderLeftColor: GOLD,
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          <IShield />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontSize: 9.5, fontWeight: "bold", color: NAVY, marginBottom: 4 }}>
              Seguro de Responsabilidade Civil Incluso
            </Text>
            <Text style={{ fontSize: 9, color: GRAY_700, lineHeight: 1.5 }}>
              Proteção completa ao síndico profissional e ao condomínio contra eventuais
              reclamações decorrentes do exercício da função.
            </Text>
          </View>
        </View>
        {/* ── CORREÇÃO: usa sindicoTotalFmt e sindicoPorUnidade ── */}
        <View style={{ backgroundColor: NAVY, borderRadius: 8, padding: 20, marginTop: 8 }}>
          <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, marginBottom: 8 }}>
            INVESTIMENTO MENSAL
          </Text>
          <Text style={{ fontSize: 32, fontWeight: "bold", color: WHITE, marginBottom: 4 }}>
            {sindicoTotalFmt}
          </Text>
          <Text style={{ fontSize: 9.5, color: GOLD_LIGHT }}>
            {sindicoPorUnidade} por unidade/mês
          </Text>
        </View>
      </View>
      <PageFooter current={P_SINDICO} total={total} />
    </Page>
  );

  /* ================================================================
     CONDIÇÕES GERAIS
     ================================================================ */
  const PageCondicoes = () => (
    <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
      <PageHeader label="Condições Gerais" />
      <View style={{ paddingHorizontal: 50, paddingTop: 28 }}>
        <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 8 }}>
          INFORMAÇÕES IMPORTANTES
        </Text>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: NAVY, marginBottom: 8 }}>
          Condições da Proposta
        </Text>
        <GoldDivider />
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
          {[
            {
              titulo: "Vigência da Proposta",
              texto: "Esta proposta é válida por 30 dias a partir da data de emissão. Após este prazo, os valores poderão ser revisados conforme condições de mercado.",
            },
            {
              titulo: "Contrato de Prestação",
              texto: "O contrato tem vigência mínima de 12 meses, com renovação automática e rescisão mediante aviso prévio de 30 dias.",
            },
            {
              titulo: "Reajuste Anual",
              texto: "Os honorários são reajustados anualmente pelo IGPM ou índice acordado entre as partes, sempre com comunicação prévia.",
            },
            {
              titulo: "Forma de Pagamento",
              texto: "Pagamento mensal via boleto bancário, com vencimento no 5º dia útil. Aceita débito automático mediante solicitação.",
            },
            {
              titulo: "Serviços Não Incluídos",
              texto: "Despesas com cartório, taxas governamentais, honorários advocatícios litigiosos e perícias técnicas são cobrados à parte.",
            },
            {
              titulo: "Transição e Onboarding",
              texto: "Oferecemos suporte completo na transição da administração anterior, sem custo adicional, com prazo de até 60 dias.",
            },
          ].map((c) => (
            <View
              key={c.titulo}
              style={{
                width: "47%",
                backgroundColor: GRAY_50,
                borderRadius: 6,
                padding: 14,
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 9.5, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
                {c.titulo}
              </Text>
              <Text style={{ fontSize: 8.5, color: GRAY_700, lineHeight: 1.55 }}>{c.texto}</Text>
            </View>
          ))}
        </View>
      </View>
      <PageFooter current={P_CONDICOES} total={total} />
    </Page>
  );

  /* ================================================================
     PRÓXIMOS PASSOS
     ================================================================ */
  const PagePassos = () => (
    <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
      <PageHeader label="Próximos Passos" />
      <View style={{ paddingHorizontal: 50, paddingTop: 28 }}>
        <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 8 }}>
          COMO COMEÇAR
        </Text>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: NAVY, marginBottom: 8 }}>
          Seu condomínio em boas mãos em 4 etapas
        </Text>
        <GoldDivider />
        <Text style={{ fontSize: 10, color: GRAY_500, marginBottom: 24, lineHeight: 1.5 }}>
          Processo simples, rápido e sem burocracia para você ter a melhor gestão condominial.
        </Text>
        <StepRow
          n={1}
          titulo="Aprovação da Proposta"
          texto="Confirme sua escolha de plano e assine digitalmente o contrato de prestação de serviços. Todo o processo é 100% digital."
        />
        <StepRow
          n={2}
          titulo="Reunião de Onboarding"
          texto="Agendamos uma reunião com síndico e conselho para mapear todas as necessidades, rotinas e particularidades do condomínio."
        />
        <StepRow
          n={3}
          titulo="Transição e Implantação"
          texto="Nossa equipe cuida de toda a transição: documentos, contratos, funcionários e financeiro, com acompanhamento dedicado por 60 dias."
        />
        <StepRow
          n={4}
          titulo="Gestão em Pleno Funcionamento"
          texto="Com tudo implantado, você passa a contar com relatórios mensais, portal do condômino ativo e atendimento contínuo da nossa equipe."
        />
        <View
          style={{
            backgroundColor: NAVY,
            borderRadius: 8,
            padding: 22,
            marginTop: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 9, color: GOLD, letterSpacing: 1.5, marginBottom: 8 }}>
            FALE CONOSCO AGORA
          </Text>
          <Text style={{ fontSize: 13, fontWeight: "bold", color: WHITE, marginBottom: 6 }}>
            Vamos cuidar do seu condomínio juntos
          </Text>
          <Text style={{ fontSize: 9.5, color: GOLD_LIGHT, marginBottom: 4 }}>
            📞 {contato?.telefone || "(11) 99999-9999"}
          </Text>
          <Text style={{ fontSize: 9.5, color: GOLD_LIGHT }}>
            ✉  {contato?.email || "contato@alphacondominios.com.br"}
          </Text>
        </View>
      </View>
      <PageFooter current={P_PASSOS} total={total} />
    </Page>
  );

  /* ================================================================
     CONSIDERAÇÕES FINAIS
     ================================================================ */
  const PageConsideracoesFinais = () => {
    if (!consideracoesFinais?.trim()) return null;
    return (
      <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
        <PageHeader label="Considerações Finais" />
        <View style={{ paddingHorizontal: 50, paddingTop: 28 }}>
          <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 8 }}>
            OBSERVAÇÕES
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: NAVY, marginBottom: 8 }}>
            Considerações Finais
          </Text>
          <GoldDivider />
          <View
            style={{
              backgroundColor: GRAY_50,
              borderRadius: 8,
              padding: 22,
              borderLeftWidth: 3,
              borderLeftColor: GOLD,
            }}
          >
            <Text style={{ fontSize: 10, color: GRAY_700, lineHeight: 1.75 }}>
              {consideracoesFinais}
            </Text>
          </View>
        </View>
        <PageFooter current={P_CONSIDERACOES} total={total} />
      </Page>
    );
  };

  /* ================================================================
     CONTRACAPA
     ================================================================ */
  const PageContracapa = () => (
    <Page size="A4" style={{ backgroundColor: NAVY }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 60 }}>
        <Image
          src={LOGO_URL}
          style={{ width: 160, height: 80, objectFit: "contain", marginBottom: 32 }}
        />
        <View style={{ height: 2, width: 60, backgroundColor: GOLD, marginBottom: 24 }} />
        <Text
          style={{
            fontSize: 11,
            color: GOLD_LIGHT,
            letterSpacing: 2,
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          GESTÃO · TRANSPARÊNCIA · CONFIANÇA
        </Text>
        <Text style={{ fontSize: 9.5, color: GRAY_500, textAlign: "center", marginBottom: 32 }}>
          www.alphacondominios.com.br
        </Text>
        <Text style={{ fontSize: 8.5, color: GRAY_700, textAlign: "center", lineHeight: 1.7 }}>
          {contato?.telefone || "(11) 99999-9999"}  ·  {contato?.email || "contato@alphacondominios.com.br"}
        </Text>
      </View>
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 6, backgroundColor: GOLD }} />
    </Page>
  );

  /* ================================================================
     RENDER FINAL
     ================================================================ */
  return (
    <Document>
      <PageCapa />
      <PageQuemSomos />
      <PageDiferenciais />
      <PageServicos />
      {incluiAdmin && (
        <>
          <PagePlano
            pg={P_ESSENCIAL}
            badge="PLANO ESSENCIAL"
            nome="Essencial"
            subtitulo="A base sólida para uma gestão organizada, transparente e sem complicações."
            idealPara="Condomínios que buscam organização financeira e administrativa com custo acessível."
            features={ESSENCIAL_FEATURES}
            totalFmt={essencial.totalFmt}
            porUnidadeFmt={essencial.porUnidadeFmt}
          />
          <PagePlano
            pg={P_COMPLETO}
            badge="PLANO COMPLETO"
            nome="Completo"
            subtitulo="Gestão completa com suporte jurídico e administração de pessoal incluídos."
            idealPara="Condomínios que precisam de gestão integrada com mais recursos e suporte ampliado."
            features={COMPLETO_FEATURES}
            totalFmt={completo.totalFmt}
            porUnidadeFmt={completo.porUnidadeFmt}
            destaque
          />
          <PagePlano
            pg={P_PREMIUM}
            badge="PLANO PREMIUM"
            nome="Premium"
            subtitulo="Solução executiva completa com gestor exclusivo e atendimento 24h."
            idealPara="Condomínios que exigem o mais alto nível de gestão, com presença e dedicação total."
            features={PREMIUM_FEATURES}
            totalFmt={premium.totalFmt}
            porUnidadeFmt={premium.porUnidadeFmt}
          />
          <PageComparativo />
        </>
      )}
      {incluiSindico && <PageSindico />}
      <PageCondicoes />
      <PagePassos />
      {consideracoesFinais?.trim() ? <PageConsideracoesFinais /> : null}
      <PageContracapa />
    </Document>
  );
}
